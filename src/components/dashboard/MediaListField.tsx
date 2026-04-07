"use client";

import { useState } from "react";
import { Button, Column, Media, Row, Text, Textarea } from "@once-ui-system/core";
import { CloudinaryUploadButton } from "./CloudinaryUploadButton";

export function MediaListField({
  id,
  label,
  values,
  onChange,
  onUpload,
  uploadLabel,
}: {
  id: string;
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  onUpload: (url: string) => void;
  uploadLabel: string;
}) {
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const moveItem = (from: number, to: number) => {
    if (to < 0 || to >= values.length) return;
    const nextValues = [...values];
    const [moved] = nextValues.splice(from, 1);
    nextValues.splice(to, 0, moved);
    onChange(nextValues);
  };

  const reorderItems = (from: number, to: number) => {
    if (from === to || from < 0 || to < 0 || from >= values.length || to >= values.length) {
      return;
    }

    const nextValues = [...values];
    const [moved] = nextValues.splice(from, 1);
    nextValues.splice(to, 0, moved);
    onChange(nextValues);
  };

  return (
    <>
      <Row gap="12" wrap>
        <CloudinaryUploadButton
          label={uploadLabel}
          onUploaded={onUpload}
          onUploadedMany={(urls) => onChange([...values, ...urls])}
          multiple
        />
      </Row>
      {values.length > 0 && (
        <Column gap="8">
          <Text variant="body-default-s" onBackground="neutral-weak">
            Preview media. Kamu bisa drag and drop untuk mengubah urutan.
          </Text>
          <Row gap="12" wrap>
            {values.map((value, index) => (
              <Column
                key={`${value}-${index}`}
                draggable
                gap="8"
                border="neutral-alpha-weak"
                radius="m"
                padding="8"
                maxWidth={12}
                background={hoverIndex === index ? "brand-alpha-weak" : "surface"}
                style={{
                  cursor: "grab",
                  opacity: draggingIndex === index ? 0.65 : 1,
                }}
                onDragStart={() => {
                  setDraggingIndex(index);
                  setHoverIndex(index);
                }}
                onDragOver={(event) => {
                  event.preventDefault();
                  setHoverIndex(index);
                }}
                onDrop={(event) => {
                  event.preventDefault();
                  if (draggingIndex !== null) {
                    reorderItems(draggingIndex, index);
                  }
                  setDraggingIndex(null);
                  setHoverIndex(null);
                }}
                onDragEnd={() => {
                  setDraggingIndex(null);
                  setHoverIndex(null);
                }}
              >
                <Media
                  src={value}
                  alt={`Uploaded media ${index + 1}`}
                  aspectRatio="1 / 1"
                  radius="m"
                  sizes="160px"
                />
                <Button
                  variant="secondary"
                  size="s"
                  onClick={() => onChange(values.filter((_, itemIndex) => itemIndex !== index))}
                >
                  Remove
                </Button>
                <Row gap="8">
                  <Button variant="tertiary" size="s" onClick={() => moveItem(index, index - 1)}>
                    Up
                  </Button>
                  <Button variant="tertiary" size="s" onClick={() => moveItem(index, index + 1)}>
                    Down
                  </Button>
                </Row>
              </Column>
            ))}
          </Row>
        </Column>
      )}
      <Textarea
        id={id}
        label={label}
        value={values.join("\n")}
        onChange={(event) =>
          onChange(
            event.target.value
              .split("\n")
              .map((item) => item.trim())
              .filter(Boolean),
          )
        }
      />
    </>
  );
}
