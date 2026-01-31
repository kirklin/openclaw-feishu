import type { FeishuMessage } from "../domain/entities";
import type { IAgentDispatcher, IMessageSender } from "../domain/ports";

export class MessageHandler {
  constructor(
    private messageSender: IMessageSender,
    private agentDispatcher: IAgentDispatcher,
  ) { }

  async handleMessage(message: FeishuMessage): Promise<void> {
    // 1. Pre-process (Optional: Check if bot was mentioned in group, etc.)
    if (message.chatType === "group" && !message.mentionedBot) {
      return;
    }

    // 2. Resolve sender name for better context (Best effort)
    const senderName = await this.messageSender.getUserName(message.senderOpenId);
    if (senderName) {
      message.senderName = senderName;
    }

    // 3. Dispatch to Agent
    const response = await this.agentDispatcher.dispatch(message);

    // 4. Send reply if response exists
    if (response) {
      await this.messageSender.sendMessage(message.chatId, response, message.messageId);
    }
  }
}
