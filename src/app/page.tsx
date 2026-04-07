import {
  Heading,
  Text,
  Button,
  Avatar,
  RevealFx,
  Column,
  Badge,
  Row,
  Schema,
  Meta,
  Line,
} from "@once-ui-system/core";
import { home, about, person, baseURL, routes } from "@/resources";
import { HomeIntro, Mailchimp } from "@/components";
import { Projects } from "@/components/work/Projects";
import { Posts } from "@/components/blog/Posts";
import { getPosts } from "@/utils/utils";
import { PortfolioPost, PortfolioProject } from "@/types";
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

export async function generateMetadata() {
  const settings = await getPublicPortfolioSettings();
  return Meta.generate({
    title: settings.site.homeTitle || home.title,
    description: settings.site.homeDescription || home.description,
    baseURL: baseURL,
    path: home.path,
    image: home.image,
  });
}

export default async function Home() {
  const settings = await getPublicPortfolioSettings();
  const initialProjects = getLocalProjects();
  const initialPosts = getLocalPosts();

  return (
    <Column maxWidth="m" gap="xl" paddingY="12" horizontal="center">
      <Schema
        as="webPage"
        baseURL={baseURL}
        path={home.path}
        title={settings.site.homeTitle || home.title}
        description={settings.site.homeDescription || home.description}
        image={`/api/og/generate?title=${encodeURIComponent(settings.site.homeTitle || home.title)}`}
        author={{
          name: settings.profile.name || person.name,
          url: `${baseURL}${about.path}`,
          image: settings.profile.avatar?.startsWith("http")
            ? settings.profile.avatar
            : `${baseURL}${settings.profile.avatar || person.avatar}`,
        }}
      />
      <Column fillWidth horizontal="center" gap="m">
        <Column maxWidth="s" horizontal="center" align="center">
          {home.featured.display && (
            <RevealFx
              fillWidth
              horizontal="center"
              paddingTop="16"
              paddingBottom="32"
              paddingLeft="12"
            >
              <Badge
                background="brand-alpha-weak"
                paddingX="12"
                paddingY="4"
                onBackground="neutral-strong"
                textVariant="label-default-s"
                arrow={false}
                href={home.featured.href}
              >
                <Row paddingY="2">{home.featured.title}</Row>
              </Badge>
            </RevealFx>
          )}
          <HomeIntro />
        </Column>
      </Column>
      <RevealFx translateY="16" delay={0.6}>
        <Projects range={[1, 1]} initialProjects={initialProjects} />
      </RevealFx>
      {routes["/blog"] && (
        <Column fillWidth gap="24" marginBottom="l">
          <Row fillWidth paddingRight="64">
            <Line maxWidth={48} />
          </Row>
          <Row fillWidth gap="24" marginTop="40" s={{ direction: "column" }}>
            <Row flex={1} paddingLeft="l" paddingTop="24">
              <Heading as="h2" variant="display-strong-xs" wrap="balance">
                Latest from the blog
              </Heading>
            </Row>
            <Row flex={3} paddingX="20">
              <Posts range={[1, 2]} columns="2" initialPosts={initialPosts} />
            </Row>
          </Row>
          <Row fillWidth paddingLeft="64" horizontal="end">
            <Line maxWidth={48} />
          </Row>
        </Column>
      )}
      <Projects range={[2]} initialProjects={initialProjects} />
      <Mailchimp />
    </Column>
  );
}
