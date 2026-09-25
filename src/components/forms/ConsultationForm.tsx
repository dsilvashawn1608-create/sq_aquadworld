"use client";

import Link from "next/link";
import { useRef, useState, type FormEvent } from "react";

const MAX_FILE_BYTES = 5 * 1024 * 1024;

type Status = "idle" | "sending" | "success" | "error";
type ApiResult = { ok?: boolean; error?: string; fields?: Record<string, string> };

type Props = { serviceOptions: string[] };

const aquariumTypes = [
  "Home aquarium",
  "Office aquarium",
  "Commercial installation",
  "Planted aquarium or aquascape",
  "Maintenance of an existing aquarium",
  "Not sure yet",
];

/**
 * The enquiry form. It posts to /api/enquiry and reports success ONLY when the server confirms the email was
 * accepted for delivery. It never simulates a successful submission.
 */
export default function ConsultationForm({ serviceOptions }: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;

    const data = new FormData(e.currentTarget);
    const file = data.get("reference");
    if (file instanceof File && file.size > MAX_FILE_BYTES) {
      setErrors({ reference: "That image is larger than 5 MB. Please choose a smaller one." });
      setStatus("error");
      setMessage("Please fix the highlighted field and try again.");
      return;
    }

    setStatus("sending");
    setMessage("");
    setErrors({});
    try {
      const res = await fetch("/api/enquiry", { method: "POST", body: data });
      const result = (await res.json().catch(() => null)) as ApiResult | null;
      if (res.ok && result?.ok) {
        setStatus("success");
        formRef.current?.reset();
        return;
      }
      setStatus("error");
      setMessage(result?.error ?? "Your enquiry could not be sent. Please try again, or use WhatsApp or phone.");
      setErrors(result?.fields ?? {});
    } catch {
      setStatus("error");
      setMessage("Could not reach the server. Check your connection and try again.");
    }
  }

  const err = (name: string) => errors[name];
  const fieldProps = (name: string) => ({
    name,
    id: name,
    "aria-invalid": err(name) ? true : undefined,
    "aria-describedby": err(name) ? `${name}-error` : undefined,
  });
  const FieldError = ({ name }: { name: string }) =>
    err(name) ? (
      <p id={`${name}-error`} className="mt-2 text-sm text-[#ff9c93]">
        {err(name)}
      </p>
    ) : null;

  if (status === "success") {
    return (
      <div role="status" className="rounded-[var(--radius-card)] border border-glow/30 bg-white/[0.04] p-8 md:p-10">
        <h3 className="t-h3">Enquiry sent</h3>
        <p className="story mt-4">Thank you. Your details have reached us and we will get back to you soon.</p>
        <button type="button" className="btn btn-glass mt-8" onClick={() => setStatus("idle")}>
          Send another enquiry
        </button>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate={false} className="grid gap-5" encType="multipart/form-data">
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Name
          </label>
          <input {...fieldProps("name")} className="field" type="text" required minLength={2} maxLength={100} autoComplete="name" />
          <FieldError name="name" />
        </div>
        <div>
          <label htmlFor="phone" className="mb-2 block text-sm font-medium">
            Phone or WhatsApp
          </label>
          <input {...fieldProps("phone")} className="field" type="tel" required minLength={7} maxLength={24} autoComplete="tel" inputMode="tel" />
          <FieldError name="phone" />
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium">
            Email
          </label>
          <input {...fieldProps("email")} className="field" type="email" required maxLength={160} autoComplete="email" />
          <FieldError name="email" />
        </div>
        <div>
          <label htmlFor="city" className="mb-2 block text-sm font-medium">
            City
          </label>
          <input {...fieldProps("city")} className="field" type="text" required maxLength={100} autoComplete="address-level2" />
          <FieldError name="city" />
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="service" className="mb-2 block text-sm font-medium">
            Service
          </label>
          <select {...fieldProps("service")} className="field" required defaultValue="">
            <option value="" disabled>
              Choose a service
            </option>
            {serviceOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
            <option value="Not sure yet">Not sure yet</option>
          </select>
          <FieldError name="service" />
        </div>
        <div>
          <label htmlFor="aquariumType" className="mb-2 block text-sm font-medium">
            Aquarium type
          </label>
          <select {...fieldProps("aquariumType")} className="field" required defaultValue="">
            <option value="" disabled>
              Choose a type
            </option>
            {aquariumTypes.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <FieldError name="aquariumType" />
        </div>
      </div>

      <div>
        <label htmlFor="size" className="mb-2 block text-sm font-medium">
          Approximate size <span className="font-normal text-foam/55">(optional)</span>
        </label>
        <input {...fieldProps("size")} className="field" type="text" maxLength={100} placeholder="For example: 4 ft wide, or the space you have in mind" />
        <FieldError name="size" />
      </div>

      <div>
        <label htmlFor="message" className="mb-2 block text-sm font-medium">
          Message
        </label>
        <textarea {...fieldProps("message")} className="field min-h-36 resize-y" required minLength={10} maxLength={4000} rows={5} placeholder="Tell us about your space and what you have in mind." />
        <FieldError name="message" />
      </div>

      <div>
        <label htmlFor="reference" className="mb-2 block text-sm font-medium">
          Reference image <span className="font-normal text-foam/55">(optional, JPG, PNG or WebP, up to 5 MB)</span>
        </label>
        <input {...fieldProps("reference")} className="field" type="file" accept="image/jpeg,image/png,image/webp" />
        <FieldError name="reference" />
      </div>

      {/* Honeypot: hidden from people and assistive tech; bots fill it in. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="company_website">Leave this field empty</label>
        <input id="company_website" name="company_website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-wrap items-center gap-5">
        <button type="submit" className="btn btn-primary" disabled={status === "sending"} aria-busy={status === "sending"}>
          {status === "sending" ? "Sending" : "Send enquiry"}
        </button>
        <p role={status === "error" ? "alert" : "status"} aria-live="polite" className="text-sm text-[#ff9c93]">
          {status === "error" ? message : ""}
        </p>
      </div>
      <p className="text-sm text-foam/55">
        We use the details you enter only to respond to your enquiry. See our{" "}
        <Link href="/privacy/" className="link-line">
          privacy notice
        </Link>
        .
      </p>
    </form>
  );
}
