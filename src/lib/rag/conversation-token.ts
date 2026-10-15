import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
function key() { return process.env.CHAT_SESSION_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY; }
export function signConversation(id: string, channel: string): string | null {
 const secret = key();
 if (!secret) return null;
 return id + "." + createHmac("sha256", secret).update(channel + ":" + id).digest("hex");
}
export function verifyConversation(token: string, channel: string): string | null {
 const [id, signature, extra] = token.split(".");
 if (extra || !/^[a-f0-9-]{36}$/i.test(id ?? "") || !/^[a-f0-9]{64}$/.test(signature ?? "")) return null;
 const expected = signConversation(id, channel)?.split(".")[1];
 return expected && timingSafeEqual(Buffer.from(signature), Buffer.from(expected)) ? id : null;
}
