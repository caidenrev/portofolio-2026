import { getPosts } from "@/utils/utils";
import { baseURL, blog, person } from "@/resources";
import { NextResponse } from "next/server";
import { getPublicPortfolioPosts, getPublicPortfolioSettings } from "@/lib/firestore-rest";

export async function GET() {
  const localPosts = getPosts(["src", "app", "blog", "posts"]).map((post) => ({
    slug: post.slug,
    title: post.metadata.title,
    summary: post.metadata.summary,
    publishedAt: post.metadata.publishedAt,
    image: post.metadata.image,
    tag: post.metadata.tag,
  }));
  const [portfolioSettings, firestorePosts] = await Promise.all([
    getPublicPortfolioSettings(),
    getPublicPortfolioPosts(),
  ]);
  const posts = firestorePosts.length > 0 ? firestorePosts : localPosts;
  const authorName = portfolioSettings.profile.name || person.name;
  const authorEmail = portfolioSettings.profile.email || person.email || "noreply@example.com";
  const authorAvatar = portfolioSettings.profile.avatar || person.avatar;

  // Sort posts by date (newest first)
  const sortedPosts = posts.sort((a, b) => {
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });

  // Generate RSS XML
  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${blog.title}</title>
    <link>${baseURL}/blog</link>
    <description>${blog.description}</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseURL}/api/rss" rel="self" type="application/rss+xml" />
    <managingEditor>${authorEmail} (${authorName})</managingEditor>
    <webMaster>${authorEmail} (${authorName})</webMaster>
    <image>
      <url>${authorAvatar.startsWith("http") ? authorAvatar : `${baseURL}${authorAvatar}`}</url>
      <title>${blog.title}</title>
      <link>${baseURL}/blog</link>
    </image>
    ${sortedPosts
      .map(
        (post) => `
    <item>
      <title>${post.title}</title>
      <link>${baseURL}/blog/${post.slug}</link>
      <guid>${baseURL}/blog/${post.slug}</guid>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
      <description><![CDATA[${post.summary}]]></description>
      ${post.image ? `<enclosure url="${post.image.startsWith("http") ? post.image : `${baseURL}${post.image}`}" type="image/jpeg" />` : ""}
      ${post.tag ? `<category>${post.tag}</category>` : ""}
      <author>${authorEmail} (${authorName})</author>
    </item>`,
      )
      .join("")}
  </channel>
</rss>`;

  // Return the RSS XML with the appropriate content type
  return new NextResponse(rssXml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
