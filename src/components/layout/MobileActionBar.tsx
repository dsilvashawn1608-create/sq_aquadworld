import { contactHrefs, ENQUIRE_HREF, isDraft } from "@/lib/site";

const iconProps = { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };

/**
 * Required mobile conversion bar: Call | WhatsApp | Enquire.
 * A missing number links to the enquiry form in draft mode and is removed in production (never a fake number).
 */
export default function MobileActionBar() {
  const items = [
    {
      label: "Call",
      href: contactHrefs.call,
      show: Boolean(contactHrefs.call) || isDraft,
      pending: !contactHrefs.call,
      icon: <svg {...iconProps}><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" /></svg>,
    },
    {
      label: "WhatsApp",
      href: contactHrefs.whatsapp,
      show: Boolean(contactHrefs.whatsapp) || isDraft,
      pending: !contactHrefs.whatsapp,
      icon: <svg {...iconProps}><path d="M4 20l1.3-4.2A8 8 0 1 1 8.4 18.8L4 20Z" /><path d="M9 8.8c.2 3 2.3 5.400 5.400 6l1.300-1.400-2-1-.8.800a4 4 0 0 1-1.600-1.600l.8-.8-1-2L9 8.800Z" /></svg>,
    },
    {
      label: "Enquire",
      href: ENQUIRE_HREF,
      show: true,
      pending: false,
      icon: <svg {...iconProps}><path d="M4 5h16v11H9l-5 4V5Z" /></svg>,
    },
  ].filter((i) => i.show);

  return (
    <nav
      aria-label="Quick contact"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-abyss/85 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden"
    >
      <ul className="grid" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}>
        {items.map((i) => {
          const href = i.href ?? ENQUIRE_HREF;
          return (
            <li key={i.label}>
              <a
                href={href}
                {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                {...(i.pending ? { "data-pending": i.label } : {})}
                className="flex h-16 flex-col items-center justify-center gap-1 text-[0.78rem] font-semibold text-foam/90 transition-colors active:bg-white/5"
              >
                <span className="text-glow">{i.icon}</span>
                {i.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
