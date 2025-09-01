import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { SITE } from "../lib/config";

export async function GET(context) {
  const articles = await getCollection("articles");
  return rss({
    title: SITE.title,
    description: SITE.description,
    site: context.site,
    items: articles.map((article) => ({
      title: article.data.title,
      pubDate: article.data.publishedTime,
      description: article.data.description,
      link: `/articles/${new Date(article.data.publishedTime).getUTCFullYear().toString()}/${String(new Date(article.data.publishedTime).getUTCMonth() + 1).padStart(2, '0')}/${String(new Date(article.data.publishedTime).getUTCDate()).padStart(2, '0')}/${article.id.split('/').filter(Boolean).slice(-1)[0] === 'index' ? article.id.split('/').filter(Boolean).slice(-2, -1)[0] : article.id.split('/').filter(Boolean).slice(-1)[0]}/`,
    })),
  });
}
