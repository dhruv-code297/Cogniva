"use client";

import React, { FormEvent, useEffect, useState } from "react";
import {
  CalendarClock,
  Clock3,
  FileText,
  Loader2,
  Plus,
  Save,
  Shuffle,
  Sparkles,
  Target,
  Wrench,
  X,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CreatedAgentType } from "./CreateAgent";
import { toast } from "@/components/ui/toast";
import axios from "axios";

type Props = {
  children?: React.ReactNode;
  agentConfig: CreatedAgentType | null;
  setUpdatedAgent: any;
  openSheet_?: boolean;
  closeSheet?: any;
};

type ScheduleType = "once" | "recurring";

type AgentSchedule = {
  type: ScheduleType;
  frequency: string;
  time: string;
  timezone?: string;
};

type EditableTool = {
  name: string;
  connected: boolean;
  slug: string;
  logo: string;
};

const FREQUENCY_OPTIONS = ["Daily", "Weekly", "Monthly"];

export default function AgentEditSheet({
  children,
  agentConfig,
  setUpdatedAgent,
  openSheet_ = false,
  closeSheet,
}: Props) {
  const [open, setOpen] = useState(openSheet_);
  const [draftAgent, setDraftAgent] = useState<CreatedAgentType | null>(agentConfig);
  const [tools, setTools] = useState<EditableTool[]>([]);
  const [loadingTools, setLoadingTools] = useState(false);
  const [disconnectToolLoading, setDisconnectToolLoading] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenChange = (value: boolean) => {
    setOpen(value);
    closeSheet?.(value);
  };

  useEffect(() => {
    setOpen(openSheet_);
  }, [openSheet_]);

  useEffect(() => {
    setDraftAgent(agentConfig);
    if (agentConfig) GetTools();
  }, [agentConfig]);

  const ShuffleImage = () => {
    const randomSeed = crypto.randomUUID();
    const newImage = "https://api.dicebear.com/10.x/bottts/svg?seed=" + randomSeed;

    setDraftAgent((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        agentImage: newImage,
      };
    });
  };

  const updateDraft = (key: keyof CreatedAgentType, value: any) => {
    setDraftAgent((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [key]: value,
      };
    });
  };

  const getSchedule = (): AgentSchedule => {
    const schedule = draftAgent?.schedule as (AgentSchedule & { timezone?: string }) | undefined;

    return {
      type: (schedule?.type as ScheduleType) || "once",
      frequency: schedule?.frequency || "Daily",
      time: schedule?.time || "09:00",
      timezone:
        schedule?.timezone ||
        (typeof window !== "undefined"
          ? Intl.DateTimeFormat().resolvedOptions().timeZone
          : "UTC"),
    };
  };

  const updateSchedule = (key: keyof AgentSchedule, value: string) => {
    const schedule = getSchedule();
    updateDraft("schedule", {
      ...schedule,
      [key]: value,
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      setIsSubmitting(true);
      const currentSchedule = getSchedule();
      const payload = {
        ...draftAgent,
        schedule: currentSchedule,
      };

      const result = await axios.put("/api/agent/configure", payload);
      if (result.data?.error) {
        toast.add({
          type: "error",
          title: result.data?.error,
        });
        return;
      }
      try {
        await setUpdatedAgent?.(payload);
      } catch (err) {
        console.error("Error updating agent in parent:", err);
      }
      toast.add({
        type: "success",
        title: "Agent updated successfully",
      });
      handleOpenChange(false);
    } catch (error: any) {
      console.error("Failed to update agent:", error);
      const errMsg =
        error?.response?.data?.error || error?.message || "Failed to update agent";
      toast.add({
        type: "error",
        title: typeof errMsg === "string" ? errMsg : "Failed to update agent",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const addSkill = () => {
    const skill = skillInput.trim();
    if (!skill) return;

    if (
      draftAgent?.skills?.some(
        (item) => item.toLowerCase() === skill.toLowerCase()
      )
    ) {
      setSkillInput("");
      return;
    }

    updateDraft("skills", [...(draftAgent?.skills || []), skill]);
    setSkillInput("");
  };

  const removeSkill = (skill: string) => {
    updateDraft(
      "skills",
      (draftAgent?.skills || []).filter((item) => item !== skill)
    );
  };

  const GetTools = async () => {
    setLoadingTools(true);
    try {
      const result = await axios.get("/api/agent/tools?agentId=" + agentConfig?.agentId);
      setTools(Array.isArray(result.data) ? result.data : []);
    } catch (err) {
      console.error("Error loading tools:", err);
    } finally {
      setLoadingTools(false);
    }
  };

  const ConnectedTools = tools.filter((tool) => tool.connected === true);

  const handleSkillKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addSkill();
    }
  };

  const connectTool = async (slug: string) => {
    try {
      const result = await axios.post("/api/agent/tools/connect", {
        agentId: agentConfig?.agentId ?? "",
        toolSlug: slug,
      });
      if (result?.data?.redirectUrl) {
        window.open(result.data.redirectUrl, "_blank");
      }
    } catch (err: any) {
      toast.add({
        type: "error",
        title: err?.response?.data?.error || "Could not connect tool",
      });
    }
  };

  const disconnectTool = async (slug: string) => {
    setDisconnectToolLoading(true);
    try {
      const result = await axios.delete("/api/agent/tools/connect", {
        data: {
          toolSlug: slug,
          agentId: agentConfig?.agentId,
        },
      });
      if (result.data.error) {
        toast.add({
          type: "error",
          title: result.data.error,
        });
        return;
      }

      toast.add({
        type: "success",
        title: "Tool disconnected",
      });
      await GetTools();
    } catch (err: any) {
      toast.add({
        type: "error",
        title: err?.response?.data?.error || "Failed to disconnect tool",
      });
    } finally {
      setDisconnectToolLoading(false);
    }
  };

  if (!draftAgent) {
    return (
      <Sheet open={open} onOpenChange={(v: boolean) => { setOpen(v); closeSheet?.(v); }}>
        <SheetTrigger>{children}</SheetTrigger>
        <SheetContent className="bg-white border-l border-slate-200">
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-slate-500">Agent not found.</p>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  const schedule = getSchedule();

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger>{children}</SheetTrigger>

      <SheetContent
        side="right"
        className="w-full sm:max-w-xl p-0 bg-white border-l border-slate-200/90 shadow-xl"
      >
        <form onSubmit={handleSubmit} className="flex h-full min-h-0 flex-col">
          {/* Header */}
          <SheetHeader className="border-b border-slate-100 bg-white px-6 py-5 pr-14">
            <div className="flex items-center gap-3">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-900 border border-slate-200/80 shadow-2xs">
                <Sparkles className="size-5" />
              </div>

              <div className="min-w-0">
                <SheetTitle className="text-base font-bold text-slate-950">
                  Edit Agent Configuration
                </SheetTitle>
                <SheetDescription className="text-xs text-slate-500 font-normal">
                  Update instructions, objectives, tool access, and schedule cadences.
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>

          {/* Form Content */}
          <ScrollArea className="min-h-0 flex-1">
            <div className="space-y-6 px-6 py-6">
              {/* Agent Image */}
              <section className="rounded-2xl border border-slate-200/90 bg-slate-50/70 p-4">
                <div className="flex items-center gap-4">
                  <div className="size-20 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-2xs">
                    <img
                      src={draftAgent.agentImage}
                      alt={draftAgent.name || "Agent"}
                      className="size-full object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-slate-950">Agent Avatar</p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      Generate a new procedural visual identifier.
                    </p>

                    <button
                      type="button"
                      onClick={ShuffleImage}
                      className="cog-secondary-button mt-3 text-xs"
                    >
                      <Shuffle className="size-3.5" />
                      <span>Shuffle Avatar</span>
                    </button>
                  </div>
                </div>
              </section>

              {/* Basic Information */}
              <section className="space-y-4">
                <SectionTitle
                  icon={<Sparkles className="size-4" />}
                  title="Basic Information"
                />

                <div className="space-y-1.5">
                  <label
                    htmlFor="agent-name"
                    className="block text-xs font-semibold text-slate-700"
                  >
                    Agent Name
                  </label>
                  <input
                    id="agent-name"
                    value={draftAgent.name || ""}
                    onChange={(event) => updateDraft("name", event.target.value)}
                    placeholder="e.g. Inbox Scout"
                    className="w-full bg-slate-50 border border-slate-200/90 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-950/10 focus:border-slate-900 transition-all"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="agent-description"
                    className="block text-xs font-semibold text-slate-700"
                  >
                    Description
                  </label>
                  <textarea
                    id="agent-description"
                    value={draftAgent.description || ""}
                    onChange={(event) => updateDraft("description", event.target.value)}
                    placeholder="Briefly describe what this agent does."
                    rows={2}
                    className="w-full bg-slate-50 border border-slate-200/90 rounded-xl p-3 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-950/10 focus:border-slate-900 transition-all resize-y leading-relaxed"
                    required
                  />
                </div>
              </section>

              {/* Objective */}
              <section className="space-y-4">
                <SectionTitle
                  icon={<Target className="size-4" />}
                  title="Primary Objective"
                />

                <div className="space-y-1.5">
                  <label
                    htmlFor="agent-objective"
                    className="block text-xs font-semibold text-slate-700"
                  >
                    What should this agent achieve?
                  </label>
                  <textarea
                    id="agent-objective"
                    value={draftAgent.objective || ""}
                    onChange={(event) => updateDraft("objective", event.target.value)}
                    placeholder="Define the core objective and deliverables of your agent."
                    rows={3}
                    className="w-full bg-slate-50 border border-slate-200/90 rounded-xl p-3 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-950/10 focus:border-slate-900 transition-all resize-y leading-relaxed"
                    required
                  />
                </div>
              </section>

              {/* Instructions */}
              <section className="space-y-4">
                <SectionTitle
                  icon={<FileText className="size-4" />}
                  title="Instructions & Rules"
                />

                <div className="space-y-1.5">
                  <label
                    htmlFor="agent-instructions"
                    className="block text-xs font-semibold text-slate-700"
                  >
                    Agent Instructions
                  </label>
                  <textarea
                    id="agent-instructions"
                    value={draftAgent.instructions || ""}
                    onChange={(event) => updateDraft("instructions", event.target.value)}
                    placeholder="Step-by-step instructions guiding how the agent reasons and executes."
                    rows={5}
                    className="w-full bg-slate-50 border border-slate-200/90 rounded-xl p-3 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-950/10 focus:border-slate-900 transition-all resize-y leading-relaxed font-mono"
                    required
                  />
                  <p className="text-[11px] text-slate-400">
                    These system guidelines dictate how the agent formats outputs and uses tools.
                  </p>
                </div>
              </section>

              {/* Skills */}
              <section className="space-y-4">
                <SectionTitle
                  icon={<Sparkles className="size-4" />}
                  title="Skills & Tags"
                />

                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      value={skillInput}
                      onChange={(event) => setSkillInput(event.target.value)}
                      onKeyDown={handleSkillKeyDown}
                      placeholder="Add a skill or tag..."
                      className="flex-1 bg-slate-50 border border-slate-200/90 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-950/10 focus:border-slate-900 transition-all"
                    />

                    <button
                      type="button"
                      onClick={addSkill}
                      disabled={!skillInput.trim()}
                      className="cog-secondary-button px-3 cursor-pointer disabled:opacity-40"
                    >
                      <Plus className="size-3.5" />
                      <span>Add</span>
                    </button>
                  </div>

                  {draftAgent.skills && draftAgent.skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {draftAgent.skills.map((skill) => (
                        <div
                          key={skill}
                          className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 shadow-2xs"
                        >
                          <span>{skill}</span>
                          <button
                            type="button"
                            onClick={() => removeSkill(skill)}
                            className="rounded-full p-0.5 text-slate-400 hover:bg-slate-200 hover:text-slate-800 transition-colors"
                          >
                            <X className="size-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400">No skills assigned yet.</p>
                  )}
                </div>
              </section>

              {/* Connected Tools */}
              <section className="space-y-4">
                <SectionTitle
                  icon={<Wrench className="size-4" />}
                  title="Tool Integrations"
                />

                <div className="rounded-xl border border-slate-200/90 bg-slate-50/70 p-3.5 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-600">
                    {ConnectedTools.length} of {tools.length} integrations connected
                  </span>
                  <span className="rounded-full bg-slate-200/70 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                    Composio
                  </span>
                </div>

                <div className="space-y-2">
                  {loadingTools && (
                    <div className="p-4 border border-slate-200 rounded-xl flex items-center justify-center gap-2 text-xs text-slate-500">
                      <Loader2 className="size-4 animate-spin text-slate-900" />
                      <span>Loading available tools...</span>
                    </div>
                  )}

                  {tools.map((tool, index) => (
                    <div
                      key={`${tool.name}-${index}`}
                      className="flex items-center justify-between gap-3 p-3 rounded-xl border border-slate-200/80 bg-white hover:border-slate-300 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-slate-100 bg-slate-50 p-1">
                          <img
                            src={tool.logo}
                            alt={tool.name}
                            className="size-full object-contain rounded"
                          />
                        </div>

                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-950 truncate">
                            {tool.name}
                          </p>
                          <p className="text-[11px] font-medium">
                            {tool.connected ? (
                              <span className="text-emerald-600">Connected</span>
                            ) : (
                              <span className="text-slate-400">Not connected</span>
                            )}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          tool.connected
                            ? disconnectTool(tool.slug)
                            : connectTool(tool.slug)
                        }
                        disabled={disconnectToolLoading}
                        className={
                          tool.connected
                            ? "cog-secondary-button text-xs py-1 px-3 h-8 text-rose-600 hover:text-rose-700 hover:border-rose-200"
                            : "cog-primary-button text-xs py-1 px-3 h-8"
                        }
                      >
                        {disconnectToolLoading && (
                          <Loader2 className="size-3 animate-spin" />
                        )}
                        <span>{tool.connected ? "Disconnect" : "Connect"}</span>
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              {/* Schedule */}
              <section className="space-y-4">
                <SectionTitle
                  icon={<CalendarClock className="size-4" />}
                  title="Execution Schedule"
                />

                <div className="rounded-2xl border border-slate-200/90 bg-slate-50/70 p-4 space-y-4">
                  {/* Run Type */}
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-slate-700">
                      Execution Trigger
                    </label>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => updateSchedule("type", "once")}
                        className={`rounded-xl border p-3.5 text-left transition-all cursor-pointer ${
                          schedule.type === "once"
                            ? "border-slate-950 bg-slate-950 text-white shadow-xs"
                            : "border-slate-200 bg-white text-slate-800 hover:border-slate-300"
                        }`}
                      >
                        <p className="text-xs font-bold">Manual / Once</p>
                        <p
                          className={`mt-0.5 text-[11px] ${
                            schedule.type === "once"
                              ? "text-slate-300"
                              : "text-slate-500"
                          }`}
                        >
                          Triggered on demand
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => updateSchedule("type", "recurring")}
                        className={`rounded-xl border p-3.5 text-left transition-all cursor-pointer ${
                          schedule.type === "recurring"
                            ? "border-slate-950 bg-slate-950 text-white shadow-xs"
                            : "border-slate-200 bg-white text-slate-800 hover:border-slate-300"
                        }`}
                      >
                        <p className="text-xs font-bold">Recurring</p>
                        <p
                          className={`mt-0.5 text-[11px] ${
                            schedule.type === "recurring"
                              ? "text-slate-300"
                              : "text-slate-500"
                          }`}
                        >
                          Runs automatically
                        </p>
                      </button>
                    </div>
                  </div>

                  {/* Frequency */}
                  {schedule.type === "recurring" && (
                    <div className="space-y-2">
                      <label className="block text-xs font-semibold text-slate-700">
                        Cadence Frequency
                      </label>

                      <div className="grid grid-cols-3 gap-2">
                        {FREQUENCY_OPTIONS.map((frequency) => (
                          <button
                            key={frequency}
                            type="button"
                            onClick={() => updateSchedule("frequency", frequency)}
                            className={`rounded-xl border py-2 text-xs font-semibold transition-all cursor-pointer ${
                              schedule.frequency === frequency
                                ? "border-slate-950 bg-slate-950 text-white shadow-xs"
                                : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                            }`}
                          >
                            {frequency}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Time */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="agent-time"
                      className="flex items-center gap-1.5 text-xs font-semibold text-slate-700"
                    >
                      <Clock3 className="size-3.5 text-slate-500" />
                      <span>Execution Time ({schedule.timezone})</span>
                    </label>

                    <input
                      id="agent-time"
                      type="time"
                      value={schedule.time || ""}
                      onChange={(event) => updateSchedule("time", event.target.value)}
                      className="w-full bg-white border border-slate-200/90 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-950/10 focus:border-slate-900 transition-all"
                    />
                  </div>
                </div>
              </section>

              {/* Output Format */}
              <section className="space-y-4">
                <SectionTitle
                  icon={<FileText className="size-4" />}
                  title="Deliverable Format"
                />

                <div className="space-y-1.5">
                  <label
                    htmlFor="agent-output"
                    className="block text-xs font-semibold text-slate-700"
                  >
                    Format Instructions
                  </label>

                  <textarea
                    id="agent-output"
                    value={draftAgent.outputFormat || ""}
                    onChange={(event) => updateDraft("outputFormat", event.target.value)}
                    placeholder="e.g. Markdown bullet points, JSON schema, or HTML email preview..."
                    rows={3}
                    className="w-full bg-slate-50 border border-slate-200/90 rounded-xl p-3 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-950/10 focus:border-slate-900 transition-all resize-y leading-relaxed"
                  />
                </div>
              </section>
            </div>
          </ScrollArea>

          {/* Footer */}
          <SheetFooter className="border-t border-slate-100 bg-white px-6 py-4">
            <div className="flex w-full items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => handleOpenChange(false)}
                className="cog-secondary-button cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="cog-primary-button cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <Save className="size-3.5" />
                )}
                <span>{isSubmitting ? "Saving..." : "Save Changes"}</span>
              </button>
            </div>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}

function SectionTitle({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex size-7 items-center justify-center rounded-lg bg-slate-100 text-slate-900 border border-slate-200/80 shadow-2xs">
        {icon}
      </div>
      <h3 className="text-xs font-bold text-slate-950">{title}</h3>
    </div>
  );
}