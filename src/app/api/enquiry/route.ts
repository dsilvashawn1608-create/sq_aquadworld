import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Enquiry endpoint. It returns { ok: true } ONLY after the email provider (Resend) has accepted the message.
 * If email delivery is not configured it answers 503 honestly. It never pretends to have sent anything.
 *
 * Required environment variables: RESEND_API_KEY, ENQUIRY_TO_EMAIL, ENQUIRY_FROM_EMAIL
 */

const MAX_FILE_BYTES = 5 * 1024 * 1024;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 5;
const hits = new Map<string, number[]>(); // best-effort, per server instance

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > RATE_MAX;
}

const clean = (v: FormDataEntryValue | null, max: number) => (typeof v === "string" ? v.replace(/\r\n/g, "\n").trim().slice(0, max) : "");
const oneLine = (s: string) => s.replace(/[\r\n]+/g, " ");

/** Verify the real file signature, not just the client-declared MIME type. */
function sniffImage(bytes: Uint8Array): "image/jpeg" | "image/png" | "image/webp" | null {
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "image/jpeg";
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return "image/png";
  if (bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 && bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50) return "image/webp";
  return null;
}

export async function POST(req: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ENQUIRY_TO_EMAIL;
  const from = process.env.ENQUIRY_FROM_EMAIL;
  if (!apiKey || !to || !from) {
    return NextResponse.json(
      { ok: false, error: "Enquiries cannot be delivered yet because email delivery has not been set up. Please use WhatsApp or phone instead." },
      { status: 503 }
    );
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ ok: false, error: "Too many enquiries from this connection. Please try again in a few minutes." }, { status: 429 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ ok: false, error: "The form could not be read. Please try again." }, { status: 400 });
  }

  // Honeypot: pretend success to bots without sending anything.
  if (clean(form.get("company_website"), 200)) return NextResponse.json({ ok: true });

  const name = clean(form.get("name"), 100);
  const phone = clean(form.get("phone"), 24);
  const email = clean(form.get("email"), 160);
  const city = clean(form.get("city"), 100);
  const service = clean(form.get("service"), 100);
  const aquariumType = clean(form.get("aquariumType"), 100);
  const size = clean(form.get("size"), 100);
  const message = clean(form.get("message"), 4000);

  const fields: Record<string, string> = {};
  if (name.length < 2) fields.name = "Please enter your name.";
  if (phone.replace(/\D/g, "").length < 7) fields.phone = "Please enter a phone or WhatsApp number.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fields.email = "Please enter a valid email address.";
  if (!city) fields.city = "Please enter your city.";
  if (!service) fields.service = "Please choose a service.";
  if (!aquariumType) fields.aquariumType = "Please choose an aquarium type.";
  if (message.length < 10) fields.message = "Please tell us a little more (at least 10 characters).";

  let attachment: { filename: string; content: string } | undefined;
  const file = form.get("reference");
  if (file instanceof File && file.size > 0) {
    if (file.size > MAX_FILE_BYTES) {
      fields.reference = "That image is larger than 5 MB.";
    } else {
      const buf = new Uint8Array(await file.arrayBuffer());
      const type = sniffImage(buf);
      if (!type) {
        fields.reference = "Please upload a JPG, PNG or WebP image.";
      } else {
        const ext = type === "image/jpeg" ? "jpg" : type === "image/png" ? "png" : "webp";
        attachment = { filename: `reference.${ext}`, content: Buffer.from(buf).toString("base64") };
      }
    }
  }

  if (Object.keys(fields).length) {
    return NextResponse.json({ ok: false, error: "Please check the highlighted fields.", fields }, { status: 400 });
  }

  const text = [
    "New website enquiry",
    "",
    `Name: ${name}`,
    `Phone / WhatsApp: ${phone}`,
    `Email: ${email}`,
    `City: ${city}`,
    `Service: ${service}`,
    `Aquarium type: ${aquariumType}`,
    `Approximate size: ${size || "not given"}`,
    `Reference image: ${attachment ? "attached" : "none"}`,
    "",
    "Message:",
    message,
  ].join("\n");

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: to.split(",").map((s) => s.trim()).filter(Boolean),
        reply_to: email,
        subject: `New enquiry from ${oneLine(name)} (${oneLine(service)})`,
        text,
        ...(attachment ? { attachments: [attachment] } : {}),
      }),
    });

    if (!res.ok) {
      console.error("Enquiry email rejected by Resend:", res.status, await res.text().catch(() => ""));
      return NextResponse.json({ ok: false, error: "Your enquiry could not be delivered. Please try again, or use WhatsApp or phone." }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Enquiry email failed:", error);
    return NextResponse.json({ ok: false, error: "Your enquiry could not be delivered. Please try again, or use WhatsApp or phone." }, { status: 502 });
  }
}
