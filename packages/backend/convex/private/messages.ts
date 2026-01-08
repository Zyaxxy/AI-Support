import { action, mutation, query } from "../_generated/server";
import { ConvexError, v } from "convex/values";
import { generateText } from "ai";
import { SupportAgent } from "../../convex/system/aiAgents/supportAgent";
import { paginationOptsValidator } from "convex/server";
import { saveMessage } from "@convex-dev/agent";
import { components } from "../_generated/api";
import { google } from "@ai-sdk/google";

export const enhanceResponse = action({
    args: {
        prompt: v.string(),
        threadId: v.string(),
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
        const response = await generateText({
            model: google("gemini-2.5-flash"),
            messages: [
                {
                    role: "system",
                    content: "Enhance the operator's message to be more professional,clear and helpful while maintaining the original meaning."
                },
                {
                    role: "user",
                    content: args.prompt
                },
            ],
        });
        return response.text;
    },
});

export const create = mutation({
    args: {
        prompt: v.string(),
        conversationId: v.id("conversations"),
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

        const conversation = await ctx.db.get(args.conversationId);
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

        if (conversation.organizationId !== orgId) {
            throw new ConvexError({
                code: "UNAUTHORIZED",
                message: "You are not authorized to access this conversation"
            })
        }
        if (conversation.status === "unresolved") {
            await ctx.db.patch(args.conversationId, {
                status: "escalated"
            })
        }
        //TODO: Subscription
        await saveMessage(ctx, components.agent, {
            threadId: conversation.threadId,
            agentName: identity.familyName,
            message: {
                role: "assistant",
                content: args.prompt
            }
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
