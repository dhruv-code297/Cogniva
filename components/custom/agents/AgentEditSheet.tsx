"use client"

import React, { FormEvent, useEffect, useState } from "react"
import {
  CalendarClock,
  Clock3,
  FileText,
  Plus,
  Save,
  Shuffle,
  Sparkles,
  Target,
  Wrench,
  X,
} from "lucide-react"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

import { CreatedAgentType } from "./CreateAgent"
import { toast } from "@/components/ui/toast"
import axios from "axios"


type Props = {
  children?: React.ReactNode
  agentConfig: CreatedAgentType | null
  connectedTools?: Tool[]
  setUpdatedAgent:any ,
  openSheet_?:boolean,
  closeSheet?:any
}


type ScheduleType = "once" | "recurring"


type AgentSchedule = {
  type: ScheduleType
  frequency: string
  time: string
}


type Tool = {
  id?: string
  slug?: string
  name?: string
  icon?: string
}


const FREQUENCY_OPTIONS = [
  "Daily",
  "Weekly",
  "Monthly",
]


export default function AgentEditSheet({
  children,
  agentConfig,
    setUpdatedAgent,
    openSheet_=false,
    closeSheet
}: Props) {

  const [open, setOpen] = useState(openSheet_)

  const [draftAgent, setDraftAgent] =
    useState<CreatedAgentType | null>(agentConfig)


  const [skillInput, setSkillInput] =
    useState("")

  const handleOpenChange = (value: boolean) => {
    setOpen(value)
    closeSheet?.(value)
  }

  useEffect(() => {
    if (agentConfig) {
      setDraftAgent({
        ...agentConfig,
        skills: agentConfig.skills || [],
      })
    }
  }, [agentConfig])


  const ShuffleImage = () => {
    const randomSeed = crypto.randomUUID()

    const newImage =
      "https://api.dicebear.com/10.x/bottts/svg?seed=" +
      randomSeed

    setDraftAgent((prev) => {

      if (!prev) return prev

      return {
        ...prev,
        agentImage: newImage,
      }
    })
  }


  const updateDraft = (
    key: keyof CreatedAgentType,
    value: any
  ) => {

    setDraftAgent((prev) => {

      if (!prev) return prev

      return {
        ...prev,
        [key]: value,
      }
    })
  }


  const getSchedule = (): AgentSchedule => {

    const schedule = draftAgent?.schedule as AgentSchedule | undefined

    return {
      type: schedule?.type || "once",
      frequency: schedule?.frequency || "Daily",
      time: schedule?.time || "09:00",
    }
  }


  const updateSchedule = (
    key: keyof AgentSchedule,
    value: string
  ) => {

    const schedule = getSchedule()

    updateDraft("schedule", {
      ...schedule,
      [key]: value,
    })
  }


  const handleSubmit =async (event:any)=>{
    event.preventDefault()
    const result  = await axios.put('/api/agent/configure',{
      ...draftAgent
    })
    if(result.data?.error){
        toast.add({
      type:"error",
  title: result.data?.error,
})
return;
    }
    setUpdatedAgent(draftAgent)
    toast.add({
      type:"success",
  title: "Agent Updated!",
})
  handleOpenChange(false)
  }



  const addSkill = () => {

    const skill = skillInput.trim()

    if (!skill) return

    if (
      draftAgent?.skills?.some(
        (item) =>
          item.toLowerCase() === skill.toLowerCase()
      )
    ) {
      setSkillInput("")
      return
    }

    updateDraft("skills", [
      ...(draftAgent?.skills || []),
      skill,
    ])

    setSkillInput("")
  }


  const removeSkill = (skill: string) => {

    updateDraft(
      "skills",
      (draftAgent?.skills || []).filter(
        (item) => item !== skill
      )
    )
  }


  const handleSkillKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {

    if (event.key === "Enter") {

      event.preventDefault()

      addSkill()
    }
  }


  if (!draftAgent) {
    return ( 
      <Sheet open={open} onOpenChange={(v:boolean)=>{setOpen(v);closeSheet(v)}}>
        <SheetTrigger>
          {children}
        </SheetTrigger>

        <SheetContent>
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-muted-foreground">
              Agent not found.
            </p>
          </div>
        </SheetContent>
      </Sheet>
    )
  }


  const schedule = getSchedule()


  return (
    <Sheet
      open={open}
      onOpenChange={handleOpenChange}
    >

      <SheetTrigger>
        {children}
      </SheetTrigger>


      <SheetContent
        side="right"
        className="w-full sm:max-w-xl p-0"
      >

        <form
          onSubmit={handleSubmit}
          className="flex h-full min-h-0 flex-col"
        >

          {/* -------------------------------------------------------------- */}
          {/* HEADER */}
          {/* -------------------------------------------------------------- */}

          <SheetHeader className="border-b px-6 py-5">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-100">

                <Sparkles
                  className="h-6 w-6 text-violet-600"
                />

              </div>


              <div className="min-w-0">

                <SheetTitle className="text-lg">
                  Edit Agent
                </SheetTitle>

                <SheetDescription>
                  Update how this agent looks, works, and runs.
                </SheetDescription>

              </div>

            </div>

          </SheetHeader>


          {/* -------------------------------------------------------------- */}
          {/* CONTENT */}
          {/* -------------------------------------------------------------- */}

          <ScrollArea className="min-h-0 flex-1">

            <div className="space-y-6 px-6 py-6">


              {/* ---------------------------------------------------------- */}
              {/* AGENT IMAGE */}
              {/* ---------------------------------------------------------- */}

              <section className="rounded-2xl border bg-slate-50 p-4">

                <div className="flex items-center gap-4">

                  <img
                    src={draftAgent.agentImage}
                    alt={draftAgent.name || "Agent"}
                    width={80}
                    height={80}
                    className="h-20 w-20 rounded-2xl border bg-white p-2"
                  />


                  <div className="min-w-0 flex-1">

                    <p className="font-medium text-slate-900">
                      Agent Image
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Shuffle to generate a new look.
                    </p>


                    <Button
                      type="button"
                      onClick={ShuffleImage}
                      variant="outline"
                      size="sm"
                      className="mt-3 gap-2"
                    >

                      <Shuffle className="h-4 w-4" />

                      Shuffle Image

                    </Button>

                  </div>

                </div>

              </section>


              {/* ---------------------------------------------------------- */}
              {/* BASIC INFORMATION */}
              {/* ---------------------------------------------------------- */}

              <section className="space-y-5">

                <SectionTitle
                  icon={<Sparkles className="h-4 w-4" />}
                  title="Basic Information"
                />


                <div className="space-y-2">

                  <label
                    htmlFor="agent-name"
                    className="text-sm font-medium text-slate-700"
                  >
                    Agent Name
                  </label>

                  <Input
                    id="agent-name"
                    value={draftAgent.name || ""}
                    onChange={(event) =>
                      updateDraft(
                        "name",
                        event.target.value
                      )
                    }
                    placeholder="Give your agent a name"
                    required
                  />

                </div>


                <div className="space-y-2">

                  <label
                    htmlFor="agent-description"
                    className="text-sm font-medium text-slate-700"
                  >
                    Description
                  </label>

                  <Textarea
                    id="agent-description"
                    value={
                      draftAgent.description || ""
                    }
                    onChange={(event) =>
                      updateDraft(
                        "description",
                        event.target.value
                      )
                    }
                    placeholder="Briefly describe what this agent does."
                    rows={3}
                    required
                  />

                </div>

              </section>


              {/* ---------------------------------------------------------- */}
              {/* OBJECTIVE */}
              {/* ---------------------------------------------------------- */}

              <section className="space-y-4">

                <SectionTitle
                  icon={<Target className="h-4 w-4" />}
                  title="Objective"
                />


                <div className="space-y-2">

                  <label
                    htmlFor="agent-objective"
                    className="text-sm font-medium text-slate-700"
                  >
                    What should this agent achieve?
                  </label>

                  <Textarea
                    id="agent-objective"
                    value={
                      draftAgent.objective || ""
                    }
                    onChange={(event) =>
                      updateDraft(
                        "objective",
                        event.target.value
                      )
                    }
                    placeholder="Define the main goal of your agent."
                    rows={4}
                    required
                  />

                </div>

              </section>


              {/* ---------------------------------------------------------- */}
              {/* INSTRUCTIONS */}
              {/* ---------------------------------------------------------- */}

              <section className="space-y-4">

                <SectionTitle
                  icon={<FileText className="h-4 w-4" />}
                  title="Instructions"
                />


                <div className="space-y-2">

                  <label
                    htmlFor="agent-instructions"
                    className="text-sm font-medium text-slate-700"
                  >
                    Agent Instructions
                  </label>

                  <Textarea
                    id="agent-instructions"
                    value={
                      draftAgent.instructions || ""
                    }
                    onChange={(event) =>
                      updateDraft(
                        "instructions",
                        event.target.value
                      )
                    }
                    placeholder="Tell your agent how it should work."
                    rows={6}
                    required
                  />

                  <p className="text-xs text-muted-foreground">
                    These instructions guide the agent when completing tasks.
                  </p>

                </div>

              </section>


              {/* ---------------------------------------------------------- */}
              {/* SKILLS */}
              {/* ---------------------------------------------------------- */}

              <section className="space-y-4">

                <SectionTitle
                  icon={<Sparkles className="h-4 w-4" />}
                  title="Skills"
                />


                <div className="space-y-3">

                  <div className="flex gap-2">

                    <Input
                      value={skillInput}
                      onChange={(event) =>
                        setSkillInput(
                          event.target.value
                        )
                      }
                      onKeyDown={
                        handleSkillKeyDown
                      }
                      placeholder="Add a skill"
                    />

                    <Button
                      type="button"
                      onClick={addSkill}
                      size="icon"
                      variant="outline"
                      disabled={!skillInput.trim()}
                    >

                      <Plus className="h-4 w-4" />

                    </Button>

                  </div>


                  {draftAgent.skills &&
                    draftAgent.skills.length > 0 && (

                      <div className="flex flex-wrap gap-2">

                        {draftAgent.skills.map(
                          (skill) => (

                            <div
                              key={skill}
                              className="flex items-center gap-1.5 rounded-lg border bg-slate-50 px-3 py-1.5"
                            >

                              <span className="text-sm text-slate-700">
                                {skill}
                              </span>


                              <button
                                type="button"
                                onClick={() =>
                                  removeSkill(
                                    skill
                                  )
                                }
                                className="rounded-md p-0.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
                              >

                                <X className="h-3.5 w-3.5" />

                              </button>

                            </div>

                          )
                        )}

                      </div>

                    )}


                  {(!draftAgent.skills ||
                    draftAgent.skills.length === 0) && (

                    <p className="text-xs text-muted-foreground">
                      No skills added yet.
                    </p>

                  )}

                </div>

              </section>


              {/* ---------------------------------------------------------- */}
              {/* CONNECTED TOOLS */}
              {/* ---------------------------------------------------------- */}

              <section className="space-y-4">

                <SectionTitle
                  icon={<Wrench className="h-4 w-4" />}
                  title="Connected Tools"
                />


                <div className="rounded-2xl border bg-slate-50 p-4">
                  <p className="text-sm text-muted-foreground">
                    0 of 0 connected
                  </p>
                </div>

              </section>


              {/* ---------------------------------------------------------- */}
              {/* SCHEDULE */}
              {/* ---------------------------------------------------------- */}

              <section className="space-y-4">

                <SectionTitle
                  icon={
                    <CalendarClock className="h-4 w-4" />
                  }
                  title="Schedule"
                />


                <div className="rounded-xl border bg-slate-50 p-4 space-y-4">


                  {/* Run Type */}

                  <div className="space-y-2">

                    <label className="text-sm font-medium text-slate-700">
                      Run Type
                    </label>

                    <div className="grid grid-cols-2 gap-2">

                      <button
                        type="button"
                        onClick={() =>
                          updateSchedule(
                            "type",
                            "once"
                          )
                        }
                        className={`rounded-xl border px-4 py-3 text-left transition ${
                          schedule.type === "once"
                            ? "border-violet-500 bg-violet-50"
                            : "border-slate-200 bg-white hover:border-violet-300"
                        }`}
                      >

                        <p className="text-sm font-medium">
                          Once
                        </p>

                        <p className="mt-1 text-xs text-muted-foreground">
                          Run one time
                        </p>

                      </button>


                      <button
                        type="button"
                        onClick={() =>
                          updateSchedule(
                            "type",
                            "recurring"
                          )
                        }
                        className={`rounded-xl border px-4 py-3 text-left transition ${
                          schedule.type === "recurring"
                            ? "border-violet-500 bg-violet-50"
                            : "border-slate-200 bg-white hover:border-violet-300"
                        }`}
                      >

                        <p className="text-sm font-medium">
                          Recurring
                        </p>

                        <p className="mt-1 text-xs text-muted-foreground">
                          Run automatically
                        </p>

                      </button>

                    </div>

                  </div>


                  {/* Frequency */}

                  {schedule.type ===
                    "recurring" && (

                    <div className="space-y-2">

                      <label className="text-sm font-medium text-slate-700">
                        Frequency
                      </label>

                      <div className="grid grid-cols-3 gap-2">

                        {FREQUENCY_OPTIONS.map(
                          (frequency) => (

                            <button
                              key={frequency}
                              type="button"
                              onClick={() =>
                                updateSchedule(
                                  "frequency",
                                  frequency
                                )
                              }
                              className={`rounded-lg border px-3 py-2.5 text-sm transition ${
                                schedule.frequency ===
                                frequency
                                  ? "border-violet-500 bg-violet-50 text-violet-700"
                                  : "border-slate-200 bg-white text-slate-600 hover:border-violet-300"
                              }`}
                            >

                              {frequency}

                            </button>

                          )
                        )}

                      </div>

                    </div>

                  )}


                  {/* Time */}

                  <div className="space-y-2">

                    <label
                      htmlFor="agent-time"
                      className="flex items-center gap-2 text-sm font-medium text-slate-700"
                    >

                      <Clock3 className="h-4 w-4 text-slate-400" />

                      Time

                    </label>


                    <Input
                      id="agent-time"
                      type="time"
                      value={schedule.time}
                      onChange={(event) =>
                        updateSchedule(
                          "time",
                          event.target.value
                        )
                      }
                    />

                  </div>

                </div>

              </section>


              {/* ---------------------------------------------------------- */}
              {/* OUTPUT FORMAT */}
              {/* ---------------------------------------------------------- */}

              <section className="space-y-4">

  <SectionTitle
    icon={<FileText className="h-4 w-4" />}
    title="Output Format"
  />

  <div className="space-y-2">

    <label
      htmlFor="agent-output"
      className="text-sm font-medium text-slate-700"
    >
      Output Format
    </label>

    <Textarea
      id="agent-output"
      value={draftAgent.outputFormat || ""}
      onChange={(event) =>
        updateDraft(
          "outputFormat",
          event.target.value
        )
      }
      placeholder="Describe how the agent should format its results."
      rows={4}
    />

    <p className="text-xs text-muted-foreground">
      This is used to guide how the agent presents its results.
    </p>

  </div>

</section>

            </div>

          </ScrollArea>


          {/* -------------------------------------------------------------- */}
          {/* FOOTER */}
          {/* -------------------------------------------------------------- */}

          <SheetFooter className="border-t bg-white px-6 py-4">

            <div className="flex w-full items-center justify-end gap-2">

              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
              >
                Cancel
              </Button>


              <Button
                type="submit"
                className="gap-2 bg-violet-700 hover:bg-violet-800"
              >

                <Save className="h-4 w-4" />

                Save Changes

              </Button>

            </div>

          </SheetFooter>

        </form>

      </SheetContent>

    </Sheet>
  )
}


/* ========================================================================== */
/* SECTION TITLE                                                               */
/* ========================================================================== */

type SectionTitleProps = {
  icon: React.ReactNode
  title: string
}


function SectionTitle({
  icon,
  title,
}: SectionTitleProps) {

  return (

    <div className="flex items-center gap-2">

      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-50 text-violet-600">

        {icon}

      </div>


      <h3 className="text-sm font-semibold text-slate-900">
        {title}
      </h3>

    </div>

  )
}