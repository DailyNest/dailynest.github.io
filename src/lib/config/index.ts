import type { Link } from "../types";

export const SITE = {
  title: "DailyNest",
  description: "Welcome to the DailyNest, your go-to source for the latest trends in technology and more.",
  // Site-level keywords used as a fallback for pages without keywords
  keywords: ["dailynest", "technology", "programming", "lifestyle", "productivity", "health", "finance", "blog", "tutorial"],
  author: "DailyNest",
  url: "https://dailynest.github.io",
  github: "https://github.com/DailyNest/dailynest.github.io",
  locale: "en-US",
  dir: "ltr",
  charset: "UTF-8",
  basePath: "/",
  postsPerPage: 4,
};

export const NAVIGATION_LINKS: Link[] = [
  {
    href: "/categories/technology",
    text: "Technology",
  },
  {
    href: "/categories/programming",
    text: "Programming",
  },
  {
    href: "/categories/lifestyle",
    text: "Lifestyle",
  },
  {
    href: "/categories/productivity",
    text: "Productivity",
  },
  {
    href: "/categories/health",
    text: "Health",
  },
  {
    href: "/categories/finance",
    text: "Finance",
  },
  {
    href: "/categories/blog",
    text: "Blog",
  },
  {
    href: "/categories/tutorial",
    text: "Tutorial",
  }
];

export const OTHER_LINKS: Link[] = [
  {
    href: "/about",
    text: "About us",
  },
  {
    href: "/authors",
    text: "Authors",
  },
  {
    href: "/contact",
    text: "Contact",
  },
  {
    href: "/privacy",
    text: "Privacy",
  },
  {
    href: "/terms",
    text: "Terms",
  },
  {
    href: "/cookie-policy",
    text: "Cookie Policy",
  },
  { href: "/rss.xml", text: "RSS" },
  { href: "/sitemap-index.xml", text: "Sitemap" },
];

export const SOCIAL_LINKS: Link[] = [
  {
    href: "https://github.com/DailyNest",
    text: "GitHub",
    icon: "github",
  },
];
