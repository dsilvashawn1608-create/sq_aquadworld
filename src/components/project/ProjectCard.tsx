import Link from "next/link";
import ParallaxImage from "@/components/motion/ParallaxImage";
import { cn } from "@/lib/cn";
import { categoryLabel, img, projectTitle, type Project } from "@/lib/content";

type Props = {
  project: Project;
  sizes: string;
  /** Tailwind aspect-ratio classes for the image frame. */
  aspect?: string;
  className?: string;
  priority?: boolean;
};

/** Large gallery-style project card: big imagery, minimal metadata, slow zoom and a "View" cursor label on hover. */
export default function ProjectCard({ project, sizes, aspect = "aspect-[4/3]", className, priority }: Props) {
  const cover = img(project.cover);
  return (
    <Link href={`/projects/${project.slug}/`} data-cursor="View" className={cn("group relative block", className)}>
      <div className="relative overflow-hidden rounded-[var(--radius-card)] bg-deep">
        <ParallaxImage
          image={cover}
          sizes={sizes}
          priority={priority}
          className={aspect}
          imgClassName="transition-transform duration-[1400ms] ease-expo group-hover:scale-[1.045]"
        />
        <div className="absolute inset-0 bg-linear-to-t from-abyss/85 via-abyss/10 to-transparent transition-opacity duration-700 group-hover:opacity-90" />
        <span className="absolute left-5 top-5 rounded-full border border-white/20 bg-abyss/40 px-3.5 py-1.5 text-sm font-medium backdrop-blur-md">
          {categoryLabel(project.category)}
        </span>
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 md:p-8">
          <h3 className="t-h3 max-w-[20ch] transition-transform duration-700 ease-expo group-hover:-translate-y-1">
            <span className={project.title ? undefined : "ph"}>{projectTitle(project)}</span>
          </h3>
          {project.location ? <span className="hidden shrink-0 text-sm text-foam/75 sm:block">{project.location}</span> : null}
        </div>
      </div>
    </Link>
  );
}
