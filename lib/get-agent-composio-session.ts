import { CreatedAgentType } from "@/components/custom/agents/CreateAgent";
import { composio } from "./composio";
import { AgentConfig, db } from "@/db";
import { eq } from "drizzle-orm";

export async function getOrCreateAgentSession(agentConfig:CreatedAgentType,userEmail:string){
    if(agentConfig?.composioSessionId){
        try {
            return composio.use(agentConfig.composioSessionId);
        } catch (e) {
            console.warn("Could not reuse Composio session, creating new session:", e);
        }
    }

    const nonComposioSlugs = new Set([
        'browserbase',
        'web_search',
        'browser_research',
        'websearch',
        'google_search',
        'builtin',
    ]);

    const rawTools: string[] = Array.isArray(agentConfig?.tools) ? agentConfig.tools : [];
    const validToolkits = rawTools.filter(
        (t) => typeof t === 'string' && !nonComposioSlugs.has(t.toLowerCase().trim())
    );

    let session: any;
    try {
        if (validToolkits.length > 0) {
            session = await composio.sessions.create(userEmail, {
                toolkits: validToolkits
            });
        } else {
            session = await composio.sessions.create(userEmail, {});
        }
    } catch (err: any) {
        console.warn("Composio session creation with toolkits failed, falling back to empty session:", err?.message || err);
        try {
            session = await composio.sessions.create(userEmail, {});
        } catch (fallbackErr) {
            console.error("Composio session creation completely failed:", fallbackErr);
            return {
                sessionId: 'local_session_' + Date.now(),
                tools: async () => [],
                toolkits: async () => ({ items: [] }),
            };
        }
    }

    // save session id if available
    if (session?.sessionId && !session.sessionId.startsWith('local_session_')) {
        await SaveComposioSessionId(agentConfig?.agentId, session);
    }

    return session;
}

const SaveComposioSessionId = async (agentId:string,session:any)=>{
    const result = await db.update(AgentConfig).set({
        composioSessionId: session.sessionId
    }).where(eq(AgentConfig.agentId,agentId))
}