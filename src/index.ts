import type { OpenClawPluginApi } from "openclaw/plugin-sdk";
import { FeishuAdapter } from "./adapters/feishu-adapter";
import { OpenClawAdapter } from "./adapters/openclaw-adapter";
import { MessageHandler } from "./application/message-handler";
import { config } from "./config";

const plugin = {
  id: "feishu",
  name: "Feishu",
  description: "Feishu/Lark channel plugin",
  configSchema: {
    type: "object",
    additionalProperties: false,
    properties: {
      appId: { type: "string" },
      appSecret: { type: "string" },
      agentId: { type: "string" },
    },
    required: ["appId", "appSecret", "agentId"],
  },
  register(api: OpenClawPluginApi) {
    const feishuAdapter = new FeishuAdapter(config.feishu);
    const openclawAdapter = new OpenClawAdapter(config.openclaw.agentId);
    const messageHandler = new MessageHandler(feishuAdapter, openclawAdapter);
    api.registerChannel({
      plugin: {
        id: "feishu",
        meta: {
          id: "feishu",
          label: "Feishu",
          selectionLabel: "Feishu/Lark (飞书)",
          docsPath: "/channels/feishu",
          docsLabel: "feishu",
          blurb: "Feishu/Lark enterprise messaging.",
          aliases: ["lark"],
          order: 1,
        },
        start: async () => {
          console.log("🚀 Starting openclaw-feishu...");
          feishuAdapter.start((message) => {
            messageHandler.handleMessage(message).catch((err) => {
              console.error("❌ Error handling message:", err);
            });
          });
        },
        stop: async () => {
          // Implement stop logic if needed
        },
      } as any, // Temporary cast until types are fully aligned with SDK
    });
  },
};
export default plugin;
