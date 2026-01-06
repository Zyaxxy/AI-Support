import { useCallback, useEffect, useRef, useState } from "react";

interface UseInfiniteScrollProps {
    status: "CanLoadMore" | "LoadingMore" | "Exhausted" | "LoadingFirstPage";
    loadmore: (numItems: number) => void;
    loadSize?: number;
    observerEnabled?: boolean;
};

export const useInfiniteScroll = ({
    status,
    loadmore,
    loadSize = 10,
    observerEnabled = true,
}: UseInfiniteScrollProps) => {
    const topElementRef = useRef<HTMLDivElement>(null);
    const handleLoadMore = useCallback(() => {
        if (status === "CanLoadMore") {
            loadmore(loadSize);
        }
    }, [status, loadmore, loadSize]);
    useEffect(() => {
        let observer: IntersectionObserver | null = null;
        if (observerEnabled) {
            const topElement = topElementRef.current;
            if (!(topElement && observerEnabled)) return;
            observer = new IntersectionObserver((entries) => {
                if (entries[0]?.isIntersecting) {
                    handleLoadMore();
                }
            }, { threshold: 0.1 });
            observer.observe(topElement);
        }
        return () => {
            observer?.disconnect();
        };
    }, [observerEnabled, handleLoadMore]);

    return {
        topElementRef,
        handleLoadMore,
        canLoadMore: status === "CanLoadMore",
        isLoadingMore: status === "LoadingMore",
        isExhausted: status === "Exhausted",
        isLoadingFirstPage: status === "LoadingFirstPage",
    };
};