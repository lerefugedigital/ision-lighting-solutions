import { Link } from "@/i18n/navigation";

export interface CaseStudiesProps {
  locale: "en" | "fr";
}

interface ApplicationNote {
  context: string;
  problem: string;
  solution: string;
  result: string;
}

const TEXT: Record<
  "en" | "fr",
  {
    title: string;
    intro: string;
    contextLabel: string;
    problemLabel: string;
    solutionLabel: string;
    resultLabel: string;
    ctaLabel: string;
    disclaimer: string;
    notes: ApplicationNote[];
  }
> = {
  en: {
    title: "Application Notes & Optical Challenge Resolution",
    intro:
      "Three engineering application notes showing how the right optical principle — not a different camera or software — resolves the inspection challenge.",
    contextLabel: "Industrial Context",
    problemLabel: "Optical Problem",
    solutionLabel: "Solution & Geometry",
    resultLabel: "Physical Result",
    ctaLabel: "Test on your own parts",
    disclaimer:
      "Application notes based on real physical and optical principles — exact outcomes depend on your configuration and are validated during a lab sample test.",
    notes: [
      {
        context: "Food & Beverage / Packaging",
        problem: "Saturating glare on glossy plastic film during seal inspection.",
        solution: "630nm Diffuse Dome Lighting (omnidirectional light).",
        result: "Elimination of the specular hot spot and light homogeneity above 90%.",
      },
      {
        context: "Pharmaceutical / Vials",
        problem: "Liquid fill-level inspection through an opaque amber glass vial.",
        solution: "850nm Infrared Backlight, transmitted through the tinted glass.",
        result: "Optimal transmittance through the liquid, clean contrast on the meniscus.",
      },
      {
        context: "Metalworking / Automotive",
        problem: "Reading a laser-marked Data Matrix (DPM) code on a machined metal surface.",
        solution: "Darkfield Grazing Light + Crossed Polarization.",
        result: "Cancellation of directional glare, clean separation of the code's micro-relief.",
      },
    ],
  },
  fr: {
    title: "Notes d'Application & Résolution de Défis Optiques",
    intro:
      "Trois notes d'application ingénieur montrant comment le bon principe optique — et non une autre caméra ou un autre logiciel — résout le défi d'inspection.",
    contextLabel: "Contexte Industriel",
    problemLabel: "Problème Optique",
    solutionLabel: "Solution & Géométrie",
    resultLabel: "Résultat Physique",
    ctaLabel: "Tester sur vos pièces",
    disclaimer:
      "Notes d'application basées sur des principes physiques et optiques réels — le résultat exact dépend de votre configuration et est validé lors d'un test en laboratoire sur échantillon.",
    notes: [
      {
        context: "Agroalimentaire / Emballage",
        problem: "Reflets saturants sur film plastique brillant lors du contrôle de scellage.",
        solution: "Éclairage Dôme Diffus 630nm (lumière omnidirectionnelle).",
        result: "Élimination du point chaud (hotspot) et homogénéité lumineuse supérieure à 90%.",
      },
      {
        context: "Pharmacie / Flaconnage",
        problem: "Inspection du niveau de liquide à travers un flacon en verre ambré opaque.",
        solution: "Rétroéclairage Infrarouge 850nm, traversant le verre teinté.",
        result: "Transmittance optimale à travers le liquide, contraste net du ménisque.",
      },
      {
        context: "Métallurgie / Automobile",
        problem: "Lecture de code Datamatrix (DPM) gravé au laser sur surface métallique usinée.",
        solution: "Éclairage Rasant (Darkfield / champ sombre) + Polarisation croisée.",
        result: "Annulation des reflets de directivité, détachement net des micro-reliefs du code.",
      },
    ],
  },
};

export function CaseStudies({ locale }: CaseStudiesProps) {
  const t = TEXT[locale];

  return (
    <section>
      <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">{t.title}</h2>
      <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-300">{t.intro}</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {t.notes.map((item) => (
          <div key={item.context} className="flex flex-col rounded-xl border border-slate-200 p-6 dark:border-slate-800">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">{t.contextLabel}</p>
            <span className="mt-1.5 inline-flex w-fit rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-amber-800 dark:bg-amber-950/40 dark:text-amber-400">
              {item.context}
            </span>

            <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">{t.problemLabel}</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{item.problem}</p>
            </div>

            <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">{t.solutionLabel}</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{item.solution}</p>
            </div>

            <div className="mt-4 border-t border-slate-100 pt-4 dark:border-slate-800">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">{t.resultLabel}</p>
              <p className="mt-1 text-sm font-medium leading-relaxed text-slate-900 dark:text-slate-100">{item.result}</p>
            </div>

            <Link
              href={"/test-sur-echantillon" as never}
              className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-amber-600 hover:underline dark:text-amber-400"
            >
              {t.ctaLabel} →
            </Link>
          </div>
        ))}
      </div>

      <p className="mt-4 text-xs text-slate-400 dark:text-slate-500">{t.disclaimer}</p>
    </section>
  );
}
