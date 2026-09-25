import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "@/components/motion/ScrollReveal";
import TextReveal from "@/components/motion/TextReveal";
import { img, majorServices, otherServices, serviceHref } from "@/lib/content";

/**
 * Services as editorial sections, not icon cards: three major services as large image cards with their own pages,
 * followed by the rest as a quiet typographic list. Service names and copy are drafts until confirmed (see /pending/).
 */
export default function ServicesEditorial({ headingLevel = "h2", showHeading = true }: { headingLevel?: "h1" | "h2"; showHeading?: boolean }) {
  return (
    <section id="services" className="section">
      <div className="wrap">
        {showHeading ? (
          <div className="grid gap-8 lg:grid-cols-12">
            <TextReveal as={headingLevel} className="t-statement lg:col-span-7" text="Services" />
            <ScrollReveal className="lg:col-span-4 lg:col-start-9 lg:self-end">
              <p className="t-lede">From the first idea to everyday care.</p>
            </ScrollReveal>
          </div>
        ) : null}

        <ul className={showHeading ? "mt-16 grid gap-6 md:grid-cols-3 md:gap-8" : "grid gap-6 md:grid-cols-3 md:gap-8"}>
          {majorServices.map((s, i) => {
            const image = s.image ? img(s.image) : null;
            return (
              <li key={s.slug} className={i === 1 ? "md:mt-16" : i === 2 ? "md:mt-32" : undefined}>
                <ScrollReveal>
                  <Link href={serviceHref(s)} className="group block">
                    <div className="relative aspect-[3/4] overflow-hidden rounded-[var(--radius-card)] bg-deep">
                      {image ? (
                        <Image
                          src={image.src}
                          alt=""
                          fill
                          sizes="(min-width: 768px) 30vw, 92vw"
                          className="object-cover transition-transform duration-[1400ms] ease-expo group-hover:scale-[1.05]"
                        />
                      ) : null}
                      <div className="absolute inset-0 bg-linear-to-t from-abyss/90 via-abyss/15 to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 p-6 md:p-7">
                        <h3 className="t-h3">{s.name}</h3>
                        <p className="mt-3 max-w-[32ch] text-[0.98rem] text-foam/75">{s.summary}</p>
                      </div>
                    </div>
                  </Link>
                </ScrollReveal>
              </li>
            );
          })}
        </ul>

        <ul className="mt-24 border-t border-white/12">
          {otherServices.map((s) => (
            <li key={s.slug} id={s.slug} className="border-b border-white/12">
              <Link href={serviceHref(s)} className="group grid gap-3 py-7 transition-colors duration-500 hover:bg-white/[0.025] md:grid-cols-12 md:items-baseline md:gap-8 md:px-4">
                <h3 className="t-h3 transition-[transform,color] duration-700 ease-expo group-hover:translate-x-2 group-hover:text-glow md:col-span-5">{s.name}</h3>
                <p className="text-foam/70 md:col-span-6 md:col-start-7">{s.summary}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
