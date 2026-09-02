import { COMING_SOON } from '../data/comingSoon.js';
import { useApp } from '../context/AppContext.jsx';
import { videoTitle, videoCategory } from '../i18n/videoTitles.js';

export default function ComingSoon() {
  const { setComingDetailIdx, tr, lang } = useApp();

  return (
    <section className="coming-section" id="coming-soon">
      <div className="section-header">
        <div className="section-bar" />
        <h2 className="section-title">{tr('comingSoon')}</h2>
      </div>
      <div className="coming-row scrollbar-hide">
        {COMING_SOON.map((item, i) => (
          <button
            key={item.title}
            type="button"
            className="coming-card"
            onClick={() => setComingDetailIdx(i)}
          >
            <div className="coming-card-img">
              <img src={encodeURI(item.thumb)} alt="" loading="lazy" draggable={false} />
              <span className="coming-badge" aria-hidden="true">{item.badge}</span>
              <div className="thumb-play" aria-hidden="true">
                <span>
                  <svg viewBox="0 0 24 24" width="18" height="18">
                    <polygon points="8,5 19,12 8,19" fill="white" />
                  </svg>
                </span>
              </div>
            </div>
            <div className="coming-card-body">
              <h3>{videoTitle(lang, item.title)}</h3>
              <p className="coming-meta">{videoCategory(lang, item.category)}</p>
              <span className="coming-date">⏱ {item.releaseDate}</span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
