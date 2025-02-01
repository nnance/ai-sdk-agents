import { selectAgentType } from "./router";
import { registry } from "../util/registry";

const providers = [
  "remoteProvider:structure-medium",
  "localProvider:structure-medium",
] as const;

providers.forEach((provider) => {
  describe(`${provider} agent selection tests`, () => {
    const model = registry.languageModel(provider);

    test("should select the technical agent", async () => {
      const agentType = await selectAgentType(
        model,
        `Hi! My router is not working. I need internet access now!`
      );
      return expect(agentType).toBe("technical");
    });

    test("should select the finance agent", async () => {
      const agentType = await selectAgentType(
        model,
        `Hi! I didn't get an invoice for this month.  Why is that?`
      );
      return expect(agentType).toBe("finance");
    });

    test("should select the account agent", async () => {
      const agentType = await selectAgentType(
        model,
        `Hi! I want to cancel my subscription now! I am very unhappy and mad.`
      );
      return expect(agentType).toBe("account");
    });

    test("should not select an agent", async () => {
      const agentType = await selectAgentType(
        model,
        `Hello, I need help with my taxes. Can you help me?`
      );
      return expect(agentType).toBe("unknown");
    });
  });
});
