export type PortfolioImage = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  orientation?: "horizontal" | "vertical";
};

export type PortfolioSocialLink = {
  id: string;
  name: string;
  icon: string;
  link: string;
  essential?: boolean;
  order?: number;
};

export type PortfolioProfile = {
  firstName: string;
  lastName: string;
  name: string;
  role: string;
  avatar: string;
  email: string;
  location: string;
  languages: string[];
  headline: string;
  subline: string;
  introTitle: string;
  introDescription: string;
};

export type PortfolioExperience = {
  company: string;
  timeframe: string;
  role: string;
  achievements: string[];
  images?: PortfolioImage[];
};

export type PortfolioStudy = {
  name: string;
  description: string;
};

export type PortfolioSkill = {
  title: string;
  description?: string;
  tags?: Array<{
    name: string;
    icon?: string;
  }>;
  images?: PortfolioImage[];
};

export type PortfolioProject = {
  id?: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  publishedAt: string;
  image?: string;
  images: string[];
  tag?: string;
  link?: string;
  featured?: boolean;
  team?: Array<{
    name: string;
    role: string;
    avatar: string;
    linkedIn: string;
  }>;
};

export type PortfolioPost = {
  id?: string;
  slug: string;
  title: string;
  subtitle?: string;
  summary: string;
  content: string;
  publishedAt: string;
  image?: string;
  tag?: string;
  status?: "draft" | "published";
  seoTitle?: string;
  seoDescription?: string;
};

export type PortfolioGalleryItem = {
  id?: string;
  src: string;
  alt: string;
  orientation: "horizontal" | "vertical";
  order?: number;
};

export type PortfolioSettings = {
  site: {
    homeTitle: string;
    homeDescription: string;
    aboutTitle: string;
    aboutDescription: string;
    workTitle: string;
    workDescription: string;
    blogTitle: string;
    blogDescription: string;
    galleryTitle: string;
    galleryDescription: string;
  };
  profile: PortfolioProfile;
  experiences: PortfolioExperience[];
  studies: PortfolioStudy[];
  skills: PortfolioSkill[];
  socialLinks: PortfolioSocialLink[];
};
