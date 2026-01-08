import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import type { StorageActionWriter } from "convex/server";
import { assert } from "convex-helpers";
import { Id } from "../_generated/dataModel";

const AI_MODEL = {
    image: google("gemini-2.5-flash"),
    pdf: google("gemini-2.5-flash"),
    html: google("gemini-2.5-flash"),

} as const;

const SUPPORT_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"]

const SYSTEM_PROMPT = {
    image: "You turn Images into text. If it is a photo of a document, transcribe it. If it is not a document, describe it.",
    pdf: "You turn PDFs into text.",
    html: "You turn HTML into markdown.",
}

export type ExtractTextContentArgs = {
    storageId: Id<"_storage">;
    fileName: string;
    mimeType: string;
    bytes?: ArrayBuffer;
}

export async function extractTextContent(ctx: { storage: StorageActionWriter }, args: ExtractTextContentArgs): Promise<string> {
    const { storageId, fileName, mimeType, bytes } = args;
    const url = await ctx.storage.getUrl(storageId);
    assert(url, "Storage URL not found");
    if (SUPPORT_IMAGE_TYPES.some((type) => type === mimeType)) {
        return extractImageText(url);
    }
    if (mimeType.toLowerCase().includes("pdf")) {
        return extractPdfText(url, fileName, mimeType);
    }
    if (mimeType.toLowerCase().includes("html")) {
        return extractHtmlText(url);
    }
    return "";
}

async function extractImageText(url: string): Promise<string> {
    const result = await generateText({
        model: AI_MODEL.image,
        system: SYSTEM_PROMPT.image,
        messages: [
            {
                role: "user",
                content: [{ type: "image", image: new URL(url) }],
            },
        ],
    })
    return result.text;
}

async function extractPdfText(url: string, fileName: string, mimeType: string): Promise<string> {
    const result = await generateText({
        model: AI_MODEL.pdf,
        system: SYSTEM_PROMPT.pdf,
        messages: [
            {
                role: "user",
                content: [{
                    type: "file",
                    data: new URL(url),
                    fileName,
                    mimeType,
                }, {
                    type: "text",
                    text: "Extract the text content from the PDF file and return it without any additional information.",
                }],
            },
        ],
    })
    return result.text;
}
