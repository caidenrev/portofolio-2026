"use client";

import { Button, Checkbox, Column, Heading, Input, Media, Row, Textarea } from "@once-ui-system/core";
import { CloudinaryUploadButton } from "./CloudinaryUploadButton";
import { MarkdownEditorField } from "./MarkdownEditorField";
import { MediaListField } from "./MediaListField";
import type { PortfolioProject } from "@/types";

export function ProjectsEditorSection({
  projects,
  projectDraft,
  submitting,
  onDraftChange,
  onEdit,
  onDelete,
  onSave,
  onReset,
}: {
  projects: PortfolioProject[];
  projectDraft: PortfolioProject;
  submitting: boolean;
  onDraftChange: (updater: (current: PortfolioProject) => PortfolioProject) => void;
  onEdit: (project: PortfolioProject) => void;
  onDelete: (id?: string) => void;
  onSave: () => void;
  onReset: () => void;
}) {
  return (
    <Column gap="16">
      <Heading as="h2" variant="heading-strong-l">
        Projects
      </Heading>
      <Row gap="16" s={{ direction: "column" }} vertical="start">
        <Column flex={1} gap="8" background="surface" border="neutral-alpha-weak" radius="l" padding="20">
          {projects.map((project) => (
            <Row key={project.id ?? project.slug} horizontal="between" vertical="center">
              <Button variant="tertiary" onClick={() => onEdit(project)}>
                {project.title || project.slug}
              </Button>
              <Button variant="secondary" onClick={() => onDelete(project.id)}>
                Delete
              </Button>
            </Row>
          ))}
        </Column>
        <Column flex={2} gap="12" background="surface" border="neutral-alpha-weak" radius="l" padding="20">
          <Input id="project-slug" label="Slug" value={projectDraft.slug} onChange={(event) => onDraftChange((current) => ({ ...current, slug: event.target.value }))} />
          <Input id="project-title" label="Title" value={projectDraft.title} onChange={(event) => onDraftChange((current) => ({ ...current, title: event.target.value }))} />
          <Input id="project-date" label="Published at" value={projectDraft.publishedAt} onChange={(event) => onDraftChange((current) => ({ ...current, publishedAt: event.target.value }))} />
          <Input id="project-tag" label="Tag" value={projectDraft.tag ?? ""} onChange={(event) => onDraftChange((current) => ({ ...current, tag: event.target.value }))} />
          <Input id="project-link" label="Project URL" value={projectDraft.link ?? ""} onChange={(event) => onDraftChange((current) => ({ ...current, link: event.target.value }))} />
          {projectDraft.image && (
            <Media
              src={projectDraft.image}
              alt={projectDraft.title || "Project cover"}
              aspectRatio="16 / 9"
              radius="m"
              sizes="320px"
            />
          )}
          <Row gap="12" wrap>
            <CloudinaryUploadButton label="Upload cover image" onUploaded={(url) => onDraftChange((current) => ({ ...current, image: url }))} />
            {projectDraft.image && (
              <Button variant="secondary" onClick={() => onDraftChange((current) => ({ ...current, image: "" }))}>
                Remove cover image
              </Button>
            )}
          </Row>
          <MediaListField
            id="project-images"
            label="Gallery images, satu URL per baris"
            values={projectDraft.images}
            onChange={(values) => onDraftChange((current) => ({ ...current, images: values }))}
            uploadLabel="Upload gallery image"
            onUpload={(url) =>
              onDraftChange((current) => ({
                ...current,
                images: [...current.images, url],
              }))
            }
          />
          <Textarea id="project-summary" label="Summary" value={projectDraft.summary} onChange={(event) => onDraftChange((current) => ({ ...current, summary: event.target.value }))} />
          <MarkdownEditorField
            id="project-content"
            label="Markdown content"
            value={projectDraft.content}
            lines={12}
            onChange={(value) =>
              onDraftChange((current) => ({
                ...current,
                content: value,
              }))
            }
          />
          <Checkbox id="project-featured" isChecked={Boolean(projectDraft.featured)} onToggle={() => onDraftChange((current) => ({ ...current, featured: !current.featured }))} label="Featured project" />
          <Row gap="12">
            <Button onClick={onSave} loading={submitting}>
              Save project
            </Button>
            <Button variant="secondary" onClick={onReset}>
              New project
            </Button>
          </Row>
        </Column>
      </Row>
    </Column>
  );
}
