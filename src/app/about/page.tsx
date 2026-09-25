import type { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";
import FinalCTA from "@/components/sections/FinalCTA";
import MeetSteve from "@/components/sections/MeetSteve";
import ScrollReveal from "@/components/motion/ScrollReveal";
import PageHeader from "@/components/ui/PageHeader";
import { breadcrumbSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description: `${site.brand.name} is a ${site.brand.descriptor.toLowerCase()} founded by ${site.brand.founder}. Aquariums approached as art, design, craftsmanship and living environments.`,
  path: "/about/",
});

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "About", path: "/about/" },
        ])}
      />
      <PageHeader
        title={site.brand.philosophy}
        lede={`${site.brand.name} is a ${site.brand.descriptor.toLowerCase()} creating living underwater environments for the spaces they belong to.`}
        crumbs={[
          { name: "Home", href: "/" },
          { name: "About", href: "/about/" },
        ]}
      />

      <section className="pb-8">
        <div className="wrap grid gap-10 lg:grid-cols-12">
          <ScrollReveal items className="lg:col-span-6 lg:col-start-4">
            <p data-reveal-item="" className="story">
              The studio's work starts from a simple idea: an aquarium can be a work of art. Composition, light, materials and life come together into an environment that lives alongside you.
            </p>
            <p data-reveal-item="" className="story">
              Every project is shaped around a space and the people who live with it, from the first conversation through to long-term care.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <MeetSteve showLink={false} />
      <FinalCTA />
    </>
  );
}
