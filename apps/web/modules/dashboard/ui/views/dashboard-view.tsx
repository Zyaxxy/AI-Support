"use client";

import { useState } from "react";
import { cn } from "@workspace/ui/lib/utils";
import { Button } from "@workspace/ui/components/button";
import { Skeleton } from "@workspace/ui/components/skeleton";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@workspace/ui/components/resizable";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import {
  PlayIcon,
  PhoneCallIcon,
  PhoneOffIcon,
} from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import type { Id } from "@workspace/backend/_generated/dataModel";

import { CallListItem } from "@/modules/dashboard/ui/components/call-list-item";
import { ActiveCallInterface } from "@/modules/dashboard/ui/components/active-call-interface";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatMs(ms: number): string {
  if (ms <= 0) return "—";
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes === 0) return `${seconds}s`;
  return `${minutes}m ${seconds}s`;
}

// ---------------------------------------------------------------------------
// KPI Stat — ultra-compact chip
// ---------------------------------------------------------------------------
function KpiStat({
  label,
  value,
  dotColor,
  isLoading,
}: {
  label: string;
  value: string | number;
  dotColor: string;
  isLoading?: boolean;
}) {
  return (
    <div className="flex items-center gap-2.5 px-3 py-2 bg-white border border-gray-200/80 rounded-lg shadow-[0_1px_2px_0_rgba(0,0,0,0.03)]">
      <span className={cn("size-2 rounded-full shrink-0", dotColor)} />
      <span className="text-[11px] text-gray-500 font-medium whitespace-nowrap">{label}</span>
      {isLoading ? (
        <Skeleton className="h-4 w-8" />
      ) : (
        <span className="text-sm font-bold text-gray-900 tabular-nums">{value}</span>
      )}
    </div>
  );
}


// ---------------------------------------------------------------------------
// Main view — Minimal Clean SaaS
// ---------------------------------------------------------------------------
export const DashboardView = () => {
  const [selectedCallId, setSelectedCallId] = useState<Id<"liveCalls"> | null>(
    null
  );

  // Real-time queries
  const liveData = useQuery(api.private.liveCalls.getMany);
  const simulateCall = useMutation(api.private.liveCalls.simulateCall);

  const isLoading = liveData === undefined;
  const calls = liveData?.calls ?? [];
  const kpi = liveData?.kpi;

  // Derive status counts from calls
  const aiHandlingCount = calls.filter((c) => c.status === "ai_handling").length;
  const queuedCount = calls.filter((c) => c.status === "queued").length;
  const escalatedCount = calls.filter((c) => c.status === "handoff_requested").length;

  // Auto-select the first call if none selected or selected no longer exists
  const effectiveSelectedId =
    selectedCallId && calls.some((c) => c._id === selectedCallId)
      ? selectedCallId
      : calls.length > 0
        ? calls[0]!._id
        : null;

  const selectedCall = effectiveSelectedId
    ? calls.find((c) => c._id === effectiveSelectedId) ?? null
    : null;

  const handleSimulateCall = async () => {
    try {
      const newId = await simulateCall();
      setSelectedCallId(newId);
    } catch (error) {
      console.error("Failed to simulate call:", error);
    }
  };

  return (
    <div className="flex flex-col bg-white h-svh overflow-hidden font-[Inter,sans-serif] text-gray-900">
      {/* ───────────── Header ───────────── */}
      <header className="border-b border-gray-200 bg-white shrink-0 z-10 h-16 flex items-center">
        <div className="flex w-full items-center justify-between px-6">
          <div className="flex flex-col">
            <h1 className="text-lg font-bold text-gray-900 leading-tight">
              Live Monitor
            </h1>
            <p className="text-xs text-gray-500">
              Real-time oversight
            </p>
          </div>

          {/* Global actions */}
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full border border-green-100">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
              </span>
              <span className="text-xs font-medium text-green-700">System Online</span>
            </div>

            <Button
              id="btn-simulate-call"
              size="sm"
              className="gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm border border-transparent transition-all active:scale-95"
              onClick={handleSimulateCall}
            >
              <PlayIcon className="h-3.5 w-3.5 fill-current" />
              Simulate Call
            </Button>
          </div>
        </div>
      </header>

      {/* ───────────── Content ───────────── */}
      <div className="flex-1 flex flex-col gap-4 p-6 min-h-0 bg-gray-50/50">
        
        {/* ── KPI Row (Compact chips) ── */}
        <section aria-label="Key performance indicators" className="shrink-0">
          <div className="flex flex-wrap items-center gap-2">
            <KpiStat
              label="Active Calls"
              value={kpi?.liveConcurrentCalls ?? 0}
              dotColor="bg-green-500"
              isLoading={isLoading}
            />
            <KpiStat
              label="AI Handling"
              value={aiHandlingCount}
              dotColor="bg-blue-500"
              isLoading={isLoading}
            />
            <KpiStat
              label="Queued"
              value={queuedCount}
              dotColor="bg-amber-500"
              isLoading={isLoading}
            />
            <KpiStat
              label="Escalated"
              value={escalatedCount}
              dotColor="bg-red-500"
              isLoading={isLoading}
            />
            <KpiStat
              label="Avg Resolution"
              value={
                isLoading
                  ? "—"
                  : kpi?.avgResolutionMs
                    ? formatMs(kpi.avgResolutionMs)
                    : "—"
              }
              dotColor="bg-violet-500"
              isLoading={isLoading}
            />
            <KpiStat
              label="Intervention Rate"
              value={isLoading ? "—" : `${kpi?.interventionRate ?? 0}%`}
              dotColor="bg-violet-500"
              isLoading={isLoading}
            />
            <KpiStat
              label="Active Chats"
              value={kpi?.liveConcurrentChats ?? 0}
              dotColor="bg-green-500"
              isLoading={isLoading}
            />
          </div>
        </section>

        {/* ── Operational split pane ── */}
        <section aria-label="Operational view" className="flex-1 min-h-0 overflow-hidden shadow-sm rounded-xl border border-gray-200 bg-white">
          <ResizablePanelGroup
            direction="horizontal"
            className="h-full"
          >
            {/* ── Left panel: call list ── */}
            <ResizablePanel defaultSize={25} minSize={20} maxSize={35} className="bg-white">
              <div className="flex flex-col h-full">
                <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between bg-white">
                  <h2 className="text-sm font-semibold text-gray-900">
                    Queue
                  </h2>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                    {calls.length}
                  </span>
                </div>
                
                <ScrollArea className="flex-1">
                  {isLoading ? (
                    <div className="space-y-2 p-3">
                      {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} className="h-16 w-full rounded-lg" />
                      ))}
                    </div>
                  ) : calls.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full p-6 text-center text-gray-500">
                      <div className="h-10 w-10 rounded-full bg-gray-50 flex items-center justify-center mb-3">
                        <PhoneOffIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <p className="text-sm">No active calls</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-50">
                      {calls.map((call) => (
                        <CallListItem
                          key={call._id}
                          call={call}
                          isSelected={call._id === effectiveSelectedId}
                          onClick={() => setSelectedCallId(call._id)}
                        />
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </div>
            </ResizablePanel>

            <ResizableHandle withHandle className="bg-gray-100 border-l border-gray-100" />

            {/* ── Right panel: active call ── */}
            <ResizablePanel defaultSize={75} className="bg-white">
              {isLoading ? (
                <div className="p-8 space-y-6">
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-8 w-24" />
                  </div>
                  <Skeleton className="h-32 w-full rounded-xl" />
                  <Skeleton className="h-64 w-full rounded-xl" />
                </div>
              ) : selectedCall ? (
                <ActiveCallInterface call={selectedCall} />
              ) : (
                <div className="h-full flex flex-col items-center justify-center bg-gray-50/30 text-center">
                  <div className="h-16 w-16 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center mb-4">
                     <PhoneCallIcon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-gray-900 font-semibold">Ready to Monitor</h3>
                  <p className="text-sm text-gray-500 mt-1 max-w-xs">
                    Select a conversation from the queue to view real-time details.
                  </p>
                </div>
              )}
            </ResizablePanel>
          </ResizablePanelGroup>
        </section>
      </div>
    </div>
  );
};