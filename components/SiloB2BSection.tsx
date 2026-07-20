export interface SiloB2BItem {
  title: string;
  body: string;
}

export function SiloB2BSection({ title, items }: { title: string; items: SiloB2BItem[] }) {
  return (
    <section className="mt-14 border-t border-slate-200 pt-10 dark:border-slate-800">
      <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{title}</h2>
      <div className="mt-6 grid gap-6 sm:grid-cols-3">
        {items.map((item) => (
          <div key={item.title}>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{item.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
