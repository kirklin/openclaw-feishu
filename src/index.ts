import { FeishuAdapter } from "./adapters/feishu-adapter";
import { OpenClawAdapter } from "./adapters/openclaw-adapter";
import { MessageHandler } from "./application/message-handler";
import { config } from "./config";

const feishuAdapter = new FeishuAdapter(config.feishu);
const openclawAdapter = new OpenClawAdapter(config.openclaw.agentId);
const messageHandler = new MessageHandler(feishuAdapter, openclawAdapter);

console.log("🚀 Starting openclaw-feishu...");

feishuAdapter.start((message) => {
  messageHandler.handleMessage(message).catch((err) => {
    console.error("❌ Error handling message:", err);
  });
});

console.log("✨ Bot is running via WebSocket");
