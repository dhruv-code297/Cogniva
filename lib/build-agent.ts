import { CreatedAgentType } from "@/components/custom/agents/CreateAgent";
import { getOrCreateAgentSession } from "./get-agent-composio-session";
import { Agent } from "@openai/agents";

export async function buildAgent(agentConfig:CreatedAgentType,
    userEmail:string
){
    const session = await getOrCreateAgentSession(agentConfig,userEmail);
    const composioTools = await session.tools();

    const instructions = `
    Role: ${agentConfig.description},

    Instructions:
    ${agentConfig.instructions},

    Primary Objective
    ${agentConfig.objective},

    Skills:
    ${(agentConfig.skills??[]).join(', ')},

    Required Output Format:
    ${agentConfig?.outputFormat}

    Use only the available tools when needed.
    Do not that claim that an action succeeded unless the tool result confirms it.
    Ask for confirmation before destructive or high risk actions.
    `.trim()

    return new Agent({
        name:agentConfig.name,
        model:process.env.OPENAI_MODEL,
        instructions,
        tools:composioTools
    })
}