import imagesData from "@/content/images.json";
import processData from "@/content/process.json";
import projectsData from "@/content/projects.json";
import servicesData from "@/content/services.json";
import { site } from "./site";

export type PendingItem = { group: string; label: string; required: boolean };

const empty = (v: unknown) => v === null || v === undefined || (typeof v === "string" && v.trim() === "");

/** Mirrors scripts/check-placeholders.mjs so /pending/ and the CLI report the same thing. */
export function collectPending(): PendingItem[] {
  const items: PendingItem[] = [];
  const add = (group: string, label: string, required = true) => items.push({ group, label, required });

  const c = site.contact;
  if (empty(c.phone)) add("Business details", "Business phone number");
  if (empty(c.whatsapp)) add("Business details", "WhatsApp number");
  if (empty(c.email)) add("Business details", "Business email address");
  if (empty(c.serviceArea)) add("Business details", "Service area / cities served");
  if (empty(c.address)) add("Business details", "Business location (enables LocalBusiness schema and local pages)", false);
  if (empty(c.hours)) add("Business details", "Opening hours", false);
  if (empty(site.social.instagram)) add("Business details", "Instagram URL", false);
  if (empty(site.social.facebook)) add("Business details", "Facebook URL", false);
  if (empty(site.social.youtube)) add("Business details", "YouTube URL", false);
  if (empty(site.steve.bio)) add("Business details", "Steve's story (bio)");
  if (empty(site.steve.philosophy)) add("Business details", "Steve's design philosophy", false);
  if (empty(site.steve.credentials)) add("Business details", "Steve's credentials or experience (only if he wants it shown)", false);

  site.faq.forEach((f) => empty(f.a) && add("FAQ answers", `Answer: "${f.q}"`, false));
  if (!site.testimonials.some((t) => t.approved)) add("Trust", "Approved client testimonials (real names, permission given)", false);

  if (!servicesData.copyConfirmed) add("Services", "Confirm the real service list and descriptions (nine are drafts from the prototype)");
  if (!processData.copyConfirmed) add("Process", "Confirm the five process descriptions match how Steve actually works");

  projectsData.forEach((p, i) => {
    const g = `Project ${String(i + 1).padStart(2, "0")} (${p.slug})`;
    if (!p.confirmed) add(g, "Client has confirmed this is real, approved project content");
    if (empty(p.title)) add(g, "Project name");
    if (empty(p.summary)) add(g, "One-line summary");
    if (empty(p.location)) add(g, "Location (only if it may be shown publicly)", false);
    const story = Object.entries(p.story).filter(([, v]) => empty(v)).map(([k]) => k);
    if (story.length) add(g, `Case-study text not supplied: ${story.join(", ")}`, false);
    const specs = Object.entries(p.specs).filter(([, v]) => empty(v)).map(([k]) => k);
    if (specs.length) add(g, `Specs not supplied: ${specs.join(", ")}`, false);
  });

  Object.entries(imagesData).forEach(([id, im]) => {
    if (!im.ownershipConfirmed) add("Photos", `Confirm ownership / permission to publish: ${id} (${im.file})`);
  });

  return items;
}
