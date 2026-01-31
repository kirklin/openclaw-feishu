export type ChatType = "p2p" | "group";

export interface FeishuMessage {
  messageId: string;
  chatId: string;
  chatType: ChatType;
  senderId: string;
  senderOpenId: string;
  content: string;
  contentType: string;
  mentionedBot: boolean;
  rootId?: string;
  parentId?: string;
  senderName?: string;
}

export interface AgentResponse {
  content: string;
  messageType?: "text" | "post" | "image";
}

export interface BotConfig {
  appId: string;
  appSecret: string;
  verificationToken?: string;
  encryptKey?: string;
  agentId?: string;
}
