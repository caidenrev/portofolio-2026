"use client";

import { useRef, useState } from "react";
import { Button, useToast } from "@once-ui-system/core";
import { uploadToCloudinary } from "@/lib/cloudinary";

export function CloudinaryUploadButton({
  onUploaded,
  onUploadedMany,
  accept = "image/*,video/*",
  label = "Upload media",
  variant = "secondary",
  multiple = false,
}: {
  onUploaded: (url: string) => void;
  onUploadedMany?: (urls: string[]) => void;
  accept?: string;
  label?: string;
  variant?: "primary" | "secondary" | "tertiary";
  multiple?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { addToast } = useToast();
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;

    setUploading(true);

    try {
      const results = await Promise.all(files.map((file) => uploadToCloudinary(file)));
      const urls = results.map((result) => result.secure_url);
      if (onUploadedMany) {
        onUploadedMany(urls);
      } else {
        for (const url of urls) {
          onUploaded(url);
        }
      }
      addToast({
        variant: "success",
        message: urls.length > 1 ? "Semua file berhasil di-upload." : "Upload Cloudinary berhasil.",
      });
    } catch (error) {
      addToast({
        variant: "danger",
        message: error instanceof Error ? error.message : "Upload Cloudinary gagal.",
      });
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  return (
    <>
      <input
        ref={inputRef}
        hidden
        type="file"
        multiple={multiple}
        accept={accept}
        onChange={(event) => {
          void handleFileChange(event);
        }}
      />
      <Button variant={variant} loading={uploading} onClick={() => inputRef.current?.click()}>
        {label}
      </Button>
    </>
  );
}
