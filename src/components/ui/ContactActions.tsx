import Button from "@/components/ui/Button";
import { contactHrefs, ENQUIRE_HREF, isDraft } from "@/lib/site";

/**
 * Consultation + WhatsApp + Call. While a number is missing the button still routes to the enquiry form
 * in draft mode (so the design is reviewable) and disappears in production.
 */
export default function ContactActions({ className = "" }: { className?: string }) {
  const { whatsapp, call } = contactHrefs;
  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      <Button href={ENQUIRE_HREF} magnetic>
        Get Free Consultation
      </Button>
      {(whatsapp || isDraft) && (
        <Button href={whatsapp ?? ENQUIRE_HREF} variant="glass" pending={whatsapp ? undefined : "WhatsApp number"}>
          WhatsApp
        </Button>
      )}
      {(call || isDraft) && (
        <Button href={call ?? ENQUIRE_HREF} variant="glass" pending={call ? undefined : "Phone number"}>
          Call
        </Button>
      )}
    </div>
  );
}
