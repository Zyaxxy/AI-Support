"use client";
import { useAtomValue } from "jotai";

import { WidgetHeader } from "../components/widget-header";
import { Button } from "@workspace/ui/components/button";
import { ChevronRightIcon, MessageSquareTextIcon } from "lucide-react";
import { organizationIdAtom, screenAtom, contactSessionIdAtomFamily } from "../../atoms/widget-atoms";
import { useSetAtom } from "jotai";
import { useMutation } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { errorMessageAtom } from "../../atoms/widget-atoms";

export const WidgetSelectionScreen = () => {
  const setScreen = useSetAtom(screenAtom);
  const setErrorMessage = useSetAtom(errorMessageAtom);
  const organizationId = useAtomValue(organizationIdAtom);
  const contactSessionId = useAtomValue(contactSessionIdAtomFamily(organizationId || ""));

  const createConversation = useMutation(api.public.conversations.create);

  const handleNewConversation = async () => {
    if (!organizationId) {
      setScreen("error");
      setErrorMessage("Organization not found");
    }


    if (!contactSessionId) {
      setScreen("auth");
      setErrorMessage("Contact session not found");
      return;
    }
    try {
      const conversationId = await createConversation({
        organizationId,
        contactSessionId,
      });
      setScreen("chat");

    } catch (error) {
      setScreen("error");
      setErrorMessage("Failed to create conversation");
    }

  };

  return (
    <>
      <WidgetHeader>
        <div className="flex flex-col justify-between gap-y-2 px-2 py-6">
          <p className="text-4xl font-bold">Hey there👋</p>
          <p className="text-lg font-bold">
            Let&apos;s get you started
          </p>
        </div>
      </WidgetHeader>
      <div className="flex flex-1 flex-col gap-y-4 overflow-y-auto p-4 ">
        <Button className="h-16 w-full justify-between" variant={"outline"} onClick={() => { }}>
          <div className="flex items-center gap-x-2">
            <MessageSquareTextIcon className="size-4" />
            <span>Start Chat</span>
          </div>
          <ChevronRightIcon className="size-4" />
        </Button>
      </div>
    </>
  );
};