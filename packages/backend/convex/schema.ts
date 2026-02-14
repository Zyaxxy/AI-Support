import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({

    plugins: defineTable({
        organizationId: v.string(),
        service:v.union(v.literal("vapi")),
        secretName:v.string(),
    })
        .index("by_organizationId", ["organizationId"])
        .index("by_service_and_organizationId", ["service", "organizationId"]),
    conversations: defineTable({
        threadId: v.string(),
        organizationId: v.string(),
        contactSessionId: v.id("contactSessions"),
        status: v.union(
            v.literal("unresolved"),
            v.literal("escalated"),
            v.literal("resolved")
        ),

    })
        .index("by_organizationId", ["organizationId"])
        .index("by_contactSessionId", ["contactSessionId"])
        .index("by_threadId", ["threadId"])
        .index("by_status_and_organization_id", ["status", "organizationId"]),

    contactSessions: defineTable({
        name: v.string(),
        email: v.string(),
        organizationId: v.string(),
        expiresAt: v.number(),
        metadata: v.optional(v.object({
            userAgent: v.optional(v.string()),
            language: v.optional(v.string()),
            languages: v.optional(v.array(v.string())),
            timezone: v.optional(v.string()),
            timezoneOffset: v.optional(v.number()),
            cookieEnabled: v.optional(v.boolean()),
            viewportSize: v.optional(v.string()),
            referrer: v.optional(v.string()),
            refferer: v.optional(v.string()),
        })),
    })
        .index("by_organizationId", ["organizationId"])
        .index("by_expiresAt", ["expiresAt"]),
    users: defineTable({
        name: v.string(),
    }),
    liveCalls: defineTable({
        organizationId: v.string(),
        customer: v.string(),
        intent: v.string(),
        status: v.union(
            v.literal("ai_handling"),
            v.literal("handoff_requested"),
            v.literal("queued"),
            v.literal("ended")
        ),
        sentimentScore: v.optional(v.number()),
        alertLevel: v.optional(
            v.union(
                v.literal("normal"),
                v.literal("warning"),
                v.literal("critical")
            )
        ),
        startedAt: v.number(),
        endedAt: v.optional(v.number()),
        plan: v.optional(v.string()),
        lastInteraction: v.optional(v.string()),
        transcript: v.array(
            v.object({
                sender: v.union(v.literal("ai"), v.literal("user")),
                text: v.string(),
                timestamp: v.string(),
            })
        ),
    })
        .index("by_organizationId_and_status", ["organizationId", "status"])
        .index("by_organizationId", ["organizationId"]),
})  