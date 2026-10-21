"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp, Bot, Loader2, Paperclip, Sparkles } from "lucide-react";
import { Bubble, BubbleContent } from "@/components/ui/bubble";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { CreatedAgentType } from "./CreateAgent";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Props = {
  agent: CreatedAgentType | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type ChatMessage = {
  id: string;
  role: "user" | "agent";
  content: string;
};

type MessagePart =
  | { type: "markdown"; content: string }
  | { type: "html"; content: string };

const htmlFenceRegex = /```html\s*([\s\S]*?)```/gi;

function splitHtmlPreviewParts(content: string): MessagePart[] {
  const parts: MessagePart[] = [];
  let lastIndex = 0;

  for (const match of content.matchAll(htmlFenceRegex)) {
    const matchIndex = match.index ?? 0;

    if (matchIndex > lastIndex) {
      parts.push({
        type: "markdown",
        content: content.slice(lastIndex, matchIndex),
      });
    }

    parts.push({
      type: "html",
      content: match[1]?.trim() ?? "",
    });

    lastIndex = matchIndex + match[0].length;
  }

  if (lastIndex < content.length) {
    parts.push({
      type: "markdown",
      content: content.slice(lastIndex),
    });
  }

  return parts.length ? parts : [{ type: "markdown", content }];
}

function buildPreviewDocument(html: string) {
  if (/<html[\s>]/i.test(html)) return html;

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <base target="_blank" />
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; min-height: 100vh; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #090d16; background: #ffffff; padding: 16px; }
    img, svg, video, canvas { max-width: 100%; }
    button, input, textarea, select { font: inherit; }
  </style>
</head>
<body>${html}</body>
</html>`;
}

export function AgentChatDrawer({ agent, open, onOpenChange }: Props) {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isAgentReplying, setIsAgentReplying] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, isAgentReplying]);

  const sendMessage = async () => {
    const message = prompt.trim();
    if (!message || isAgentReplying) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: message,
    };

    setMessages((prev) => [...prev, userMessage]);
    setPrompt("");
    setIsAgentReplying(true);

    try {
      const result = await axios.post("/api/agent/run", {
        agentConfig: agent,
        agentId: agent?.agentId,
        input: message,
      });

      const agentMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "agent",
        content:
          result.data?.finalOutput ||
          "Task completed successfully without explicit text output.",
      };

      setMessages((prev) => [...prev, agentMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "agent",
          content:
            "Sorry, I encountered an issue processing your request. Please check connected tools and try again.",
        },
      ]);
    } finally {
      setIsAgentReplying(false);
    }
  };

  if (!agent) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 p-0 sm:max-w-xl bg-white border-l border-slate-200/90 shadow-xl"
      >
        {/* Drawer Header */}
        <SheetHeader className="border-b border-slate-100 bg-white px-6 py-4.5 pr-14">
          <div className="flex items-center gap-3">
            <div className="size-11 shrink-0 rounded-xl bg-slate-100 border border-slate-200/80 flex items-center justify-center p-1.5 shadow-2xs">
              {agent.agentImage ? (
                <img
                  src={agent.agentImage}
                  alt={agent.name || "Agent"}
                  className="size-full object-cover rounded-lg"
                />
              ) : (
                <Bot size={22} className="text-slate-800" />
              )}
            </div>

            <div className="min-w-0">
              <SheetTitle className="truncate text-base font-bold text-slate-950">
                {agent.name}
              </SheetTitle>

              <SheetDescription className="text-xs text-slate-500 font-normal">
                Direct interaction & manual task execution
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        {/* Messages Stream */}
        <div className="min-h-0 flex-1 overflow-y-auto bg-slate-50/60 p-5 space-y-4">
          {/* Intro Welcome Card */}
          <div className="mx-auto my-3 max-w-sm text-center">
            <div className="mx-auto mb-3 flex size-11 items-center justify-center rounded-xl bg-slate-100 text-slate-900 border border-slate-200/80 shadow-2xs">
              <Sparkles size={18} />
            </div>

            <h2 className="text-sm font-bold text-slate-950">
              Interactive Session with {agent.name}
            </h2>

            <p className="mt-1 text-xs text-slate-500 leading-relaxed font-normal">
              {agent.objective || agent.description}
            </p>
          </div>

          <AgentMessage
            agent={agent}
            content={`Hello! I'm ${agent.name}. What task or inquiry would you like me to execute?`}
          />

          {messages.map((message) =>
            message.role === "user" ? (
              <div key={message.id} className="flex justify-end">
                <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-slate-950 text-white px-4 py-2.5 text-xs sm:text-sm font-medium shadow-xs leading-relaxed">
                  <p className="whitespace-pre-wrap break-words">
                    {message.content}
                  </p>
                </div>
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
            <div className="flex items-end gap-2.5">
              <div className="size-8 shrink-0 rounded-full border border-slate-200 bg-slate-100 flex items-center justify-center p-1">
                {agent.agentImage ? (
                  <img
                    src={agent.agentImage}
                    alt={agent.name}
                    className="size-full rounded-full object-cover"
                  />
                ) : (
                  <Bot size={15} className="text-slate-700" />
                )}
              </div>

              <div className="rounded-2xl rounded-tl-sm border border-slate-200/90 bg-white px-4 py-3 shadow-xs">
                <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
                  <Loader2 className="size-3.5 animate-spin text-slate-900" />
                  <span>{agent.name} is reasoning & executing tools...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="shrink-0 border-t border-slate-100 bg-white p-4">
          <div className="rounded-2xl border border-slate-200/90 bg-white p-2.5 shadow-xs transition-all focus-within:border-slate-900 focus-within:ring-2 focus-within:ring-slate-950/10">
            <Textarea
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              onKeyDown={(event) => {
                if (
                  event.key === "Enter" &&
                  !event.shiftKey &&
                  !event.nativeEvent.isComposing
                ) {
                  event.preventDefault();
                  sendMessage();
                }
              }}
              placeholder={
                isAgentReplying
                  ? `${agent.name} is executing...`
                  : `Ask or instruct ${agent.name}...`
              }
              disabled={isAgentReplying}
              aria-label="Message your agent"
              className="min-h-16 resize-none border-0 bg-transparent p-1.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus-visible:ring-0 shadow-none leading-relaxed"
            />

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-slate-400 font-medium pl-1.5">
                Press Enter to send
              </span>

              <Button
                type="button"
                size="icon"
                onClick={sendMessage}
                disabled={!prompt.trim() || isAgentReplying}
                className="size-8 rounded-full bg-slate-950 text-white hover:bg-slate-800 disabled:opacity-40 cursor-pointer shadow-xs transition-transform active:scale-95"
                aria-label="Send message"
              >
                {isAgentReplying ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <ArrowUp className="size-3.5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function AgentMessage({
  agent,
  content,
}: {
  agent: CreatedAgentType;
  content: string;
}) {
  return (
    <div className="flex items-end gap-2.5">
      <div className="size-8 shrink-0 rounded-full border border-slate-200 bg-slate-100 flex items-center justify-center p-1">
        {agent.agentImage ? (
          <img
            src={agent.agentImage}
            alt={agent.name || "Agent"}
            className="size-full rounded-full object-cover"
          />
        ) : (
          <Bot size={15} className="text-slate-700" />
        )}
      </div>

      <div className="max-w-[85%] rounded-2xl rounded-tl-sm border border-slate-200/90 bg-white p-4 shadow-xs text-xs sm:text-sm text-slate-800 leading-relaxed">
        <div className="w-full space-y-3 break-words">
          {splitHtmlPreviewParts(content).map((part, index) =>
            part.type === "html" ? (
              <iframe
                key={`${part.type}-${index}`}
                title="HTML preview"
                srcDoc={buildPreviewDocument(part.content)}
                sandbox="allow-scripts"
                className="h-64 w-full min-w-60 rounded-xl border border-slate-200 bg-white"
              />
            ) : (
              <div
                key={`${part.type}-${index}`}
                className="prose prose-sm prose-slate max-w-none text-xs sm:text-sm leading-relaxed"
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {part.content}
                </ReactMarkdown>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default AgentChatDrawer;