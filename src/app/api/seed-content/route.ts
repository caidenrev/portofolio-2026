import { NextResponse } from "next/server";
import { getPosts } from "@/utils/utils";
import { defaultPortfolioSettings } from "@/lib/portfolio-defaults";
import { gallery } from "@/resources";
import type { PortfolioGalleryItem, PortfolioPost, PortfolioProject } from "@/types";

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

function getLocalPosts(): PortfolioPost[] {
  return getPosts(["src", "app", "blog", "posts"]).map((post) => ({
    slug: post.slug,
    title: post.metadata.title,
    subtitle: post.metadata.subtitle,
    summary: post.metadata.summary,
    content: post.content,
    publishedAt: post.metadata.publishedAt,
    image: post.metadata.image,
    tag: post.metadata.tag,
  }));
}

function getLocalGallery(): PortfolioGalleryItem[] {
  return gallery.images.map((image, index) => ({
    src: image.src,
    alt: image.alt,
    orientation: image.orientation as "horizontal" | "vertical",
    order: index,
  }));
}

export async function GET() {
  return NextResponse.json({
    settings: defaultPortfolioSettings,
    projects: getLocalProjects(),
    posts: getLocalPosts(),
    gallery: getLocalGallery(),
  });
}
