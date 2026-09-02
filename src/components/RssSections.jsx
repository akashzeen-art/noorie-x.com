import { useEffect, useRef, useState } from 'react';
import { useApp } from '../context/AppContext.jsx';

const FEED_URL = 'https://rss.app/feeds/ty2GelKikkAx9ykE.xml';
const RSS_LIMIT = 24;

function stripHtml(html) {
  const tmp = document.createElement('div');
  tmp.innerHTML = html || '';
  return (tmp.textContent || tmp.innerText || '').replace(/\s+/g, ' ').trim();
}

function pickImage(itemEl, descriptionHtml) {
  const media = itemEl.querySelector('media\\:content, content');
  const mediaUrl = media?.getAttribute('url');
  if (mediaUrl) return mediaUrl;
  const enclosure = itemEl.querySelector('enclosure[type^="image"]');
  if (enclosure?.getAttribute('url')) return enclosure.getAttribute('url');
  const m = String(descriptionHtml || '').match(/<img[^>]+src=["']([^"']+)["']/i);
  return m ? m[1] : '';
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
      contentHtml: descriptionHtml,
      image: pickImage(node, descriptionHtml),
      source: creator,
      pubDate,
    };
  });
  return { title: channelTitle, items };
}

async function fetchRssXml(url) {
  const localProxy = `/api/rss?url=${encodeURIComponent(url)}`;
  const res = await fetch(localProxy);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const text = await res.text();
  if (!(text.includes('<item') || text.includes('<entry') || text.includes('<rss') || text.includes('<feed'))) {
    throw new Error('Non-RSS response');
  }
  return text;
}

function formatDate(value) {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function NewsCard({ item, featured, badge, onOpen }) {
  return (
    <button
      type="button"
      className={`rss-news-card${featured ? ' is-featured' : ''}`}
      onClick={() => onOpen(item)}
    >
      {item.image ? (
        <img
          src={item.image}
          alt={item.title}
          className="rss-news-card-img"
          loading="lazy"
          referrerPolicy="no-referrer"
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
  const body = item.contentHtml || '';
  const hasHtml = /<\/?[a-z][\s\S]*>/i.test(body);
  // Same-origin proxy so sites with X-Frame-Options still load in the iframe
  const embedSrc = item.link ? `/api/fetch?url=${encodeURIComponent(item.link)}` : '';

  useEffect(() => {
    setShowIframe(false);
  }, [item?.link]);

  return (
    <div className="rss-article-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={`rss-article-overlay-box${showIframe ? ' is-iframe' : ''}`}>
        <button type="button" className="rss-article-close" onClick={onClose} aria-label={tr('close')}>&times;</button>

        {showIframe && embedSrc ? (
          <div className="rss-iframe-wrap">
            <div className="rss-iframe-toolbar">
              <button type="button" className="rss-read-more" onClick={() => setShowIframe(false)}>
                ← Back to summary
              </button>
              <a
                className="rss-read-more"
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open in new tab
              </a>
              <span className="rss-iframe-title">{item.title}</span>
            </div>
            <iframe
              className="rss-iframe"
              src={embedSrc}
              title={item.title}
              referrerPolicy="no-referrer"
            />
          </div>
        ) : (
          <div className="rss-article-view">
            <p className="rss-post-meta">
              {formatDate(item.pubDate)}
              {item.source ? <span className="rss-post-author"> · {item.source}</span> : null}
            </p>
            <h3 className="rss-article-view-title">{item.title}</h3>
            {item.image ? (
              <div className="rss-article-hero">
                <img src={item.image} alt="" referrerPolicy="no-referrer" />
              </div>
            ) : null}
            {hasHtml ? (
              <div className="rss-article-view-content" dangerouslySetInnerHTML={{ __html: body }} />
            ) : (
              <p className="rss-article-view-text">{item.excerpt || stripHtml(body)}</p>
            )}
            {item.link ? (
              <button type="button" className="rss-read-more" onClick={() => setShowIframe(true)}>
                Open original
              </button>
            ) : null}
            <button
              type="button"
              className="rss-read-more"
              style={{ marginLeft: item.link ? 10 : 0 }}
              onClick={onClose}
            >
              ← Back
            </button>
          </div>
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
      const xml = await fetchRssXml(FEED_URL);
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
