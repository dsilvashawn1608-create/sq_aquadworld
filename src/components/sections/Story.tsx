import Link from "next/link";
import ParallaxImage from "@/components/motion/ParallaxImage";
import ScaleOnScroll from "@/components/motion/ScaleOnScroll";
import ScrollReveal from "@/components/motion/ScrollReveal";
import TextReveal from "@/components/motion/TextReveal";
import { img } from "@/lib/content";
import { site } from "@/lib/site";

const frame = img("plantedWide");

/** Introduction → Story. The frame opens up as it arrives, mirroring the hero narrowing away above it. */
export default function Story() {
  return (
    <section id="story" className="section pb-0">
      <div className="wrap grid gap-10 lg:grid-cols-12 lg:gap-x-12">
        <div className="lg:col-span-8">
          <TextReveal as="h2" className="t-statement" text="Not a fish tank. A living work of art." />
        </div>

        <ScrollReveal items className="lg:col-span-4 lg:col-start-9 lg:mt-3">
          <p data-reveal-item="" className="story">
            {site.brand.name} is a {site.brand.descriptor.toLowerCase()}. Each aquarium is approached as design and craftsmanship: a living environment composed for the space it belongs to.
          </p>
          <p data-reveal-item="" className="mt-8">
            <Link href="/about/" className="link-line font-medium">
              Read the story
            </Link>
          </p>
        </ScrollReveal>
      </div>

      <div className="wrap mt-16 md:mt-24">
        <ScaleOnScroll from={0.86} radiusFrom={44} radiusTo={28} className="rounded-[28px]">
          <ParallaxImage image={frame} sizes="(min-width: 1440px) 1344px, 92vw" className="aspect-[4/3] md:aspect-[21/9]" range={6} />
        </ScaleOnScroll>
      </div>
    </section>
  );
}
