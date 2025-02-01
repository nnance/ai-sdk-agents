import { router } from "./router";
import { registry } from "../util/registry";

const model = registry.languageModel("remoteProvider:structure-medium");

const requests = [
  router(model, `Hi! My router is not working. I need internet access now!`),
  router(model, `Hi! I didn't get an invoice for this month.  Why is that?`),
  router(model, `Hello, I need help with my taxes. Can you help me?`),
];

Promise.all(requests).then((responses) =>
  console.dir(responses, { depth: null })
);
