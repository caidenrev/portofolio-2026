"use client";

import { Button, Column, Heading, Input, Media, Row, Textarea } from "@once-ui-system/core";
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
}: {
  posts: PortfolioPost[];
  postDraft: PortfolioPost;
  submitting: boolean;
  onDraftChange: (updater: (current: PortfolioPost) => PortfolioPost) => void;
  onEdit: (post: PortfolioPost) => void;
  onDelete: (id?: string) => void;
  onSave: () => void;
  onReset: () => void;
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
              <Button variant="tertiary" onClick={() => onEdit(post)}>
                {post.title || post.slug}
              </Button>
              <Button variant="secondary" onClick={() => onDelete(post.id)}>
                Delete
              </Button>
            </Row>
          ))}
        </Column>
        <Column flex={2} gap="12" background="surface" border="neutral-alpha-weak" radius="l" padding="20">
          <Input id="post-slug" label="Slug" value={postDraft.slug} onChange={(event) => onDraftChange((current) => ({ ...current, slug: event.target.value }))} />
          <Input id="post-title" label="Title" value={postDraft.title} onChange={(event) => onDraftChange((current) => ({ ...current, title: event.target.value }))} />
          <Input id="post-subtitle" label="Subtitle" value={postDraft.subtitle ?? ""} onChange={(event) => onDraftChange((current) => ({ ...current, subtitle: event.target.value }))} />
          <Input id="post-date" label="Published at" value={postDraft.publishedAt} onChange={(event) => onDraftChange((current) => ({ ...current, publishedAt: event.target.value }))} />
          <Input id="post-image" label="Thumbnail image" value={postDraft.image ?? ""} onChange={(event) => onDraftChange((current) => ({ ...current, image: event.target.value }))} />
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
          </Row>
          <Input id="post-tag" label="Tag" value={postDraft.tag ?? ""} onChange={(event) => onDraftChange((current) => ({ ...current, tag: event.target.value }))} />
          <Textarea id="post-summary" label="Summary" value={postDraft.summary} onChange={(event) => onDraftChange((current) => ({ ...current, summary: event.target.value }))} />
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
