import Link from "next/link";
import ScrollReveal from "@/components/motion/ScrollReveal";
import TextReveal from "@/components/motion/TextReveal";
import ProjectCard from "@/components/project/ProjectCard";
import { projects } from "@/lib/content";

/** Work: three large cards in an offset editorial layout. */
export default function FeaturedWork() {
  const [a, b, c] = projects;
  if (!a || !b || !c) return null;
  return (
    <section id="work" className="section">
      <div className="wrap">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <TextReveal as="h2" className="t-statement" text="Selected work" />
          <ScrollReveal>
            <Link href="/projects/" className="link-line font-medium">
              View all projects
            </Link>
          </ScrollReveal>
        </div>

        <div className="mt-14 grid gap-6 md:gap-8 lg:grid-cols-12">
          <ScrollReveal className="lg:col-span-12">
            <ProjectCard project={a} aspect="aspect-[4/3] md:aspect-[21/9]" sizes="(min-width: 1440px) 1344px, 92vw" />
          </ScrollReveal>
          <ScrollReveal className="lg:col-span-5">
            <ProjectCard project={b} aspect="aspect-[4/5]" sizes="(min-width: 1024px) 40vw, 92vw" />
          </ScrollReveal>
          <ScrollReveal className="lg:col-span-7 lg:mt-32">
            <ProjectCard project={c} aspect="aspect-[4/3]" sizes="(min-width: 1024px) 56vw, 92vw" />
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
