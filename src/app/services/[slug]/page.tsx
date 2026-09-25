import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import ParallaxImage from "@/components/motion/ParallaxImage";
import ScrollReveal from "@/components/motion/ScrollReveal";
import TextReveal from "@/components/motion/TextReveal";
import ProjectCard from "@/components/project/ProjectCard";
import FinalCTA from "@/components/sections/FinalCTA";
import JsonLd from "@/components/seo/JsonLd";
import PageHeader from "@/components/ui/PageHeader";
import { Ph } from "@/components/ui/Ph";
import { img, majorServices, projects } from "@/lib/content";
import { breadcrumbSchema, serviceSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return majorServices.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = majorServices.find((s) => s.slug === slug);
  if (!service) return {};
  return pageMetadata({ title: service.name, description: service.summary, path: `/services/${service.slug}/` });
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = majorServices.find((s) => s.slug === slug);
  if (!service) notFound();

  const image = service.image ? img(service.image) : null;
  const related = projects.slice(0, 2);

  return (
    <>
      <JsonLd data={serviceSchema(service)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Services", path: "/services/" },
          { name: service.name, path: `/services/${service.slug}/` },
        ])}
      />
      <PageHeader
        title={service.name}
        lede={service.summary}
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Services", href: "/services/" },
          { name: service.name, href: `/services/${service.slug}/` },
        ]}
      />

      {image ? (
        <div className="wrap">
          <ParallaxImage image={image} sizes="(min-width: 1440px) 1344px, 92vw" className="aspect-[4/3] rounded-[var(--radius-card)] md:aspect-[21/9]" range={6} />
        </div>
      ) : null}

      <section className="section">
        <div className="wrap grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <TextReveal as="h2" className="t-h3" text="What this involves" />
          </div>
          <ScrollReveal className="lg:col-span-7 lg:col-start-6">
            <p className="story">{service.details ?? <Ph label="SERVICE DETAILS: what is included and how it works" />}</p>
            <p className="mt-10">
              <Link href="/#process" className="link-line font-medium">
                See how a project unfolds
              </Link>
            </p>
          </ScrollReveal>
        </div>
      </section>

      {related.length > 0 ? (
        <section className="pb-[clamp(5rem,10vw,9rem)]">
          <div className="wrap">
            <TextReveal as="h2" className="t-h2" text="Recent work" />
            <div className="mt-12 grid gap-6 md:grid-cols-2 md:gap-8">
              {related.map((p) => (
                <ProjectCard key={p.slug} project={p} aspect="aspect-[4/3]" sizes="(min-width: 768px) 46vw, 92vw" />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <FinalCTA />
    </>
  );
}
