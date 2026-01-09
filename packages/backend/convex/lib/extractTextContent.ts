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
    filename: string;
    mimeType: string;
    bytes?: ArrayBuffer;
}

export async function extractTextContent(ctx: { storage: StorageActionWriter }, args: ExtractTextContentArgs): Promise<string> {
    const { storageId, filename, mimeType, bytes } = args;
    const url = await ctx.storage.getUrl(storageId);
    assert(url, "Storage URL not found");
    if (SUPPORT_IMAGE_TYPES.some((type) => type === mimeType)) {
        return extractImageText(url);
    }
    if (mimeType.toLowerCase().includes("pdf")) {
        return extractPdfText(url, filename, mimeType);
    }
    if (mimeType.toLowerCase().includes("text")) {
        return extractTextFileContent(ctx, storageId, bytes, mimeType);
    }
    throw new Error("Unsupported MIME type:" + mimeType);
}

async function extractTextFileContent(ctx: { storage: StorageActionWriter },
    storageId: Id<"_storage">, bytes: ArrayBuffer | undefined, mimeType: string): Promise<string> {
    const arrayBuffer = bytes || (await (await ctx.storage.get(storageId))?.arrayBuffer());
    if (!arrayBuffer) {
        throw new Error("ArrayBuffer not found");
    }
    const text = new TextDecoder().decode(arrayBuffer);
    if (mimeType.toLocaleLowerCase() !== "text/plain") {
        const result = await generateText({
            model: AI_MODEL.html,
            system: SYSTEM_PROMPT.html,
            messages: [
                {
                    role: "user",
                    content: [{ type: "text", text },
                    {
                        type: "text",
                        text: "Extract the text content from the file and print it in markdown format without any additional information."
                    }],
                },
            ],
        })
        return result.text;
    }
    return text;
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

async function extractPdfText(url: string, filename: string, mimeType: string): Promise<string> {
    const result = await generateText({
        model: AI_MODEL.pdf,
        system: SYSTEM_PROMPT.pdf,
        messages: [
            {
                role: "user",
                content: [{
                    type: "file",
                    data: new URL(url),
                    filename: filename,
                    mediaType: mimeType,
                }, {
                    type: "text",
                    text: "Extract the text content from the PDF file and return it without any additional information.",
                }],
            },
        ],
    })
    return result.text;
}
