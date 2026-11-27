/**
 * The link preview image (Open Graph), drawn at build time.
 *
 * One design for every page: the 7ayLabs logo, a block stamp naming the
 * page, the page's own title and line, a glass drop, and a row of the chains
 * Vizzor reads in their own colours. Only the words change per page, so a
 * shared link is recognisable as ours whatever it points to.
 */
import fs from 'node:fs';
import path from 'node:path';
import { ImageResponse } from 'next/og';
import { CHAIN_COUNT } from '@/lib/vizzor/chains';

export const OG_SIZE = { width: 1200, height: 630 };

const read = (...p: string[]) => fs.readFileSync(path.join(process.cwd(), ...p));
const dataUri = (mime: string, buf: Buffer) => `data:${mime};base64,${buf.toString('base64')}`;

/** A few well-known chains, with their brand colours, for the bottom row. */
const CHIPS: { t: string; c: string }[] = [
  { t: 'BTC', c: '#F7931A' },
  { t: 'ETH', c: '#627EEA' },
  { t: 'SOL', c: '#14F195' },
  { t: 'BNB', c: '#F3BA2F' },
  { t: 'AVAX', c: '#E84142' },
  { t: 'TRX', c: '#FF060A' },
  { t: 'TON', c: '#0098EA' },
];

export function renderOg(opts: { stamp: string; title: string; line: string; vizzor?: boolean }): ImageResponse {
  const font = (w: 400 | 700 | 800) => read('node_modules', '@fontsource', 'sora', 'files', `sora-latin-${w}-normal.woff`);
  const logo = dataUri('image/svg+xml', read('public', '7aylabs_white_logo.svg'));
  const vizzor = opts.vizzor ? dataUri('image/png', read('public', 'brand', 'vizzor_icon.png')) : null;
  const title = opts.title.length > 54 ? `${opts.title.slice(0, 52).trimEnd()}…` : opts.title;
  const big = title.length > 34 ? 60 : 76;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          background: '#050505',
          color: '#f4f4f4',
          fontFamily: 'Sora',
        }}
      >
        {/* Ground: a grid, and light falling across it. */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            backgroundImage: 'radial-gradient(circle at 78% 42%, rgba(255,255,255,0.20), rgba(5,5,5,0) 46%), linear-gradient(180deg, rgba(5,5,5,0) 55%, #050505 100%)',
          }}
        />
        {/* Ribbons of light. */}
        <div style={{ position: 'absolute', left: -200, top: 150, width: 1700, height: 2, display: 'flex', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)', transform: 'rotate(-14deg)' }} />
        <div style={{ position: 'absolute', left: -200, top: 330, width: 1700, height: 2, display: 'flex', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.28), transparent)', transform: 'rotate(-14deg)' }} />
        <div style={{ position: 'absolute', left: -200, top: 500, width: 1700, height: 2, display: 'flex', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)', transform: 'rotate(-14deg)' }} />

        {/* The glass drop. */}
        <div
          style={{
            position: 'absolute',
            right: 70,
            top: 120,
            width: 330,
            height: 330,
            borderRadius: '58% 42% 55% 45% / 48% 56% 44% 52%',
            display: 'flex',
            backgroundImage: 'radial-gradient(circle at 34% 28%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.28) 14%, rgba(255,255,255,0.07) 42%, rgba(255,255,255,0.02) 70%)',
            border: '2px solid rgba(255,255,255,0.5)',
            boxShadow: 'inset -24px -34px 70px rgba(255,255,255,0.18), 0 40px 80px rgba(0,0,0,0.7)',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {vizzor ? (
            // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
            <img src={vizzor} width={92} height={135} />
          ) : (
            <div style={{ display: 'flex', width: 120, height: 120, borderRadius: 28, border: '2px solid rgba(255,255,255,0.7)', background: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ display: 'flex', width: 54, height: 54, borderRadius: 12, background: '#f4f4f4' }} />
            </div>
          )}
        </div>
        {/* A second, smaller drop. */}
        <div
          style={{
            position: 'absolute',
            right: 400,
            top: 110,
            width: 74,
            height: 74,
            borderRadius: 999,
            display: 'flex',
            backgroundImage: 'radial-gradient(circle at 34% 28%, rgba(255,255,255,0.9), rgba(255,255,255,0.08) 60%)',
            border: '2px solid rgba(255,255,255,0.4)',
          }}
        />

        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%', height: '100%', padding: '56px 64px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
            <img src={logo} width={196} height={68} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 720 }}>
            <div style={{ display: 'flex', alignItems: 'center', alignSelf: 'flex-start', padding: '9px 16px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.07)', fontSize: 21, fontWeight: 700 }}>
              <div style={{ display: 'flex', width: 12, height: 12, borderRadius: 99, background: '#3ddc97', marginRight: 12 }} />
              {opts.stamp}
            </div>
            <div style={{ display: 'flex', marginTop: 22, fontSize: big, fontWeight: 800, letterSpacing: -3, lineHeight: 1.02 }}>{title}</div>
            <div style={{ display: 'flex', marginTop: 18, fontSize: 28, color: '#b4b4b4', lineHeight: 1.35 }}>{opts.line}</div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {CHIPS.map((c) => (
                <div
                  key={c.t}
                  style={{ display: 'flex', alignItems: 'center', marginRight: 10, padding: '8px 14px 8px 9px', borderRadius: 999, border: '1px solid rgba(255,255,255,0.22)', background: 'rgba(255,255,255,0.06)', fontSize: 19, fontWeight: 700 }}
                >
                  <div style={{ display: 'flex', width: 22, height: 22, borderRadius: 99, background: c.c, marginRight: 9 }} />
                  {c.t}
                </div>
              ))}
              <div style={{ display: 'flex', fontSize: 19, fontWeight: 700, color: '#8c8c8c', marginLeft: 4 }}>+{CHAIN_COUNT - CHIPS.length}</div>
            </div>
            <div style={{ display: 'flex', fontSize: 22, fontWeight: 700, color: '#f4f4f4' }}>7aylabs.com</div>
          </div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: 'Sora', data: font(400), weight: 400, style: 'normal' },
        { name: 'Sora', data: font(700), weight: 700, style: 'normal' },
        { name: 'Sora', data: font(800), weight: 800, style: 'normal' },
      ],
    },
  );
}
