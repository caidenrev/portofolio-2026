import type { PortfolioSettings } from "@/types";

export const defaultPortfolioSettings: PortfolioSettings = {
  site: {
    homeTitle: "",
    homeDescription: "",
    aboutTitle: "",
    aboutDescription: "",
    workTitle: "",
    workDescription: "",
    blogTitle: "",
    blogDescription: "",
    galleryTitle: "",
    galleryDescription: "",
  },
  profile: {
    firstName: "",
    lastName: "",
    name: "",
    role: "",
    avatar: "",
    email: "",
    location: "",
    languages: [],
    headline: "",
    subline: "",
    introTitle: "",
    introDescription: "",
  },
  experiences: [],
  studies: [],
  skills: [],
  socialLinks: [],
};

export function mergePortfolioSettings(
  // biome-ignore lint/suspicious/noExplicitAny: Required for recursive deep merge
  defaultObj: any,
  // biome-ignore lint/suspicious/noExplicitAny: Required for recursive deep merge
  newObj: any
): PortfolioSettings {
  if (newObj === null || newObj === undefined) return defaultObj;
  if (typeof newObj !== "object" || Array.isArray(newObj)) return newObj;

  const merged = { ...defaultObj };
  for (const key in newObj) {
    if (Object.prototype.hasOwnProperty.call(newObj, key)) {
      if (
        typeof newObj[key] === "object" &&
        !Array.isArray(newObj[key]) &&
        newObj[key] !== null
      ) {
        merged[key] = mergePortfolioSettings(defaultObj[key] || {}, newObj[key]);
      } else {
        merged[key] = newObj[key] !== undefined ? newObj[key] : defaultObj[key];
      }
    }
  }
  return merged as PortfolioSettings;
}
