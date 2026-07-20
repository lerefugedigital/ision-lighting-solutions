import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL ?? "sourcing@vision-lighting-solutions.com";
const CONTACT_FROM_EMAIL = "Vision Lighting Solutions <contact@vision-lighting-solutions.com>";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const OPERATING_MODE_LABEL: Record<string, string> = {
  continuous: "Continuous",
  strobe_overdrive: "Strobe / Overdrive",
  undetermined: "Not determined yet",
};

const MATERIAL_TYPE_LABEL: Record<string, string> = {
  metal: "Metal / Stainless Steel",
  plastic: "Plastic",
  glass: "Glass",
  film_packaging: "Film / Packaging",
  other: "Other",
};

interface ContactPayload {
  name?: unknown;
  email?: unknown;
  company?: unknown;
  phone?: unknown;
  message?: unknown;
  contextType?: unknown;
  subjectContext?: unknown;
  locale?: unknown;
  competitorRef?: unknown;
  operatingMode?: unknown;
  cameraModel?: unknown;
  materialType?: unknown;
  /** Honeypot — must stay empty. If a bot fills it, we accept silently and skip sending. */
  website?: unknown;
}

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  let body: ContactPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  // Honeypot: bots that fill hidden fields get a fake success, humans never see this.
  if (asString(body.website)) {
    return NextResponse.json({ ok: true });
  }

  const name = asString(body.name);
  const email = asString(body.email);
  const company = asString(body.company);
  const message = asString(body.message);
  const contextType = asString(body.contextType) || "general";
  const subjectContext = asString(body.subjectContext) || "General Inquiry";
  const phone = asString(body.phone);
  const competitorRef = asString(body.competitorRef);
  const operatingMode = asString(body.operatingMode);
  const cameraModel = asString(body.cameraModel);
  const materialType = asString(body.materialType);

  // Server-side validation — never trust the client alone.
  if (!name || !email || !company || !message) {
    return NextResponse.json({ ok: false, error: "missing_required_field" }, { status: 400 });
  }
  if (!EMAIL_REGEX.test(email)) {
    return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
  }

  const contextLines: string[] = [];
  if (contextType === "equivalence" && competitorRef) {
    contextLines.push(`Competitor reference to replace: ${competitorRef}`);
  }
  if (contextType === "product" && operatingMode) {
    contextLines.push(`Operating mode: ${OPERATING_MODE_LABEL[operatingMode] ?? operatingMode}`);
  }
  if (contextType === "wiring" && cameraModel) {
    contextLines.push(`Camera or controller model: ${cameraModel}`);
  }
  if (contextType === "optical_guide" && materialType) {
    contextLines.push(`Material / part type: ${MATERIAL_TYPE_LABEL[materialType] ?? materialType}`);
  }

  const textBody = [
    `New B2B contact form submission — ${subjectContext}`,
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    `Company: ${company}`,
    phone ? `Phone: ${phone}` : null,
    ...contextLines,
    "",
    "Message:",
    message,
  ]
    .filter((line): line is string => line !== null)
    .join("\n");

  if (!process.env.RESEND_API_KEY) {
    // No email provider configured yet — validate and acknowledge, but log so the
    // submission isn't silently lost. Set RESEND_API_KEY in the environment to send for real.
    console.warn("[contact] RESEND_API_KEY is not set — logging submission instead of sending email.");
    console.info("[contact] submission:", { name, email, company, contextType, subjectContext });
    return NextResponse.json({ ok: true });
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: CONTACT_FROM_EMAIL,
      to: CONTACT_TO_EMAIL,
      replyTo: email,
      subject: `[Vision Lighting Solutions] ${subjectContext}`,
      text: textBody,
    });
    if (error) {
      console.error("[contact] Resend error:", error);
      return NextResponse.json({ ok: false, error: "send_failed" }, { status: 502 });
    }
  } catch (err) {
    console.error("[contact] Unexpected error sending email:", err);
    return NextResponse.json({ ok: false, error: "send_failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
