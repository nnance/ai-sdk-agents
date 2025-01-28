import { installMatchers } from "../util/matchers";

installMatchers();

describe("semantic similarity tests", () => {
  test("should pass when strings are semantically similar", async () => {
    await expect("The quick brown fox").toMatchSemanticSimilarity(
      "A fast brown fox"
    );
  });

  test("should fail when strings are not semantically similar", async () => {
    await expect("The quick brown fox").not.toMatchSemanticSimilarity(
      "The weather is nice today"
    );
  });

  test("should pass when strings are semantically similar with custom threshold", async () => {
    await expect("The quick brown fox").toMatchSemanticSimilarity(
      "A fast brown fox",
      0.7
    );
  });

  test("should fail when strings are not semantically similar with custom threshold", async () => {
    await expect("The quick brown fox").not.toMatchSemanticSimilarity(
      "The weather is nice today",
      0.9
    );
  });
});
