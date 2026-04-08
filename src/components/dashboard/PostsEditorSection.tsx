"use client";

import { Button, Column, Heading, Input, Media, Row, Text, Textarea } from "@once-ui-system/core";
import { CloudinaryUploadButton } from "./CloudinaryUploadButton";
import { MarkdownEditorField } from "./MarkdownEditorField";
import type { PortfolioPost } from "@/types";

export function PostsEditorSection({
  posts,
  postDraft,
  submitting,
  onDraftChange,
  onEdit,
  onDelete,
  onSave,
  onReset,
  onGenerateSlug,
}: {
  posts: PortfolioPost[];
  postDraft: PortfolioPost;
  submitting: boolean;
  onDraftChange: (updater: (current: PortfolioPost) => PortfolioPost) => void;
  onEdit: (post: PortfolioPost) => void;
  onDelete: (id?: string) => void;
  onSave: () => void;
  onReset: () => void;
  onGenerateSlug: () => void;
}) {
  return (
    <Column gap="16">
      <Heading as="h2" variant="heading-strong-l">
        Blog Posts
      </Heading>
      <Row gap="16" s={{ direction: "column" }} vertical="start">
        <Column flex={1} gap="8" background="surface" border="neutral-alpha-weak" radius="l" padding="20">
          {posts.map((post) => (
            <Row key={post.id ?? post.slug} horizontal="between" vertical="center">
              <Column gap="4">
                <Button variant="tertiary" onClick={() => onEdit(post)}>
                  {post.title || post.slug}
                </Button>
                <Text variant="body-default-xs" onBackground="neutral-weak">
                  {post.status === "draft" ? "Draft" : "Published"}
                </Text>
              </Column>
              <Button variant="secondary" onClick={() => onDelete(post.id)}>
                Delete
              </Button>
            </Row>
          ))}
        </Column>
        <Column flex={2} gap="12" background="surface" border="neutral-alpha-weak" radius="l" padding="20">
          <Row gap="12" s={{ direction: "column" }}>
            <Input
              id="post-slug"
              label="Slug"
              value={postDraft.slug}
              onChange={(event) =>
                onDraftChange((current) => ({ ...current, slug: event.target.value }))
              }
            />
            <Button variant="secondary" onClick={onGenerateSlug}>
              Generate slug from title
            </Button>
          </Row>
          <Input id="post-title" label="Title" value={postDraft.title} onChange={(event) => onDraftChange((current) => ({ ...current, title: event.target.value }))} />
          <Input id="post-subtitle" label="Subtitle" value={postDraft.subtitle ?? ""} onChange={(event) => onDraftChange((current) => ({ ...current, subtitle: event.target.value }))} />
          <Input id="post-date" label="Published at" value={postDraft.publishedAt} onChange={(event) => onDraftChange((current) => ({ ...current, publishedAt: event.target.value }))} />
          {postDraft.image && (
            <Media
              src={postDraft.image}
              alt={postDraft.title || "Post thumbnail"}
              aspectRatio="16 / 9"
              radius="m"
              sizes="320px"
            />
          )}
          <Row gap="12" wrap>
            <CloudinaryUploadButton label="Upload thumbnail" onUploaded={(url) => onDraftChange((current) => ({ ...current, image: url }))} />
            {postDraft.image && (
              <Button variant="secondary" onClick={() => onDraftChange((current) => ({ ...current, image: "" }))}>
                Remove thumbnail
              </Button>
            )}
          </Row>
          <Input id="post-tag" label="Tag" value={postDraft.tag ?? ""} onChange={(event) => onDraftChange((current) => ({ ...current, tag: event.target.value }))} />
          <Row gap="12">
            <Button
              variant={postDraft.status === "published" ? "primary" : "secondary"}
              onClick={() =>
                onDraftChange((current) => ({ ...current, status: "published" }))
              }
            >
              Published
            </Button>
            <Button
              variant={postDraft.status === "draft" ? "primary" : "secondary"}
              onClick={() => onDraftChange((current) => ({ ...current, status: "draft" }))}
            >
              Draft
            </Button>
          </Row>
          <Textarea id="post-summary" label="Summary" value={postDraft.summary} onChange={(event) => onDraftChange((current) => ({ ...current, summary: event.target.value }))} />
          <Input
            id="post-seo-title"
            label="SEO title"
            value={postDraft.seoTitle ?? ""}
            onChange={(event) =>
              onDraftChange((current) => ({ ...current, seoTitle: event.target.value }))
            }
          />
          <Textarea
            id="post-seo-description"
            label="SEO description"
            value={postDraft.seoDescription ?? ""}
            onChange={(event) =>
              onDraftChange((current) => ({ ...current, seoDescription: event.target.value }))
            }
          />
          <MarkdownEditorField
            id="post-content"
            label="Markdown content"
            value={postDraft.content}
            lines={12}
            onChange={(value) =>
              onDraftChange((current) => ({
                ...current,
                content: value,
              }))
            }
          />
          <Row gap="12">
            <Button onClick={onSave} loading={submitting}>
              Save post
            </Button>
            <Button variant="secondary" onClick={onReset}>
              New post
            </Button>
          </Row>
        </Column>
      </Row>
    </Column>
  );
}
