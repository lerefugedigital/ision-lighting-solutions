import { NextResponse } from "next/server";
import { Resend } from "resend";
import fs from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";

const SUBMISSIONS_LOG_PATH = path.join(process.cwd(), "submissions_log.json");

/** Temporary fallback while RESEND_API_KEY isn't set — appends the raw submission to a
 *  local JSON file so test/dev submissions aren't silently lost to the console only.
 *  Note: on Vercel the deployed filesystem is read-only, so this only persists during
 *  local `npm run dev`; production submissions still need RESEND_API_KEY to not be lost. */
async function logSubmissionLocally(entry: Record<string, unknown>) {
  try {
    let existing: unknown[] = [];
    try {
      const raw = await fs.readFile(SUBMISSIONS_LOG_PATH, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) existing = parsed;
    } catch {
      existing = [];
    }
    existing.push(entry);
    await fs.writeFile(SUBMISSIONS_LOG_PATH, JSON.stringify(existing, null, 2), "utf-8");
  } catch (err) {
    console.warn("[contact] Could not write submissions_log.json (read-only filesystem?):", err);
  }
}

const CONTACT_EMAIL = process.env.CONTACT_EMAIL ?? "sourcing@vision-lighting-solutions.com";
// Sends from the Resend account's verified domain (vision-lighting-solutions.com itself isn't
// verified on this account's free tier) — override via FROM_EMAIL once a dedicated domain/account
// is set up. The display name still reads "Vision Lighting Solutions" regardless of the address.
const CONTACT_FROM_EMAIL = process.env.FROM_EMAIL ?? "Vision Lighting Solutions <leads@parking-tour-du-mont-blanc.com>";

const LOCALE_LABEL: Record<string, string> = { fr: "FR", en: "EN", de: "DE", it: "IT" };

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Simple table-based layout with inline styles only — email clients don't run stylesheets. */
function buildEmailHtml(params: {
  subjectContext: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  localeLabel: string;
  contextLines: string[];
  message: string;
}): string {
  const row = (label: string, value: string) =>
    `<tr><td style="padding:4px 12px 4px 0;color:#64748b;font-size:13px;white-space:nowrap;vertical-align:top;">${escapeHtml(
      label
    )}</td><td style="padding:4px 0;color:#0f172a;font-size:14px;">${escapeHtml(value)}</td></tr>`;

  const contactRows = [
    row("Nom", params.name || "—"),
    row("Email", params.email),
    row("Société", params.company || "—"),
    row("Téléphone", params.phone || "—"),
    row("Langue", params.localeLabel),
  ].join("");

  const needRows = params.contextLines.map((line) => {
    const [label, ...rest] = line.split(":");
    return row(label, rest.join(":").trim());
  }).join("");

  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,Segoe UI,Roboto,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:24px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0;">
            <tr>
              <td style="background:#0b1220;padding:20px 28px;">
                <span style="color:#f8fafc;font-size:16px;font-weight:600;">Vision Lighting Solutions</span>
                <div style="color:#d97706;font-size:12px;font-weight:600;letter-spacing:0.05em;text-transform:uppercase;margin-top:4px;">Nouveau Lead B2B</div>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 28px 8px 28px;">
                <div style="color:#0f172a;font-size:15px;font-weight:600;margin-bottom:12px;">${escapeHtml(params.subjectContext)}</div>
                <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;">${contactRows}</table>
              </td>
            </tr>
            ${
              needRows
                ? `<tr><td style="padding:8px 28px 8px 28px;"><div style="border-top:1px solid #e2e8f0;padding-top:12px;color:#64748b;font-size:11px;font-weight:600;letter-spacing:0.05em;text-transform:uppercase;margin-bottom:6px;">Détail du besoin</div><table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;">${needRows}</table></td></tr>`
                : ""
            }
            <tr>
              <td style="padding:16px 28px 28px 28px;">
                <div style="border-top:1px solid #e2e8f0;padding-top:12px;color:#64748b;font-size:11px;font-weight:600;letter-spacing:0.05em;text-transform:uppercase;margin-bottom:6px;">Message</div>
                <div style="color:#0f172a;font-size:14px;line-height:1.5;white-space:pre-wrap;">${escapeHtml(params.message)}</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

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
  food: "Food & Beverage",
  other: "Other",
};

const CAD_FORMAT_LABEL: Record<string, string> = {
  step: "STEP",
  iges: "IGES",
  solidworks: "SolidWorks",
};

const PRODUCT_LABEL: Record<string, string> = {
  bar_lights: "LED Bar Lights",
  domes: "Diffuse Dome Lights",
  backlights: "Backlights",
  coaxial: "Coaxial Lights",
  spot: "Spotlights",
};

const DURATION_LABEL: Record<string, string> = {
  "1_week": "1 week",
  "2_weeks": "2 weeks",
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
  cadFormat?: unknown;
  dimensionsOrReference?: unknown;
  product?: unknown;
  productOther?: unknown;
  desiredStartDate?: unknown;
  duration?: unknown;
  deliveryAddress?: unknown;
  opticalProblem?: unknown;
  productName?: unknown;
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
  const locale = asString(body.locale);
  const localeLabel = LOCALE_LABEL[locale] ?? (locale ? locale.toUpperCase() : "N/A");
  const phone = asString(body.phone);
  const competitorRef = asString(body.competitorRef);
  const operatingMode = asString(body.operatingMode);
  const cameraModel = asString(body.cameraModel);
  const materialType = asString(body.materialType);
  const cadFormat = asString(body.cadFormat);
  const dimensionsOrReference = asString(body.dimensionsOrReference);
  const product = asString(body.product);
  const productOther = asString(body.productOther);
  const desiredStartDate = asString(body.desiredStartDate);
  const duration = asString(body.duration);
  const deliveryAddress = asString(body.deliveryAddress);
  const opticalProblem = asString(body.opticalProblem);
  const datasheetProductName = asString(body.productName);
  const productValue = product === "other" ? productOther : PRODUCT_LABEL[product] ?? product;

  // The CAD request modal, the datasheet lead gate and the sample-test tunnel each have
  // their own minimal, context-specific required fields instead of the generic
  // name/email/company/message set.
  const isCadRequest = contextType === "cad_request";
  const isDemoLoan = contextType === "demo_loan";
  const isLabAnalysis = contextType === "lab_analysis";
  const isDatasheetDownload = contextType === "datasheet_download";

  // Server-side validation — never trust the client alone.
  if (isCadRequest) {
    if (!email || !company || !cadFormat) {
      return NextResponse.json({ ok: false, error: "missing_required_field" }, { status: 400 });
    }
  } else if (isDatasheetDownload) {
    if (!email || !company) {
      return NextResponse.json({ ok: false, error: "missing_required_field" }, { status: 400 });
    }
  } else if (isDemoLoan) {
    if (!name || !email || !company || !productValue || !desiredStartDate || !duration || !deliveryAddress) {
      return NextResponse.json({ ok: false, error: "missing_required_field" }, { status: 400 });
    }
  } else if (isLabAnalysis) {
    if (!name || !email || !company || !opticalProblem || !materialType || !operatingMode) {
      return NextResponse.json({ ok: false, error: "missing_required_field" }, { status: 400 });
    }
  } else if (!name || !email || !company || !message) {
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
  if ((contextType === "optical_guide" || isLabAnalysis) && materialType) {
    contextLines.push(`Material / part type: ${MATERIAL_TYPE_LABEL[materialType] ?? materialType}`);
  }
  if (isLabAnalysis && operatingMode) {
    contextLines.push(`Operating mode: ${OPERATING_MODE_LABEL[operatingMode] ?? operatingMode}`);
  }
  if (isCadRequest && cadFormat) {
    contextLines.push(`Requested CAD format: ${CAD_FORMAT_LABEL[cadFormat] ?? cadFormat}`);
  }
  if (isCadRequest && dimensionsOrReference) {
    contextLines.push(`Desired dimensions / reference: ${dimensionsOrReference}`);
  }
  if (isDemoLoan) {
    contextLines.push(`Product(s) requested: ${productValue}`);
    contextLines.push(`Desired start date: ${desiredStartDate}`);
    contextLines.push(`Estimated duration: ${DURATION_LABEL[duration] ?? duration}`);
    contextLines.push(`Delivery address: ${deliveryAddress}`);
  }
  if (isDatasheetDownload && datasheetProductName) {
    contextLines.push(`Product viewed: ${datasheetProductName}`);
  }

  const effectiveMessage = isCadRequest
    ? `3D CAD file request — desired format: ${CAD_FORMAT_LABEL[cadFormat] ?? cadFormat}.${
        dimensionsOrReference ? ` Desired dimensions / reference: ${dimensionsOrReference}.` : ""
      }`
    : isDemoLoan
      ? `Demo/loan equipment request — product: ${productValue}.`
      : isLabAnalysis
        ? `Lab sample analysis request — optical problem: ${opticalProblem}`
        : isDatasheetDownload
          ? `Datasheet PDF download request — product: ${datasheetProductName}.`
          : message;

  const textBody = [
    `New B2B contact form submission — ${subjectContext}`,
    "",
    name ? `Name: ${name}` : null,
    `Email: ${email}`,
    `Company: ${company}`,
    phone ? `Phone: ${phone}` : null,
    `Language: ${localeLabel}`,
    ...contextLines,
    "",
    "Message:",
    effectiveMessage,
  ]
    .filter((line): line is string => line !== null)
    .join("\n");

  const emailSubject = `[Lead B2B] ${subjectContext}${name ? ` - ${name}` : ""}`;
  const emailHtml = buildEmailHtml({
    subjectContext,
    name,
    email,
    company,
    phone,
    localeLabel,
    contextLines,
    message: effectiveMessage,
  });

  if (!process.env.RESEND_API_KEY) {
    // No email provider configured yet — validate and acknowledge, but log so the
    // submission isn't silently lost. Set RESEND_API_KEY in the environment to send for real.
    console.warn("[contact] RESEND_API_KEY is not set — logging submission instead of sending email.");
    console.info("[contact] submission:", { name, email, company, contextType, subjectContext });
    await logSubmissionLocally({
      timestamp: new Date().toISOString(),
      contextType,
      subjectContext,
      ...body,
      website: undefined, // honeypot — already verified empty, no need to persist it
    });
    return NextResponse.json({ ok: true });
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: CONTACT_FROM_EMAIL,
      to: CONTACT_EMAIL,
      replyTo: email,
      subject: emailSubject,
      text: textBody,
      html: emailHtml,
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
