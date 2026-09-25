import { Ph } from "@/components/ui/Ph";
import { contactHrefs, isDraft, site } from "@/lib/site";

const rows = [
  { key: "phone", label: "Phone", value: site.contact.phone, href: contactHrefs.call, placeholder: "BUSINESS PHONE" },
  { key: "whatsapp", label: "WhatsApp", value: site.contact.whatsapp, href: contactHrefs.whatsapp, placeholder: "WHATSAPP NUMBER" },
  { key: "email", label: "Email", value: site.contact.email, href: contactHrefs.email, placeholder: "BUSINESS EMAIL" },
  { key: "address", label: "Location", value: site.contact.address, href: null, placeholder: "BUSINESS LOCATION" },
  { key: "area", label: "Service area", value: site.contact.serviceArea, href: null, placeholder: "SERVICE AREA" },
  { key: "hours", label: "Hours", value: site.contact.hours, href: null, placeholder: "OPENING HOURS" },
];

/** Contact details. Missing values show as visible placeholders in draft mode and disappear in production. */
export default function ContactList({ className = "" }: { className?: string }) {
  const visible = rows.filter((r) => r.value || isDraft);
  return (
    <dl className={`grid gap-x-8 gap-y-5 ${className}`}>
      {visible.map((r) => (
        <div key={r.key}>
          <dt className="text-sm text-foam/55">{r.label}</dt>
          <dd className="mt-1 text-lg">
            {r.value ? (
              r.href ? (
                <a className="link-line" href={r.href} {...(r.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                  {r.value}
                </a>
              ) : (
                r.value
              )
            ) : (
              <Ph label={r.placeholder} />
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}
