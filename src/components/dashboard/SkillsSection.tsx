"use client";

import { Button, Column, Heading, Input, Row, Textarea } from "@once-ui-system/core";
import { MediaListField } from "./MediaListField";
import type { PortfolioSettings, PortfolioSkill } from "@/types";

export function SkillsSection({
  settings,
  skillDraft,
  tagsValue,
  onDraftChange,
  onEdit,
  onDelete,
  onSaveDraft,
  onReset,
}: {
  settings: PortfolioSettings;
  skillDraft: PortfolioSkill;
  tagsValue: string;
  onDraftChange: (updater: (current: PortfolioSkill) => PortfolioSkill) => void;
  onEdit: (item: PortfolioSkill) => void;
  onDelete: (title: string) => void;
  onSaveDraft: () => void;
  onReset: () => void;
}) {
  const parseTags = (value: string) =>
    value
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean)
      .map((item) => {
        const [name, icon] = item.split(":").map((part) => part.trim());
        return { name, icon: icon || undefined };
      });

  return (
    <Column gap="16">
      <Heading as="h2" variant="heading-strong-l">
        Skills
      </Heading>
      <Row gap="16" s={{ direction: "column" }} vertical="start">
        <Column flex={1} gap="8" background="surface" border="neutral-alpha-weak" radius="l" padding="20">
          {settings.skills.map((item) => (
            <Row key={item.title} horizontal="between" vertical="center">
              <Button variant="tertiary" onClick={() => onEdit(item)}>
                {item.title}
              </Button>
              <Button variant="secondary" onClick={() => onDelete(item.title)}>
                Delete
              </Button>
            </Row>
          ))}
        </Column>
        <Column flex={2} gap="12" background="surface" border="neutral-alpha-weak" radius="l" padding="20">
          <Input id="skill-title" label="Title" value={skillDraft.title} onChange={(event) => onDraftChange((current) => ({ ...current, title: event.target.value }))} />
          <Textarea id="skill-description" label="Description" value={skillDraft.description ?? ""} onChange={(event) => onDraftChange((current) => ({ ...current, description: event.target.value }))} />
          <Textarea id="skill-tags" label="Tags, format name:icon satu per baris" value={tagsValue} onChange={(event) => onDraftChange((current) => ({ ...current, tags: parseTags(event.target.value) }))} />
          <MediaListField
            id="skill-images"
            label="Image URLs, satu URL per baris"
            values={skillDraft.images?.map((image) => image.src) ?? []}
            onChange={(values) =>
              onDraftChange((current) => ({
                ...current,
                images: values.map((src) => ({
                  src,
                  alt: current.title || "Skill image",
                  width: 16,
                  height: 9,
                })),
              }))
            }
            uploadLabel="Upload skill image"
            onUpload={(url) =>
              onDraftChange((current) => ({
                ...current,
                images: [
                  ...(current.images ?? []),
                  { src: url, alt: current.title || "Skill image", width: 16, height: 9 },
                ],
              }))
            }
          />
          <Row gap="12">
            <Button onClick={onSaveDraft}>Apply to settings</Button>
            <Button variant="secondary" onClick={onReset}>
              New skill
            </Button>
          </Row>
        </Column>
      </Row>
    </Column>
  );
}
