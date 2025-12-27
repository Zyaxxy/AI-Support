"use client";
import { formatDistanceToNow } from "date-fns";
import { ArrowLeftIcon } from "lucide-react";
import { WidgetHeader } from "../components/widget-header";
import { Button } from "@workspace/ui/components/button";
import { ConversationStatusIcon } from "@workspace/ui/components/conversation-status-icon";
import { useSetAtom } from "jotai";
import { contactSessionIdAtomFamily, screenAtom } from "../../atoms/widget-atoms";
import { organizationIdAtom } from "../../atoms/widget-atoms";
import { useAtomValue } from "jotai";
import { usePaginatedQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { conversationIdAtom } from "../../atoms/widget-atoms";
import { useInfiniteScroll } from "@workspace/ui/hooks/use-infinite-scroll";
import { InfiniteScrollTrigger } from "@workspace/ui/components/InfiniteScrollTrigger";
import { WidgetFooter } from "../components/widget-footer";


export const WidgetInboxScreen = () => {
  const setScreen = useSetAtom(screenAtom)
  const setConversationId = useSetAtom(conversationIdAtom)
  const organizationId = useAtomValue(organizationIdAtom);
  const contactSessionId = useAtomValue(contactSessionIdAtomFamily(organizationId || ""));

  const conversations = usePaginatedQuery(
    api.public.conversations.getMany,
    contactSessionId && organizationId
      ? {
        organizationId,
        contactSessionId
      }
      : "skip",
    {
      initialNumItems: 10,
    },
  );

  const { topElementRef, handleLoadMore, canLoadMore, isLoadingMore } = useInfiniteScroll({
    status: conversations.status,
    loadmore: conversations.loadMore,
    loadSize: 10,
    observerEnabled: true,
  });

  return (
    <>
      <WidgetHeader>
        <div className="flex flex-col justify-between gap-y-2 px-2 py-6">
          <Button variant="transparent" size="icon"
            onClick={() => { setScreen("selection") }}>
            <ArrowLeftIcon /> Back
          </Button>
        </div>
      </WidgetHeader>
      <div className="flex flex-1 flex-col  gap-y-4 p-4">
        <p className="text-sm font-bold">
          Inbox
        </p>
        <div className="flex flex-1 flex-col gap-y-2 p-4 overflow-y-auto">
          {conversations?.results.length > 0 && conversations?.results.map((conversation) => (
            <Button className="h-20 w-full justify-between"
              key={conversation._id}
              onClick={() => {
                setConversationId(conversation._id)
                setScreen("chat")
              }}
              variant="outline">
              <div className="flex w-full flex-col gap-4 overflow-hidden text-start">
                <div className="flex w-full items-center justify-between gap-x-2">
                  <p className="text-xs text-muted-foreground">Chat</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(conversation._creationTime))}
                  </p>
                </div>
                <div className="flex w-full items-center justify-between gap-x-2">
                  <p className="truncate text-sm">
                    {conversation.lastMessage?.text}
                  </p>
                  <ConversationStatusIcon status={conversation.status} />
                </div>
              </div>
            </Button>
          ))}
          <InfiniteScrollTrigger
            ref={topElementRef}
            isLoadingMore={isLoadingMore}
            canLoadMore={canLoadMore}
            onLoadMore={handleLoadMore}
          />
        </div>

      </div>
      <WidgetFooter />
    </>
  );
};