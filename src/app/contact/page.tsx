import type { Metadata } from "next";
import ScrollReveal from "@/components/motion/ScrollReveal";
import ConsultationForm from "@/components/forms/ConsultationForm";
import JsonLd from "@/components/seo/JsonLd";
import ContactActions from "@/components/ui/ContactActions";
import ContactList from "@/components/ui/ContactList";
import PageHeader from "@/components/ui/PageHeader";
import { services } from "@/lib/content";
import { breadcrumbSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Contact and Free Consultation",
  description: `Talk to ${site.brand.name} about a custom aquarium: call, WhatsApp, or send an enquiry for a free consultation.`,
  path: "/contact/",
});

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact/" },
        ])}
      />
      <PageHeader
        title="Start your aquarium journey"
        lede="Tell us about your space and what you have in mind."
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Contact", href: "/contact/" },
        ]}
      />

      <section className="pb-[clamp(6rem,12vw,11rem)]">
        <div className="wrap grid gap-16 lg:grid-cols-12">
          <ScrollReveal className="lg:col-span-4">
            <ContactList />
            <ContactActions className="mt-10" />
          </ScrollReveal>

          <div id="enquire" className="lg:col-span-7 lg:col-start-6">
            <div className="rounded-[var(--radius-card)] border border-white/12 bg-white/[0.03] p-6 backdrop-blur-sm md:p-10">
              <h2 className="t-h3 mb-8">Request a free consultation</h2>
              <ConsultationForm serviceOptions={services.map((s) => s.name)} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
