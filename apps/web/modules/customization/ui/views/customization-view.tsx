"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Switch } from "@workspace/ui/components/switch";
import { Badge } from "@workspace/ui/components/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import { toast } from "sonner";
import {
  PaletteIcon,
  SparklesIcon,
  CopyIcon,
  CheckIcon,
  RotateCcwIcon,
  SmartphoneIcon,
  MonitorIcon,
  MessageSquareIcon,
  PhoneCallIcon,
  BotIcon,
  SendIcon,
  ChevronRightIcon,
  SlidersIcon,
  CodeIcon,
} from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";

const COLOR_PRESETS = [
  { name: "Cobalt Blue", hex: "#2563eb", bg: "bg-blue-600" },
  { name: "Emerald Mint", hex: "#059669", bg: "bg-emerald-600" },
  { name: "Violet Electric", hex: "#7c3aed", bg: "bg-violet-600" },
  { name: "Rose Ruby", hex: "#e11d48", bg: "bg-rose-600" },
  { name: "Amber Solar", hex: "#d97706", bg: "bg-amber-600" },
  { name: "Midnight Obsidian", hex: "#0f172a", bg: "bg-slate-900" },
];

export const CustomizationView = () => {
  const customizationData = useQuery(api.private.customization.get);
  const updateCustomization = useMutation(api.private.customization.update);

  const [primaryColor, setPrimaryColor] = useState("#2563eb");
  const [widgetTitle, setWidgetTitle] = useState("Echo Support");
  const [greetingHeading, setGreetingHeading] = useState("Hey there 👋");
  const [greetingSubheading, setGreetingSubheading] = useState("Let's get you started");
  const [botName, setBotName] = useState("Echo Assistant");
  const [position, setPosition] = useState<"bottom-right" | "bottom-left">("bottom-right");
  const [enableVoice, setEnableVoice] = useState(true);
  const [enableHumanHandoff, setEnableHumanHandoff] = useState(true);
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");
  
  const [previewTab, setPreviewTab] = useState<"home" | "chat">("home");
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  // Sync state from query when loaded
  useEffect(() => {
    if (customizationData) {
      setPrimaryColor(customizationData.primaryColor ?? "#2563eb");
      setWidgetTitle(customizationData.widgetTitle ?? "Echo Support");
      setGreetingHeading(customizationData.greetingHeading ?? "Hey there 👋");
      setGreetingSubheading(customizationData.greetingSubheading ?? "Let's get you started");
      setBotName(customizationData.botName ?? "Echo Assistant");
      setPosition(customizationData.position ?? "bottom-right");
      setEnableVoice(customizationData.enableVoice ?? true);
      setEnableHumanHandoff(customizationData.enableHumanHandoff ?? true);
      setTheme(customizationData.theme ?? "system");
    }
  }, [customizationData]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await updateCustomization({
        primaryColor,
        widgetTitle,
        greetingHeading,
        greetingSubheading,
        botName,
        position,
        enableVoice,
        enableHumanHandoff,
        theme,
      });
      toast.success("Widget customization saved successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save customization");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setPrimaryColor("#2563eb");
    setWidgetTitle("Echo Support");
    setGreetingHeading("Hey there 👋");
    setGreetingSubheading("Let's get you started");
    setBotName("Echo Assistant");
    setPosition("bottom-right");
    setEnableVoice(true);
    setEnableHumanHandoff(true);
    setTheme("system");
    toast.info("Reset to default values (remember to save)");
  };

  const embedScriptSnippet = `<script 
  src="${typeof window !== 'undefined' ? window.location.origin.replace('3000', '3001') : 'https://your-widget.app'}/embed.js" 
  data-position="${position}" 
  async>
</script>`;

  const copyEmbedSnippet = () => {
    navigator.clipboard.writeText(embedScriptSnippet);
    setCopied(true);
    toast.success("Embed script copied to clipboard!");
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-muted/20 via-background to-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border/40 bg-background/80 backdrop-blur-md px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <PaletteIcon className="size-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-foreground">
                Widget Studio
              </h1>
              <p className="text-xs text-muted-foreground">
                Customize your customer-facing chat & voice widget with real-time live preview
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleReset} className="gap-1.5">
              <RotateCcwIcon className="size-3.5" />
              Reset
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isSaving}
              className="gap-1.5 bg-primary shadow-sm hover:bg-primary/90 text-primary-foreground"
            >
              <SparklesIcon className="size-3.5" />
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Studio Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 max-w-7xl mx-auto w-full">
        {/* Left: Customization Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Brand & Theme */}
          <Card className="border-border/60 shadow-sm bg-card/60 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <SlidersIcon className="size-4 text-primary" />
                <CardTitle className="text-base font-semibold">Branding & Color Theme</CardTitle>
              </div>
              <CardDescription className="text-xs">
                Choose an accent color that matches your brand identity
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-xs font-medium text-muted-foreground mb-2 block">
                  Primary Accent Color
                </Label>
                <div className="flex flex-wrap items-center gap-3">
                  {COLOR_PRESETS.map((preset) => (
                    <button
                      key={preset.hex}
                      type="button"
                      onClick={() => setPrimaryColor(preset.hex)}
                      className={cn(
                        "group relative size-9 rounded-full transition-transform active:scale-95 flex items-center justify-center shadow-sm",
                        preset.bg,
                        primaryColor === preset.hex && "ring-2 ring-primary ring-offset-2 ring-offset-background scale-110"
                      )}
                      title={preset.name}
                    >
                      {primaryColor === preset.hex && (
                        <CheckIcon className="size-4 text-white drop-shadow-sm" />
                      )}
                    </button>
                  ))}
                  <div className="flex items-center gap-2 pl-2 border-l border-border/60">
                    <Input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="size-9 p-0.5 rounded-full cursor-pointer border-0 bg-transparent"
                    />
                    <Input
                      type="text"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-24 h-9 font-mono text-xs uppercase"
                      placeholder="#2563eb"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <Label className="text-xs">Widget Title</Label>
                  <Input
                    value={widgetTitle}
                    onChange={(e) => setWidgetTitle(e.target.value)}
                    placeholder="Echo Support"
                    className="h-9"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">AI Bot Name</Label>
                  <Input
                    value={botName}
                    onChange={(e) => setBotName(e.target.value)}
                    placeholder="Echo Assistant"
                    className="h-9"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Welcome Greeting Heading</Label>
                <Input
                  value={greetingHeading}
                  onChange={(e) => setGreetingHeading(e.target.value)}
                  placeholder="Hey there 👋"
                  className="h-9"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Welcome Subtitle</Label>
                <Input
                  value={greetingSubheading}
                  onChange={(e) => setGreetingSubheading(e.target.value)}
                  placeholder="Let's get you started"
                  className="h-9"
                />
              </div>
            </CardContent>
          </Card>

          {/* Behavior & Position */}
          <Card className="border-border/60 shadow-sm bg-card/60 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Position & Features</CardTitle>
              <CardDescription className="text-xs">
                Control launcher placement and enable support channels
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground block">
                  Launcher Position on Screen
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPosition("bottom-right")}
                    className={cn(
                      "flex items-center justify-center gap-2 p-3 rounded-lg border text-xs font-medium transition-all",
                      position === "bottom-right"
                        ? "border-primary bg-primary/10 text-primary shadow-sm"
                        : "border-border/60 hover:bg-muted/50 text-muted-foreground"
                    )}
                  >
                    <span>Bottom Right</span>
                    <span className="text-[10px] opacity-70">(Default)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPosition("bottom-left")}
                    className={cn(
                      "flex items-center justify-center gap-2 p-3 rounded-lg border text-xs font-medium transition-all",
                      position === "bottom-left"
                        ? "border-primary bg-primary/10 text-primary shadow-sm"
                        : "border-border/60 hover:bg-muted/50 text-muted-foreground"
                    )}
                  >
                    <span>Bottom Left</span>
                  </button>
                </div>
              </div>

              <div className="divide-y divide-border/40">
                <div className="flex items-center justify-between py-3">
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium text-foreground flex items-center gap-2">
                      <PhoneCallIcon className="size-4 text-emerald-500" />
                      Voice AI Calls (Vapi)
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Allow customers to initiate real-time conversational voice calls with your AI agent
                    </p>
                  </div>
                  <Switch checked={enableVoice} onCheckedChange={setEnableVoice} />
                </div>

                <div className="flex items-center justify-between py-3">
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium text-foreground flex items-center gap-2">
                      <BotIcon className="size-4 text-blue-500" />
                      Human Handoff & Auto-Escalation
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Escalate conversations to live operators when customer asks or AI is uncertain
                    </p>
                  </div>
                  <Switch checked={enableHumanHandoff} onCheckedChange={setEnableHumanHandoff} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Embed Snippet */}
          <Card className="border-border/60 shadow-sm bg-gradient-to-br from-slate-900 to-slate-950 text-slate-100">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CodeIcon className="size-4 text-blue-400" />
                  <CardTitle className="text-sm font-semibold text-white">Embed Script</CardTitle>
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={copyEmbedSnippet}
                  className="h-7 gap-1 text-xs bg-slate-800 hover:bg-slate-700 text-white"
                >
                  {copied ? <CheckIcon className="size-3 text-green-400" /> : <CopyIcon className="size-3" />}
                  {copied ? "Copied" : "Copy Tag"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <pre className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-blue-300 overflow-x-auto">
                {embedScriptSnippet}
              </pre>
            </CardContent>
          </Card>
        </div>

        {/* Right: Live Interactive Device Frame (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="sticky top-24 w-full max-w-[360px] space-y-3">
            <div className="flex items-center justify-between px-2">
              <Badge variant="outline" className="gap-1.5 py-1 px-2.5 text-xs bg-background/80">
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Interactive Preview
              </Badge>
              <div className="flex items-center gap-1 bg-muted/60 p-0.5 rounded-lg border border-border/50">
                <button
                  type="button"
                  onClick={() => setPreviewTab("home")}
                  className={cn(
                    "px-2.5 py-1 rounded text-xs font-medium transition-colors",
                    previewTab === "home" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Welcome
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewTab("chat")}
                  className={cn(
                    "px-2.5 py-1 rounded text-xs font-medium transition-colors",
                    previewTab === "chat" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Chat View
                </button>
              </div>
            </div>

            {/* Mock Widget Container */}
            <div className="w-full h-[540px] rounded-2xl border border-gray-200/80 shadow-2xl bg-white dark:bg-slate-900 overflow-hidden flex flex-col transition-all duration-300">
              {/* Header with customized background color */}
              <div
                style={{ backgroundColor: primaryColor }}
                className="p-5 text-white flex flex-col justify-between shrink-0 shadow-sm transition-colors duration-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="size-7 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs backdrop-blur-sm">
                      ⚡
                    </div>
                    <span className="font-semibold text-sm drop-shadow-sm">{widgetTitle}</span>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-sm">
                    Online
                  </span>
                </div>
                {previewTab === "home" ? (
                  <div className="space-y-1">
                    <h2 className="text-2xl font-bold leading-tight drop-shadow-sm">{greetingHeading}</h2>
                    <p className="text-xs text-white/90">{greetingSubheading}</p>
                  </div>
                ) : (
                  <p className="text-xs text-white/80">Active conversation with {botName}</p>
                )}
              </div>

              {/* Body */}
              {previewTab === "home" ? (
                <div className="flex-1 p-4 space-y-3 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col justify-between overflow-y-auto">
                  <div className="space-y-2.5">
                    <button
                      type="button"
                      onClick={() => setPreviewTab("chat")}
                      className="w-full p-3.5 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-800 flex items-center justify-between text-left shadow-sm hover:border-primary/50 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          style={{ color: primaryColor }}
                          className="size-8 rounded-lg bg-primary/10 flex items-center justify-center"
                        >
                          <MessageSquareIcon className="size-4" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-900 dark:text-gray-100">
                            Start AI Chat
                          </p>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400">
                            Ask questions & get instant answers
                          </p>
                        </div>
                      </div>
                      <ChevronRightIcon className="size-4 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
                    </button>

                    {enableVoice && (
                      <div className="w-full p-3.5 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-800 flex items-center justify-between text-left shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="size-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                            <PhoneCallIcon className="size-4" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-900 dark:text-gray-100">
                              Voice Call Assistant
                            </p>
                            <p className="text-[11px] text-gray-500 dark:text-gray-400">
                              Real-time phone support
                            </p>
                          </div>
                        </div>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-medium">
                          Live
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Footer note */}
                  <div className="text-center pt-2">
                    <p className="text-[10px] text-gray-400 flex items-center justify-center gap-1">
                      Powered by <span className="font-semibold text-gray-600 dark:text-gray-300">Echo AI</span>
                    </p>
                  </div>
                </div>
              ) : (
                /* Chat view preview */
                <div className="flex-1 flex flex-col justify-between p-3 bg-slate-50/50 dark:bg-slate-900/50">
                  <div className="space-y-3 overflow-y-auto flex-1 p-1">
                    {/* Bot Message */}
                    <div className="flex gap-2 items-start max-w-[85%]">
                      <div
                        style={{ backgroundColor: primaryColor }}
                        className="size-6 rounded-full text-white flex items-center justify-center text-[10px] shrink-0 font-bold"
                      >
                        AI
                      </div>
                      <div className="p-2.5 rounded-2xl rounded-tl-sm bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow-xs text-xs text-gray-800 dark:text-gray-200">
                        Hello! I am {botName}. How can I assist you with your questions today?
                      </div>
                    </div>

                    {/* User Message */}
                    <div className="flex gap-2 items-start max-w-[85%] ml-auto flex-row-reverse">
                      <div className="size-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] shrink-0 font-medium">
                        U
                      </div>
                      <div
                        style={{ backgroundColor: primaryColor }}
                        className="p-2.5 rounded-2xl rounded-tr-sm text-white shadow-xs text-xs"
                      >
                        Can I test the knowledge base search?
                      </div>
                    </div>

                    {/* Bot reply with RAG */}
                    <div className="flex gap-2 items-start max-w-[85%]">
                      <div
                        style={{ backgroundColor: primaryColor }}
                        className="size-6 rounded-full text-white flex items-center justify-center text-[10px] shrink-0 font-bold"
                      >
                        AI
                      </div>
                      <div className="p-2.5 rounded-2xl rounded-tl-sm bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow-xs text-xs text-gray-800 dark:text-gray-200">
                        Yes! I search your uploaded documents in real-time with RAG embeddings.
                      </div>
                    </div>
                  </div>

                  {/* Mock Input */}
                  <div className="mt-2 pt-2 border-t border-gray-100 dark:border-slate-800 flex items-center gap-2">
                    <input
                      type="text"
                      disabled
                      placeholder="Type a message..."
                      className="flex-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs"
                    />
                    <button
                      type="button"
                      style={{ backgroundColor: primaryColor }}
                      className="size-7 rounded-lg text-white flex items-center justify-center shadow-xs"
                    >
                      <SendIcon className="size-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
