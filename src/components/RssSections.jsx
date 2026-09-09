import { useEffect, useRef, useState } from 'react';
import { useApp } from '../context/AppContext.jsx';

/** JSON Feed 1.1 from rss.app + local snapshot fallback. */
const FEED_URLS = [
  'https://rss.app/feeds/v1.1/ty2GelKikkAx9ykE.json',
  '/feeds/pakistani-entertainment.json',
];
const RSS_LIMIT = 24;

const SLOW_IMAGE_HOSTS = [
  'pakobserver.net',
  'propakistani.pk',
];

function isSlowImageHost(url) {
  const raw = String(url || '').toLowerCase();
  if (!raw) return false;
  if (SLOW_IMAGE_HOSTS.some((h) => raw.includes(h))) return true;
  try {
    const host = new URL(url).hostname.replace(/^www\./i, '').toLowerCase();
    return SLOW_IMAGE_HOSTS.some((h) => host === h || host.endsWith(`.${h}`));
  } catch {
    return false;
  }
}

function stripHtml(html) {
  const tmp = document.createElement('div');
  tmp.innerHTML = html || '';
  return (tmp.textContent || tmp.innerText || '').replace(/\s+/g, ' ').trim();
}

function escapeHtml(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function sanitizeFeedHtml(html) {
  let out = String(html || '')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<script\b[^>]*\/?>/gi, '')
    .replace(/<iframe\b[^>]*>[\s\S]*?<\/iframe>/gi, '')
    .replace(/<iframe\b[^>]*\/?>/gi, '')
    .replace(/\son[a-z]+\s*=\s*(['"]).*?\1/gi, '')
    .replace(/\s(?:href|src)\s*=\s*(['"])javascript:.*?\1/gi, '');

  for (const host of SLOW_IMAGE_HOSTS) {
    const escaped = host.replace(/\./g, '\\.');
    out = out.replace(new RegExp(`<img\\b[^>]*${escaped}[^>]*>`, 'gi'), '');
  }
  out = out.replace(/<img\b[^>]*>/gi, (tag) => {
    const src = (tag.match(/\bsrc=["']([^"']+)["']/i) || [])[1] || '';
    return isSlowImageHost(src) ? '' : tag;
  });
  return out;
}

function safeImage(url) {
  if (!url || isSlowImageHost(url)) return '';
  return url;
}

function formatDate(value) {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function parseJsonFeed(text, limit) {
  const clean = String(text || '').replace(/^[\s\S]*?(\{)/, '$1');
  let data;
  try {
    data = JSON.parse(clean);
  } catch {
    throw new Error('Invalid JSON feed');
  }
  const list = Array.isArray(data.items) ? data.items : [];
  if (!list.length) throw new Error('Feed has no articles');

  const items = list.slice(0, limit || RSS_LIMIT).map((raw) => {
    const title = String(raw.title || 'Untitled').trim();
    const link = String(raw.url || raw.external_url || '').trim();
    const descriptionHtml = String(raw.content_html || raw.content_text || '');
    const image = safeImage(
      raw.image ||
        raw.banner_image ||
        raw.attachments?.[0]?.url ||
        (descriptionHtml.match(/<img[^>]+src=["']([^"']+)["']/i) || [])[1] ||
        '',
    );
    const source =
      raw.authors?.[0]?.name ||
      raw.author?.name ||
      data.title ||
      'Pakistani Entertainment';
    const pubDate = raw.date_published || raw.date_modified || '';
    return {
      title,
      link,
      excerpt: stripHtml(raw.content_text || descriptionHtml).slice(0, 220),
      contentHtml: sanitizeFeedHtml(descriptionHtml),
      image,
      source,
      pubDate,
    };
  });

  return {
    title: data.title || 'Pakistani Entertainment',
    items,
  };
}

/** Stable article page: feed hero image stays; full text loads under it (no swap flash). */
function buildArticleHtml(item, fullBodyHtml = '') {
  const title = escapeHtml(item.title || 'Article');
  const source = escapeHtml(item.source || '');
  const date = escapeHtml(formatDate(item.pubDate) || '');

  // Always prefer the feed image so the article never opens "blank"
  let image =
    (item.image && !isSlowImageHost(item.image) ? item.image : '') ||
    ((item.contentHtml || '').match(/<img[^>]+src=["']([^"']+)["']/i) || [])[1] ||
    '';
  if (image && isSlowImageHost(image)) image = '';
  const imageEsc = image ? escapeHtml(image) : '';

  let body = '';
  if (fullBodyHtml) {
    const contentMatch = fullBodyHtml.match(/<div class="content">([\s\S]*)<\/div>\s*<\/body>/i);
    const articleMatch = fullBodyHtml.match(/<article\b[^>]*>([\s\S]*?)<\/article>/i);
    body = sanitizeFeedHtml(contentMatch?.[1] || articleMatch?.[1] || '');
    body = body.replace(
      new RegExp(`<h1[^>]*>\\s*${title.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&')}\\s*<\\/h1>`, 'i'),
      '',
    );
  }
  if (!body) {
    // Feed HTML already includes the image — keep it when no full article
    body = sanitizeFeedHtml(item.contentHtml || '') || `<p>${escapeHtml(item.excerpt || '')}</p>`;
  }

  const bodyHasImage = /<img\b/i.test(body);

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>${title}</title>
  <style>
    html,body{margin:0;padding:0;background:#0b0b0b;color:#f2f2f2}
    body{font-family:Georgia,"Times New Roman",serif;line-height:1.65;padding:1.25rem 1.35rem 2.5rem}
    .meta{font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#999;font-size:.8rem;margin:0 0 1rem}
    h1{font-size:clamp(1.35rem,3vw,1.85rem);line-height:1.25;margin:0 0 1rem;font-weight:700;color:#fff}
    h2,h3,h4{line-height:1.3;margin:1.1rem 0 .55rem;color:#fff}
    .hero{margin:0 0 1.15rem;border-radius:10px;overflow:hidden;background:#1a1a1a}
    .hero img,.content img{width:100%;height:auto;display:block;border-radius:10px}
    .content{font-size:1.05rem;color:#ddd}
    .content p,.content div{margin:0 0 .85rem}
    blockquote{margin:0 0 1rem;padding-left:.85rem;border-left:3px solid #e50914;color:#bbb}
  </style>
</head>
<body>
  <p class="meta">${date}${source ? ` · ${source}` : ''}</p>
  <h1>${title}</h1>
  ${imageEsc && !bodyHasImage ? `<div class="hero"><img src="${imageEsc}" alt="" referrerpolicy="no-referrer" /></div>` : ''}
  <div class="content">${body}</div>
</body>
</html>`;
}

async function fetchFeedJson(urls) {
  const list = Array.isArray(urls) ? urls : [urls];
  let lastError = new Error('Failed to load feed');
  for (const url of list) {
    for (let attempt = 0; attempt < 2; attempt += 1) {
      try {
        const isLocal = url.startsWith('/');
        const requestUrl = isLocal
          ? `${url}${attempt ? `?_=${Date.now()}` : ''}`
          : `/api/rss?url=${encodeURIComponent(url)}${attempt ? `&_=${Date.now()}` : ''}`;
        const res = await fetch(requestUrl, { cache: attempt ? 'no-store' : 'default' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const text = await res.text();
        if (!text.includes('"items"') && !text.includes('jsonfeed')) {
          throw new Error('Non-JSON feed response');
        }
        return text;
      } catch (err) {
        lastError = err;
      }
    }
  }
  throw lastError;
}

function NewsCard({ item, featured, badge, onOpen }) {
  const [imgFailed, setImgFailed] = useState(false);
  const image = item.image && !isSlowImageHost(item.image) ? item.image : '';
  return (
    <button
      type="button"
      className={`rss-news-card${featured ? ' is-featured' : ''}`}
      onClick={() => onOpen(item)}
    >
      {image && !imgFailed ? (
        <img
          src={image}
          alt={item.title}
          className="rss-news-card-img"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setImgFailed(true)}
        />
      ) : (
        <div className="rss-news-card-fallback" />
      )}
      <div className="rss-news-card-shine" />
      <div className="rss-news-card-gradient" />
      {badge ? <span className="rss-news-badge">{badge}</span> : null}
      <div className="rss-news-card-copy">
        <h3 className={`rss-news-card-title${featured ? ' is-lg' : ''}`}>{item.title}</h3>
        <p className={`rss-news-card-date${featured ? ' is-lg' : ''}`}>{formatDate(item.pubDate)}</p>
        <div className="rss-news-card-line" />
      </div>
    </button>
  );
}

function ArticleOverlay({ item, onClose, tr }) {
  const [embedBlobUrl, setEmbedBlobUrl] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    let blobUrl = '';

    const showHtml = (html) => {
      const blob = new Blob([html], { type: 'text/html; charset=utf-8' });
      const next = URL.createObjectURL(blob);
      if (blobUrl) URL.revokeObjectURL(blobUrl);
      blobUrl = next;
      if (!cancelled) setEmbedBlobUrl(next);
    };

    const load = async () => {
      setLoading(true);
      setEmbedBlobUrl('');
      let fullHtml = '';
      if (item.link) {
        try {
          const res = await fetch(`/api/fetch?url=${encodeURIComponent(item.link)}`);
          const failed = res.headers.get('X-Embed-Failed') === '1';
          const text = await res.text();
          if (res.ok && !failed && !/data-embed-error=["']1["']/.test(text) && text.length > 800) {
            fullHtml = text;
          }
        } catch {
          // fall back to feed content
        }
      }
      if (cancelled) return;
      // One stable render: feed image + full text (or feed summary)
      showHtml(buildArticleHtml(item, fullHtml));
      setLoading(false);
    };

    load();

    return () => {
      cancelled = true;
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
  }, [item]);

  return (
    <div className="rss-article-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="rss-article-overlay-box is-iframe">
        <button type="button" className="rss-article-close" onClick={onClose} aria-label={tr('close')}>&times;</button>
        <div className="rss-iframe-wrap">
          <div className="rss-iframe-toolbar">
            <button type="button" className="rss-read-more" onClick={onClose}>
              ← Back
            </button>
            <span className="rss-iframe-title">{item.title}</span>
          </div>
          {loading ? (
            <div className="rss-iframe-loading">Loading article…</div>
          ) : null}
          {!loading && embedBlobUrl ? (
            <iframe
              className="rss-iframe"
              src={embedBlobUrl}
              title={item.title}
              referrerPolicy="no-referrer"
              sandbox=""
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default function RssSections() {
  const { tr } = useApp();
  const [feedData, setFeedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeItem, setActiveItem] = useState(null);
  const sideRef = useRef(null);

  const loadFeed = async () => {
    setLoading(true);
    setError('');
    try {
      const json = await fetchFeedJson(FEED_URLS);
      const parsed = parseJsonFeed(json, RSS_LIMIT);
      setFeedData(parsed);
    } catch (err) {
      setError(err?.message || 'Failed to load feed');
      setFeedData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeed();
  }, []);

  const items = feedData?.items || [];
  const featured = items[0];
  const sideItems = items.slice(1);

  const scrollSide = () => {
    const el = sideRef.current;
    if (!el) return;
    el.scrollBy({ top: 220, left: 0, behavior: 'smooth' });
  };

  return (
    <section className="rss-section" id="rss-pakistani-entertainment">
      <div className="section-header rss-section-header">
        <div className="section-bar" />
        <h2 className="section-title">{tr('rssTitle')}</h2>
        <span className="rss-hint">{tr('rssHint')}</span>
      </div>
      <p className="rss-live-badge-wrap">
        <span className="rss-live-badge">
          <span className="rss-live-badge-dot">◉</span> LIVE
        </span>
        <span className="rss-disclaimer">{tr('rssDisclaimer')}</span>
      </p>

      {loading || error ? (
        <p className={`rss-status${error ? ' error' : ''}`}>
          {loading ? tr('rssLoading') : error}
          {error ? (
            <button type="button" className="rss-retry-btn" onClick={loadFeed}>
              {tr('rssRetry')}
            </button>
          ) : null}
        </p>
      ) : null}

      {!loading && !error && !featured ? (
        <p className="rss-status error">
          No articles in feed
          <button type="button" className="rss-retry-btn" onClick={loadFeed}>
            {tr('rssRetry')}
          </button>
        </p>
      ) : null}

      {featured ? (
        <div className="rss-news-layout">
          <div className="rss-news-featured">
            <NewsCard item={featured} featured badge="#1 Live" onOpen={setActiveItem} />
          </div>
          <div className="rss-news-side-wrap">
            <div className="rss-news-side" ref={sideRef}>
              {sideItems.map((item, idx) => (
                <div key={`${item.link}-${idx}`} className="rss-news-side-item">
                  <NewsCard item={item} onOpen={setActiveItem} />
                </div>
              ))}
            </div>
            {sideItems.length > 2 ? (
              <button
                type="button"
                className="rss-news-more"
                aria-label="Scroll more news"
                onClick={scrollSide}
              >
                <span className="rss-news-more-btn" aria-hidden="true">›</span>
              </button>
            ) : null}
          </div>
        </div>
      ) : null}

      {activeItem ? <ArticleOverlay item={activeItem} onClose={() => setActiveItem(null)} tr={tr} /> : null}
    </section>
  );
}
