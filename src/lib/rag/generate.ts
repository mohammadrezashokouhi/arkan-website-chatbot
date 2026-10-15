import "server-only";
import { generateText, streamText, stepCountIs, type ToolSet } from "ai";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

/** لایه‌ی تولید پاسخ با OpenRouter؛ مناسب اجرای serverless روی Vercel. */

export type ChatMessage = { role: "user" | "assistant"; content: string };

export function getGenerationProvider() {
  return createOpenAICompatible({
    name: "openrouter",
    baseURL: process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY ?? "",
    headers: {
      "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
      "X-Title": "Rayan Digital Assistant",
    },
  });
}

export type StreamChatOptions = {
  model: string;
  system: string;
  messages: ChatMessage[];
  temperature: number;
  topP: number;
  maxOutputTokens: number;
  tools?: ToolSet;
  onFinish?: (event: {
    text: string;
    usage: { inputTokens?: number; outputTokens?: number } | undefined;
    model: string;
  }) => void | Promise<void>;
};

export function streamChat(opts: StreamChatOptions) {
  const provider = getGenerationProvider();

  return streamText({
    model: provider(opts.model),
    system: opts.system,
    messages: opts.messages,
    temperature: opts.temperature,
    topP: opts.topP,
    maxOutputTokens: opts.maxOutputTokens,
    tools: opts.tools,
    // اجازه‌ی چند گام تا مدل بعد از اجرای ابزار، پاسخ نهایی متنی بدهد
    stopWhen: stepCountIs(5),
    onFinish: async (event) => {
      if (opts.onFinish) {
        await opts.onFinish({
          text: event.text,
          usage: {
            inputTokens: event.usage?.inputTokens,
            outputTokens: event.usage?.outputTokens,
          },
          model: opts.model,
        });
      }
    },
  });
}

/** تولید متن یک‌باره (بدون استریم) — برای کارهای پس‌زمینه مثل خلاصه‌سازی. */
export async function completeText(opts: {
  model: string;
  system: string;
  prompt: string;
  maxOutputTokens?: number;
  temperature?: number;
}): Promise<string> {
  const provider = getGenerationProvider();
  const { text } = await generateText({
    model: provider(opts.model),
    system: opts.system,
    prompt: opts.prompt,
    temperature: opts.temperature ?? 0.3,
    maxOutputTokens: opts.maxOutputTokens ?? 2000,
  });
  return text.trim();
}

export function isGenerationConfigured(): boolean {
  return Boolean(process.env.OPENROUTER_API_KEY);
}

/** نام‌های قدیمی برای سازگاری بخش‌های CRM تا زمان پاک‌سازی کامل نام‌گذاری. */
export const getOpenRouter = getGenerationProvider;
export const isOpenRouterConfigured = isGenerationConfigured;
