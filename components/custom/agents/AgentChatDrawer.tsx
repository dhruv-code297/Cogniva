"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowUp, Loader2, Paperclip, Sparkles } from "lucide-react"

import { Bubble, BubbleContent, BubbleGroup } from "@/components/ui/bubble"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"
import { CreatedAgentType } from "./CreateAgent"
import axios from "axios"
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Props = {
  agent: CreatedAgentType | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

type ChatMessage = {
  id: string
  role: "user" | "agent"
  content: string
}

type MessagePart = {
  type: "markdown" | "html"
  content: string
}

const htmlFenceRegex = /```html\s*([\s\S]*?)```/gi

function splitHtmlPreviewParts(content: string): MessagePart[] {
  const parts: MessagePart[] = []
  let lastIndex = 0

  for (const match of content.matchAll(htmlFenceRegex)) {
    const matchIndex = match.index ?? 0

    if (matchIndex > lastIndex) {
      parts.push({
        type: "markdown",
        content: content.slice(lastIndex, matchIndex),
      })
    }

    parts.push({
      type: "html",
      content: match[1]?.trim() ?? "",
    })

    lastIndex = matchIndex + match[0].length
  }

  if (lastIndex < content.length) {
    parts.push({
      type: "markdown",
      content: content.slice(lastIndex),
    })
  }

  return parts.length ? parts : [{ type: "markdown", content }]
}

function buildPreviewDocument(html: string) {
  if (/<html[\s>]/i.test(html)) return html

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      * { box-sizing: border-box; }
      body { margin: 0; min-height: 100vh; font-family: Arial, sans-serif; color: #111827; background: #f8fafc; }
      img, svg, video, canvas { max-width: 100%; }
      button, input, textarea, select { font: inherit; }
    </style>
  </head>
  <body>${html}</body>
</html>`
}

function createMessage(role: ChatMessage["role"], content: string): ChatMessage {
  return {
    id: crypto.randomUUID(),
    role,
    content,
  }
}

export default function AgentChatDrawer({
  agent,
  open,
  onOpenChange,
}: Props) {
  const [prompt, setPrompt] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isAgentReplying, setIsAgentReplying] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    setPrompt("")
    setMessages([
      {
        id: "welcome",
        role: "agent",
        content: `Hi! I'm ${agent?.name}. What would you like me to work on?`,
      },
    ])
  }, [agent?.name, open])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isAgentReplying])

  const sendMessage = async () => {
    const message = prompt.trim()

    if (!message || isAgentReplying) return

    const userMessage : ChatMessage={
        id:crypto.randomUUID(),
        role:'user',
        content:message
    }

    setMessages((prev) => [...prev, userMessage])
    setPrompt("")
    setIsAgentReplying(true)

    try {
    
        const result = await axios.post("/api/agent/run",{
            agentConfig:agent,
            agentId:agent?.agentId,
          input:message
        })

      const agentMessage: ChatMessage ={
        id:crypto.randomUUID(),
        role:'agent',
        content:result.data?.finalOutput,
    }

      setMessages((prev) => [...prev, agentMessage])
    } catch {
      setMessages((prev) => [
        ...prev,
        createMessage("agent", "Sorry, I couldn't process your message."),
      ])
    } finally {
      setIsAgentReplying(false)
    }
  }

  const handlePromptKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      event.preventDefault()
      void sendMessage()
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 p-0 sm:max-w-md"
      >
        <SheetHeader className="border-b px-5 py-4 pr-14">
          <div className="flex items-center gap-3">
            <img
              src={agent?.agentImage}
              alt={agent?.name || "Agent"}
              className="size-11 rounded-xl border bg-slate-50 object-cover p-1"
            />

            <div className="min-w-0">
              <SheetTitle className="truncate text-base">
                {agent?.name}
              </SheetTitle>
              <SheetDescription className="truncate">
                Chat with your agent and give it a task.
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="min-h-0 flex-1 overflow-y-auto bg-background px-4 py-5">
          <div className="flex min-h-full flex-col">
            <div className="flex min-h-[min(55vh,520px)] flex-col items-center justify-center text-center">
              <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-purple-100 text-purple-600">
                <Sparkles className="size-6" />
              </div>

              <h2 className="max-w-xs text-sm font-semibold">
                Start a chat with {agent?.name}
              </h2>

              <p className="mt-1 max-w-xs text-xs leading-5 text-muted-foreground">
                {agent?.objective || agent?.description}
              </p>
            </div>

            <BubbleGroup className="mx-auto w-full max-w-sm gap-3">
              {messages.map((message) =>
                message.role === "user" ? (
                  <div key={message.id} className="flex justify-end">
                    <Bubble align="end" variant="default">
                      <BubbleContent>
                        <p className="whitespace-pre-wrap wrap-break-word">
                          {message.content}
                        </p>
                      </BubbleContent>
                    </Bubble>
                  </div>
                ) : (
                  <AgentMessage
                    key={message.id}
                    agent={agent}
                    content={message.content}
                  />
                ),
              )}

              {isAgentReplying && (
                <div className="flex items-end gap-2">
                  <img
                    src={agent?.agentImage}
                    alt={agent?.name || "Agent"}
                    className="size-8 rounded-full border bg-slate-50 object-cover p-1"
                  />
                  <Bubble align="start" variant="outline">
                    <BubbleContent>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Loader2 className="size-4 animate-spin" />
                        <span>{agent?.name} is thinking...</span>
                      </div>
                    </BubbleContent>
                  </Bubble>
                </div>
              )}

              <div ref={messagesEndRef} />
            </BubbleGroup>
          </div>
        </div>

        <div className="shrink-0 border-t bg-background p-4">
          <div className="rounded-2xl border border-purple-300 bg-background p-2 shadow-sm focus-within:ring-2 focus-within:ring-purple-200">
            <Textarea
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              onKeyDown={handlePromptKeyDown}
              placeholder={`Message ${agent?.name}`}
              className="min-h-10 resize-none border-0 px-2 py-2 text-sm shadow-none focus-visible:ring-0"
              rows={1}
            />

            <div className="flex items-center justify-between px-1">
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label="Attach a file"
              >
                <Paperclip className="size-4" />
              </Button>

              <Button
                type="button"
                size="icon-sm"
                onClick={() => void sendMessage()}
                disabled={!prompt.trim() || isAgentReplying}
                aria-label="Send message"
                className="rounded-full bg-purple-600 hover:bg-purple-700"
              >
                {isAgentReplying ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <ArrowUp className="size-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

function AgentMessage({
  agent,
  content,
}: {
  agent: CreatedAgentType | null
  content: string
}) {
  if (!agent) return null

  return (
    <div className="flex items-end gap-2">
      <img
        src={agent.agentImage}
        alt={agent.name || "Agent"}
        className="size-8 rounded-full border bg-slate-50 object-cover p-1"
      />

      <Bubble align="start" variant="outline">
        <BubbleContent>
          <div className="space-y-3 wrap-break-word">
            {splitHtmlPreviewParts(content).map((part, index) =>
              part.type === "html" ? (
                <iframe
                  key={`html-${index}`}
                  title="HTML preview"
                  srcDoc={buildPreviewDocument(part.content)}
                  sandbox=""
                  className="h-64 w-full min-w-65 rounded-lg border bg-white"
                />
              ) : (
                <div key={`markdown-${index}`} className="prose prose-sm max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {part.content}
                  </ReactMarkdown>
                </div>
              ),
            )}
          </div>
        </BubbleContent>
      </Bubble>
    </div>
  )
}
