"use client";

import { MessageSquare, Phone, ChevronRight, Sparkles, Shield, Zap } from "lucide-react";
import { PluginCard } from "../components/plugin-card";
import Link from "next/link";

export default function VapiView() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
            {/* Breadcrumb Navigation */}
            <div className="border-b border-border/40 bg-background/60 backdrop-blur-sm">
                <div className="mx-auto max-w-screen-lg px-6 py-4">
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
            <div className="mx-auto max-w-screen-lg px-6 py-12 space-y-12">
                {/* Hero Section */}
                <div className="space-y-6">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
                            <Sparkles className="size-3.5" />
                            <span>Voice & Communication</span>
                        </div>
                        
                        <div className="space-y-3">
                            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
                                Vapi Integration
                            </h1>
                            <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
                                Connect Vapi's powerful voice and communication platform to enable seamless phone calls and SMS messaging in your application.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Plugin Card Section */}
                <div className="space-y-6">
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold text-foreground">Connect Your Account</h2>
                        <p className="text-sm text-muted-foreground">
                            Configure the Vapi integration to start using voice and SMS features in your application.
                        </p>
                    </div>

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
                            console.log("Connect Vapi integration");
                        }}
                    />
                </div>

                {/* Information Footer */}
                <div className="pt-8 border-t border-border/40">
                    <div className="rounded-xl bg-muted/30 border border-border/40 p-6">
                        <div className="space-y-3">
                            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                                <Shield className="size-4 text-primary" />
                                Security & Privacy
                            </h3>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                Your Vapi credentials are encrypted and stored securely. We never share your data with third parties. 
                                All communication is encrypted end-to-end for maximum security.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}