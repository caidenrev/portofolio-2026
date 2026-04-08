"use client";

import { Avatar, Button, Column, Heading, RevealFx, Row, Text } from "@once-ui-system/core";
import { about } from "@/resources";
import { defaultPortfolioSettings } from "@/lib/portfolio-defaults";
import { usePortfolioSettings } from "@/lib/firebase/use-portfolio-settings";

export function HomeIntro() {
  const settings = usePortfolioSettings(defaultPortfolioSettings);

  return (
    <Column fillWidth horizontal="center" gap="m">
      <Column maxWidth="s" horizontal="center" align="center">
        <RevealFx translateY="4" fillWidth horizontal="center" paddingBottom="16">
          <Heading wrap="balance" variant="display-strong-l">
            {settings.profile.headline}
          </Heading>
        </RevealFx>
        <RevealFx translateY="8" delay={0.2} fillWidth horizontal="center" paddingBottom="32">
          <Text wrap="balance" onBackground="neutral-weak" variant="heading-default-xl">
            {settings.profile.subline}
          </Text>
        </RevealFx>
        <RevealFx paddingTop="12" delay={0.4} horizontal="center" paddingLeft="12">
          <Button
            id="about"
            data-border="rounded"
            href={about.path}
            variant="secondary"
            size="m"
            weight="default"
            arrowIcon
          >
            <Row gap="8" vertical="center" paddingRight="4">
              <Avatar marginRight="8" style={{ marginLeft: "-0.75rem" }} src={settings.profile.avatar} size="m" />
              About {settings.profile.name}
            </Row>
          </Button>
        </RevealFx>
      </Column>
    </Column>
  );
}
