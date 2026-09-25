import Link from "next/link";
import Atmosphere from "@/components/motion/Atmosphere";
import Button from "@/components/ui/Button";
import ContactList from "@/components/ui/ContactList";
import { Ph } from "@/components/ui/Ph";
import { majorServices } from "@/lib/content";
import { ENQUIRE_HREF, isDraft, site } from "@/lib/site";
import Wordmark from "./Wordmark";

const explore = [
  { href: "/about/", label: "About" },
  { href: "/projects/", label: "Portfolio" },
  { href: "/gallery/", label: "Gallery" },
  { href: "/blog/", label: "Journal" },
  { href: "/contact/", label: "Contact" },
];

const socials = [
  { key: "instagram", label: "Instagram", url: site.social.instagram },
  { key: "facebook", label: "Facebook", url: site.social.facebook },
  { key: "youtube", label: "YouTube", url: site.social.youtube },
];

/** The last scene of the site: deep water, a whisper of light, one very large faint wordmark. */
export default function Footer() {
  return (
    <footer className="relative isolate overflow-hidden border-t border-white/10 bg-trench pb-28 pt-24 md:pb-10">
      <div className="absolute inset-0 -z-10 bg-linear-to-b from-deep/40 via-trench to-abyss" />
      <Atmosphere particles={10} className="-z-10 opacity-60" />

      <div className="wrap">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Wordmark />
            <p className="mt-6 max-w-sm text-foam/70">
              {site.brand.descriptor}. Custom aquarium design, installation and maintenance.
            </p>
            <Button href={ENQUIRE_HREF} className="mt-8">
              Get Free Consultation
            </Button>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-7">
            <div>
              <h2 className="text-sm font-semibold text-foam/55">Explore</h2>
              <ul className="mt-4 space-y-2.5">
                {explore.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="link-line">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-sm font-semibold text-foam/55">Services</h2>
              <ul className="mt-4 space-y-2.5">
                {majorServices.map((s) => (
                  <li key={s.slug}>
                    <Link href={`/services/${s.slug}/`} className="link-line">
                      {s.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/services/" className="link-line">
                    All services
                  </Link>
                </li>
              </ul>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <h2 className="text-sm font-semibold text-foam/55">Follow</h2>
              <ul className="mt-4 space-y-2.5">
                {socials
                  .filter((s) => s.url || isDraft)
                  .map((s) => (
                    <li key={s.key}>
                      {s.url ? (
                        <a href={s.url} className="link-line" target="_blank" rel="noopener noreferrer">
                          {s.label}
                        </a>
                      ) : (
                        <Ph label={`${s.label.toUpperCase()} URL`} />
                      )}
                    </li>
                  ))}
              </ul>
            </div>
          </nav>
        </div>

        <div className="mt-16 border-t border-white/10 pt-10">
          <ContactList className="sm:grid-cols-2 lg:grid-cols-3" />
        </div>

        <p aria-hidden="true" className="pointer-events-none mt-16 select-none text-center text-[clamp(4rem,17vw,15rem)] font-bold leading-[0.85] tracking-tighter text-foam/[0.04]">
          Aqua World
        </p>

        <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-foam/55 sm:flex-row sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.brand.name}
          </p>
          <p>
            <Link href="/privacy/" className="link-line">
              Privacy
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
