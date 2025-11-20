import { v } from "convex/values";
import { mutation } from "../_generated/server";
const SESSION_EXPIRATION = 60 * 60 * 24 * 1000;
export const create = mutation({
    args: {
        name: v.string(),
        email: v.string(),
        organizationId: v.string(),
   
        metadata: v.optional(v.object({
            userAgent: v.optional(v.string()),
            language: v.optional(v.string()),
            languages: v.optional(v.array(v.string())),
            timezone: v.optional(v.string()),
            timezoneOffset: v.optional(v.number()),
            cookieEnabled: v.optional(v.boolean()),
            viewportSize: v.optional(v.string()),
            referrer: v.optional(v.string()),        })),
    },  
    handler: async (ctx, args ) => {
       const now = Date.now();
       const expiresAt = now + SESSION_EXPIRATION;

       const contactSessionId = await ctx.db.insert("contactSessions", {
           name: args.name,
           email: args.email,
           organizationId: args.organizationId,
           expiresAt,
           metadata: args.metadata,
       });

       return contactSessionId;     
    },
}); 

export const validate = mutation({
    args: {
        contactSessionId: v.id("contactSessions"),
    },  
    handler: async (ctx, args ) => {
        const contactSession = await ctx.db.get(args.contactSessionId);
        if (!contactSession) {
            return {valid: false , reason: "contactSession not found"};
        }
        if (contactSession.expiresAt < Date.now()) {
            return {valid: false , reason: "contactSession expired"};
        }
        return {valid: true, contactSession};
    },
});