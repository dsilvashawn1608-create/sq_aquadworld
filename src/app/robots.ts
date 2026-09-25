import type { MetadataRoute } from "next";
import { isDraft, siteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  // Draft mode blocks every crawler so an unfinished site can never be indexed.
  if (isDraft) return { rules: [{ userAgent: "*", disallow: "/" }] };
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/pending/"] }],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
