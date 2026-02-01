"use client";

import { MessageSquare, Phone, ChevronRight, Sparkles, Shield, Zap } from "lucide-react";
import { PluginCard } from "../components/plugin-card";
import Link from "next/link";

export default function VapiView() {
    return (
        <div className="max-h-screen bg-gradient-to-b from-background via-background to-muted/20">
            {/* Breadcrumb Navigation */}
            <div className="border-b border-border/40 bg-background/60 backdrop-blur-sm">
                <div className="mx-4 max-w-screen-lg px-4 py-4">
                    <nav className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Link 
                            href="/plugins" 
                            className="hover:text-foreground transition-colors duration-200"
                        >
                            Plugins
                        </Link>
                        <ChevronRight className="size-4" />
                        <span className="text-foreground font-medium">Vapi Integration</span>
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <div className="mx-auto max-w-screen-lg px-6 py-6 space-y-6">
                {/* Hero Section */}
                <div className="space-y-2">
                     <div>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
                            Vapi Integration
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
                            Connect Vapi's powerful voice and communication platform to enable seamless phone calls and SMS messaging in your application.
                        </p>
                     </div>
                </div>

                {/* Plugin Card Section */}
                <div className="space-y-6">
                    <PluginCard
                        serviceName="Vapi"
                        serviceImage="/vapi.jpg"
                        features={[
                            {
                                icon: Phone,
                                label: "Voice Calls",
                                description: "Make and receive phone calls with advanced voice recognition and natural language processing",
                            },
                            {
                                icon: MessageSquare,
                                label: "SMS Messaging",
                                description: "Send and receive SMS messages with full conversation tracking and management",
                            },
                        ]}
                        onSubmit={() => {   
                        }}
                    />
                </div>
            </div>
        </div>
    );
}