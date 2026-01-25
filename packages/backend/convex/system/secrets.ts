import { v } from "convex/values"; 
import { internal } from "../_generated/api";
import { internalAction } from "../_generated/server";
import { upsertSecretValue } from "../lib/secrets";

export const upsertSecret = internalAction({
    args: v.object({
        organizationId: v.string(),
        service:v.union(v.literal("vapi")),
        value:v.any(),
    }),
    handler: async (ctx, args) => {
        const secretName = 'tenant/' + args.organizationId + '/' + args.service;
        await upsertSecretValue(secretName, args.value);
        await ctx.runMutation(internal.system.plugins.upsert, {
            organizationId: args.organizationId,
            secretName,
            service: args.service,
        });
        return { status: "success" };
    }   
});

