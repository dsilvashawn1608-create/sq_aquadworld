import Link from "next/link";
import Atmosphere from "@/components/motion/Atmosphere";
import ScrollReveal from "@/components/motion/ScrollReveal";
import TextReveal from "@/components/motion/TextReveal";

type Crumb = { name: string; href: string };

/** Opening block for inner pages: breadcrumb, large h1, optional lede, faint light rays. */
export default function PageHeader({ title, lede, crumbs }: { title: string; lede?: string; crumbs?: Crumb[] }) {
  return (
    <header className="relative isolate overflow-hidden pb-16 pt-40 md:pb-24 md:pt-52">
      <div className="absolute inset-0 -z-10 bg-linear-to-b from-deep/60 via-trench/40 to-transparent" />
      <Atmosphere caustics={false} className="-z-10 opacity-60" />
      <div className="wrap">
        {crumbs && crumbs.length > 0 ? (
          <nav aria-label="Breadcrumb" className="mb-8 text-sm text-foam/60">
            <ol className="flex flex-wrap items-center gap-2">
              {crumbs.map((c, i) => (
                <li key={c.href} className="flex items-center gap-2">
                  {i > 0 ? <span aria-hidden="true">/</span> : null}
                  {i === crumbs.length - 1 ? (
                    <span aria-current="page" className="text-foam/85">
                      {c.name}
                    </span>
                  ) : (
                    <Link href={c.href} className="link-line">
                      {c.name}
                    </Link>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        ) : null}
        <TextReveal as="h1" trigger="load" delay={0.5} className="t-statement max-w-[18ch]" text={title} />
        {lede ? (
          <ScrollReveal className="mt-8" delay={0.6}>
            <p className="t-lede">{lede}</p>
          </ScrollReveal>
        ) : null}
      </div>
    </header>
  );
}
