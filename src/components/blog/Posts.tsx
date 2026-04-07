"use client";

import { useEffect, useState } from "react";
import { Grid } from "@once-ui-system/core";
import Post from "./Post";
import { subscribeToPortfolioPosts } from "@/lib/firebase/portfolio";
import type { PortfolioPost } from "@/types";

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
    try {
      const unsubscribe = subscribeToPortfolioPosts((firestorePosts) => {
        if (firestorePosts.length > 0) {
          setAllBlogs(firestorePosts);
          return;
        }

        setAllBlogs(initialPosts);
      });

      return unsubscribe;
    } catch {
      setAllBlogs(initialPosts);
      return () => undefined;
    }
  }, [initialPosts]);

  // Exclude by slug (exact match)
  const visibleBlogs = allBlogs.filter((post) => post.status !== "draft");

  const filteredBlogs = exclude.length
    ? visibleBlogs.filter((post) => !exclude.includes(post.slug))
    : visibleBlogs;

  const sortedBlogs = [...filteredBlogs].sort((a, b) => {
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });

  const displayedBlogs = range
    ? sortedBlogs.slice(range[0] - 1, range.length === 2 ? range[1] : sortedBlogs.length)
    : sortedBlogs;

  if (displayedBlogs.length === 0) {
    return null;
  }

  return (
    <Grid columns={columns} s={{ columns: 1 }} fillWidth marginBottom="40" gap="16">
      {displayedBlogs.map((post) => (
        <Post key={post.slug} post={post} thumbnail={thumbnail} direction={direction} />
      ))}
    </Grid>
  );
}
