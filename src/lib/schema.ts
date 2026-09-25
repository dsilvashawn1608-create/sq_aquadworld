import { services, type Project, type Service, projectTitle, img } from "./content";
import { site, siteUrl } from "./site";

const abs = (path: string) => `${siteUrl}${path}`;

/** Only real, client-supplied facts go into structured data. No ratings, no price range, no invented locations. */
export function organizationSchema() {
  const sameAs = Object.values(site.social).filter((v): v is string => Boolean(v));
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.brand.name,
    alternateName: site.brand.shortName,
    url: siteUrl,
    slogan: site.brand.statement,
    founder: { "@type": "Person", name: site.brand.founder },
    ...(site.contact.phone ? { telephone: site.contact.phone } : {}),
    ...(site.contact.email ? { email: site.contact.email } : {}),
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.brand.name,
    alternateName: site.brand.shortName,
    url: siteUrl,
  };
}

/** Returns null until a real address, service area and phone number exist. */
export function localBusinessSchema() {
  const { address, serviceArea, phone } = site.contact;
  if (!address || !phone) return null;
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: site.brand.name,
    url: siteUrl,
    image: abs("/images/og-default.jpg"),
    telephone: phone,
    address: { "@type": "PostalAddress", streetAddress: address },
    ...(serviceArea ? { areaServed: serviceArea } : {}),
    ...(site.contact.hours ? { openingHours: site.contact.hours } : {}),
  };
}

export function serviceSchema(s: Service) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: s.name,
    description: s.summary,
    url: abs(`/services/${s.slug}/`),
    provider: { "@type": "Organization", name: site.brand.name, url: siteUrl },
    ...(site.contact.serviceArea ? { areaServed: site.contact.serviceArea } : {}),
  };
}

export function projectSchema(p: Project) {
  if (!p.title) return null; // never publish placeholder names in structured data
  const cover = img(p.cover);
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: projectTitle(p),
    url: abs(`/projects/${p.slug}/`),
    image: abs(cover.src),
    ...(p.summary ? { description: p.summary } : {}),
    creator: { "@type": "Organization", name: site.brand.name },
  };
}

export function breadcrumbSchema(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      item: abs(t.path),
    })),
  };
}

export const serviceNames = services.map((s) => s.name);
