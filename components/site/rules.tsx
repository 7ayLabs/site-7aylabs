/**
 * Rules — the lab's four rules as a table: the rule, what it means in
 * practice, and where anyone can check it. The practice column stands
 * forward because it is the one that commits us to something.
 */
import { getTranslations } from 'next-intl/server';
import { Check } from 'lucide-react';

const ROWS = ['receipts', 'plain', 'privacy', 'ship'] as const;

export async function Rules() {
  const t = await getTranslations('home.method');

  return (
    <div className="glass overflow-x-auto rounded-[24px]">
      <table className="rules w-full min-w-[720px] border-collapse text-[15.5px]">
        <thead>
          <tr className="text-[14px] text-[var(--fg-2)]">
            <th scope="col" className="w-[24%] font-semibold">
              {t('table.rule')}
            </th>
            <th scope="col" className="lead w-[44%] font-bold uppercase tracking-[0.08em] text-[var(--fg)]">
              {t('table.practice')}
            </th>
            <th scope="col" className="font-semibold">
              {t('table.check')}
            </th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((k) => (
            <tr key={k}>
              <th scope="row" className="font-semibold text-[var(--fg)]">
                {t(`items.${k}.title`)}
              </th>
              <td className="lead text-[var(--fg)]">
                <span className="flex gap-3">
                  <span aria-hidden className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[var(--fg)] text-[var(--bg)]">
                    <Check size={13} strokeWidth={3} />
                  </span>
                  {t(`table.rows.${k}.practice`)}
                </span>
              </td>
              <td className="text-[var(--fg-2)]">{t(`table.rows.${k}.check`)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
