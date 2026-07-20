export interface ReassuranceBarProps {
  locale: "en" | "fr";
  variant?: "full" | "compact";
}

interface Pillar {
  icon: string;
  title: string;
  description: string;
}

const PILLARS: Record<"en" | "fr", Pillar[]> = {
  en: [
    {
      icon: "📦",
      title: "Dual Sourcing & Stock",
      description: "In-stock alternatives, fast shipping across Europe.",
    },
    {
      icon: "🔬",
      title: "Feasibility Testing",
      description: "Borrow a demo case and test on your own parts in the lab.",
    },
    {
      icon: "⚡",
      title: "Engineering Support",
      description: "Optical schematic validation and overdrive calculation within 24h.",
    },
    {
      icon: "🛡️",
      title: "Compliance & Durability",
      description: "Certified industrial 24VDC products, 3-year warranty.",
    },
  ],
  fr: [
    {
      icon: "📦",
      title: "Dual Sourcing & Stock",
      description: "Alternatives en stock, expédition rapide en Europe.",
    },
    {
      icon: "🔬",
      title: "Test de Faisabilité",
      description: "Valise de prêt d'éclairages et essais sur vos pièces en laboratoire.",
    },
    {
      icon: "⚡",
      title: "Support Ingénierie",
      description: "Validation de votre schéma optique et calcul overdrive sous 24h.",
    },
    {
      icon: "🛡️",
      title: "Conformité & Durabilité",
      description: "Produits industriels 24VDC certifiés, garantie 3 ans.",
    },
  ],
};

export function ReassuranceBar({ locale, variant = "full" }: ReassuranceBarProps) {
  const pillars = PILLARS[locale];

  if (variant === "compact") {
    return (
      <div className="rounded-2xl border border-slate-800 bg-[#0b1220] px-6 py-5">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((pillar) => (
            <div key={pillar.title} className="flex items-center gap-2.5">
              <span aria-hidden="true" className="text-lg">
                {pillar.icon}
              </span>
              <span className="text-sm font-medium text-slate-200">{pillar.title}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-[#0b1220] p-6 sm:p-8">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {pillars.map((pillar) => (
          <div key={pillar.title}>
            <span aria-hidden="true" className="text-2xl">
              {pillar.icon}
            </span>
            <h3 className="mt-2 text-sm font-semibold text-slate-100">{pillar.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-slate-400">{pillar.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
