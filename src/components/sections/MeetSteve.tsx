import Link from "next/link";
import ImageReveal from "@/components/motion/ImageReveal";
import ParallaxImage from "@/components/motion/ParallaxImage";
import ScrollReveal from "@/components/motion/ScrollReveal";
import TextReveal from "@/components/motion/TextReveal";
import { Ph } from "@/components/ui/Ph";
import { img } from "@/lib/content";
import { ENQUIRE_HREF, site } from "@/lib/site";

const portrait = img("stevePortrait");

/**
 * Meet Steve Fernandes. Business first, Steve second: a real portrait and short, readable storytelling.
 * Only the founder's name and the approved brand language are written here; his story and philosophy come from
 * site.data.json and show as visible placeholders until he supplies them.
 */
export default function MeetSteve({ headingLevel = "h2", showLink = true }: { headingLevel?: "h1" | "h2"; showLink?: boolean }) {
  return (
    <section id="steve" className="section">
      <div className="wrap grid items-center gap-14 lg:grid-cols-12 lg:gap-20">
        <div className="lg:col-span-5">
          <ImageReveal className="aspect-[4/5] rounded-[var(--radius-card)]">
            <ParallaxImage image={portrait} sizes="(min-width: 1024px) 40vw, 92vw" className="h-full w-full" range={4} objectPosition="50% 28%" />
            <div className="absolute inset-0 bg-linear-to-t from-abyss/55 via-transparent to-ocean/20" />
          </ImageReveal>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <TextReveal as={headingLevel} className="t-h2" text={`Meet ${site.brand.founder}`} />
          <ScrollReveal items className="mt-8">
            <p data-reveal-item="" className="font-serif text-[clamp(1.4rem,1.1rem_+_1vw,2rem)] italic leading-snug text-glow">
              {site.brand.philosophy}
            </p>
            <p data-reveal-item="" className="story mt-6">
              {site.brand.founder} is the founder of {site.brand.name}, a {site.brand.descriptor.toLowerCase()}.
            </p>
            <p data-reveal-item="" className="story">
              {site.steve.bio ?? <Ph label="STEVE'S STORY: a short bio in his own words" />}
            </p>
            <p data-reveal-item="" className="story">
              {site.steve.philosophy ?? <Ph label="STEVE'S DESIGN PHILOSOPHY" />}
            </p>
            {showLink ? (
              <p data-reveal-item="" className="mt-10">
                <Link href={ENQUIRE_HREF} className="link-line font-medium">
                  Work with Steve
                </Link>
              </p>
            ) : null}
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
