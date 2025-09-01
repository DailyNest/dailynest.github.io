import type { CollectionEntry } from "astro:content";

function pad2(n: number) {
  return n.toString().padStart(2, "0");
}

export function articleDateSegments(
  publishedTime: string | Date
): { year: string; month: string; day: string } {
  const d = new Date(publishedTime);
  const year = d.getUTCFullYear().toString();
  const month = pad2(d.getUTCMonth() + 1);
  const day = pad2(d.getUTCDate());
  return { year, month, day };
}

export function slugFromId(id: string, fallbackTitle?: string): string {
  // Try to derive slug from id segments
  const parts = id.split("/").filter(Boolean);
  let candidate = parts[parts.length - 1] || id;
  if (candidate.toLowerCase() === "index" && parts.length >= 2) {
    candidate = parts[parts.length - 2];
  }
  if (candidate && candidate.toLowerCase() !== "index") return candidate;
  // Fallback to a slugified title if needed
  if (fallbackTitle) {
    return fallbackTitle
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }
  return id;
}

export function articlePermalink(
  article: CollectionEntry<"articles">
): string {
  const { year, month, day } = articleDateSegments(article.data.publishedTime);
  const slug = slugFromId(article.id, article.data.title);
  return `/articles/${year}/${month}/${day}/${slug}/`;
}

export function articleContentFilePath(
  article: CollectionEntry<"articles">
): string {
  const { year, month, day } = articleDateSegments(article.data.publishedTime);
  const slug = slugFromId(article.id, article.data.title);
  const dateDir = `${year}-${month}-${day}`;
  return `src/content/articles/${dateDir}/${slug}/index.mdx`;
}
