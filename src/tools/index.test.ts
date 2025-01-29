import { installMatchers } from "../util/matchers";
import { calculate } from "./math";
import { registry } from "../util/registry";

const model = registry.languageModel("remoteProvider:structure-large");

installMatchers();

describe("semantic similarity tests", () => {
  test("should pass when strings are semantically similar", async () => {
    const { toolCalls } = await calculate(
      model,
      "A taxi driver earns $9461 per 1-hour of work. " +
        "If he works 12 hours a day and in 1 hour " +
        "he uses 12 liters of petrol with a price  of $134 for 1 liter. " +
        "How much money does he earn after expenses in one day?"
    );

    const answer = toolCalls.find((call) => call.toolName === "answer");
    if (!answer) {
      throw new Error("Answer tool call not found");
    }

    return expect(answer.args.answer).toMatchSemanticSimilarity(
      "earns $94,236 after expenses per day."
    );
  }, 10000);
});
