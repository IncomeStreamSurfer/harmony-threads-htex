import sanitizeHtml from "sanitize-html";

export function safeHtml(dirty: string): string {
  return sanitizeHtml(dirty, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img", "figure", "figcaption", "video", "source"]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      "*": ["class", "id", "style"],
      a: ["href", "name", "target", "rel"],
      img: ["src", "srcset", "alt", "width", "height", "loading"],
      video: ["src", "controls", "poster", "preload"],
      source: ["src", "type"],
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
  });
}
