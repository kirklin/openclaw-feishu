import type { AgentResponse, FeishuMessage } from "../domain/entities";
import type { IAgentDispatcher } from "../domain/ports";
import { Agent } from "openclaw";

export class OpenClawAdapter implements IAgentDispatcher {
  constructor(private agentId: string) { }

  async dispatch(message: FeishuMessage): Promise<AgentResponse | undefined> {
    const agent = new Agent(this.agentId);

    // In a real OpenClaw integration, we'd use the session management
    // For MVP, we'll keep it simple: just passing the content
    const response = await agent.chat(message.content, {
      user: message.senderOpenId,
      session: message.chatId,
    });

    if (response && response.content) {
      return {
        content: response.content,
        messageType: "text",
      };
    }

    return undefined;
  }
}
