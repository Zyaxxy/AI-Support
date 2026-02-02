"use client";

import { MessageSquare, Phone, ChevronRight, Sparkles, Shield, Zap, PhoneCallIcon, WorkflowIcon } from "lucide-react";
import { PluginCard } from "../components/plugin-card";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";

export default function VapiView() {

    const vapiPlugin = useQuery(api.private.plugins.getOne, { service: "vapi" });
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
               (
                        <PluginCard
                            serviceName="Vapi"
                            serviceImage="/vapi.jpg"
                            features={[
                                {
                                icon: Phone,
                                label: "Phone Numbers",
                                description: "Get dedicated phone numbers for your application",
                            },
                            {
                                icon: PhoneCallIcon,
                                label: "Outbound Calls",
                                description: "Automated calling to customers",
                            },
                            {
                                icon: WorkflowIcon,
                                label: "Workflows",
                                description: "Create custom conversation flows",
                            }
                        ]}
                        onSubmit={() => {   
                        }}
                        isDisabled={vapiPlugin === undefined}
                    />
                    )
                </div>
            </div>
        </div>
    );
}