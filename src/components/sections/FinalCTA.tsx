import Atmosphere from "@/components/motion/Atmosphere";
import ScrollReveal from "@/components/motion/ScrollReveal";
import TextReveal from "@/components/motion/TextReveal";
import ContactActions from "@/components/ui/ContactActions";

/** The last beat of the journey: large type in dark water, one strong call to action. */
export default function FinalCTA() {
  return (
    <section id="start" aria-label="Start your aquarium journey" className="relative isolate overflow-hidden py-[clamp(7rem,16vw,15rem)]">
      <div className="absolute inset-0 -z-10 bg-linear-to-b from-abyss via-deep/70 to-trench" />
      <div className="absolute inset-0 -z-10" style={{ background: "radial-gradient(70% 55% at 50% 100%, rgba(0,184,217,0.16), transparent 70%)" }} />
      <Atmosphere particles={18} className="-z-10" />

      <div className="wrap">
        <TextReveal
          as="h2"
          className="max-w-[16ch] text-[clamp(2.6rem,1rem_+_7.4vw,8.25rem)] font-bold leading-[0.95] tracking-[-0.04em] text-balance"
          text="Ready to create your own underwater masterpiece?"
        />
        <ScrollReveal className="mt-10 max-w-xl">
          <p className="t-lede">Start your aquarium journey with a free consultation.</p>
          <ContactActions className="mt-8" />
        </ScrollReveal>
      </div>
    </section>
  );
}
