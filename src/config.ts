import { z } from "zod";
import "dotenv/config";

const configSchema = z.object({
  FEISHU_APP_ID: z.string(),
  FEISHU_APP_SECRET: z.string(),
  OPENCLAW_AGENT_ID: z.string(),
});

const result = configSchema.safeParse(process.env);

if (!result.success) {
  console.error("❌ Invalid environment variables:", result.error.format());
  process.exit(1);
}

export const config = {
  feishu: {
    appId: result.data.FEISHU_APP_ID,
    appSecret: result.data.FEISHU_APP_SECRET,
  },
  openclaw: {
    agentId: result.data.OPENCLAW_AGENT_ID,
  },
};
