import { AgentConfig, db } from "@/db";
import { executeAgent } from "@/lib/execute-agent";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
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

    const result = await executeAgent({
        agentConfig:AgentConfigData,
        userEmail:user?.primaryEmailAddress?.emailAddress??'',
        input:input??null
    })
    return NextResponse.json(result);
}