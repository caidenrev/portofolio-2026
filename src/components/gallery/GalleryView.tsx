"use client";

import { useEffect, useState } from "react";
import { Media, MasonryGrid } from "@once-ui-system/core";
import { gallery } from "@/resources";
import { getPortfolioGallery } from "@/lib/firebase/portfolio";
import type { PortfolioGalleryItem } from "@/types";

const fallbackImages = gallery.images as PortfolioGalleryItem[];

export default function GalleryView({ initialImages = fallbackImages }: { initialImages?: PortfolioGalleryItem[] }) {
  const [images, setImages] = useState<PortfolioGalleryItem[]>(initialImages);

  useEffect(() => {
    const loadGallery = async () => {
      try {
        const firestoreGallery = await getPortfolioGallery();
        if (firestoreGallery.length > 0) {
          setImages(
            [...firestoreGallery].sort((left, right) => (left.order ?? 0) - (right.order ?? 0)),
          );
        }
      } catch {
        setImages(initialImages);
      }
    };

    void loadGallery();
  }, [initialImages]);

  return (
    <MasonryGrid columns={2} s={{ columns: 1 }}>
      {images.map((image, index) => (
        <Media
          enlarge
          priority={index < 10}
          sizes="(max-width: 560px) 100vw, 50vw"
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          key={index}
          radius="m"
          aspectRatio={image.orientation === "horizontal" ? "16 / 9" : "3 / 4"}
          src={image.src}
          alt={image.alt}
        />
      ))}
    </MasonryGrid>
  );
}
