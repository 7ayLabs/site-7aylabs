import { describe, expect, it } from 'vitest';
import en from '@/messages/en.json';
import es from '@/messages/es.json';
import fr from '@/messages/fr.json';

type Tree = { [k: string]: Tree | string | string[] };

function keys(node: Tree, prefix = ''): string[] {
  return Object.entries(node).flatMap(([k, v]) =>
    typeof v === 'string' || Array.isArray(v) ? [`${prefix}${k}`] : keys(v, `${prefix}${k}.`),
  );
}
function leaves(node: Tree): string[] {
  return Object.values(node).flatMap((v) => (typeof v === 'string' ? [v] : Array.isArray(v) ? v : leaves(v)));
}
const placeholders = (s: string) => (s.match(/\{[a-zA-Z]+\}/g) ?? []).sort().join(',');
function at(node: Tree, key: string): unknown {
  return key.split('.').reduce<unknown>((n, k) => (n as Tree)[k], node);
}

describe('messages', () => {
  const base = keys(en as Tree).sort();

  it.each([
    ['es', es],
    ['fr', fr],
  ])('%s has exactly the keys English has', (_name, bundle) => {
    expect(keys(bundle as Tree).sort()).toEqual(base);
  });

  it.each([
    ['es', es],
    ['fr', fr],
  ])('%s keeps the same placeholders and list lengths', (_name, bundle) => {
    for (const k of base) {
      const a = at(en as Tree, k);
      const b = at(bundle as Tree, k);
      if (Array.isArray(a)) expect((b as string[]).length, k).toBe(a.length);
      else expect(placeholders(b as string), k).toBe(placeholders(a as string));
    }
  });

  it('has no empty strings and nothing left over from the previous site', () => {
    for (const bundle of [en, es, fr]) {
      for (const v of leaves(bundle as Tree)) {
        expect(v.trim().length).toBeGreaterThan(0);
        expect(v).not.toMatch(/7aychain|proof of presence|devnet|validator/i);
      }
    }
  });
});
