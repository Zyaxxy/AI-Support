import { action } from "../_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";
import { guessMimeTypeFromContents, guessMimeTypeFromExtension } from "@convex-dev/rag";


const guessMimeType = (fileName: string, bytes: ArrayBuffer): string => {
    return guessMimeTypeFromExtension(fileName) || guessMimeTypeFromContents(bytes) || "application/octet-stream";
}
export const addFile = action({
    args: {
        fileName: v.string(),
        mimeType: v.string(),
        bytes: v.bytes(),
        category: v.optional(v.string()),

    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (identity === null) {
            throw new ConvexError({
                code: "UNAUTHORIZED",
                message: "Identity not found"
            })
        }
        const orgId = identity.orgId as string;

        if (!orgId) {
            throw new ConvexError({
                code: "UNAUTHORIZED",
                message: "Organization not found"
            })
        }

        const { bytes, fileName, category } = args;
        const mimeType = args.mimeType || guessMimeType(fileName, bytes);
        const blob = new Blob([bytes], { type: mimeType });
        const storageId = await ctx.storage.store(blob);

        const text = await extractTextContent(ctx, {
            storageId,
            mimeType,
            fileName,
            category
        })
    }
})