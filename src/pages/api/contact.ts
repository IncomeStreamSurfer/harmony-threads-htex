import type { APIRoute } from "astro";
import { serverClient } from "../../lib/supabase";
import { hitOrReject } from "../../lib/rate-limit";
import { sendContactAck } from "../../lib/email";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  const { ok, retryAfterSec } = hitOrReject(ip);
  if (!ok) {
    return new Response(JSON.stringify({ error: "Too many requests" }), { status: 429, headers: { "Retry-After": String(retryAfterSec) } });
  }

  const body = await request.json() as { name?: string; email?: string; message?: string; website?: string; renderedAt?: string };

  if (body.website) return new Response(JSON.stringify({ ok: true }), { status: 200 });

  if (Date.now() - Number(body.renderedAt || 0) < 3000) {
    return new Response(JSON.stringify({ error: "Submitted too fast" }), { status: 400 });
  }

  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim();
  const message = (body.message ?? "").trim();

  if (!name || !email || !message) {
    return new Response(JSON.stringify({ error: "All fields required" }), { status: 400 });
  }

  const sb = serverClient();
  await sb.from("contact_messages").insert({ name, email, message });
  await sendContactAck({ to: email, name });

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
