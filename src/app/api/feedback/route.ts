import { verifyConversation } from "@/lib/rag/conversation-token";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

/**
 * ثبت بازخورد 👍/👎 برای آخرین پاسخ یک گفتگو.
 * بدنه: { conversationId: string, rating: "up" | "down", comment?: string }
 */
export async function POST(req: Request) {
  const parsed = z.object({ conversationId: z.string().max(160), rating: z.enum(["up", "down"]), comment: z.string().max(500).optional() }).safeParse(await req.json().catch(() => null));
  if (!parsed.success) return new Response("ورودی نامعتبر.", { status: 400 });
  const { rating, comment } = parsed.data;
  const conversationId = verifyConversation(parsed.data.conversationId, "web") || verifyConversation(parsed.data.conversationId, "widget");
  if (!conversationId) return new Response("نشست نامعتبر.", { status: 403 });

  const supabase = getSupabaseAdmin();
  if (!supabase) return new Response("سرویس در دسترس نیست.", { status: 503 });

  // آخرین پیام دستیار در این گفتگو
  const { data: lastMsg } = await supabase
    .from("messages")
    .select("id")
    .eq("conversation_id", conversationId)
    .eq("role", "assistant")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { error } = await supabase.from("feedback").insert({
    message_id: lastMsg?.id ?? null,
    rating,
    comment: comment?.slice(0, 500) ?? null,
  });

  if (error) {
    console.error("[/api/feedback] خطا:", error.message);
    return new Response("ثبت بازخورد ناموفق بود.", { status: 500 });
  }
  return Response.json({ ok: true });
}
