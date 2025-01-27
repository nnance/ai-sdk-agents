import "dotenv/config";
import { createOpenAI, openai } from "@ai-sdk/openai";
import { experimental_customProvider as customProvider } from "ai";
import { experimental_createProviderRegistry as createProviderRegistry } from "ai";

const ollama = createOpenAI({ baseURL: "http://localhost:11434/v1" });

const remoteProvider = customProvider({
  languageModels: {
    "text-large": openai("gpt-4o"),
    "text-medium": openai("gpt-4o"),
    "text-small": openai("gpt-4o-mini"),
    "structure-large": openai("gpt-4o", { structuredOutputs: true }),
    "structure-medium": openai("gpt-4o", { structuredOutputs: true }),
    "structure-small": openai("gpt-4o-mini", { structuredOutputs: true }),
  },
});

const localProvider = customProvider({
  languageModels: {
    "text-large": ollama("llama3.3"),
    "text-medium": ollama("qwen2.5:14b"),
    "text-small": ollama("phi4"),
    "structure-large": ollama("llama3.3", { structuredOutputs: true }),
    "structure-medium": ollama("qwen2.5:14b", { structuredOutputs: true }),
    "structure-small": ollama("phi4", { structuredOutputs: true }),
  },
  fallbackProvider: remoteProvider,
});

export const registry = createProviderRegistry({
  localProvider,
  remoteProvider,
});
