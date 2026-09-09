import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { proxyUpstream } from './api/proxy-core.js'

function rssProxyPlugin() {
  const handler = async (req, res) => {
    const reqUrl = new URL(req.url, 'http://localhost')
    const feedUrl = reqUrl.searchParams.get('url')
    if (!feedUrl) {
      res.statusCode = 400
      res.end('Missing url parameter')
      return
    }
    try {
      // eslint-disable-next-line no-new
      new URL(feedUrl)
    } catch {
      res.statusCode = 400
      res.end('Invalid url parameter')
      return
    }

    const result = await proxyUpstream(feedUrl)
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Expose-Headers', 'X-Embed-Failed')
    res.setHeader(
      'Cache-Control',
      result.embedFailed ? 'no-store' : 'public, max-age=120',
    )
    if (result.embedFailed) res.setHeader('X-Embed-Failed', '1')
    res.setHeader('Content-Type', result.contentType)
    res.statusCode = result.status
    res.end(result.body)
  }

  return {
    name: 'rss-proxy',
    configureServer(server) {
      server.middlewares.use('/api/rss', handler)
      server.middlewares.use('/api/fetch', handler)
    },
    configurePreviewServer(server) {
      server.middlewares.use('/api/rss', handler)
      server.middlewares.use('/api/fetch', handler)
    },
  }
}

export default defineConfig({
  plugins: [react(), rssProxyPlugin()],
})
