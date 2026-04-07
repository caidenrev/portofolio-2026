import { getPosts } from "@/utils/utils";
import { Meta, Schema, Column } from "@once-ui-system/core";
import { baseURL, work } from "@/resources";
import { Metadata } from "next";
import { ProjectDetailClient } from "@/components";
import { PortfolioProject } from "@/types";
import { getPublicPortfolioSettings } from "@/lib/firestore-rest";

function getLocalProjects(): PortfolioProject[] {
  return getPosts(["src", "app", "work", "projects"]).map((post) => ({
    slug: post.slug,
    title: post.metadata.title,
    summary: post.metadata.summary,
    content: post.content,
    publishedAt: post.metadata.publishedAt,
    image: post.metadata.image,
    images: post.metadata.images,
    tag: post.metadata.tag,
    link: post.metadata.link,
    team: post.metadata.team,
  }));
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const posts = getPosts(["src", "app", "work", "projects"]);
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string | string[] }>;
}): Promise<Metadata> {
  const routeParams = await params;
  const slugPath = Array.isArray(routeParams.slug)
    ? routeParams.slug.join("/")
    : routeParams.slug || "";

  const posts = getLocalProjects();
  let post = posts.find((post) => post.slug === slugPath);

  if (!post) {
    return Meta.generate({
      title: work.title,
      description: work.description,
      baseURL,
      image: `/api/og/generate?title=${encodeURIComponent(work.title)}`,
      path: `${work.path}/${slugPath}`,
    });
  }

  return Meta.generate({
    title: post.title,
    description: post.summary,
    baseURL: baseURL,
    image: post.image || `/api/og/generate?title=${post.title}`,
    path: `${work.path}/${post.slug}`,
  });
}

export default async function Project({
  params,
}: {
  params: Promise<{ slug: string | string[] }>;
}) {
  const settings = await getPublicPortfolioSettings();
  const routeParams = await params;
  const slugPath = Array.isArray(routeParams.slug)
    ? routeParams.slug.join("/")
    : routeParams.slug || "";

  const initialProjects = getLocalProjects();
  const initialProject = initialProjects.find((post) => post.slug === slugPath) ?? null;

  return (
    <Column as="section" maxWidth="m" horizontal="center" gap="l">
      <Schema
        as="blogPosting"
        baseURL={baseURL}
        path={`${work.path}/${slugPath}`}
        title={initialProject?.title ?? work.title}
        description={initialProject?.summary ?? work.description}
        datePublished={initialProject?.publishedAt}
        dateModified={initialProject?.publishedAt}
        image={initialProject?.image || `/api/og/generate?title=${encodeURIComponent(initialProject?.title ?? work.title)}`}
        author={{
          name: settings.profile.name,
          url: `${baseURL}/about`,
          image: settings.profile.avatar?.startsWith("http")
            ? settings.profile.avatar
            : `${baseURL}${settings.profile.avatar}`,
        }}
      />
      <ProjectDetailClient
        slug={slugPath}
        initialProject={initialProject}
        initialProjects={initialProjects}
      />
    </Column>
  );
}
