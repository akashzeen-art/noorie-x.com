import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.jsx';

export default function TitleDetailModal() {
  const {
    titleDetailVideo,
    setTitleDetailVideo,
    CHALCHITRA,
    titleDetailMeta,
    subscriber,
    setPlayerVideo,
    setExploreSection,
    openUnlockPlans,
    readIdSet,
    toggleIdInSet,
    MYLIST_KEY,
    LIKES_KEY,
    showToast,
    loadCachedDuration,
    formatDurationMins,
    saveCachedDuration,
    tr,
  } = useApp();

  const [runtime, setRuntime] = useState('—');
  const [inList, setInList] = useState(false);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (!titleDetailVideo) return;
    const meta = titleDetailMeta(titleDetailVideo);
    setRuntime(meta.runtime);
    setInList(readIdSet(MYLIST_KEY).includes(String(titleDetailVideo.id)));
    setLiked(readIdSet(LIKES_KEY).includes(String(titleDetailVideo.id)));

    const cached = loadCachedDuration(titleDetailVideo.id);
    if (cached) {
      setRuntime(formatDurationMins(cached));
      return;
    }
    if (!titleDetailVideo.videoUrl) return;
    const el = document.createElement('video');
    el.preload = 'metadata';
    el.muted = true;
    el.src = titleDetailVideo.videoUrl;
    el.addEventListener('loadedmetadata', () => {
      const sec = el.duration || 0;
      if (sec > 0) {
        saveCachedDuration(titleDetailVideo.id, sec);
        setRuntime(formatDurationMins(sec));
      }
    });
  }, [titleDetailVideo, titleDetailMeta, readIdSet, MYLIST_KEY, LIKES_KEY, loadCachedDuration, formatDurationMins, saveCachedDuration, tr]);

  if (!titleDetailVideo) return null;

  const meta = titleDetailMeta(titleDetailVideo);
  const thumb = titleDetailVideo.displayThumb || CHALCHITRA.thumbUrl(titleDetailVideo);

  const handlePlay = () => {
    setTitleDetailVideo(null);
    setExploreSection(null);
    if (subscriber) {
      setPlayerVideo(titleDetailVideo);
    } else {
      openUnlockPlans();
    }
  };

  const handleList = () => {
    const added = toggleIdInSet(MYLIST_KEY, titleDetailVideo.id);
    setInList(added);
    showToast(added ? tr('addedToList') : tr('removedFromList'));
  };

  const handleLike = () => {
    const nowLiked = toggleIdInSet(LIKES_KEY, titleDetailVideo.id);
    setLiked(nowLiked);
    showToast(nowLiked ? tr('liked') : tr('removedLike'));
  };

  return (
    <div
      className="title-detail open"
      aria-hidden="false"
      onClick={(e) => { if (e.target === e.currentTarget) setTitleDetailVideo(null); }}
    >
      <div className="title-detail-box" role="dialog" aria-modal="true">
        <button type="button" className="title-detail-close" onClick={() => setTitleDetailVideo(null)} aria-label={tr('close')}>&times;</button>
        <div className={`title-detail-hero${titleDetailVideo.aspect === 'portrait' ? ' is-portrait' : ''}`}>
          <div className="title-detail-hero-media">
            <img src={thumb} alt={meta.title} />
          </div>
          <div className="title-detail-hero-content">
            <span className="td-uhd-badge">4K ULTRA HD</span>
            <h2 className="td-title">{meta.title}</h2>
            <p className="td-tagline">{meta.tagline}</p>
            <div className="td-progress-row">
              <div className="td-progress"><span style={{ width: `${meta.progress}%` }} /></div>
              <span className="td-runtime">{runtime}</span>
            </div>
            <div className="td-actions">
              <button type="button" className="td-play" onClick={handlePlay}>
                <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                  <polygon points="6,4 20,12 6,20" fill="currentColor" />
                </svg>
                {tr('play')}
              </button>
              <button
                type="button"
                className={`td-icon-btn${inList ? ' active' : ''}`}
                onClick={handleList}
                aria-label={inList ? 'Remove from My List' : 'Add to My List'}
              >
                {inList ? '✓' : '+'}
              </button>
              <button
                type="button"
                className={`td-icon-btn${liked ? ' active' : ''}`}
                onClick={handleLike}
                aria-label={liked ? 'Unlike' : 'Like'}
                aria-pressed={liked}
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M7 11v10M14 21H7a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h2.5L14 3a3 3 0 0 1 3 3v8h3.5a2 2 0 0 1 2 2l-1.5 8a2 2 0 0 1-2 2H14z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div className="title-detail-meta">
          <div className="td-meta-left">
            <div className="td-stats">
              <span className="td-match">{meta.match}</span>
              <span>{meta.year}</span>
              <span className="td-chip">{meta.rating}</span>
              <span>{runtime}</span>
              <span className="td-chip">HD</span>
            </div>
            <p className="td-desc">{meta.desc}</p>
          </div>
          <div className="td-meta-right">
            <p><span className="td-label">{tr('genre')}</span> {meta.genre}</p>
            <p><span className="td-label">{tr('thisTitleIs')}</span> {meta.moods}</p>
            <p><span className="td-label">{tr('maturity')}</span> {meta.maturity}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
