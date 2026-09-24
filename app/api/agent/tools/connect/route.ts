import { AgentConfig, db } from "@/db";
import { composio } from "@/lib/composio";
import { getOrCreateAgentSession } from "@/lib/get-agent-composio-session";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    const {toolSlug,agentId} = await req.json();
    const user = await currentUser();
    if(!user){
        return NextResponse.json({'error':'Unauthorized User'},{status:400});
    }
    const agentConfig = await db.select().from(AgentConfig).
    where(eq(AgentConfig.agentId,agentId));
    //@ts-ignore
    const session = await getOrCreateAgentSession(agentConfig[0],user?.primaryEmailAddress?.emailAddress)

    const connectionRequest = await session.authorize(toolSlug);
    return NextResponse.json({
        redirectUrl:connectionRequest.redirectUrl
    })
}

export async function DELETE(req:NextRequest){
    const {toolSlug,agentId} = await req.json();
    const result = await db.select().from(AgentConfig).
    where(eq(AgentConfig.agentId,agentId));

    const composioSessionId = result[0].composioSessionId;

const session = await composio.use(composioSessionId??'')

    const toolKits = await session.toolkits();
    
    const toolKit = toolKits.items.find((item:any)=>item.slug.toLowerCase()===toolSlug.toLowerCase());

    const sessionConnectedAccountId = toolKit?.connection?.connectedAccount?.id??null;
    if(!sessionConnectedAccountId){
        return NextResponse.json({error:'Connection Not Found'},{status:404});
    }
    await composio.connectedAccounts.delete(sessionConnectedAccountId)

    return NextResponse.json({success:true})
}