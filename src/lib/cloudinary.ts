"use client";

export type CloudinaryUploadResult = {
  secure_url: string;
  resource_type: string;
  public_id: string;
  format?: string;
};

function getCloudinaryConfig() {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error(
      "Cloudinary belum dikonfigurasi. Isi NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME dan NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET di .env.local.",
    );
  }

  return { cloudName, uploadPreset };
}

export async function uploadToCloudinary(file: File) {
  const { cloudName, uploadPreset } = getCloudinaryConfig();
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Upload ke Cloudinary gagal. Cek upload preset dan koneksi internet.");
  }

  return (await response.json()) as CloudinaryUploadResult;
}
