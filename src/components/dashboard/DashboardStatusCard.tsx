"use client";

import { Badge, Button, Column, Heading, Row, Text } from "@once-ui-system/core";

export function DashboardStatusCard({
  email,
  hasCustomClaim,
  onLogout,
  onImportSeed,
  importing,
}: {
  email: string;
  hasCustomClaim: boolean;
  onLogout: () => void;
  onImportSeed: () => void;
  importing: boolean;
}) {
  return (
    <Row
      fillWidth
      horizontal="between"
      vertical="center"
      background="surface"
      border="neutral-alpha-weak"
      radius="l"
      padding="20"
      s={{ direction: "column", horizontal: "start" }}
    >
      <Column gap="4">
        <Row gap="8" vertical="center">
          <Badge background="brand-alpha-weak" paddingX="12" paddingY="4">
            Admin
          </Badge>
          <Badge
            background={hasCustomClaim ? "success-alpha-weak" : "warning-alpha-weak"}
            paddingX="12"
            paddingY="4"
          >
            {hasCustomClaim ? "Custom claim aktif" : "Fallback email check"}
          </Badge>
        </Row>
        <Heading variant="display-strong-s">Dashboard portfolio aktif</Heading>
        <Text onBackground="neutral-weak" variant="body-default-s">
          Login Firebase berhasil untuk {email}. Data di bawah ini tersimpan ke Firestore.
        </Text>
      </Column>
      <Row gap="12">
        <Button variant="secondary" onClick={onImportSeed} loading={importing}>
          Import starter data
        </Button>
        <Button variant="secondary" onClick={onLogout}>
          Logout
        </Button>
      </Row>
    </Row>
  );
}
