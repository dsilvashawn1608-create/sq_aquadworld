import type { MetadataRoute } from "next";
import { majorServices, posts, projects } from "@/lib/content";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes = ["/", "/about/", "/services/", "/projects/", "/gallery/", "/contact/", ...(posts.length ? ["/blog/"] : [])];

  return [
    ...staticRoutes.map((path) => ({ url: `${siteUrl}${path}`, lastModified: now, changeFrequency: "monthly" as const, priority: path === "/" ? 1 : 0.8 })),
    ...majorServices.map((s) => ({ url: `${siteUrl}/services/${s.slug}/`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.8 })),
    ...projects.map((p) => ({ url: `${siteUrl}/projects/${p.slug}/`, lastModified: now, changeFrequency: "yearly" as const, priority: 0.7 })),
    ...posts.map((p) => ({ url: `${siteUrl}/blog/${p.slug}/`, lastModified: new Date(p.date), changeFrequency: "yearly" as const, priority: 0.6 })),
  ];
}
