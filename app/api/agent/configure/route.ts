import { NextRequest, NextResponse } from "next/server";
import {GoogleGenAI, ThinkingLevel} from '@google/genai'
import { AgentConfigSystemPrompt } from "@/data/Prompt";
import { AgentConfigRespSchema } from "@/data/ResponseSchema";
import { AgentConfig, AgentRun, db, tools } from "@/db";
import { currentUser } from "@clerk/nextjs/server";
import { and, desc, eq } from "drizzle-orm";
import { calculateNextDailyRun } from "@/lib/agent-schedule";

export async function POST(req:NextRequest){
    const {prompt, timezone} = await req.json();
    const user = await currentUser();
    const userEmail = user?.primaryEmailAddress?.emailAddress;
    if(!userEmail){
        return NextResponse.json({error:'User email is required'},{status:400})
    }
    if(!prompt.trim()){
        return NextResponse.json({error:'Prompt is required'},{status:400})
    }

    const apiKey = process.env.GOOGLE_CLOUD_GEMINI_API_KEY;
    try {

        const aiTools = await db.select({
            slug: tools.slug
        }).from(tools);

        const availableSlugs = aiTools.map(t => t.slug).filter(Boolean);
        const availableToolsStr = availableSlugs.length > 0
            ? availableSlugs.join(', ')
            : 'gmail, github, slack, hubspot, notion, googlecalendar, trello, discord, linear, jira';

        const ai = new GoogleGenAI({apiKey});

        const promptContent = AgentConfigSystemPrompt
            .replace('{USER_PROMPT}', prompt)
            .replace('{AVAILABLE_TOOLS}', availableToolsStr + "\n(Note: browser research is a built-in capability. Do NOT output 'browserbase' or 'web_search' in the tools array)");

        // Try candidate models with automatic retry on 503 spikes in demand
        const candidateModels = [
            'gemini-3.6-flash',

        ];
        let response: any = null;
        let lastError: any = null;

        for (const modelName of candidateModels) {
            for (let attempt = 1; attempt <= 2; attempt++) {
                try {
                    response = await ai.models.generateContent({
                        model: modelName,
                        contents: promptContent,
                        config: {
                            thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
                            responseMimeType: 'application/json',
                            responseSchema: AgentConfigRespSchema
                        }
                    });
                    if (response && response.text) break;
                } catch (err: any) {
                    console.warn(`Model ${modelName} (attempt ${attempt}) failed (code: ${err?.status || err?.code}): ${err?.message || err}`);
                    lastError = err;
                    const is503 = err?.status === 503 || err?.code === 503 || String(err).includes('503');
                    if (is503 && attempt === 1) {
                        // High demand spike - wait 1.2s before retry
                        await new Promise((r) => setTimeout(r, 1200));
                    } else {
                        break;
                    }
                }
            }
            if (response && response.text) break;
        }

        if (!response || !response.text) {
            throw lastError || new Error("Failed to generate agent configuration with all candidate models.");
        }

        // Parse and sanitize final agent config
        const aiOutput = JSON.parse(response.text ?? '{}');

        // Sanitize tools: remove built-in or non-composio slugs like browserbase or web_search
        if (aiOutput?.config?.tools && Array.isArray(aiOutput.config.tools)) {
            const nonComposio = new Set(['browserbase', 'web_search', 'browser_research', 'websearch']);
            aiOutput.config.tools = aiOutput.config.tools.filter(
                (slug: string) => typeof slug === 'string' && !nonComposio.has(slug.toLowerCase().trim())
            );
        }

        if(aiOutput.status=='ready'){
            const agentId = crypto.randomUUID()
            const dbResult = await db.insert(AgentConfig).values({
                ...aiOutput.config,
                agentImage:'https://api.dicebear.com/10.x/bottts/svg?seed='+agentId,
                agentId:agentId,
                userEmail,
                schedule:{
                 time:aiOutput?.config?.schedule?.time,
                 type:aiOutput?.config?.schedule?.type,
                 frequency:aiOutput?.config?.schedule?.frequency,
                 timezone: timezone || 'UTC'
                }
             }).returning();

             // Generate the first run only after the agent has been saved.
             const schedule = aiOutput?.config?.schedule
             const safeTimezone = timezone || 'UTC'
             const firstRun = schedule?.type === 'recurring' && schedule?.frequency?.toLowerCase() === 'daily' && schedule?.time
                 ? calculateNextDailyRun({
                     time: schedule.time,
                     timezone: safeTimezone,
                 })
                 : null

             if (firstRun) {
                 await db.insert(AgentRun).values({
                     agentId,
                     userEmail,
                     scheduledFor: firstRun,
                     timezone: safeTimezone,
                     status: 'scheduled',
                 }).returning()
             }

             return NextResponse.json({...dbResult[0],status_:'ready'});
         }

         return NextResponse.json(JSON.parse(response.text??'{}'));
     } catch (e) {
         console.error('Error in POST /api/agent/configure:', e);
         return NextResponse.json({error:e},{status:500})
     }
 }

export async function PUT(req:NextRequest){
    const agentConfig = await req.json()
    
   try {
     if (!agentConfig?.agentId) {
       return NextResponse.json({ error: 'Agent ID is required' }, { status: 400 });
     }

     const user = await currentUser();

     // Build update object with only valid, mutable AgentConfig columns (avoid PK id, createdAt string type error, or client extra properties)
     const updateFields: Record<string, any> = {};
     if (agentConfig.name !== undefined) updateFields.name = agentConfig.name;
     if (agentConfig.agentImage !== undefined) updateFields.agentImage = agentConfig.agentImage;
     if (agentConfig.description !== undefined) updateFields.description = agentConfig.description;
     if (agentConfig.instructions !== undefined) updateFields.instructions = agentConfig.instructions;
     if (agentConfig.objective !== undefined) updateFields.objective = agentConfig.objective;
     if (agentConfig.tools !== undefined) updateFields.tools = agentConfig.tools;
     if (agentConfig.skills !== undefined) updateFields.skills = agentConfig.skills;
     if (agentConfig.schedule !== undefined) updateFields.schedule = agentConfig.schedule;
     if (agentConfig.outputFormat !== undefined) updateFields.outputFormat = agentConfig.outputFormat;
     if (agentConfig.status !== undefined) updateFields.status = agentConfig.status;
     if (agentConfig.composioSessionId !== undefined) updateFields.composioSessionId = agentConfig.composioSessionId;

     const result = await db.update(AgentConfig).set(updateFields)
       .where(eq(AgentConfig.agentId, agentConfig.agentId))
       .returning();

     // update agent run - delete pending scheduled runs
     await db.delete(AgentRun)
       .where(and(eq(AgentRun.agentId, agentConfig.agentId), eq(AgentRun.status, 'scheduled')));

     // schedule next run only if active and recurring daily with valid time
     const schedule = agentConfig?.schedule;
     const timezone = schedule?.timezone || agentConfig?.timezone || agentConfig?.timeZone || 'UTC';

     if (
       agentConfig?.status === 'active' &&
       schedule?.type === 'recurring' &&
       schedule?.frequency?.toLowerCase() === 'daily' &&
       schedule?.time
     ) {
       const nextRun = calculateNextDailyRun({
         time: schedule.time,
         timezone: timezone,
       });

       const existingAgent = result[0];
       const userEmail = agentConfig.userEmail || existingAgent?.userEmail || user?.primaryEmailAddress?.emailAddress || '';

       await db
         .insert(AgentRun)
         .values({
           agentId: agentConfig.agentId,
           userEmail: userEmail,
           scheduledFor: nextRun,
           timezone: timezone,
           status: "scheduled",
         })
         .onConflictDoNothing();
     }
 
     return NextResponse.json(result[0] || {});
   } catch (e: any) {
     console.error('Error in PUT /api/agent/configure:', e);
     return NextResponse.json({error: e?.message || 'Internal Server Error'}, {status: 500});
   }
}

export async function GET(req:NextRequest){
    const user = await currentUser();
    if(!user) return NextResponse.json({error:"Unauthorized User"},{status:400})
    const result  = await db.select().from(AgentConfig).where(eq(AgentConfig.userEmail,user?.primaryEmailAddress?.emailAddress??'')).
    orderBy(desc(AgentConfig?.createdAt))
    return NextResponse.json(result);
}

export async function DELETE(req:NextRequest){
    const {agentId} = await req.json();
    if(!agentId){
        return NextResponse.json({error:'Agent ID is required'},{status:400});
    }

    try {
        // Delete all runs for this agent first to satisfy foreign key constraint
        await db.delete(AgentRun).where(eq(AgentRun.agentId, agentId));

        // Delete agent configuration
        await db.delete(AgentConfig).where(eq(AgentConfig.agentId, agentId));
    
        return NextResponse.json({msg:'Agent Deleted!'},{status:200})
    } catch (e: any) {
        console.error('Error in DELETE /api/agent/configure:', e);
        return NextResponse.json({error: e?.message || 'Internal Server Error'},{status:500})
    }
}
