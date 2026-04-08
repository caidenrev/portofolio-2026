export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
import { Meta, Schema, Column } from "@once-ui-system/core";
import { baseURL, work } from "@/resources";
import type { Metadata } from "next";
import { ProjectDetailClient } from "@/components";
import {
  getAdminPortfolioProjects,
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

  const posts = await getAdminPortfolioProjects();
  const post = posts.find((item) => item.slug === slugPath);

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
  const settings = await getAdminPortfolioSettings();
  const routeParams = await params;
  const slugPath = Array.isArray(routeParams.slug)
    ? routeParams.slug.join("/")
    : routeParams.slug || "";

  const initialProjects = await getAdminPortfolioProjects();
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
