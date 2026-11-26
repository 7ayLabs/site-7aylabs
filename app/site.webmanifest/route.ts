export const dynamic = 'force-static';

export function GET(): Response {
  return new Response(
    JSON.stringify({
      name: '7ayLabs',
      short_name: '7ayLabs',
      description: 'The lab behind Vizzor.',
      start_url: '/',
      display: 'standalone',
      background_color: '#0a1311',
      theme_color: '#0a1311',
      icons: [
        { src: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
        { src: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
      ],
    }),
    { headers: { 'content-type': 'application/manifest+json' } },
  );
}
