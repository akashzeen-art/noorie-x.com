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
  const host = hostOf(url);
  if (!host) return true;
  return SLOW_MEDIA_HOSTS.some((h) => host === h || host.endsWith(`.${h}`));
}

function stripUnreliableMedia(html) {
  let out = String(html || '');
  // Drop entire img / picture / source / video poster tags that point at flaky hosts,
  // and strip ALL imgs in embed preview to avoid browser connection timeouts.
  out = out.replace(/<picture\b[^>]*>[\s\S]*?<\/picture>/gi, '');
  out = out.replace(/<img\b[^>]*>/gi, '');
  out = out.replace(/<source\b[^>]*>/gi, '');
  out = out.replace(/\ssrcset=["'][^"']*["']/gi, '');
  out = out.replace(/\sposter=["'][^"']*["']/gi, '');
  // Neutralize inline background images from slow hosts
  out = out.replace(/url\(\s*['"]?([^)'"]+)['"]?\s*\)/gi, (full, rawUrl) => {
    return isSlowMediaHost(rawUrl) ? 'none' : full;
  });
  return out;
}

function prepareHtmlForEmbed(html, pageUrl) {
  const origin = new URL(pageUrl).origin;
  let out = String(html || '');
  out = out.replace(/<meta[^>]+http-equiv=["']?Content-Security-Policy["']?[^>]*>/gi, '');
  out = out.replace(/<meta[^>]+http-equiv=["']?X-Frame-Options["']?[^>]*>/gi, '');
  out = out.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
  out = out.replace(/<iframe\b[^>]*>[\s\S]*?<\/iframe>/gi, '');
  out = out.replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, '');
  out = out.replace(
    /<link[^>]+(?:onesignal|outbrain|doubleclick|googlesyndication|googleadservices|googletagmanager|facebook|hotjar|taboola|adservice)[^>]*>/gi,
    '',
  );
  out = stripUnreliableMedia(out);
  // Block remaining subresource loads to flaky hosts via CSP
  const csp = `<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src data: blob: https: http:; media-src 'none'; style-src 'unsafe-inline' https: http: data:; font-src https: http: data:; connect-src 'none'; frame-src 'none'; script-src 'none'; base-uri ${origin}/;">`;
  const baseTag = `<base href="${origin}/">`;
  if (/<base\s/i.test(out)) {
    out = out.replace(/<base[^>]*>/i, baseTag);
  } else if (/<head[^>]*>/i.test(out)) {
    out = out.replace(/<head[^>]*>/i, (m) => `${m}${baseTag}${csp}`);
  } else {
    out = `${baseTag}${csp}${out}`;
  }
  return out;
}

function embedErrorPage(pageUrl, status, detail) {
  const safeUrl = String(pageUrl || '').replace(/[<>&"]/g, '');
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

export async function proxyUpstream(feedUrl) {
  const target = new URL(feedUrl);
  if (!/^https?:$/i.test(target.protocol)) {
    const err = new Error('Only http/https URLs allowed');
    err.status = 400;
    throw err;
  }

  // Don't even try hosts that hang and then pull timed-out images
  if (isUnreliableArticleHost(feedUrl)) {
    return {
      status: 200,
      contentType: 'text/html; charset=utf-8',
      body: embedErrorPage(feedUrl, 504, 'Publisher host is unreliable for in-app preview'),
      embedFailed: true,
    };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(feedUrl, {
      headers: {
        ...FETCH_HEADERS,
        Referer: `${target.origin}/`,
      },
      redirect: 'follow',
      signal: controller.signal,
    });

    if (!response.ok) {
      return {
        status: 200,
        contentType: 'text/html; charset=utf-8',
        body: embedErrorPage(feedUrl, response.status, `Upstream HTTP ${response.status}`),
        embedFailed: true,
      };
    }

    const contentType = response.headers.get('content-type') || 'text/plain; charset=utf-8';
    const isHtml = /text\/html|application\/xhtml\+xml/i.test(contentType);
    const finalUrl = response.url || feedUrl;

    if (isHtml) {
      const text = await response.text();
      return {
        status: 200,
        contentType: 'text/html; charset=utf-8',
        body: prepareHtmlForEmbed(text, finalUrl),
        embedFailed: false,
      };
    }

    const buf = Buffer.from(await response.arrayBuffer());
    return {
      status: 200,
      contentType,
      body: buf,
      embedFailed: false,
    };
  } catch (err) {
    const msg = err?.name === 'AbortError' ? 'Request timed out' : String(err?.message || err);
    return {
      status: 200,
      contentType: 'text/html; charset=utf-8',
      body: embedErrorPage(feedUrl, 502, msg),
      embedFailed: true,
    };
  } finally {
    clearTimeout(timer);
  }
}

export { prepareHtmlForEmbed, embedErrorPage, SLOW_MEDIA_HOSTS };
