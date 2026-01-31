import type { AgentResponse, BotConfig, FeishuMessage } from "../domain/entities";
import type { IMessageSender } from "../domain/ports";
import * as Lark from "@larksuiteoapi/node-sdk";

export class FeishuAdapter implements IMessageSender {
  private client: Lark.Client;
  private wsClient: Lark.WSClient;

  constructor(private config: BotConfig) {
    this.client = new Lark.Client({
      appId: config.appId,
      appSecret: config.appSecret,
    });
    this.wsClient = new Lark.WSClient({
      appId: config.appId,
      appSecret: config.appSecret,
    });
  }

  async sendMessage(chatId: string, response: AgentResponse, replyToMessageId?: string): Promise<void> {
    const data: any = {
      receive_id: chatId,
      msg_type: response.messageType || "text",
      content: JSON.stringify(
        response.messageType === "post" ? response.content : { text: response.content },
      ),
    };

    if (replyToMessageId) {
      await this.client.im.message.reply({
        path: { message_id: replyToMessageId },
        data: {
          msg_type: data.msg_type,
          content: data.content,
        },
      });
    } else {
      await this.client.im.message.create({
        params: { receive_id_type: "chat_id" },
        data,
      });
    }
  }

  async getUserName(openId: string): Promise<string | undefined> {
    try {
      const res: any = await this.client.contact.user.get({
        path: { user_id: openId },
        params: { user_id_type: "open_id" },
      });
      return res?.data?.user?.name || res?.data?.user?.nickname;
    } catch {
      return undefined;
    }
  }

  start(onMessage: (message: FeishuMessage) => void) {
    const eventDispatcher = new Lark.EventDispatcher({
      encryptKey: this.config.encryptKey,
      verificationToken: this.config.verificationToken,
    });

    eventDispatcher.register({
      "im.message.receive_v1": async (data) => {
        const message = this.parseEvent(data);
        if (message) {
          onMessage(message);
        }
      },
    });

    this.wsClient.start({
      eventDispatcher,
    });
  }

  private parseEvent(event: any): FeishuMessage | null {
    const { message, sender } = event;
    if (!message || !sender) {
      return null;
    }

    let content = "";
    try {
      const parsed = JSON.parse(message.content);
      content = parsed.text || "";
    } catch {
      content = message.content;
    }

    return {
      messageId: message.message_id,
      chatId: message.chat_id,
      chatType: message.chat_type,
      senderId: sender.sender_id.user_id || sender.sender_id.open_id,
      senderOpenId: sender.sender_id.open_id,
      content,
      contentType: message.message_type,
      mentionedBot: message.mentions?.some((m: any) => m.id.open_id === this.config.appId) || false,
      rootId: message.root_id,
      parentId: message.parent_id,
    };
  }
}
