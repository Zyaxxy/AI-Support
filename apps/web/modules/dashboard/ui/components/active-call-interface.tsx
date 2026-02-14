"use client";

import { useEffect, useRef } from "react";
import { cn } from "@workspace/ui/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
} from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { Separator } from "@workspace/ui/components/separator";
import {
  UserIcon,
  BotIcon,
  PhoneOffIcon,
  MessageSquarePlusIcon,
  PhoneForwardedIcon,
  CalendarIcon,
  CrownIcon,
} from "lucide-react";
import type { Doc } from "@workspace/backend/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "@workspace/backend/_generated/api";

// ---------------------------------------------------------------------------
// Duration helper
// ---------------------------------------------------------------------------
function formatDuration(startedAt: number): string {
  const elapsed = Math.max(0, Math.floor((Date.now() - startedAt) / 1000));
  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

// ---------------------------------------------------------------------------
// Waveform visualizer — Minimal smooth lines style
// ---------------------------------------------------------------------------
function WaveformVisualizer({
  lineColor,
  label,
}: {
  lineColor: string;
  label: string;
}) {
  const barCount = 32;

  return (
    <div className="flex flex-col items-center gap-1.5">
      <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">
        {label}
      </span>
      <div className="flex items-end gap-[2px] h-10">
        {Array.from({ length: barCount }).map((_, i) => (
          <div
            key={i}
            className="w-[2px] rounded-full origin-bottom"
            style={{
              backgroundColor: lineColor,
              animation: `audioBar 0.8s ease-in-out ${i * 0.04}s infinite alternate`,
              height: `${Math.random() * 70 + 30}%`,
              opacity: 0.5 + Math.random() * 0.5,
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Transcript area — Minimal clean layout
// ---------------------------------------------------------------------------
function TranscriptView({
  messages,
}: {
  messages: Doc<"liveCalls">["transcript"];
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <ScrollArea className="h-56 pr-3" ref={scrollRef}>
      <div className="space-y-4 py-4">
        {messages.map((msg, idx) => {
          const isAi = msg.sender === "ai";
          return (
            <div
              key={`${msg.timestamp}-${idx}`}
              className={cn(
                "flex gap-2.5",
                isAi ? "justify-start" : "justify-end"
              )}
            >
              {isAi && (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-100">
                  <BotIcon className="h-3.5 w-3.5 text-gray-500" />
                </div>
              )}
              <div className="max-w-[75%]">
                <p
                  className={cn(
                    "text-sm leading-relaxed",
                    isAi
                      ? "text-gray-500"
                      : "text-gray-900 font-medium"
                  )}
                >
                  {msg.text}
                </p>
                <span className="block mt-1 text-[10px] text-gray-400">
                  {msg.timestamp}
                </span>
              </div>
              {!isAi && (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-50">
                  <UserIcon className="h-3.5 w-3.5 text-blue-600" />
                </div>
              )}
            </div>
          );
        })}

        {/* Live typing indicator */}
        <div className="flex gap-2.5 justify-start">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-100">
            <BotIcon className="h-3.5 w-3.5 text-gray-500" />
          </div>
          <div className="flex items-center gap-1.5 px-3 py-2">
            <span className="h-1.5 w-1.5 rounded-full bg-gray-300 animate-bounce [animation-delay:0ms]" />
            <span className="h-1.5 w-1.5 rounded-full bg-gray-300 animate-bounce [animation-delay:150ms]" />
            <span className="h-1.5 w-1.5 rounded-full bg-gray-300 animate-bounce [animation-delay:300ms]" />
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}

// ---------------------------------------------------------------------------
// CRM card — Clean minimal
// ---------------------------------------------------------------------------
function CrmCard({ call }: { call: Doc<"liveCalls"> }) {
  return (
    <Card className="border border-gray-200 bg-white rounded-lg shadow-none">
      <CardHeader className="pb-2 pt-3 px-4">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
          Customer Profile
        </span>
      </CardHeader>
      <CardContent className="px-4 pb-3 space-y-2">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white text-sm font-semibold">
            {call.customer
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">
              {call.customer}
            </p>
            {call.plan && (
              <div className="flex items-center gap-1 mt-0.5">
                <CrownIcon className="h-3 w-3 text-amber-500" />
                <span className="text-xs text-gray-500">{call.plan}</span>
              </div>
            )}
          </div>
        </div>
        <Separator className="my-1 bg-gray-100" />
        <div className="grid grid-cols-2 gap-2 text-xs">
          {call.plan && (
            <div className="flex items-center gap-1.5 text-gray-500">
              <CrownIcon className="h-3 w-3" />
              <span>{call.plan} Plan</span>
            </div>
          )}
          {call.lastInteraction && (
            <div className="flex items-center gap-1.5 text-gray-500">
              <CalendarIcon className="h-3 w-3" />
              <span>{call.lastInteraction}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Main component — Minimal Clean SaaS
// ---------------------------------------------------------------------------
export function ActiveCallInterface({ call }: { call: Doc<"liveCalls"> }) {
  const intervene = useMutation(api.private.liveCalls.intervene);
  const endCall = useMutation(api.private.liveCalls.endCall);

  return (
    <div className="flex flex-col h-full bg-white font-[Inter,sans-serif]">
      {/* Injected CSS for the waveform animation */}
      <style>{`
        @keyframes audioBar {
          0%   { transform: scaleY(0.3); }
          50%  { transform: scaleY(1);   }
          100% { transform: scaleY(0.5); }
        }
      `}</style>

      {/* ── Call header ── */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-gray-900">
              {call.customer}
            </h3>
            <Badge
              variant="secondary"
              className="bg-gray-100 text-gray-700 rounded-md px-2 py-0.5 text-xs uppercase tracking-wide border-0 font-medium"
            >
              {call.intent}
            </Badge>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Duration: {formatDuration(call.startedAt)}
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-40" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
          </span>
          <span className="text-xs font-medium text-green-600">LIVE</span>
        </div>
      </div>

      {/* ── Customer details ── */}
      <div className="px-6 py-3 border-b border-gray-200 shrink-0">
        <CrmCard call={call} />
      </div>

      {/* ── Waveform visualizer ── */}
      <div className="px-6 py-4 border-b border-gray-100 bg-white">
        <div className="flex items-center justify-center gap-10">
          <WaveformVisualizer lineColor="#E5E7EB" label="AI Channel" />
          <div className="h-8 w-px bg-gray-200" />
          <WaveformVisualizer lineColor="#2563EB" label="User Channel" />
        </div>
      </div>

      {/* ── Transcript ── */}
      <div className="flex-1 px-6 py-3 min-h-0 overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            Live Transcript
          </span>
          <Badge
            variant="secondary"
            className="text-[10px] gap-1 bg-gray-100 text-gray-600 border-0"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
            Streaming
          </Badge>
        </div>
        <TranscriptView messages={call.transcript} />
      </div>

      {/* ── Controls ── */}
      <div className="border-t border-gray-200 px-6 py-3 bg-white shrink-0">
        <div className="flex items-center gap-2">
          <Button
            id="btn-take-over"
            className="flex-1 gap-2 font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            onClick={() => intervene({ callId: call._id })}
          >
            <PhoneOffIcon className="h-4 w-4" />
            Take Over (Intervene)
          </Button>
          <Button
            id="btn-suggest-reply"
            variant="outline"
            size="sm"
            className="gap-1.5 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            <MessageSquarePlusIcon className="h-3.5 w-3.5" />
            Suggest Reply
          </Button>
          <Button
            id="btn-transfer"
            variant="outline"
            size="sm"
            className="gap-1.5 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            onClick={() => endCall({ callId: call._id })}
          >
            <PhoneForwardedIcon className="h-3.5 w-3.5" />
            Transfer
          </Button>
        </div>
      </div>
    </div>
  );
}
