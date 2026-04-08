import { PostDetailClient } from "@/components";
import {
  Meta,
  Schema,
  Column,
  HeadingNav,
  Row,
} from "@once-ui-system/core";
import { baseURL, blog } from "@/resources";
import type { Metadata } from "next";
import {
  getAdminPortfolioPosts,
  getAdminPortfolioSettings,
} from "@/lib/firebase/admin-portfolio";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string | string[] }>;
}): Promise<Metadata> {
  const routeParams = await params;
  const slugPath = Array.isArray(routeParams.slug)
    ? routeParams.slug.join("/")
    : routeParams.slug || "";

  const posts = await getAdminPortfolioPosts();
  const post = posts.find((item) => item.slug === slugPath);

  if (!post || post.status === "draft") {
    return Meta.generate({
      title: blog.title,
      description: blog.description,
      baseURL,
      image: `/api/og/generate?title=${encodeURIComponent(blog.title)}`,
      path: `${blog.path}/${slugPath}`,
    });
  }

  return Meta.generate({
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.summary,
    baseURL: baseURL,
    image: post.image || `/api/og/generate?title=${post.seoTitle || post.title}`,
    path: `${blog.path}/${post.slug}`,
  });
}

export default async function Blog({ params }: { params: Promise<{ slug: string | string[] }> }) {
  const settings = await getAdminPortfolioSettings();
  const routeParams = await params;
  const slugPath = Array.isArray(routeParams.slug)
    ? routeParams.slug.join("/")
    : routeParams.slug || "";

  const initialPosts = await getAdminPortfolioPosts();
  const initialPost =
    initialPosts.find((post) => post.slug === slugPath && post.status !== "draft") ?? null;

  return (
    <Row fillWidth>
      <Row maxWidth={12} m={{ hide: true }} />
      <Row fillWidth horizontal="center">
        <Column as="section" maxWidth="m" horizontal="center" gap="l" paddingTop="24">
          <Schema
            as="blogPosting"
            baseURL={baseURL}
            path={`${blog.path}/${slugPath}`}
            title={initialPost?.seoTitle ?? initialPost?.title ?? blog.title}
            description={initialPost?.seoDescription ?? initialPost?.summary ?? blog.description}
            datePublished={initialPost?.publishedAt}
            dateModified={initialPost?.publishedAt}
            image={initialPost?.image || `/api/og/generate?title=${encodeURIComponent(initialPost?.seoTitle ?? initialPost?.title ?? blog.title)}`}
            author={{
              name: settings.profile.name,
              url: `${baseURL}/about`,
              image: settings.profile.avatar?.startsWith("http")
                ? settings.profile.avatar
                : `${baseURL}${settings.profile.avatar}`,
            }}
          />
          <PostDetailClient slug={slugPath} initialPost={initialPost} initialPosts={initialPosts} />
        </Column>
      </Row>
      <Column
        maxWidth={12}
        paddingLeft="40"
        fitHeight
        position="sticky"
        top="80"
        gap="16"
        m={{ hide: true }}
      >
        <HeadingNav fitHeight />
      </Column>
    </Row>
  );
}
