"use client";

import { useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
} from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { useOrganization, useUser } from "@clerk/nextjs";
import Link from "next/link";
import {
  InboxIcon,
  AlertTriangleIcon,
  CheckCircle2Icon,
  LibraryBigIcon,
  ArrowRightIcon,
  Mic,
  PaletteIcon,
  SparklesIcon,
  TrendingUpIcon,
  MessageSquareIcon,
  ZapIcon,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Stat Card
// ---------------------------------------------------------------------------
function StatCard({
  title,
  value,
  icon: Icon,
  description,
  href,
  gradient,
  isLoading,
}: {
  title: string;
  value: number | string;
  icon: React.ElementType;
  description: string;
  href: string;
  gradient: string;
  isLoading?: boolean;
}) {
  return (
    <Link href={href} id={`stat-card-${title.toLowerCase().replace(/\s+/g, "-")}`}>
      <Card className="group relative overflow-hidden border-0 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer">
        {/* gradient accent bar */}
        <div
          className={`absolute inset-x-0 top-0 h-1 ${gradient} opacity-80 transition-opacity group-hover:opacity-100`}
        />
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardDescription className="text-sm font-medium">
            {title}
          </CardDescription>
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-lg ${gradient} text-white shadow-sm`}
          >
            <Icon className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-20" />
          ) : (
            <div className="text-3xl font-bold tracking-tight">{value}</div>
          )}
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </Link>
  );
}

// ---------------------------------------------------------------------------
// Quick‑Action Card
// ---------------------------------------------------------------------------
function QuickActionCard({
  title,
  description,
  icon: Icon,
  href,
  accent,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  href: string;
  accent: string;
}) {
  return (
    <Link href={href} id={`quick-action-${title.toLowerCase().replace(/\s+/g, "-")}`}>
      <Card className="group relative overflow-hidden border border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-border hover:shadow-lg hover:-translate-y-0.5 cursor-pointer">
        <CardContent className="flex items-center gap-4 py-4">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${accent} transition-transform duration-300 group-hover:scale-110`}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold leading-none">{title}</p>
            <p className="mt-1 text-xs text-muted-foreground truncate">
              {description}
            </p>
          </div>
          <ArrowRightIcon className="h-4 w-4 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1" />
        </CardContent>
      </Card>
    </Link>
  );
}

// ---------------------------------------------------------------------------
// Main Dashboard View
// ---------------------------------------------------------------------------
export const DashboardView = () => {
  const { user } = useUser();
  const { organization } = useOrganization();

  // Fetch conversations for each status to derive counts
  const unresolvedData = useQuery(api.private.conversation.getMany, {
    status: "unresolved",
    paginationOpts: { numItems: 1, cursor: null },
  });

  const escalatedData = useQuery(api.private.conversation.getMany, {
    status: "escalated",
    paginationOpts: { numItems: 1, cursor: null },
  });

  const resolvedData = useQuery(api.private.conversation.getMany, {
    status: "resolved",
    paginationOpts: { numItems: 1, cursor: null },
  });

  const allConversationsData = useQuery(api.private.conversation.getMany, {
    paginationOpts: { numItems: 5, cursor: null },
  });

  const isLoading =
    unresolvedData === undefined ||
    escalatedData === undefined ||
    resolvedData === undefined;

  // Greeting based on time of day
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const firstName = user?.firstName ?? "there";

  // Recent conversations for the activity feed
  const recentConversations = allConversationsData?.page ?? [];

  return (
    <div className="flex flex-1 flex-col bg-muted/30 min-h-svh">
      {/* ───────────── Header ───────────── */}
      <header className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-6 py-6 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/20">
              <SparklesIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                {greeting}, {firstName}
              </h1>
              <p className="text-sm text-muted-foreground">
                {organization?.name
                  ? `Here's what's happening with ${organization.name} today.`
                  : "Here's an overview of your support dashboard."}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* ───────────── Content ───────────── */}
      <div className="mx-auto w-full max-w-7xl flex-1 space-y-8 px-6 py-8 sm:px-8">
        {/* ── Stat Cards ── */}
        <section aria-label="Overview statistics">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Conversations"
              value={
                isLoading
                  ? "—"
                  : (unresolvedData?.page.length ?? 0) +
                    (escalatedData?.page.length ?? 0) +
                    (resolvedData?.page.length ?? 0)
              }
              icon={MessageSquareIcon}
              description="All conversations"
              href="/conversations"
              gradient="bg-gradient-to-br from-blue-500 to-blue-600"
              isLoading={isLoading}
            />
            <StatCard
              title="Unresolved"
              value={isLoading ? "—" : (unresolvedData?.page.length ?? 0)}
              icon={InboxIcon}
              description="Awaiting response"
              href="/conversations"
              gradient="bg-gradient-to-br from-amber-500 to-orange-500"
              isLoading={isLoading}
            />
            <StatCard
              title="Escalated"
              value={isLoading ? "—" : (escalatedData?.page.length ?? 0)}
              icon={AlertTriangleIcon}
              description="Needs attention"
              href="/conversations"
              gradient="bg-gradient-to-br from-rose-500 to-red-500"
              isLoading={isLoading}
            />
            <StatCard
              title="Resolved"
              value={isLoading ? "—" : (resolvedData?.page.length ?? 0)}
              icon={CheckCircle2Icon}
              description="Successfully closed"
              href="/conversations"
              gradient="bg-gradient-to-br from-emerald-500 to-green-500"
              isLoading={isLoading}
            />
          </div>
        </section>

        <div className="grid gap-8 lg:grid-cols-5">
          {/* ── Quick Actions ── */}
          <section className="lg:col-span-2 space-y-4" aria-label="Quick actions">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">
                Quick Actions
              </h2>
              <p className="text-sm text-muted-foreground">
                Jump to the most common tasks
              </p>
            </div>
            <div className="grid gap-3">
              <QuickActionCard
                title="View Conversations"
                description="Manage and respond to customer inquiries"
                icon={InboxIcon}
                href="/conversations"
                accent="bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400"
              />
              <QuickActionCard
                title="Knowledge Base"
                description="Upload and manage support documents"
                icon={LibraryBigIcon}
                href="/files"
                accent="bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-400"
              />
              <QuickActionCard
                title="Voice Assistant"
                description="Configure your Vapi voice assistant"
                icon={Mic}
                href="/plugins/vapi"
                accent="bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400"
              />
              <QuickActionCard
                title="Widget Customization"
                description="Personalize the look & feel of your widget"
                icon={PaletteIcon}
                href="/customization"
                accent="bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400"
              />
            </div>
          </section>

          {/* ── Recent Activity ── */}
          <section className="lg:col-span-3 space-y-4" aria-label="Recent activity">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">
                Recent Activity
              </h2>
              <p className="text-sm text-muted-foreground">
                Latest conversations across your organization
              </p>
            </div>
            <Card className="border-border/50 shadow-sm">
              <CardContent className="p-0">
                {allConversationsData === undefined ? (
                  <div className="space-y-4 p-6">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-3 w-1/2" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : recentConversations.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted mb-4">
                      <ZapIcon className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium">No conversations yet</p>
                    <p className="mt-1 text-xs text-muted-foreground max-w-xs">
                      Conversations will appear here once customers start
                      reaching out through your support widget.
                    </p>
                  </div>
                ) : (
                  <ul className="divide-y">
                    {recentConversations.map((conversation) => {
                      const statusConfig: Record<
                        string,
                        {
                          label: string;
                          variant: "default" | "secondary" | "destructive" | "outline";
                          dotColor: string;
                        }
                      > = {
                        unresolved: {
                          label: "Unresolved",
                          variant: "outline",
                          dotColor: "bg-amber-500",
                        },
                        escalated: {
                          label: "Escalated",
                          variant: "destructive",
                          dotColor: "bg-red-500",
                        },
                        resolved: {
                          label: "Resolved",
                          variant: "secondary",
                          dotColor: "bg-emerald-500",
                        },
                      };
                      const cfg = statusConfig[conversation.status] ?? {
                        label: "Unresolved",
                        variant: "outline" as const,
                        dotColor: "bg-amber-500",
                      };

                      return (
                        <li key={conversation._id}>
                          <Link
                            href={`/conversations/${conversation._id}`}
                            className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-muted/50"
                          >
                            {/* Status dot */}
                            <span className="relative flex h-2.5 w-2.5 shrink-0">
                              <span
                                className={`absolute inline-flex h-full w-full animate-ping rounded-full ${cfg.dotColor} opacity-40`}
                              />
                              <span
                                className={`relative inline-flex h-2.5 w-2.5 rounded-full ${cfg.dotColor}`}
                              />
                            </span>
                            {/* Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-medium truncate">
                                  {conversation.contactSession?.name ?? "Unknown Contact"}
                                </p>
                                <Badge variant={cfg.variant} className="text-[10px] px-1.5 py-0">
                                  {cfg.label}
                                </Badge>
                              </div>
                              <p className="mt-0.5 text-xs text-muted-foreground truncate">
                                {conversation.lastMessage?.text || "No messages yet"}
                              </p>
                            </div>
                            {/* Timestamp */}
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {formatRelativeTime(conversation._creationTime)}
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </CardContent>
            </Card>
            {recentConversations.length > 0 && (
              <div className="flex justify-end">
                <Link
                  href="/conversations"
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  View all conversations
                  <ArrowRightIcon className="h-3.5 w-3.5" />
                </Link>
              </div>
            )}
          </section>
        </div>

        {/* ── Helpful tips strip ── */}
        <section aria-label="Tips and updates">
          <Card className="border-border/40 bg-gradient-to-r from-blue-50/50 via-indigo-50/30 to-violet-50/50 dark:from-blue-950/20 dark:via-indigo-950/10 dark:to-violet-950/20 shadow-none">
            <CardContent className="flex flex-col sm:flex-row items-start sm:items-center gap-4 py-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-sm">
                <TrendingUpIcon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">
                  Tip: Boost your AI accuracy
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Upload more documents to your Knowledge Base so the AI agent
                  can provide more accurate answers to your customers.
                </p>
              </div>
              <Link
                href="/files"
                className="inline-flex items-center gap-1 rounded-md bg-primary px-4 py-2 text-xs font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
              >
                Upload files
                <ArrowRightIcon className="h-3 w-3" />
              </Link>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return "Just now";
}
