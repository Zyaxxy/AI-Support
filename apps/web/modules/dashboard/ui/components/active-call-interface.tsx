"use client";

import { useEffect, useRef } from "react";
import { cn } from "@workspace/ui/lib/utils";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { Separator } from "@workspace/ui/components/separator";
import { DicebearAvatar } from "@workspace/ui/components/dicebear-avatar";
import Image from "next/image";
import {
  PhoneOffIcon,
  MessageSquarePlusIcon,
  PhoneForwardedIcon,
  CrownIcon,
  ClockIcon,
  CornerUpLeftIcon,
} from "lucide-react";
import type { Doc } from "@workspace/backend/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "@workspace/backend/_generated/api";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDuration(startedAt: number): string {
  const elapsed = Math.max(0, Math.floor((Date.now() - startedAt) / 1000));
  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

// ---------------------------------------------------------------------------
// Waveform Visualizer
// ---------------------------------------------------------------------------
function WaveformVisualizer({
  barClassName,
  label,
  isActive = true,
}: {
  barClassName: string;
  label: string;
  isActive?: boolean;
}) {
  const barCount = 20;

  return (
    <div className="flex flex-col items-center gap-1 w-full max-w-[120px]">
      <div className="flex items-center justify-center gap-[2px] h-7 w-full">
        {Array.from({ length: barCount }).map((_, i) => (
          <div
            key={i}
            className={cn("w-[2px] rounded-full", barClassName)}
            style={{
              animation: isActive
                ? `audioWave 1s ease-in-out ${i * 0.05}s infinite alternate`
                : "none",
              height: isActive ? `${Math.max(20, Math.random() * 100)}%` : "3px",
              opacity: isActive ? 0.6 + Math.random() * 0.4 : 0.2,
            }}
          />
        ))}
      </div>
      <span className="text-[9px] font-medium text-muted-foreground/60 uppercase tracking-widest">
        {label}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Transcript View
// ---------------------------------------------------------------------------
function TranscriptView({
  messages,
  customerSeed,
}: {
  messages: Doc<"liveCalls">["transcript"];
  customerSeed: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <ScrollArea className="h-full px-4" ref={scrollRef}>
      <div className="space-y-4 py-4">
        {messages.map((msg, idx) => {
          const isAi = msg.sender === "ai";
          return (
            <div
              key={`${msg.timestamp}-${idx}`}
              className={cn(
                "group flex w-full gap-3",
                isAi ? "justify-start" : "justify-end"
              )}
            >
              {/* AI Avatar — logo.svg */}
              {isAi && (
                <div className="relative shrink-0">
                  <div className="flex size-[44px] items-center justify-center rounded-full bg-background ring-2 ring-background shadow-sm transition-transform duration-200 group-hover:scale-105 overflow-hidden">
                    <Image src="/logo.svg" alt="AI" width={28} height={28} />
                  </div>
                </div>
              )}

              <div className={cn("flex flex-col max-w-[72%]", isAi ? "items-start" : "items-end")}>
                {/* Message bubble */}
                <div className={cn(
                  "px-4 py-2.5 rounded-2xl text-xs leading-relaxed transition-colors",
                  isAi
                    ? "bg-accent/60 border border-border/40 text-foreground/90 rounded-tl-sm"
                    : "bg-primary text-primary-foreground rounded-tr-sm"
                )}>
                  {msg.text}
                </div>
                <time className="mt-1 text-[11px] text-muted-foreground/80 font-medium px-1">
                  {msg.timestamp}
                </time>
              </div>

              {/* Customer Avatar — DiceBear */}
              {!isAi && (
                <div className="relative shrink-0">
                  <DicebearAvatar
                    seed={customerSeed}
                    size={44}
                    className="ring-2 ring-background shadow-sm transition-transform duration-200 group-hover:scale-105"
                  />
                </div>
              )}
            </div>
          );
        })}

        {/* Typing indicator */}
        <div className="group flex w-full gap-3 justify-start">
          <div className="relative shrink-0">
            <div className="flex size-[44px] items-center justify-center rounded-full bg-background ring-2 ring-background shadow-sm overflow-hidden">
              <Image src="/logo.svg" alt="AI" width={28} height={28} />
            </div>
          </div>
          <div className="flex flex-col items-start">
            <h3 className="font-semibold text-sm text-foreground/90 mb-1">AI Assistant</h3>
            <div className="flex items-center gap-1 bg-accent/60 border border-border/40 px-4 py-2.5 rounded-2xl rounded-tl-sm">
              <span className="size-1.5 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:0ms]" />
              <span className="size-1.5 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:150ms]" />
              <span className="size-1.5 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:300ms]" />
            </div>
          </div>
        </div>

        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------
export function ActiveCallInterface({ call }: { call: Doc<"liveCalls"> }) {
  const intervene = useMutation(api.private.liveCalls.intervene);
  const endCall = useMutation(api.private.liveCalls.endCall);

  return (
    <div className="flex flex-col h-full bg-background/50 backdrop-blur-sm">
      {/* Waveform animation keyframes */}
      <style>{`
        @keyframes audioWave {
          0%   { transform: scaleY(0.2); }
          100% { transform: scaleY(1);   }
        }
      `}</style>

      {/* ── Header — exact same pattern as conversations-panel header ── */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border/50 px-4 py-3 shrink-0">
        <div className="flex items-center justify-between gap-3">
          {/* Left: Avatar + Customer identity */}
          <div className="flex items-center gap-3.5">
            {/* Avatar with subtle shadow — same as conversations-panel */}
            <div className="relative shrink-0">
              <DicebearAvatar
                seed={call.customer}
                size={44}
                className="ring-2 ring-background shadow-sm transition-transform duration-200"
              />
              {/* Live indicator — same as unread dot in conversations-panel */}
              <div className="absolute -top-0.5 -right-0.5 size-3 bg-green-500 rounded-full border-2 border-background shadow-sm" />
            </div>

            {/* Content — same structure as conversations-panel list item */}
            <div className="flex-1 min-w-0 space-y-1.5">
              {/* Header Row */}
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="font-semibold text-sm truncate text-foreground">
                  {call.customer}
                </h3>
                {call.plan && (
                  <Badge
                    variant="secondary"
                    className="shrink-0 flex items-center gap-1 h-5 px-1.5 text-[10px] font-medium"
                  >
                    <CrownIcon className="size-3" />
                    {call.plan}
                  </Badge>
                )}
              </div>

              {/* Message Preview Row */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 min-w-0 flex-1">
                  <CornerUpLeftIcon className="size-3 shrink-0 text-muted-foreground/60" />
                  <p className="text-xs leading-relaxed text-muted-foreground/80 truncate">
                    {call.intent ?? "General inquiry"}
                  </p>
                </div>
                <time className="shrink-0 text-[11px] text-muted-foreground/80 font-medium">
                  <span className="flex items-center gap-1">
                    <ClockIcon className="size-3" />
                    {formatDuration(call.startedAt)}
                  </span>
                </time>
              </div>
            </div>
          </div>

          {/* Right: Waveform + Live badge */}
          <div className="hidden md:flex items-center gap-4 shrink-0">
            <div className="flex items-center gap-3 px-3 py-1.5 bg-background/50 border border-border/50 rounded-xl">
              <WaveformVisualizer barClassName="bg-muted-foreground/40" label="AI" />
              <Separator orientation="vertical" className="h-6 bg-border/50" />
              <WaveformVisualizer barClassName="bg-primary" label="Caller" />
            </div>

            <Badge
              variant="secondary"
              className="gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold shadow-sm"
            >
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-green-500" />
              </span>
              LIVE
            </Badge>
          </div>
        </div>
      </div>

      {/* ── Transcript — styled as a list identical to conversations-panel ── */}
      <div className="flex-1 min-h-0">
        <TranscriptView
          messages={call.transcript}
          customerSeed={call.customer}
        />
      </div>

      {/* ── Controls footer — same backdrop pattern as header ── */}
      <div className="sticky bottom-0 z-10 bg-background/80 backdrop-blur-md border-t border-border/50 px-4 py-3 shrink-0">
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            className="flex-1 gap-2 h-8 text-xs font-semibold bg-destructive hover:bg-destructive/90 text-destructive-foreground shadow-sm transition-all duration-200"
            onClick={() => intervene({ callId: call._id })}
          >
            <PhoneOffIcon className="size-3.5" />
            Take Over
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 gap-2 h-8 text-xs font-medium border-border/50 bg-background/50 hover:bg-accent/50 hover:border-primary/30 shadow-sm transition-all duration-200"
          >
            <MessageSquarePlusIcon className="size-3.5" />
            Suggest Reply
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 gap-2 h-8 text-xs font-medium border-border/50 bg-background/50 hover:bg-accent/50 hover:border-primary/30 shadow-sm transition-all duration-200"
            onClick={() => endCall({ callId: call._id })}
          >
            <PhoneForwardedIcon className="size-3.5" />
            Transfer
          </Button>
        </div>
      </div>
    </div>
  );
}