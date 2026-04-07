"use client";

import { useEffect, useState } from "react";
import {
  AvatarGroup,
  Column,
  Heading,
  Line,
  Media,
  Row,
  SmartLink,
  Text,
} from "@once-ui-system/core";
import { about, baseURL, person, work } from "@/resources";
import { formatDate } from "@/utils/formatDate";
import { CustomMDX, ScrollToHash } from "@/components";
import { PortfolioProject } from "@/types";
import { getPortfolioProjectBySlug } from "@/lib/firebase/portfolio";
import { Projects } from "./Projects";

export function ProjectDetailClient({
  slug,
  initialProject,
  initialProjects = [],
}: {
  slug: string;
  initialProject: PortfolioProject | null;
  initialProjects?: PortfolioProject[];
}) {
  const [project, setProject] = useState<PortfolioProject | null>(initialProject);

  useEffect(() => {
    const loadProject = async () => {
      try {
        const firestoreProject = await getPortfolioProjectBySlug(slug);
        if (firestoreProject) {
          setProject(firestoreProject);
        }
      } catch {
        setProject(initialProject);
      }
    };

    void loadProject();
  }, [slug, initialProject]);

  if (!project) {
    return (
      <Column maxWidth="s" horizontal="center" gap="12">
        <Heading variant="display-strong-s">Project not found</Heading>
        <Text onBackground="neutral-weak">Project ini belum tersedia atau slug-nya salah.</Text>
      </Column>
    );
  }

  const avatars = project.team?.map((member) => ({ src: member.avatar })) || [];

  return (
    <Column as="section" maxWidth="m" horizontal="center" gap="l">
      <Column maxWidth="s" gap="16" horizontal="center" align="center">
        <SmartLink href="/work">
          <Text variant="label-strong-m">Projects</Text>
        </SmartLink>
        <Text variant="body-default-xs" onBackground="neutral-weak" marginBottom="12">
          {project.publishedAt && formatDate(project.publishedAt)}
        </Text>
        <Heading variant="display-strong-m">{project.title}</Heading>
      </Column>
      <Row marginBottom="32" horizontal="center">
        <Row gap="16" vertical="center">
          {project.team && <AvatarGroup reverse avatars={avatars} size="s" />}
          <Text variant="label-default-m" onBackground="brand-weak">
            {project.team?.map((member, idx) => (
              <span key={idx}>
                {idx > 0 && (
                  <Text as="span" onBackground="neutral-weak">
                    ,{" "}
                  </Text>
                )}
                <SmartLink href={member.linkedIn}>{member.name}</SmartLink>
              </span>
            ))}
          </Text>
        </Row>
      </Row>
      {project.images.length > 0 && (
        <Media priority aspectRatio="16 / 9" radius="m" alt="image" src={project.images[0]} />
      )}
      <Column style={{ margin: "auto" }} as="article" maxWidth="xs">
        <CustomMDX source={project.content} />
      </Column>
      <Column fillWidth gap="40" horizontal="center" marginTop="40">
        <Line maxWidth="40" />
        <Heading as="h2" variant="heading-strong-xl" marginBottom="24">
          Related projects
        </Heading>
        <Projects exclude={[project.slug]} range={[2]} initialProjects={initialProjects} />
      </Column>
      <ScrollToHash />
    </Column>
  );
}
