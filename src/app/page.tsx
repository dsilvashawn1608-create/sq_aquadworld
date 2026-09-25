import type { Metadata } from "next";
import Craft from "@/components/sections/Craft";
import FeaturedWork from "@/components/sections/FeaturedWork";
import FinalCTA from "@/components/sections/FinalCTA";
import Hero from "@/components/sections/Hero";
import MeetSteve from "@/components/sections/MeetSteve";
import ProcessTimeline from "@/components/sections/ProcessTimeline";
import ServicesEditorial from "@/components/sections/ServicesEditorial";
import Story from "@/components/sections/Story";
import Trust from "@/components/sections/Trust";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: `${site.brand.name} | Custom Aquarium Design, Installation & Maintenance`,
  description: `${site.brand.descriptor} transforming spaces into living underwater masterpieces. Custom aquarium design, installation and maintenance by ${site.brand.founder}.`,
  path: "/",
  absolute: true,
});

/** Introduction → Story → Work → Craft → Process → Person → Services → Trust → Contact */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Story />
      <FeaturedWork />
      <Craft />
      <ProcessTimeline />
      <MeetSteve />
      <ServicesEditorial />
      <Trust />
      <FinalCTA />
    </>
  );
}
