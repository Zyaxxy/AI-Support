import { action, query } from "../_generated/server";
import { ConvexError, v } from "convex/values";
import { internal } from "../_generated/api";
import { SupportAgent } from "../../convex/system/aiAgents/supportAgent";
import { paginationOptsValidator } from "convex/server";
import { resolveConversation } from "../system/aiAgents/tools/resolveConversation";
import { escalateConversation } from "../system/aiAgents/tools/escalateConversation";
import { components } from "../_generated/api";
import { saveMessage } from "@convex-dev/agent";
import { searchTool } from "../system/aiAgents/tools/search";


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
        const shouldTriggerAgent = conversation.status === "unresolved";
        //TODO: Subscription
        if (shouldTriggerAgent) {
            await SupportAgent.generateText(ctx, { threadId: args.threadId }, {
                prompt: args.prompt,
                tools: {
                    resolveConversation,
                    escalateConversation,
                    searchTool,
                },
            })
        }
        else {
            await saveMessage(ctx, components.agent,
                {
                    threadId: args.threadId,
                    prompt: args.prompt,
                });
        }
    }
})

export const getMany = query({
    args: {
        threadId: v.string(),
        paginationOpts: paginationOptsValidator,
        contactSessionId: v.id("contactSessions"),
    },
    handler: async (ctx, args) => {
        const contactSession = await ctx.db.get(args.contactSessionId);
        if (!contactSession || contactSession.expiresAt < Date.now()) {
            throw new ConvexError({
                code: "UNAUTHORIZED",
                message: "Invalid or Expired Session"
            })
        }
        const paginated = await SupportAgent.listMessages(ctx,
            {
                threadId: args.threadId,
                paginationOpts: args.paginationOpts,
            }
        )
        return paginated;
    },
})
