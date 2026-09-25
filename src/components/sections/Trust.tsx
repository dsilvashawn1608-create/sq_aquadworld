import ScrollReveal from "@/components/motion/ScrollReveal";
import TextReveal from "@/components/motion/TextReveal";
import { Ph } from "@/components/ui/Ph";
import { approvedTestimonials, isDraft, site } from "@/lib/site";
import FaqItem from "./FaqItem";

/**
 * Trust: real, approved testimonials (never the prototype's invented ones) and the FAQ.
 * FAQ answers come only from site.data.json; an unanswered question shows a placeholder in draft mode
 * and is hidden entirely in production.
 */
export default function Trust() {
  const faqs = site.faq.filter((f) => f.a || isDraft);
  const hasReviews = approvedTestimonials.length > 0;
  if (!hasReviews && !isDraft && faqs.length === 0) return null;

  return (
    <section id={hasReviews ? "reviews" : "trust"} className="section">
      <div className="wrap">
        {hasReviews || isDraft ? (
          <div>
            <TextReveal as="h2" className="t-statement" text="In their words" />
            <div className="mt-14 grid gap-12 md:grid-cols-2 lg:gap-20">
              {hasReviews ? (
                approvedTestimonials.slice(0, 2).map((t) => (
                  <ScrollReveal key={t.name} as="figure">
                    <blockquote className="story text-[clamp(1.3rem,1.1rem_+_0.9vw,1.9rem)] italic leading-snug text-foam">“{t.quote}”</blockquote>
                    <figcaption className="mt-6 text-foam/70">
                      {t.name}
                      {t.context ? `, ${t.context}` : ""}
                    </figcaption>
                  </ScrollReveal>
                ))
              ) : (
                <ScrollReveal as="figure">
                  <blockquote className="story text-[clamp(1.3rem,1.1rem_+_0.9vw,1.9rem)] italic leading-snug">
                    <Ph label="CLIENT TESTIMONIAL: real, approved, with permission" />
                  </blockquote>
                  <figcaption className="mt-6 text-foam/70">
                    <Ph label="CLIENT NAME" /> <Ph label="PROJECT CONTEXT" />
                  </figcaption>
                </ScrollReveal>
              )}
            </div>
          </div>
        ) : null}

        {faqs.length > 0 ? (
          <div className={hasReviews || isDraft ? "mt-28 grid gap-12 lg:grid-cols-12" : "grid gap-12 lg:grid-cols-12"}>
            <div className="lg:col-span-4">
              <TextReveal as="h2" className="t-h2" text="Questions" />
            </div>
            <div className="lg:col-span-8">
              <div className="border-t border-white/12">
                {faqs.map((f) => (
                  <FaqItem key={f.q} question={f.q}>
                    {f.a ?? <Ph label="ANSWER PENDING: client to confirm" />}
                  </FaqItem>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
