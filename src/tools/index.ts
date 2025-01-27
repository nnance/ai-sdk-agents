import { createOpenAI, openai } from "@ai-sdk/openai";
import { calculate } from "./math";

const ollama = createOpenAI({ baseURL: "http://localhost:11434/v1" });
const qwen25 = ollama("qwen2.5:14b", { structuredOutputs: true });
const llama3 = ollama("llama3.3", { structuredOutputs: true });
const phi4 = ollama("phi4", { structuredOutputs: true });

const gpt4o = openai("gpt-4o", { structuredOutputs: true });

calculate(
  gpt4o,
  "A taxi driver earns $9461 per 1-hour of work. " +
    "If he works 12 hours a day and in 1 hour " +
    "he uses 12 liters of petrol with a price  of $134 for 1 liter. " +
    "How much money does he earn after expenses in one day?"
).then(({ toolCalls, steps }) => {
  console.log("Tool calls:");
  console.dir(toolCalls, { depth: null });
  console.log("Steps:");
  const allToolCalls = steps.flatMap((step) => step.toolCalls);
  console.dir(allToolCalls, { depth: null });
});
