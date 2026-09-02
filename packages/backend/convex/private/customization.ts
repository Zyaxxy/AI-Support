import { mutation, query } from "../_generated/server";
import { ConvexError, v } from "convex/values";

export const get = query({
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

        const customization = await ctx.db
            .query("customization")
            .withIndex("by_organizationId", (q) => q.eq("organizationId", orgId))
            .unique();

        if (!customization) {
            return {
                primaryColor: "#2563eb",
                widgetTitle: "Echo Support",
                greetingHeading: "Hey there 👋",
                greetingSubheading: "Let's get you started",
                botName: "Echo Assistant",
                botAvatar: undefined,
                position: "bottom-right" as const,
                enableVoice: true,
                enableHumanHandoff: true,
                offlineEmail: undefined,
                theme: "system" as const,
            };
        }

        return customization;
    },
});

export const update = mutation({
    args: {
        primaryColor: v.string(),
        widgetTitle: v.string(),
        greetingHeading: v.string(),
        greetingSubheading: v.string(),
        botName: v.string(),
        botAvatar: v.optional(v.string()),
        position: v.union(v.literal("bottom-right"), v.literal("bottom-left")),
        enableVoice: v.boolean(),
        enableHumanHandoff: v.boolean(),
        offlineEmail: v.optional(v.string()),
        theme: v.optional(v.union(v.literal("light"), v.literal("dark"), v.literal("system"))),
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

        const existing = await ctx.db
            .query("customization")
            .withIndex("by_organizationId", (q) => q.eq("organizationId", orgId))
            .unique();

        if (existing) {
            await ctx.db.patch(existing._id, {
                primaryColor: args.primaryColor,
                widgetTitle: args.widgetTitle,
                greetingHeading: args.greetingHeading,
                greetingSubheading: args.greetingSubheading,
                botName: args.botName,
                botAvatar: args.botAvatar,
                position: args.position,
                enableVoice: args.enableVoice,
                enableHumanHandoff: args.enableHumanHandoff,
                offlineEmail: args.offlineEmail,
                theme: args.theme,
            });
            return existing._id;
        } else {
            const id = await ctx.db.insert("customization", {
                organizationId: orgId,
                primaryColor: args.primaryColor,
                widgetTitle: args.widgetTitle,
                greetingHeading: args.greetingHeading,
                greetingSubheading: args.greetingSubheading,
                botName: args.botName,
                botAvatar: args.botAvatar,
                position: args.position,
                enableVoice: args.enableVoice,
                enableHumanHandoff: args.enableHumanHandoff,
                offlineEmail: args.offlineEmail,
                theme: args.theme,
            });
            return id;
        }
    },
});
