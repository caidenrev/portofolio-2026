import {
  addDoc,
  CollectionReference,
  DocumentData,
  QueryDocumentSnapshot,
  SnapshotOptions,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { getFirebaseDb } from "./client";
import {
  PortfolioGalleryItem,
  PortfolioPost,
  PortfolioProject,
  PortfolioSettings,
} from "@/types";

const firestoreConverter = <T>() => ({
  toFirestore(data: T): DocumentData {
    return data as DocumentData;
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): T {
    return snapshot.data(options) as T;
  },
});

export const portfolioCollections = {
  settings: "settings",
  projects: "projects",
  posts: "posts",
  gallery: "gallery",
} as const;

export async function getPortfolioSettings() {
  const settingsRef = doc(getFirebaseDb(), portfolioCollections.settings, "portfolio").withConverter(
    firestoreConverter<PortfolioSettings>(),
  );

  const snapshot = await getDoc(settingsRef);
  return snapshot.exists() ? snapshot.data() : null;
}

async function getCollectionItems<T>(collectionName: string) {
  const collectionRef = collection(getFirebaseDb(), collectionName).withConverter(
    firestoreConverter<T>(),
  ) as CollectionReference<T>;

  const snapshot = await getDocs(collectionRef);
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as T & { id: string });
}

export async function getPortfolioProjects() {
  return getCollectionItems<PortfolioProject>(portfolioCollections.projects);
}

export async function getPortfolioPosts() {
  return getCollectionItems<PortfolioPost>(portfolioCollections.posts);
}

export function subscribeToPortfolioPosts(
  callback: (posts: Array<PortfolioPost & { id: string }>) => void,
) {
  const collectionRef = collection(getFirebaseDb(), portfolioCollections.posts).withConverter(
    firestoreConverter<PortfolioPost>(),
  ) as CollectionReference<PortfolioPost>;

  return onSnapshot(collectionRef, (snapshot) => {
    callback(
      snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      })),
    );
  });
}

export async function getPortfolioGallery() {
  return getCollectionItems<PortfolioGalleryItem>(portfolioCollections.gallery);
}

export async function savePortfolioSettings(settings: PortfolioSettings) {
  const settingsRef = doc(getFirebaseDb(), portfolioCollections.settings, "portfolio").withConverter(
    firestoreConverter<PortfolioSettings>(),
  );

  await setDoc(settingsRef, settings);
}

async function addCollectionItem<T>(collectionName: string, item: T) {
  const collectionRef = collection(getFirebaseDb(), collectionName).withConverter(
    firestoreConverter<T>(),
  ) as CollectionReference<T>;

  const document = await addDoc(collectionRef, item);
  return document.id;
}

async function updateCollectionItem<T extends { id?: string }>(collectionName: string, item: T) {
  if (!item.id) {
    throw new Error(`Cannot update ${collectionName} item without an id.`);
  }

  const documentRef = doc(getFirebaseDb(), collectionName, item.id);
  const { id, ...data } = item;
  await updateDoc(documentRef, data as DocumentData);
}

async function deleteCollectionItem(collectionName: string, id: string) {
  await deleteDoc(doc(getFirebaseDb(), collectionName, id));
}

export async function createPortfolioProject(project: PortfolioProject) {
  return addCollectionItem(portfolioCollections.projects, project);
}

export async function updatePortfolioProject(project: PortfolioProject) {
  await updateCollectionItem(portfolioCollections.projects, project);
}

export async function deletePortfolioProject(id: string) {
  await deleteCollectionItem(portfolioCollections.projects, id);
}

export async function createPortfolioPost(post: PortfolioPost) {
  return addCollectionItem(portfolioCollections.posts, post);
}

export async function updatePortfolioPost(post: PortfolioPost) {
  await updateCollectionItem(portfolioCollections.posts, post);
}

export async function deletePortfolioPost(id: string) {
  await deleteCollectionItem(portfolioCollections.posts, id);
}

export async function createPortfolioGalleryItem(item: PortfolioGalleryItem) {
  return addCollectionItem(portfolioCollections.gallery, item);
}

export async function updatePortfolioGalleryItem(item: PortfolioGalleryItem) {
  await updateCollectionItem(portfolioCollections.gallery, item);
}

export async function deletePortfolioGalleryItem(id: string) {
  await deleteCollectionItem(portfolioCollections.gallery, id);
}

export async function getPortfolioProjectBySlug(slug: string) {
  const collectionRef = collection(getFirebaseDb(), portfolioCollections.projects).withConverter(
    firestoreConverter<PortfolioProject>(),
  ) as CollectionReference<PortfolioProject>;
  const snapshot = await getDocs(query(collectionRef, where("slug", "==", slug)));
  const document = snapshot.docs[0];
  return document ? { id: document.id, ...document.data() } : null;
}

export async function getPortfolioPostBySlug(slug: string) {
  const collectionRef = collection(getFirebaseDb(), portfolioCollections.posts).withConverter(
    firestoreConverter<PortfolioPost>(),
  ) as CollectionReference<PortfolioPost>;
  const snapshot = await getDocs(query(collectionRef, where("slug", "==", slug)));
  const document = snapshot.docs[0];
  return document ? { id: document.id, ...document.data() } : null;
}

export function subscribeToPortfolioPostBySlug(
  slug: string,
  callback: (post: (PortfolioPost & { id: string }) | null) => void,
) {
  const collectionRef = collection(getFirebaseDb(), portfolioCollections.posts).withConverter(
    firestoreConverter<PortfolioPost>(),
  ) as CollectionReference<PortfolioPost>;

  return onSnapshot(query(collectionRef, where("slug", "==", slug)), (snapshot) => {
    const document = snapshot.docs[0];
    callback(document ? { id: document.id, ...document.data() } : null);
  });
}
