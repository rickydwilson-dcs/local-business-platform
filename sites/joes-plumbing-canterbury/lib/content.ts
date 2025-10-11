import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";

const contentDirectory = path.join(process.cwd(), "content");

export async function getAllContent(type: "services" | "locations") {
  const dir = path.join(contentDirectory, type);
  const files = await fs.readdir(dir);

  const content = await Promise.all(
    files
      .filter((file) => file.endsWith(".mdx"))
      .map(async (file) => {
        const filePath = path.join(dir, file);
        const fileContents = await fs.readFile(filePath, "utf8");
        const { data, content } = matter(fileContents);
        const slug = file.replace(/\.mdx$/, "");

        return {
          slug,
          frontmatter: data,
          content,
        };
      })
  );

  return content;
}

export async function getContentBySlug(
  type: "services" | "locations",
  slug: string
) {
  const filePath = path.join(contentDirectory, type, `${slug}.mdx`);
  const fileContents = await fs.readFile(filePath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    slug,
    frontmatter: data,
    content,
  };
}
