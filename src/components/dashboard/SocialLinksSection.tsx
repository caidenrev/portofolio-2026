"use client";

import { Button, Checkbox, Column, Heading, Input, Row } from "@once-ui-system/core";
import { iconLibrary } from "@/resources/icons";
import type { PortfolioSettings, PortfolioSocialLink } from "@/types";

export function SocialLinksSection({
  settings,
  socialDraft,
  onDraftChange,
  onEdit,
  onDelete,
  onSaveDraft,
  onReset,
}: {
  settings: PortfolioSettings;
  socialDraft: PortfolioSocialLink;
  onDraftChange: (updater: (current: PortfolioSocialLink) => PortfolioSocialLink) => void;
  onEdit: (item: PortfolioSocialLink) => void;
  onDelete: (id: string) => void;
  onSaveDraft: () => void;
  onReset: () => void;
}) {
  return (
    <Column gap="16">
      <Heading as="h2" variant="heading-strong-l">
        Social Links
      </Heading>
      <Row gap="16" s={{ direction: "column" }} vertical="start">
        <Column flex={1} gap="8" background="surface" border="neutral-alpha-weak" radius="l" padding="20">
          {settings.socialLinks.map((item) => (
            <Row key={item.id} horizontal="between" vertical="center">
              <Button variant="tertiary" onClick={() => onEdit(item)}>
                {item.name}
              </Button>
              <Button variant="secondary" onClick={() => onDelete(item.id)}>
                Delete
              </Button>
            </Row>
          ))}
        </Column>
        <Column flex={2} gap="12" background="surface" border="neutral-alpha-weak" radius="l" padding="20">
          <Input id="social-id" label="ID" value={socialDraft.id} onChange={(event) => onDraftChange((current) => ({ ...current, id: event.target.value }))} />
          <Input id="social-name" label="Name" value={socialDraft.name} onChange={(event) => onDraftChange((current) => ({ ...current, name: event.target.value }))} />
          <Input id="social-link" label="Link" value={socialDraft.link} onChange={(event) => onDraftChange((current) => ({ ...current, link: event.target.value }))} />
          <Input id="social-order" label="Order" value={String(socialDraft.order ?? 0)} onChange={(event) => onDraftChange((current) => ({ ...current, order: Number(event.target.value) || 0 }))} />
          <Input
            id="social-icon"
            label={`Icon (${Object.keys(iconLibrary).join(", ")})`}
            value={socialDraft.icon}
            onChange={(event) => onDraftChange((current) => ({ ...current, icon: event.target.value }))}
          />
          <Checkbox id="social-essential" isChecked={Boolean(socialDraft.essential)} onToggle={() => onDraftChange((current) => ({ ...current, essential: !current.essential }))} label="Essential link" />
          <Row gap="12">
            <Button onClick={onSaveDraft}>Apply to settings</Button>
            <Button variant="secondary" onClick={onReset}>
              New link
            </Button>
          </Row>
        </Column>
      </Row>
    </Column>
  );
}
