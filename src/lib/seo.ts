import type { Metadata } from "next";
import { isDraft, site } from "./site";

type PageMeta = {
  title: string;
  description: string;
  /** Path with leading and trailing slash, e.g. "/projects/". */
  path: string;
  noindex?: boolean;
  /** Skip the "%s | Steve Fernandes Aqua World" template (home page). */
  absolute?: boolean;
};

const OG_IMAGE = { url: "/images/og-default.jpg", width: 1200, height: 632 };

/**
 * Consistent metadata for every route: canonical, Open Graph, Twitter, and draft-mode noindex.
 * The Open Graph image is a JPEG (WebP previews are unreliable on social platforms). Per-project JPEGs can be added later.
 */
export function pageMetadata({ title, description, path, noindex, absolute }: PageMeta): Metadata {
  return {
    title: absolute ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName: site.brand.name,
      type: "website",
      locale: "en",
      images: [{ ...OG_IMAGE, alt: site.brand.name }],
    },
    twitter: { card: "summary_large_image", title, description, images: [OG_IMAGE.url] },
    robots: isDraft || noindex ? { index: false, follow: false } : { index: true, follow: true },
  };
}
