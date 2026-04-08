"use client";

import {
  Avatar,
  Button,
  Column,
  Heading,
  Icon,
  IconButton,
  Media,
  Row,
  Tag,
  Text,
} from "@once-ui-system/core";
import { about } from "@/resources";
import { defaultPortfolioSettings } from "@/lib/portfolio-defaults";
import { usePortfolioSettings } from "@/lib/firebase/use-portfolio-settings";
import TableOfContents from "./TableOfContents";
import styles from "./about.module.scss";

export function AboutClient() {
  const settings = usePortfolioSettings(defaultPortfolioSettings);

  const structure = [
    { title: settings.profile.introTitle, display: true, items: [] },
    {
      title: about.work.title,
      display: settings.experiences.length > 0,
      items: settings.experiences.map((experience) => experience.company),
    },
    {
      title: about.studies.title,
      display: settings.studies.length > 0,
      items: settings.studies.map((institution) => institution.name),
    },
    {
      title: about.technical.title,
      display: settings.skills.length > 0,
      items: settings.skills.map((skill) => skill.title),
    },
  ];

  return (
    <>
      {about.tableOfContent.display && (
        <Column
          left="0"
          style={{ top: "50%", transform: "translateY(-50%)" }}
          position="fixed"
          paddingLeft="24"
          gap="32"
          s={{ hide: true }}
        >
          <TableOfContents structure={structure} about={about} />
        </Column>
      )}
      <Row fillWidth s={{ direction: "column" }} horizontal="center">
        {about.avatar.display && (
          <Column
            className={styles.avatar}
            top="64"
            fitHeight
            position="sticky"
            s={{ position: "relative", style: { top: "auto" } }}
            xs={{ style: { top: "auto" } }}
            minWidth="160"
            paddingX="l"
            paddingBottom="xl"
            gap="m"
            flex={3}
            horizontal="center"
          >
            <Avatar src={settings.profile.avatar} size="xl" />
            <Row gap="8" vertical="center">
              <Icon onBackground="accent-weak" name="globe" />
              {settings.profile.location}
            </Row>
            {settings.profile.languages.length > 0 && (
              <Row wrap gap="8">
                {settings.profile.languages.map((language, index) => (
                  <Tag key={index} size="l">
                    {language}
                  </Tag>
                ))}
              </Row>
            )}
          </Column>
        )}
        <Column className={styles.blockAlign} flex={9} maxWidth={40}>
          <Column id={settings.profile.introTitle} fillWidth minHeight="160" vertical="center" marginBottom="32">
            {about.calendar.display && (
              <Row
                fitWidth
                border="brand-alpha-medium"
                background="brand-alpha-weak"
                radius="full"
                padding="4"
                gap="8"
                marginBottom="m"
                vertical="center"
                className={styles.blockAlign}
                style={{ backdropFilter: "blur(var(--static-space-1))" }}
              >
                <Icon paddingLeft="12" name="calendar" onBackground="brand-weak" />
                <Row paddingX="8">Schedule a call</Row>
                <IconButton href={about.calendar.link} data-border="rounded" variant="secondary" icon="chevronRight" />
              </Row>
            )}
            <Heading className={styles.textAlign} variant="display-strong-xl">
              {settings.profile.name}
            </Heading>
            <Text className={styles.textAlign} variant="display-default-xs" onBackground="neutral-weak">
              {settings.profile.role}
            </Text>
            {settings.socialLinks.length > 0 && (
              <Row className={styles.blockAlign} paddingTop="20" paddingBottom="8" gap="8" wrap horizontal="center" fitWidth data-border="rounded">
                {settings.socialLinks
                  .filter((item) => item.essential)
                  .map((item) => (
                    <Row key={item.id}>
                      <Row s={{ hide: true }}>
                        <Button href={item.link} prefixIcon={item.icon} label={item.name} size="s" weight="default" variant="secondary" />
                      </Row>
                      <Row hide s={{ hide: false }}>
                        <IconButton size="l" href={item.link} icon={item.icon} variant="secondary" />
                      </Row>
                    </Row>
                  ))}
              </Row>
            )}
          </Column>

          <Column textVariant="body-default-l" fillWidth gap="m" marginBottom="xl">
            <Text>{settings.profile.introDescription}</Text>
          </Column>

          {settings.experiences.length > 0 && (
            <>
              <Heading as="h2" id={about.work.title} variant="display-strong-s" marginBottom="m">
                {about.work.title}
              </Heading>
              <Column fillWidth gap="l" marginBottom="40">
                {settings.experiences.map((experience, index) => (
                  <Column key={`${experience.company}-${experience.role}-${index}`} fillWidth>
                    <Row fillWidth horizontal="between" vertical="end" marginBottom="4">
                      <Text id={experience.company} variant="heading-strong-l">
                        {experience.company}
                      </Text>
                      <Text variant="heading-default-xs" onBackground="neutral-weak">
                        {experience.timeframe}
                      </Text>
                    </Row>
                    <Text variant="body-default-s" onBackground="brand-weak" marginBottom="m">
                      {experience.role}
                    </Text>
                    <Column as="ul" gap="16">
                      {experience.achievements.map((achievement, achievementIndex) => (
                        <Text as="li" variant="body-default-m" key={`${experience.company}-${achievementIndex}`}>
                          {achievement}
                        </Text>
                      ))}
                    </Column>
                    {experience.images && experience.images.length > 0 && (
                      <Row fillWidth paddingTop="m" paddingLeft="40" gap="12" wrap>
                        {experience.images.map((image, imageIndex) => (
                          <Row key={imageIndex} border="neutral-medium" radius="m" minWidth={image.width} height={image.height}>
                            <Media enlarge radius="m" sizes={String(image.width ?? 16)} alt={image.alt} src={image.src} />
                          </Row>
                        ))}
                      </Row>
                    )}
                  </Column>
                ))}
              </Column>
            </>
          )}

          {settings.studies.length > 0 && (
            <>
              <Heading as="h2" id={about.studies.title} variant="display-strong-s" marginBottom="m">
                {about.studies.title}
              </Heading>
              <Column fillWidth gap="l" marginBottom="40">
                {settings.studies.map((institution, index) => (
                  <Column key={`${institution.name}-${index}`} fillWidth gap="4">
                    <Text id={institution.name} variant="heading-strong-l">
                      {institution.name}
                    </Text>
                    <Text variant="heading-default-xs" onBackground="neutral-weak">
                      {institution.description}
                    </Text>
                  </Column>
                ))}
              </Column>
            </>
          )}

          {settings.skills.length > 0 && (
            <>
              <Heading as="h2" id={about.technical.title} variant="display-strong-s" marginBottom="40">
                {about.technical.title}
              </Heading>
              <Column fillWidth gap="l">
                {settings.skills.map((skill, index) => (
                  <Column key={`${skill.title}-${index}`} fillWidth gap="4">
                    <Text id={skill.title} variant="heading-strong-l">
                      {skill.title}
                    </Text>
                    <Text variant="body-default-m" onBackground="neutral-weak">
                      {skill.description}
                    </Text>
                    {skill.tags && skill.tags.length > 0 && (
                      <Row wrap gap="8" paddingTop="8">
                        {skill.tags.map((tag, tagIndex) => (
                          <Tag key={`${skill.title}-${tagIndex}`} size="l" prefixIcon={tag.icon}>
                            {tag.name}
                          </Tag>
                        ))}
                      </Row>
                    )}
                    {skill.images && skill.images.length > 0 && (
                      <Row fillWidth paddingTop="m" gap="12" wrap>
                        {skill.images.map((image, imageIndex) => (
                          <Row key={imageIndex} border="neutral-medium" radius="m" minWidth={image.width} height={image.height}>
                            <Media enlarge radius="m" sizes={String(image.width ?? 16)} alt={image.alt} src={image.src} />
                          </Row>
                        ))}
                      </Row>
                    )}
                  </Column>
                ))}
              </Column>
            </>
          )}
        </Column>
      </Row>
    </>
  );
}
