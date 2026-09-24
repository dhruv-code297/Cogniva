import { CreatedAgentType } from "@/components/custom/agents/CreateAgent";
import { composio } from "./composio";
import { AgentConfig, db } from "@/db";
import { eq } from "drizzle-orm";

export async function getOrCreateAgentSession(agentConfig:CreatedAgentType,userEmail:string){
    if(agentConfig?.composioSessionId){
        return composio.use(agentConfig?.composioSessionId)
    }
    const session = await composio.sessions.create(userEmail,{
        toolkits:agentConfig.tools
    })
    //save session id
    await SaveComposioSessionId(agentConfig?.agentId,session);

    return session;
}

const SaveComposioSessionId = async (agentId:string,session:any)=>{
    const result = await db.update(AgentConfig).set({
        composioSessionId: session.sessionId
    }).where(eq(AgentConfig.agentId,agentId))
}