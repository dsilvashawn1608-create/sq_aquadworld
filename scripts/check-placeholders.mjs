#!/usr/bin/env node
/**
 * Reports every piece of client information that is still missing or unconfirmed.
 *
 *   npm run check:placeholders   -> prints the list, never fails (runs before every build)
 *   npm run check:production     -> fails (exit 1) while any REQUIRED item is pending
 *
 * Source of truth: src/content/*.json  (null = not supplied yet)
 */
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const strict = process.argv.includes("--strict");
const readJson = (f) => JSON.parse(readFileSync(path.join(root, "src/content", f), "utf8"));

// Minimal .env loader so `npm run check:production` sees the same values Next.js would.
for (const f of [".env.production.local", ".env.local", ".env.production", ".env"]) {
  const p = path.join(root, f);
  if (!existsSync(p)) continue;
  for (const line of readFileSync(p, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!m || process.env[m[1]] !== undefined) continue;
    process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

const site = readJson("site.data.json");
const projects = readJson("projects.json");
const services = readJson("services.json");
const processData = readJson("process.json");
const images = readJson("images.json");

/** @type {{group:string,label:string,required:boolean}[]} */
const items = [];
const add = (group, label, required = true) => items.push({ group, label, required });
const get = (obj, dotted) => dotted.split(".").reduce((o, k) => (o == null ? o : o[k]), obj);
const empty = (v) => v === null || v === undefined || (typeof v === "string" && v.trim() === "");

// 1. Business details
const siteFields = [
  ["contact.phone", "Business phone number", true],
  ["contact.whatsapp", "WhatsApp number", true],
  ["contact.email", "Business email address", true],
  ["contact.serviceArea", "Service area / cities served", true],
  ["contact.address", "Business location (enables LocalBusiness schema and local pages)", false],
  ["contact.hours", "Opening hours", false],
  ["social.instagram", "Instagram URL", false],
  ["social.facebook", "Facebook URL", false],
  ["social.youtube", "YouTube URL", false],
  ["steve.bio", "Steve's story (bio)", true],
  ["steve.philosophy", "Steve's design philosophy", false],
  ["steve.credentials", "Steve's credentials or experience (only if he wants it shown)", false],
];
for (const [key, label, required] of siteFields) if (empty(get(site, key))) add("Business details", label, required);

// 2. FAQ and testimonials
site.faq.forEach((f) => empty(f.a) && add("FAQ answers", `Answer: "${f.q}"`, false));
if (!site.testimonials.some((t) => t.approved)) add("Trust", "Approved client testimonials (real names, permission given)", false);

// 3. Services and process copy
if (!services.copyConfirmed) add("Services", "Confirm the real service list and descriptions (nine are drafts from the prototype)");
if (!processData.copyConfirmed) add("Process", "Confirm the five process descriptions match how Steve actually works");

// 4. Projects
projects.forEach((p, i) => {
  const n = String(i + 1).padStart(2, "0");
  const g = `Project ${n} (${p.slug})`;
  if (!p.confirmed) add(g, "Client has confirmed this is real, approved project content");
  if (empty(p.title)) add(g, "Project name");
  if (empty(p.summary)) add(g, "One-line summary");
  if (empty(p.location)) add(g, "Location (only if it may be shown publicly)", false);
  const storyEmpty = Object.entries(p.story).filter(([, v]) => empty(v)).map(([k]) => k);
  if (storyEmpty.length) add(g, `Case-study text not supplied: ${storyEmpty.join(", ")}`, false);
  const specEmpty = Object.entries(p.specs).filter(([, v]) => empty(v)).map(([k]) => k);
  if (specEmpty.length) add(g, `Specs not supplied: ${specEmpty.join(", ")}`, false);
});

// 5. Photos
for (const [id, img] of Object.entries(images)) {
  if (!img.ownershipConfirmed) add("Photos", `Confirm ownership / permission to publish: ${id} (${img.file})`);
}

// 6. Environment (production only)
const envReport = [];
if (strict) {
  const url = process.env.NEXT_PUBLIC_SITE_URL;
  if (!url || /localhost|example\.com/.test(url)) envReport.push("NEXT_PUBLIC_SITE_URL must be the real public URL");
  if (process.env.NEXT_PUBLIC_DRAFT_MODE !== "false") envReport.push('NEXT_PUBLIC_DRAFT_MODE must be "false" for production');
  for (const k of ["RESEND_API_KEY", "ENQUIRY_TO_EMAIL", "ENQUIRY_FROM_EMAIL"]) {
    if (!process.env[k]) envReport.push(`${k} is not set (the enquiry form cannot send without it)`);
  }
}

const required = items.filter((i) => i.required);
const optional = items.filter((i) => !i.required);

const groups = [...new Set(items.map((i) => i.group))];
console.log("\nSteve Fernandes Aqua World: client data checklist");
console.log("=".repeat(52));
for (const g of groups) {
  console.log(`\n${g}`);
  for (const i of items.filter((x) => x.group === g)) console.log(`  ${i.required ? "[required]" : "[optional]"} ${i.label}`);
}
if (envReport.length) {
  console.log("\nEnvironment");
  envReport.forEach((e) => console.log(`  [required] ${e}`));
}
console.log(`\n${required.length} required and ${optional.length} optional items pending${envReport.length ? `, ${envReport.length} environment issue(s)` : ""}.`);

if (strict && (required.length || envReport.length)) {
  console.error("\nNot ready for production. Resolve every [required] item above (edit src/content/*.json) and try again.\n");
  process.exit(1);
}
if (!strict && required.length) {
  console.log("Draft build: placeholders will be visible and the site is set to noindex. Run `npm run check:production` before deploying.\n");
}
