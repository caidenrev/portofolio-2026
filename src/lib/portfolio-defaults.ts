import type { PortfolioSettings } from "@/types";

export const defaultPortfolioSettings: PortfolioSettings = {
  site: {
    homeTitle: "Selene Yu's Portfolio",
    homeDescription: "Portfolio website showcasing my work as a Design Engineer",
    aboutTitle: "About - Selene Yu",
    aboutDescription: "Meet Selene Yu, Design Engineer from Asia/Jakarta",
    workTitle: "Projects - Selene Yu",
    workDescription: "Design and dev projects by Selene Yu",
    blogTitle: "Writing about design and tech...",
    blogDescription: "Read what Selene Yu has been up to recently",
    galleryTitle: "Photo gallery - Selene Yu",
    galleryDescription: "A photo collection by Selene Yu",
  },
  profile: {
    firstName: "Selene",
    lastName: "Yu",
    name: "Selene Yu",
    role: "Design Engineer",
    avatar: "/images/avatar.jpg",
    email: "example@gmail.com",
    location: "Asia/Jakarta",
    languages: ["English", "Bahasa"],
    headline: "Building bridges between design and code",
    subline:
      "I'm Selene, a design engineer at ONCE UI, where I craft intuitive user experiences. After hours, I build my own projects.",
    introTitle: "Introduction",
    introDescription:
      "Selene is a Jakarta-based design engineer with a passion for transforming complex challenges into simple, elegant design solutions. Her work spans digital interfaces, interactive experiences, and the convergence of design and technology.",
  },
  experiences: [
    {
      company: "FLY",
      timeframe: "2022 - Present",
      role: "Senior Design Engineer",
      achievements: [
        "Redesigned the UI/UX for the FLY platform, resulting in a 20% increase in user engagement and 30% faster load times.",
        "Spearheaded the integration of AI tools into design workflows, enabling designers to iterate 50% faster.",
      ],
      images: [
        {
          src: "/images/projects/project-01/cover-01.jpg",
          alt: "Once UI Project",
          width: 16,
          height: 9,
        },
      ],
    },
    {
      company: "Creativ3",
      timeframe: "2018 - 2022",
      role: "Lead Designer",
      achievements: [
        "Developed a design system that unified the brand across multiple platforms, improving design consistency by 40%.",
        "Led a cross-functional team to launch a new product line, contributing to a 15% increase in overall company revenue.",
      ],
      images: [],
    },
  ],
  studies: [
    {
      name: "University of Jakarta",
      description: "Studied software engineering.",
    },
    {
      name: "Build the Future",
      description: "Studied online marketing and personal branding.",
    },
  ],
  skills: [
    {
      title: "Figma",
      description: "Able to prototype in Figma with Once UI with unnatural speed.",
      tags: [{ name: "Figma", icon: "figma" }],
      images: [
        {
          src: "/images/projects/project-01/cover-02.jpg",
          alt: "Project image",
          width: 16,
          height: 9,
        },
        {
          src: "/images/projects/project-01/cover-03.jpg",
          alt: "Project image",
          width: 16,
          height: 9,
        },
      ],
    },
    {
      title: "Next.js",
      description: "Building next gen apps with Next.js + Once UI + Supabase.",
      tags: [
        { name: "JavaScript", icon: "javascript" },
        { name: "Next.js", icon: "nextjs" },
        { name: "Supabase", icon: "supabase" },
      ],
      images: [
        {
          src: "/images/projects/project-01/cover-04.jpg",
          alt: "Project image",
          width: 16,
          height: 9,
        },
      ],
    },
  ],
  socialLinks: [
    {
      id: "github",
      name: "GitHub",
      icon: "github",
      link: "https://github.com/once-ui-system",
      essential: true,
      order: 1,
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      icon: "linkedin",
      link: "https://www.linkedin.com/company/once-ui/",
      essential: true,
      order: 2,
    },
    {
      id: "instagram",
      name: "Instagram",
      icon: "instagram",
      link: "https://www.instagram.com/once_ui/",
      essential: false,
      order: 3,
    },
    {
      id: "threads",
      name: "Threads",
      icon: "threads",
      link: "https://www.threads.com/@once_ui",
      essential: true,
      order: 4,
    },
    {
      id: "email",
      name: "Email",
      icon: "email",
      link: "mailto:example@gmail.com",
      essential: true,
      order: 5,
    },
  ],
};
