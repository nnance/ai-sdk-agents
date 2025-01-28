import { calculate } from "./math";
import { registry } from "../util/registry";

const model = registry.languageModel("remoteProvider:structure-large");

calculate(
  model,
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
