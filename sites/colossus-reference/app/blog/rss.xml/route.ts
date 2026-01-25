import { NextResponse } from "next/server";
import { getBlogPosts } from "@/lib/content";
import { absUrl } from "@/lib/site";

export async function GET() {
  const posts = await getBlogPosts();

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Colossus Scaffolding Blog</title>
    <link>${absUrl("/blog")}</link>
    <description>Professional scaffolding insights, safety tips, and industry guidance from the experts at Colossus Scaffolding.</description>
    <language>en-GB</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${absUrl("/blog/rss.xml")}" rel="self" type="application/rss+xml"/>
    <image>
      <url>${absUrl("/Colossus-Scaffolding-Logo.svg")}</url>
      <title>Colossus Scaffolding Blog</title>
      <link>${absUrl("/blog")}</link>
    </image>
    ${posts
      .slice(0, 20)
      .map(
        (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${absUrl(`/blog/${post.slug}`)}</link>
      <guid isPermaLink="true">${absUrl(`/blog/${post.slug}`)}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description><![CDATA[${post.excerpt}]]></description>
      <category>${post.category}</category>
      <author>${post.author.name}</author>
    </item>`
      )
      .join("")}
  </channel>
</rss>`;

  return new NextResponse(rssXml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
