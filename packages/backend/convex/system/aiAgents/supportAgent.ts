import { Agent } from "@convex-dev/agent";
import { components } from "../../_generated/api";
import { google } from '@ai-sdk/google';
import { escalateConversation } from "./tools/escalateConversation";
import { resolveConversation } from "./tools/resolveConversation";

export const SupportAgent = new Agent(components.agent, {
    name: "Support Agent",
    languageModel: google("gemini-2.5-flash"),
    instructions: 'You are a Customer Support Agent.Use "resolveConversation" to resolve a conversation when user expresses finalization of the conversation or Users Query is Resolved. Use "escalateConversation to escalate a conversation when user expresses frustration requests for a Human Agent.',
    tools: {
        escalateConversation,
        resolveConversation,
    },
});