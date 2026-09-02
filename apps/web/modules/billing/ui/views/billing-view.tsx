"use client";

import { useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { toast } from "sonner";
import {
  CreditCardIcon,
  ZapIcon,
  CheckCircle2Icon,
  SparklesIcon,
  ArrowRightIcon,
  FileTextIcon,
  PhoneCallIcon,
  UsersIcon,
  MessageSquareIcon,
  ShieldCheckIcon,
} from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";

export const BillingView = () => {
  const billingData = useQuery(api.private.billing.getUsage);
  const isLoading = billingData === undefined;

  const usage = billingData?.usage;
  const limits = billingData?.limits;

  const messagesPercent = limits ? Math.min(100, Math.round((usage?.messages ?? 0) / limits.messages * 100)) : 0;
  const filesPercent = limits ? Math.min(100, Math.round((usage?.files ?? 0) / limits.files * 100)) : 0;
  const voicePercent = limits ? Math.min(100, Math.round((usage?.voiceMinutes ?? 0) / limits.voiceMinutes * 100)) : 0;

  const handleUpgrade = (tierName: string) => {
    toast.info(`Upgrading to ${tierName} plan... Billing portal integration ready.`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-muted/20 via-background to-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border/40 bg-background/80 backdrop-blur-md px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600">
              <CreditCardIcon className="size-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-foreground">
                Subscription & Resource Usage
              </h1>
              <p className="text-xs text-muted-foreground">
                Monitor real-time AI tokens, voice minutes, and knowledge base capacity
              </p>
            </div>
          </div>
          <Badge variant="outline" className="gap-1.5 px-3 py-1 bg-green-500/10 text-green-600 border-green-500/30">
            <span className="size-1.5 rounded-full bg-green-500" />
            Active Subscription: Free Starter
          </Badge>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 p-6 max-w-6xl mx-auto w-full space-y-8">
        {/* Usage Gauges Grid */}
        <div>
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-3">
            Current Monthly Quotas
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* AI Queries Meter */}
            <Card className="border-border/60 shadow-xs bg-card/60 backdrop-blur-sm">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                    <MessageSquareIcon className="size-3.5 text-blue-500" />
                    AI Conversations
                  </span>
                  <span className="text-xs font-bold text-foreground">
                    {isLoading ? <Skeleton className="h-4 w-12" /> : `${usage?.messages ?? 0} / ${limits?.messages ?? 1000}`}
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    style={{ width: `${messagesPercent}%` }}
                    className="h-full rounded-full bg-blue-600 transition-all duration-500"
                  />
                </div>
                <p className="text-[10px] text-muted-foreground">
                  {100 - messagesPercent}% monthly quota remaining
                </p>
              </CardContent>
            </Card>

            {/* Knowledge Base Files Meter */}
            <Card className="border-border/60 shadow-xs bg-card/60 backdrop-blur-sm">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                    <FileTextIcon className="size-3.5 text-purple-500" />
                    Knowledge Base Files
                  </span>
                  <span className="text-xs font-bold text-foreground">
                    {isLoading ? <Skeleton className="h-4 w-12" /> : `${usage?.files ?? 0} / ${limits?.files ?? 50}`}
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    style={{ width: `${filesPercent}%` }}
                    className="h-full rounded-full bg-purple-600 transition-all duration-500"
                  />
                </div>
                <p className="text-[10px] text-muted-foreground">
                  Vector RAG embeddings indexed in Convex
                </p>
              </CardContent>
            </Card>

            {/* Voice Minutes Meter */}
            <Card className="border-border/60 shadow-xs bg-card/60 backdrop-blur-sm">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                    <PhoneCallIcon className="size-3.5 text-emerald-500" />
                    Voice Call Minutes
                  </span>
                  <span className="text-xs font-bold text-foreground">
                    {isLoading ? <Skeleton className="h-4 w-12" /> : `${usage?.voiceMinutes ?? 0}m / ${limits?.voiceMinutes ?? 30}m`}
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    style={{ width: `${voicePercent}%` }}
                    className="h-full rounded-full bg-emerald-600 transition-all duration-500"
                  />
                </div>
                <p className="text-[10px] text-muted-foreground">
                  Vapi real-time WebRTC audio minutes
                </p>
              </CardContent>
            </Card>

            {/* Operator Seats Meter */}
            <Card className="border-border/60 shadow-xs bg-card/60 backdrop-blur-sm">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                    <UsersIcon className="size-3.5 text-amber-500" />
                    Team Operator Seats
                  </span>
                  <span className="text-xs font-bold text-foreground">1 / 3 seats</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full bg-amber-500 w-1/3 transition-all duration-500" />
                </div>
                <p className="text-[10px] text-muted-foreground">
                  Managed via Clerk Organization roles
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Pricing Tiers Comparison */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                Available Plans
              </h2>
              <p className="text-xs text-muted-foreground">
                Scale your AI customer support capacity seamlessly as your business grows
              </p>
            </div>
            <Badge variant="secondary" className="text-xs">
              Billed Monthly
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Starter (Free) */}
            <Card className="border-2 border-primary/50 shadow-md bg-card/70 backdrop-blur-sm flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] font-bold px-3 py-1 rounded-bl-lg">
                CURRENT PLAN
              </div>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-bold">Starter</CardTitle>
                <CardDescription className="text-xs">Ideal for startups and small personal projects</CardDescription>
                <div className="pt-3">
                  <span className="text-3xl font-extrabold text-foreground">$0</span>
                  <span className="text-xs text-muted-foreground"> / month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 flex-1 flex flex-col justify-between">
                <ul className="space-y-2.5 text-xs text-muted-foreground">
                  <li className="flex items-center gap-2 text-foreground">
                    <CheckCircle2Icon className="size-4 text-primary shrink-0" />
                    1,000 AI Messages / month
                  </li>
                  <li className="flex items-center gap-2 text-foreground">
                    <CheckCircle2Icon className="size-4 text-primary shrink-0" />
                    Up to 50 Knowledge Base documents
                  </li>
                  <li className="flex items-center gap-2 text-foreground">
                    <CheckCircle2Icon className="size-4 text-primary shrink-0" />
                    30 Voice AI Call minutes
                  </li>
                  <li className="flex items-center gap-2 text-foreground">
                    <CheckCircle2Icon className="size-4 text-primary shrink-0" />
                    Web chat & voice widget embed
                  </li>
                  <li className="flex items-center gap-2 text-foreground">
                    <CheckCircle2Icon className="size-4 text-primary shrink-0" />
                    Human operator escalation
                  </li>
                </ul>
                <Button variant="outline" disabled className="w-full text-xs">
                  Your Current Plan
                </Button>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="border-border/60 shadow-sm bg-card/60 backdrop-blur-sm flex flex-col justify-between hover:border-primary/40 transition-colors">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-bold">Professional</CardTitle>
                <CardDescription className="text-xs">For growing companies requiring high-volume support</CardDescription>
                <div className="pt-3">
                  <span className="text-3xl font-extrabold text-foreground">$29</span>
                  <span className="text-xs text-muted-foreground"> / month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 flex-1 flex flex-col justify-between">
                <ul className="space-y-2.5 text-xs text-muted-foreground">
                  <li className="flex items-center gap-2 text-foreground">
                    <CheckCircle2Icon className="size-4 text-emerald-500 shrink-0" />
                    25,000 AI Messages / month
                  </li>
                  <li className="flex items-center gap-2 text-foreground">
                    <CheckCircle2Icon className="size-4 text-emerald-500 shrink-0" />
                    Unlimited Knowledge Base files
                  </li>
                  <li className="flex items-center gap-2 text-foreground">
                    <CheckCircle2Icon className="size-4 text-emerald-500 shrink-0" />
                    300 Voice AI Call minutes
                  </li>
                  <li className="flex items-center gap-2 text-foreground">
                    <CheckCircle2Icon className="size-4 text-emerald-500 shrink-0" />
                    Priority human handoff queue
                  </li>
                  <li className="flex items-center gap-2 text-foreground">
                    <CheckCircle2Icon className="size-4 text-emerald-500 shrink-0" />
                    Custom webhook integrations
                  </li>
                </ul>
                <Button
                  onClick={() => handleUpgrade("Professional")}
                  className="w-full text-xs bg-primary hover:bg-primary/90 text-primary-foreground gap-1"
                >
                  Upgrade to Pro
                  <ArrowRightIcon className="size-3.5" />
                </Button>
              </CardContent>
            </Card>

            {/* Enterprise Plan */}
            <Card className="border-border/60 shadow-sm bg-card/60 backdrop-blur-sm flex flex-col justify-between hover:border-primary/40 transition-colors">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-bold">Enterprise</CardTitle>
                <CardDescription className="text-xs">Custom security, compliance, and dedicated telephony</CardDescription>
                <div className="pt-3">
                  <span className="text-3xl font-extrabold text-foreground">$99</span>
                  <span className="text-xs text-muted-foreground"> / month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 flex-1 flex flex-col justify-between">
                <ul className="space-y-2.5 text-xs text-muted-foreground">
                  <li className="flex items-center gap-2 text-foreground">
                    <CheckCircle2Icon className="size-4 text-blue-500 shrink-0" />
                    Unlimited AI Messages & Conversations
                  </li>
                  <li className="flex items-center gap-2 text-foreground">
                    <CheckCircle2Icon className="size-4 text-blue-500 shrink-0" />
                    Dedicated Inbound/Outbound Phone Numbers
                  </li>
                  <li className="flex items-center gap-2 text-foreground">
                    <CheckCircle2Icon className="size-4 text-blue-500 shrink-0" />
                    Custom LLM Fine-Tuning & Persona Tuning
                  </li>
                  <li className="flex items-center gap-2 text-foreground">
                    <CheckCircle2Icon className="size-4 text-blue-500 shrink-0" />
                    SOC2 & HIPAA Compliance
                  </li>
                  <li className="flex items-center gap-2 text-foreground">
                    <CheckCircle2Icon className="size-4 text-blue-500 shrink-0" />
                    24/7 Dedicated Account Manager
                  </li>
                </ul>
                <Button
                  variant="outline"
                  onClick={() => handleUpgrade("Enterprise")}
                  className="w-full text-xs"
                >
                  Contact Sales
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Security & Free Tier Notice */}
        <Card className="border-border/60 shadow-xs bg-muted/20">
          <CardContent className="p-4 flex items-center gap-3 text-xs text-muted-foreground">
            <ShieldCheckIcon className="size-5 text-emerald-500 shrink-0" />
            <div>
              <p className="font-semibold text-foreground">Zero Cloud Bills for Developer & Open Source Usage</p>
              <p className="text-[11px]">
                Echo AI is architected on Convex, Clerk, and Google AI Studio free tiers, allowing you to deploy and scale for $0/mo.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
