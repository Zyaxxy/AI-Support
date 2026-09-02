import { query } from "../_generated/server";
import { v } from "convex/values";

export const getByOrgId = query({
    args: {
        organizationId: v.string(),
    },
    handler: async (ctx, args) => {
        if (!args.organizationId) {
            return null;
        }

        const customization = await ctx.db
            .query("customization")
            .withIndex("by_organizationId", (q) => q.eq("organizationId", args.organizationId))
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
