import { getPosts } from "@/utils/utils";
import { baseURL, routes as routesConfig } from "@/resources";
import { getPublicPortfolioPosts, getPublicPortfolioProjects } from "@/lib/firestore-rest";

export default async function sitemap() {
  const localBlogs = getPosts(["src", "app", "blog", "posts"]).map((post) => ({
    url: `${baseURL}/blog/${post.slug}`,
    lastModified: post.metadata.publishedAt,
  }));

  const localWorks = getPosts(["src", "app", "work", "projects"]).map((post) => ({
    url: `${baseURL}/work/${post.slug}`,
    lastModified: post.metadata.publishedAt,
  }));

  const [firestoreBlogs, firestoreWorks] = await Promise.all([
    getPublicPortfolioPosts(),
    getPublicPortfolioProjects(),
  ]);

  const blogs =
    firestoreBlogs.length > 0
      ? firestoreBlogs.map((post) => ({
          url: `${baseURL}/blog/${post.slug}`,
          lastModified: post.publishedAt,
        }))
      : localBlogs;

  const works =
    firestoreWorks.length > 0
      ? firestoreWorks.map((post) => ({
          url: `${baseURL}/work/${post.slug}`,
          lastModified: post.publishedAt,
        }))
      : localWorks;

  const activeRoutes = Object.keys(routesConfig).filter(
    (route) => routesConfig[route as keyof typeof routesConfig],
  );

  const routes = activeRoutes.map((route) => ({
    url: `${baseURL}${route !== "/" ? route : ""}`,
    lastModified: new Date().toISOString().split("T")[0],
  }));

  return [...routes, ...blogs, ...works];
}
