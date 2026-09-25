import type { Metadata } from "next";
import Link from "next/link";
import ScrollReveal from "@/components/motion/ScrollReveal";
import FinalCTA from "@/components/sections/FinalCTA";
import PageHeader from "@/components/ui/PageHeader";
import { Ph } from "@/components/ui/Ph";
import { posts } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Journal",
  description: `Aquarium design, aquascaping and care notes from ${site.brand.name}.`,
  path: "/blog/",
  noindex: posts.length === 0, // an empty journal should not be indexed
});

export default function BlogPage() {
  return (
    <>
      <PageHeader
        title="Journal"
        lede="Notes on design, aquascaping and caring for a living aquarium."
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Journal", href: "/blog/" },
        ]}
      />
      <section className="pb-[clamp(6rem,12vw,11rem)]">
        <div className="wrap">
          {posts.length === 0 ? (
            <p className="story">
              <Ph label="JOURNAL ARTICLES: none published yet. Add real articles in src/lib/content.ts" />
            </p>
          ) : (
            <ul className="border-t border-white/12">
              {posts.map((p) => (
                <li key={p.slug} className="border-b border-white/12">
                  <ScrollReveal>
                    <Link href={`/blog/${p.slug}/`} className="group grid gap-3 py-8 md:grid-cols-12 md:gap-8">
                      <time dateTime={p.date} className="text-foam/55 md:col-span-2">
                        {new Date(p.date).toLocaleDateString("en", { year: "numeric", month: "long", day: "numeric" })}
                      </time>
                      <h2 className="t-h3 transition-colors duration-500 group-hover:text-glow md:col-span-6">{p.title}</h2>
                      <p className="text-foam/70 md:col-span-4">{p.description}</p>
                    </Link>
                  </ScrollReveal>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
      <FinalCTA />
    </>
  );
}
