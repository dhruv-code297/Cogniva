import type { CreatedAgentType } from "@/components/custom/agents/CreateAgent";
import { AgentConfig, AgentRun, db } from "@/db";
import { calculateNextDailyRun } from "@/lib/agent-schedule";
import { executeAgent } from "@/lib/execute-agent";
import { and, asc, eq, lte } from "drizzle-orm";
import { inngest } from "./client";

export const ProcessScheduledAgent = inngest.createFunction(
  {
    id: "process-scheduled-agent-runs",
    triggers: [{ cron: "*/15 * * * *" }],
    // Run this scheduler every 15 minutes to pick pending agent jobs.
  },
  async ({ step }) => {
    const now = new Date();

    // Step 1: Load scheduled agent runs whose execution time has arrived.
    const dueRuns = await step.run("load-due-agent-runs", async () => {
      return await db
        .select({
          run: AgentRun,
          agentConfig: AgentConfig,
        })
        .from(AgentRun)
        .innerJoin(
          AgentConfig,
          eq(AgentRun.agentId, AgentConfig.agentId)
        )
        .where(
          and(
            eq(AgentRun.status, "scheduled"),
            lte(AgentRun.scheduledFor, now)
          )
        )
        .orderBy(asc(AgentRun.scheduledFor))
        .limit(100);
    });

    const results = [];

    for (const { run, agentConfig } of dueRuns) {
      try {
        // Step 2: Atomically claim the run so overlapping cron ticks skip it.
        const startedRun = await step.run(
          `mark-run-started-${run.id}`,
          async () => {
            const result = await db
              .update(AgentRun)
              .set({
                status: "running",
                queuedAt: now,
                startedAt: new Date(),
              })
              .where(
                and(
                  eq(AgentRun.id, run.id),
                  eq(AgentRun.status, "scheduled")
                )
              )
              .returning();

            return result[0] ?? null;
          }
        );

        // Another worker already claimed this run, skip it.
        if (!startedRun) {
          results.push({
            runId: run.id,
            agentId: run.agentId,
            status: "skipped",
          });

          continue;
        }

        // Step 4: Execute the agent using the existing project agent runner.
        const output = await step.run(
          `execute-agent-${run.id}`,
          async () => {
            // Normalize nullable DB fields into the stricter UI agent config type.
            const executableAgentConfig: CreatedAgentType = {
              id: agentConfig.id,
              userEmail: agentConfig.userEmail ?? run.userEmail,
              agentId: agentConfig.agentId,
              name: agentConfig.name ?? "Unnamed Agent",
              agentImage: agentConfig.agentImage ?? "",
              description: agentConfig.description ?? "",
              instructions: agentConfig.instructions ?? "",
              objective: agentConfig.objective ?? "",
              tools: agentConfig.tools,
              skills: Array.isArray(agentConfig.skills)
                ? (agentConfig.skills as string[])
                : [],
              schedule: (agentConfig.schedule ?? {
                type: "manual",
              }) as CreatedAgentType["schedule"],
              outputFormat: agentConfig.outputFormat ?? "",
              status: agentConfig.status ?? "active",
              createdAt: String(agentConfig.createdAt),
              composioSessionId:
                agentConfig.composioSessionId ?? undefined,
            };

            return await executeAgent({
              agentConfig: executableAgentConfig,
              userEmail: run.userEmail,
              input: executableAgentConfig.objective,
            });
          }
        );

        // Step 5: Persist the successful output back to the AgentRun row.
        await step.run(
          `mark-run-completed-${run.id}`,
          async () => {
            await db
              .update(AgentRun)
              .set({
                status: "completed",
                output,
                completedAt: new Date(),
              })
              .where(eq(AgentRun.id, run.id));
          }
        );

        const schedule = agentConfig.schedule as {
          type?: string;
          frequency?: string;
          time?: string;
          timezone?: string;
        } | null;

        // Step 6: For daily recurring agents, create the next scheduled run.
        if (
          schedule?.type === "recurring" &&
          schedule.frequency === "daily" &&
          schedule.time
        ) {
          await step.run(
            `schedule-next-run-${run.id}`,
            async () => {
              const timezone = schedule.timezone ?? run.timezone ?? "UTC";

              const nextRun = calculateNextDailyRun({
                time: schedule.time!,
                timezone,
                after: new Date(run.scheduledFor),
              });

              await db
                .insert(AgentRun)
                .values({
                  agentId: run.agentId,
                  userEmail: run.userEmail,
                  scheduledFor: nextRun,
                  timezone,
                  status: "scheduled",
                })
                .onConflictDoNothing();
            }
          );
        }

        // Step 7: Track the run result for Inngest execution summary.
        results.push({
          runId: run.id,
          agentId: run.agentId,
          status: "completed",
        });
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unknown error";

        // Step 8: Persist failures so the run does not stay stuck as running.
        await step.run(
          `mark-run-failed-${run.id}`,
          async () => {
            await db
              .update(AgentRun)
              .set({
                status: "failed",
                error: message,
                completedAt: new Date(),
              })
              .where(eq(AgentRun.id, run.id));
          }
        );

        // Step 9: Include failure details in the Inngest execution summary.
        results.push({
          runId: run.id,
          agentId: run.agentId,
          status: "failed",
          error: message,
        });
      }
    }

    // Step 10: Return a compact summary for Inngest logs and observability.
    return {
      processed: results.length,
      results,
    };
  }
);

// Keep the existing API route import working while using the clearer function name above.
export const processTask = ProcessScheduledAgent;