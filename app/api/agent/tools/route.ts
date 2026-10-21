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

    try {
        const agentConfig = result[0]
        if (!agentConfig) {
            return NextResponse.json([])
        }

        const allowedTools: string[] = Array.isArray(agentConfig.tools) ? agentConfig.tools : []
        //@ts-ignore
        const session = await getOrCreateAgentSession(agentConfig, user?.primaryEmailAddress?.emailAddress)

        let toolKitItems: any[] = []
        try {
            const toolKitResult = await session?.toolkits?.();
            toolKitItems = toolKitResult?.items || []
        } catch (e) {
            console.warn("Could not fetch session toolkits:", e);
        }

        const tools = allowedTools.map((slug: string) => {
            const lower = slug.toLowerCase();
            if (lower === 'browserbase' || lower === 'browser_research') {
                return {
                    slug,
                    name: 'Browserbase',
                    logo: 'https://browserbase.com/favicon.ico',
                    connected: true,
                    connectedAccountId: 'builtin-browserbase'
                }
            }

            if (lower === 'web_search' || lower === 'google_search') {
                return {
                    slug,
                    name: 'Web Search',
                    logo: 'https://www.google.com/favicon.ico',
                    connected: true,
                    connectedAccountId: 'builtin-search'
                }
            }

            const toolKit = toolKitItems.find(
                (item: any) => item?.slug?.toLowerCase() === lower
            )

            return {
                slug,
                name: toolKit?.name || slug.charAt(0).toUpperCase() + slug.slice(1),
                logo: toolKit?.logo || null,
                connected: toolKit?.connection?.isActive ?? false,
                connectedAccountId: toolKit?.connection?.connectedAccount?.id ?? null
            }
        })

        return NextResponse.json(tools)
    } catch (err: any) {
        console.error("Error fetching agent tools:", err);
        return NextResponse.json([], { status: 200 })
    }
}