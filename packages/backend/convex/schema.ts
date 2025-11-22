import { defineSchema ,  defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
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
            refferer: v.optional(v.string()),        })),
    })
    .index("by_organizationId",["organizationId"])
    .index("by_expiresAt",["expiresAt"]),
    users: defineTable({
        name: v.string(),
    }),
})  