import { v } from "convex/values";
import { internalMutation, internalQuery } from "../_generated/server";

const upsert = internalMutation({
    args: v.object({
        organizationId: v.string(),
        service:v.union(v.literal("vapi")),
        value:v.any(),
    }),
    handler: async (ctx, args) => {
        const existingPlugin = await ctx.db.query("plugins").withIndex("by_service_and_organizationId",
            (q) => q.eq("service", args.service).eq("organizationId", args.organizationId)).unique();
        if (existingPlugin) {
            await ctx.db.patch(existingPlugin._id, {
                service: args.service,
                secretName: args.value.secretName,
            });
        } else{
            await ctx.db.insert("plugins", {
                organizationId: args.organizationId,
                service: args.service,
                secretName: args.value.secretName,
            });
        }
    }
});

export const getByOrganizationIdAndService = internalQuery({
    args: v.object({
        organizationId: v.string(),
        service:v.union(v.literal("vapi")),
    }),
    handler: async (ctx, args) => {
        return ctx.db.query("plugins").withIndex("by_service_and_organizationId",
            (q) => q.eq("service", args.service).eq("organizationId", args.organizationId)).unique();
    }
}); 