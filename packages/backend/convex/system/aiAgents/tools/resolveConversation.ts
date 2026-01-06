import { createTool } from "@convex-dev/agent";
import { z } from "zod";
import { internal } from "../../../_generated/api";
import { SupportAgent } from "../supportAgent";


export const resolveConversation = createTool({
    description: "Resolves a conversation",
   args: z.object({}),
    handler: async (ctx) => {
        if(!ctx.threadId) {
            return "Missing threadId";
        }
        await ctx.runMutation(internal.system.coversations.resolve, {
            threadId: ctx.threadId,
        });
        
        await SupportAgent.saveMessage(ctx, {
            threadId: ctx.threadId,
            message: {
                role: "assistant",
                content: "Conversation resolved",
            },
        });
        return "Conversation resolved";
    },
});