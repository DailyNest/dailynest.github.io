import { render, type CollectionEntry } from "astro:content";
import { authorsHandler } from "@/lib/handlers/authors";
import type { ArticleMeta, Meta } from "@/lib/types";
import { capitalizeFirstLetter } from "@/lib/utils/letter";
import { normalizeDate } from "@/lib/utils/date";
import { SITE } from "@/lib/config";
import { articlePermalink } from "@/lib/utils/permalinks";
import { getOGImageForCollection } from "@/lib/utils/ogImage";

type GetMetaCollection = CollectionEntry<"articles" | "views">;

const renderCache = new Map<string, any>();

export const getMeta = async (
  collection: GetMetaCollection,
  category?: string,
): Promise<Meta | ArticleMeta> => {
  try {
    const collectionId = `${collection.collection}-${collection.id}`;

    if (collection.collection === "articles") {
      if (renderCache.has(collectionId)) {
        return renderCache.get(collectionId);
      }

      const { remarkPluginFrontmatter } = await render(collection);
      const authors = authorsHandler.getAuthors(collection.data.authors);

      // Generate OG image - use custom if available, otherwise generate dynamic
      const ogImage = getOGImageForCollection(
        collection,
        collection.data.title,
        collection.data.description || SITE.description,
      );

      const ogImageAlt = collection.data.covert_alt || collection.data.title;

      const meta: ArticleMeta = {
        title: `${collection.data.title} | ${SITE.title}`,
        metaTitle: collection.data.title,
        description: collection.data.description || SITE.description,
        ogImage,
        ogImageAlt,
        publishedTime: normalizeDate(collection.data.publishedTime),
        ...(remarkPluginFrontmatter.lastModified && {
          lastModified: remarkPluginFrontmatter.lastModified,
        }),
        authors: authors.map((author) => ({
          name: author.data.name,
          link: `${author.id}`,
        })),
        type: "article",
        url: `${SITE.url}${articlePermalink(collection as any)}`,
        canonical: `${SITE.url}${articlePermalink(collection as any)}`,
        lang: SITE.locale,
        publisher: SITE.title,
        keywords: Array.isArray(collection.data.keywords)
          ? collection.data.keywords
          : SITE.keywords || [],
      };

      renderCache.set(collectionId, meta);

      return meta;
    }

    if (collection.collection === "views") {
      const cacheKey = category ? `${collectionId}-${category}` : collectionId;
      if (renderCache.has(cacheKey)) {
        return renderCache.get(cacheKey);
      }

      const title =
        collection.id === "categories" && category
          ? `${capitalizeFirstLetter(category)} | ${SITE.title}`
          : collection.id === "home"
            ? SITE.title
            : `${capitalizeFirstLetter(collection.data.title)} | ${SITE.title}`;

      const meta: Meta = {
        title,
        metaTitle: capitalizeFirstLetter(collection.data.title),
        description: collection.data.description || SITE.description,
        ogImage: getOGImageForCollection(
          collection,
          capitalizeFirstLetter(collection.data.title),
          collection.data.description || SITE.description,
        ),
        ogImageAlt: SITE.title,
        type: "website",
        url: SITE.url,
        canonical:
          collection.id === "home"
            ? SITE.url
            : collection.id === "categories" && category
              ? `${SITE.url}/categories/${category}/1`
              : `${SITE.url}/${collection.id}`,
        lang: SITE.locale,
        publisher: SITE.title,
        keywords: Array.isArray(collection.data.keywords)
          ? collection.data.keywords
          : SITE.keywords || [],
      };
      renderCache.set(cacheKey, meta);
      return meta;
    }

    throw new Error(
      `Invalid collection type: ${(collection as GetMetaCollection).collection}`,
    );
  } catch (error) {
    console.error(`Error generating metadata for ${collection.id}:`, error);
    throw error;
  }
};
