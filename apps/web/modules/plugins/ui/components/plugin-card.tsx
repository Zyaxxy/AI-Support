import { ArrowLeftRightIcon, type LucideIcon, PlugIcon } from "lucide-react";
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
        <div className="h-fit w-full rounded-lg border border-border bg-card p-8 shadow-sm">
            
        </div>
    );
}