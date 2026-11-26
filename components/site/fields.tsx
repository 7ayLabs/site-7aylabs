/**
 * Fields — the lab's four kinds of work, as columns of glass. The column
 * under the pointer (or holding keyboard focus) opens up and shows its
 * description in full; the others step back.
 */
import { getTranslations } from 'next-intl/server';
import { AppWindow, Blocks, BrainCircuit, Cpu } from 'lucide-react';

const FIELDS = [
  { key: 'apps', Icon: AppWindow },
  { key: 'software', Icon: Cpu },
  { key: 'intelligence', Icon: BrainCircuit },
  { key: 'onchain', Icon: Blocks },
] as const;

export async function Fields() {
  const t = await getTranslations('home.fields.items');

  return (
    <ul className="fan" data-stagger>
      {FIELDS.map(({ key, Icon }, i) => (
        <li key={key} data-reveal tabIndex={0} className="glass glass-live flex flex-col overflow-hidden rounded-[26px] p-7 focus-visible:outline-offset-4">
          <span
            aria-hidden
            className="float grid h-16 w-16 place-items-center rounded-[18px] bg-[var(--accent-fill)] text-[var(--on-accent)] shadow-[0_18px_30px_-14px_var(--accent-fill)]"
            style={{ '--d': `${i * -1900}ms` } as React.CSSProperties}
          >
            <Icon size={28} strokeWidth={1.5} />
          </span>
          <h3 className="t-display mt-auto pt-12 text-[clamp(2.4rem,3.4vw,3.4rem)] text-[var(--fg)]">{t(`${key}.title`)}</h3>
          <p className="mt-3 min-w-[15rem] max-w-[34ch] text-[16.5px] leading-relaxed text-[var(--fg-2)]">{t(`${key}.line`)}</p>
        </li>
      ))}
    </ul>
  );
}
