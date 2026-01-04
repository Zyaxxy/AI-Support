import { cn } from "@workspace/ui/lib/utils";

interface ConversationSkeletonProps {
    count?: number;
}

export const ConversationSkeleton = ({ count = 5 }: ConversationSkeletonProps) => {
    return (
        <>
            {Array.from({ length: count }).map((_, index) => (
                <div
                    key={index}
                    className="relative group flex items-start gap-3.5 border-b border-border/40 px-4 py-4 animate-pulse"
                >
                    {/* Avatar Skeleton */}
                    <div className="relative shrink-0">
                        <div className="size-11 rounded-full bg-muted/50" />
                    </div>

                    {/* Content Skeleton */}
                    <div className="flex-1 min-w-0 space-y-2">
                        {/* Header Row */}
                        <div className="flex items-baseline justify-between gap-2">
                            <div className="h-4 bg-muted/50 rounded w-32" />
                            <div className="h-3 bg-muted/50 rounded w-16" />
                        </div>

                        {/* Message Preview Row */}
                        <div className="flex items-center justify-between gap-2">
                            <div className="h-3 bg-muted/50 rounded w-3/4" />
                            <div className="size-4 bg-muted/50 rounded-full" />
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
};
