"use client";

import { useState } from "react";
import { cn } from "@workspace/ui/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
} from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
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
  ShieldAlertIcon,
  ClockIcon,
  TrendingDownIcon,
  TrendingUpIcon,
  MinusIcon,
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
// KPI Card — Minimal Clean SaaS
// ---------------------------------------------------------------------------
type TrendStatus = "good" | "bad" | "neutral";

function KpiCard({
  label,
  value,
  trend,
  trendStatus,
  icon: Icon,
  isLoading,
}: {
  label: string;
  value: string | number;
  trend: string;
  trendStatus: TrendStatus;
  icon: React.ElementType;
  isLoading?: boolean;
}) {
  const TrendIcon =
    trendStatus === "good"
      ? TrendingDownIcon
      : trendStatus === "bad"
        ? TrendingUpIcon
        : MinusIcon;

  const trendColor =
    trendStatus === "good"
      ? "text-green-600"
      : trendStatus === "bad"
        ? "text-red-600"
        : "text-gray-500";

  return (
    <Card className="border border-gray-200 bg-white rounded-lg shadow-none hover:shadow-sm transition-shadow duration-200">
      <CardHeader className="flex flex-row items-center justify-between pb-0 pt-3 px-4">
        <span className="text-sm font-semibold text-gray-500 tracking-wide uppercase">
          {label}
        </span>
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
          <Icon className="h-4.5 w-4.5" />
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-3">
        {isLoading ? (
          <Skeleton className="h-10 w-20" />
        ) : (
          <div className="text-4xl font-bold text-gray-900 tracking-tight">
            {value}
          </div>
        )}
        <div className={cn("mt-1 flex items-center gap-1 text-xs", trendColor)}>
          <TrendIcon className="h-3 w-3" />
          <span>{trend}</span>
        </div>
      </CardContent>
    </Card>
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
    <div className="flex flex-col bg-white h-svh overflow-hidden font-[Inter,sans-serif]">
      {/* ───────────── Header ───────────── */}
      <header className="border-b border-gray-200 bg-white shrink-0 z-10">
        <div className="flex items-center justify-between px-6 py-3">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Live Monitor
            </h1>
            <p className="text-sm text-gray-500">
              Manage real-time voice sessions and handle escalations.
            </p>
          </div>

          {/* Global actions */}
          <div className="flex items-center gap-3">
            <Button
              id="btn-simulate-call"
              size="sm"
              className="gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              onClick={handleSimulateCall}
            >
              <PlayIcon className="h-3.5 w-3.5" />
              Simulate Call
            </Button>
            <div className="flex items-center gap-1.5 text-sm text-gray-500">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-40" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
              </span>
              System Operational
            </div>
          </div>
        </div>
      </header>

      {/* ───────────── Content ───────────── */}
      <div className="flex-1 flex flex-col gap-4 p-4 min-h-0 overflow-hidden">
        {/* ── KPI Cards ── */}
        <section aria-label="Key performance indicators" className="shrink-0">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <KpiCard
              label="Live Concurrent Calls"
              value={kpi?.liveConcurrentCalls ?? 0}
              trend={
                isLoading
                  ? "Loading..."
                  : kpi?.liveConcurrentCalls === 0
                    ? "No active calls"
                    : "Real-time"
              }
              trendStatus="neutral"
              icon={PhoneCallIcon}
              isLoading={isLoading}
            />
            <KpiCard
              label="Intervention Rate"
              value={isLoading ? "—" : `${kpi?.interventionRate ?? 0}%`}
              trend={
                isLoading
                  ? "Loading..."
                  : (kpi?.interventionRate ?? 0) <= 10
                    ? "Within target"
                    : "Above target"
              }
              trendStatus={
                (kpi?.interventionRate ?? 0) <= 10 ? "good" : "bad"
              }
              icon={ShieldAlertIcon}
              isLoading={isLoading}
            />
            <KpiCard
              label="Avg Resolution Time"
              value={
                isLoading
                  ? "—"
                  : kpi?.avgResolutionMs
                    ? formatMs(kpi.avgResolutionMs)
                    : "No data"
              }
              trend={
                isLoading
                  ? "Loading..."
                  : kpi?.avgResolutionMs
                    ? "From resolved calls"
                    : "No resolved calls yet"
              }
              trendStatus="neutral"
              icon={ClockIcon}
              isLoading={isLoading}
            />
          </div>
        </section>

        {/* ── Operational split pane ── */}
        <section aria-label="Operational view" className="flex-1 min-h-0 overflow-hidden">
          <Card className="h-full border border-gray-200 rounded-lg shadow-none overflow-hidden bg-white">
            <ResizablePanelGroup
              direction="horizontal"
              className="h-full"
            >
              {/* ── Left panel: call list ── */}
              <ResizablePanel defaultSize={30} minSize={22} maxSize={45}>
                <div className="flex flex-col h-full">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <h2 className="text-sm font-semibold text-gray-900">
                      Incoming &amp; Active
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {isLoading
                        ? "Loading..."
                        : `${calls.length} active call${calls.length !== 1 ? "s" : ""}`}
                    </p>
                  </div>
                  <ScrollArea className="flex-1">
                    {isLoading ? (
                      <div className="space-y-1 p-2">
                        {[...Array(3)].map((_, i) => (
                          <div className="p-3 space-y-2" key={i}>
                            <div className="flex justify-between">
                              <Skeleton className="h-4 w-28" />
                              <Skeleton className="h-4 w-12" />
                            </div>
                            <Skeleton className="h-5 w-20" />
                            <Skeleton className="h-2 w-full" />
                          </div>
                        ))}
                      </div>
                    ) : calls.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 mb-3">
                          <PhoneOffIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <p className="text-sm font-medium text-gray-900">
                          No active calls
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          Click &quot;Simulate Call&quot; to create one.
                        </p>
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-100">
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

              <ResizableHandle withHandle />

              {/* ── Right panel: active call ── */}
              <ResizablePanel defaultSize={70}>
                {isLoading ? (
                  <div className="p-6 space-y-4">
                    <div className="flex justify-between">
                      <Skeleton className="h-6 w-40" />
                      <Skeleton className="h-5 w-16" />
                    </div>
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-56 w-full" />
                    <Skeleton className="h-24 w-full" />
                  </div>
                ) : selectedCall ? (
                  <ActiveCallInterface call={selectedCall} />
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center px-6">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 mb-4">
                      <PhoneCallIcon className="h-6 w-6 text-gray-400" />
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      No call selected
                    </p>
                    <p className="mt-1 text-xs text-gray-500 max-w-xs">
                      Select a call from the list or click &quot;Simulate
                      Call&quot; to create one.
                    </p>
                  </div>
                )}
              </ResizablePanel>
            </ResizablePanelGroup>
          </Card>
        </section>
      </div>
    </div>
  );
};
