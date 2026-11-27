export const dynamic = 'force-static';

export function GET(): Response {
  return new Response(
    JSON.stringify({
      name: '7ayLabs',
      short_name: '7ayLabs',
      description: 'The Web3 laboratory. Software you can check.',
      start_url: '/',
      display: 'standalone',
      background_color: '#050505',
      theme_color: '#050505',
      icons: [
        { src: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
        { src: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
      ],
    }),
    { headers: { 'content-type': 'application/manifest+json' } },
  );
}
