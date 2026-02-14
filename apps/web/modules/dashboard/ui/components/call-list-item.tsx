"use client";

import { cn } from "@workspace/ui/lib/utils";
import { Badge } from "@workspace/ui/components/badge";
import {
  BotIcon,
  AlertTriangleIcon,
  PhoneForwardedIcon,
} from "lucide-react";
import type { Doc } from "@workspace/backend/_generated/dataModel";

// ---------------------------------------------------------------------------
// Status display mapping — Minimal Clean SaaS
// ---------------------------------------------------------------------------
const statusConfig: Record<
  string,
  { label: string; icon: React.ElementType; color: string; bg: string }
> = {
  ai_handling: {
    label: "AI Handling",
    icon: BotIcon,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  handoff_requested: {
    label: "Handoff",
    icon: PhoneForwardedIcon,
    color: "text-red-600",
    bg: "bg-red-50",
  },
  queued: {
    label: "Queued",
    icon: AlertTriangleIcon,
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
};

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
// Component — Minimal Clean SaaS
// ---------------------------------------------------------------------------
export function CallListItem({
  call,
  isSelected,
  onClick,
}: {
  call: Doc<"liveCalls">;
  isSelected: boolean;
  onClick: () => void;
}) {
  const cfg = statusConfig[call.status] ?? statusConfig.queued;
  const StatusIcon = cfg!.icon;
  const alertLevel = call.alertLevel ?? "normal";

  return (
    <button
      id={`call-item-${call._id}`}
      onClick={onClick}
      className={cn(
        "w-full text-left px-4 py-3 border-l-2 transition-colors duration-150 cursor-pointer",
        "hover:bg-gray-50",
        isSelected
          ? "bg-blue-50 border-l-blue-600"
          : alertLevel === "critical"
            ? "border-l-red-500 bg-white"
            : alertLevel === "warning"
              ? "border-l-amber-400 bg-white"
              : "border-l-transparent bg-white"
      )}
    >
      {/* Row 1: Name + Duration */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium text-gray-900 truncate">
          {call.customer}
        </span>
        <span className="text-xs tabular-nums text-gray-400 font-mono shrink-0">
          {formatDuration(call.startedAt)}
        </span>
      </div>

      {/* Row 2: Status badge + Intent */}
      <div className="mt-1.5 flex items-center gap-2">
        <Badge
          variant="secondary"
          className={cn(
            "gap-1 text-[10px] px-1.5 py-0 font-medium border-0 rounded-md",
            cfg!.bg,
            cfg!.color
          )}
        >
          <StatusIcon className="h-3 w-3" />
          {cfg!.label}
        </Badge>
        <span className="text-xs text-gray-500 truncate">{call.intent}</span>
      </div>

      {/* Sentiment bar */}
      {call.sentimentScore !== undefined && (
        <div className="mt-2 flex items-center gap-2">
          <span className="text-[10px] text-gray-400">Sentiment</span>
          <div className="flex-1 h-1 rounded-full bg-gray-100 overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500",
                call.sentimentScore >= 0.7
                  ? "bg-green-500"
                  : call.sentimentScore >= 0.4
                    ? "bg-amber-500"
                    : "bg-red-500"
              )}
              style={{ width: `${call.sentimentScore * 100}%` }}
            />
          </div>
          <span className="text-[10px] tabular-nums text-gray-400 font-mono">
            {(call.sentimentScore * 100).toFixed(0)}%
          </span>
        </div>
      )}

      {/* Critical alert */}
      {alertLevel === "critical" && (
        <div className="mt-2 flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-50" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
          </span>
          <span className="text-[10px] font-medium text-red-600">
            Requires attention
          </span>
        </div>
      )}
    </button>
  );
}
