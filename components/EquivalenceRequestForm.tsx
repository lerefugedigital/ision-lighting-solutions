"use client";

import { useState } from "react";

export interface EquivalenceRequestFormLabels {
  title: string;
  description: string;
  placeholder: string;
  submitLabel: string;
  disclaimer: string;
}

interface EquivalenceRequestFormProps {
  labels: EquivalenceRequestFormLabels;
  subjectPrefix: string;
}

const CONTACT_EMAIL = "sourcing@vision-lighting-solutions.com";

export function EquivalenceRequestForm({ labels, subjectPrefix }: EquivalenceRequestFormProps) {
  const [reference, setReference] = useState("");

  const mailtoHref = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subjectPrefix)}&body=${encodeURIComponent(
    reference
  )}`;

  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-900/50 dark:bg-amber-950/20 sm:p-8">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{labels.title}</h2>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{labels.description}</p>

      <textarea
        value={reference}
        onChange={(e) => setReference(e.target.value)}
        placeholder={labels.placeholder}
        rows={3}
        className="mt-4 w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900 outline-none focus:border-amber-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
      />

      <a
        href={mailtoHref}
        className="mt-4 inline-flex rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-amber-400"
      >
        {labels.submitLabel}
      </a>

      <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">{labels.disclaimer}</p>
    </div>
  );
}
