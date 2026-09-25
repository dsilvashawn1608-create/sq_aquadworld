import imagesData from "@/content/images.json";
import processData from "@/content/process.json";
import projectsData from "@/content/projects.json";
import servicesData from "@/content/services.json";
import { isDraft } from "./site";

/* ---------- Images ---------- */

export type ImageId = keyof typeof imagesData;

export type ImageAsset = {
  id: ImageId;
  src: string;
  width: number;
  height: number;
  alt: string;
};

export function img(id: ImageId): ImageAsset {
  const a = imagesData[id];
  return { id, src: a.file, width: a.width, height: a.height, alt: a.alt };
}

/* ---------- Services ---------- */

export type Service = {
  slug: string;
  name: string;
  summary: string;
  page: boolean;
  image: ImageId | null;
  details: string | null;
};

export const services: Service[] = servicesData.items as unknown as Service[];
export const majorServices = services.filter((s) => s.page);
export const otherServices = services.filter((s) => !s.page);
export const serviceHref = (s: Service) => (s.page ? `/services/${s.slug}/` : `/services/#${s.slug}`);

/* ---------- Process ---------- */

export type ProcessStep = { id: string; title: string; text: string; image: ImageId };
export const processSteps: ProcessStep[] = processData.steps as unknown as ProcessStep[];

/* ---------- Projects ---------- */

export type SpecKey = "size" | "volume" | "style" | "plants" | "fish" | "filtration" | "lighting" | "materials";

export const specLabels: Record<SpecKey, string> = {
  size: "Aquarium size",
  volume: "Tank volume",
  style: "Style",
  plants: "Plants",
  fish: "Fish",
  filtration: "Filtration",
  lighting: "Lighting",
  materials: "Materials",
};

export type StoryKey = "overview" | "brief" | "design" | "build" | "installation" | "result";

export const storyLabels: Record<StoryKey, string> = {
  overview: "Project overview",
  brief: "Client brief",
  design: "Design",
  build: "Build",
  installation: "Installation",
  result: "Final result",
};

export type Project = {
  slug: string;
  confirmed: boolean;
  category: string;
  title: string | null;
  location: string | null;
  year: string | null;
  summary: string | null;
  cover: ImageId;
  gallery: ImageId[];
  story: Record<StoryKey, string | null>;
  specs: Record<SpecKey, string | null>;
};

/** Every project, confirmed or not. Only used for draft-mode review (e.g. the pending checklist). */
export const allProjects: Project[] = projectsData as unknown as Project[];

/**
 * What the public site actually shows: in draft mode, every project (so the design is reviewable);
 * once live, only projects the client has confirmed AND given a real title to. This is the one export
 * every page component should use, so an unconfirmed placeholder project can never reach a real visitor.
 */
export const projects: Project[] = isDraft ? allProjects : allProjects.filter((p) => p.confirmed && Boolean(p.title));

export function projectIndex(slug: string): number {
  return projects.findIndex((p) => p.slug === slug);
}

/**
 * Real title if supplied, otherwise a visible placeholder label. Safe to call in production too: by the time
 * a project reaches `projects` there, it always has a real title, so the bracketed fallback only ever
 * appears in draft mode.
 */
export function projectTitle(p: Project): string {
  if (p.title) return p.title;
  if (!isDraft) return ""; // defensive: should be unreachable once filtered above
  const n = String(projectIndex(p.slug) + 1).padStart(2, "0");
  return `[PROJECT NAME ${n}]`;
}

export const categoryLabel = (c: string) => c.charAt(0).toUpperCase() + c.slice(1);
export const categories = Array.from(new Set(projects.map((p) => p.category)));

/* ---------- Blog (no invented articles: add real posts here) ---------- */

export type Post = {
  slug: string;
  title: string;
  description: string;
  date: string; // ISO date
  image: ImageId | null;
  body: string[]; // paragraphs
};

export const posts: Post[] = [];
