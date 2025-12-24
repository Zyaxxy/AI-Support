import { forwardRef } from "react";
import { cn } from "../lib/utils.js";
import { Button } from "./button.js";

interface InfiniteScrollTriggerProps {
    canLoadMore: boolean;
    isLoadingMore: boolean;
    onLoadMore: () => void;
    loadmoreTxt?: string;
    noMoreTxt?: string;
    className?: string;
}

export const InfiniteScrollTrigger = forwardRef<HTMLDivElement, InfiniteScrollTriggerProps>(
    ({
        canLoadMore,
        isLoadingMore,
        onLoadMore,
        loadmoreTxt = "Load More",
        noMoreTxt = "No More items",
        className,
    }, ref) => {
        let text = loadmoreTxt;
        if (isLoadingMore) {
            text = "Loading...";
        } else if (!canLoadMore) {
            text = noMoreTxt;
        }

        return (
            <div
                className={cn("flex w-full items-center justify-center py-2", className)}
                ref={ref}
            >
                <Button
                    onClick={onLoadMore}
                    disabled={isLoadingMore}
                    size="sm"
                    variant="ghost"
                >
                    {text}
                </Button>
            </div>
        );
    }
);

InfiniteScrollTrigger.displayName = "InfiniteScrollTrigger";

