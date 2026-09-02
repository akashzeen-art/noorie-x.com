import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { videoRating, loadCachedDuration, formatDurationMins } from '../utils/video.js';
import { videoTitle } from '../i18n/videoTitles.js';

export default function VideoCard({ video, aspectOverride }) {
  const { playVideo, CHALCHITRA, lang } = useApp();
  const aspect = aspectOverride || video.aspect;
  const aspectClass = aspect === 'portrait' ? 'card-portrait' : 'card-landscape';
  const thumb = CHALCHITRA.thumbUrl(video);
  const [duration, setDuration] = useState(loadCachedDuration(video.id));
  const displayTitle = videoTitle(lang, video.title);

  useEffect(() => {
    const cached = loadCachedDuration(video.id);
    if (cached) {
      setDuration(cached);
      return;
    }
    if (!video.videoUrl) return;
    const el = document.createElement('video');
    el.preload = 'metadata';
    el.muted = true;
    el.src = video.videoUrl;
    const finish = (sec) => {
      if (sec > 0) setDuration(sec);
    };
    el.addEventListener('loadedmetadata', () => finish(el.duration || 0));
    el.addEventListener('error', () => finish(0));
    const t = setTimeout(() => finish(el.duration || 0), 8000);
    return () => clearTimeout(t);
  }, [video.id, video.videoUrl]);

  const rating = videoRating(video);
  const durLabel = formatDurationMins(duration, lang);

  const handleClick = () => {
    playVideo({
      ...video,
      displayThumb: thumb,
      aspect,
    });
  };

  return (
    <button type="button" className={`video-card ${aspectClass}`} onClick={handleClick}>
      <div className="video-card-inner">
        <img src={thumb} alt={displayTitle} loading="lazy" />
        <div className="video-card-gradient" />
        <div className="video-card-play thumb-play" aria-hidden="true">
          <span>
            <svg viewBox="0 0 24 24" width="20" height="20">
              <polygon points="8,5 19,12 8,19" fill="white" />
            </svg>
          </span>
        </div>
      </div>
      <div className="video-card-below">
        <p className="video-card-title">{displayTitle}</p>
        <p className="video-card-meta">
          <span className="video-card-rating">{rating}</span>
          <span className="video-card-sep"> · </span>
          <span className="video-card-dur">{durLabel}</span>
        </p>
      </div>
    </button>
  );
}
