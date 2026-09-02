import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

function prepareHtmlForEmbed(html, pageUrl) {
  const origin = new URL(pageUrl).origin
  let out = String(html || '')
  out = out.replace(/<meta[^>]+http-equiv=["']?Content-Security-Policy["']?[^>]*>/gi, '')
  out = out.replace(/<meta[^>]+http-equiv=["']?X-Frame-Options["']?[^>]*>/gi, '')
  // Strip scripts/iframes so OneSignal, Outbrain, Google Ads don't run in our iframe
  out = out.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
  out = out.replace(/<iframe\b[^>]*>[\s\S]*?<\/iframe>/gi, '')
  out = out.replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, '')
  out = out.replace(
    /<link[^>]+(?:onesignal|outbrain|doubleclick|googlesyndication|googleadservices|googletagmanager|facebook|hotjar|taboola|adservice)[^>]*>/gi,
    '',
  )
  const baseTag = `<base href="${origin}/">`
  if (/<base\s/i.test(out)) {
    out = out.replace(/<base[^>]*>/i, baseTag)
  } else if (/<head[^>]*>/i.test(out)) {
    out = out.replace(/<head[^>]*>/i, (m) => `${m}${baseTag}`)
  } else {
    out = `${baseTag}${out}`
  }
  return out
}

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
      const target = new URL(feedUrl)
      const response = await fetch(feedUrl, {
        headers: {
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,text/plain,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
          Referer: `${target.origin}/`,
        },
        redirect: 'follow',
      })
      if (!response.ok) {
        res.statusCode = response.status
        res.end(`Upstream HTTP ${response.status}`)
        return
      }

      const contentType = response.headers.get('content-type') || 'text/plain; charset=utf-8'
      const isHtml = /text\/html|application\/xhtml\+xml/i.test(contentType)
      const finalUrl = response.url || feedUrl

      res.setHeader('Access-Control-Allow-Origin', '*')
      res.setHeader('Cache-Control', 'public, max-age=120')
      res.removeHeader?.('X-Frame-Options')
      res.removeHeader?.('Content-Security-Policy')

      if (isHtml) {
        const text = await response.text()
        const html = prepareHtmlForEmbed(text, finalUrl)
        res.setHeader('Content-Type', 'text/html; charset=utf-8')
        res.end(html)
        return
      }

      const buf = Buffer.from(await response.arrayBuffer())
      res.setHeader('Content-Type', contentType)
      res.end(buf)
    } catch (err) {
      res.statusCode = 502
      res.end(String(err?.message || err))
    }
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
