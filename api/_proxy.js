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
  const baseTag = `<base href="${origin}/">`;
  if (/<base\s/i.test(out)) {
    out = out.replace(/<base[^>]*>/i, baseTag);
  } else if (/<head[^>]*>/i.test(out)) {
    out = out.replace(/<head[^>]*>/i, (m) => `${m}${baseTag}`);
  } else {
    out = `${baseTag}${out}`;
  }
  return out;
}

export default async function proxyHandler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).send('Method not allowed');
    return;
  }

  const feedUrl = typeof req.query.url === 'string' ? req.query.url : '';
  if (!feedUrl) {
    res.status(400).send('Missing url parameter');
    return;
  }

  let target;
  try {
    target = new URL(feedUrl);
  } catch {
    res.status(400).send('Invalid url parameter');
    return;
  }

  if (!/^https?:$/i.test(target.protocol)) {
    res.status(400).send('Only http/https URLs allowed');
    return;
  }

  try {
    const response = await fetch(feedUrl, {
      headers: {
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,text/plain,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        Referer: `${target.origin}/`,
      },
      redirect: 'follow',
    });

    if (!response.ok) {
      res.status(response.status).send(`Upstream HTTP ${response.status}`);
      return;
    }

    const contentType = response.headers.get('content-type') || 'text/plain; charset=utf-8';
    const isHtml = /text\/html|application\/xhtml\+xml/i.test(contentType);
    const finalUrl = response.url || feedUrl;

    res.setHeader('Cache-Control', 'public, s-maxage=120, stale-while-revalidate=300');

    if (isHtml) {
      const text = await response.text();
      const html = prepareHtmlForEmbed(text, finalUrl);
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.status(200).send(html);
      return;
    }

    const buf = Buffer.from(await response.arrayBuffer());
    res.setHeader('Content-Type', contentType);
    res.status(200).send(buf);
  } catch (err) {
    res.status(502).send(String(err?.message || err));
  }
}
