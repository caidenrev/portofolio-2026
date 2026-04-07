"use client";

import { useEffect, useState } from "react";
import {
  Avatar,
  Column,
  Heading,
  Line,
  Media,
  Row,
  SmartLink,
  Text,
} from "@once-ui-system/core";
import { baseURL, blog } from "@/resources";
import { formatDate } from "@/utils/formatDate";
import { CustomMDX, ScrollToHash } from "@/components";
import type { PortfolioPost } from "@/types";
import {
  getPortfolioSettings,
  subscribeToPortfolioPostBySlug,
} from "@/lib/firebase/portfolio";
import { defaultPortfolioSettings } from "@/lib/portfolio-defaults";
import { Posts } from "./Posts";
import { ShareSection } from "./ShareSection";

export function PostDetailClient({
  slug,
  initialPost,
  initialPosts = [],
}: {
  slug: string;
  initialPost: PortfolioPost | null;
  initialPosts?: PortfolioPost[];
}) {
  const [post, setPost] = useState<PortfolioPost | null>(initialPost);
  const [authorName, setAuthorName] = useState(defaultPortfolioSettings.profile.name);
  const [authorAvatar, setAuthorAvatar] = useState(defaultPortfolioSettings.profile.avatar);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await getPortfolioSettings();
        if (settings?.profile.name) {
          setAuthorName(settings.profile.name);
        }
        if (settings?.profile.avatar) {
          setAuthorAvatar(settings.profile.avatar);
        }
      } catch {
        setAuthorName(defaultPortfolioSettings.profile.name);
        setAuthorAvatar(defaultPortfolioSettings.profile.avatar);
      }
    };

    void loadSettings();
  }, []);

  useEffect(() => {
    try {
      const unsubscribe = subscribeToPortfolioPostBySlug(slug, (firestorePost) => {
        if (firestorePost) {
          setPost(firestorePost);
          return;
        }

        setPost(initialPost);
      });

      return unsubscribe;
    } catch {
      setPost(initialPost);
      return () => undefined;
    }
  }, [slug, initialPost]);

  if (!post) {
    return (
      <Column maxWidth="s" horizontal="center" gap="12">
        <Heading variant="display-strong-s">Post not found</Heading>
        <Text onBackground="neutral-weak">Artikel ini belum tersedia atau slug-nya salah.</Text>
      </Column>
    );
  }

  return (
    <Column as="section" maxWidth="m" horizontal="center" gap="l" paddingTop="24">
      <Column maxWidth="s" gap="16" horizontal="center" align="center">
        <SmartLink href="/blog">
          <Text variant="label-strong-m">Blog</Text>
        </SmartLink>
        {post.status === "draft" && (
          <Text variant="label-strong-s" onBackground="danger-weak">
            Draft preview
          </Text>
        )}
        <Text variant="body-default-xs" onBackground="neutral-weak" marginBottom="12">
          {post.publishedAt && formatDate(post.publishedAt)}
        </Text>
        <Heading variant="display-strong-m">{post.title}</Heading>
        {post.subtitle && (
          <Text variant="body-default-l" onBackground="neutral-weak" align="center" style={{ fontStyle: "italic" }}>
            {post.subtitle}
          </Text>
        )}
      </Column>
      <Row marginBottom="32" horizontal="center">
        <Row gap="16" vertical="center">
          <Avatar size="s" src={authorAvatar} />
          <Text variant="label-default-m" onBackground="brand-weak">
            {authorName}
          </Text>
        </Row>
      </Row>
      {post.image && (
        <Media
          src={post.image}
          alt={post.title}
          aspectRatio="16/9"
          priority
          sizes="(min-width: 768px) 100vw, 768px"
          border="neutral-alpha-weak"
          radius="l"
          marginTop="12"
          marginBottom="8"
        />
      )}
      <Column as="article" maxWidth="s">
        <CustomMDX source={post.content} />
      </Column>

      <ShareSection title={post.title} url={`${baseURL}${blog.path}/${post.slug}`} />

      <Column fillWidth gap="40" horizontal="center" marginTop="40">
        <Line maxWidth="40" />
        <Text as="h2" id="recent-posts" variant="heading-strong-xl" marginBottom="24">
          Recent posts
        </Text>
        <Posts exclude={[post.slug]} range={[1, 2]} columns="2" thumbnail direction="column" initialPosts={initialPosts} />
      </Column>
      <ScrollToHash />
    </Column>
  );
}
