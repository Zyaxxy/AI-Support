"use client";
import { useThreadMessages, toUIMessages } from "@convex-dev/agent/react";
import { useAtomValue, useSetAtom } from "jotai";
import { WidgetHeader } from "../components/widget-header";
import { Button } from "@workspace/ui/components/button";
import { ChevronLeftIcon, MenuIcon } from "lucide-react";
import { conversationIdAtom, organizationIdAtom, screenAtom } from "../../atoms/widget-atoms";

import { contactSessionIdAtomFamily } from "../../atoms/widget-atoms";
import { useQuery } from "convex/react";
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

import { AISuggestion, AISuggestions } from "@workspace/ui/components/ai/suggestion";
export const WidgetChatScreen = () => {
  const setScreen = useSetAtom(screenAtom);
  const setConversationId = useSetAtom(conversationIdAtom);

  const conversationId = useAtomValue(conversationIdAtom)
  const contactSessionId = useAtomValue(contactSessionIdAtomFamily(useAtomValue(organizationIdAtom) || ""));


  const conversation = useQuery(api.public.conversations.getOne, conversationId && contactSessionId ? {
    conversationId,
    contactSessionId,
  } : "skip");

  const onBack = () => {
    setConversationId(null);
    setScreen("selection");
  }

  const messages = useThreadMessages(api.public.messages.getMany,
    conversation?.threadId && contactSessionId
      ? {
        threadId: conversation?.threadId,
        contactSessionId,
      }
      : "skip",
    { initialNumItems: 10 }
  );

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
      <div className="flex flex-1 flex-col items-center justify-center gap-y-4 p-4 text-muted-foreground">
        {JSON.stringify(messages)}

      </div>
    </>
  );
};