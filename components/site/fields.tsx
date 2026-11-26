/**
 * Fields — the three kinds of work the lab does. Each is a glass pane with
 * a slowly floating glyph; the pane lights up under the pointer.
 */
import { getTranslations } from 'next-intl/server';
import { AppWindow, BrainCircuit, Cpu } from 'lucide-react';

const FIELDS = [
  { key: 'apps', Icon: AppWindow },
  { key: 'software', Icon: Cpu },
  { key: 'intelligence', Icon: BrainCircuit },
] as const;

export async function Fields() {
  const t = await getTranslations('home.fields.items');

  return (
    <ul className="grid gap-4 md:grid-cols-3" data-stagger>
      {FIELDS.map(({ key, Icon }, i) => (
        <li key={key} data-reveal className="glass glass-live flex min-h-[19rem] flex-col rounded-[22px] p-7">
          <span
            aria-hidden
            className="float glass grid h-16 w-16 place-items-center rounded-[18px] text-[var(--accent)]"
            style={{ '--d': `${i * -2300}ms` } as React.CSSProperties}
          >
            <Icon size={28} strokeWidth={1.5} />
          </span>
          <h3 className="t-display mt-auto pt-10 text-[3rem] text-[var(--fg)]">{t(`${key}.title`)}</h3>
          <p className="mt-3 text-[16.5px] leading-relaxed text-[var(--fg-2)]">{t(`${key}.line`)}</p>
        </li>
      ))}
    </ul>
  );
}
