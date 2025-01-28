import "dotenv/config";
import { assertions } from "promptfoo";
import type { GradingConfig } from "promptfoo";
import { expect } from "@jest/globals";

const { matchesSimilarity, matchesLlmRubric } = assertions;

declare global {
  namespace jest {
    interface Matchers<R> {
      toMatchSemanticSimilarity(expected: string, threshold?: number): R;
      toPassLLMRubric(expected: string, gradingConfig: GradingConfig): R;
    }
  }
}

export function installMatchers() {
  expect.extend({
    async toMatchSemanticSimilarity(
      received: string,
      expected: string,
      threshold: number = 0.8
    ) {
      const result = await matchesSimilarity(received, expected, threshold);
      const pass = received === expected || result.pass;
      if (pass) {
        return {
          message: () =>
            `expected ${received} not to match semantic similarity with ${expected}`,
          pass: true,
        };
      } else {
        return {
          message: () =>
            `expected ${received} to match semantic similarity with ${expected}, but it did not. Reason: ${result.reason}`,
          pass: false,
        };
      }
    },

    async toPassLLMRubric(
      received: string,
      expected: string,
      gradingConfig: GradingConfig
    ) {
      const gradingResult = await matchesLlmRubric(
        expected,
        received,
        gradingConfig
      );
      if (gradingResult.pass) {
        return {
          message: () =>
            `expected ${received} not to pass LLM Rubric with ${expected}`,
          pass: true,
        };
      } else {
        return {
          message: () =>
            `expected ${received} to pass LLM Rubric with ${expected}, but it did not. Reason: ${gradingResult.reason}`,
          pass: false,
        };
      }
    },
  });
}
