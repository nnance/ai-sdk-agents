import { openai } from "@ai-sdk/openai";
import { generateText, tool } from "ai";
import "dotenv/config";
import * as mathjs from "mathjs";
import { z } from "zod";

export async function calculate(expression: string) {
  return generateText({
    model: openai("gpt-4o-2024-08-06", { structuredOutputs: true }),
    tools: {
      calculate: tool({
        description:
          "A tool for evaluating mathematical expressions. " +
          "Example expressions: " +
          "'1.2 * (2 + 4.5)', '12.7 cm to inch', 'sin(45 deg) ^ 2'.",
        parameters: z.object({ expression: z.string() }),
        execute: async ({ expression }) => mathjs.evaluate(expression),
      }),
    },
    maxSteps: 10,
    system:
      "You are solving math problems. " +
      "Reason step by step. " +
      "Use the calculator when necessary. " +
      "When you give the final answer, " +
      "provide an explanation for how you arrived at it.",
    prompt: `Solve the following: ${expression}`,
  });
}
