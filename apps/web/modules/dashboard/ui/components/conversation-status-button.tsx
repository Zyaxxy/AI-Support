import { Doc } from "@workspace/backend/_generated/dataModel";
import { Button } from "@workspace/ui/components/button";
import { Hint } from "@workspace/ui/components/hint";
import { Badge } from "@workspace/ui/components/badge";
import { AlertCircle, AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";

export const ConversationStatusButton = ({ status, onClick, disabled, }: {
    status: Doc<"conversations">["status"];
    onClick: () => void;
    disabled: boolean;
}) => {
    // Status configuration
    const statusConfig = {
        unresolved: {
            label: "Unresolved",
            icon: AlertCircle,
            nextAction: "Mark as Escalated",
            variant: "destructive" as const,
            badgeClasses: "bg-red-500/10 text-red-600 border-red-500/20 dark:bg-red-500/20 dark:text-red-400 dark:border-red-500/30",
            pulseClasses: "before:absolute before:inset-0 before:rounded-full before:bg-red-500/10 before:animate-pulse",
        },
        escalated: {
            label: "Escalated",
            icon: AlertTriangle,
            nextAction: "Mark as Resolved",
            variant: "outline" as const,
            badgeClasses: "bg-amber-500/10 text-amber-600 border-amber-500/30 dark:bg-amber-500/20 dark:text-amber-400 dark:border-amber-500/40",
            pulseClasses: "before:absolute before:inset-0 before:rounded-full before:bg-amber-500/20 before:animate-pulse",
        },
        resolved: {
            label: "Resolved",
            icon: CheckCircle2,
            nextAction: "Reopen Conversation",
            variant: "outline" as const,
            badgeClasses: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30",
            pulseClasses: "",
        }
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
        <Hint text={config.nextAction}>
            <button
                onClick={onClick}
                disabled={disabled}
                className={cn(
                    "group relative inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-300",
                    "hover:scale-105 active:scale-95",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    "disabled:pointer-events-none disabled:opacity-50",
                    config.badgeClasses,
                    !disabled && "cursor-pointer hover:shadow-lg"
                )}
            >
                {/* Pulse animation for unresolved/escalated */}
                {(status === "unresolved" || status === "escalated") && !disabled && (
                    <span className={cn("absolute inset-0 rounded-full opacity-30", config.pulseClasses)} />
                )}

                {/* Loading spinner */}
                {disabled ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <Icon className="h-4 w-4 transition-transform group-hover:rotate-12" />
                )}

                {/* Label */}
                <span className="relative font-semibold">{config.label}</span>

                {/* Shine effect on hover */}
                <span className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
            </button>
        </Hint>
    );
}
