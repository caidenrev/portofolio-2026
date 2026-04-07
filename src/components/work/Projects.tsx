"use client";

import { useEffect, useState } from "react";
import { Column } from "@once-ui-system/core";
import { ProjectCard } from "@/components";
import { getPortfolioProjects } from "@/lib/firebase/portfolio";
import { PortfolioProject } from "@/types";

interface ProjectsProps {
  range?: [number, number?];
  exclude?: string[];
  initialProjects?: PortfolioProject[];
}

export function Projects({ range, exclude, initialProjects = [] }: ProjectsProps) {
  const [allProjects, setAllProjects] = useState<PortfolioProject[]>(initialProjects);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const firestoreProjects = await getPortfolioProjects();
        if (firestoreProjects.length > 0) {
          setAllProjects(firestoreProjects);
        }
      } catch {
        setAllProjects(initialProjects);
      }
    };

    void loadProjects();
  }, [initialProjects]);

  // Exclude by slug (exact match)
  const filteredProjects =
    exclude && exclude.length > 0
      ? allProjects.filter((post) => !exclude.includes(post.slug))
      : allProjects;

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });

  const displayedProjects = range
    ? sortedProjects.slice(range[0] - 1, range[1] ?? sortedProjects.length)
    : sortedProjects;

  return (
    <Column fillWidth gap="xl" marginBottom="40" paddingX="l">
      {displayedProjects.map((post, index) => (
        <ProjectCard
          priority={index < 2}
          key={post.id ?? post.slug}
          href={`/work/${post.slug}`}
          images={post.images}
          title={post.title}
          description={post.summary}
          content={post.content}
          avatars={post.team?.map((member) => ({ src: member.avatar })) || []}
          link={post.link || ""}
        />
      ))}
    </Column>
  );
}
