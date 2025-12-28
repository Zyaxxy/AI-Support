import { mutation, query } from "../_generated/server";
import { components } from "../_generated/api";
import { ConvexError, v } from "convex/values";
import { SupportAgent } from "../system/aiAgents/supportAgent";
import { MessageDoc, saveMessage } from "@convex-dev/agent";
import { paginationOptsValidator } from "convex/server";

export const getMany = query({
    args: {
        status: v.optional(
            v.union(
                v.literal("unresolved"),
                v.literal("escalated"),
                v.literal("resolved"),
            )
        ),
        paginationOpts: paginationOptsValidator,
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new ConvexError({
                code: "UNAUTHORIZED",
                message: "Identity not found"
            })
        }
        const orgId = identity.ordId as string;

        const conversations = await ctx.db.query("conversations").
            withIndex("by_organizationId", (q) => q.eq("organizationId", orgId)).order("desc").
            paginate(args.paginationOpts)

        const conversationWithLastMessage = await Promise.all(conversations.page.map(async (conversation) => {
            let lastMessage: MessageDoc | null = null;
            const Messages = await SupportAgent.listMessages(ctx, {
                threadId: conversation.threadId,
                paginationOpts: {
                    numItems: 1,
                    cursor: null,
                }
            })
            if (Messages.page.length > 0) {
                lastMessage = Messages.page[0] ?? null;
            }
            return {
                _id: conversation._id,
                _creationTime: conversation._creationTime,
                status: conversation.status,
                organizationId: conversation.organizationId,
                threadId: conversation.threadId,
                lastMessage,
            }
        }))
        return {
            ...conversations,
            page: conversationWithLastMessage,
        }
    },
})

export const create = mutation({
    args: {
        organizationId: v.string(),
        contactSessionId: v.id("contactSessions"),
    },
    handler: async (ctx, args) => {
        const session = await ctx.db.get(args.contactSessionId);
        if (!session || session.expiresAt < Date.now()) {
            throw new ConvexError({
                code: "UNAUTHORIZED",
                message: "Invalid session"
            })
        }
        const { threadId } = await SupportAgent.createThread(ctx, {
            userId: args.organizationId
        });
        await saveMessage(ctx, components.agent, {
            threadId,
            message: {
                role: "assistant",
                //TODO: Add system prompt
                content: "Hey! How can I help you today?",
            },
        })
        const conversationId = await ctx.db.insert("conversations", {
            contactSessionId: session._id,
            status: "unresolved",
            organizationId: args.organizationId,
            threadId,
        })
        return conversationId;
    },

});

export const getOne = query({
    args: {
        conversationId: v.id("conversations"),
        contactSessionId: v.id("contactSessions"),
    },
    handler: async (ctx, args) => {
        const session = await ctx.db.get(args.contactSessionId);
        if (!session || session.expiresAt < Date.now()) {
            throw new ConvexError({
                code: "UNAUTHORIZED",
                message: "Invalid session"
            })
        }
        const conversation = await ctx.db.get(args.conversationId);
        if (!conversation) {
            throw new ConvexError({
                code: "NOT_FOUND",
                message: "Conversation not found"
            })
        }

        if (conversation.contactSessionId !== session._id) {
            throw new ConvexError({
                code: "UNAUTHORIZED",
                message: "Invalid session"
            })
        }
        return {
            _id: conversation._id,
            status: conversation.status,
            threadId: conversation.threadId,
        };
    },
});