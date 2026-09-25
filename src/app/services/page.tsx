import type { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";
import FinalCTA from "@/components/sections/FinalCTA";
import ServicesEditorial from "@/components/sections/ServicesEditorial";
import PageHeader from "@/components/ui/PageHeader";
import { breadcrumbSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Aquarium Services",
  description: `Custom aquarium design, aquascaping, setup, installation and maintenance from ${site.brand.name}.`,
  path: "/services/",
});

export default function ServicesPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Services", path: "/services/" },
        ])}
      />
      <PageHeader
        title="Aquarium services"
        lede="From the first idea to everyday care."
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Services", href: "/services/" },
        ]}
      />
      <ServicesEditorial showHeading={false} />
      <FinalCTA />
    </>
  );
}
