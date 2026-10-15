import type { Metadata } from "next";
import ChatPanel from "@/components/chat/ChatPanel";
import { getWidgetConfig } from "@/lib/rag/widget";
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "گفتگو با رایان دیجیتال", description: "راهنمای فارسی طراحی سایت، سئو و دیجیتال مارکتینگ و پیگیری درخواست مشاوره." };
export default async function ChatPage() {
  const config = await getWidgetConfig();
  return <main id="main"><ChatPanel starters={config.suggested_questions} /></main>;
}
