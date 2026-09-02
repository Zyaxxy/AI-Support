"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Badge } from "@workspace/ui/components/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import { toast } from "sonner";
import Link from "next/link";
import {
  CodeIcon,
  CopyIcon,
  CheckIcon,
  GlobeIcon,
  WebhookIcon,
  KeyIcon,
  SparklesIcon,
  BotIcon,
  PhoneCallIcon,
  ShieldCheckIcon,
  ExternalLinkIcon,
  TerminalIcon,
  CheckCircle2Icon,
  SendIcon,
  LayersIcon,
} from "lucide-react";

export const IntegrationsView = () => {
  const { orgId } = useAuth();
  const currentOrgId = orgId || "org_demo_123456";

  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [webhookUrl, setWebhookUrl] = useState("");
  const [isTestingWebhook, setIsTestingWebhook] = useState(false);
  const [apiKeys, setApiKeys] = useState([
    { id: "key_live_1", name: "Production Frontend Key", token: `echo_live_${currentOrgId.slice(0, 8)}...`, created: "Today", active: true },
  ]);

  const copyToClipboard = (text: string, keyName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const widgetUrl = typeof window !== "undefined"
    ? window.location.origin.replace("3000", "3001")
    : "https://your-widget-domain.vercel.app";

  const htmlSnippet = `<!-- Echo AI Support Widget -->
<script 
  src="${widgetUrl}/embed.js" 
  data-organization-id="${currentOrgId}" 
  data-position="bottom-right"
  async>
</script>`;

  const reactSnippet = `// 1. Install or embed the script in your React / Next.js app
import Script from 'next/script';

export default function SupportWidget() {
  return (
    <Script
      src="${widgetUrl}/embed.js"
      data-organization-id="${currentOrgId}"
      strategy="lazyOnload"
    />
  );
}`;

  const handleTestWebhook = async () => {
    if (!webhookUrl) {
      toast.error("Please enter a valid webhook URL first");
      return;
    }
    try {
      setIsTestingWebhook(true);
      // Simulate webhook ping
      await new Promise((res) => setTimeout(res, 1000));
      toast.success("Test payload successfully dispatched to " + webhookUrl);
    } catch {
      toast.error("Webhook test dispatch failed");
    } finally {
      setIsTestingWebhook(false);
    }
  };

  const handleCreateApiKey = () => {
    const newKey = {
      id: `key_${Date.now()}`,
      name: "Developer Key",
      token: `echo_sec_${Math.random().toString(36).substring(2, 12)}`,
      created: "Just now",
      active: true,
    };
    setApiKeys((prev) => [newKey, ...prev]);
    toast.success("New API key generated successfully");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-muted/20 via-background to-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border/40 bg-background/80 backdrop-blur-md px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600">
              <LayersIcon className="size-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-foreground">
                Integrations & Developer Toolkit
              </h1>
              <p className="text-xs text-muted-foreground">
                Connect Echo AI with your websites, applications, webhooks, and third-party tools
              </p>
            </div>
          </div>
          <Badge variant="outline" className="gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-600 border-emerald-500/30">
            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            API Gateway Online
          </Badge>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 p-6 max-w-6xl mx-auto w-full space-y-6">
        {/* Section 1: Embed Script Generator */}
        <Card className="border-border/60 shadow-sm bg-card/70 backdrop-blur-sm overflow-hidden">
          <CardHeader className="border-b border-border/40 bg-muted/20 pb-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <CodeIcon className="size-4 text-primary" />
                  <CardTitle className="text-base font-semibold">Web Support Widget Integration</CardTitle>
                </div>
                <CardDescription className="text-xs">
                  Embed your personalized AI chat & voice agent into any website with a single line of code
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground font-mono">Org ID:</span>
                <code className="text-xs px-2 py-0.5 rounded bg-muted font-mono font-semibold text-foreground">
                  {currentOrgId}
                </code>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <Tabs defaultValue="html" className="w-full">
              <div className="flex items-center justify-between mb-3">
                <TabsList className="bg-muted/60">
                  <TabsTrigger value="html" className="text-xs gap-1.5">
                    <GlobeIcon className="size-3.5" /> HTML / JS
                  </TabsTrigger>
                  <TabsTrigger value="react" className="text-xs gap-1.5">
                    <TerminalIcon className="size-3.5" /> React / Next.js
                  </TabsTrigger>
                  <TabsTrigger value="platforms" className="text-xs gap-1.5">
                    <LayersIcon className="size-3.5" /> Webflow & Shopify
                  </TabsTrigger>
                </TabsList>

                <Button
                  size="sm"
                  onClick={() => copyToClipboard(htmlSnippet, "html")}
                  className="h-8 gap-1.5 text-xs bg-primary text-primary-foreground shadow-xs"
                >
                  {copiedKey === "html" ? <CheckIcon className="size-3.5 text-green-300" /> : <CopyIcon className="size-3.5" />}
                  {copiedKey === "html" ? "Copied!" : "Copy Snippet"}
                </Button>
              </div>

              <TabsContent value="html" className="mt-0">
                <div className="relative rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs text-blue-300 overflow-x-auto shadow-inner">
                  <pre className="leading-relaxed">{htmlSnippet}</pre>
                </div>
                <p className="text-[11px] text-muted-foreground mt-2">
                  Paste this snippet inside the <code className="text-foreground">&lt;body&gt;</code> or <code className="text-foreground">&lt;head&gt;</code> tag of your HTML pages.
                </p>
              </TabsContent>

              <TabsContent value="react" className="mt-0">
                <div className="relative rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs text-emerald-300 overflow-x-auto shadow-inner">
                  <pre className="leading-relaxed">{reactSnippet}</pre>
                </div>
              </TabsContent>

              <TabsContent value="platforms" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-border/60 bg-muted/20 space-y-2">
                    <h4 className="text-xs font-semibold text-foreground">Shopify Integration</h4>
                    <p className="text-xs text-muted-foreground">
                      Go to <strong>Online Store &gt; Themes &gt; Edit Code</strong>. Open <code className="text-foreground font-mono">theme.liquid</code> and paste the HTML snippet before the closing <code className="text-foreground font-mono">&lt;/body&gt;</code> tag.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl border border-border/60 bg-muted/20 space-y-2">
                    <h4 className="text-xs font-semibold text-foreground">Webflow & Framer</h4>
                    <p className="text-xs text-muted-foreground">
                      Go to <strong>Project Settings &gt; Custom Code</strong>. Paste the script into the <strong>Footer Code</strong> section and publish your changes.
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Section 2: Connected Ecosystem Services */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Vapi Card */}
          <Card className="border-border/60 shadow-xs bg-card/60 backdrop-blur-sm flex flex-col justify-between">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="size-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                  <PhoneCallIcon className="size-4" />
                </div>
                <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600 text-[10px]">
                  Enabled
                </Badge>
              </div>
              <CardTitle className="text-sm font-semibold pt-2">Voice AI (Vapi)</CardTitle>
              <CardDescription className="text-xs">
                Real-time WebRTC voice calling and automated outbound phone support
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Button asChild variant="outline" size="sm" className="w-full text-xs">
                <Link href="/plugins/vapi">
                  Manage Vapi Settings
                  <ExternalLinkIcon className="ml-1 size-3" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Gemini AI Card */}
          <Card className="border-border/60 shadow-xs bg-card/60 backdrop-blur-sm flex flex-col justify-between">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="size-8 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
                  <SparklesIcon className="size-4" />
                </div>
                <Badge variant="outline" className="border-blue-500/30 bg-blue-500/10 text-blue-600 text-[10px]">
                  Gemini 2.5 Flash
                </Badge>
              </div>
              <CardTitle className="text-sm font-semibold pt-2">AI Knowledge Base RAG</CardTitle>
              <CardDescription className="text-xs">
                Multimodal PDF, image, and text extraction with vector search
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Button asChild variant="outline" size="sm" className="w-full text-xs">
                <Link href="/files">
                  Manage Knowledge Base
                  <ExternalLinkIcon className="ml-1 size-3" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Clerk Auth Card */}
          <Card className="border-border/60 shadow-xs bg-card/60 backdrop-blur-sm flex flex-col justify-between">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="size-8 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center">
                  <ShieldCheckIcon className="size-4" />
                </div>
                <Badge variant="outline" className="border-purple-500/30 bg-purple-500/10 text-purple-600 text-[10px]">
                  Connected
                </Badge>
              </div>
              <CardTitle className="text-sm font-semibold pt-2">Clerk Multi-Tenancy</CardTitle>
              <CardDescription className="text-xs">
                Secure JWT organization separation, team roles, and user authentication
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Button asChild variant="outline" size="sm" className="w-full text-xs">
                <Link href="/profile">
                  View Organization
                  <ExternalLinkIcon className="ml-1 size-3" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Section 3: Webhook Events */}
        <Card className="border-border/60 shadow-sm bg-card/60 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <WebhookIcon className="size-4 text-amber-500" />
              <CardTitle className="text-base font-semibold">Webhooks & Event Dispatcher</CardTitle>
            </div>
            <CardDescription className="text-xs">
              Receive real-time HTTP POST notifications when conversations escalate, resolve, or calls conclude
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1">
                <Input
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  placeholder="https://your-api.com/webhooks/echo"
                  className="h-9 font-mono text-xs"
                />
              </div>
              <Button
                size="sm"
                onClick={handleTestWebhook}
                disabled={isTestingWebhook}
                className="gap-1.5 text-xs bg-amber-600 hover:bg-amber-700 text-white"
              >
                <SendIcon className="size-3.5" />
                {isTestingWebhook ? "Sending Test..." : "Send Test Ping"}
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="p-3 rounded-lg border border-border/40 bg-muted/20 text-xs space-y-1">
                <span className="font-semibold text-foreground">conversation.escalated</span>
                <p className="text-[11px] text-muted-foreground">Fired when human agent intervention is requested</p>
              </div>
              <div className="p-3 rounded-lg border border-border/40 bg-muted/20 text-xs space-y-1">
                <span className="font-semibold text-foreground">conversation.resolved</span>
                <p className="text-[11px] text-muted-foreground">Fired when issue is successfully marked resolved</p>
              </div>
              <div className="p-3 rounded-lg border border-border/40 bg-muted/20 text-xs space-y-1">
                <span className="font-semibold text-foreground">call.ended</span>
                <p className="text-[11px] text-muted-foreground">Fired with full transcript & sentiment summary</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 4: API Keys Management */}
        <Card className="border-border/60 shadow-sm bg-card/60 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <KeyIcon className="size-4 text-primary" />
                <CardTitle className="text-base font-semibold">API Keys & Programmatic Access</CardTitle>
              </div>
              <Button size="sm" variant="outline" onClick={handleCreateApiKey} className="h-8 gap-1.5 text-xs">
                Create New Key
              </Button>
            </div>
            <CardDescription className="text-xs">
              Use API keys to integrate custom backend applications and chatbots
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-xl border border-border/60 divide-y divide-border/40 bg-background/50 overflow-hidden">
              {apiKeys.map((key) => (
                <div key={key.id} className="p-3.5 flex items-center justify-between text-xs">
                  <div className="space-y-0.5">
                    <p className="font-semibold text-foreground">{key.name}</p>
                    <code className="text-[11px] text-muted-foreground font-mono">{key.token}</code>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-[10px] bg-green-500/10 text-green-600 border-green-500/30">
                      Active
                    </Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(key.token, key.id)}
                      className="size-7 p-0 text-muted-foreground hover:text-foreground"
                    >
                      {copiedKey === key.id ? <CheckIcon className="size-3.5 text-green-500" /> : <CopyIcon className="size-3.5" />}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
