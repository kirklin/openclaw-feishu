import type { AgentResponse, FeishuMessage } from "./entities";

export interface IMessageSender {
  sendMessage: (chatId: string, response: AgentResponse, replyToMessageId?: string) => Promise<void>;
  getUserName: (openId: string) => Promise<string | undefined>;
}

export interface IAgentDispatcher {
  dispatch: (message: FeishuMessage) => Promise<AgentResponse | undefined>;
}
