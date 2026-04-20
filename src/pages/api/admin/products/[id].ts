import type { APIRoute } from "astro";
import { adminClient } from "../../../../lib/supabase";

export const prerender = false;

export const POST: APIRoute = async ({ request, params, redirect }) => {
  const sb = adminClient();
  const form = await request.formData();
  const patch = {
    name: String(form.get("name") ?? ""),
    slug: String(form.get("slug") ?? ""),
    description: String(form.get("description") ?? "") || null,
    body_html: String(form.get("body_html") ?? "") || null,
    price_pence: parseInt(String(form.get("price_pence") ?? "0")),
    compare_at_pence: form.get("compare_at_pence") ? parseInt(String(form.get("compare_at_pence"))) : null,
    image_url: String(form.get("image_url") ?? "") || null,
    meta_title: String(form.get("meta_title") ?? "") || null,
    meta_description: String(form.get("meta_description") ?? "") || null,
    published_at: form.get("published") ? new Date().toISOString() : null,
    updated_at: new Date().toISOString(),
  };
  const { error } = await sb.from("products").update(patch).eq("id", params.id!);
  if (error) return new Response(error.message, { status: 500 });
  return redirect("/admin/products");
};
