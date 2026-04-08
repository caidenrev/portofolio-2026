import { defaultPortfolioSettings } from "@/lib/portfolio-defaults";
import {
  getPublicPortfolioPosts,
  getPublicPortfolioProjects,
  getPublicPortfolioSettings,
} from "@/lib/firestore-rest";
import type { PortfolioPost, PortfolioProject, PortfolioSettings } from "@/types";

async function getAdminDb() {
  const [{ getFirestore }, { getFirebaseAdminApp }] = await Promise.all([
    import("firebase-admin/firestore"),
    import("./admin"),
  ]);

  return getFirestore(getFirebaseAdminApp());
}

export async function getAdminPortfolioSettings() {
  try {
    const adminDb = await getAdminDb();
    const snapshot = await adminDb.collection("settings").doc("portfolio").get();
    if (!snapshot.exists) {
      return defaultPortfolioSettings;
    }

    return snapshot.data() as PortfolioSettings;
  } catch (error) {
    console.error("Admin settings fetch failed, falling back to public Firestore fetch.", error);
    return getPublicPortfolioSettings();
  }
}

export async function getAdminPortfolioPosts() {
  try {
    const adminDb = await getAdminDb();
    const snapshot = await adminDb.collection("posts").get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Array<
      PortfolioPost & { id: string }
    >;
  } catch (error) {
    console.error("Admin posts fetch failed, falling back to public Firestore fetch.", error);
    return getPublicPortfolioPosts();
  }
}

export async function getAdminPortfolioProjects() {
  try {
    const adminDb = await getAdminDb();
    const snapshot = await adminDb.collection("projects").get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Array<
      PortfolioProject & { id: string }
    >;
  } catch (error) {
    console.error("Admin projects fetch failed, falling back to public Firestore fetch.", error);
    return getPublicPortfolioProjects();
  }
}
