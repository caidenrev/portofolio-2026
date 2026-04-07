# Magic Portfolio CMS

Portfolio ini sudah di-upgrade dari template statis Once UI menjadi portfolio yang bisa dikelola lewat dashboard admin.

Fitur utama:
- Firebase Auth untuk login admin dashboard
- Firestore untuk menyimpan profile, site metadata, projects, posts, gallery, social links, experiences, studies, dan skills
- Cloudinary unsigned upload langsung dari dashboard
- Fallback ke konten lokal lama saat Firestore belum terisi
- Import starter content dari data statis lama ke Firestore dengan satu tombol

## Stack

- Next.js 16
- React 19
- Firebase Auth
- Firestore
- Cloudinary
- Once UI

## Setup

1. Install dependency

```bash
npm install
```

2. Isi `.env.local`

Lihat contoh lengkap di [`.env.example`](./.env.example).

Minimal yang dibutuhkan:

```env
PAGE_ACCESS_PASSWORD=password

NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
NEXT_PUBLIC_ADMIN_EMAIL=admin@example.com

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_unsigned_upload_preset
```

3. Aktifkan Firebase Auth

- Buka Firebase Console
- Aktifkan `Authentication > Sign-in method > Email/Password`
- Buat user admin
- Pastikan email user admin sama dengan `NEXT_PUBLIC_ADMIN_EMAIL`

4. Buat Firestore rules

Gunakan file [`firestore.rules`](./firestore.rules), lalu ganti email admin literal di rules sesuai email admin kamu.

Catatan:
- koleksi `settings`, `projects`, `posts`, dan `gallery` saat ini `public read`
- write hanya boleh untuk admin yang login

5. Aktifkan Cloudinary unsigned upload

- Buat `upload preset` dengan mode unsigned
- Isi `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
- Isi `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`

6. Jalankan project

```bash
npm run dev
```

## Dashboard

Route dashboard:

```text
/dashboard
```

Fitur dashboard:
- Site metadata
- Profile settings
- Social links
- Work experience
- Studies
- Skills
- Projects
- Posts
- Gallery

Dashboard sudah punya:
- login Firebase
- tab navigation
- upload media Cloudinary
- preview avatar / cover / image list
- multi-upload untuk list media
- drag and drop reorder untuk media dan gallery
- live markdown preview untuk post dan project

## Import Starter Content

Kalau Firestore masih kosong, login ke dashboard lalu klik:

```text
Import starter data
```

Import ini akan:
- overwrite document `settings/portfolio`
- upsert project berdasarkan `slug`
- upsert post berdasarkan `slug`
- replace isi koleksi `gallery`

Sumber data import:
- `src/lib/portfolio-defaults.ts`
- file MDX lama di `src/app/work/projects`
- file MDX lama di `src/app/blog/posts`
- gallery lokal lama dari `src/resources/content.tsx`

## Struktur Data

Firestore collections:
- `settings/portfolio`
- `projects`
- `posts`
- `gallery`

## Catatan Arsitektur

- UI publik utama tetap mempertahankan desain Once UI
- perubahan utama ada di layer data dan dashboard admin
- beberapa metadata dan schema sekarang membaca data dari Firestore public read
- ketika Firestore kosong, sebagian halaman masih fallback ke konten lokal lama

## Validasi

Type check:

```bash
npx tsc --noEmit
```

## Custom Claims Admin

Kalau kamu ingin proteksi admin yang lebih kuat dari sekadar email check, isi env Firebase Admin di [`.env.example`](./.env.example) lalu pakai endpoint ini:

```text
POST /api/admin/claims
```

Header:

```text
x-setup-token: FIREBASE_ADMIN_SETUP_TOKEN
```

Body JSON:

```json
{
  "email": "admin@example.com",
  "admin": true
}
```

Setelah custom claim diberikan:
- Firestore rules akan menerima `request.auth.token.admin == true`
- dashboard juga akan membaca custom claim itu saat login
- fallback email check tetap ada supaya migrasi awal tetap aman

## Langkah Berikutnya

Beberapa peningkatan yang masih bisa ditambahkan:
- editor rich text visual penuh kalau nanti kamu ingin mengganti markdown editor
- script seed CLI berbasis service account kalau nanti kamu ingin proses deploy yang lebih otomatis
