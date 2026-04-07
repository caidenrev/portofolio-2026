"use client";

import { useDeferredValue, useEffect, useState } from "react";
import { MDXRemote } from "next-mdx-remote";
import type { MDXRemoteSerializeResult } from "next-mdx-remote";
import { Column, Row, Spinner, Text, Textarea } from "@once-ui-system/core";
import { mdxComponents } from "@/components/mdx-components";

export function MarkdownEditorField({
  id,
  label,
  value,
  onChange,
  lines = 12,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  lines?: number;
}) {
  const deferredValue = useDeferredValue(value);
  const [preview, setPreview] = useState<MDXRemoteSerializeResult | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);

  useEffect(() => {
    if (!deferredValue.trim()) {
      setPreview(null);
      setPreviewError(null);
      setLoadingPreview(false);
      return;
    }

    let ignore = false;
    const timeout = window.setTimeout(async () => {
      setLoadingPreview(true);
      setPreviewError(null);

      try {
        const response = await fetch("/api/preview-mdx", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ source: deferredValue }),
        });

        if (!response.ok) {
          const payload = (await response.json()) as { message?: string };
          throw new Error(payload.message || "Preview markdown gagal dirender.");
        }

        const payload = (await response.json()) as MDXRemoteSerializeResult;

        if (!ignore) {
          setPreview(payload);
        }
      } catch (error) {
        if (!ignore) {
          setPreview(null);
          setPreviewError(
            error instanceof Error ? error.message : "Preview markdown gagal dirender.",
          );
        }
      } finally {
        if (!ignore) {
          setLoadingPreview(false);
        }
      }
    }, 350);

    return () => {
      ignore = true;
      window.clearTimeout(timeout);
    };
  }, [deferredValue]);

  return (
    <Column gap="12">
      <Textarea
        id={id}
        label={label}
        value={value}
        lines={lines}
        onChange={(event) => onChange(event.target.value)}
      />
      <Column
        gap="12"
        background="surface"
        border="neutral-alpha-weak"
        radius="l"
        padding="20"
      >
        <Row fillWidth horizontal="between" vertical="center">
          <Column gap="4">
            <Text variant="body-strong-s">Live preview</Text>
            <Text variant="body-default-s" onBackground="neutral-weak">
              Preview ini pakai renderer MDX yang sama dengan halaman publik.
            </Text>
          </Column>
          {loadingPreview && <Spinner size="s" />}
        </Row>

        {previewError ? (
          <Text variant="body-default-s" onBackground="danger-medium">
            {previewError}
          </Text>
        ) : null}

        {!value.trim() ? (
          <Text variant="body-default-s" onBackground="neutral-weak">
            Tulis markdown atau MDX untuk melihat preview di sini.
          </Text>
        ) : null}

        {preview ? (
          <Column gap="8">
            <MDXRemote {...preview} components={mdxComponents} />
          </Column>
        ) : null}
      </Column>
    </Column>
  );
}
