import { generateObject, generateText, LanguageModelV1 } from "ai";
import { z } from "zod";

const agentTypes = ["technical", "account", "finance", "unknown"] as const;

const agents = {
  technical:
    "You are a tech specialist. Clients call you with technical problems.",
  account:
    "You are an account manager. Clients call you with topics related to their account.",
  finance:
    "You are finance specialist. Clients call you with finance related topics.",
};

export async function router(model: LanguageModelV1, prompt: string) {
  const routingResponse = await generateObject({
    model,
    system:
      `You are a first point of contact for a call center of an Internet Service Provider. ` +
      `Your job is to redirect the client to a correct agent. ` +
      `If you can't determine the agent type, terminate the conversation.  ` +
      `If the questions isn't related to the ISP, terminate the conversation.`,
    schema: z.object({
      agent_type: z.enum(agentTypes),
    }),
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  if (routingResponse.object.agent_type === "unknown") {
    return {
      text: "I'm sorry, I can't help you with that. Goodbye.",
      agentType: routingResponse.object.agent_type,
    };
  }

  const agentResponse = await generateText({
    model,
    system: agents[routingResponse.object.agent_type],
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  return {
    text: agentResponse.text,
    agentType: routingResponse.object.agent_type,
  };
}
