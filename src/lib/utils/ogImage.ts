import type { CollectionEntry } from "astro:content";

/**
 * Generate OG image URL for articles and pages
 * Uses inline SVG data URLs for static generation
 */
export function generateOGImage(
  title: string,
  description: string,
  type: "article" | "website" = "website",
): string {
  // Generate SVG content
  const svgContent = generateSVGOGImageContent(title, description, type);

  // Encode SVG as data URL
  const encodedSvg = encodeURIComponent(svgContent);
  return `data:image/svg+xml;charset=UTF-8,${encodedSvg}`;
}

/**
 * Generate the actual SVG content for an OG image
 */
export function generateSVGOGImageContent(
  title: string,
  description: string,
  type: "article" | "website" = "website",
): string {
  return `
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
        </linearGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="rgba(0,0,0,0.3)"/>
        </filter>
      </defs>

      <!-- Background -->
      <rect width="1200" height="630" fill="url(#bg)"/>

      <!-- Background pattern -->
      <circle cx="300" cy="157.5" r="150" fill="rgba(255,255,255,0.1)"/>
      <circle cx="900" cy="472.5" r="150" fill="rgba(255,255,255,0.1)"/>

      <!-- Content -->
      <text x="600" y="120" text-anchor="middle" font-family="Arial, sans-serif" font-size="48" font-weight="bold" fill="white" filter="url(#shadow)">
        DailyNest
      </text>

      <text x="600" y="200" text-anchor="middle" font-family="Arial, sans-serif" font-size="64" font-weight="bold" fill="white" filter="url(#shadow)">
        ${escapeXml(title)}
      </text>

      <text x="600" y="280" text-anchor="middle" font-family="Arial, sans-serif" font-size="32" fill="rgba(255,255,255,0.9)" filter="url(#shadow)">
        ${escapeXml(description)}
      </text>

      <!-- Badge -->
      <rect x="900" y="40" width="200" height="60" rx="30" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>
      <text x="1000" y="80" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="white">
        ${type.toUpperCase()}
      </text>

      <!-- Footer -->
      <text x="80" y="580" font-family="Arial, sans-serif" font-size="24" fill="rgba(255,255,255,0.7)">
        dailynest.github.io
      </text>
    </svg>
  `.trim();
}

/**
 * Check if an article has a custom OG image
 */
export function hasCustomOGImage(
  collection: CollectionEntry<"articles">,
): boolean {
  return !!(collection.data.cover || collection.data.coverUrl);
}

/**
 * Get OG image URL for a collection entry
 * Uses custom image if available, otherwise generates one
 */
export function getOGImageForCollection(
  collection: CollectionEntry<"articles" | "views">,
  title: string,
  description: string,
): string {
  if (collection.collection === "articles") {
    const articleData = (collection as CollectionEntry<"articles">).data;
    if (articleData.cover?.src || articleData.coverUrl) {
      // Use existing cover
      return articleData.cover?.src || articleData.coverUrl || "";
    }
  }

  // Generate OG image using data URL
  return generateOGImage(
    title,
    description,
    collection.collection === "articles" ? "article" : "website",
  );
}

/**
 * Escape XML characters for SVG text
 */
function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case "'":
        return "&#39;";
      case '"':
        return "&quot;";
      default:
        return c;
    }
  });
}
