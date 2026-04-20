import type { APIRoute } from "astro";
import { adminClient } from "../../../../lib/supabase";

export const prerender = false;

export const POST: APIRoute = async ({ request, params, redirect }) => {
  const sb = adminClient();
  const form = await request.formData();
  const patch = {
    title: String(form.get("title") ?? ""),
    slug: String(form.get("slug") ?? ""),
    meta_title: String(form.get("meta_title") ?? "") || null,
    meta_description: String(form.get("meta_description") ?? "") || null,
    body_html: String(form.get("body_html") ?? "") || null,
    published_at: form.get("published") ? new Date().toISOString() : null,
    updated_at: new Date().toISOString(),
  };
  const { error } = await sb.from("pages").update(patch).eq("id", params.id!);
  if (error) return new Response(error.message, { status: 500 });
  return redirect("/admin/pages");
};
