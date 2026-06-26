import { getAllPosts } from "@/lib/posts";

export async function GET({ site }: { site: URL }) {
  const posts = getAllPosts().slice(0, 50);
  const origin = site?.origin || "https://yunbo.example.com";

  const items = posts
    .map((post) => {
      const link = `${origin}${post.url}`;
      return [
        "<item>",
        `<title><![CDATA[${post.title}]]></title>`,
        `<link>${link}</link>`,
        `<guid>${link}</guid>`,
        `<pubDate>${post.date.toUTCString()}</pubDate>`,
        `<description><![CDATA[${post.description}]]></description>`,
        "</item>"
      ].join("");
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>Yunbo</title>
    <link>${origin}</link>
    <description>A quiet Astro blog theme for thoughtful writing.</description>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8"
    }
  });
}
