"use client";

import { useState } from "react";
import ScrollReveal from "@/components/motion/ScrollReveal";
import { cn } from "@/lib/cn";
import { categoryLabel, type Project } from "@/lib/content";
import ProjectCard from "./ProjectCard";

const pattern = [
  { span: "lg:col-span-12", aspect: "aspect-[4/3] md:aspect-[21/9]", sizes: "(min-width: 1440px) 1344px, 92vw" },
  { span: "lg:col-span-5", aspect: "aspect-[4/5]", sizes: "(min-width: 1024px) 40vw, 92vw" },
  { span: "lg:col-span-7 lg:mt-24", aspect: "aspect-[4/3]", sizes: "(min-width: 1024px) 56vw, 92vw" },
];

/** Portfolio grid. The filter bar appears only once more than one category exists (currently "Home"). */
export default function ProjectsGrid({ projects, categories }: { projects: Project[]; categories: string[] }) {
  const [filter, setFilter] = useState<string>("all");
  const visible = filter === "all" ? projects : projects.filter((p) => p.category === filter);

  return (
    <div>
      {categories.length > 1 ? (
        <div role="group" aria-label="Filter projects" className="mb-12 flex flex-wrap gap-2">
          {["all", ...categories].map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={filter === c}
              onClick={() => setFilter(c)}
              className={cn(
                "rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors duration-300",
                filter === c ? "border-transparent bg-foam text-abyss" : "border-white/20 text-foam/80 hover:border-glow hover:text-glow"
              )}
            >
              {c === "all" ? "All" : categoryLabel(c)}
            </button>
          ))}
        </div>
      ) : null}

      {visible.length > 0 ? (
        <div className="grid gap-6 md:gap-8 lg:grid-cols-12">
          {visible.map((p, i) => {
            const slot = pattern[i % pattern.length];
            return (
              <ScrollReveal key={`${filter}-${p.slug}`} className={slot.span}>
                <ProjectCard project={p} aspect={slot.aspect} sizes={slot.sizes} />
              </ScrollReveal>
            );
          })}
        </div>
      ) : (
        <p className="story">New work is on the way. In the meantime, get in touch and let's talk about your space.</p>
      )}
    </div>
  );
}
