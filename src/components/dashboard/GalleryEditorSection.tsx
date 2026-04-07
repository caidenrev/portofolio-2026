"use client";

import { useState } from "react";
import { Button, Column, Heading, Input, Media, Row, Text } from "@once-ui-system/core";
import { CloudinaryUploadButton } from "./CloudinaryUploadButton";
import type { PortfolioGalleryItem } from "@/types";

export function GalleryEditorSection({
  galleryItems,
  galleryDraft,
  submitting,
  onDraftChange,
  onEdit,
  onDelete,
  onMove,
  onReorder,
  onSave,
  onReset,
}: {
  galleryItems: PortfolioGalleryItem[];
  galleryDraft: PortfolioGalleryItem;
  submitting: boolean;
  onDraftChange: (updater: (current: PortfolioGalleryItem) => PortfolioGalleryItem) => void;
  onEdit: (item: PortfolioGalleryItem) => void;
  onDelete: (id?: string) => void;
  onMove: (id: string | undefined, direction: "up" | "down") => void;
  onReorder: (from: number, to: number) => void;
  onSave: () => void;
  onReset: () => void;
}) {
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  return (
    <Column gap="16">
      <Heading as="h2" variant="heading-strong-l">
        Gallery
      </Heading>
      <Row gap="16" s={{ direction: "column" }} vertical="start">
        <Column
          flex={1}
          gap="8"
          background="surface"
          border="neutral-alpha-weak"
          radius="l"
          padding="20"
        >
          <Text variant="body-default-s" onBackground="neutral-weak">
            Drag and drop item gallery untuk mengubah urutan, atau pakai tombol Up dan Down.
          </Text>
          {galleryItems.map((item, index) => (
            <Row
              key={item.id ?? item.src}
              draggable
              horizontal="between"
              vertical="center"
              gap="12"
              padding="8"
              radius="m"
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
                  onReorder(draggingIndex, index);
                }
                setDraggingIndex(null);
                setHoverIndex(null);
              }}
              onDragEnd={() => {
                setDraggingIndex(null);
                setHoverIndex(null);
              }}
            >
              <Row gap="12" vertical="center">
                <Media
                  src={item.src}
                  alt={item.alt || `Gallery item ${index + 1}`}
                  aspectRatio={item.orientation === "vertical" ? "3 / 4" : "4 / 3"}
                  radius="m"
                  sizes="96px"
                />
                <Column gap="4">
                  <Button variant="tertiary" onClick={() => onEdit(item)}>
                    {item.alt || item.src}
                  </Button>
                  <Text variant="body-default-s" onBackground="neutral-weak">
                    Order {item.order ?? index}
                  </Text>
                </Column>
              </Row>
              <Row gap="8">
                <Button variant="tertiary" onClick={() => onMove(item.id, "up")}>
                  Up
                </Button>
                <Button variant="tertiary" onClick={() => onMove(item.id, "down")}>
                  Down
                </Button>
                <Button variant="secondary" onClick={() => onDelete(item.id)}>
                  Delete
                </Button>
              </Row>
            </Row>
          ))}
        </Column>
        <Column
          flex={2}
          gap="12"
          background="surface"
          border="neutral-alpha-weak"
          radius="l"
          padding="20"
        >
          <Input
            id="gallery-src"
            label="Image URL"
            value={galleryDraft.src}
            onChange={(event) =>
              onDraftChange((current) => ({ ...current, src: event.target.value }))
            }
          />
          <Row gap="12" wrap>
            <CloudinaryUploadButton
              label="Upload gallery media"
              onUploaded={(url) => onDraftChange((current) => ({ ...current, src: url }))}
            />
          </Row>
          <Input
            id="gallery-alt"
            label="Alt text"
            value={galleryDraft.alt}
            onChange={(event) =>
              onDraftChange((current) => ({ ...current, alt: event.target.value }))
            }
          />
          <Input
            id="gallery-order"
            label="Order"
            value={String(galleryDraft.order ?? 0)}
            onChange={(event) =>
              onDraftChange((current) => ({
                ...current,
                order: Number(event.target.value) || 0,
              }))
            }
          />
          <Row gap="12">
            <Button
              variant={galleryDraft.orientation === "horizontal" ? "primary" : "secondary"}
              onClick={() =>
                onDraftChange((current) => ({ ...current, orientation: "horizontal" }))
              }
            >
              Horizontal
            </Button>
            <Button
              variant={galleryDraft.orientation === "vertical" ? "primary" : "secondary"}
              onClick={() =>
                onDraftChange((current) => ({ ...current, orientation: "vertical" }))
              }
            >
              Vertical
            </Button>
          </Row>
          <Row gap="12">
            <Button onClick={onSave} loading={submitting}>
              Save gallery item
            </Button>
            <Button variant="secondary" onClick={onReset}>
              New item
            </Button>
          </Row>
        </Column>
      </Row>
    </Column>
  );
}
