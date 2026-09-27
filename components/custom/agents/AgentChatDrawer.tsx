"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowUp, Loader2, Paperclip, Sparkles } from "lucide-react"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
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

type MessagePart =
  | { type: "markdown"; content: string }
  | { type: "html"; content: string }

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
  <base target="_blank" />
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; min-height: 100vh; font-family: Inter, ui-sans-serif, system-ui, sans-serif; color: #111827; background: #f8fafc; }
    img, svg, video, canvas { max-width: 100%; }
    button, input, textarea, select { font: inherit; }
  </style>
</head>
<body>${html}</body>
</html>`
}

function AgentChatDrawer({ agent, open, onOpenChange }: Props) {
  const [prompt, setPrompt] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isAgentReplying, setIsAgentReplying] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    })
  }, [messages, isAgentReplying])

  const sendMessage = async () => {
    const message = prompt.trim()

    if (!message || isAgentReplying) return

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: message,
    }

    setMessages((prev) => [...prev, userMessage])
    setPrompt("")
    setIsAgentReplying(true)

    try {
     const result = await axios.post("/api/agent/run",{
        agentConfig:agent,
        agentId:agent?.agentId,
        input:prompt
     })

      const agentMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "agent",
        content: result.data?.finalOutput,
      }

      setMessages((prev) => [...prev, agentMessage])
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "agent",
          content: "Sorry, I couldn't process your message. Please try again.",
        },
      ])
    } finally {
      setIsAgentReplying(false)
    }
  }

  if (!agent) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 p-0 sm:max-w-xl"
      >
        <SheetHeader className="border-b px-5 py-4 pr-14">
          <div className="flex items-center gap-3">
            <img
              src={agent?.agentImage}
              alt={agent?.name || "Agent"}
              className="size-11 rounded-xl bg-slate-100 object-cover p-1"
            />

            <div className="min-w-0">
              <SheetTitle className="truncate text-base">
                {agent?.name}
              </SheetTitle>

              <SheetDescription className="text-xs">
                Chat with your agent and give it a task.
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="min-h-0 flex-1 overflow-y-auto bg-muted/20 p-5">
          <div className="mx-auto mb-3 flex size-11 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
            <Sparkles size={20} />
          </div>

          <div className="mx-auto mb-4 max-w-sm text-center">
            <h2 className="text-sm font-medium">
              Start a chat with {agent?.name}
            </h2>

            <p className="mt-1 text-xs text-muted-foreground">
              {agent?.objective || agent?.description}
            </p>
          </div>

          <AgentMessage
            agent={agent}
            content={`Hi! I'm ${agent?.name}. What would you like me to work on?`}
          />

          {messages.map((message) =>
            message.role === "user" ? (
              <div
                key={message.id}
                className="flex justify-end"
              >
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
            )
          )}

          {isAgentReplying && (
            <div className="flex items-end gap-2">
              <img
                src={agent?.agentImage}
                alt={agent?.name || "Agent"}
                className="size-8 rounded-full border bg-background object-cover p-1"
              />

              <Bubble align="start" variant="outline">
                <BubbleContent>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="size-4 animate-spin" />

                    <span className="text-sm">
                      {agent?.name} is thinking...
                    </span>
                  </div>
                </BubbleContent>
              </Bubble>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="shrink-0 border-t bg-background p-4">
          <div className="rounded-2xl border p-2 shadow-sm focus-within:border-purple-400">
            <Textarea
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              onKeyDown={(event) => {
                if (
                  event.key === "Enter" &&
                  !event.shiftKey &&
                  !event.nativeEvent.isComposing
                ) {
                  event.preventDefault()
                  sendMessage()
                }
              }}
              placeholder={
                isAgentReplying
                  ? `${agent?.name} is replying...`
                  : `Message ${agent?.name}...`
              }
              disabled={isAgentReplying}
              aria-label="Message your agent"
              className="min-h-16 resize-none border-0 bg-transparent shadow-none focus-visible:ring-0"
            />

            <div className="flex items-center justify-between pt-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Attach a file"
              >
                <Paperclip className="size-4" />
              </Button>

              <Button
                type="button"
                size="icon"
                onClick={sendMessage}
                disabled={!prompt.trim() || isAgentReplying}
                className="rounded-full bg-purple-600 text-white hover:bg-purple-700"
                aria-label="Send message"
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
  agent: CreatedAgentType 
  content: string
}) {
  return (
    <div className="flex items-end gap-2">
      <img
        src={agent.agentImage}
        alt={agent.name || "Agent"}
        className="size-8 rounded-full border bg-background object-cover p-1"
      />

      <Bubble align="start" variant="outline">
        <BubbleContent>
          <div className="w-full space-y-3 wrap-break-word">
            {splitHtmlPreviewParts(content).map((part, index) =>
              part.type === "html" ? (
                <iframe
                  key={`${part.type}-${index}`}
                  title="HTML preview"
                  srcDoc={buildPreviewDocument(part.content)}
                  sandbox="allow-scripts"
                  className="h-64 w-full min-w-65 rounded-lg border bg-white"
                />
              ) : (
                <div key={`${part.type}-${index}`} className="prose prose-sm max-w-none">
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

export default AgentChatDrawer