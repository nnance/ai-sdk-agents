import { openai, createOpenAI } from "@ai-sdk/openai";
import { generateText, tool } from "ai";
import "dotenv/config";
import * as mathjs from "mathjs";
import { z } from "zod";

// connect to the local ollama server
const ollama = createOpenAI({ baseURL: "http://localhost:11434/v1" });
const qwen25 = ollama("qwen2.5:14b", { structuredOutputs: true });
const llama3 = ollama("llama3.3", { structuredOutputs: true });
const phi4 = ollama("phi4", { structuredOutputs: true });

const gpt4o = openai("gpt-4o-2024-08-06", { structuredOutputs: true });

export async function calculate(expression: string) {
  return generateText({
    model: gpt4o,
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
    system:
      "You are solving math problems. " +
      "Reason step by step. " +
      "Use the calculator when necessary. " +
      "When you give the final answer, " +
      "provide an explanation for how you arrived at it.",
    prompt: `Solve the following: ${expression}`,
  });
}
