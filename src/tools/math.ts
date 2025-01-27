import { generateText, LanguageModelV1, tool } from "ai";
import "dotenv/config";
import * as mathjs from "mathjs";
import { z } from "zod";

export async function calculate(model: LanguageModelV1, expression: string) {
  return generateText({
    model,
    tools: {
      calculate: tool({
        description:
          "A tool for evaluating mathematical expressions. " +
          "Example expressions: " +
          "'1.2 * (2 + 4.5)', '12.7 cm to inch', 'sin(45 deg) ^ 2'.",
        parameters: z.object({ expression: z.string() }),
        execute: async ({ expression }) => mathjs.evaluate(expression),
      }),
      // answer tool: the LLM will provide a structured answer
      answer: tool({
        description: "A tool for providing the final answer.",
        parameters: z.object({
          steps: z.array(
            z.object({
              calculation: z.string(),
              reasoning: z.string(),
            })
          ),
          answer: z.string(),
        }),
        // no execute function - invoking it will terminate the agent
      }),
    },
    toolChoice: "required",
    maxSteps: 10,
    onStepFinish({ text, toolCalls, toolResults, finishReason, usage }) {
      console.log("Step finished:", text);
      console.dir(toolCalls, { depth: null });
    },
    system:
      "You are solving math problems. " +
      "Reason step by step. " +
      "Use the calculator when necessary. " +
      "When you give the final answer, " +
      "provide an explanation for how you arrived at it.",
    prompt: `Solve the following: ${expression}`,
  });
}
