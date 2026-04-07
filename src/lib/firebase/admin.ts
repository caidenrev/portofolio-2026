import { cert, getApps, initializeApp } from "firebase-admin/app";
import type { App, ServiceAccount } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

function getServiceAccount(): ServiceAccount {
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Firebase Admin env belum lengkap. Isi FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL, dan FIREBASE_ADMIN_PRIVATE_KEY.",
    );
  }

  return {
    projectId,
    clientEmail,
    privateKey,
  };
}

export function getFirebaseAdminApp(): App {
  const existingApp = getApps()[0];
  if (existingApp) {
    return existingApp;
  }

  return initializeApp({
    credential: cert(getServiceAccount()),
  });
}

export function getFirebaseAdminAuth() {
  return getAuth(getFirebaseAdminApp());
}
