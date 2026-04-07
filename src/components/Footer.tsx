"use client";

import { useEffect, useState } from "react";
import { Row, IconButton, SmartLink, Text } from "@once-ui-system/core";
import { defaultPortfolioSettings } from "@/lib/portfolio-defaults";
import { getPortfolioSettings } from "@/lib/firebase/portfolio";
import styles from "./Footer.module.scss";

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [settings, setSettings] = useState(defaultPortfolioSettings);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const firestoreSettings = await getPortfolioSettings();
        if (firestoreSettings) {
          setSettings(firestoreSettings);
        }
      } catch {
        setSettings(defaultPortfolioSettings);
      }
    };

    void loadSettings();
  }, []);

  return (
    <Row as="footer" fillWidth padding="8" horizontal="center" s={{ direction: "column" }}>
      <Row
        className={styles.mobile}
        maxWidth="m"
        paddingY="8"
        paddingX="16"
        gap="16"
        horizontal="between"
        vertical="center"
        s={{
          direction: "column",
          horizontal: "center",
          align: "center",
        }}
      >
        <Text variant="body-default-s" onBackground="neutral-strong">
          <Text onBackground="neutral-weak">Â© {currentYear} /</Text>
          <Text paddingX="4">{settings.profile.name}</Text>
          <Text onBackground="neutral-weak">
            / Build your portfolio with{" "}
            <SmartLink href="https://once-ui.com/products/magic-portfolio">Once UI</SmartLink>
          </Text>
        </Text>
        <Row gap="16">
          {settings.socialLinks.map(
            (item) =>
              item.link && (
                <IconButton
                  key={item.id}
                  href={item.link}
                  icon={item.icon}
                  tooltip={item.name}
                  size="s"
                  variant="ghost"
                />
              ),
          )}
        </Row>
      </Row>
      <Row height="80" hide s={{ hide: false }} />
    </Row>
  );
};
