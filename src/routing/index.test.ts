import { installMatchers } from "../util/matchers";
import { router, selectAgentType } from "./router";
import { registry } from "../util/registry";

const providers = [
  "remoteProvider:structure-medium",
  "localProvider:structure-medium",
] as const;

installMatchers();

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

  describe(`${provider} LLM as the judge`, () => {
    const model = registry.languageModel(provider);
    var routerResponse: string;

    const gradingConfig = {
      provider: "openai:chat:gpt-4o-mini",
    };

    beforeAll(async () => {
      const { text } = await router(
        model,
        `Hi! My router is not working. I need internet access now!`
      );
      routerResponse = text;
    }, 20000);

    test("should pass when strings are semantically similar", async () => {
      return expect(routerResponse).toMatchSemanticSimilarity(
        `I can help you troubleshoot your router issue. Here are some steps you can follow:\n` +
          `   1. Ensure the router is plugged in and powered on. Look for any lights on the router; typically, there should be a power light and a light indicating internet connectivity.\n` +
          `   2. Unplug the router from the power source, wait about 30 seconds, and then plug it back in. This can often resolve temporary issues.\n` +
          `   3. If you are using Wi-Fi, try connecting your computer directly to the router using an Ethernet cable. This can help determine if the issue is with the Wi-Fi signal or the internet connection itself.\n` +
          `   4. Ensure that your device's Wi-Fi is turned on and that you are connected to the correct network.\n` +
          `   5. Forget the network on your device and reconnect by entering the password again.\n` +
          `   6. If none of the above steps work, you may need to reset the router to factory settings. Look for a small reset button on the router, press and hold it for about 10 seconds (you may need a paperclip), and then set it up again.\n` +
          `   7. Check if there's an update available for your router’s firmware and install it.`,
        0.75
      );
    }, 20000);

    test("should not recommend contacting ISP", async () => {
      return expect(routerResponse).toPassLLMRubric(
        `Should not contain recommendation to contact their ISP`,
        gradingConfig
      );
    }, 20000);
  });
});
