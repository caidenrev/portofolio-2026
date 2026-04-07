"use client";

import { getAnalytics, isSupported } from "firebase/analytics";
import type { Analytics } from "firebase/analytics";
import { getFirebaseApp } from "./client";

let analyticsInstance: Analytics | null = null;
let analyticsInitialization: Promise<Analytics | null> | null = null;

export async function initFirebaseAnalytics() {
  if (analyticsInstance) {
    return analyticsInstance;
  }

  if (analyticsInitialization) {
    return analyticsInitialization;
  }

  analyticsInitialization = (async () => {
    if (typeof window === "undefined") {
      return null;
    }

    const supported = await isSupported();
    if (!supported) {
      return null;
    }

    analyticsInstance = getAnalytics(getFirebaseApp());
    return analyticsInstance;
  })();

  return analyticsInitialization;
}
