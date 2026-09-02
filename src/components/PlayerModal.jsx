import { useRef, useState, useEffect, useCallback } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { videoTitle } from '../i18n/videoTitles.js';

const PLAY_SVG = '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><polygon points="8,5 19,12 8,19" fill="currentColor"/></svg>';
const PAUSE_SVG = '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><rect x="6" y="5" width="4" height="14" fill="currentColor"/><rect x="14" y="5" width="4" height="14" fill="currentColor"/></svg>';

function fmt(t) {
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return m + ':' + String(s).padStart(2, '0');
}

export default function PlayerModal() {
  const { playerVideo, setPlayerVideo, lang } = useApp();
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [showCtrl, setShowCtrl] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [timeLabel, setTimeLabel] = useState('0:00 / 0:00');
  const [progress, setProgress] = useState(0);
  const [maxProgress, setMaxProgress] = useState(0);
  const hideTimer = useRef(null);

  const close = useCallback(() => {
    const v = videoRef.current;
    if (v) {
      v.pause();
      v.removeAttribute('src');
      v.load();
    }
    setPlayerVideo(null);
    setPlaying(false);
  }, [setPlayerVideo]);

  useEffect(() => {
    if (!playerVideo) return;
    const v = videoRef.current;
    if (!v) return;
    v.src = playerVideo.videoUrl;
    v.playbackRate = 1;
    setSpeed(1);
    setShowCtrl(true);
    v.play().catch(() => {});
  }, [playerVideo]);

  const showControls = useCallback(() => {
    setShowCtrl(true);
    clearTimeout(hideTimer.current);
    if (playing) {
      hideTimer.current = setTimeout(() => setShowCtrl(false), 3000);
    }
  }, [playing]);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  };

  if (!playerVideo) return null;

  return (
    <div
      className={`player-modal open${showCtrl ? ' show-ctrl' : ''}${playing ? ' is-playing' : ''}`}
      onClick={(e) => { if (e.target === e.currentTarget) close(); }}
    >
      <div className="player-shell" id="player-shell">
        <div className="player-stage" onMouseMove={showControls}>
          <video
            ref={videoRef}
            className="player-video"
            playsInline
            onPlay={() => { setPlaying(true); showControls(); }}
            onPause={() => { setPlaying(false); setShowCtrl(true); }}
            onTimeUpdate={() => {
              const v = videoRef.current;
              if (!v || !v.duration) return;
              setMaxProgress(v.duration);
              setProgress(v.currentTime);
              const pct = (v.currentTime / v.duration) * 100;
              setTimeLabel(fmt(v.currentTime) + ' / ' + fmt(v.duration));
            }}
            onLoadedMetadata={() => {
              const v = videoRef.current;
              if (v) setMaxProgress(v.duration || 0);
            }}
            onClick={(e) => {
              if (e.target.closest('.player-top, .player-bottom')) return;
              toggle();
            }}
          />
          <div className="player-center-play" style={{ display: playing ? 'none' : 'flex' }} aria-hidden="true">
            <svg viewBox="0 0 24 24" width="32" height="32" aria-hidden="true">
              <polygon points="8,5 19,12 8,19" fill="white" />
            </svg>
          </div>
          <div className="player-top">
            <p className="player-title-text">{videoTitle(lang, playerVideo.title)}</p>
            <button type="button" className="player-close" onClick={close} aria-label="Close">&times;</button>
          </div>
          <div className="player-bottom">
            <input
              type="range"
              className="player-progress"
              min={0}
              max={maxProgress}
              value={progress}
              step={0.1}
              style={{
                background: `linear-gradient(to right,#8B5CF6 ${maxProgress ? (progress / maxProgress) * 100 : 0}%,rgba(148,163,184,0.3) 0)`,
              }}
              onChange={(e) => {
                const v = videoRef.current;
                if (v) v.currentTime = Number(e.target.value);
              }}
            />
            <div className="player-controls">
              <div className="player-controls-left">
                <button type="button" className="player-btn" title="-10s" aria-label="Rewind 10 seconds" onClick={() => {
                  const v = videoRef.current;
                  if (v) v.currentTime = Math.max(0, v.currentTime - 10);
                }}>
                  <svg viewBox="0 0 24 24" width="18" height="18"><path d="M12 5V1L7 6l5 5V7c3.3 0 6 2.7 6 6s-2.7 6-6 6-6-2.7-6-6H4c0 4.4 3.6 8 8 8s8-3.6 8-8-3.6-8-8-8z" fill="currentColor" /></svg>
                  <span>10</span>
                </button>
                <button
                  type="button"
                  className="player-btn player-btn-play"
                  aria-label={playing ? 'Pause' : 'Play'}
                  dangerouslySetInnerHTML={{ __html: playing ? PAUSE_SVG : PLAY_SVG }}
                  onClick={toggle}
                />
                <button type="button" className="player-btn" title="+10s" aria-label="Forward 10 seconds" onClick={() => {
                  const v = videoRef.current;
                  if (v) v.currentTime = Math.min(v.duration || 0, v.currentTime + 10);
                }}>
                  <span>10</span>
                  <svg viewBox="0 0 24 24" width="18" height="18"><path d="M12 5V1l5 5-5 5V7c-3.3 0-6 2.7-6 6s2.7 6 6 6 6-2.7 6-6h2c0 4.4-3.6 8-8 8s-8-3.6-8-8 3.6-8 8-8z" fill="currentColor" /></svg>
                </button>
                <span className="player-time">{timeLabel}</span>
              </div>
              <div className="player-controls-right">
                <button
                  type="button"
                  className="player-btn player-speed"
                  onClick={() => {
                    const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
                    const idx = speeds.indexOf(speed);
                    const next = speeds[(idx + 1) % speeds.length];
                    setSpeed(next);
                    const v = videoRef.current;
                    if (v) v.playbackRate = next;
                  }}
                >
                  {speed}x
                </button>
                <button
                  type="button"
                  className="player-btn"
                  title="Fullscreen"
                  aria-label="Fullscreen"
                  onClick={() => {
                    const shell = document.getElementById('player-shell');
                    if (!document.fullscreenElement) shell?.requestFullscreen().catch(() => {});
                    else document.exitFullscreen().catch(() => {});
                  }}
                >
                  <svg viewBox="0 0 24 24" width="18" height="18"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" fill="currentColor" /></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
