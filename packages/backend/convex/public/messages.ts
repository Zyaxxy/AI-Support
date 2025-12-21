import { action } from "../_generated/server";
import { ConvexError, v } from "convex/values";
import { internal } from "../_generated/api";
import { SupportAgent } from "../../convex/system/aiAgents/supportAgent";

export const create = action({
    args: {
        prompt: v.string(),
        threadId: v.string(),
        contactSessionId: v.id("contactSessions"),
    },
    handler: async (ctx, args) => {
        const contactSession = await ctx.runQuery(
            internal.system.contactSessions.getOne,
            {
                contactSessionId: args.contactSessionId,
            }
        );
        if (!contactSession || contactSession.expiresAt < Date.now()) {
            throw new ConvexError({
                code: "UNAUTHORIZED",
                message: "Invalid Session"
            })
        }

        const conversation = await ctx.runQuery(
            internal.system.coversations.getByThreadId,
            {
                threadId: args.threadId,
            }
        );
        if (!conversation) {
            throw new ConvexError({
                code: "CONVERSATION_NOT_FOUND",
                message: "Conversation not found"
            })
        }

        if (conversation.status === "resolved") {
            throw new ConvexError({
                code: "BAD_REQUEST",
                message: "Conversation resolved"
            })
        }

        //TODO: Subscription
        await SupportAgent.generateText(ctx, { threadId: args.threadId }, {
            prompt: args.prompt,
        })

    }
})  