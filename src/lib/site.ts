import data from "@/content/site.data.json";

export type Testimonial = {
  quote: string;
  name: string;
  context: string | null;
  approved: boolean;
};

export type SiteData = {
  brand: {
    name: string;
    shortName: string;
    founder: string;
    descriptor: string;
    statement: string;
    supporting: string;
    philosophy: string;
  };
  contact: {
    phone: string | null;
    whatsapp: string | null;
    email: string | null;
    address: string | null;
    serviceArea: string | null;
    hours: string | null;
  };
  social: {
    instagram: string | null;
    facebook: string | null;
    youtube: string | null;
  };
  steve: {
    bio: string | null;
    philosophy: string | null;
    credentials: string | null;
  };
  testimonials: Testimonial[];
  faq: { q: string; a: string | null }[];
};

export const site = data as SiteData;

/** Draft mode is the default. It shows visible placeholders, noindexes the site and blocks crawlers. */
export const isDraft = process.env.NEXT_PUBLIC_DRAFT_MODE !== "false";

function getSiteUrl(value: string | undefined): string {
  const candidate = (value || "http://localhost:3000").trim();
  const withProtocol = /^[a-z][a-z\d+.-]*:\/\//i.test(candidate) ? candidate : `https://${candidate}`;

  try {
    const url = new URL(withProtocol);
    return url.toString().replace(/\/+$/, "");
  } catch {
    return "http://localhost:3000";
  }
}

export const siteUrl = getSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);

export const approvedTestimonials = site.testimonials.filter((t) => t.approved);

export function telHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export function waHref(number: string, text = `Hello ${site.brand.name}, I'd like to talk about an aquarium.`): string {
  return `https://wa.me/${number.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;
}

export const ENQUIRE_HREF = "/contact/#enquire";

/** Real links when the client has supplied the numbers, otherwise null (callers decide the fallback). */
export const contactHrefs = {
  call: site.contact.phone ? telHref(site.contact.phone) : null,
  whatsapp: site.contact.whatsapp ? waHref(site.contact.whatsapp) : null,
  email: site.contact.email ? `mailto:${site.contact.email}` : null,
};
