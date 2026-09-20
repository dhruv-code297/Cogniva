import { NextRequest, NextResponse } from "next/server";
import {GoogleGenAI, ThinkingLevel} from '@google/genai'
import { AgentConfigSystemPrompt } from "@/data/Prompt";
import { AgentConfigRespSchema } from "@/data/ResponseSchema";
import { AgentConfig, db, tools } from "@/db";
import { currentUser } from "@clerk/nextjs/server";
import { desc, eq } from "drizzle-orm";

export async function POST(req:NextRequest){
    const {prompt} = await req.json();
    const user = await currentUser();
    if(!prompt.trim()){
        return NextResponse.json({error:'Prompt is required'},{status:400})
    }

    const apiKey = process.env.GOOGLE_CLOUD_GEMINI_API_KEY;
    try {

        const aiTools =  await db.select({
            slug:tools.slug
        }).from(tools)

        const ai = new GoogleGenAI({apiKey});
        const response  = await ai.models.generateContent({
            model:'gemini-3.5-flash',
            contents:AgentConfigSystemPrompt.replace('{USER_PROMPT}',prompt).replace('{AVAILABLE_TOOLS}',aiTools.toString()),
            config:{
                thinkingConfig:{thinkingLevel:ThinkingLevel.LOW},
                responseMimeType:'application/json',
                responseSchema:AgentConfigRespSchema
            }
        })

        //save final agent config 
        const aiOutput = JSON.parse(response.text??'{}')
        if(aiOutput.status=='ready'){
            const agentId = crypto.randomUUID()
            const dbResult = await db.insert(AgentConfig).values({
                ...aiOutput.config,
                agentImage:'https://api.dicebear.com/10.x/bottts/svg?seed='+agentId,
                agentId:agentId,
                userEmail:user?.primaryEmailAddress?.emailAddress
            }).returning();
             return NextResponse.json({...dbResult[0],status_:'ready'});
        }

        return NextResponse.json(JSON.parse(response.text??'{}'));
    } catch (e) {
        console.error('Error',e);
        return NextResponse.json({error:e},{status:500})
    }
}

export async function PUT(req:NextRequest){
    const agentConfig = await req.json()
    
   try {
     const result = await db.update(AgentConfig).set({
         ...agentConfig,
         createdAt: new Date()
     }).where(eq(AgentConfig.agentId,agentConfig?.agentId))
     .returning()
 
     return NextResponse.json(result[0]);
   } catch (e) {
        return NextResponse.json({error:'Internal Server Error'},{status:500});
   }
}

export async function GET(req:NextRequest){
    const user = await currentUser();
    if(!user) return NextResponse.json({error:"Unauthorized User"},{status:400})
    const result  = await db.select().from(AgentConfig).where(eq(AgentConfig.userEmail,user?.primaryEmailAddress?.emailAddress??'')).
    orderBy(desc(AgentConfig?.createdAt))
    return NextResponse.json(result);
}