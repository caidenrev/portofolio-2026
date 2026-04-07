import { Button, Column, Row } from "@once-ui-system/core";
import { baseURL } from "@/resources";
import { Meta, Schema } from "@once-ui-system/core";
import { DashboardClient } from "@/components/dashboard/DashboardClient";

export async function generateMetadata() {
  return Meta.generate({
    title: "Dashboard",
    description: "Admin dashboard for managing portfolio content",
    baseURL,
    path: "/dashboard",
    image: "/api/og/generate?title=Dashboard",
  });
}

export default function DashboardPage() {
  return (
    <Column maxWidth="m" fillWidth gap="24" paddingTop="24">
      <Schema
        as="webPage"
        baseURL={baseURL}
        path="/dashboard"
        title="Dashboard"
        description="Admin dashboard for managing portfolio content"
        image="/api/og/generate?title=Dashboard"
      />

      <DashboardClient />

      <Row gap="12" wrap>
        <Button href="/about" variant="secondary">
          Back to site
        </Button>
      </Row>
    </Column>
  );
}
