import { AgentConfig, db } from "@/db";
import { getOrCreateAgentSession } from "@/lib/get-agent-composio-session";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req:NextRequest){
    const searchParams = req.nextUrl.searchParams;
    const agentId = searchParams.get('agentId');

    const user = await currentUser();
    if(!user){
        return NextResponse.json({error:'Unauthorized User'},{status:400})
    }
    
    //fetch agent config
    const result = await db.select().from(AgentConfig)
    .where(eq(AgentConfig.agentId,agentId??''));

    const agentConfig = result[0]
    const allowedTools:any = agentConfig?.tools
    //@ts-ignore
    const session = await getOrCreateAgentSession(agentConfig,user?.primaryEmailAddress?.emailAddress)

    const toolKitResult = await session.toolkits();

    const tools = allowedTools.map((slug:string)=>{
        const toolKit = toolKitResult.items.find(
            (item)=>item.slug.toLowerCase()===slug.toLowerCase()
        )

        return {
            slug,
            name:toolKit?.name,
            logo:toolKit?.logo,
            connected:toolKit?.connection?.isActive??false,
            connectedAccountId:toolKit?.connection?.connectedAccount?.id??null
        }
    })

    return NextResponse.json(tools)
}