import readingTime from "reading-time";

export type PostFrontmatter = {
  title?: string;
  description?: string;
  date?: string | Date;
  updated?: string | Date;
  category?: string;
  series?: string;
  tags?: string[];
  draft?: boolean;
  source?: string[];
};

export type Post = {
  slug: string;
  url: string;
  title: string;
  description: string;
  date: Date;
  category: string;
  series: string;
  tags: string[];
  draft: boolean;
  minutes: number;
  coverImage?: string;
  coverAlt?: string;
  entry: MarkdownEntry;
};

type MarkdownEntry = {
  default: unknown;
  frontmatter: PostFrontmatter;
  rawContent: () => string;
};

const postModules = import.meta.glob<MarkdownEntry>("/src/content/posts/**/*.md", { eager: true });

function toDate(value: string | Date | undefined, fallback: Date) {
  if (!value) return fallback;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? fallback : date;
}

function getSlug(path: string) {
  return path.replace("/src/content/posts/", "").replace(/\.md$/, "");
}

function getFirstImage(content: string) {
  const markdownImage = content.match(/!\[([^\]]*)]\(([^)\s]+)(?:\s+"[^"]*")?\)/);
  if (markdownImage) {
    return {
      alt: markdownImage[1] || "",
      src: markdownImage[2]
    };
  }

  const htmlImage = content.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/i);
  if (htmlImage) {
    const alt = htmlImage[0].match(/alt=["']([^"']*)["']/i)?.[1] || "";
    return {
      alt,
      src: htmlImage[1]
    };
  }

  return undefined;
}

export function getAllPosts({ includeDrafts = false } = {}) {
  const posts = Object.entries(postModules)
    .map(([path, entry]) => {
      const frontmatter = entry.frontmatter;
      const rawContent = entry.rawContent();
      const slug = getSlug(path);
      const title = frontmatter.title || slug;
      const fallbackDate = new Date("2026-01-01T00:00:00.000Z");
      const date = toDate(frontmatter.date, fallbackDate);
      const stats = readingTime(rawContent);
      const firstImage = getFirstImage(rawContent);

      return {
        slug,
        url: `/blog/${slug}/`,
        title,
        description: frontmatter.description || rawContent.replace(/\s+/g, " ").slice(0, 120),
        date,
        category: frontmatter.category || "AI",
        series: frontmatter.series || frontmatter.category || "其他内容",
        tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
        draft: Boolean(frontmatter.draft),
        minutes: Math.max(1, Math.round(stats.minutes)),
        coverImage: firstImage?.src,
        coverAlt: firstImage?.alt,
        entry
      } satisfies Post;
    })
    .filter((post) => includeDrafts || !post.draft)
    .sort((a, b) => b.date.getTime() - a.date.getTime());

  return posts;
}

export function getTopics(posts = getAllPosts()) {
  const counts = new Map<string, number>();
  for (const post of posts) {
    counts.set(post.series, (counts.get(post.series) || 0) + 1);
  }
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count, slug: encodeURIComponent(name) }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(date);
}

export function getBlogFilterUrl(filters: { series?: string; tag?: string }) {
  const params = new URLSearchParams();
  if (filters.series) params.set("series", filters.series);
  if (filters.tag) params.set("tag", filters.tag);
  const query = params.toString();
  return query ? `/blog/?${query}` : "/blog/";
}
