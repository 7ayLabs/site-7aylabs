export const dynamic = 'force-static';

export function GET(): Response {
  return new Response(
    JSON.stringify({
      name: '7ayLabs',
      short_name: '7ayLabs',
      description: 'A laboratory for apps, software and intelligence.',
      start_url: '/',
      display: 'standalone',
      background_color: '#050b1c',
      theme_color: '#050b1c',
      icons: [
        { src: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
        { src: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
      ],
    }),
    { headers: { 'content-type': 'application/manifest+json' } },
  );
}
