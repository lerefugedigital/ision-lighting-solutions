"use client";

import { useId, useState, type FormEvent } from "react";

type SubmitStatus = "idle" | "submitting" | "success" | "error";

export interface CadRequestModalProps {
  locale: "en" | "fr";
  productName: string;
  isOpen: boolean;
  onClose: () => void;
}

const SUBJECT_PREFIX: Record<"en" | "fr", string> = {
  en: "3D CAD Request",
  fr: "Demande CAD 3D",
};

const TEXT = {
  en: {
    title: "Request the 3D Model (STEP)",
    description:
      "Our 3D models (STEP/IGES) are adjusted to your project's dimensions and mounting options. Fill in the form below — our engineering office will send you the CAD file within 24 business hours.",
    fields: { email: "Professional Email", company: "Company", reference: "Desired Dimensions / Length or Product Reference" },
    placeholders: { email: "jane.smith@company.com", company: "Your company", reference: "e.g. 300mm length, or ref. BAR-LED-300-W" },
    submit: "Request the File",
    submitting: "Sending…",
    success: "Thank you — your request has been recorded. Our engineering office will send you the CAD file within 24 business hours.",
    error: "Something went wrong. Please try again, or contact us directly.",
    close: "Close",
    requiredField: "This field is required.",
    invalidEmail: "Please enter a valid professional email address.",
  },
  fr: {
    title: "Demander le Modèle 3D (STEP)",
    description:
      "Nos modèles 3D (STEP/IGES) sont ajustés aux dimensions et options de fixation de votre projet. Complétez le formulaire ci-dessous, notre bureau d'études vous transmettra le fichier CAD sous 24h ouvrées.",
    fields: { email: "Email Professionnel", company: "Société", reference: "Dimensions / Longueur Souhaitée ou Référence Produit" },
    placeholders: { email: "jean.dupont@entreprise.com", company: "Votre entreprise", reference: "ex : longueur 300mm, ou réf. BAR-LED-300-B" },
    submit: "Demander le Fichier",
    submitting: "Envoi en cours…",
    success: "Merci — votre demande a été enregistrée. Notre bureau d'études vous transmettra le fichier CAD sous 24h ouvrées.",
    error: "Une erreur est survenue. Réessayez, ou contactez-nous directement.",
    close: "Fermer",
    requiredField: "Ce champ est requis.",
    invalidEmail: "Merci de saisir une adresse email professionnelle valide.",
  },
} as const;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface FormState {
  email: string;
  company: string;
  reference: string;
  /** Honeypot — real users never fill this. */
  website: string;
}

const INITIAL_STATE: FormState = { email: "", company: "", reference: "", website: "" };

export function CadRequestModal({ locale, productName, isOpen, onClose }: CadRequestModalProps) {
  const t = TEXT[locale];
  const idPrefix = useId();
  const [state, setState] = useState<FormState>(INITIAL_STATE);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [status, setStatus] = useState<SubmitStatus>("idle");

  if (!isOpen) return null;

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setState((prev) => ({ ...prev, [key]: value }));
  }

  function handleClose() {
    setState(INITIAL_STATE);
    setFieldErrors({});
    setStatus("idle");
    onClose();
  }

  function validate(): Partial<Record<keyof FormState, string>> {
    const errors: Partial<Record<keyof FormState, string>> = {};
    if (!state.email.trim()) errors.email = t.requiredField;
    else if (!EMAIL_REGEX.test(state.email.trim())) errors.email = t.invalidEmail;
    if (!state.company.trim()) errors.company = t.requiredField;
    return errors;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    // Immediate, non-blocking confirmation — the request is fired and the modal
    // switches to the success view without waiting on further user action.
    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: state.email,
          company: state.company,
          dimensionsOrReference: state.reference,
          cadFormat: "step",
          website: state.website,
          contextType: "cad_request",
          subjectContext: `${SUBJECT_PREFIX[locale]} - ${productName}`,
          locale,
        }),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  const inputClasses =
    "mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100";
  const labelClasses = "text-sm font-medium text-slate-700 dark:text-slate-300";
  const errorClasses = "mt-1 text-xs text-red-600 dark:text-red-400";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={`${idPrefix}-title`}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") handleClose();
      }}
    >
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <h2 id={`${idPrefix}-title`} className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            {t.title}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            aria-label={t.close}
            className="shrink-0 text-slate-400 transition hover:text-slate-700 dark:hover:text-slate-200"
          >
            ✕
          </button>
        </div>

        {status === "success" ? (
          <p className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-900 dark:border-emerald-900/50 dark:bg-emerald-950/20 dark:text-emerald-300">
            {t.success}
          </p>
        ) : (
          <>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{t.description}</p>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4" noValidate>
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
                <label htmlFor={`${idPrefix}-reference`} className={labelClasses}>
                  {t.fields.reference}
                </label>
                <input
                  id={`${idPrefix}-reference`}
                  type="text"
                  value={state.reference}
                  onChange={(e) => setField("reference", e.target.value)}
                  placeholder={t.placeholders.reference}
                  className={inputClasses}
                />
              </div>

              {status === "error" && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800 dark:bg-red-950/30 dark:text-red-300">
                  {t.error}
                </p>
              )}

              <button
                type="submit"
                disabled={status === "submitting"}
                className="w-full rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === "submitting" ? t.submitting : t.submit}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
