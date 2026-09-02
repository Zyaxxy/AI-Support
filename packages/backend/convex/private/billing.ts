import { query } from "../_generated/server";
import { ConvexError } from "convex/values";
import rag from "../system/aiAgents/rag";

export const getUsage = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (identity === null) {
            throw new ConvexError({
                code: "UNAUTHORIZED",
                message: "Identity not found",
            });
        }
        const orgId = identity.orgId as string;
        if (!orgId) {
            throw new ConvexError({
                code: "UNAUTHORIZED",
                message: "Organization not found",
            });
        }

        // Count conversations for this org
        const conversations = await ctx.db
            .query("conversations")
            .withIndex("by_organizationId", (q) => q.eq("organizationId", orgId))
            .collect();

        // Count live calls for this org
        const liveCalls = await ctx.db
            .query("liveCalls")
            .withIndex("by_organizationId", (q) => q.eq("organizationId", orgId))
            .collect();

        // Count contact sessions for this org
        const contactSessions = await ctx.db
            .query("contactSessions")
            .withIndex("by_organizationId", (q) => q.eq("organizationId", orgId))
            .collect();

        // Count offline tickets
        const tickets = await ctx.db
            .query("offlineTickets")
            .withIndex("by_organizationId", (q) => q.eq("organizationId", orgId))
            .collect();

        // Get RAG files count
        let fileCount = 0;
        try {
            const namespace = await rag.getNamespace(ctx, { namespace: orgId });
            if (namespace) {
                const results = await rag.list(ctx, {
                    namespaceId: namespace.namespaceId,
                    paginationOpts: { numItems: 100, cursor: null },
                });
                fileCount = results.page.length;
            }
        } catch {
            fileCount = 0;
        }

        // Calculate voice call minutes
        const totalCallSeconds = liveCalls.reduce((sum, c) => {
            if (c.endedAt && c.startedAt) {
                return sum + Math.max(0, Math.floor((c.endedAt - c.startedAt) / 1000));
            }
            return sum + 60; // default estimated duration
        }, 0);
        const totalVoiceMinutes = Math.round((totalCallSeconds / 60) * 10) / 10;

        // Plan limits (Starter / Free Tier)
        const plan = {
            name: "Starter (Free Tier)",
            status: "active",
            renewalDate: "Renews monthly (Free)",
            limits: {
                messages: 1000,
                files: 50,
                voiceMinutes: 30,
                seats: 3,
            },
            usage: {
                messages: conversations.length * 4 + 12, // estimated messages
                conversations: conversations.length,
                files: fileCount,
                voiceMinutes: totalVoiceMinutes,
                activeCalls: liveCalls.filter((c) => c.status !== "ended").length,
                contactSessions: contactSessions.length,
                tickets: tickets.length,
            },
        };

        return plan;
    },
});
