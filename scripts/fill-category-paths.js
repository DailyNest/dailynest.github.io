#!/usr/bin/env node
const fs = require("fs").promises;
const path = require("path");

function slugify(str) {
  return String(str)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

async function main() {
  const categoriesDir = path.join(
    __dirname,
    "..",
    "src",
    "content",
    "categories",
  );
  let dirs;
  try {
    dirs = await fs.readdir(categoriesDir, { withFileTypes: true });
  } catch (err) {
    console.error("Could not read categories directory:", err.message);
    process.exit(1);
  }

  for (const dirent of dirs) {
    if (!dirent.isDirectory()) continue;
    const idxPath = path.join(categoriesDir, dirent.name, "index.json");
    try {
      const raw = await fs.readFile(idxPath, "utf8");
      const data = JSON.parse(raw);
      if (
        !data.path ||
        typeof data.path !== "string" ||
        data.path.trim() === ""
      ) {
        if (!data.title) {
          console.warn(`Skipping ${idxPath}: missing title to generate path`);
          continue;
        }
        const newPath = slugify(data.title);
        data.path = newPath;
        await fs.writeFile(
          idxPath,
          JSON.stringify(data, null, 2) + "\n",
          "utf8",
        );
        console.log(`Updated ${idxPath} -> path: ${newPath}`);
      }
    } catch (err) {
      console.warn(`Could not process ${idxPath}: ${err.message}`);
    }
  }
}

main();
