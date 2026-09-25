import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Newsreader } from "next/font/google";
import "./globals.css";
import DraftBanner from "@/components/layout/DraftBanner";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import MobileActionBar from "@/components/layout/MobileActionBar";
import PageTransition from "@/components/layout/PageTransition";
import CustomCursor from "@/components/motion/CustomCursor";
import JsonLd from "@/components/seo/JsonLd";
import { localBusinessSchema, organizationSchema, websiteSchema } from "@/lib/schema";
import { isDraft, site, siteUrl } from "@/lib/site";

const bricolage = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-bricolage", display: "swap" });
const newsreader = Newsreader({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-newsreader", display: "swap" });

const description = `${site.brand.descriptor} transforming spaces into living underwater masterpieces. Custom aquarium design, installation and maintenance by ${site.brand.founder}.`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${site.brand.name} | Custom Aquarium Design, Installation & Maintenance`,
    template: `%s | ${site.brand.name}`,
  },
  description,
  applicationName: site.brand.name,
  authors: [{ name: site.brand.founder }],
  robots: isDraft ? { index: false, follow: false } : { index: true, follow: true },
  openGraph: { siteName: site.brand.name, type: "website", locale: "en" },
};

export const viewport: Viewport = {
  themeColor: "#030a12",
  colorScheme: "dark",
};

/**
 * Runs before first paint. Adds `motion-ok` (which hides elements until GSAP reveals them) only when the user
 * has NOT asked for reduced motion, and removes it again if the animation code has not started after 6 seconds,
 * so content can never stay hidden.
 */
const MOTION_BOOT = `(function(){try{var d=document.documentElement;if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){d.classList.add('motion-ok');setTimeout(function(){if(!window.__motionBooted){d.classList.remove('motion-ok')}},6000)}}catch(e){}})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bricolage.variable} ${newsreader.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: MOTION_BOOT }} />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <MobileActionBar />
        <DraftBanner />
        <PageTransition />
        <CustomCursor />
        <JsonLd data={organizationSchema()} />
        <JsonLd data={websiteSchema()} />
        <JsonLd data={localBusinessSchema()} />
      </body>
    </html>
  );
}
