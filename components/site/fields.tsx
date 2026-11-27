/**
 * Fields — the lab's four instruments (scan, track, decode, ship), in the
 * order the work flows, as columns of glass. The column
 * under the pointer (or holding keyboard focus) opens up and shows its
 * description in full; the others step back.
 */
import { getTranslations } from 'next-intl/server';
import { AppWindow, Blocks, BrainCircuit, Cpu } from 'lucide-react';
import { GlassIcon } from './glass3d/glass-icon';

const FIELDS = [
  { key: 'onchain', Icon: Blocks },
  { key: 'software', Icon: Cpu },
  { key: 'intelligence', Icon: BrainCircuit },
  { key: 'apps', Icon: AppWindow },
] as const;

export async function Fields() {
  const t = await getTranslations('home.fields.items');

  return (
    <ul className="fan" data-stagger>
      {FIELDS.map(({ key, Icon }) => (
        <li key={key} data-reveal tabIndex={0} className="glass glass-live flex flex-col overflow-hidden rounded-[26px] p-7 focus-visible:outline-offset-4">
          <GlassIcon shape={key} size={190} fallback={<Icon size={44} strokeWidth={1.3} />} className="-ml-7 -mt-6" />
          <h3 className="t-display mt-auto pt-6 text-[clamp(1.6rem,2.1vw,2.2rem)] text-[var(--fg)]">{t(`${key}.title`)}</h3>
          <p className="mt-3 max-w-[34ch] text-[16.5px] leading-relaxed text-[var(--fg-2)]">{t(`${key}.line`)}</p>
        </li>
      ))}
    </ul>
  );
}
