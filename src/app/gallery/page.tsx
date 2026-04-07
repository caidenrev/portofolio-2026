import { Flex, Meta, Schema } from "@once-ui-system/core";
import GalleryView from "@/components/gallery/GalleryView";
import { baseURL, gallery, person } from "@/resources";
import { getAdminPortfolioSettings } from "@/lib/firebase/admin-portfolio";

export async function generateMetadata() {
  const settings = await getAdminPortfolioSettings();
  return Meta.generate({
    title: settings.site.galleryTitle || gallery.title,
    description: settings.site.galleryDescription || gallery.description,
    baseURL: baseURL,
    image: `/api/og/generate?title=${encodeURIComponent(settings.site.galleryTitle || gallery.title)}`,
    path: gallery.path,
  });
}

export default async function Gallery() {
  const settings = await getAdminPortfolioSettings();
  return (
    <Flex maxWidth="l">
      <Schema
        as="webPage"
        baseURL={baseURL}
        title={settings.site.galleryTitle || gallery.title}
        description={settings.site.galleryDescription || gallery.description}
        path={gallery.path}
        image={`/api/og/generate?title=${encodeURIComponent(settings.site.galleryTitle || gallery.title)}`}
        author={{
          name: settings.profile.name || person.name,
          url: `${baseURL}${gallery.path}`,
          image: settings.profile.avatar?.startsWith("http")
            ? settings.profile.avatar
            : `${baseURL}${settings.profile.avatar || person.avatar}`,
        }}
      />
      <GalleryView />
    </Flex>
  );
}
