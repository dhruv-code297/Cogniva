"use client"

import React, { useState } from "react"
import { AgentRunType } from "@/app/dashboard/run/page"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"
import { Calendar, ClipboardList, DotIcon, X } from "lucide-react"
import moment from "moment"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

type Props = {
  run: AgentRunType | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function RunDetailsDialog({ run, open, onOpenChange }: Props) {
  const [showPayload, setShowPayload] = useState(true)

  if (!run) return null

  // Extract human-readable text and the JSON payload
  let outputContent = ""
  let payloadObject: any = null

  if (run.output) {
    if (typeof run.output === "string") {
      try {
        const parsed = JSON.parse(run.output)
        payloadObject = parsed
        outputContent = parsed.finalOutput || parsed.output || run.output
      } catch {
        outputContent = run.output
        payloadObject = { finalOutput: run.output }
      }
    } else if (typeof run.output === "object") {
      payloadObject = run.output
      const output = run.output as Record<string, unknown>
      outputContent = String(output.finalOutput || output.output || JSON.stringify(run.output, null, 2))
    }
  } else if (run.error) {
    outputContent = `Error: ${run.error}`
    payloadObject = { error: run.error }
  } else {
    payloadObject = { status: run.status }
  }

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 border border-emerald-200">
            completed
          </span>
        )
      case "failed":
        return (
          <span className="inline-flex items-center rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-700 border border-red-200">
            failed
          </span>
        )
      case "running":
      case "queued":
        return (
          <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700 border border-amber-200">
            {status}
          </span>
        )
      case "scheduled":
      default:
        return (
          <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700 border border-slate-200">
            {status || "scheduled"}
          </span>
        )
    }
  }

  const formattedDate = run.completedAt
    ? moment(run.completedAt).format("MMM D, YYYY h:mm A")
    : run.createdAt
    ? moment(run.createdAt).format("MMM D, YYYY h:mm A")
    : ""

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="w-full sm:max-w-3xl max-h-[90vh] p-0 overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-2xl flex flex-col"
      >
        <DialogTitle className="sr-only">
          {run.name || "Agent Run Details"}
        </DialogTitle>

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-white">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-orange-50/70 p-1.5 shadow-2xs">
              {run.agentImage ? (
                <img
                  src={run.agentImage}
                  alt={run.name || "Agent"}
                  className="h-full w-full object-contain"
                />
              ) : (
                <span className="text-lg">🤖</span>
              )}
            </div>

            <div>
              <h3 className="text-base font-semibold text-slate-900 leading-tight">
                {run.name || "AI Agent"}
              </h3>
              <div className="mt-1 flex flex-wrap items-center gap-2.5 text-xs">
                {renderStatusBadge(run.status)}
                {formattedDate && (
                  <div className="flex items-center gap-1 text-slate-500">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    <span>{formattedDate}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onOpenChange(false)}
            aria-label="Close"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto px-6 py-5 space-y-5 flex-1">
          {/* Task section */}
          <div className="rounded-xl border border-slate-200/90 bg-slate-50/70 p-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-900">
              <ClipboardList className="h-4 w-4 text-slate-700" />
              <span>Task</span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              {run.task || "No task description provided."}
            </p>
          </div>

          {/* Output section */}
          <div>
            <h4 className="text-xs font-semibold text-slate-900 mb-2">Output</h4>
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
              {outputContent ? (
                <div className="prose prose-sm prose-slate max-w-none text-xs text-slate-800 leading-relaxed space-y-2 break-words [&_h1]:text-sm [&_h1]:font-bold [&_h2]:text-xs [&_h2]:font-bold [&_h3]:text-xs [&_h3]:font-semibold [&_p]:text-xs [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4 [&_li]:text-xs [&_strong]:font-semibold [&_a]:text-violet-600 [&_a]:underline">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {outputContent}
                  </ReactMarkdown>
                </div>
              ) : run.error ? (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs font-mono text-red-600">
                  {String(run.error)}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">
                  No output recorded for this run.
                </p>
              )}
            </div>
          </div>

          {/* Full result payload collapsible */}
          {payloadObject && (
            <div className="rounded-xl border border-slate-900 bg-slate-950 overflow-hidden text-slate-100 shadow-md">
              <button
                type="button"
                onClick={() => setShowPayload(!showPayload)}
                className="flex w-full items-center gap-2 px-4 py-3 text-xs font-semibold text-slate-200 hover:bg-slate-900/80 transition cursor-pointer select-none text-left"
              >
                <span className="text-[10px] transform transition-transform duration-150 inline-block">
                  {showPayload ? "▼" : "▶"}
                </span>
                <span>Full result payload</span>
              </button>

              {showPayload && (
                <div className="border-t border-slate-800/80 p-4 bg-slate-950">
                  <pre className="font-mono text-[11px] text-emerald-400 whitespace-pre overflow-x-auto max-h-64 leading-relaxed scrollbar-thin">
                    {JSON.stringify(payloadObject, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
