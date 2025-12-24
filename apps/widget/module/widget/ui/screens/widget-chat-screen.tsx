"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Schema, z } from "zod";
import { useForm } from "react-hook-form";
import { useThreadMessages, toUIMessages } from "@convex-dev/agent/react";
import { useAtomValue, useSetAtom } from "jotai";
import { WidgetHeader } from "../components/widget-header";
import { Button } from "@workspace/ui/components/button";
import { ChevronLeftIcon, MenuIcon } from "lucide-react";
import { conversationIdAtom, organizationIdAtom, screenAtom } from "../../atoms/widget-atoms";
import { Form, FormField } from "@workspace/ui/components/form";
import { contactSessionIdAtomFamily } from "../../atoms/widget-atoms";
import { useAction, useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import {
  AIConversation,
  AIConversationContent,
  AIConversationScrollButton
} from "@workspace/ui/components/ai/conversation";
import {
  AIInput,
  AIInputSubmit,
  AIInputTextarea,
  AIInputToolbar,
  AIInputTools,
} from "@workspace/ui/components/ai/input";
import { AIResponse } from "@workspace/ui/components/ai/response";
import {
  AIMessage,
  AIMessageContent,
} from "@workspace/ui/components/ai/message";
import { InfiniteScrollTrigger } from "@workspace/ui/components/InfiniteScrollTrigger";
import { useInfiniteScroll } from "@workspace/ui/hooks/use-infinite-scroll";
import { AISuggestion, AISuggestions } from "@workspace/ui/components/ai/suggestion";
import { useRef } from "react";

const schema = z.object({
  prompt: z.string().min(1, "Message is required"),
});

export const WidgetChatScreen = () => {
  const setScreen = useSetAtom(screenAtom);
  const setConversationId = useSetAtom(conversationIdAtom);

  const conversationId = useAtomValue(conversationIdAtom)
  const contactSessionId = useAtomValue(contactSessionIdAtomFamily(useAtomValue(organizationIdAtom) || ""));
  const onBack = () => {
    setConversationId(null);
    setScreen("selection");
  }

  const conversation = useQuery(api.public.conversations.getOne, conversationId && contactSessionId ? {
    conversationId,
    contactSessionId,
  } : "skip");


  const messages = useThreadMessages(api.public.messages.getMany,
    conversation?.threadId && contactSessionId
      ? {
        threadId: conversation?.threadId,
        contactSessionId,
      }
      : "skip",
    { initialNumItems: 10 }
  );

  const { topElementRef, handleLoadMore, canLoadMore, isLoadingMore } = useInfiniteScroll({
    status: messages.status,
    loadmore: messages.loadMore,
    loadSize: 10,
    observerEnabled: true,
  });
  const infiniteScrollRef = useRef<HTMLDivElement>(null);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      prompt: "",
    },
  });

  const createMessage = useAction(api.public.messages.create);
  const onSubmit = async (values: z.infer<typeof schema>) => {
    if (!conversation || !contactSessionId) {
      return;
    }
    form.reset();
    await createMessage({
      threadId: conversation?.threadId,
      contactSessionId: contactSessionId,
      prompt: values.prompt,
    })
  };
  return (
    <>
      <WidgetHeader className="flex items-center justify-between">

        <div className="flex items-center gap-x-2 px-2 py-6">
          <Button
            size={"icon"}
            variant={"transparent"}
            onClick={onBack}
          >
            <ChevronLeftIcon />
          </Button>
          <p className="text-4xl font-bold">Chat</p>
        </div>
        <Button
          size={"icon"}
          variant={"transparent"}
          onClick={() => { }}
        >
          <MenuIcon />
        </Button>
      </WidgetHeader>
      <AIConversation>
        <AIConversationContent>
          {toUIMessages(messages.results ?? [])?.map((message) => {
            return (
              <AIMessage
                from={message.role === "user" ? "user" : "assistant"}
                key={message.id}
              >
                <AIMessageContent>
                  <AIResponse>{message.text}</AIResponse>
                </AIMessageContent>
              </AIMessage>
            )
          })}
        </AIConversationContent>
        <AIConversationScrollButton />
      </AIConversation>
      <Form {...form}>
        <AIInput className="rounded-none border-x-0 border-b-0" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            disabled={conversation?.status === "resolved"}
            name="prompt"
            render={({ field }) => (
              <AIInputTextarea
                disabled={conversation?.status === "resolved"}
                onChange={field.onChange}
                value={field.value}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    form.handleSubmit(onSubmit)();
                  }
                }}
                placeholder={
                  conversation?.status === "resolved"
                    ? "Conversation resolved"
                    : "Type your message here..."
                }
              />
            )}
          />
          <AIInputToolbar>
            <AIInputTools>
              <AIInputSubmit disabled={conversation?.status === "resolved" || !form.formState.isValid}
                status="ready"
                type="submit" />
            </AIInputTools>
          </AIInputToolbar>
        </AIInput>
      </Form>
    </>
  );
};