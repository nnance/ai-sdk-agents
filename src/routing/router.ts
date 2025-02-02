import { generateObject, generateText, LanguageModelV1 } from "ai";
import { z } from "zod";

const agents = {
  technical: {
    description:
      "a tech specialist that handles technical problems. examples include: internet issues, router problems, slow connection.",
    prompt:
      "You are a tech specialist for a call center of an Internet Service Provider. Clients call you with technical problems.",
  },
  account: {
    description:
      "an account manager that handles calls related to client accounts. examples include: billing, subscription, cancellation.",
    prompt:
      "You are an account manage rfor a call center of an Internet Service Provider. Clients call you with topics related to their account.",
  },
  finance: {
    description:
      "a finance specialist that handles finance related topics. examples include: invoices, payments, refunds.",
    prompt:
      "You are finance specialist for a call center of an Internet Service Provider. Clients call you with finance related topics.",
  },
  unknown: {
    description: "an unknown agent type",
    prompt: "I'm sorry, I can't help you with that. Goodbye.",
  },
};

const agentTypes = z.enum(Object.keys(agents) as [keyof typeof agents]);

export async function selectAgentType(model: LanguageModelV1, prompt: string) {
  const response = await generateObject({
    model,
    system:
      `You are a first point of contact for a call center of an Internet Service Provider. ` +
      `Your job is to redirect the client to a correct agent. ` +
      `If you can't determine the agent type, terminate the conversation.  ` +
      `If the questions isn't related to the ISP, terminate the conversation. ` +
      `The possible agent types are: ${JSON.stringify(agents)}.`,
    schema: z.object({
      agent_type: agentTypes,
    }),
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  return response.object.agent_type;
}

export const routeToAgent =
  (model: LanguageModelV1, prompt: string) =>
  async (agentType: keyof typeof agents) => {
    const systemPrompt = agents[agentType].prompt;

    if (agentType === "unknown") {
      return {
        text: systemPrompt,
        agentType,
      };
    }

    const agentResponse = await generateText({
      model,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    return {
      text: agentResponse.text,
      agentType,
    };
  };

export async function router(model: LanguageModelV1, prompt: string) {
  return selectAgentType(model, prompt).then(routeToAgent(model, prompt));
}
