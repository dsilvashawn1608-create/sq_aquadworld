import Atmosphere from "@/components/motion/Atmosphere";
import ImageReveal from "@/components/motion/ImageReveal";
import ParallaxImage from "@/components/motion/ParallaxImage";
import ScrollReveal from "@/components/motion/ScrollReveal";
import TextReveal from "@/components/motion/TextReveal";
import { img } from "@/lib/content";

const tall = img("angelPortrait");
const macro = img("tetrasMacro");

/** Craft: close-up photography entering at different depths (different parallax speeds), a whisper of atmosphere. */
export default function Craft() {
  return (
    <section id="craft" className="section relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-linear-to-b from-abyss via-trench to-abyss" />
      <Atmosphere caustics={false} particles={10} className="-z-10 opacity-50" />

      <div className="wrap grid items-start gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-6 lg:pt-28">
          <TextReveal as="h2" className="t-statement" text="Stone, wood, plants and light, composed with intent." />
          <ScrollReveal className="mt-10">
            <p className="story">Depth, movement and colour are composed together, the way a landscape is. Look closely and every detail belongs.</p>
          </ScrollReveal>
        </div>

        <div className="grid grid-cols-2 gap-4 md:gap-6 lg:col-span-6">
          <ImageReveal className="mt-16 aspect-[3/4] rounded-[var(--radius-card)]">
            <ParallaxImage image={tall} sizes="(min-width: 1024px) 24vw, 46vw" className="h-full w-full" range={9} objectPosition="55% 40%" />
          </ImageReveal>
          <ImageReveal className="aspect-[3/4] rounded-[var(--radius-card)]" delay={0.15}>
            <ParallaxImage image={macro} sizes="(min-width: 1024px) 24vw, 46vw" className="h-full w-full" range={4} objectPosition="38% 50%" />
          </ImageReveal>
        </div>
      </div>
    </section>
  );
}
