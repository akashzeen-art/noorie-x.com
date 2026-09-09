import { useEffect, useRef, useState } from 'react';
import { useApp } from '../context/AppContext.jsx';

const FEED_URLS = [
  'https://rss.app/feeds/ty2GelKikkAx9ykE.xml',
];
const RSS_LIMIT = 24;

/** Hosts that often hang/timeout from many networks — skip so the UI stays fast. */
const SLOW_IMAGE_HOSTS = [
  'pakobserver.net',
  'propakistani.pk',
];

function isSlowImageHost(url) {
  const raw = String(url || '').toLowerCase();
  if (SLOW_IMAGE_HOSTS.some((h) => raw.includes(h))) return true;
  try {
    const host = new URL(url).hostname.replace(/^www\./i, '').toLowerCase();
    return SLOW_IMAGE_HOSTS.some((h) => host === h || host.endsWith(`.${h}`));
  } catch {
    return false;
  }
}

function safeImageUrl(url) {
  if (!url) return '';
  return isSlowImageHost(url) ? '' : url;
}

function stripHtml(html) {
  const tmp = document.createElement('div');
  tmp.innerHTML = html || '';
  return (tmp.textContent || tmp.innerText || '').replace(/\s+/g, ' ').trim();
}

/** Remove embedded images from feed HTML so they don't trigger timed-out requests. */
function sanitizeArticleHtml(html) {
  return String(html || '')
    .replace(/<picture\b[^>]*>[\s\S]*?<\/picture>/gi, '')
    .replace(/<img\b[^>]*>/gi, '')
    .replace(/<source\b[^>]*>/gi, '');
}

function pickImage(itemEl, descriptionHtml) {
  const candidates = [];
  const media = itemEl.querySelector('media\\:content, content');
  const mediaUrl = media?.getAttribute('url');
  if (mediaUrl) candidates.push(mediaUrl);
  const enclosure = itemEl.querySelector('enclosure[type^="image"]');
  if (enclosure?.getAttribute('url')) candidates.push(enclosure.getAttribute('url'));
  const m = String(descriptionHtml || '').match(/<img[^>]+src=["']([^"']+)["']/i);
  if (m?.[1]) candidates.push(m[1]);
  for (const url of candidates) {
    const safe = safeImageUrl(url);
    if (safe) return safe;
  }
  return '';
}

function parseRssXml(xml, limit) {
  const doc = new DOMParser().parseFromString(xml, 'text/xml');
  if (doc.querySelector('parsererror')) throw new Error('Invalid RSS XML');
  const channelTitle = doc.querySelector('channel > title')?.textContent?.trim() || 'Entertainment News';
  const nodes = Array.from(doc.querySelectorAll('item, entry')).slice(0, limit || RSS_LIMIT);
  const items = nodes.map((node) => {
    const title = node.querySelector('title')?.textContent?.trim() || 'Untitled';
    const link =
      node.querySelector('link')?.getAttribute('href') ||
      node.querySelector('link')?.textContent?.trim() ||
      '';
    const descriptionHtml =
      node.querySelector('content\\:encoded, encoded')?.textContent ||
      node.querySelector('description, summary, content')?.textContent ||
      '';
    const creator =
      node.querySelector('dc\\:creator, creator, author > name, author')?.textContent?.trim() ||
      channelTitle;
    const pubDate =
      node.querySelector('pubDate, published, updated')?.textContent?.trim() || '';
    return {
      title,
      link,
      excerpt: stripHtml(descriptionHtml).slice(0, 220),
      contentHtml: sanitizeArticleHtml(descriptionHtml),
      image: pickImage(node, descriptionHtml),
      source: creator,
      pubDate,
    };
  });
  return { title: channelTitle, items };
}

async function fetchRssXml(urls) {
  const list = Array.isArray(urls) ? urls : [urls];
  let lastError = new Error('Failed to load feed');
  for (const url of list) {
    try {
      const localProxy = `/api/rss?url=${encodeURIComponent(url)}`;
      const res = await fetch(localProxy);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      if (!(text.includes('<item') || text.includes('<entry') || text.includes('<rss') || text.includes('<feed'))) {
        throw new Error('Non-RSS response');
      }
      return text;
    } catch (err) {
      lastError = err;
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
  return (
    <button
      type="button"
      className={`rss-news-card${featured ? ' is-featured' : ''}`}
      onClick={() => onOpen(item)}
    >
      {item.image && !imgFailed ? (
        <img
          src={item.image}
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
  const [showIframe, setShowIframe] = useState(false);
  const [iframeFailed, setIframeFailed] = useState(false);
  const [iframeLoading, setIframeLoading] = useState(false);
  const [heroFailed, setHeroFailed] = useState(false);
  const [embedBlobUrl, setEmbedBlobUrl] = useState('');
  const body = item.contentHtml || '';
  const hasHtml = /<\/?[a-z][\s\S]*>/i.test(body);

  useEffect(() => {
    setShowIframe(false);
    setIframeFailed(false);
    setIframeLoading(false);
    setHeroFailed(false);
    setEmbedBlobUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return '';
    });
  }, [item?.link]);

  useEffect(() => () => {
    if (embedBlobUrl) URL.revokeObjectURL(embedBlobUrl);
  }, [embedBlobUrl]);

  const openOriginal = async () => {
    if (!item.link) return;
    // Skip iframe entirely for hosts that hang and pull timed-out images
    if (isSlowImageHost(item.link)) {
      setIframeFailed(true);
      setShowIframe(false);
      return;
    }
    setIframeLoading(true);
    setIframeFailed(false);
    try {
      const res = await fetch(`/api/fetch?url=${encodeURIComponent(item.link)}`);
      const failed = res.headers.get('X-Embed-Failed') === '1';
      // Also detect error page body if header is missing
      const text = await res.text();
      const bodyFailed = /data-embed-error=["']1["']/.test(text);
      if (!res.ok || failed || bodyFailed) {
        setIframeFailed(true);
        setShowIframe(false);
        return;
      }
      // Use blob URL so we don't fetch the proxy again (and so we use stripped HTML)
      const blob = new Blob([text], { type: 'text/html; charset=utf-8' });
      const blobUrl = URL.createObjectURL(blob);
      setEmbedBlobUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return blobUrl;
      });
      setShowIframe(true);
    } catch {
      setIframeFailed(true);
      setShowIframe(false);
    } finally {
      setIframeLoading(false);
    }
  };

  const summaryView = (
    <div className="rss-article-view">
      {iframeFailed ? (
        <p className="rss-embed-note">
          Original site blocked or timed out the preview. Showing the feed summary instead.
        </p>
      ) : null}
      <p className="rss-post-meta">
        {formatDate(item.pubDate)}
        {item.source ? <span className="rss-post-author"> · {item.source}</span> : null}
      </p>
      <h3 className="rss-article-view-title">{item.title}</h3>
      {item.image && !heroFailed ? (
        <div className="rss-article-hero">
          <img
            src={item.image}
            alt=""
            referrerPolicy="no-referrer"
            onError={() => setHeroFailed(true)}
          />
        </div>
      ) : null}
      {hasHtml ? (
        <div className="rss-article-view-content" dangerouslySetInnerHTML={{ __html: body }} />
      ) : (
        <p className="rss-article-view-text">{item.excerpt || stripHtml(body)}</p>
      )}
      {item.link && !iframeFailed ? (
        <button type="button" className="rss-read-more" onClick={openOriginal} disabled={iframeLoading}>
          {iframeLoading ? 'Loading…' : 'Open original'}
        </button>
      ) : null}
      <button
        type="button"
        className="rss-read-more"
        style={{ marginLeft: item.link && !iframeFailed ? 10 : 0 }}
        onClick={onClose}
      >
        ← Back
      </button>
    </div>
  );

  return (
    <div className="rss-article-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={`rss-article-overlay-box${showIframe && !iframeFailed ? ' is-iframe' : ''}`}>
        <button type="button" className="rss-article-close" onClick={onClose} aria-label={tr('close')}>&times;</button>

        {showIframe && embedBlobUrl && !iframeFailed ? (
          <div className="rss-iframe-wrap">
            <div className="rss-iframe-toolbar">
              <button
                type="button"
                className="rss-read-more"
                onClick={() => {
                  setShowIframe(false);
                  setIframeFailed(false);
                  setEmbedBlobUrl((prev) => {
                    if (prev) URL.revokeObjectURL(prev);
                    return '';
                  });
                }}
              >
                ← Back to summary
              </button>
              <span className="rss-iframe-title">{item.title}</span>
            </div>
            <iframe
              className="rss-iframe"
              src={embedBlobUrl}
              title={item.title}
              referrerPolicy="no-referrer"
              sandbox=""
            />
          </div>
        ) : (
          summaryView
        )}
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
