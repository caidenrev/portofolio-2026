import { Column, Heading, Meta, Schema } from "@once-ui-system/core";
import { baseURL, about, person, work } from "@/resources";
import { Projects } from "@/components/work/Projects";
import { getPublicPortfolioProjects, getPublicPortfolioSettings } from "@/lib/firestore-rest";

export async function generateMetadata() {
  const settings = await getPublicPortfolioSettings();
  return Meta.generate({
    title: settings.site.workTitle || work.title,
    description: settings.site.workDescription || work.description,
    baseURL: baseURL,
    image: `/api/og/generate?title=${encodeURIComponent(settings.site.workTitle || work.title)}`,
    path: work.path,
  });
}

export default async function Work() {
  const settings = await getPublicPortfolioSettings();
  const initialProjects = await getPublicPortfolioProjects();

  return (
    <Column maxWidth="m" paddingTop="24">
      <Schema
        as="webPage"
        baseURL={baseURL}
        path={work.path}
        title={settings.site.workTitle || work.title}
        description={settings.site.workDescription || work.description}
        image={`/api/og/generate?title=${encodeURIComponent(settings.site.workTitle || work.title)}`}
        author={{
          name: settings.profile.name || person.name,
          url: `${baseURL}${about.path}`,
          image: settings.profile.avatar?.startsWith("http")
            ? settings.profile.avatar
            : `${baseURL}${settings.profile.avatar || person.avatar}`,
        }}
      />
      <Heading marginBottom="l" variant="heading-strong-xl" align="center">
        {settings.site.workTitle || work.title}
      </Heading>
      <Projects initialProjects={initialProjects} />
    </Column>
  );
}
