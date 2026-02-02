import { ArrowLeftRightIcon, type LucideIcon, Zap } from "lucide-react";
import Image from "next/image";
import { Button } from "@workspace/ui/components/button";

export interface FeatureCardProps {
    icon: LucideIcon;
    label: string;
    description: string;
}

export interface PluginCardProps {
    isDisabled?: boolean;
    serviceName: string;
    serviceImage: string;
    features: FeatureCardProps[];
    onSubmit: () => void;
}

export function PluginCard({ isDisabled, serviceName, serviceImage, features, onSubmit }: PluginCardProps) {
    return (
        <div className="group relative w-full overflow-hidden rounded-2xl border border-border/40 bg-gradient-to-br from-card via-card to-muted/20 shadow-lg transition-all duration-300 hover:shadow-xl hover:border-primary/30">
            {/* Subtle animated gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            
            {/* Content wrapper */}
            <div className="relative p-8 space-y-8">
                {/* Integration Header */}
                <div className="flex items-center justify-center gap-6">
                    {/* Service Logo */}
                    <div className="relative flex flex-col items-center gap-3 group/service">
                        <div className="relative p-4 rounded-2xl bg-background/60 backdrop-blur-sm border border-border/50 shadow-md transition-all duration-300 group-hover/service:scale-105 group-hover/service:shadow-lg group-hover/service:border-primary/30">
                            <Image
                                src={serviceImage}
                                alt={serviceName}
                                width={56}
                                height={56}
                                className="rounded-lg object-contain"
                            />
                            {/* Subtle glow effect */}
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 opacity-0 transition-opacity duration-300 group-hover/service:opacity-100" />
                        </div>
                        <span className="text-sm font-semibold text-foreground/80">{serviceName}</span>
                    </div>

                    {/* Connection Indicator */}
                    <div className="flex flex-col items-center gap-2">
                        <div className="relative p-3 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 backdrop-blur-sm border border-primary/30 shadow-sm">
                            <ArrowLeftRightIcon className="size-5 text-primary animate-pulse" />
                        </div>
                        <div className="h-px w-16" />
                    </div>

                    {/* Platform Logo */}
                    <div className="relative flex flex-col items-center gap-3 group/platform">
                        <div className="relative p-4 rounded-2xl bg-background/60 backdrop-blur-sm border border-border/50 shadow-md transition-all duration-300 group-hover/platform:scale-105 group-hover/platform:shadow-lg group-hover/platform:border-primary/30">
                            <Image
                                src="/logo.svg"
                                alt="Platform"
                                width={56}
                                height={56}
                                className="object-contain"
                            />
                            {/* Subtle glow effect */}
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 opacity-0 transition-opacity duration-300 group-hover/platform:opacity-100" />
                        </div>
                        <span className="text-sm font-semibold text-foreground/80">Echo</span>
                    </div>
                </div>

                {/* Features Grid */}
                {features.length > 0 && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Zap className="size-4 text-primary" />
                            <h3 className="text-sm font-semibold text-foreground/90">Available Features</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {features.map((feature, index) => {
                                const Icon = feature.icon;
                                return (
                                    <div
                                        key={index}
                                        className="group/feature relative p-4 rounded-xl bg-background/40 backdrop-blur-sm border border-border/40 shadow-sm transition-all duration-300 hover:bg-background/60 hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5"
                                    >
                                        {/* Feature icon with gradient background */}
                                        <div className="flex items-start gap-3">
                                            <div className="flex-shrink-0 p-2 rounded-lg bg-gradient-to-br from-primary/15 to-accent/15 border border-primary/20 transition-all duration-300 group-hover/feature:scale-110 group-hover/feature:from-primary/25 group-hover/feature:to-accent/25">
                                                <Icon className="size-4 text-primary" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-semibold text-sm text-foreground mb-0.5">
                                                    {feature.label}
                                                </h4>
                                                <p className="text-xs text-muted-foreground/80 line-clamp-2">
                                                    {feature.description}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        {/* Subtle hover gradient */}
                                        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover/feature:opacity-100 pointer-events-none" />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Action Button */}
                <div className="pt-2">
                    <Button
                        onClick={onSubmit}
                        disabled={isDisabled}
                        className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group/button"
                    >
                        <span className="flex items-center gap-2">
                            {isDisabled ? "Already Connected" : "Connect Integration"}
                            {!isDisabled && (
                                <ArrowLeftRightIcon className="size-4 transition-transform duration-300 group-hover/button:scale-110" />
                            )}
                        </span>
                    </Button>
                </div>
            </div>      
        </div>
    );
}