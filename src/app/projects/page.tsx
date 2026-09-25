import type { Metadata } from "next";
import ProjectsGrid from "@/components/project/ProjectsGrid";
import FinalCTA from "@/components/sections/FinalCTA";
import JsonLd from "@/components/seo/JsonLd";
import PageHeader from "@/components/ui/PageHeader";
import { categories, projects } from "@/lib/content";
import { breadcrumbSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Portfolio",
  description: `Selected aquarium projects by ${site.brand.name}: custom designs, aquascapes and planted aquariums.`,
  path: "/projects/",
});

export default function ProjectsPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Portfolio", path: "/projects/" },
        ])}
      />
      <PageHeader
        title="Selected work"
        lede="A closer look at the aquariums behind the studio."
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Portfolio", href: "/projects/" },
        ]}
      />
      <section className="pb-[clamp(6rem,12vw,11rem)]">
        <div className="wrap">
          <ProjectsGrid projects={projects} categories={categories} />
        </div>
      </section>
      <FinalCTA />
    </>
  );
}
