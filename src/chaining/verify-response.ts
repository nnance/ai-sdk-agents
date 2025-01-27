import { generateObject, LanguageModelV1 } from "ai";
import { z } from "zod";

export function verifyResponse(model: LanguageModelV1, firstResponse: object) {
  return generateObject({
    model,
    system:
      "You are a loan specialist. Based on the given json file with client data, your job is to decide if a client can be further processed.",
    schema: z.object({
      is_client_accepted: z
        .boolean()
        .describe("True if client is accepted, false if rejected."),
      denial_reason: z
        .string()
        .describe("If client is rejected, you need to give a reason."),
    }),
    messages: [{ role: "user", content: JSON.stringify(firstResponse) }],
  });
}
