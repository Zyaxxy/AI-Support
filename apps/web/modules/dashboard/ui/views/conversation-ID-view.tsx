"use client"
import { api } from "@workspace/backend/_generated/api";
import { Id } from "@workspace/backend/_generated/dataModel";
import { Button } from "@workspace/ui/components/button";
import { useQuery } from "convex/react";
import { MoreHorizontal, MoreHorizontalIcon } from "lucide-react";

export const ConversationIdView = ({ conversationId }: { conversationId: Id<"conversations"> }) => {
    const conversation = useQuery(api.private.conversation.getOne, { conversationId });
    return (
        <div className="flex h-full flex-col bg-muted">
            <div className="flex items-center justify-between drop-shadow-sm bg-background p-2.5">
                <Button size="sm"
                    variant="ghost">
                    <MoreHorizontalIcon />
                </Button>
            </div>
        </div>
    );
};