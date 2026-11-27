'use client';

/**
 * PageFx — the page's ambient behaviour, mounted once.
 *
 *  - Reveals: every `[data-reveal]` carries `data-in` while it is inside the
 *    window, in both scroll directions. Siblings inside a `[data-stagger]`
 *    parent arrive one after the other. Re-scanned on each route change.
 *  - Pointer light: `.glass-live` panes receive the pointer position as
 *    `--mx` / `--my`, which the stylesheet turns into a soft moving light.
 *
 * One observer and one pointer listener for the whole page.
 */
import { useEffect } from 'react';
import { usePathname } from '@/i18n/navigation';

export function PageFx(): null {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    if (els.length === 0) return;
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.setAttribute('data-in', ''));
      return;
    }
    for (const group of document.querySelectorAll<HTMLElement>('[data-stagger]')) {
      Array.from(group.querySelectorAll<HTMLElement>(':scope > [data-reveal]')).forEach((el, i) => {
        el.style.setProperty('--d', `${Math.min(i, 8) * 70}ms`);
      });
    }
    // Both ways: a piece arrives when it enters the window and leaves when it
    // exits, so scrolling back up plays the page again. `data-from` says which
    // edge it left by, and so which way it comes back in.
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const el = e.target as HTMLElement;
          if (e.isIntersecting) {
            el.setAttribute('data-in', '');
          } else {
            el.removeAttribute('data-in');
            el.setAttribute('data-from', e.boundingClientRect.top < 0 ? 'top' : 'bottom');
          }
        }
      },
      { threshold: 0.06, rootMargin: '-4% 0px -6% 0px' },
    );
    els.forEach((el) => io.observe(el));
    // From here the stylesheet's "script never ran" failsafe stands down.
    root.dataset.fx = '';
    return () => io.disconnect();
  }, [pathname]);

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    let raf = 0;
    let last: PointerEvent | null = null;
    const apply = () => {
      raf = 0;
      const target = last?.target instanceof Element ? last.target.closest<HTMLElement>('.glass-live') : null;
      if (!target || !last) return;
      const r = target.getBoundingClientRect();
      target.style.setProperty('--mx', `${last.clientX - r.left}px`);
      target.style.setProperty('--my', `${last.clientY - r.top}px`);
    };
    const onMove = (e: PointerEvent) => {
      last = e;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    // Parallax roots get the pointer as -1…1 from the centre of the window.
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const onLean = (e: PointerEvent) => {
      if (reduced) return;
      const px = ((e.clientX / window.innerWidth) * 2 - 1).toFixed(3);
      const py = ((e.clientY / window.innerHeight) * 2 - 1).toFixed(3);
      for (const el of document.querySelectorAll<HTMLElement>('[data-parallax]')) {
        el.style.setProperty('--px', px);
        el.style.setProperty('--py', py);
      }
    };
    window.addEventListener('pointermove', onLean, { passive: true });
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointermove', onLean);
      cancelAnimationFrame(raf);
    };
  }, []);

  return null;
}
