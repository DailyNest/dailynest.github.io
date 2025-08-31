import { getCollection } from "astro:content";

const articlesCollection = (
  await getCollection("articles", ({ data }) => {
    return data.isDraft !== true;
  })
).sort((a, b) =>
  new Date(b.data.publishedTime)
    .toISOString()
    .localeCompare(new Date(a.data.publishedTime).toISOString())
);

export const articlesHandler = {
  allArticles: () => articlesCollection,

  mainHeadline: () => {
    // Prefer an explicit main headline; otherwise fall back to the first article
    const explicit = articlesCollection.find(
      (article) => article.data.isMainHeadline === true
    );
    const article = explicit ?? articlesCollection[0];
    if (!article)
      throw new Error(
        "Please ensure there is at least one item to display for the main headline."
      );
    return article;
  },

  subHeadlines: () => {
    const mainHeadline = articlesHandler.mainHeadline();
    // Prefer articles explicitly marked as sub-headlines, excluding the main headline
    let subHeadlines = articlesCollection
      .filter(
        (article) =>
          article.data.isSubHeadline === true && mainHeadline.id !== article.id
      )
      .slice(0, 4);

    // If none are explicitly marked, fall back to the next-most-recent articles
    if (subHeadlines.length === 0) {
      subHeadlines = articlesCollection
        .filter((article) => article.id !== mainHeadline.id)
        .slice(0, 4);
    }

    return subHeadlines;
  },
};
