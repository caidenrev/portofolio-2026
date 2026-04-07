import { Column, Heading, Meta, Schema } from "@once-ui-system/core";
import { Mailchimp } from "@/components";
import { Posts } from "@/components/blog/Posts";
import { baseURL, blog, person, newsletter } from "@/resources";
import { getAdminPortfolioPosts, getAdminPortfolioSettings } from "@/lib/firebase/admin-portfolio";

export async function generateMetadata() {
  const settings = await getAdminPortfolioSettings();
  return Meta.generate({
    title: settings.site.blogTitle || blog.title,
    description: settings.site.blogDescription || blog.description,
    baseURL: baseURL,
    image: `/api/og/generate?title=${encodeURIComponent(settings.site.blogTitle || blog.title)}`,
    path: blog.path,
  });
}

export default async function Blog() {
  const settings = await getAdminPortfolioSettings();
  const initialPosts = await getAdminPortfolioPosts();

  return (
    <Column maxWidth="m" paddingTop="24">
      <Schema
        as="blogPosting"
        baseURL={baseURL}
        title={settings.site.blogTitle || blog.title}
        description={settings.site.blogDescription || blog.description}
        path={blog.path}
        image={`/api/og/generate?title=${encodeURIComponent(settings.site.blogTitle || blog.title)}`}
        author={{
          name: settings.profile.name || person.name,
          url: `${baseURL}/blog`,
          image: settings.profile.avatar?.startsWith("http")
            ? settings.profile.avatar
            : `${baseURL}${settings.profile.avatar || person.avatar}`,
        }}
      />
      <Heading marginBottom="l" variant="heading-strong-xl" marginLeft="24">
        {settings.site.blogTitle || blog.title}
      </Heading>
      <Column fillWidth flex={1} gap="40">
        <Posts range={[1, 1]} thumbnail initialPosts={initialPosts} />
        <Posts range={[2, 3]} columns="2" thumbnail direction="column" initialPosts={initialPosts} />
        <Mailchimp marginBottom="l" />
        <Heading as="h2" variant="heading-strong-xl" marginLeft="l">
          Earlier posts
        </Heading>
        <Posts range={[4]} columns="2" initialPosts={initialPosts} />
      </Column>
    </Column>
  );
}
