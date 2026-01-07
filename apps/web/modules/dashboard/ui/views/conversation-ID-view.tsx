"use client"
import { useState } from "react";
import { api } from "@workspace/backend/_generated/api";
import { Id } from "@workspace/backend/_generated/dataModel";
import { Button } from "@workspace/ui/components/button";
import { useQuery, useMutation, useAction } from "convex/react";
import { MoreHorizontalIcon, Wand2Icon } from "lucide-react";
import {
    AIConversation,
    AIConversationContent,
    AIConversationScrollButton
} from "@workspace/ui/components/ai/conversation";
import {
    AIInput,
    AIInputButton,
    AIInputSubmit,
    AIInputTextarea,
    AIInputToolbar,
    AIInputTools
} from "@workspace/ui/components/ai/input";
import {
    AIMessage,
    AIMessageContent
} from "@workspace/ui/components/ai/message";
import { AIResponse } from "@workspace/ui/components/ai/response";
import {
    Form,
    FormField
} from "@workspace/ui/components/form";
import { toUIMessages, useThreadMessages } from "@convex-dev/agent/react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DicebearAvatar } from "@workspace/ui/components/dicebear-avatar";
import { ConversationStatusButton } from "../components/conversation-status-button";
import { useInfiniteScroll } from "@workspace/ui/hooks/use-infinite-scroll";
import { InfiniteScrollTrigger } from "@workspace/ui/components/infinitescrolltrigger";
import { Skeleton } from "@workspace/ui/components/skeleton";
const formSchema = z.object({
    message: z.string().min(1, "Message is required"),
});
export const ConversationIdView = ({ conversationId }: { conversationId: Id<"conversations"> }) => {
    const conversation = useQuery(api.private.conversation.getOne, { conversationId });
    const messages = useThreadMessages(api.private.messages.getMany, conversation?.threadId ? { threadId: conversation.threadId } : "skip",
        { initialNumItems: 10, }
    );

    const { topElementRef,
        handleLoadMore,
        canLoadMore,
        isLoadingMore,
    } = useInfiniteScroll(
        {
            status: messages.status,
            loadmore: messages.loadMore,
            loadSize: 10,
            observerEnabled: true,
        });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            message: "",
        },
    });
    const [isEnhancing, setIsEnhancing] = useState(false);
    const enhanceResponse = useAction(api.private.messages.enhanceResponse);
    const handleEnhanceResponse = async () => {
        const currentValue = form.getValues("message");

        try {
            setIsEnhancing(true);
            const response = await enhanceResponse({ prompt: currentValue, threadId: conversation?.threadId ?? "" });
            form.setValue("message", response);
        } catch (error) {
            console.error(error);
        } finally {
            setIsEnhancing(false);
        }
    }
    const createMessage = useMutation(api.private.messages.create);
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await createMessage({
                prompt: values.message,
                conversationId: conversationId
            });
            form.reset();
        } catch (error) {
            console.error(error);
        }
    };
    const [IsUpdatingStatus, SetIsUpdatingStatus] = useState(false);

    const UpdateConversationStatus = useMutation(api.private.conversation.updateStatus);
    const handleToggleStatus = async () => {
        if (!conversation) return;
        SetIsUpdatingStatus(true);

        let newStatus: "unresolved" | "escalated" | "resolved";
        if (conversation.status === "unresolved") {
            newStatus = "escalated";
        } else if (conversation.status === "escalated") {
            newStatus = "resolved";
        } else {
            newStatus = "unresolved";
        }

        try {
            await UpdateConversationStatus({
                conversationId,
                status: newStatus
            });
        } catch (error) {
            console.error(error);
        } finally {
            SetIsUpdatingStatus(false);
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border/50 px-4 py-3.5">
                <div className="flex items-center justify-between gap-3">
                    <Button size="sm" variant="ghost">
                        <MoreHorizontalIcon />
                    </Button>
                    <ConversationStatusButton disabled={IsUpdatingStatus} status={conversation?.status ?? "unresolved"} onClick={handleToggleStatus} />
                </div>
            </div>
            <AIConversation className="flex-1 overflow-hidden">
                <AIConversationContent>
                    <InfiniteScrollTrigger
                        ref={topElementRef}
                        isLoadingMore={isLoadingMore}
                        canLoadMore={canLoadMore}
                        onLoadMore={handleLoadMore} />
                    {toUIMessages(messages.results ?? [])?.map((message) => (
                        <AIMessage from={message.role === "user" ? "assistant" : "user"}
                            key={message.id}>
                            <AIMessageContent>
                                <AIResponse>
                                    {message.text}
                                </AIResponse>
                            </AIMessageContent>
                            {message.role === "user" && <DicebearAvatar seed={conversation?.contactSessionId ?? "user"} size={40} />}
                        </AIMessage>
                    ))}
                </AIConversationContent>
                <AIConversationScrollButton />
            </AIConversation>
            <div className="p-2">
                <Form {...form}>
                    <AIInput onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            disabled={conversation?.status === "resolved"}
                            name="message"
                            render={({ field }) => (
                                <AIInputTextarea
                                    disabled={conversation?.status === "resolved" || form.formState.isSubmitting || isEnhancing}
                                    onChange={field.onChange}
                                    onKeyDown={(e) => {
                                        if (e.key == "Enter" && !e.shiftKey) {
                                            e.preventDefault();
                                            form.handleSubmit(onSubmit)();
                                        }
                                    }}
                                    placeholder={conversation?.status === "resolved" ? "Conversation resolved" : "Type your message..."}
                                    value={field.value}
                                />
                            )}
                        />
                        <AIInputToolbar>
                            <AIInputTools>
                                <AIInputButton disabled={conversation?.status === "resolved"
                                    || form.formState.isSubmitting ||
                                    isEnhancing || !form.formState.isValid}>
                                    <Wand2Icon />
                                    {isEnhancing ? "Enhancing..." : "Enhance"}
                                </AIInputButton>
                            </AIInputTools>
                            <AIInputSubmit disabled={conversation?.status === "resolved" || form.formState.isSubmitting ||
                                !form.formState.isValid || isEnhancing}
                                status="ready"
                                type="submit" />

                        </AIInputToolbar>
                    </AIInput>

                </Form>

            </div>
        </div>
    );
};


export const ConversationIdViewLoadingSkeleton = () => {
    return (
        <div className="flex flex-col h-full">
            {/* Header Skeleton */}
            <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border/50 px-4 py-3.5">
                <div className="flex items-center justify-between gap-3">
                    <Skeleton className="h-9 w-9 rounded-md" />
                    <Skeleton className="h-9 w-32 rounded-full" />
                </div>
            </div>

            {/* Messages Skeleton */}
            <div className="flex-1 overflow-hidden p-4 space-y-6">
                {/* Assistant Message */}
                <div className="flex gap-3 items-start">
                    <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                    </div>
                </div>

                {/* User Message */}
                <div className="flex gap-3 items-start flex-row-reverse">
                    <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-2/3 ml-auto" />
                        <Skeleton className="h-4 w-full" />
                    </div>
                </div>

                {/* Assistant Message */}
                <div className="flex gap-3 items-start">
                    <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                </div>

                {/* User Message */}
                <div className="flex gap-3 items-start flex-row-reverse">
                    <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4 ml-auto" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6 ml-auto" />
                    </div>
                </div>
            </div>

            {/* Input Area Skeleton */}
            <div className="p-2">
                <div className="rounded-lg border border-border/50 bg-background p-3 space-y-3">
                    <Skeleton className="h-20 w-full rounded-md" />
                    <div className="flex items-center justify-between">
                        <Skeleton className="h-9 w-28 rounded-md" />
                        <Skeleton className="h-9 w-20 rounded-md" />
                    </div>
                </div>
            </div>
        </div>
    );
}