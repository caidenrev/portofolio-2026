import { NextResponse } from "next/server";
import { defaultPortfolioSettings } from "@/lib/portfolio-defaults";
import { gallery } from "@/resources";
import type { PortfolioGalleryItem } from "@/types";

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
    projects: [],
    posts: [],
    gallery: getLocalGallery(),
  });
}
