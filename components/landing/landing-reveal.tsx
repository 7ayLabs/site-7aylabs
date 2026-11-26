'use client';

/**
 * LandingReveal — entrance choreography for the v2 landing sections.
 *
 * One IntersectionObserver per section (one-shot, no ScrollTrigger —
 * house policy, see lib/motion.ts), driving three reveal roles so each
 * section plays as a composed sequence rather than a uniform fade:
 *
 *   [data-reveal]        copy — crossfade + 18px rise, staggered
 *   [data-reveal-frame]  video frames — clip-path wipe + settle from
 *                        scale 0.965, slightly slower than the copy
 *   [data-reveal-dash]   the active progress dash — scaleX fill from
 *                        the left after the copy lands
 *
 * All slow fluid easing (cubic-bezier(0.16,1,0.3,1) ≈ power3.out with
 * a longer tail). Reduced motion snaps everything to final state.
 */

import { useEffect, useRef, type ReactNode } from 'react';
import gsap from 'gsap';
import { useReducedMotionSafe } from '@/lib/motion';

const EASE = 'expo.out';

export function LandingReveal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotionSafe();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const copy = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]'));
    const frames = Array.from(
      root.querySelectorAll<HTMLElement>('[data-reveal-frame]'),
    );
    const dashes = Array.from(
      root.querySelectorAll<HTMLElement>('[data-reveal-dash]'),
    );
    if (copy.length + frames.length + dashes.length === 0) return;

    // Landing v4: where the browser runs scroll-driven animations, the
    // reveal is pure CSS tied to scroll position (landing-v4.css), so it
    // plays forward on the way down, rewinds on the way up, and runs on the
    // compositor instead of the main thread. GSAP stays as the fallback.
    if (
      !reduced &&
      typeof CSS !== 'undefined' &&
      typeof CSS.supports === 'function' &&
      CSS.supports('animation-timeline: view()')
    ) {
      root.dataset.scrollDriven = '';
      return () => {
        delete root.dataset.scrollDriven;
      };
    }

    // Initial states — set in both branches so reduced-motion users
    // never see a pre-reveal flash.
    gsap.set(copy, { opacity: 0, y: 18 });
    gsap.set(frames, {
      opacity: 0,
      scale: 0.965,
      clipPath: 'inset(6% 10% 6% 10%)',
    });
    gsap.set(dashes, { scaleX: 0, transformOrigin: 'left center' });

    const snap = () => {
      gsap.set(copy, { opacity: 1, y: 0 });
      gsap.set(frames, { opacity: 1, scale: 1, clipPath: 'inset(0% 0% 0% 0%)' });
      gsap.set(dashes, { scaleX: 1 });
    };

    if (reduced) {
      snap();
      return;
    }

    let played = false;
    const play = () => {
      if (played) return;
      played = true;
      const tl = gsap.timeline({ defaults: { ease: EASE } });
      tl.to(copy, { opacity: 1, y: 0, duration: 0.9, stagger: 0.11 }, 0);
      tl.to(
        frames,
        {
          opacity: 1,
          scale: 1,
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: 1.2,
          // Drop the inline clip-path once the wipe lands — otherwise it
          // keeps clipping the card's drop shadow and any hover-lift that
          // extends past the frame's box.
          clearProps: 'clipPath',
        },
        0.15,
      );
      tl.to(dashes, { scaleX: 1, duration: 0.7 }, 0.55);
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            play();
            io.unobserve(entry.target);
            break;
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    );
    io.observe(root);

    return () => io.disconnect();
  }, [reduced]);

  return (
    <div ref={rootRef} className={className}>
      {children}
    </div>
  );
}
