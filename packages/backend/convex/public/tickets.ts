import { mutation } from "../_generated/server";
import { v } from "convex/values";

export const create = mutation({
    args: {
        organizationId: v.string(),
        name: v.string(),
        email: v.string(),
        subject: v.string(),
        message: v.string(),
    },
    handler: async (ctx, args) => {
        const id = await ctx.db.insert("offlineTickets", {
            organizationId: args.organizationId,
            name: args.name,
            email: args.email,
            subject: args.subject,
            message: args.message,
            status: "open",
            createdAt: Date.now(),
        });
        return id;
    },
});
