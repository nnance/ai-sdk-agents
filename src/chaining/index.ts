import { openai, createOpenAI } from "@ai-sdk/openai";
import "dotenv/config";
import { firstStep } from "./first-step";
import { verifyResponse } from "./verify-response";

const ollama = createOpenAI({ baseURL: "http://localhost:11434/v1" });
const qwen25 = ollama("qwen2.5:14b", { structuredOutputs: true });
const llama3 = ollama("llama3.3", { structuredOutputs: true });
const phi4 = ollama("phi4", { structuredOutputs: true });

const gpt4o = openai("gpt-4o", { structuredOutputs: true });

async function main() {
  const prompt = `
      Hi! My name is Kewin. 
      I'd like to ask for a loan. 
      I need 2000$. 
      I can pay it back in a year. 
      My salary is 3000$ a month
      `;
  const firstResponse = await firstStep(qwen25, prompt);
  console.dir(firstResponse.object, { depth: null });
  const verification = await verifyResponse(qwen25, firstResponse.object);
  console.dir(verification.object, { depth: null });
}

main();
