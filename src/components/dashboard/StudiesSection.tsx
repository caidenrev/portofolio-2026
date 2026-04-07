"use client";

import { Button, Column, Heading, Input, Row, Textarea } from "@once-ui-system/core";
import type { PortfolioSettings, PortfolioStudy } from "@/types";

export function StudiesSection({
  settings,
  studyDraft,
  onDraftChange,
  onEdit,
  onDelete,
  onSaveDraft,
  onReset,
}: {
  settings: PortfolioSettings;
  studyDraft: PortfolioStudy;
  onDraftChange: (updater: (current: PortfolioStudy) => PortfolioStudy) => void;
  onEdit: (item: PortfolioStudy) => void;
  onDelete: (name: string) => void;
  onSaveDraft: () => void;
  onReset: () => void;
}) {
  return (
    <Column gap="16">
      <Heading as="h2" variant="heading-strong-l">
        Studies
      </Heading>
      <Row gap="16" s={{ direction: "column" }} vertical="start">
        <Column flex={1} gap="8" background="surface" border="neutral-alpha-weak" radius="l" padding="20">
          {settings.studies.map((item) => (
            <Row key={item.name} horizontal="between" vertical="center">
              <Button variant="tertiary" onClick={() => onEdit(item)}>
                {item.name}
              </Button>
              <Button variant="secondary" onClick={() => onDelete(item.name)}>
                Delete
              </Button>
            </Row>
          ))}
        </Column>
        <Column flex={2} gap="12" background="surface" border="neutral-alpha-weak" radius="l" padding="20">
          <Input id="study-name" label="Institution" value={studyDraft.name} onChange={(event) => onDraftChange((current) => ({ ...current, name: event.target.value }))} />
          <Textarea id="study-description" label="Description" value={studyDraft.description} onChange={(event) => onDraftChange((current) => ({ ...current, description: event.target.value }))} />
          <Row gap="12">
            <Button onClick={onSaveDraft}>Apply to settings</Button>
            <Button variant="secondary" onClick={onReset}>
              New study
            </Button>
          </Row>
        </Column>
      </Row>
    </Column>
  );
}
