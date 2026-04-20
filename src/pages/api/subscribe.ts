import type { APIRoute } from "astro";
import { serverClient } from "../../lib/supabase";
import { hitOrReject } from "../../lib/rate-limit";
import { sendSubscribeConfirm } from "../../lib/email";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  const { ok, retryAfterSec } = hitOrReject(ip);
  if (!ok) {
    return new Response(JSON.stringify({ error: "Too many requests" }), { status: 429, headers: { "Retry-After": String(retryAfterSec) } });
  }

  const body = await request.json() as { email?: string; website?: string; renderedAt?: string };

  if (body.website) return new Response(JSON.stringify({ ok: true }), { status: 200 });

  if (Date.now() - Number(body.renderedAt || 0) < 3000) {
    return new Response(JSON.stringify({ error: "Submitted too fast" }), { status: 400 });
  }

  const email = (body.email ?? "").trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return new Response(JSON.stringify({ error: "Invalid email" }), { status: 400 });
  }

  const sb = serverClient();
  const { error } = await sb.from("subscribers").insert({ email }).single();
  if (error && !error.message.includes("duplicate")) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  await sendSubscribeConfirm({ to: email });

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
