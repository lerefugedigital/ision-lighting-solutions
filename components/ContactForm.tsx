"use client";

import { useId, useState, type FormEvent } from "react";
import { trackLeadGenerated } from "@/lib/gtag";

export type ContactFormContextType =
  | "product"
  | "equivalence"
  | "wiring"
  | "optical_guide"
  | "general"
  | "lighting_diagnostic";

/** Maps each form context to its silo, so the GA4 event tells apart submissions coming
 *  from Silo 1 (product), Silo 2 (equivalence), Silo 3 (wiring) and Silo 4 (optical_guide). */
const CONTEXT_TO_SILO: Record<ContactFormContextType, string> = {
  product: "eclairages",
  equivalence: "equivalences",
  wiring: "cablage-integration",
  optical_guide: "guides-optiques",
  general: "general",
  lighting_diagnostic: "lighting_diagnostic",
};

export interface ContactFormProps {
  locale: "en" | "fr";
  contextType: ContactFormContextType;
  /** Short label for what this form is about, e.g. "LED Bar Lights" or "M12 5-Pin Wiring" — used in the email subject and the mailto fallback. */
  subjectContext?: string;
  /** Overrides the displayed H2 only; the mailto/email subject default still uses the context's own title. */
  titleOverride?: string;
}

type OperatingMode = "continuous" | "strobe_overdrive" | "undetermined";
type MaterialType = "metal" | "plastic" | "glass" | "film_packaging" | "other";
type DefectType = "scratches" | "edges" | "presence_absence" | "barcode" | "other";
type SubmitStatus = "idle" | "submitting" | "success" | "error";

interface FormState {
  name: string;
  email: string;
  company: string;
  phone: string;
  message: string;
  competitorRef: string;
  operatingMode: OperatingMode | "";
  cameraModel: string;
  materialType: MaterialType | "";
  /** Only used by the "lighting_diagnostic" context — the application / defect to inspect. */
  defectType: DefectType | "";
  /** Optional part photo, only offered on the "lighting_diagnostic" context. Sent as multipart. */
  partPhoto: File | null;
  /** Honeypot — real users never fill this; bots that do get silently discarded server-side. */
  website: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CONTACT_EMAIL = "contact@vision-lighting-solutions.com";
const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
const ACCEPTED_PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];

const INITIAL_STATE: FormState = {
  name: "",
  email: "",
  company: "",
  phone: "",
  message: "",
  competitorRef: "",
  operatingMode: "",
  cameraModel: "",
  materialType: "",
  defectType: "",
  partPhoto: null,
  website: "",
};

const TEXT = {
  en: {
    fields: {
      name: "Full Name",
      email: "Professional Email",
      company: "Company",
      phone: "Phone",
      message: "Project Description",
      competitorRef: "Competitor reference to replace",
      operatingMode: "Operating Mode",
      cameraModel: "Camera or Controller Model Used",
      materialType: "Material / Part Type to Inspect",
      defectType: "Application / Defect to Inspect",
      partPhoto: "Photo of the part (optional)",
    },
    placeholders: {
      name: "Jane Smith",
      email: "jane.smith@company.com",
      company: "Your company",
      phone: "+1 555 123 4567",
      message: "Describe your application: target, working distance, surface type, line speed…",
      competitorRef: "e.g. EBAR, AL126…",
      cameraModel: "e.g. Cognex In-Sight 7000, Keyence CV-X…",
    },
    operatingModeOptions: {
      placeholder: "Select…",
      continuous: "Continuous",
      strobe_overdrive: "Strobe / Overdrive",
      undetermined: "Not determined yet",
    },
    materialTypeOptions: {
      placeholder: "Select…",
      metal: "Metal / Stainless Steel",
      plastic: "Plastic",
      glass: "Glass",
      film_packaging: "Film / Packaging",
      other: "Other",
    },
    defectTypeOptions: {
      placeholder: "Select…",
      scratches: "Scratches / marks",
      edges: "Edges / contours",
      presence_absence: "Presence / absence",
      barcode: "Barcode / code reading",
      other: "Other",
    },
    context: {
      product: {
        title: "Request Specifications & a Quote",
        description:
          "Tell us your application and one of our engineers will recommend the right configuration within 24 business hours.",
      },
      equivalence: {
        title: "Request a Compatibility Study",
        description:
          "Paste your exact reference and one of our engineers will send you a cross-reference study within 24 business hours.",
      },
      wiring: {
        title: "Ask Our Wiring Team",
        description:
          "Tell us about your camera, controller or trigger setup and one of our engineers will help you wire it correctly.",
      },
      optical_guide: {
        title: "Ask an Application Engineer",
        description: "Describe your inspection challenge and one of our engineers will recommend the right optical approach.",
      },
      general: {
        title: "Contact Our Team",
        description: "Tell us about your project and one of our engineers will get back to you within 24 business hours.",
      },
      lighting_diagnostic: {
        title: "Get a Free Lighting Diagnostic + 3 Manufacturer Quotes",
        description:
          "Tell us the part and the defect to inspect. One of our vision engineers returns a lighting recommendation and puts 3 manufacturers in competition for your quote — free, within 24 business hours.",
      },
    },
    submit: "Send My Request",
    submitDiagnostic: "Get My Free Diagnostic & 3 Quotes",
    partPhotoHint: "JPG, PNG or WebP — 5 MB max.",
    fileTooLarge: "Image must be 5 MB or smaller.",
    fileWrongType: "Please upload a JPG, PNG or WebP image.",
    submitting: "Sending…",
    success:
      "Your study/quote request has been sent to our application lab. An engineer will get back to you within 2 business hours.",
    sendAnother: "Send another request",
    error: "Something went wrong sending your request. Please try again, or use the direct email option below.",
    gdpr: "By submitting this form, you agree that your data will be processed to respond to your industrial inquiry.",
    mailtoLabel: "Send by direct email instead",
    requiredField: "This field is required.",
    invalidEmail: "Please enter a valid professional email address.",
  },
  fr: {
    fields: {
      name: "Nom / Prénom",
      email: "Email Professionnel",
      company: "Société / Entreprise",
      phone: "Téléphone",
      message: "Description du Projet",
      competitorRef: "Référence concurrente à remplacer",
      operatingMode: "Mode de Fonctionnement",
      cameraModel: "Modèle de Caméra ou Contrôleur Utilisé",
      materialType: "Type de Matériau / Pièce à Contrôler",
      defectType: "Application / Défaut à Inspecter",
      partPhoto: "Photo de la pièce (optionnel)",
    },
    placeholders: {
      name: "Jean Dupont",
      email: "jean.dupont@entreprise.com",
      company: "Votre entreprise",
      phone: "+33 6 12 34 56 78",
      message: "Décrivez votre application : cible, distance de travail, type de surface, cadence de ligne…",
      competitorRef: "ex : EBAR, AL126…",
      cameraModel: "ex : Cognex In-Sight 7000, Keyence CV-X…",
    },
    operatingModeOptions: {
      placeholder: "Sélectionner…",
      continuous: "Continu",
      strobe_overdrive: "Strobe Overdrive",
      undetermined: "Non déterminé",
    },
    materialTypeOptions: {
      placeholder: "Sélectionner…",
      metal: "Métal / Inox",
      plastic: "Plastique",
      glass: "Verre",
      film_packaging: "Film / Emballage",
      other: "Autre",
    },
    defectTypeOptions: {
      placeholder: "Sélectionner…",
      scratches: "Rayures / marques",
      edges: "Contours / arêtes",
      presence_absence: "Présence / absence",
      barcode: "Code-barres / lecture de code",
      other: "Autre",
    },
    context: {
      product: {
        title: "Demander les Spécifications / Un Devis",
        description:
          "Indiquez-nous votre application : un de nos ingénieurs vous recommande la configuration adaptée sous 24h ouvrées.",
      },
      equivalence: {
        title: "Demander une Étude de Correspondance",
        description:
          "Collez votre référence exacte : un de nos ingénieurs vous envoie une étude de correspondance sous 24h ouvrées.",
      },
      wiring: {
        title: "Contacter Notre Équipe Câblage",
        description:
          "Décrivez votre caméra, contrôleur ou configuration de trigger : un de nos ingénieurs vous aide à câbler correctement.",
      },
      optical_guide: {
        title: "Contacter un Ingénieur d'Application",
        description: "Décrivez votre problématique d'inspection : un de nos ingénieurs vous recommande l'approche optique adaptée.",
      },
      general: {
        title: "Contacter Notre Équipe",
        description: "Parlez-nous de votre projet : un de nos ingénieurs vous répond sous 24h ouvrées.",
      },
      lighting_diagnostic: {
        title: "Obtenir un Diagnostic d'Éclairage Gratuit & 3 Devis de Fabricants",
        description:
          "Indiquez-nous la pièce et le défaut à inspecter. Un de nos ingénieurs vision vous renvoie une préconisation d'éclairage et met 3 fabricants en concurrence pour votre devis — gratuitement, sous 24h ouvrées.",
      },
    },
    submit: "Envoyer Ma Demande",
    submitDiagnostic: "Obtenir Mon Diagnostic Gratuit & 3 Devis",
    partPhotoHint: "JPG, PNG ou WebP — 5 Mo max.",
    fileTooLarge: "L'image doit faire 5 Mo ou moins.",
    fileWrongType: "Merci d'importer une image JPG, PNG ou WebP.",
    submitting: "Envoi en cours…",
    success:
      "Votre demande d'étude/devis a bien été transmise à notre laboratoire d'application. Un ingénieur vous recontacte sous 2h ouvrées.",
    sendAnother: "Envoyer une nouvelle demande",
    error: "Une erreur est survenue lors de l'envoi. Réessayez, ou utilisez l'option d'e-mail direct ci-dessous.",
    gdpr:
      "En soumettant ce formulaire, vous acceptez que vos données soient traitées pour répondre à votre demande industrielle.",
    mailtoLabel: "Envoyer par e-mail direct",
    requiredField: "Ce champ est requis.",
    invalidEmail: "Merci de saisir une adresse email professionnelle valide.",
  },
} as const;

function buildMailtoHref(params: {
  state: FormState;
  contextType: ContactFormContextType;
  subjectContext?: string;
  t: (typeof TEXT)[keyof typeof TEXT];
}): string {
  const { state, contextType, subjectContext, t } = params;
  const subject = `[Vision Lighting Solutions] ${subjectContext ?? t.context[contextType].title}`;

  const lines = [
    `${t.fields.name}: ${state.name}`,
    `${t.fields.email}: ${state.email}`,
    `${t.fields.company}: ${state.company}`,
    state.phone ? `${t.fields.phone}: ${state.phone}` : null,
    contextType === "equivalence" && state.competitorRef ? `${t.fields.competitorRef}: ${state.competitorRef}` : null,
    contextType === "product" && state.operatingMode
      ? `${t.fields.operatingMode}: ${t.operatingModeOptions[state.operatingMode]}`
      : null,
    contextType === "wiring" && state.cameraModel ? `${t.fields.cameraModel}: ${state.cameraModel}` : null,
    contextType === "optical_guide" && state.materialType
      ? `${t.fields.materialType}: ${t.materialTypeOptions[state.materialType]}`
      : null,
    contextType === "lighting_diagnostic" && state.defectType
      ? `${t.fields.defectType}: ${t.defectTypeOptions[state.defectType]}`
      : null,
    contextType === "lighting_diagnostic" && state.materialType
      ? `${t.fields.materialType}: ${t.materialTypeOptions[state.materialType]}`
      : null,
    "",
    `${t.fields.message}:`,
    state.message,
  ].filter((line): line is string => line !== null);

  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
}

export function ContactForm({ locale, contextType, subjectContext, titleOverride }: ContactFormProps) {
  const t = TEXT[locale];
  const idPrefix = useId();
  const [state, setState] = useState<FormState>(INITIAL_STATE);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [status, setStatus] = useState<SubmitStatus>("idle");

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setState((prev) => ({ ...prev, [key]: value }));
  }

  function validate(): Partial<Record<keyof FormState, string>> {
    const errors: Partial<Record<keyof FormState, string>> = {};
    if (!state.name.trim()) errors.name = t.requiredField;
    if (!state.email.trim()) errors.email = t.requiredField;
    else if (!EMAIL_REGEX.test(state.email.trim())) errors.email = t.invalidEmail;
    if (!state.company.trim()) errors.company = t.requiredField;
    if (contextType === "lighting_diagnostic") {
      if (!state.defectType) errors.defectType = t.requiredField;
      if (state.partPhoto) {
        if (state.partPhoto.size > MAX_PHOTO_BYTES) errors.partPhoto = t.fileTooLarge;
        else if (!ACCEPTED_PHOTO_TYPES.includes(state.partPhoto.type)) errors.partPhoto = t.fileWrongType;
      }
    } else if (!state.message.trim()) {
      errors.message = t.requiredField;
    }
    return errors;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setStatus("submitting");
    const resolvedSubject = subjectContext ?? t.context[contextType].title;
    const sourceUrl = window.location.href;
    try {
      const { partPhoto, ...fields } = state;
      const meta = { contextType, subjectContext: resolvedSubject, locale, source_url: sourceUrl };
      let res: Response;
      if (partPhoto) {
        // A part photo forces multipart/form-data so the file rides along with the fields.
        const fd = new FormData();
        for (const [key, value] of Object.entries({ ...fields, ...meta })) {
          if (typeof value === "string") fd.append(key, value);
        }
        fd.append("partPhoto", partPhoto);
        res = await fetch("/api/contact", { method: "POST", body: fd });
      } else {
        res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...fields, ...meta }),
        });
      }
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      trackLeadGenerated({
        silo: CONTEXT_TO_SILO[contextType],
        formType: contextType,
        subject: resolvedSubject,
        locale,
        sourceUrl,
      });
    } catch {
      setStatus("error");
    }
  }

  const mailtoHref = buildMailtoHref({ state, contextType, subjectContext, t });
  const contextCopy = t.context[contextType];

  const inputClasses =
    "mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100";
  const labelClasses = "text-sm font-medium text-slate-700 dark:text-slate-300";
  const errorClasses = "mt-1 text-xs text-red-600 dark:text-red-400";

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 dark:border-emerald-900/50 dark:bg-emerald-950/20 sm:p-8">
        <p className="text-sm font-medium text-emerald-900 dark:text-emerald-300">{t.success}</p>
        <button
          type="button"
          onClick={() => {
            setState(INITIAL_STATE);
            setStatus("idle");
          }}
          className="mt-4 text-sm font-semibold text-emerald-800 underline hover:text-emerald-900 dark:text-emerald-300 dark:hover:text-emerald-200"
        >
          {t.sendAnother}
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900 sm:p-8">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{titleOverride ?? contextCopy.title}</h2>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{contextCopy.description}</p>

      <form onSubmit={handleSubmit} className="mt-6" noValidate>
        {/* Honeypot field — hidden from real users, left empty by them, but visible to naive bots */}
        <input
          type="text"
          name="website"
          value={state.website}
          onChange={(e) => setField("website", e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute left-[-9999px] h-0 w-0 opacity-0"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor={`${idPrefix}-name`} className={labelClasses}>
              {t.fields.name} <span className="text-red-500">*</span>
            </label>
            <input
              id={`${idPrefix}-name`}
              type="text"
              value={state.name}
              onChange={(e) => setField("name", e.target.value)}
              placeholder={t.placeholders.name}
              className={inputClasses}
              aria-invalid={Boolean(fieldErrors.name)}
              aria-describedby={fieldErrors.name ? `${idPrefix}-name-error` : undefined}
            />
            {fieldErrors.name && (
              <p id={`${idPrefix}-name-error`} className={errorClasses}>
                {fieldErrors.name}
              </p>
            )}
          </div>

          <div>
            <label htmlFor={`${idPrefix}-email`} className={labelClasses}>
              {t.fields.email} <span className="text-red-500">*</span>
            </label>
            <input
              id={`${idPrefix}-email`}
              type="email"
              value={state.email}
              onChange={(e) => setField("email", e.target.value)}
              placeholder={t.placeholders.email}
              className={inputClasses}
              aria-invalid={Boolean(fieldErrors.email)}
              aria-describedby={fieldErrors.email ? `${idPrefix}-email-error` : undefined}
            />
            {fieldErrors.email && (
              <p id={`${idPrefix}-email-error`} className={errorClasses}>
                {fieldErrors.email}
              </p>
            )}
          </div>

          <div>
            <label htmlFor={`${idPrefix}-company`} className={labelClasses}>
              {t.fields.company} <span className="text-red-500">*</span>
            </label>
            <input
              id={`${idPrefix}-company`}
              type="text"
              value={state.company}
              onChange={(e) => setField("company", e.target.value)}
              placeholder={t.placeholders.company}
              className={inputClasses}
              aria-invalid={Boolean(fieldErrors.company)}
              aria-describedby={fieldErrors.company ? `${idPrefix}-company-error` : undefined}
            />
            {fieldErrors.company && (
              <p id={`${idPrefix}-company-error`} className={errorClasses}>
                {fieldErrors.company}
              </p>
            )}
          </div>

          <div>
            <label htmlFor={`${idPrefix}-phone`} className={labelClasses}>
              {t.fields.phone}
            </label>
            <input
              id={`${idPrefix}-phone`}
              type="tel"
              value={state.phone}
              onChange={(e) => setField("phone", e.target.value)}
              placeholder={t.placeholders.phone}
              className={inputClasses}
            />
          </div>

          {contextType === "equivalence" && (
            <div className="sm:col-span-2">
              <label htmlFor={`${idPrefix}-competitorRef`} className={labelClasses}>
                {t.fields.competitorRef}
              </label>
              <input
                id={`${idPrefix}-competitorRef`}
                type="text"
                value={state.competitorRef}
                onChange={(e) => setField("competitorRef", e.target.value)}
                placeholder={t.placeholders.competitorRef}
                className={inputClasses}
              />
            </div>
          )}

          {contextType === "product" && (
            <div className="sm:col-span-2">
              <label htmlFor={`${idPrefix}-operatingMode`} className={labelClasses}>
                {t.fields.operatingMode}
              </label>
              <select
                id={`${idPrefix}-operatingMode`}
                value={state.operatingMode}
                onChange={(e) => setField("operatingMode", e.target.value as OperatingMode | "")}
                className={inputClasses}
              >
                <option value="">{t.operatingModeOptions.placeholder}</option>
                <option value="continuous">{t.operatingModeOptions.continuous}</option>
                <option value="strobe_overdrive">{t.operatingModeOptions.strobe_overdrive}</option>
                <option value="undetermined">{t.operatingModeOptions.undetermined}</option>
              </select>
            </div>
          )}

          {contextType === "wiring" && (
            <div className="sm:col-span-2">
              <label htmlFor={`${idPrefix}-cameraModel`} className={labelClasses}>
                {t.fields.cameraModel}
              </label>
              <input
                id={`${idPrefix}-cameraModel`}
                type="text"
                value={state.cameraModel}
                onChange={(e) => setField("cameraModel", e.target.value)}
                placeholder={t.placeholders.cameraModel}
                className={inputClasses}
              />
            </div>
          )}

          {contextType === "lighting_diagnostic" && (
            <div className="sm:col-span-2">
              <label htmlFor={`${idPrefix}-defectType`} className={labelClasses}>
                {t.fields.defectType} <span className="text-red-500">*</span>
              </label>
              <select
                id={`${idPrefix}-defectType`}
                value={state.defectType}
                onChange={(e) => setField("defectType", e.target.value as DefectType | "")}
                className={inputClasses}
                aria-invalid={Boolean(fieldErrors.defectType)}
                aria-describedby={fieldErrors.defectType ? `${idPrefix}-defectType-error` : undefined}
              >
                <option value="">{t.defectTypeOptions.placeholder}</option>
                <option value="scratches">{t.defectTypeOptions.scratches}</option>
                <option value="edges">{t.defectTypeOptions.edges}</option>
                <option value="presence_absence">{t.defectTypeOptions.presence_absence}</option>
                <option value="barcode">{t.defectTypeOptions.barcode}</option>
                <option value="other">{t.defectTypeOptions.other}</option>
              </select>
              {fieldErrors.defectType && (
                <p id={`${idPrefix}-defectType-error`} className={errorClasses}>
                  {fieldErrors.defectType}
                </p>
              )}
            </div>
          )}

          {(contextType === "optical_guide" || contextType === "lighting_diagnostic") && (
            <div className="sm:col-span-2">
              <label htmlFor={`${idPrefix}-materialType`} className={labelClasses}>
                {t.fields.materialType}
              </label>
              <select
                id={`${idPrefix}-materialType`}
                value={state.materialType}
                onChange={(e) => setField("materialType", e.target.value as MaterialType | "")}
                className={inputClasses}
              >
                <option value="">{t.materialTypeOptions.placeholder}</option>
                <option value="metal">{t.materialTypeOptions.metal}</option>
                <option value="plastic">{t.materialTypeOptions.plastic}</option>
                <option value="glass">{t.materialTypeOptions.glass}</option>
                <option value="film_packaging">{t.materialTypeOptions.film_packaging}</option>
                <option value="other">{t.materialTypeOptions.other}</option>
              </select>
            </div>
          )}

          {contextType === "lighting_diagnostic" && (
            <div className="sm:col-span-2">
              <label htmlFor={`${idPrefix}-partPhoto`} className={labelClasses}>
                {t.fields.partPhoto}
              </label>
              <input
                id={`${idPrefix}-partPhoto`}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => setField("partPhoto", e.target.files?.[0] ?? null)}
                className="mt-1 w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-200 file:px-3 file:py-2 file:text-sm file:font-medium file:text-slate-800 hover:file:bg-slate-300 dark:text-slate-300 dark:file:bg-slate-800 dark:file:text-slate-100"
                aria-invalid={Boolean(fieldErrors.partPhoto)}
                aria-describedby={
                  fieldErrors.partPhoto ? `${idPrefix}-partPhoto-error` : `${idPrefix}-partPhoto-hint`
                }
              />
              <p id={`${idPrefix}-partPhoto-hint`} className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {t.partPhotoHint}
              </p>
              {fieldErrors.partPhoto && (
                <p id={`${idPrefix}-partPhoto-error`} className={errorClasses}>
                  {fieldErrors.partPhoto}
                </p>
              )}
            </div>
          )}

          <div className="sm:col-span-2">
            <label htmlFor={`${idPrefix}-message`} className={labelClasses}>
              {t.fields.message}{" "}
              {contextType !== "lighting_diagnostic" && <span className="text-red-500">*</span>}
            </label>
            <textarea
              id={`${idPrefix}-message`}
              value={state.message}
              onChange={(e) => setField("message", e.target.value)}
              placeholder={t.placeholders.message}
              rows={4}
              className={inputClasses}
              aria-invalid={Boolean(fieldErrors.message)}
              aria-describedby={fieldErrors.message ? `${idPrefix}-message-error` : undefined}
            />
            {fieldErrors.message && (
              <p id={`${idPrefix}-message-error`} className={errorClasses}>
                {fieldErrors.message}
              </p>
            )}
          </div>
        </div>

        {status === "error" && (
          <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800 dark:bg-red-950/30 dark:text-red-300">
            {t.error}
          </p>
        )}

        <button
          type="submit"
          disabled={status === "submitting"}
          className="mt-6 inline-flex rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "submitting"
            ? t.submitting
            : contextType === "lighting_diagnostic"
              ? t.submitDiagnostic
              : t.submit}
        </button>

        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">{t.gdpr}</p>

        <a
          href={mailtoHref}
          className="mt-4 inline-block text-sm font-medium text-amber-700 underline hover:text-amber-600 dark:text-amber-400 dark:hover:text-amber-300"
        >
          {t.mailtoLabel}
        </a>
      </form>
    </div>
  );
}
