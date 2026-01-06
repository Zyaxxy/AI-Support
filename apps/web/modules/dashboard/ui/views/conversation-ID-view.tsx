"use client"
import { useState } from "react";
import { api } from "@workspace/backend/_generated/api";
import { Id } from "@workspace/backend/_generated/dataModel";
import { Button } from "@workspace/ui/components/button";
import { useQuery, useMutation } from "convex/react";
import { MoreHorizontal, MoreHorizontalIcon, Wand2Icon } from "lucide-react";
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
import { set } from "date-fns";
const formSchema = z.object({
    message: z.string().min(1, "Message is required"),
});
export const ConversationIdView = ({ conversationId }: { conversationId: Id<"conversations"> }) => {
    const conversation = useQuery(api.private.conversation.getOne, { conversationId });
    const messages = useThreadMessages(api.private.messages.getMany, conversation?.threadId ? { threadId: conversation.threadId } : "skip",
        { initialNumItems: 10, }
    );
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            message: "",
        },
    });
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
        if(!conversation) return;
        SetIsUpdatingStatus(true);

        let newStatus: "unresolved" | "escalated" | "resolved";
        if(conversation.status === "unresolved") {
            newStatus = "escalated";
        } else if(conversation.status === "escalated") {
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
        }finally{
            SetIsUpdatingStatus(false);
        }
    };

    return (
        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border/50 px-4 py-3.5">
            <div className="flex items-center justify-between gap-3">
                <Button size="sm" variant="ghost">
                    <MoreHorizontalIcon />
                </Button>
                <ConversationStatusButton disabled={IsUpdatingStatus} status={conversation?.status ?? "unresolved"} onClick={handleToggleStatus} />
            </div>
            <AIConversation className="max-h-[calc(100vh-192px)]">
                <AIConversationContent>
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
                                    disabled={conversation?.status === "resolved" || form.formState.isSubmitting}
                                    //TODO: Or if enhancing Prompt
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
                                <AIInputButton>
                                    <Wand2Icon />
                                    Enhance
                                </AIInputButton>
                            </AIInputTools>
                            <AIInputSubmit disabled={conversation?.status === "resolved" || form.formState.isSubmitting ||
                                !form.formState.isValid
                            }
                                status="ready"
                                type="submit" />

                        </AIInputToolbar>
                    </AIInput>

                </Form>

            </div>
        </div>
    );
};