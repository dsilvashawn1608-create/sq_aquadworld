import type { Metadata } from "next";
import GalleryGrid, { type GalleryItem } from "@/components/project/GalleryGrid";
import FinalCTA from "@/components/sections/FinalCTA";
import JsonLd from "@/components/seo/JsonLd";
import PageHeader from "@/components/ui/PageHeader";
import { img } from "@/lib/content";
import { breadcrumbSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Gallery",
  description: `A visual gallery of aquariums, aquascapes and close-ups from ${site.brand.name}.`,
  path: "/gallery/",
});

const items: GalleryItem[] = [
  { image: img("heroLongTank"), span: "md:col-span-12", aspect: "aspect-[4/3] md:aspect-[21/9]", sizes: "(min-width: 1440px) 1344px, 92vw" },
  { image: img("driftwood"), span: "md:col-span-5", aspect: "aspect-[4/5]", sizes: "(min-width: 768px) 40vw, 92vw" },
  { image: img("hairgrass"), span: "md:col-span-7", aspect: "aspect-[4/3] md:aspect-[9/8]", sizes: "(min-width: 768px) 56vw, 92vw" },
  { image: img("homeAngel"), span: "md:col-span-7", aspect: "aspect-[4/3] md:aspect-[9/8]", sizes: "(min-width: 768px) 56vw, 92vw" },
  { image: img("angelPortrait"), span: "md:col-span-5", aspect: "aspect-[4/5]", sizes: "(min-width: 768px) 40vw, 92vw" },
  { image: img("plantedWide"), span: "md:col-span-12", aspect: "aspect-[4/3] md:aspect-[21/9]", sizes: "(min-width: 1440px) 1344px, 92vw" },
  { image: img("tetrasMacro"), span: "md:col-span-6", aspect: "aspect-[4/3]", sizes: "(min-width: 768px) 46vw, 92vw" },
  { image: img("longTankLeft"), span: "md:col-span-6", aspect: "aspect-[4/3]", sizes: "(min-width: 768px) 46vw, 92vw" },
];

export default function GalleryPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Gallery", path: "/gallery/" },
        ])}
      />
      <PageHeader
        title="Gallery"
        lede="Aquariums, aquascapes and the small details in between."
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Gallery", href: "/gallery/" },
        ]}
      />
      <section className="pb-[clamp(6rem,12vw,11rem)]">
        <div className="wrap">
          <GalleryGrid items={items} />
        </div>
      </section>
      <FinalCTA />
    </>
  );
}
