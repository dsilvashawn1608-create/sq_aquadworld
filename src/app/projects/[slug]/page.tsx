import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ParallaxImage from "@/components/motion/ParallaxImage";
import ScrollReveal from "@/components/motion/ScrollReveal";
import TextReveal from "@/components/motion/TextReveal";
import GalleryGrid, { type GalleryItem } from "@/components/project/GalleryGrid";
import ProjectCard from "@/components/project/ProjectCard";
import ProjectHero from "@/components/project/ProjectHero";
import FinalCTA from "@/components/sections/FinalCTA";
import JsonLd from "@/components/seo/JsonLd";
import { Ph } from "@/components/ui/Ph";
import {
  img,
  projectIndex,
  projects,
  projectTitle,
  specLabels,
  storyLabels,
  type SpecKey,
  type StoryKey,
} from "@/lib/content";
import { breadcrumbSchema, projectSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { isDraft, site } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  const title = project.title ?? `Project ${String(projectIndex(slug) + 1).padStart(2, "0")}`;
  return pageMetadata({
    title,
    description: project.summary ?? `An aquarium project by ${site.brand.name}.`,
    path: `/projects/${project.slug}/`,
  });
}

const narrative: StoryKey[] = ["brief", "design", "build", "installation"];

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const index = projectIndex(slug);
  if (index === -1) notFound();

  const project = projects[index];
  const next = projects[(index + 1) % projects.length];
  const title = projectTitle(project);
  const crumbName = project.title ?? `Project ${String(index + 1).padStart(2, "0")}`;
  const cover = img(project.cover);
  const gallery = project.gallery.map((id) => img(id));
  const band = gallery.find((g) => g.id !== project.cover) ?? null;
  const specs = (Object.keys(specLabels) as SpecKey[]).filter((k) => project.specs[k] || isDraft);

  const galleryItems: GalleryItem[] = gallery.map((image, i) => ({
    image,
    span: i === 0 && gallery.length % 2 === 1 ? "md:col-span-12" : "md:col-span-6",
    aspect: i === 0 && gallery.length % 2 === 1 ? "aspect-[4/3] md:aspect-[21/9]" : "aspect-[4/3]",
    sizes: "(min-width: 768px) 46vw, 92vw",
  }));

  return (
    <>
      <JsonLd data={projectSchema(project)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Portfolio", path: "/projects/" },
          { name: crumbName, path: `/projects/${project.slug}/` },
        ])}
      />

      <ProjectHero image={cover} title={title} titleIsPlaceholder={!project.title} category={project.category} location={project.location} year={project.year} />

      {/* Overview + specification */}
      <section className="section">
        <div className="wrap grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <TextReveal as="h2" className="t-h2" text="Project overview" />
            <ScrollReveal className="mt-8">
              <p className="story">{project.story.overview ?? project.summary ?? <Ph label="PROJECT OVERVIEW: what this aquarium is and why it matters" />}</p>
            </ScrollReveal>
          </div>

          {specs.length > 0 ? (
            <ScrollReveal className="lg:col-span-4 lg:col-start-9">
              <dl className="divide-y divide-white/12 border-y border-white/12">
                {specs.map((k) => (
                  <div key={k} className="grid grid-cols-[8.5rem_1fr] gap-4 py-4">
                    <dt className="text-sm text-foam/55">{specLabels[k]}</dt>
                    <dd>{project.specs[k] ?? <Ph label={specLabels[k].toUpperCase()} />}</dd>
                  </div>
                ))}
              </dl>
            </ScrollReveal>
          ) : null}
        </div>
      </section>

      {/* Brief, design, build, installation */}
      <section className="pb-[clamp(4rem,8vw,7rem)]">
        <div className="wrap">
          {narrative
            .filter((k) => project.story[k] || isDraft)
            .map((k) => (
              <div key={k} className="grid gap-6 border-t border-white/12 py-14 lg:grid-cols-12 lg:gap-10 lg:py-20">
                <TextReveal as="h2" className="t-h3 lg:col-span-4" text={storyLabels[k]} />
                <ScrollReveal className="lg:col-span-7 lg:col-start-6">
                  <p className="story">{project.story[k] ?? <Ph label={`${storyLabels[k].toUpperCase()}: to be written with client input`} />}</p>
                </ScrollReveal>
              </div>
            ))}
        </div>
      </section>

      {/* Final result */}
      {(project.story.result || isDraft || band) && (
        <section className="pb-[clamp(5rem,10vw,9rem)]">
          <div className="wrap">
            {band ? <ParallaxImage image={band} sizes="(min-width: 1440px) 1344px, 92vw" className="aspect-[4/3] rounded-[var(--radius-card)] md:aspect-[21/9]" range={7} /> : null}
            <div className={`grid gap-6 border-t border-white/12 pt-14 lg:grid-cols-12 lg:gap-10 lg:pt-20${band ? " mt-16" : ""}`}>
              <TextReveal as="h2" className="t-h3 lg:col-span-4" text={storyLabels.result} />
              <ScrollReveal className="lg:col-span-7 lg:col-start-6">
                <p className="story">{project.story.result ?? <Ph label="FINAL RESULT: how the finished aquarium looks and feels" />}</p>
              </ScrollReveal>
            </div>
          </div>
        </section>
      )}

      {/* Gallery */}
      {gallery.length > 1 ? (
        <section className="pb-[clamp(5rem,10vw,9rem)]">
          <div className="wrap">
            <TextReveal as="h2" className="t-h2" text="Gallery" />
            <GalleryGrid items={galleryItems} className="mt-12" />
          </div>
        </section>
      ) : isDraft ? (
        <section className="pb-24">
          <div className="wrap">
            <p className="story">
              <Ph label="ADDITIONAL PROJECT PHOTOS: build stages, details, before and after if available" />
            </p>
          </div>
        </section>
      ) : null}

      {/* Next project */}
      {projects.length > 1 ? (
        <section className="pb-[clamp(5rem,10vw,9rem)]">
          <div className="wrap">
            <div className="mb-10 flex items-end justify-between">
              <h2 className="t-h3">Next project</h2>
              <Link href="/projects/" className="link-line font-medium">
                All projects
              </Link>
            </div>
            <ProjectCard project={next} aspect="aspect-[4/3] md:aspect-[21/9]" sizes="(min-width: 1440px) 1344px, 92vw" />
          </div>
        </section>
      ) : null}

      <FinalCTA />
    </>
  );
}
