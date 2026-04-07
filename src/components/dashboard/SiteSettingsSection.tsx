"use client";

import { Button, Column, Heading, Input, Row, Text, Textarea } from "@once-ui-system/core";
import type { PortfolioSettings } from "@/types";

export function SiteSettingsSection({
  settings,
  submitting,
  onSettingsChange,
  onSave,
}: {
  settings: PortfolioSettings;
  submitting: boolean;
  onSettingsChange: (updater: (current: PortfolioSettings) => PortfolioSettings) => void;
  onSave: () => void;
}) {
  return (
    <Column gap="16">
      <Heading as="h2" variant="heading-strong-l">
        Site Metadata
      </Heading>
      <Column gap="12" background="surface" border="neutral-alpha-weak" radius="l" padding="20">
        <Column gap="8" border="neutral-alpha-weak" radius="m" padding="16">
          <Text variant="label-default-s" onBackground="neutral-weak">
            Preview
          </Text>
          <Row gap="12" s={{ direction: "column" }}>
            <Column flex={1} gap="4">
              <Text variant="heading-strong-s">Home</Text>
              <Text>{settings.site.homeTitle}</Text>
              <Text onBackground="neutral-weak" variant="body-default-s">
                {settings.site.homeDescription}
              </Text>
            </Column>
            <Column flex={1} gap="4">
              <Text variant="heading-strong-s">Blog</Text>
              <Text>{settings.site.blogTitle}</Text>
              <Text onBackground="neutral-weak" variant="body-default-s">
                {settings.site.blogDescription}
              </Text>
            </Column>
          </Row>
        </Column>
        <Input
          id="site-home-title"
          label="Home title"
          value={settings.site.homeTitle}
          onChange={(event) =>
            onSettingsChange((current) => ({
              ...current,
              site: { ...current.site, homeTitle: event.target.value },
            }))
          }
        />
        <Textarea
          id="site-home-description"
          label="Home description"
          value={settings.site.homeDescription}
          onChange={(event) =>
            onSettingsChange((current) => ({
              ...current,
              site: { ...current.site, homeDescription: event.target.value },
            }))
          }
        />
        <Input
          id="site-about-title"
          label="About title"
          value={settings.site.aboutTitle}
          onChange={(event) =>
            onSettingsChange((current) => ({
              ...current,
              site: { ...current.site, aboutTitle: event.target.value },
            }))
          }
        />
        <Textarea
          id="site-about-description"
          label="About description"
          value={settings.site.aboutDescription}
          onChange={(event) =>
            onSettingsChange((current) => ({
              ...current,
              site: { ...current.site, aboutDescription: event.target.value },
            }))
          }
        />
        <Input
          id="site-work-title"
          label="Work title"
          value={settings.site.workTitle}
          onChange={(event) =>
            onSettingsChange((current) => ({
              ...current,
              site: { ...current.site, workTitle: event.target.value },
            }))
          }
        />
        <Textarea
          id="site-work-description"
          label="Work description"
          value={settings.site.workDescription}
          onChange={(event) =>
            onSettingsChange((current) => ({
              ...current,
              site: { ...current.site, workDescription: event.target.value },
            }))
          }
        />
        <Input
          id="site-blog-title"
          label="Blog title"
          value={settings.site.blogTitle}
          onChange={(event) =>
            onSettingsChange((current) => ({
              ...current,
              site: { ...current.site, blogTitle: event.target.value },
            }))
          }
        />
        <Textarea
          id="site-blog-description"
          label="Blog description"
          value={settings.site.blogDescription}
          onChange={(event) =>
            onSettingsChange((current) => ({
              ...current,
              site: { ...current.site, blogDescription: event.target.value },
            }))
          }
        />
        <Input
          id="site-gallery-title"
          label="Gallery title"
          value={settings.site.galleryTitle}
          onChange={(event) =>
            onSettingsChange((current) => ({
              ...current,
              site: { ...current.site, galleryTitle: event.target.value },
            }))
          }
        />
        <Textarea
          id="site-gallery-description"
          label="Gallery description"
          value={settings.site.galleryDescription}
          onChange={(event) =>
            onSettingsChange((current) => ({
              ...current,
              site: { ...current.site, galleryDescription: event.target.value },
            }))
          }
        />
        <Button onClick={onSave} loading={submitting}>
          Save site metadata
        </Button>
      </Column>
    </Column>
  );
}
