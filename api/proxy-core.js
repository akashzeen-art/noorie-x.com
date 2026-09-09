const SLOW_MEDIA_HOSTS = [
  'pakobserver.net',
  'propakistani.pk',
];

function hostOf(url) {
  try {
    return new URL(url, 'https://example.com').hostname.replace(/^www\./i, '').toLowerCase();
  } catch {
    return '';
  }
}

function isSlowMediaHost(url) {
  const raw = String(url || '').toLowerCase();
  if (SLOW_MEDIA_HOSTS.some((h) => raw.includes(h))) return true;
  const host = hostOf(url);
  if (!host) return false;
  return SLOW_MEDIA_HOSTS.some((h) => host === h || host.endsWith(`.${h}`));
}

function escapeHtml(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function inlineFormat(escaped) {
  return String(escaped || '')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/_([^_]+)_/g, '<em>$1</em>');
}

/** Build a quiet, text-only reader page — no scripts, images, or external assets. */
function prepareHtmlForEmbed(html, pageUrl) {
  let raw = String(html || '');
  raw = raw.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
  raw = raw.replace(/<script\b[^>]*\/?>/gi, '');
  raw = raw.replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, '');
  raw = raw.replace(/<iframe\b[^>]*>[\s\S]*?<\/iframe>/gi, '');
  raw = raw.replace(/<iframe\b[^>]*\/?>/gi, '');
  raw = raw.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '');
  raw = raw.replace(/<link\b[^>]*>/gi, '');
  raw = raw.replace(/<meta[^>]+http-equiv=["']?Content-Security-Policy["']?[^>]*>/gi, '');

  const bodyMatch = raw.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  let body = bodyMatch ? bodyMatch[1] : raw;

  const articleMatch =
    body.match(/<article\b[^>]*>([\s\S]*?)<\/article>/i) ||
    body.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i);
  if (articleMatch) body = articleMatch[1];

  body = body
    .replace(/<picture\b[^>]*>[\s\S]*?<\/picture>/gi, '')
    .replace(/<img\b[^>]*>/gi, '')
    .replace(/<video\b[^>]*>[\s\S]*?<\/video>/gi, '')
    .replace(/<audio\b[^>]*>[\s\S]*?<\/audio>/gi, '')
    .replace(/<source\b[^>]*>/gi, '')
    .replace(/<svg\b[^>]*>[\s\S]*?<\/svg>/gi, '')
    .replace(/<form\b[^>]*>[\s\S]*?<\/form>/gi, '')
    .replace(/<nav\b[^>]*>[\s\S]*?<\/nav>/gi, '')
    .replace(/<header\b[^>]*>[\s\S]*?<\/header>/gi, '')
    .replace(/<footer\b[^>]*>[\s\S]*?<\/footer>/gi, '')
    .replace(/<aside\b[^>]*>[\s\S]*?<\/aside>/gi, '')
    .replace(/\son[a-z]+\s*=\s*(['"]).*?\1/gi, '')
    .replace(/\s(?:src|href|srcset|poster)\s*=\s*(['"])javascript:.*?\1/gi, '')
    .replace(/url\(\s*['"]?[^)]+['"]?\s*\)/gi, 'none');

  body = body.replace(
    /<\/?(?!p\b|br\b|h[1-6]\b|strong\b|b\b|em\b|i\b|u\b|ul\b|ol\b|li\b|blockquote\b|span\b|div\b|section\b|a\b|br\b)[a-z0-9:-]+\b[^>]*>/gi,
    '',
  );
  body = body.replace(/<a\b[^>]*>/gi, '<span>').replace(/<\/a>/gi, '</span>');

  const titleMatch = String(html || '').match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const title = titleMatch
    ? titleMatch[1].replace(/<[^>]+>/g, '').trim().slice(0, 140)
    : 'Article';
  const safeTitle = title.replace(/[<>&]/g, '');
  const source = (() => {
    try {
      return new URL(pageUrl).hostname;
    } catch {
      return '';
    }
  })();

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>${safeTitle}</title>
  <style>
    html,body{margin:0;padding:0;background:#111;color:#eee}
    body{font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;line-height:1.55;padding:1.25rem 1.35rem 2rem}
    .meta{color:#888;font-size:.8rem;margin:0 0 1rem}
    h1,h2,h3,h4{line-height:1.25;margin:1.1rem 0 .55rem}
    p{margin:0 0 .85rem;color:#ddd}
    ul,ol{padding-left:1.2rem}
    blockquote{margin:0 0 1rem;padding-left:.85rem;border-left:3px solid #e50914;color:#bbb}
  </style>
</head>
<body>
  <p class="meta">${source ? `Preview · ${source}` : 'Preview'}</p>
  <h1>${safeTitle}</h1>
  <div class="content">${body}</div>
</body>
</html>`;
}

function markdownToQuietHtml(md, pageUrl) {
  const titleMatch = String(md).match(/^Title:\s*(.+)$/m);
  const title = (titleMatch?.[1] || 'Article').trim().slice(0, 160);
  let body = String(md);
  const idx = body.indexOf('Markdown Content:');
  if (idx >= 0) body = body.slice(idx + 'Markdown Content:'.length).trim();

  body = body
    .replace(/!\[[^\]]*\]\([^)]+\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

  const htmlParts = [];
  let para = [];
  const flushPara = () => {
    if (!para.length) return;
    const text = para.join(' ').trim();
    if (text) htmlParts.push(`<p>${inlineFormat(escapeHtml(text))}</p>`);
    para = [];
  };

  for (const line of body.split(/\n/)) {
    const t = line.trim();
    if (!t) {
      flushPara();
      continue;
    }
    const heading = t.match(/^(#{1,6})\s+(.+)$/);
    if (heading) {
      flushPara();
      const level = Math.min(heading[1].length, 4);
      const text = heading[2].replace(/\*\*/g, '').replace(/^_|_$/g, '');
      htmlParts.push(`<h${level}>${inlineFormat(escapeHtml(text))}</h${level}>`);
      continue;
    }
    if (/^>\s?/.test(t)) {
      flushPara();
      const quote = t.replace(/^>\s?/, '').replace(/^_+|_+$/g, '').trim();
      htmlParts.push(`<blockquote><p>${inlineFormat(escapeHtml(quote))}</p></blockquote>`);
      continue;
    }
    para.push(t);
  }
  flushPara();

  return prepareHtmlForEmbed(
    `<!doctype html><html><head><title>${escapeHtml(title)}</title></head><body><article><h1>${escapeHtml(title)}</h1>${htmlParts.join('\n')}</article></body></html>`,
    pageUrl,
  );
}

function embedErrorPage(pageUrl, status, detail) {
  const safeDetail = String(detail || '').replace(/[<>&]/g, '');
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Unavailable</title>
<style>
  body{margin:0;font-family:system-ui,sans-serif;background:#111;color:#eee;display:flex;align-items:center;justify-content:center;min-height:100vh;padding:1.5rem;text-align:center}
  .box{max-width:28rem}
  h1{font-size:1.1rem;margin:0 0 .75rem}
  p{color:#aaa;font-size:.9rem;line-height:1.45;margin:0 0 1rem}
  .code{font-size:.75rem;color:#666}
</style></head><body><div class="box" data-embed-error="1">
  <h1>This article can’t be loaded here</h1>
  <p>The publisher blocked or timed out the preview. Use <strong>Back to summary</strong> to read the feed version.</p>
  <p class="code">${status || ''} ${safeDetail}</p>
</div></body></html>`;
}

function isBlockedPublisherPage(html, status) {
  if (status && status >= 400) return true;
  return /Just a moment\.\.\.|cf-browser-verification|challenge-platform|Attention Required|Access denied|Enable JavaScript and cookies/i.test(
    String(html || ''),
  );
}

const FETCH_HEADERS = {
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,text/plain,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  'Cache-Control': 'no-cache',
  'Upgrade-Insecure-Requests': '1',
};

export function isUnreliableArticleHost(url) {
  return isSlowMediaHost(url);
}

function looksLikeJsonFeed(text, contentType) {
  if (/application\/feed\+json|application\/json|text\/json/i.test(contentType || '')) {
    try {
      const data = JSON.parse(text);
      return Array.isArray(data?.items) || /jsonfeed/i.test(String(data?.version || ''));
    } catch {
      return false;
    }
  }
  const sample = String(text || '').trim().slice(0, 500);
  return (
    sample.startsWith('{') &&
    (/jsonfeed/i.test(sample) || /"items"\s*:/.test(sample))
  );
}

function looksLikeFeed(text, contentType) {
  if (looksLikeJsonFeed(text, contentType)) return true;
  if (/rss|atom|xml/i.test(contentType || '')) return true;
  const sample = String(text || '').slice(0, 4000);
  return (
    /<\?xml\b/i.test(sample) ||
    /<(rss|feed|rdf:RDF)\b/i.test(sample) ||
    /<(item|entry)\b/i.test(sample)
  );
}

function looksLikeHtml(text, contentType) {
  if (/text\/html|application\/xhtml\+xml/i.test(contentType || '')) return true;
  return /<!doctype\s+html|<html[\s>]/i.test(String(text || '').slice(0, 2000));
}

/** Reader fallback when publishers block direct fetches (e.g. Cloudflare). */
async function fetchReaderArticle(pageUrl) {
  const readerUrl = `https://r.jina.ai/${pageUrl}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 28000);
  try {
    const response = await fetch(readerUrl, {
      // Avoid browser UAs — Jina/CDN may challenge them with Cloudflare HTML.
      headers: {
        Accept: 'text/plain',
        'User-Agent': 'NoorieXReader/1.0 (+https://noorie-x.com)',
      },
      redirect: 'follow',
      signal: controller.signal,
    });
    if (!response.ok) return null;
    const text = await response.text();
    if (!text || text.length < 120) return null;
    if (/Warning: This page maybe requiring CAPTCHA/i.test(text)) return null;
    if (!/^Title:/m.test(text) && !/Markdown Content:/i.test(text)) return null;
    return markdownToQuietHtml(text, pageUrl);
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

async function embedWithFallbacks(feedUrl) {
  let lastDetail = 'Unavailable';

  // Skip hanging hosts and go straight to the reader
  if (!isUnreliableArticleHost(feedUrl)) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 10000);
    try {
      const target = new URL(feedUrl);
      const response = await fetch(feedUrl, {
        headers: {
          ...FETCH_HEADERS,
          Referer: `${target.origin}/`,
        },
        redirect: 'follow',
        signal: controller.signal,
      });
      const contentType = response.headers.get('content-type') || 'text/plain; charset=utf-8';
      if (!/^(image|video|audio|font)\//i.test(contentType) && !/octet-stream/i.test(contentType)) {
        const text = await response.text();
        const finalUrl = response.url || feedUrl;
        if (
          response.ok &&
          looksLikeHtml(text, contentType) &&
          !isBlockedPublisherPage(text, response.status)
        ) {
          return {
            status: 200,
            contentType: 'text/html; charset=utf-8',
            body: prepareHtmlForEmbed(text, finalUrl),
            embedFailed: false,
          };
        }
        lastDetail = `Upstream HTTP ${response.status}`;
      } else {
        lastDetail = 'Unsupported content type';
      }
    } catch (err) {
      lastDetail = err?.name === 'AbortError' ? 'Request timed out' : String(err?.message || err);
    } finally {
      clearTimeout(timer);
    }
  } else {
    lastDetail = 'Publisher host is unreliable for direct preview';
  }

  const readerHtml = await fetchReaderArticle(feedUrl);
  if (readerHtml) {
    return {
      status: 200,
      contentType: 'text/html; charset=utf-8',
      body: readerHtml,
      embedFailed: false,
    };
  }

  return {
    status: 200,
    contentType: 'text/html; charset=utf-8',
    body: embedErrorPage(feedUrl, 502, lastDetail),
    embedFailed: true,
  };
}

/**
 * @param {string} feedUrl
 * @param {{ mode?: 'feed' | 'embed' }} [opts]
 *   - feed: return RSS/Atom XML as-is (used by /api/rss)
 *   - embed: strip publisher pages for in-app iframe (used by /api/fetch)
 */
export async function proxyUpstream(feedUrl, opts = {}) {
  const mode = opts.mode === 'feed' ? 'feed' : 'embed';
  const target = new URL(feedUrl);
  if (!/^https?:$/i.test(target.protocol)) {
    const err = new Error('Only http/https URLs allowed');
    err.status = 400;
    throw err;
  }

  if (mode === 'embed') {
    return embedWithFallbacks(feedUrl);
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20000);

  try {
    const response = await fetch(feedUrl, {
      headers: {
        ...FETCH_HEADERS,
        Accept:
          'application/feed+json, application/json, application/rss+xml, application/atom+xml, application/xml, text/xml, */*;q=0.8',
        Referer: `${target.origin}/`,
      },
      redirect: 'follow',
      signal: controller.signal,
    });

    const contentType = response.headers.get('content-type') || 'text/plain; charset=utf-8';

    if (/^(image|video|audio|font)\//i.test(contentType) || /octet-stream/i.test(contentType)) {
      return {
        status: 502,
        contentType: 'text/plain; charset=utf-8',
        body: `Upstream returned non-feed content (${contentType})`,
        embedFailed: true,
      };
    }

    const text = await response.text();

    if (looksLikeJsonFeed(text, contentType)) {
      if (!response.ok) {
        return {
          status: response.status,
          contentType: 'text/plain; charset=utf-8',
          body: text.slice(0, 500) || `Upstream HTTP ${response.status}`,
          embedFailed: true,
        };
      }
      return {
        status: 200,
        contentType: 'application/feed+json; charset=utf-8',
        body: text,
        embedFailed: false,
      };
    }

    if (looksLikeFeed(text, contentType) && !looksLikeHtml(text, contentType)) {
      if (!response.ok) {
        return {
          status: response.status,
          contentType: 'text/plain; charset=utf-8',
          body: text.slice(0, 500) || `Upstream HTTP ${response.status}`,
          embedFailed: true,
        };
      }
      return {
        status: 200,
        contentType: /xml|rss|atom/i.test(contentType)
          ? contentType
          : 'application/xml; charset=utf-8',
        body: text,
        embedFailed: false,
      };
    }

    return {
      status: response.ok ? 502 : response.status,
      contentType: 'text/plain; charset=utf-8',
      body: `Non-RSS upstream response (HTTP ${response.status})`,
      embedFailed: true,
    };
  } catch (err) {
    const msg = err?.name === 'AbortError' ? 'Request timed out' : String(err?.message || err);
    return {
      status: 502,
      contentType: 'text/plain; charset=utf-8',
      body: msg,
      embedFailed: true,
    };
  } finally {
    clearTimeout(timer);
  }
}

export { prepareHtmlForEmbed, embedErrorPage, SLOW_MEDIA_HOSTS };
