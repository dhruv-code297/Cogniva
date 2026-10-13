import { AgentConfig, AgentRun, db } from "@/db";
import { inngest } from "@/inngest/client";
import { executeAgent } from "@/lib/execute-agent";
import { currentUser } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration=300;

export async function POST(req:NextRequest){
    const user = await currentUser();
    const {agentConfig,agentId, input} = await req.json();

    let AgentConfigData = agentConfig

    if(!AgentConfigData){
        const result = await db.select().from(AgentConfig).
        where(eq(AgentConfig.agentId,agentId))
        
        AgentConfigData = result[0]
    }

    if(input==null){

        const isAgentRunning = await db.select().from(AgentRun)
        .where(and(eq(AgentRun.agentId,agentConfig?.agentId),eq(AgentRun.status,'queued'),eq(AgentRun.status,'running')))

        if(isAgentRunning.length!=0){
            return NextResponse.json({error:'Agent already running!'},{status:400})
        }

        const now = new Date()
        const insertAgentRun = await db.insert(AgentRun)
        .values({
            agentId:agentConfig?.agentId,
            userEmail:user?.primaryEmailAddress?.emailAddress??'',
            scheduledFor:now,
            timezone:agentConfig?.scheduled?.timezone,
            status:'queued',
            queuedAt:now
        }).returning();

        const run = insertAgentRun[0];

        try {
            await inngest.send({
                name:'agent/run.execute',
                data:{
                    runId:run.id
                }
            })
            return NextResponse.json({msg:'Agent Running'},{status:200})
        } catch (e) {
            await db.update(AgentRun)
            .set({
                status:'failed',
                error:'Error',
                completedAt: new Date()
            }).where(eq(AgentRun.id,run.id))
            return NextResponse.json({error:e},{status:500})
        }
    }

    const result = await executeAgent({
        agentConfig:AgentConfigData,
        userEmail:user?.primaryEmailAddress?.emailAddress??'',
        input:input??null
    })
    return NextResponse.json(result);
}