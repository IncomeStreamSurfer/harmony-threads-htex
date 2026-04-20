import type { APIRoute } from "astro";
import { serverClient } from "../lib/supabase";

export const prerender = false;

export const GET: APIRoute = async () => {
  const SITE = (import.meta.env.PUBLIC_SITE_URL ?? "").replace(/\/$/, "");
  const sb = serverClient();

  const [{ data: pages }, { data: articles }, { data: products }] = await Promise.all([
    sb.from("pages").select("slug, title, meta_description").not("published_at", "is", null),
    sb.from("content").select("slug, title, excerpt").not("published_at", "is", null).order("published_at", { ascending: false }).limit(30),
    sb.from("products").select("slug, name, description").not("published_at", "is", null),
  ]);

  const lines: string[] = [];
  lines.push("# Harmony Threads");
  lines.push("");
  lines.push("> Vintage-inspired band graphic t-shirts for music lovers. Premium 180gsm cotton, ethically printed in the UK.");
  lines.push("");
  lines.push("## Key pages");
  lines.push("");
  for (const p of pages ?? []) {
    lines.push(`- [${p.title}](${SITE}/${p.slug === "home" ? "" : p.slug}): ${p.meta_description ?? ""}`);
  }
  lines.push(`- [Shop](${SITE}/shop): Browse all vintage band graphic t-shirts`);
  lines.push(`- [Blog / Journal](${SITE}/blog): Stories about music and band culture`);
  lines.push(`- [About](${SITE}/about): The story behind Harmony Threads`);
  lines.push(`- [Contact](${SITE}/contact): Get in touch with us`);

  if (products && products.length > 0) {
    lines.push("");
    lines.push("## Products");
    lines.push("");
    for (const p of products) {
      lines.push(`- [${p.name}](${SITE}/product/${p.slug}): ${p.description?.slice(0, 100) ?? ""}`);
    }
  }

  if (articles && articles.length > 0) {
    lines.push("");
    lines.push("## Latest articles");
    lines.push("");
    for (const a of articles) {
      lines.push(`- [${a.title}](${SITE}/blog/${a.slug}): ${a.excerpt ?? ""}`);
    }
  }

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
};
