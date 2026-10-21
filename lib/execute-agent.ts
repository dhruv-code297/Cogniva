import { CreatedAgentType } from "@/components/custom/agents/CreateAgent";
import { buildAgent } from "./build-agent";
import { run } from "@openai/agents";

export async function executeAgent({
  agentConfig,
  userEmail,
  input,
}: {
  agentConfig: CreatedAgentType;
  userEmail: string;
  input: string;
}) {
  if (agentConfig?.status?.toLowerCase() !== "active") {
    throw new Error("Agent is not active!");
  }

  if (!process.env.OPENAI_API_KEY) {
    return {
      finalOutput: "OpenAI API key is missing. Please add OPENAI_API_KEY to your .env file to run this agent.",
    };
  }

  const promptInput = input?.trim() || agentConfig?.objective || "Execute configured objective.";

  const agent = await buildAgent(agentConfig, userEmail);
  const result = await run(agent, promptInput);

  return {
    finalOutput: result?.finalOutput,
  };
}