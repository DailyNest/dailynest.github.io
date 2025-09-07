import { execSync } from "node:child_process";
import getReadingTime from "reading-time";
import { toString as ConvertToString } from "mdast-util-to-string";

function isGitAvailable() {
  try {
    execSync("git --version", { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

function isGitRepo() {
  try {
    execSync("git rev-parse --is-inside-work-tree", { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

export function modifiedTime() {
  return (_, file) => {
    const filepath = file.history[0];
    let lastModified = null;
    let hasGitHistory = false;

    if (isGitAvailable() && isGitRepo()) {
      try {
        // Get the last commit date for this specific file
        const gitResult = execSync(
          `git log -1 --format="%cI" -- "${filepath}"`,
          { stdio: ["ignore", "pipe", "ignore"], encoding: "utf8" },
        )
          .toString()
          .trim();

        if (gitResult && gitResult !== "") {
          lastModified = gitResult;
          hasGitHistory = true;
        }
      } catch (error) {
        console.warn(
          `Failed to get Git commit date for ${filepath}:`,
          error.message,
        );
      }
    }

    // Only set lastModified if we have actual Git history
    // Don't fallback to file system time as it's not meaningful for users
    if (!file.data.astro) {
      file.data.astro = {};
    }
    if (!file.data.astro.frontmatter) {
      file.data.astro.frontmatter = {};
    }

    // Only set lastModified if we have real Git history
    if (hasGitHistory && lastModified) {
      file.data.astro.frontmatter.lastModified = lastModified;
    }
    // If no Git history, don't set lastModified at all
  };
}

export function readingTime() {
  return (tree, { data }) => {
    const textOnPage = ConvertToString(tree);
    const readingTime = getReadingTime(textOnPage, { wordsPerMinute: 180 });
    data.astro.frontmatter.minutesRead = readingTime.text;
  };
}
