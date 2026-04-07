import type { PortfolioSettings } from "@/types";

export const defaultPortfolioSettings: PortfolioSettings = {
  site: {
    homeTitle: "Your Name Portfolio",
    homeDescription: "Portfolio website showcasing your work and ideas",
    aboutTitle: "About - Your Name",
    aboutDescription: "Learn more about Your Name and the work behind this portfolio",
    workTitle: "Projects - Your Name",
    workDescription: "Selected projects and case studies by Your Name",
    blogTitle: "Writing by Your Name",
    blogDescription: "Thoughts, notes, and updates from Your Name",
    galleryTitle: "Gallery - Your Name",
    galleryDescription: "A visual collection curated by Your Name",
  },
  profile: {
    firstName: "Your",
    lastName: "Name",
    name: "Your Name",
    role: "Creative Developer",
    avatar: "/images/avatar.jpg",
    email: "your@email.com",
    location: "Asia/Jakarta",
    languages: ["English"],
    headline: "Building thoughtful digital experiences",
    subline:
      "I build products, write about the process, and share selected work through this portfolio.",
    introTitle: "Introduction",
    introDescription:
      "Use this section to introduce yourself, your background, and the kind of work you want visitors to remember.",
  },
  experiences: [
    {
      company: "Your Company",
      timeframe: "2022 - Present",
      role: "Your Role",
      achievements: [
        "Describe a measurable outcome, project launch, or responsibility that represents your current work.",
        "Add another highlight that shows the impact of your craft, leadership, or technical contribution.",
      ],
      images: [
        {
          src: "/images/projects/project-01/cover-01.jpg",
          alt: "Experience highlight",
          width: 16,
          height: 9,
        },
      ],
    },
    {
      company: "Previous Company",
      timeframe: "2018 - 2022",
      role: "Previous Role",
      achievements: [
        "Summarize a past accomplishment that still adds credibility to your profile.",
        "Use this space to highlight leadership, process improvements, or product outcomes.",
      ],
      images: [],
    },
  ],
  studies: [
    {
      name: "Your University",
      description: "Describe your education, training, or area of study.",
    },
    {
      name: "Your Certification",
      description: "Add a course, certification, or focused training program here.",
    },
  ],
  skills: [
    {
      title: "Design Systems",
      description: "Document one of your strongest skills and explain how you use it in real projects.",
      tags: [{ name: "Design", icon: "figma" }],
      images: [
        {
          src: "/images/projects/project-01/cover-02.jpg",
          alt: "Skill showcase",
          width: 16,
          height: 9,
        },
        {
          src: "/images/projects/project-01/cover-03.jpg",
          alt: "Skill showcase",
          width: 16,
          height: 9,
        },
      ],
    },
    {
      title: "Frontend Development",
      description: "Add another core capability and the tools you rely on most often.",
      tags: [
        { name: "JavaScript", icon: "javascript" },
        { name: "React", icon: "react" },
        { name: "Next.js", icon: "nextjs" },
      ],
      images: [
        {
          src: "/images/projects/project-01/cover-04.jpg",
          alt: "Skill showcase",
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
      link: "https://github.com/yourusername",
      essential: true,
      order: 1,
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      icon: "linkedin",
      link: "https://www.linkedin.com/in/yourprofile/",
      essential: true,
      order: 2,
    },
    {
      id: "instagram",
      name: "Instagram",
      icon: "instagram",
      link: "https://www.instagram.com/yourhandle/",
      essential: false,
      order: 3,
    },
    {
      id: "threads",
      name: "Threads",
      icon: "threads",
      link: "https://www.threads.net/@yourhandle",
      essential: true,
      order: 4,
    },
    {
      id: "email",
      name: "Email",
      icon: "email",
      link: "mailto:your@email.com",
      essential: true,
      order: 5,
    },
  ],
};
