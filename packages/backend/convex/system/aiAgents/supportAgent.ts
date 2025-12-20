import { Agent } from "@convex-dev/agent";
import { components } from "../../_generated/api";
import { google } from '@ai-sdk/google';

export const SupportAgent = new Agent(components.agent, {
    name: "Support Agent",
    languageModel: google("gemini-2.5-flash"),
    instructions: 'You are a Customer Support Agent.',
});