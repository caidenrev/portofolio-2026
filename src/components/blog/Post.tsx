"use client";

import { useEffect, useState } from "react";
import { Card, Column, Media, Row, Avatar, Text } from "@once-ui-system/core";
import { formatDate } from "@/utils/formatDate";
import type { PortfolioPost } from "@/types";
import { getPortfolioSettings } from "@/lib/firebase/portfolio";
import { defaultPortfolioSettings } from "@/lib/portfolio-defaults";

interface PostProps {
  post: PortfolioPost;
  thumbnail: boolean;
  direction?: "row" | "column";
}

export default function Post({ post, thumbnail, direction }: PostProps) {
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

  return (
    <Card
      fillWidth
      key={post.slug}
      href={`/blog/${post.slug}`}
      transition="micro-medium"
      direction={direction}
      border="transparent"
      background="transparent"
      padding="4"
      radius="l-4"
      gap={direction === "column" ? undefined : "24"}
      s={{ direction: "column" }}
    >
      {post.image && thumbnail && (
        <Media
          priority
          sizes="(max-width: 768px) 100vw, 640px"
          border="neutral-alpha-weak"
          cursor="interactive"
          radius="l"
          src={post.image}
          alt={`Thumbnail of ${post.title}`}
          aspectRatio="16 / 9"
        />
      )}
      <Row fillWidth>
        <Column maxWidth={28} paddingY="24" paddingX="l" gap="20" vertical="center">
          <Row gap="24" vertical="center">
            <Row vertical="center" gap="16">
              <Avatar src={authorAvatar} size="s" />
              <Text variant="label-default-s">{authorName}</Text>
            </Row>
            <Text variant="body-default-xs" onBackground="neutral-weak">
              {formatDate(post.publishedAt, false)}
            </Text>
          </Row>
          <Text variant="heading-strong-l" wrap="balance">
            {post.title}
          </Text>
          {post.tag && (
            <Text variant="label-strong-s" onBackground="neutral-weak">
              {post.tag}
            </Text>
          )}
        </Column>
      </Row>
    </Card>
  );
}
