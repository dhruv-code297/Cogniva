import { CreatedAgentType } from "@/components/custom/agents/CreateAgent";
import { buildAgent } from "./build-agent";
import { run } from "@openai/agents";

export async function executeAgent({
agentConfig,
userEmail,
input
}:{
    agentConfig:CreatedAgentType,
    userEmail:string,
    input:string
}){
    if(agentConfig.status.toLowerCase()!=='active'){
        throw new Error('Agent is not active!')
    }
    
    const agent = await buildAgent(agentConfig,userEmail);

    const result = await run(agent,input?.trim() || agentConfig?.objective)

    return {
        finalOutput:result?.finalOutput
    }
}