"use client";

import { Avatar, Button, Column, Heading, Input, Row, Textarea } from "@once-ui-system/core";
import { CloudinaryUploadButton } from "./CloudinaryUploadButton";
import type { PortfolioSettings } from "@/types";

export function ProfileSettingsSection({
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
        Profile Settings
      </Heading>
      <Column gap="12" background="surface" border="neutral-alpha-weak" radius="l" padding="20">
        <Row gap="12" s={{ direction: "column" }}>
          <Input
            id="profile-name"
            label="Display name"
            value={settings.profile.name}
            onChange={(event) =>
              onSettingsChange((current) => ({
                ...current,
                profile: { ...current.profile, name: event.target.value },
              }))
            }
          />
          <Input
            id="profile-role"
            label="Role"
            value={settings.profile.role}
            onChange={(event) =>
              onSettingsChange((current) => ({
                ...current,
                profile: { ...current.profile, role: event.target.value },
              }))
            }
          />
        </Row>
        <Row gap="12" s={{ direction: "column" }}>
          <Input
            id="profile-email"
            label="Email"
            value={settings.profile.email}
            onChange={(event) =>
              onSettingsChange((current) => ({
                ...current,
                profile: { ...current.profile, email: event.target.value },
              }))
            }
          />
          <Input
            id="profile-location"
            label="Location / timezone"
            value={settings.profile.location}
            onChange={(event) =>
              onSettingsChange((current) => ({
                ...current,
                profile: { ...current.profile, location: event.target.value },
              }))
            }
          />
        </Row>
        <Input
          id="profile-avatar"
          label="Avatar URL"
          value={settings.profile.avatar}
          onChange={(event) =>
            onSettingsChange((current) => ({
              ...current,
              profile: { ...current.profile, avatar: event.target.value },
            }))
          }
        />
        {settings.profile.avatar && (
          <Row gap="12" vertical="center">
            <Avatar src={settings.profile.avatar} size="l" />
          </Row>
        )}
        <Row gap="12" wrap>
          <CloudinaryUploadButton
            label="Upload avatar"
            onUploaded={(url) =>
              onSettingsChange((current) => ({
                ...current,
                profile: { ...current.profile, avatar: url },
              }))
            }
          />
        </Row>
        <Textarea
          id="profile-headline"
          label="Headline"
          value={settings.profile.headline}
          onChange={(event) =>
            onSettingsChange((current) => ({
              ...current,
              profile: { ...current.profile, headline: event.target.value },
            }))
          }
        />
        <Textarea
          id="profile-subline"
          label="Subline"
          value={settings.profile.subline}
          onChange={(event) =>
            onSettingsChange((current) => ({
              ...current,
              profile: { ...current.profile, subline: event.target.value },
            }))
          }
        />
        <Textarea
          id="profile-languages"
          label="Languages, satu per baris"
          value={settings.profile.languages.join("\n")}
          onChange={(event) =>
            onSettingsChange((current) => ({
              ...current,
              profile: {
                ...current.profile,
                languages: event.target.value
                  .split("\n")
                  .map((item) => item.trim())
                  .filter(Boolean),
              },
            }))
          }
        />
        <Textarea
          id="profile-intro"
          label="Intro description"
          value={settings.profile.introDescription}
          onChange={(event) =>
            onSettingsChange((current) => ({
              ...current,
              profile: { ...current.profile, introDescription: event.target.value },
            }))
          }
        />
        <Button onClick={onSave} loading={submitting}>
          Save profile settings
        </Button>
      </Column>
    </Column>
  );
}
