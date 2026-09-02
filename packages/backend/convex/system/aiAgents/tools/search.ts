import { google } from "@ai-sdk/google";
import { createTool } from "@convex-dev/agent";
import { generateText } from "ai";
import { z } from "zod";
import { internal } from "../../../_generated/api";
import { rag } from "../rag";
import { SEARCH_INTERPRETER_PROMPT } from "../constants";

export const searchTool = createTool({
    description: "Search for information in the knowledge base",
    args: z.object({
        query: z.string().describe("The Search Query to find relevant information in the knowledge base"),
    }),
    async handler(ctx, args) {
        if (!ctx.threadId) {
            return "Thread ID is required";
        }
        const conversation = await ctx.runQuery(internal.system.coversations.getByThreadId, { threadId: ctx.threadId });
        if (!conversation) {
            return "Conversation not found";
        }
        
        const orgId = conversation.organizationId;
        const searchResult = await rag.search(ctx, { namespace: orgId, query: args.query, limit: 5 });
        
        if (!searchResult.entries || searchResult.entries.length === 0) {
            return "I couldn't find specific information about that in our knowledge base. Would you like me to connect you with a human support agent who can help?";
        }

        const contextText = 'Found Results: ' + searchResult.entries.map((result) => result.title || null).filter((title) => title !== null).join(", ") 
        + ".\n Context: " + searchResult.entries.map((result) => result.text).join("\n");
        
        const response = await generateText({
            model: google("gemini-2.5-flash"),
            messages: [
                { role: "system", content: SEARCH_INTERPRETER_PROMPT },
                { role: "user", content: "User Asked: " + args.query + "\n\n Search Results: " + contextText },
            ],
        });

        return response.text;
    },
});