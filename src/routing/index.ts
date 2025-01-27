import { openai, createOpenAI } from "@ai-sdk/openai";
import { generateObject } from "ai";
import "dotenv/config";
import { z } from "zod";
import { router } from "./router";

const ollama = createOpenAI({ baseURL: "http://localhost:11434/v1" });
const qwen25 = ollama("qwen2.5:14b", { structuredOutputs: true });
const llama3 = ollama("llama3.3", { structuredOutputs: true });
const phi4 = ollama("phi4", { structuredOutputs: true });

const gpt4o = openai("gpt-4o", { structuredOutputs: true });

const requests = [
  router(qwen25, `Hi! My router is not working. I need internet access now!`),
  router(qwen25, `Hi! I didn't get an invoice for this month.  Why is that?`),
  router(
    qwen25,
    `Hi! I want to cancel my subscription now! I am very unhappy and mad.`
  ),
  router(qwen25, `Hello, I need help with my taxes. Can you help me?`),
];

Promise.all(requests).then((responses) =>
  console.dir(responses, { depth: null })
);
