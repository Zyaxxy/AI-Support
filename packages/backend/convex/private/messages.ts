import { action, query } from "../_generated/server";
import { ConvexError, v } from "convex/values";
import { internal } from "../_generated/api";
import { SupportAgent } from "../../convex/system/aiAgents/supportAgent";
import { paginationOptsValidator } from "convex/server";

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

export const getMany = query({
    args: {
        threadId: v.string(),
        paginationOpts: paginationOptsValidator,
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (identity === null) {
            throw new ConvexError({
                code: "UNAUTHORIZED",
                message: "Identity not found"
            })
        }
        const orgId = identity.orgId as string;

        if (!orgId) {
            throw new ConvexError({
                code: "UNAUTHORIZED",
                message: "Organization not found"
            })
        }
        const conversation = await ctx.db.query("conversations").withIndex("by_threadId",
            (q) => q.eq("threadId", args.threadId)).unique();
        if (!conversation) {
            throw new ConvexError({
                code: "CONVERSATION_NOT_FOUND",
                message: "Conversation not found"
            })
        }
        if (conversation.organizationId !== orgId) {
            throw new ConvexError({
                code: "UNAUTHORIZED",
                message: "You are not authorized to access this conversation"
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
