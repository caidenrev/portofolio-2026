export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
import { Column, Meta, Schema } from "@once-ui-system/core";
import { baseURL, about, person } from "@/resources";
import { AboutClient } from "@/components/about/AboutClient";
import { getAdminPortfolioSettings } from "@/lib/firebase/admin-portfolio";

export async function generateMetadata() {
  const settings = await getAdminPortfolioSettings();
  return Meta.generate({
    title: settings.site.aboutTitle || about.title,
    description: settings.site.aboutDescription || about.description,
    baseURL,
    image: `/api/og/generate?title=${encodeURIComponent(settings.site.aboutTitle || about.title)}`,
    path: about.path,
  });
}

export default async function About() {
  const settings = await getAdminPortfolioSettings();
  return (
    <Column maxWidth="m">
      <Schema
        as="webPage"
        baseURL={baseURL}
        title={settings.site.aboutTitle || about.title}
        description={settings.site.aboutDescription || about.description}
        path={about.path}
        image={`/api/og/generate?title=${encodeURIComponent(settings.site.aboutTitle || about.title)}`}
        author={{
          name: settings.profile.name || person.name,
          url: `${baseURL}${about.path}`,
          image: settings.profile.avatar?.startsWith("http")
            ? settings.profile.avatar
            : `${baseURL}${settings.profile.avatar || person.avatar}`,
        }}
      />
      <AboutClient />
    </Column>
  );
}
