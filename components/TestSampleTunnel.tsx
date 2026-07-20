"use client";

import { useId, useState, type FormEvent } from "react";
import { trackEvent } from "@/lib/gtag";

export interface TestSampleTunnelProps {
  locale: "en" | "fr";
}

type Tab = "loan" | "lab";
type SubmitStatus = "idle" | "submitting" | "success" | "error";
type ProductOption = "bar_lights" | "domes" | "backlights" | "coaxial" | "spot" | "other";
type Duration = "1_week" | "2_weeks";
type LabMaterialType = "metal" | "plastic" | "glass" | "food" | "other";
type OperatingMode = "continuous" | "strobe_overdrive";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const TEXT = {
  en: {
    chooseTitle: "Choose Your Path",
    tabs: { loan: "Request a Demo Kit / Loan Equipment", lab: "Send Us Your Parts for Lab Analysis" },
    loan: {
      audienceNote: "For integrators and engineering teams who want to test the hardware on their own bench.",
      fields: {
        name: "Full Name",
        email: "Professional Email",
        company: "Company",
        phone: "Phone",
        product: "Product(s) to Test",
        productOther: "Please specify",
        desiredStartDate: "Desired Test Start Date",
        duration: "Estimated Duration",
        deliveryAddress: "Equipment Delivery Address",
      },
      placeholders: {
        name: "Jane Smith",
        email: "jane.smith@company.com",
        company: "Your company",
        phone: "+1 555 123 4567",
        productOther: "e.g. Custom lighting geometry…",
        deliveryAddress: "Street, city, postal code, country",
      },
      productOptions: {
        placeholder: "Select…",
        bar_lights: "LED Bar Lights",
        domes: "Diffuse Dome Lights",
        backlights: "Backlights",
        coaxial: "Coaxial Lights",
        spot: "Spotlights",
        other: "Other (please specify)",
      },
      durationOptions: { placeholder: "Select…", "1_week": "1 week", "2_weeks": "2 weeks" },
      submit: "Request the Loan Kit",
      submitting: "Sending…",
      success:
        "Your loan request has been submitted. An engineer will confirm equipment availability and get back to you within 4 hours.",
      error: "Something went wrong sending your request. Please try again, or contact us directly.",
      requiredField: "This field is required.",
      invalidEmail: "Please enter a valid professional email address.",
    },
    lab: {
      audienceNote: "For clients who want one of our vision engineers to run the contrast study for them.",
      steps: [
        { title: "1. Fill in the Form & Ship Your Parts", body: "Complete the form below and send us a physical sample of the part you need to inspect." },
        { title: "2. We Run the Test Bench", body: "Our engineers try the relevant wavelengths, lighting geometries and filters on our optical test bench." },
        { title: "3. Full Report Within 48h", body: "You receive a complete image expertise report plus our hardware recommendation for your line." },
      ],
      fields: {
        name: "Full Name",
        email: "Professional Email",
        company: "Company",
        phone: "Phone",
        opticalProblem: "Optical Problem Description",
        materialType: "Material Type",
        operatingMode: "Line Rate / Estimated Exposure Time",
      },
      placeholders: {
        name: "Jane Smith",
        email: "jane.smith@company.com",
        company: "Your company",
        phone: "+1 555 123 4567",
        opticalProblem: "e.g. glare, low contrast, code reading failures…",
      },
      materialTypeOptions: {
        placeholder: "Select…",
        metal: "Metal",
        plastic: "Plastic",
        glass: "Glass",
        food: "Food & Beverage",
        other: "Other",
      },
      operatingModeOptions: { placeholder: "Select…", continuous: "Continuous", strobe_overdrive: "Strobe / Overdrive" },
      submit: "Send My Sample Test Request",
      submitting: "Sending…",
      success:
        "Your request has been recorded. A shipping voucher / label and sending instructions have been emailed to you.",
      error: "Something went wrong sending your request. Please try again, or contact us directly.",
      requiredField: "This field is required.",
      invalidEmail: "Please enter a valid professional email address.",
    },
  },
  fr: {
    chooseTitle: "Choisissez Votre Parcours",
    tabs: { loan: "Demander une valise de prêt / Matériel de démo", lab: "Nous envoyer vos pièces pour analyse en laboratoire" },
    loan: {
      audienceNote: "Pour les intégrateurs et bureaux d'études souhaitant tester le matériel sur leur propre banc.",
      fields: {
        name: "Nom / Prénom",
        email: "Email Professionnel",
        company: "Société",
        phone: "Téléphone",
        product: "Produit(s) à Tester",
        productOther: "Merci de préciser",
        desiredStartDate: "Date Souhaitée de Début de Test",
        duration: "Durée Estimée",
        deliveryAddress: "Adresse de Livraison du Matériel",
      },
      placeholders: {
        name: "Jean Dupont",
        email: "jean.dupont@entreprise.com",
        company: "Votre entreprise",
        phone: "+33 6 12 34 56 78",
        productOther: "ex : géométrie d'éclairage spécifique…",
        deliveryAddress: "Rue, ville, code postal, pays",
      },
      productOptions: {
        placeholder: "Sélectionner…",
        bar_lights: "Barres LED",
        domes: "Dômes Diffus",
        backlights: "Backlights",
        coaxial: "Coaxiaux",
        spot: "Spots",
        other: "Autre (préciser)",
      },
      durationOptions: { placeholder: "Sélectionner…", "1_week": "1 semaine", "2_weeks": "2 semaines" },
      submit: "Demander la Valise de Prêt",
      submitting: "Envoi en cours…",
      success:
        "Votre demande de prêt a été transmise. Un ingénieur valide la disponibilité du matériel et vous recontacte sous 4h.",
      error: "Une erreur est survenue lors de l'envoi. Réessayez, ou contactez-nous directement.",
      requiredField: "Ce champ est requis.",
      invalidEmail: "Merci de saisir une adresse email professionnelle valide.",
    },
    lab: {
      audienceNote: "Pour les clients souhaitant qu'un ingénieur vision réalise l'étude de contraste pour eux.",
      steps: [
        { title: "1. Complétez le Formulaire & Expédiez vos Pièces", body: "Remplissez le formulaire ci-dessous et envoyez-nous un échantillon physique de la pièce à contrôler." },
        { title: "2. Nos Ingénieurs Réalisent les Bancs d'Essais", body: "Nos ingénieurs testent les longueurs d'onde, géométries d'éclairage et filtres pertinents sur notre banc d'essai optique." },
        { title: "3. Rapport Complet sous 48h", body: "Vous recevez un rapport d'expertise d'image complet ainsi que notre préconisation matériel pour votre ligne." },
      ],
      fields: {
        name: "Nom / Prénom",
        email: "Email Professionnel",
        company: "Société",
        phone: "Téléphone",
        opticalProblem: "Description du Problème Optique",
        materialType: "Type de Matériau",
        operatingMode: "Cadence de Ligne / Temps de Pose Estimé",
      },
      placeholders: {
        name: "Jean Dupont",
        email: "jean.dupont@entreprise.com",
        company: "Votre entreprise",
        phone: "+33 6 12 34 56 78",
        opticalProblem: "ex : reflets, manque de contraste, échec de lecture de code…",
      },
      materialTypeOptions: {
        placeholder: "Sélectionner…",
        metal: "Métal",
        plastic: "Plastique",
        glass: "Verre",
        food: "Agroalimentaire",
        other: "Autre",
      },
      operatingModeOptions: { placeholder: "Sélectionner…", continuous: "Continu", strobe_overdrive: "Strobe Overdrive" },
      submit: "Envoyer ma Demande d'Essai",
      submitting: "Envoi en cours…",
      success:
        "Formulaire enregistré. Un bon de transport / étiquette d'expédition et les consignes d'envoi vous ont été transmis par e-mail.",
      error: "Une erreur est survenue lors de l'envoi. Réessayez, ou contactez-nous directement.",
      requiredField: "Ce champ est requis.",
      invalidEmail: "Merci de saisir une adresse email professionnelle valide.",
    },
  },
} as const;

const inputClasses =
  "mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100";
const labelClasses = "text-sm font-medium text-slate-700 dark:text-slate-300";
const errorClasses = "mt-1 text-xs text-red-600 dark:text-red-400";

function Honeypot({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <input
      type="text"
      name="website"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      tabIndex={-1}
      autoComplete="off"
      aria-hidden="true"
      className="absolute left-[-9999px] h-0 w-0 opacity-0"
    />
  );
}

function SuccessScreen({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 dark:border-emerald-900/50 dark:bg-emerald-950/20 sm:p-8">
      <p className="text-sm font-medium text-emerald-900 dark:text-emerald-300">{message}</p>
    </div>
  );
}

interface LoanFormState {
  name: string;
  email: string;
  company: string;
  phone: string;
  product: ProductOption | "";
  productOther: string;
  desiredStartDate: string;
  duration: Duration | "";
  deliveryAddress: string;
  website: string;
}

const LOAN_INITIAL_STATE: LoanFormState = {
  name: "",
  email: "",
  company: "",
  phone: "",
  product: "",
  productOther: "",
  desiredStartDate: "",
  duration: "",
  deliveryAddress: "",
  website: "",
};

function LoanForm({ locale }: { locale: "en" | "fr" }) {
  const t = TEXT[locale].loan;
  const idPrefix = useId();
  const [state, setState] = useState<LoanFormState>(LOAN_INITIAL_STATE);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof LoanFormState, string>>>({});
  const [status, setStatus] = useState<SubmitStatus>("idle");

  function setField<K extends keyof LoanFormState>(key: K, value: LoanFormState[K]) {
    setState((prev) => ({ ...prev, [key]: value }));
  }

  function validate(): Partial<Record<keyof LoanFormState, string>> {
    const errors: Partial<Record<keyof LoanFormState, string>> = {};
    if (!state.name.trim()) errors.name = t.requiredField;
    if (!state.email.trim()) errors.email = t.requiredField;
    else if (!EMAIL_REGEX.test(state.email.trim())) errors.email = t.invalidEmail;
    if (!state.company.trim()) errors.company = t.requiredField;
    if (!state.product) errors.product = t.requiredField;
    else if (state.product === "other" && !state.productOther.trim()) errors.productOther = t.requiredField;
    if (!state.desiredStartDate) errors.desiredStartDate = t.requiredField;
    if (!state.duration) errors.duration = t.requiredField;
    if (!state.deliveryAddress.trim()) errors.deliveryAddress = t.requiredField;
    return errors;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: state.name,
          email: state.email,
          company: state.company,
          phone: state.phone,
          product: state.product,
          productOther: state.productOther,
          desiredStartDate: state.desiredStartDate,
          duration: state.duration,
          deliveryAddress: state.deliveryAddress,
          website: state.website,
          contextType: "demo_loan",
          subjectContext: locale === "fr" ? "Demande de Valise de Prêt" : "Demo Kit Loan Request",
          locale,
        }),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      trackEvent("request_demo_loan", { product: state.product, duration: state.duration, locale });
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") return <SuccessScreen message={t.success} />;

  return (
    <form onSubmit={handleSubmit} className="mt-6" noValidate>
      <Honeypot value={state.website} onChange={(v) => setField("website", v)} />

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
          />
          {fieldErrors.name && <p className={errorClasses}>{fieldErrors.name}</p>}
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
          />
          {fieldErrors.email && <p className={errorClasses}>{fieldErrors.email}</p>}
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
          />
          {fieldErrors.company && <p className={errorClasses}>{fieldErrors.company}</p>}
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

        <div>
          <label htmlFor={`${idPrefix}-product`} className={labelClasses}>
            {t.fields.product} <span className="text-red-500">*</span>
          </label>
          <select
            id={`${idPrefix}-product`}
            value={state.product}
            onChange={(e) => setField("product", e.target.value as ProductOption | "")}
            className={inputClasses}
          >
            <option value="">{t.productOptions.placeholder}</option>
            <option value="bar_lights">{t.productOptions.bar_lights}</option>
            <option value="domes">{t.productOptions.domes}</option>
            <option value="backlights">{t.productOptions.backlights}</option>
            <option value="coaxial">{t.productOptions.coaxial}</option>
            <option value="spot">{t.productOptions.spot}</option>
            <option value="other">{t.productOptions.other}</option>
          </select>
          {fieldErrors.product && <p className={errorClasses}>{fieldErrors.product}</p>}
        </div>

        {state.product === "other" && (
          <div>
            <label htmlFor={`${idPrefix}-productOther`} className={labelClasses}>
              {t.fields.productOther} <span className="text-red-500">*</span>
            </label>
            <input
              id={`${idPrefix}-productOther`}
              type="text"
              value={state.productOther}
              onChange={(e) => setField("productOther", e.target.value)}
              placeholder={t.placeholders.productOther}
              className={inputClasses}
            />
            {fieldErrors.productOther && <p className={errorClasses}>{fieldErrors.productOther}</p>}
          </div>
        )}

        <div>
          <label htmlFor={`${idPrefix}-desiredStartDate`} className={labelClasses}>
            {t.fields.desiredStartDate} <span className="text-red-500">*</span>
          </label>
          <input
            id={`${idPrefix}-desiredStartDate`}
            type="date"
            value={state.desiredStartDate}
            onChange={(e) => setField("desiredStartDate", e.target.value)}
            className={inputClasses}
          />
          {fieldErrors.desiredStartDate && <p className={errorClasses}>{fieldErrors.desiredStartDate}</p>}
        </div>

        <div>
          <label htmlFor={`${idPrefix}-duration`} className={labelClasses}>
            {t.fields.duration} <span className="text-red-500">*</span>
          </label>
          <select
            id={`${idPrefix}-duration`}
            value={state.duration}
            onChange={(e) => setField("duration", e.target.value as Duration | "")}
            className={inputClasses}
          >
            <option value="">{t.durationOptions.placeholder}</option>
            <option value="1_week">{t.durationOptions["1_week"]}</option>
            <option value="2_weeks">{t.durationOptions["2_weeks"]}</option>
          </select>
          {fieldErrors.duration && <p className={errorClasses}>{fieldErrors.duration}</p>}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor={`${idPrefix}-deliveryAddress`} className={labelClasses}>
            {t.fields.deliveryAddress} <span className="text-red-500">*</span>
          </label>
          <textarea
            id={`${idPrefix}-deliveryAddress`}
            value={state.deliveryAddress}
            onChange={(e) => setField("deliveryAddress", e.target.value)}
            placeholder={t.placeholders.deliveryAddress}
            rows={3}
            className={inputClasses}
          />
          {fieldErrors.deliveryAddress && <p className={errorClasses}>{fieldErrors.deliveryAddress}</p>}
        </div>
      </div>

      {status === "error" && (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800 dark:bg-red-950/30 dark:text-red-300">{t.error}</p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-6 inline-flex rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "submitting" ? t.submitting : t.submit}
      </button>
    </form>
  );
}

interface LabFormState {
  name: string;
  email: string;
  company: string;
  phone: string;
  opticalProblem: string;
  materialType: LabMaterialType | "";
  operatingMode: OperatingMode | "";
  website: string;
}

const LAB_INITIAL_STATE: LabFormState = {
  name: "",
  email: "",
  company: "",
  phone: "",
  opticalProblem: "",
  materialType: "",
  operatingMode: "",
  website: "",
};

function LabForm({ locale }: { locale: "en" | "fr" }) {
  const t = TEXT[locale].lab;
  const idPrefix = useId();
  const [state, setState] = useState<LabFormState>(LAB_INITIAL_STATE);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof LabFormState, string>>>({});
  const [status, setStatus] = useState<SubmitStatus>("idle");

  function setField<K extends keyof LabFormState>(key: K, value: LabFormState[K]) {
    setState((prev) => ({ ...prev, [key]: value }));
  }

  function validate(): Partial<Record<keyof LabFormState, string>> {
    const errors: Partial<Record<keyof LabFormState, string>> = {};
    if (!state.name.trim()) errors.name = t.requiredField;
    if (!state.email.trim()) errors.email = t.requiredField;
    else if (!EMAIL_REGEX.test(state.email.trim())) errors.email = t.invalidEmail;
    if (!state.company.trim()) errors.company = t.requiredField;
    if (!state.opticalProblem.trim()) errors.opticalProblem = t.requiredField;
    if (!state.materialType) errors.materialType = t.requiredField;
    if (!state.operatingMode) errors.operatingMode = t.requiredField;
    return errors;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: state.name,
          email: state.email,
          company: state.company,
          phone: state.phone,
          opticalProblem: state.opticalProblem,
          materialType: state.materialType,
          operatingMode: state.operatingMode,
          website: state.website,
          contextType: "lab_analysis",
          subjectContext: locale === "fr" ? "Demande d'Analyse en Laboratoire" : "Lab Sample Analysis Request",
          locale,
        }),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      trackEvent("request_sample_test", { material_type: state.materialType, operating_mode: state.operatingMode, locale });
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") return <SuccessScreen message={t.success} />;

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-3">
        {t.steps.map((step) => (
          <div key={step.title} className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{step.title}</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-600 dark:text-slate-300">{step.body}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mt-6" noValidate>
        <Honeypot value={state.website} onChange={(v) => setField("website", v)} />

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
            />
            {fieldErrors.name && <p className={errorClasses}>{fieldErrors.name}</p>}
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
            />
            {fieldErrors.email && <p className={errorClasses}>{fieldErrors.email}</p>}
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
            />
            {fieldErrors.company && <p className={errorClasses}>{fieldErrors.company}</p>}
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

          <div className="sm:col-span-2">
            <label htmlFor={`${idPrefix}-opticalProblem`} className={labelClasses}>
              {t.fields.opticalProblem} <span className="text-red-500">*</span>
            </label>
            <textarea
              id={`${idPrefix}-opticalProblem`}
              value={state.opticalProblem}
              onChange={(e) => setField("opticalProblem", e.target.value)}
              placeholder={t.placeholders.opticalProblem}
              rows={3}
              className={inputClasses}
            />
            {fieldErrors.opticalProblem && <p className={errorClasses}>{fieldErrors.opticalProblem}</p>}
          </div>

          <div>
            <label htmlFor={`${idPrefix}-materialType`} className={labelClasses}>
              {t.fields.materialType} <span className="text-red-500">*</span>
            </label>
            <select
              id={`${idPrefix}-materialType`}
              value={state.materialType}
              onChange={(e) => setField("materialType", e.target.value as LabMaterialType | "")}
              className={inputClasses}
            >
              <option value="">{t.materialTypeOptions.placeholder}</option>
              <option value="metal">{t.materialTypeOptions.metal}</option>
              <option value="plastic">{t.materialTypeOptions.plastic}</option>
              <option value="glass">{t.materialTypeOptions.glass}</option>
              <option value="food">{t.materialTypeOptions.food}</option>
              <option value="other">{t.materialTypeOptions.other}</option>
            </select>
            {fieldErrors.materialType && <p className={errorClasses}>{fieldErrors.materialType}</p>}
          </div>

          <div>
            <label htmlFor={`${idPrefix}-operatingMode`} className={labelClasses}>
              {t.fields.operatingMode} <span className="text-red-500">*</span>
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
            </select>
            {fieldErrors.operatingMode && <p className={errorClasses}>{fieldErrors.operatingMode}</p>}
          </div>
        </div>

        {status === "error" && (
          <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800 dark:bg-red-950/30 dark:text-red-300">{t.error}</p>
        )}

        <button
          type="submit"
          disabled={status === "submitting"}
          className="mt-6 inline-flex rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "submitting" ? t.submitting : t.submit}
        </button>
      </form>
    </>
  );
}

export function TestSampleTunnel({ locale }: TestSampleTunnelProps) {
  const [tab, setTab] = useState<Tab>("loan");
  const t = TEXT[locale];

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900 sm:p-8">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{t.chooseTitle}</h2>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:gap-3">
        {(["loan", "lab"] as const).map((key) => {
          const active = tab === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              aria-pressed={active}
              className={
                "flex-1 rounded-lg border px-4 py-3 text-left text-sm font-semibold transition " +
                (active
                  ? "border-amber-500 bg-amber-50 text-amber-800 dark:border-amber-500 dark:bg-amber-950/20 dark:text-amber-400"
                  : "border-slate-200 bg-white text-slate-600 hover:border-amber-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300 dark:hover:border-amber-700")
              }
            >
              {t.tabs[key]}
            </button>
          );
        })}
      </div>

      <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">{t[tab].audienceNote}</p>

      <div className="mt-2">{tab === "loan" ? <LoanForm locale={locale} /> : <LabForm locale={locale} />}</div>
    </div>
  );
}
