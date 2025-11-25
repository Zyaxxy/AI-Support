"use client";
import { useAtomValue } from "jotai";
import { WidgetHeader } from "../components/widget-header";
import { Button } from "@workspace/ui/components/button";
import { ChevronLeftIcon, MenuIcon } from "lucide-react";
import { conversationIdAtom } from "../../atoms/widget-atoms";
import { organizationIdAtom } from "../../atoms/widget-atoms";
import { contactSessionIdAtomFamily } from "../../atoms/widget-atoms";
import { useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
export const WidgetChatScreen = () => {
  const conversationId = useAtomValue(conversationIdAtom)
  const organizationId = useAtomValue(organizationIdAtom)
  const contactSessionId = useAtomValue(contactSessionIdAtomFamily(useAtomValue(organizationIdAtom) || ""));


  const conversation = useQuery(api.public.conversations.getOne, conversationId && contactSessionId ? {
    conversationId,
    contactSessionId,
  } : "skip");

  return (
    <>
      <WidgetHeader className="flex items-center justify-between">

        <div className="flex items-center gap-x-2 px-2 py-6">
          <Button
            size={"icon"}
            variant={"transparent"}
            onClick={() => { }}
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
        {JSON.stringify(conversation)}

      </div>
    </>
  );
};