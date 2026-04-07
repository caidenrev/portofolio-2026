import { getFirestore } from "firebase-admin/firestore";
import { defaultPortfolioSettings } from "@/lib/portfolio-defaults";
import { getFirebaseAdminApp } from "./admin";
import type { PortfolioPost, PortfolioProject, PortfolioSettings } from "@/types";

function getAdminDb() {
  return getFirestore(getFirebaseAdminApp());
}

export async function getAdminPortfolioSettings() {
  try {
    const snapshot = await getAdminDb().collection("settings").doc("portfolio").get();
    if (!snapshot.exists) {
      return defaultPortfolioSettings;
    }

    return snapshot.data() as PortfolioSettings;
  } catch {
    return defaultPortfolioSettings;
  }
}

export async function getAdminPortfolioPosts() {
  try {
    const snapshot = await getAdminDb().collection("posts").get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Array<
      PortfolioPost & { id: string }
    >;
  } catch {
    return [] as Array<PortfolioPost & { id: string }>;
  }
}

export async function getAdminPortfolioProjects() {
  try {
    const snapshot = await getAdminDb().collection("projects").get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Array<
      PortfolioProject & { id: string }
    >;
  } catch {
    return [] as Array<PortfolioProject & { id: string }>;
  }
}
