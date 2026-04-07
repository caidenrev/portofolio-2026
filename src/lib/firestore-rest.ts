import { defaultPortfolioSettings } from "@/lib/portfolio-defaults";
import type { PortfolioPost, PortfolioProject, PortfolioSettings } from "@/types";

type FirestoreValue =
  | { stringValue: string }
  | { integerValue: string }
  | { doubleValue: number }
  | { booleanValue: boolean }
  | { nullValue: null }
  | { arrayValue: { values?: FirestoreValue[] } }
  | { mapValue: { fields?: Record<string, FirestoreValue> } };

type FirestoreDocument = {
  name: string;
  fields?: Record<string, FirestoreValue>;
};

function decodeFirestoreValue(value: FirestoreValue): unknown {
  if ("stringValue" in value) return value.stringValue;
  if ("integerValue" in value) return Number(value.integerValue);
  if ("doubleValue" in value) return value.doubleValue;
  if ("booleanValue" in value) return value.booleanValue;
  if ("nullValue" in value) return null;
  if ("arrayValue" in value) return (value.arrayValue.values ?? []).map(decodeFirestoreValue);
  if ("mapValue" in value) {
    const entries = Object.entries(value.mapValue.fields ?? {}).map(([key, child]) => [
      key,
      decodeFirestoreValue(child),
    ]);
    return Object.fromEntries(entries);
  }

  return null;
}

function decodeFirestoreDocument<T>(document: FirestoreDocument): T & { id?: string } {
  const data = Object.fromEntries(
    Object.entries(document.fields ?? {}).map(([key, value]) => [key, decodeFirestoreValue(value)]),
  ) as T;
  const id = document.name.split("/").pop();
  return { id, ...data };
}

function getRestBaseUrl() {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

  if (!projectId || !apiKey) {
    return null;
  }

  return {
    apiKey,
    baseUrl: `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents`,
  };
}

export async function getPublicPortfolioSettings() {
  const config = getRestBaseUrl();
  if (!config) {
    return defaultPortfolioSettings;
  }

  try {
    const response = await fetch(`${config.baseUrl}/settings/portfolio?key=${config.apiKey}`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      return defaultPortfolioSettings;
    }

    const document = (await response.json()) as FirestoreDocument;
    return decodeFirestoreDocument<PortfolioSettings>(document);
  } catch {
    return defaultPortfolioSettings;
  }
}

async function getPublicCollection<T>(collectionName: string) {
  const config = getRestBaseUrl();
  if (!config) {
    return [] as Array<T & { id?: string }>;
  }

  try {
    const response = await fetch(`${config.baseUrl}/${collectionName}?key=${config.apiKey}`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      return [] as Array<T & { id?: string }>;
    }

    const payload = (await response.json()) as { documents?: FirestoreDocument[] };
    return (payload.documents ?? []).map((document) => decodeFirestoreDocument<T>(document));
  } catch {
    return [] as Array<T & { id?: string }>;
  }
}

export async function getPublicPortfolioPosts() {
  return getPublicCollection<PortfolioPost>("posts");
}

export async function getPublicPortfolioProjects() {
  return getPublicCollection<PortfolioProject>("projects");
}
