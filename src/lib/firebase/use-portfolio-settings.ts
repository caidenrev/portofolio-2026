"use client";

import { useEffect, useState } from "react";
import { defaultPortfolioSettings } from "@/lib/portfolio-defaults";
import type { PortfolioSettings } from "@/types";
import { getPortfolioSettings, subscribeToPortfolioSettings } from "./portfolio";

export function usePortfolioSettings(initialSettings: PortfolioSettings = defaultPortfolioSettings) {
  const [settings, setSettings] = useState<PortfolioSettings>(initialSettings);

  useEffect(() => {
    let isMounted = true;

    const loadSettings = async () => {
      try {
        const firestoreSettings = await getPortfolioSettings();
        if (isMounted && firestoreSettings) {
          setSettings(firestoreSettings);
        }
      } catch {
        if (isMounted) {
          setSettings(initialSettings);
        }
      }
    };

    void loadSettings();

    try {
      const unsubscribe = subscribeToPortfolioSettings((firestoreSettings) => {
        if (firestoreSettings) {
          setSettings(firestoreSettings);
        }
      });

      return () => {
        isMounted = false;
        unsubscribe();
      };
    } catch {
      return () => {
        isMounted = false;
      };
    }
  }, [initialSettings]);

  return settings;
}
