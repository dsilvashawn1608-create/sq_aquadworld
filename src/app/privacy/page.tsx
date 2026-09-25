import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import { Ph } from "@/components/ui/Ph";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Privacy notice",
  description: "How enquiry details submitted through this website are used.",
  path: "/privacy/",
  noindex: true,
});

export default function PrivacyPage() {
  return (
    <>
      <PageHeader
        title="Privacy notice"
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Privacy", href: "/privacy/" },
        ]}
      />
      <section className="pb-[clamp(6rem,12vw,11rem)]">
        <div className="wrap">
          <div className="max-w-[58ch]">
            <p className="story">
              When you send an enquiry through this website, the details you enter (name, phone or WhatsApp number, email, city, aquarium details, your message and an optional reference image) are emailed to the business so it can reply to you.
            </p>
            <p className="story">
              <Ph label="PRIVACY POLICY: full text, retention period and contact for data requests, to be supplied by the client or their adviser" />
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
