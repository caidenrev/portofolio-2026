"use client";

import { useEffect, useState } from "react";
import { Grid } from "@once-ui-system/core";
import Post from "./Post";
import { getPortfolioPosts } from "@/lib/firebase/portfolio";
import { PortfolioPost } from "@/types";

interface PostsProps {
  range?: [number] | [number, number];
  columns?: "1" | "2" | "3";
  thumbnail?: boolean;
  direction?: "row" | "column";
  exclude?: string[];
  initialPosts?: PortfolioPost[];
}

export function Posts({
  range,
  columns = "1",
  thumbnail = false,
  exclude = [],
  direction,
  initialPosts = [],
}: PostsProps) {
  const [allBlogs, setAllBlogs] = useState<PortfolioPost[]>(initialPosts);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const firestorePosts = await getPortfolioPosts();
        if (firestorePosts.length > 0) {
          setAllBlogs(firestorePosts);
        }
      } catch {
        setAllBlogs(initialPosts);
      }
    };

    void loadPosts();
  }, [initialPosts]);

  // Exclude by slug (exact match)
  const filteredBlogs = exclude.length
    ? allBlogs.filter((post) => !exclude.includes(post.slug))
    : allBlogs;

  const sortedBlogs = [...filteredBlogs].sort((a, b) => {
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });

  const displayedBlogs = range
    ? sortedBlogs.slice(range[0] - 1, range.length === 2 ? range[1] : sortedBlogs.length)
    : sortedBlogs;

  return (
    <>
      {displayedBlogs.length > 0 && (
        <Grid columns={columns} s={{ columns: 1 }} fillWidth marginBottom="40" gap="16">
          {displayedBlogs.map((post) => (
            <Post key={post.slug} post={post} thumbnail={thumbnail} direction={direction} />
          ))}
        </Grid>
      )}
    </>
  );
}
