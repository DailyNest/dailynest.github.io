import { collection, fields } from "@keystatic/core";

export const articlesKs = collection({
  label: "Articles",
  slugField: "title",
  path: "src/content/articles/*/",
  format: { contentField: "content" },
  entryLayout: "form",
  schema: {
    thumbnailSource: fields.select({
      label: "Thumbnail Source",
      options: [
        { label: "Upload image", value: "upload" },
        { label: "Use external URL", value: "url" },
      ],
      defaultValue: "upload",
      description:
        "Choose how to provide the thumbnail. If you upload an image, leave the URL empty.",
    }),
    isDraft: fields.checkbox({
      label: "Is this a draft?",
      defaultValue: false,
    }),
    isMainHeadline: fields.checkbox({
      label: "Is this a main headline?",
      defaultValue: false,
    }),
    isSubHeadline: fields.checkbox({
      label: "Is this a sub headline?",
      defaultValue: false,
    }),
    description: fields.text({
      label: "Description",
      validation: { isRequired: true, length: { max: 160 } },
    }),
    title: fields.slug({
      name: { label: "Title", validation: { length: { max: 60 } } },
    }),
    cover: fields.image({
      label: "Thumbnail (upload)",
      directory: "src/assets/images/articles",
      publicPath: "@assets/images/articles/",
    }),
    coverUrl: fields.url({
      label: "Thumbnail URL (optional)",
      description:
        "If provided, it will be used instead of the uploaded thumbnail. Leave empty when uploading an image.",
    }),
    category: fields.relationship({
      label: "Category",
      collection: "categories",
    }),
    publishedTime: fields.datetime({
      label: "Published Time",
      validation: { isRequired: true },
    }),
    authors: fields.array(
      fields.relationship({
        label: "Authors",
        collection: "authors",
      }),
      {
        label: "Authors",
        itemLabel: (props) => props.value ?? "",
        validation: {
          length: {
            min: 1,
          },
        },
      }
    ),
    keywords: fields.array(fields.text({ label: "Keyword" }), {
      label: "Keywords (optional)",
      itemLabel: (props) => props.value ?? "",
    }),
    content: fields.mdx({
      label: "Content",
      options: {
        image: {
          directory: "src/assets/images/articles",
          publicPath: "@assets/images/articles",
        },
      },
    }),
  },
});
