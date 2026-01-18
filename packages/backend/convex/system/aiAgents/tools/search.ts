import { google } from "@ai-sdk/google";
import { createTool } from "@convex-dev/agent";
import { generateText } from "ai";
import { z } from "zod/v4";
import { internal } from "../../../_generated/api";
import { SupportAgent } from "../supportAgent";
import { rag } from "../rag";

export const searchTool = createTool({
    description: "Search for information in the knowledge base",
    args: z.object({
        query: z.string().describe("The Search Query to find relevant information in the knowledge base"),
    }),
    async handler(ctx, args) {
        if(!ctx.threadId){
            return "Thread ID is required";
        }
        const conversation = await ctx.runQuery(internal.system.coversations.getByThreadId, {threadId: ctx.threadId});
        if(!conversation){
            return "Conversation not found";
        }
        
        const orgId = conversation.organizationId;
        const searchResult = await rag.search(ctx,{namespace: orgId, query: args.query, limit: 5});
        const contextText = 'Found Results: ' + searchResult.entries.map((result) => result.title||null).filter((title) => title !== null).join(", ") 
        + ".\n Here is the context: " + searchResult.entries.map((result) => result.text).join("\n");
        
        const response = await generateText({
            model: google("gemini-2.5-flash"),
            messages: [
                { role: "system", content: "You interpret knowledge base search results and answer the user's query based on the context provided. " },
                { role: "user", content: "User Asked: " + args.query + "\n\n Search Results: " + contextText },
            ],
        });
        await SupportAgent.saveMessage(ctx, {
            threadId: ctx.threadId,
            message:{
                role: "assistant",
                content: response.text,
            }
        })
    },
});