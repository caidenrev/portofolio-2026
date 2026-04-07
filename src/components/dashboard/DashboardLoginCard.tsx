"use client";

import { Badge, Button, Column, Input, PasswordInput, Text } from "@once-ui-system/core";

export function DashboardLoginCard({
  email,
  password,
  error,
  submitting,
  onEmailChange,
  onPasswordChange,
  onLogin,
}: {
  email: string;
  password: string;
  error?: string;
  submitting: boolean;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onLogin: () => void;
}) {
  return (
    <Column fillWidth gap="24">
      <Column gap="12">
        <Badge background="brand-alpha-weak" paddingX="12" paddingY="4">
          Admin Login
        </Badge>
        <Text variant="heading-strong-l">Masuk ke dashboard portfolio</Text>
        <Text onBackground="neutral-weak" variant="body-default-m">
          Login memakai Firebase Email/Password. Setelah itu kamu bisa mengelola profile,
          project, blog, dan gallery langsung dari sini.
        </Text>
      </Column>

      <Column
        maxWidth={28}
        gap="12"
        background="surface"
        border="neutral-alpha-weak"
        radius="l"
        padding="24"
      >
        <Input
          id="admin-email"
          label="Email admin"
          value={email}
          onChange={(event) => onEmailChange(event.target.value)}
          errorMessage={error}
        />
        <PasswordInput
          id="admin-password"
          label="Password"
          value={password}
          onChange={(event) => onPasswordChange(event.target.value)}
        />
        <Button onClick={onLogin} loading={submitting}>
          Login
        </Button>
        <Text variant="body-default-s" onBackground="neutral-weak">
          Set `NEXT_PUBLIC_ADMIN_EMAIL` di `.env.local` ke email admin yang kamu pakai di Firebase
          Authentication.
        </Text>
      </Column>
    </Column>
  );
}
