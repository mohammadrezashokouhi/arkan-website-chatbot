import { z } from "zod";
import { signConversation, verifyConversation } from "@/lib/rag/conversation-token";
import { handleChatTurn } from "@/lib/rag/chat";
import { getChatSettings } from "@/lib/rag/config";
import { isRateLimited } from "@/lib/rag/ratelimit";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_MESSAGE_LENGTH = 2000;

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "anon";

  const parsed = z.object({ message: z.string().trim().min(1).max(MAX_MESSAGE_LENGTH), conversationId: z.string().max(160).nullable().optional(), channel: z.enum(["web", "widget"]).default("web") }).safeParse(await req.json().catch(() => null));
  if (!parsed.success) return new Response("درخواست نامعتبر است.", { status: 400 });
  const body = parsed.data;
  const message = body.message;
  const conversationId = body.conversationId ? verifyConversation(body.conversationId, body.channel) : null;
  if (body.conversationId && !conversationId) return new Response("نشست معتبر نیست؛ گفتگوی جدیدی شروع کنید.", { status: 403 });

  // سقف نرخ از پنل خوانده می‌شود و در دیتابیس شمرده می‌شود (نه درون‌حافظه‌ای).
  const settings = await getChatSettings();
  if (await isRateLimited(`chat:${ip}`, settings.rate_limit_per_minute)) {
    return new Response("تعداد درخواست‌ها زیاد است؛ کمی بعد دوباره تلاش کنید.", {
      status: 429,
      headers: { "Retry-After": "60" },
    });
  }

  try {
    const response = await handleChatTurn({
      conversationId,
      channel: body.channel ?? "web",
      userMessage: message,
    });
    const meta = response.headers.get("x-arkan-meta");
    if (meta) {
      const data = JSON.parse(Buffer.from(meta, "base64").toString("utf8"));
      if (data.conversationId) data.conversationId = signConversation(data.conversationId, body.channel);
      response.headers.set("x-arkan-meta", Buffer.from(JSON.stringify(data)).toString("base64"));
    }
    response.headers.set("Cache-Control", "no-store");
    return response;
  } catch (e) {
    console.error("[/api/chat] خطا:", (e as Error).message);
    return new Response(
      "در پاسخ‌گویی خطایی رخ داد. لطفاً دوباره تلاش کنید یا فرم درخواست مشاوره را پر کنید.",
      { status: 500 }
    );
  }
}
