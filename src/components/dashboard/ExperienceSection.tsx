"use client";

import { Button, Column, Heading, Input, Row, Textarea } from "@once-ui-system/core";
import { MediaListField } from "./MediaListField";
import type { PortfolioExperience, PortfolioSettings } from "@/types";

export function ExperienceSection({
  settings,
  experienceDraft,
  onDraftChange,
  onEdit,
  onDelete,
  onSaveDraft,
  onReset,
}: {
  settings: PortfolioSettings;
  experienceDraft: PortfolioExperience;
  onDraftChange: (updater: (current: PortfolioExperience) => PortfolioExperience) => void;
  onEdit: (item: PortfolioExperience) => void;
  onDelete: (company: string, role: string) => void;
  onSaveDraft: () => void;
  onReset: () => void;
}) {
  return (
    <Column gap="16">
      <Heading as="h2" variant="heading-strong-l">
        Work Experience
      </Heading>
      <Row gap="16" s={{ direction: "column" }} vertical="start">
        <Column flex={1} gap="8" background="surface" border="neutral-alpha-weak" radius="l" padding="20">
          {settings.experiences.map((item) => (
            <Row key={`${item.company}-${item.role}`} horizontal="between" vertical="center">
              <Button variant="tertiary" onClick={() => onEdit(item)}>
                {item.company}
              </Button>
              <Button variant="secondary" onClick={() => onDelete(item.company, item.role)}>
                Delete
              </Button>
            </Row>
          ))}
        </Column>
        <Column flex={2} gap="12" background="surface" border="neutral-alpha-weak" radius="l" padding="20">
          <Input id="exp-company" label="Company" value={experienceDraft.company} onChange={(event) => onDraftChange((current) => ({ ...current, company: event.target.value }))} />
          <Input id="exp-role" label="Role" value={experienceDraft.role} onChange={(event) => onDraftChange((current) => ({ ...current, role: event.target.value }))} />
          <Input id="exp-timeframe" label="Timeframe" value={experienceDraft.timeframe} onChange={(event) => onDraftChange((current) => ({ ...current, timeframe: event.target.value }))} />
          <Textarea id="exp-achievements" label="Achievements, satu per baris" value={experienceDraft.achievements.join("\n")} onChange={(event) => onDraftChange((current) => ({ ...current, achievements: event.target.value.split("\n").map((item) => item.trim()).filter(Boolean) }))} />
          <MediaListField
            id="exp-images"
            label="Image URLs, satu URL per baris"
            values={experienceDraft.images?.map((image) => image.src) ?? []}
            onChange={(values) =>
              onDraftChange((current) => ({
                ...current,
                images: values.map((src) => ({
                  src,
                  alt: current.company || "Experience image",
                  width: 16,
                  height: 9,
                })),
              }))
            }
            uploadLabel="Upload experience image"
            onUpload={(url) =>
              onDraftChange((current) => ({
                ...current,
                images: [
                  ...(current.images ?? []),
                  { src: url, alt: current.company || "Experience image", width: 16, height: 9 },
                ],
              }))
            }
          />
          <Row gap="12">
            <Button onClick={onSaveDraft}>Apply to settings</Button>
            <Button variant="secondary" onClick={onReset}>
              New experience
            </Button>
          </Row>
        </Column>
      </Row>
    </Column>
  );
}
