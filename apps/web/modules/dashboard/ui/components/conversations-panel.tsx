"use client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select";
import { ListIcon, ArrowRightIcon, ArrowUpIcon, CheckIcon, CornerUpLeftIcon } from "lucide-react";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { usePaginatedQuery } from "convex/react";
import { getCountryFromTimezone } from "../../../../lib/countryUtils";
import { api } from "@workspace/backend/_generated/api";
import { cn } from "@workspace/ui/lib/utils";
import { DicebearAvatar } from "@workspace/ui/components/dicebear-avatar";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { InfiniteScrollTrigger } from "@workspace/ui/components/infinitescrolltrigger";
import { formatDistanceToNow } from "date-fns";
import { ConversationStatusIcon } from "@workspace/ui/components/conversation-status-icon";
import { useAtom } from "jotai";
import { statusFilterAtom } from "../../atoms";
import { useInfiniteScroll } from "@workspace/ui/hooks/use-infinite-scroll";
import { ConversationSkeleton } from "./conversation-skeleton";
export const ConversationsPanel = () => {
    const pathname = usePathname();
    const [statusFilter, setStatusFilter] = useAtom(statusFilterAtom);
    const conversations = usePaginatedQuery(api.private.conversation.getMany,
        {
            status: statusFilter === "all" ? undefined : statusFilter,
        },
        {
            initialNumItems: 10,
        },
    );
    const {
        topElementRef,
        handleLoadMore,
        isLoadingMore,
        canLoadMore,
        isLoadingFirstPage,
    } = useInfiniteScroll({
        status: conversations.status,
        loadmore: conversations.loadMore,
        loadSize: 10,
        observerEnabled: true,
    });

    return (
        <div className="flex flex-col h-full w-full bg-background/50 backdrop-blur-sm">
            {/* Header Section with Filter */}
            <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border/50 px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                    <h2 className="text-sm font-semibold text-foreground">Conversations</h2>
                    <Select defaultValue="all"
                        onValueChange={(value) => setStatusFilter(value as typeof statusFilter)}
                        value={statusFilter}>
                        <SelectTrigger className="h-8 w-[130px] border-border/50 bg-background/50 px-3 text-xs shadow-sm hover:bg-accent/50 hover:border-primary/30 transition-all duration-200">
                            <SelectValue placeholder="Filter" />
                        </SelectTrigger>
                        <SelectContent className="min-w-[150px]">
                            <SelectItem value="all">
                                <div className="flex items-center gap-2">
                                    <ListIcon className="size-3.5" />
                                    <span>All</span>
                                </div>
                            </SelectItem>
                            <SelectItem value="unresolved">
                                <div className="flex items-center gap-2">
                                    <ArrowRightIcon className="size-3.5" />
                                    <span>Unresolved</span>
                                </div>
                            </SelectItem>
                            <SelectItem value="escalated">
                                <div className="flex items-center gap-2">
                                    <ArrowUpIcon className="size-3.5" />
                                    <span>Escalated</span>
                                </div>
                            </SelectItem>
                            <SelectItem value="resolved">
                                <div className="flex items-center gap-2">
                                    <CheckIcon className="size-3.5" />
                                    <span>Resolved</span>
                                </div>
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Conversations List */}
            <ScrollArea className="flex-1 h-[calc(100vh-65px)]">
                <div className="flex flex-col">
                    {/* Skeleton Loader for Initial Load */}
                    {isLoadingFirstPage && (
                        <ConversationSkeleton count={5} />
                    )}

                    {/* Actual Conversations */}
                    {!isLoadingFirstPage && conversations.results.map((conversation) => {
                        const isLastMessageFromOperator = conversation.lastMessage?.message?.role !== "user";
                        const country = getCountryFromTimezone(conversation.contactSession.metadata?.timezone || "");
                        const countryFlagUrl = `https://flagcdn.com/w20/${country?.code?.toLowerCase()}`;
                        const isActive = pathname === `/dashboard/conversations/${conversation._id}`;

                        return (
                            <Link
                                href={`/dashboard/conversations/${conversation._id}`}
                                key={conversation._id}
                                className={cn(
                                    "relative group flex cursor-pointer items-start gap-3.5 border-b border-border/40 px-4 py-4 transition-all duration-200",
                                    "hover:bg-accent/60 hover:border-border/60",
                                    isActive && "bg-accent/80 border-primary/20 shadow-sm"
                                )}
                            >
                                {/* Active Indicator */}
                                <div className={cn(
                                    "absolute top-0 left-0 h-full w-1 rounded-r-full bg-primary transition-all duration-300 ease-out",
                                    isActive ? "opacity-100 scale-y-100" : "opacity-0 scale-y-50 group-hover:opacity-50 group-hover:scale-y-75"
                                )} />

                                {/* Avatar with subtle shadow */}
                                <div className="relative shrink-0">
                                    <DicebearAvatar
                                        seed={conversation.contactSession._id}
                                        size={44}
                                        className="ring-2 ring-background shadow-sm transition-transform duration-200 group-hover:scale-105"
                                    />
                                    {/* Unread indicator - can be added based on message status */}
                                    {!isLastMessageFromOperator && (
                                        <div className="absolute -top-0.5 -right-0.5 size-3 bg-primary rounded-full border-2 border-background shadow-sm" />
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0 space-y-1.5">
                                    {/* Header Row */}
                                    <div className="flex items-baseline justify-between gap-2">
                                        <h3 className={cn(
                                            "font-semibold text-sm truncate transition-colors",
                                            isActive ? "text-foreground" : "text-foreground/90"
                                        )}>
                                            {conversation.contactSession.name}
                                        </h3>
                                        <time className="shrink-0 text-[11px] text-muted-foreground/80 font-medium">
                                            {formatDistanceToNow(conversation._creationTime, { addSuffix: true })}
                                        </time>
                                    </div>

                                    {/* Message Preview Row */}
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-1.5 min-w-0 flex-1">
                                            {isLastMessageFromOperator && (
                                                <CornerUpLeftIcon className="size-3 shrink-0 text-muted-foreground/60" />
                                            )}
                                            <p className={cn(
                                                "line-clamp-1 text-xs leading-relaxed transition-colors",
                                                !isLastMessageFromOperator
                                                    ? "font-semibold text-foreground"
                                                    : "text-muted-foreground/80"
                                            )}>
                                                {conversation.lastMessage?.text || "No messages yet"}
                                            </p>
                                        </div>

                                        {/* Status Icon */}
                                        <div className="shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                                            <ConversationStatusIcon status={conversation.status} />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        )
                    })}

                    {/* Empty State */}
                    {!isLoadingFirstPage && conversations.results.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                            <div className="size-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                                <ListIcon className="size-7 text-muted-foreground/40" />
                            </div>
                            <p className="text-sm font-medium text-foreground/70 mb-1">No conversations yet</p>
                            <p className="text-xs text-muted-foreground/60">Conversations will appear here</p>
                        </div>
                    )}

                    {/* Loading More Indicator */}
                    <InfiniteScrollTrigger
                        canLoadMore={canLoadMore}
                        isLoadingMore={isLoadingMore}
                        ref={topElementRef}
                        onLoadMore={handleLoadMore}
                    />
                </div>
            </ScrollArea>
        </div>
    )
};
