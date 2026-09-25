"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { approvedTestimonials, ENQUIRE_HREF } from "@/lib/site";
import Wordmark from "./Wordmark";

const links = [
  { href: "/about/", label: "About" },
  { href: "/services/", label: "Services" },
  { href: "/projects/", label: "Portfolio" },
  { href: "/#process", label: "Process" },
  // The Reviews link only exists once real, approved testimonials have been added.
  ...(approvedTestimonials.length ? [{ href: "/#reviews", label: "Reviews" }] : []),
  { href: "/contact/", label: "Contact" },
];

export default function Header() {
  const pathname = usePathname();
  const [compact, setCompact] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Minimal at the top, compact glass pill after a little scrolling.
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setCompact(window.scrollY > 48));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Mobile menu: scroll lock, Escape to close, focus trap.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const menu = menuRef.current;
    const focusables = () => [toggleRef.current, ...Array.from(menu?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") ?? [])].filter(Boolean) as HTMLElement[];
    focusables()[1]?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
        return;
      }
      if (e.key !== "Tab") return;
      const f = focusables();
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const solid = compact || open;

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
        <div className={cn("wrap transition-[padding] duration-500 ease-expo", compact ? "pt-2 md:pt-3" : "pt-3 md:pt-5")}>
          <div
            className={cn(
              "pointer-events-auto mx-auto flex items-center justify-between gap-6 rounded-full border px-4 transition-[max-width,height,background-color,border-color] duration-500 ease-expo md:px-6",
              solid
                ? "h-14 max-w-[1120px] border-white/10 bg-abyss/70 backdrop-blur-xl"
                : "h-16 max-w-[1440px] border-transparent bg-transparent md:h-20"
            )}
          >
            <Link href="/" aria-label="Steve Fernandes Aqua World, home">
              <Wordmark />
            </Link>

            <nav aria-label="Main" className="hidden lg:block">
              <ul className="flex items-center gap-8">
                {links.map((l) => {
                  const active = l.href.startsWith("/#") ? false : pathname === l.href;
                  return (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        aria-current={active ? "page" : undefined}
                        className={cn("link-line text-[0.95rem] font-medium", active ? "text-glow" : "text-foam/85")}
                      >
                        {l.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="flex items-center gap-3">
              <Button href={ENQUIRE_HREF} size="sm" className="hidden md:inline-flex">
                Get Consultation
              </Button>
              <button
                ref={toggleRef}
                type="button"
                className="relative grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/5 lg:hidden"
                aria-expanded={open}
                aria-controls="mobile-menu"
                aria-label={open ? "Close menu" : "Open menu"}
                onClick={() => setOpen((v) => !v)}
              >
                <span aria-hidden="true" className="relative block h-3.5 w-5">
                  <span className={cn("absolute left-0 h-px w-5 bg-foam transition-transform duration-500 ease-expo", open ? "top-1.5 rotate-45" : "top-0")} />
                  <span className={cn("absolute left-0 top-1.5 h-px w-5 bg-foam transition-opacity duration-300", open && "opacity-0")} />
                  <span className={cn("absolute left-0 h-px w-5 bg-foam transition-transform duration-500 ease-expo", open ? "top-1.5 -rotate-45" : "top-3")} />
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div
        id="mobile-menu"
        ref={menuRef}
        role="dialog"
        aria-modal="true"
        aria-label="Main menu"
        aria-hidden={!open}
        className={cn(
          "fixed inset-0 z-40 bg-abyss/95 backdrop-blur-2xl transition-[opacity,visibility] duration-500 lg:hidden",
          open ? "visible opacity-100" : "invisible opacity-0"
        )}
      >
        <div className="wrap flex h-full flex-col justify-center gap-10 pb-10 pt-28">
          <ul className="flex flex-col gap-1">
            {links.map((l, i) => (
              <li key={l.href} className="overflow-hidden">
                <Link
                  href={l.href}
                  className={cn(
                    "block py-2 text-[clamp(2.25rem,9vw,3.5rem)] font-semibold leading-tight tracking-tight transition-transform duration-700 ease-expo",
                    open ? "translate-y-0" : "translate-y-full"
                  )}
                  style={{ transitionDelay: open ? `${120 + i * 55}ms` : "0ms" }}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <Button href={ENQUIRE_HREF} className="self-start">
            Get Free Consultation
          </Button>
        </div>
      </div>
    </>
  );
}
