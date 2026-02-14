import { mutation, query } from "../_generated/server";
import { ConvexError, v } from "convex/values";

// ---------------------------------------------------------------------------
// Random data pools for simulated calls
// ---------------------------------------------------------------------------
const CUSTOMER_NAMES = [
    "Sarah Connor", "James Wilson", "Emily Zhang", "Marcus Johnson",
    "Priya Sharma", "David Kim", "Rachel Green", "Alex Thompson",
    "Maria Rodriguez", "Chris O'Brien",
];

const INTENTS = [
    "Technical Support", "Billing Inquiry", "Account Setup",
    "Feature Request", "Bug Report", "General Question",
    "Cancellation", "Upgrade Request",
];

const PLANS = ["Starter", "Professional", "Enterprise", "Custom"];

const SAMPLE_TRANSCRIPTS: Array<{
    sender: "ai" | "user";
    text: string;
}[]> = [
    [
        { sender: "user", text: "Hi, I'm having issues with the API integration. The webhook endpoint keeps timing out." },
        { sender: "ai", text: "I understand you're experiencing webhook timeouts. Let me look into your account configuration. Could you share the endpoint URL you're using?" },
        { sender: "user", text: "Sure, it's https://api.ourservice.com/webhooks/receive. It was working fine until yesterday." },
        { sender: "ai", text: "Thank you. I can see the endpoint is responding with a 504 status. Your timeout threshold is set to 3 seconds — I'd recommend increasing it to 10 seconds given your plan's payload size." },
    ],
    [
        { sender: "user", text: "I need to speak with someone about my billing. I was charged twice this month." },
        { sender: "ai", text: "I'm sorry to hear about the double charge. Let me pull up your billing history to investigate." },
        { sender: "user", text: "It's under the email john@example.com." },
        { sender: "ai", text: "I can see the duplicate charge from Feb 10th. I'll initiate a refund for the extra $49.99 right away." },
    ],
    [
        { sender: "user", text: "How do I set up SSO for my team?" },
        { sender: "ai", text: "Great question! SSO is available on Enterprise plans. You can configure it under Settings > Security > Single Sign-On." },
        { sender: "user", text: "We're on the Professional plan. Can we upgrade?" },
        { sender: "ai", text: "Absolutely! I can help you upgrade right now. The Enterprise plan includes SSO, priority support, and advanced analytics." },
    ],
    [
        { sender: "user", text: "I need to speak with a manager right now." },
        { sender: "ai", text: "I understand your concern. Let me connect you with a team member who can help. Could you briefly describe the issue?" },
    ],
];

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

export const getMany = query({
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

        // Get all active (non-ended) calls for this org
        const allCalls = await ctx.db
            .query("liveCalls")
            .withIndex("by_organizationId", (q) => q.eq("organizationId", orgId))
            .order("desc")
            .collect();

        const activeCalls = allCalls.filter((c) => c.status !== "ended");
        const endedCalls = allCalls.filter((c) => c.status === "ended");

        // Derive KPIs
        const liveConcurrentCalls = activeCalls.length;

        const handoffCount = activeCalls.filter(
            (c) => c.status === "handoff_requested"
        ).length;
        const interventionRate =
            activeCalls.length > 0
                ? Math.round((handoffCount / activeCalls.length) * 100)
                : 0;

        // Avg resolution time from ended calls (endedAt - startedAt)
        let avgResolutionMs = 0;
        if (endedCalls.length > 0) {
            const totalMs = endedCalls.reduce((sum, c) => {
                return sum + ((c.endedAt ?? c.startedAt) - c.startedAt);
            }, 0);
            avgResolutionMs = totalMs / endedCalls.length;
        }

        return {
            calls: activeCalls,
            kpi: {
                liveConcurrentCalls,
                interventionRate,
                avgResolutionMs,
            },
        };
    },
});

export const getOne = query({
    args: {
        callId: v.id("liveCalls"),
    },
    handler: async (ctx, args) => {
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

        const call = await ctx.db.get(args.callId);
        if (!call) {
            throw new ConvexError({
                code: "NOT_FOUND",
                message: "Call not found",
            });
        }
        if (call.organizationId !== orgId) {
            throw new ConvexError({
                code: "UNAUTHORIZED",
                message: "You are not authorized to access this call",
            });
        }
        return call;
    },
});

// ---------------------------------------------------------------------------
// Mutations
// ---------------------------------------------------------------------------

export const simulateCall = mutation({
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

        const customer =
            CUSTOMER_NAMES[Math.floor(Math.random() * CUSTOMER_NAMES.length)]!;
        const intent = INTENTS[Math.floor(Math.random() * INTENTS.length)]!;
        const plan = PLANS[Math.floor(Math.random() * PLANS.length)]!;
        const sentiment = Math.round((0.3 + Math.random() * 0.7) * 100) / 100;
        const transcriptTemplate =
            SAMPLE_TRANSCRIPTS[
                Math.floor(Math.random() * SAMPLE_TRANSCRIPTS.length)
            ]!;

        const now = Date.now();
        const baseHour = new Date(now).getHours();
        const baseMin = new Date(now).getMinutes();

        const transcript = transcriptTemplate.map((msg, i) => ({
            ...msg,
            timestamp: `${String(baseHour).padStart(2, "0")}:${String(baseMin).padStart(2, "0")}:${String(i * 8).padStart(2, "0")}`,
        }));

        // Random status weighted towards ai_handling
        const statusRoll = Math.random();
        const status: "ai_handling" | "handoff_requested" | "queued" =
            statusRoll < 0.65
                ? "ai_handling"
                : statusRoll < 0.85
                    ? "queued"
                    : "handoff_requested";

        const alertLevel: "normal" | "warning" | "critical" =
            status === "handoff_requested"
                ? "critical"
                : sentiment < 0.4
                    ? "warning"
                    : "normal";

        const callId = await ctx.db.insert("liveCalls", {
            organizationId: orgId,
            customer,
            intent,
            status,
            sentimentScore: sentiment,
            alertLevel,
            startedAt: now - Math.floor(Math.random() * 300_000), // up to 5 min ago
            plan,
            lastInteraction: `${Math.floor(Math.random() * 14) + 1} days ago`,
            transcript,
        });

        return callId;
    },
});

export const endCall = mutation({
    args: {
        callId: v.id("liveCalls"),
    },
    handler: async (ctx, args) => {
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

        const call = await ctx.db.get(args.callId);
        if (!call || call.organizationId !== orgId) {
            throw new ConvexError({
                code: "NOT_FOUND",
                message: "Call not found",
            });
        }

        await ctx.db.patch(args.callId, {
            status: "ended",
            endedAt: Date.now(),
        });
    },
});

export const intervene = mutation({
    args: {
        callId: v.id("liveCalls"),
    },
    handler: async (ctx, args) => {
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

        const call = await ctx.db.get(args.callId);
        if (!call || call.organizationId !== orgId) {
            throw new ConvexError({
                code: "NOT_FOUND",
                message: "Call not found",
            });
        }

        await ctx.db.patch(args.callId, {
            status: "handoff_requested",
            alertLevel: "critical",
        });
    },
});
