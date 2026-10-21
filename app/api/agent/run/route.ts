import { AgentConfig, AgentRun, db } from "@/db";
import { inngest } from "@/inngest/client";
import { executeAgent } from "@/lib/execute-agent";
import { currentUser } from "@clerk/nextjs/server";
import { and, eq, inArray } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration=300;

export async function POST(req:NextRequest){
    const user = await currentUser();
    const {agentConfig,agentId, input} = await req.json();

    let AgentConfigData = agentConfig;
    const targetAgentId = agentId || agentConfig?.agentId;

    if(!AgentConfigData && targetAgentId){
        const result = await db.select().from(AgentConfig).
        where(eq(AgentConfig.agentId,targetAgentId))
        
        AgentConfigData = result[0]
    }

    if(input==null){
        if(!targetAgentId){
            return NextResponse.json({error:'Agent ID is required'},{status:400})
        }

        const isAgentRunning = await db.select().from(AgentRun)
        .where(and(eq(AgentRun.agentId,targetAgentId),inArray(AgentRun.status,['queued','running'])))

        if(isAgentRunning.length!=0){
            return NextResponse.json({error:'Agent already running!'},{status:400})
        }

        const now = new Date()
        const resolvedTimezone =
            agentConfig?.schedule?.timezone ||
            AgentConfigData?.schedule?.timezone ||
            agentConfig?.timezone ||
            'UTC';

        const userEmail =
            user?.primaryEmailAddress?.emailAddress ||
            agentConfig?.userEmail ||
            AgentConfigData?.userEmail ||
            '';

        const insertAgentRun = await db.insert(AgentRun)
        .values({
            agentId:targetAgentId,
            userEmail:userEmail,
            scheduledFor:now,
            timezone:resolvedTimezone,
            status:'running',
            startedAt:now,
            queuedAt:now
        }).returning();

        const run = insertAgentRun[0];

        const executeDirectly = async () => {
            try {
                const executableConfig = {
                    ...AgentConfigData,
                    id: AgentConfigData?.id ?? 0,
                    userEmail: userEmail,
                    agentId: targetAgentId,
                    name: AgentConfigData?.name ?? "Unnamed Agent",
                    agentImage: AgentConfigData?.agentImage ?? "",
                    description: AgentConfigData?.description ?? "",
                    instructions: AgentConfigData?.instructions ?? "",
                    objective: AgentConfigData?.objective ?? "",
                    tools: AgentConfigData?.tools,
                    skills: Array.isArray(AgentConfigData?.skills) ? AgentConfigData.skills : [],
                    schedule: AgentConfigData?.schedule ?? { type: "manual" },
                    outputFormat: AgentConfigData?.outputFormat ?? "",
                    status: AgentConfigData?.status ?? "active",
                    createdAt: String(AgentConfigData?.createdAt ?? new Date()),
                    composioSessionId: AgentConfigData?.composioSessionId ?? undefined,
                };

                const output = await executeAgent({
                    agentConfig: executableConfig,
                    userEmail: userEmail,
                    input: executableConfig.objective || "Execute configured objective.",
                });

                await db.update(AgentRun).set({
                    status: 'completed',
                    output,
                    completedAt: new Date(),
                }).where(eq(AgentRun.id, run.id));
            } catch (err: any) {
                console.error("Direct execution failed:", err);
                await db.update(AgentRun).set({
                    status: 'failed',
                    error: err?.message || "Execution error",
                    completedAt: new Date(),
                }).where(eq(AgentRun.id, run.id));
            }
        };

        // Try dispatching to Inngest with a short timeout; if Inngest Dev Server is not running, fall back to direct execution
        try {
            const inngestPromise = inngest.send({
                name: 'agent/run.execute',
                data: {
                    runId: run.id
                }
            });
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error("Inngest unavailable/timeout")), 1200)
            );
            await Promise.race([inngestPromise, timeoutPromise]);
        } catch (inngestErr) {
            console.warn("Inngest server not reachable; running agent directly:", inngestErr);
            executeDirectly().catch(err => console.error("Background agent run error:", err));
        }

        return NextResponse.json({ msg: 'Agent Running', runId: run.id }, { status: 200 });
    }

    const result = await executeAgent({
        agentConfig:AgentConfigData,
        userEmail:user?.primaryEmailAddress?.emailAddress??'',
        input:input??null
    })
    return NextResponse.json(result);
}