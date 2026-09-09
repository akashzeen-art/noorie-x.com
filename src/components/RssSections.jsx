import { useEffect, useRef, useState } from 'react';
import { useApp } from '../context/AppContext.jsx';

/** Primary live feed + local snapshot fallback (same rss.app feed). */
const FEED_URLS = [
  'https://rss.app/feeds/ty2GelKikkAx9ykE.xml',
  '/feeds/pakistani-entertainment.xml',
];
const RSS_LIMIT = 24;

/** These hosts often hang and spam the console with ERR_CONNECTION_TIMED_OUT. */
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

/** Keep feed HTML for iframe, but drop scripts, slow images, and unsafe handlers. */
function sanitizeFeedHtml(html) {
  let out = String(html || '')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<script\b[^>]*\/?>/gi, '')
    .replace(/<iframe\b[^>]*>[\s\S]*?<\/iframe>/gi, '')
    .replace(/<iframe\b[^>]*\/?>/gi, '')
    .replace(/\son[a-z]+\s*=\s*(['"]).*?\1/gi, '')
    .replace(/\s(?:href|src)\s*=\s*(['"])javascript:.*?\1/gi, '');

  // Never request images from hosts that hang the browser
  for (const host of SLOW_IMAGE_HOSTS) {
    const escaped = host.replace(/\./g, '\\.');
    out = out.replace(new RegExp(`<img\\b[^>]*${escaped}[^>]*>`, 'gi'), '');
    out = out.replace(new RegExp(`https?:\\/\\/[^"'\\s>]*${escaped}[^"'\\s>]*`, 'gi'), '');
  }
  out = out.replace(/<img\b[^>]*>/gi, (tag) => {
    const src = (tag.match(/\bsrc=["']([^"']+)["']/i) || [])[1] || '';
    return isSlowImageHost(src) ? '' : tag;
  });
  return out;
}

function stripSlowImagesFromHtml(html) {
  return sanitizeFeedHtml(html);
}

/** Remove timed-out image hosts from raw RSS XML before parse/render. */
function scrubSlowMediaFromXml(xml) {
  let out = String(xml || '');
  for (const host of SLOW_IMAGE_HOSTS) {
    const escaped = host.replace(/\./g, '\\.');
    out = out.replace(new RegExp(`<img\\b[^>]*${escaped}[^>]*>`, 'gi'), '');
    out = out.replace(new RegExp(`<media:content\\b[^>]*${escaped}[^>]*\\/?>`, 'gi'), '');
  }
  return out;
}

function pickImage(itemEl, descriptionHtml) {
  const candidates = [];
  const mediaNodes = [
    ...itemEl.getElementsByTagName('media:content'),
    ...itemEl.getElementsByTagName('content'),
  ];
  for (const media of mediaNodes) {
    const mediaUrl = media.getAttribute('url');
    if (mediaUrl) candidates.push(mediaUrl);
  }
  const enclosure = itemEl.querySelector('enclosure[type^="image"]');
  if (enclosure?.getAttribute('url')) candidates.push(enclosure.getAttribute('url'));
  const m = String(descriptionHtml || '').match(/<img[^>]+src=["']([^"']+)["']/i);
  if (m?.[1]) candidates.push(m[1]);
  return candidates.find((url) => url && !isSlowImageHost(url)) || '';
}

function parseRssXml(xml, limit) {
  const clean = scrubSlowMediaFromXml(
    String(xml || '').replace(/^[\s\S]*?(<\?xml|<rss\b|<feed\b)/i, '$1'),
  );
  const doc = new DOMParser().parseFromString(clean, 'text/xml');
  if (doc.querySelector('parsererror')) throw new Error('Invalid RSS XML');
  const channelTitle =
    doc.querySelector('channel > title')?.textContent?.trim() ||
    doc.querySelector('feed > title')?.textContent?.trim() ||
    'Pakistani Entertainment';
  const nodes = Array.from(doc.querySelectorAll('item, entry')).slice(0, limit || RSS_LIMIT);
  if (!nodes.length) throw new Error('Feed has no articles');
  const items = nodes.map((node) => {
    const title = node.querySelector('title')?.textContent?.trim() || 'Untitled';
    const linkEls = Array.from(node.querySelectorAll('link'));
    const link =
      linkEls.map((el) => el.getAttribute('href')).find(Boolean) ||
      linkEls.map((el) => el.textContent?.trim()).find(Boolean) ||
      '';
    const encoded =
      node.getElementsByTagName('content:encoded')[0]?.textContent ||
      node.getElementsByTagName('encoded')[0]?.textContent ||
      '';
    const descriptionHtml =
      encoded ||
      node.querySelector('description, summary, content')?.textContent ||
      '';
    const creator =
      node.getElementsByTagName('dc:creator')[0]?.textContent?.trim() ||
      node.querySelector('creator, author > name, author')?.textContent?.trim() ||
      channelTitle;
    const pubDate =
      node.querySelector('pubDate, published, updated')?.textContent?.trim() || '';
    const image = pickImage(node, descriptionHtml);
    const contentHtml = sanitizeFeedHtml(descriptionHtml);
    return {
      title,
      link,
      excerpt: stripHtml(descriptionHtml).slice(0, 220),
      contentHtml,
      image,
      source: creator,
      pubDate,
    };
  });
  return { title: channelTitle, items };
}

/** Build a self-contained article page from the RSS item for the iframe. */
function buildFeedItemHtml(item) {
  const title = escapeHtml(item.title || 'Article');
  const source = escapeHtml(item.source || '');
  const date = escapeHtml(formatDate(item.pubDate) || '');
  const image = item.image && !isSlowImageHost(item.image) ? escapeHtml(item.image) : '';
  const body = sanitizeFeedHtml(item.contentHtml || item.excerpt || '');
  const hasImgInBody = /<img\b/i.test(body);

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>${title}</title>
  <style>
    html,body{margin:0;padding:0;background:#0b0b0b;color:#f2f2f2}
    body{font-family:Georgia,"Times New Roman",serif;line-height:1.65;padding:1.25rem 1.35rem 2.5rem}
    .meta{font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#999;font-size:.8rem;margin:0 0 1rem;letter-spacing:.02em}
    h1{font-size:clamp(1.35rem,3vw,1.85rem);line-height:1.25;margin:0 0 1rem;font-weight:700;color:#fff}
    .hero{margin:0 0 1.15rem;border-radius:10px;overflow:hidden;background:#1a1a1a}
    .hero img,.content img{width:100%;height:auto;display:block;border-radius:10px}
    .content{font-size:1.05rem;color:#ddd}
    .content div{margin:0 0 .85rem}
    .content p{margin:0 0 .85rem}
  </style>
</head>
<body>
  <p class="meta">${date}${source ? ` · ${source}` : ''}</p>
  <h1>${title}</h1>
  ${image && !hasImgInBody ? `<div class="hero"><img src="${image}" alt="" referrerpolicy="no-referrer" /></div>` : ''}
  <div class="content">${body || `<p>${escapeHtml(item.excerpt || '')}</p>`}</div>
</body>
</html>`;
}

async function fetchRssXml(urls) {
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
        const looksRss =
          text.includes('<item') ||
          text.includes('<entry') ||
          text.includes('<rss') ||
          text.includes('<feed');
        if (!looksRss) throw new Error('Non-RSS response');
        return text;
      } catch (err) {
        lastError = err;
      }
    }
  }
  throw lastError;
}

function formatDate(value) {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
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
  const [loadingFull, setLoadingFull] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const urls = [];

    const setBlob = (html) => {
      const blob = new Blob([html], { type: 'text/html; charset=utf-8' });
      const blobUrl = URL.createObjectURL(blob);
      urls.push(blobUrl);
      if (!cancelled) {
        setEmbedBlobUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return blobUrl;
        });
      } else {
        URL.revokeObjectURL(blobUrl);
      }
    };

    // Instant preview from RSS XML (short description)
    setBlob(buildFeedItemHtml(item));

    // Then load the full publisher article text into the same iframe
    const loadFull = async () => {
      if (!item.link) return;
      setLoadingFull(true);
      try {
        const res = await fetch(`/api/fetch?url=${encodeURIComponent(item.link)}`);
        const failed = res.headers.get('X-Embed-Failed') === '1';
        const text = await res.text();
        if (cancelled) return;
        if (!res.ok || failed || /data-embed-error=["']1["']/.test(text)) return;
        const cleaned = stripSlowImagesFromHtml(text);
        // Prefer full article when it has real body content
        if (cleaned && cleaned.length > 800) setBlob(cleaned);
      } catch {
        // keep RSS preview
      } finally {
        if (!cancelled) setLoadingFull(false);
      }
    };

    loadFull();

    return () => {
      cancelled = true;
      urls.forEach((u) => URL.revokeObjectURL(u));
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
            <span className="rss-iframe-title">
              {loadingFull ? 'Loading full article…' : item.title}
            </span>
          </div>
          {embedBlobUrl ? (
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
      const xml = await fetchRssXml(FEED_URLS);
      const parsed = parseRssXml(xml, RSS_LIMIT);
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
