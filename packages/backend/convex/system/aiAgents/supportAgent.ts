import { Agent } from "@convex-dev/agent";
import { components } from "../../_generated/api";
import { google } from '@ai-sdk/google';
import { escalateConversation } from "./tools/escalateConversation";
import { resolveConversation } from "./tools/resolveConversation";
import { SUPPORT_AGENT_PROMPT } from "./constants";

export const SupportAgent = new Agent(components.agent, {
    name: "Support Agent",
    languageModel: google("gemini-2.5-flash"),
    instructions: SUPPORT_AGENT_PROMPT,
    tools: {
        escalateConversation,
        resolveConversation,
    },
});