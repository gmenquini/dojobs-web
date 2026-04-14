export default function handler(req, res) {
  res.setHeader('Content-Type', 'application/manifest+json')
  res.json({
    name: 'DoJobApp',
    short_name: 'DoJob',
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0a14',
    theme_color: '#6C63FF',
    orientation: 'portrait',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
    ]
  })
}
