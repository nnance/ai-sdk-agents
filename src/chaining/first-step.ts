import { generateObject, LanguageModelV1 } from "ai";
import { z } from "zod";

export function firstStep(model: LanguageModelV1, prompt: string) {
  return generateObject({
    model,
    system:
      "You are a first point of contact for a loan company. Your job is to turn client conversation into loan application.",
    schema: z.object({
      name: z.string(),
      loan_amount: z.number(),
      loan_time_in_months: z.number(),
      monthly_income: z.number(),
    }),
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });
}
