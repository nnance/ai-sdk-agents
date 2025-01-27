import { firstStep } from "./first-step";
import { verifyResponse } from "./verify-response";
import { registry } from "../util/registry";

const model = registry.languageModel("localProvider:structure-medium");

const prompt = `
      Hi! My name is Kewin. 
      I'd like to ask for a loan. 
      I need 2000$. 
      I can pay it back in a year. 
      My salary is 3000$ a month
      `;

firstStep(model, prompt).then((firstResponse) => {
  console.dir(firstResponse.object, { depth: null });
  verifyResponse(model, firstResponse.object).then((verification) => {
    console.dir(verification.object, { depth: null });
  });
});
