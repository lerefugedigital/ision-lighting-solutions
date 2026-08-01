"use client";

import { useId, useState, type FormEvent } from "react";
import { trackLeadGenerated } from "@/lib/gtag";

type SubmitStatus = "idle" | "submitting" | "success" | "error";

export interface DatasheetDownloadModalProps {
  locale: "en" | "fr";
  productName: string;
  isOpen: boolean;
  onClose: () => void;
  /** Called once the lead is captured and validated server-side — the parent
   *  is responsible for persisting the unlock state and triggering the actual
   *  download/print. */
  onUnlocked: () => void;
}

const SUBJECT_PREFIX: Record<"en" | "fr", string> = {
  en: "Datasheet Download",
  fr: "Téléchargement Datasheet",
};

const TEXT = {
  en: {
    title: "Download Technical Datasheet",
    subtitle: "Get the full optical specifications, mechanical dimensions and M12 wiring diagrams.",
    fields: { email: "Professional Email", company: "Company" },
    placeholders: { email: "jane.smith@company.com", company: "Your company" },
    submit: "Get the PDF Datasheet",
    submitting: "Sending…",
    success:
      "Your request has been sent to our application lab. An engineer will get back to you within 2 business hours — your download has started.",
    error: "Something went wrong. Please try again, or contact us directly.",
    close: "Close",
    requiredField: "This field is required.",
    invalidEmail: "Please enter a valid professional email address.",
  },
  fr: {
    title: "Télécharger la fiche technique (PDF)",
    subtitle: "Obtenez l'ensemble des spécifications optiques, cotes mécaniques et schémas de câblage M12.",
    fields: { email: "Email Professionnel", company: "Société / Entreprise" },
    placeholders: { email: "jean.dupont@entreprise.com", company: "Votre entreprise" },
    submit: "Obtenir la Datasheet PDF",
    submitting: "Envoi en cours…",
    success:
      "Votre demande a bien été transmise à notre laboratoire d'application. Un ingénieur vous recontacte sous 2h ouvrées — votre téléchargement a démarré.",
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
  /** Honeypot — real users never fill this. */
  website: string;
}

const INITIAL_STATE: FormState = { email: "", company: "", website: "" };

export function DatasheetDownloadModal({ locale, productName, isOpen, onClose, onUnlocked }: DatasheetDownloadModalProps) {
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

    setStatus("submitting");
    const sourceUrl = window.location.href;
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: state.email,
          company: state.company,
          productName,
          website: state.website,
          contextType: "datasheet_download",
          subjectContext: `${SUBJECT_PREFIX[locale]} - ${productName}`,
          locale,
          source_url: sourceUrl,
        }),
      });
      if (!res.ok) throw new Error("Request failed");
      trackLeadGenerated({ silo: "eclairages", formType: "datasheet_download", subject: productName, locale, sourceUrl });
      onUnlocked();
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
          <>
            <p className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-900 dark:border-emerald-900/50 dark:bg-emerald-950/20 dark:text-emerald-300">
              {t.success}
            </p>
            <button
              type="button"
              onClick={handleClose}
              className="mt-4 w-full rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-amber-400"
            >
              {t.close}
            </button>
          </>
        ) : (
          <>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{t.subtitle}</p>

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

          {status === "error" && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800 dark:bg-red-950/30 dark:text-red-300">{t.error}</p>
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
