import { useState, useEffect, useCallback } from 'react';
import { HERO_PORTRAITS } from '../data/heroData.js';
import { useApp } from '../context/AppContext.jsx';
import { heroSlide, heroSlideCount } from '../i18n/translations.js';

function heroPick(start, count) {
  const out = [];
  const n = HERO_PORTRAITS.length;
  for (let i = 0; i < count; i++) out.push(HERO_PORTRAITS[(start + i) % n]);
  return out;
}

function Poster({ src }) {
  return (
    <div className="ztv-poster">
      <img src={encodeURI(src)} alt="" loading="lazy" draggable={false} />
    </div>
  );
}

export default function Hero({ onExplore }) {
  const { playVideo, CHALCHITRA, tr, lang } = useApp();
  const [slide, setSlide] = useState(0);

  const bgSet = heroPick(0, 6);
  const floatSet = heroPick(0, 5);
  const floatTransforms = [
    'translateX(calc(-50% - 30vw)) translateY(20px) rotate(-22deg) scale(0.88)',
    'translateX(calc(-50% - 15vw)) translateY(10px) rotate(-11deg) scale(0.94)',
    'translateX(-50%) translateY(0) rotate(0deg) scale(1)',
    'translateX(calc(-50% + 15vw)) translateY(10px) rotate(11deg) scale(0.94)',
    'translateX(calc(-50% + 30vw)) translateY(20px) rotate(22deg) scale(0.88)',
  ];
  const floatZ = [8, 9, 10, 9, 8];
  const fanSet = heroPick(2, 7);
  const fanLayout = [
    { x: '-34.5vw', y: -27, z: 16, o: 0.71 },
    { x: '-23vw', y: -18, z: 34, o: 0.79 },
    { x: '-11.5vw', y: -9, z: 52, o: 0.87 },
    { x: '0vw', y: 0, z: 70, o: 0.95 },
    { x: '11.5vw', y: 9, z: 52, o: 0.87 },
    { x: '23vw', y: 18, z: 34, o: 0.79 },
    { x: '34.5vw', y: 27, z: 16, o: 0.71 },
  ];
  const leftSet = heroPick(0, 10);
  const rightSet = heroPick(8, 10);
  const marqueeSet = heroPick(0, 16).concat(heroPick(0, 16));

  useEffect(() => {
    const timer = setInterval(() => setSlide((s) => (s + 1) % heroSlideCount()), 4500);
    return () => clearInterval(timer);
  }, []);

  const current = heroSlide(lang, slide);

  const handleWatch = useCallback(() => {
    const first = CHALCHITRA.midnightVideos?.[0];
    if (first) {
      playVideo({ ...first, displayThumb: CHALCHITRA.thumbUrl(first) });
    }
  }, [CHALCHITRA, playVideo]);

  return (
    <section className="ztv-hero" id="hero" aria-label="Noorie-X hero">
      <div className="ztv-hero-bg" aria-hidden="true">
        {bgSet.map((src, i) => (
          <div key={src} className={`ztv-hero-bg-slide${i === slide % bgSet.length ? ' is-on' : ''}`}>
            <img src={encodeURI(src)} alt="" />
          </div>
        ))}
      </div>
      <div className="ztv-hero-veil" aria-hidden="true" />
      <div className="ztv-hero-shine" aria-hidden="true" />
      <div className="ztv-hero-ring" aria-hidden="true" />
      <div className="ztv-hero-ring ztv-hero-ring--rev" aria-hidden="true" />

      <div className="ztv-hero-floats" aria-hidden="true">
        <div className="ztv-hero-floats-inner">
          {floatSet.map((src, i) => (
            <div
              key={src}
              className="ztv-float"
              style={{
                transform: floatTransforms[i],
                zIndex: floatZ[i],
                animationDelay: `${i * 0.35}s`,
              }}
            >
              <Poster src={src} />
            </div>
          ))}
        </div>
      </div>

      <div className="ztv-hero-fan" aria-hidden="true">
        <div className="ztv-hero-fan-stage">
          {fanSet.map((src, i) => {
            const L = fanLayout[i];
            return (
              <div
                key={src}
                className="ztv-fan-card"
                style={{
                  transform: `translateX(${L.x}) rotateY(${L.y}deg) translateZ(${L.z}px)`,
                  zIndex: L.z,
                  opacity: L.o,
                }}
              >
                <Poster src={src} />
              </div>
            );
          })}
        </div>
      </div>

      <div className="ztv-hero-rail ztv-hero-rail--left" aria-hidden="true">
        <div className="ztv-hero-rail-fade" />
        <div className="ztv-hero-col ztv-hero-col--up">
          {leftSet.concat(leftSet).map((src, i) => <Poster key={`l-${i}`} src={src} />)}
        </div>
      </div>
      <div className="ztv-hero-rail ztv-hero-rail--right" aria-hidden="true">
        <div className="ztv-hero-rail-fade" />
        <div className="ztv-hero-col ztv-hero-col--down">
          {rightSet.concat(rightSet).map((src, i) => <Poster key={`r-${i}`} src={src} />)}
        </div>
      </div>

      <div className="ztv-hero-copy">
        <div className="ztv-hero-panel">
          <div className="ztv-hero-brand">
            <img src="/img/logo/Noorie.png" alt="Noorie-X" className="ztv-hero-logo" />
            <span className="ztv-hero-live"><span className="ztv-hero-live-dot" />{tr('live')}</span>
          </div>
          <div className="ztv-hero-slide-copy">
            <h1 className="ztv-hero-title">{current.title}</h1>
            <div className="ztv-hero-rule" />
            <p className="ztv-hero-sub">{current.sub}</p>
          </div>
          <p className="ztv-hero-tagline">
            {tr('heroTaglineBefore')}<span>{tr('heroTaglineHighlight')}</span>
          </p>
          <div className="ztv-hero-actions">
            <button type="button" className="ztv-hero-cta" onClick={handleWatch}>
              <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="currentColor" d="M8 5v14l11-7z" />
              </svg>
              {tr('startWatching')}
            </button>
            <button type="button" className="ztv-hero-ghost" onClick={onExplore}>{tr('exploreTitles')}</button>
          </div>
          <div className="ztv-hero-dots" role="tablist" aria-label="Featured titles">
            {Array.from({ length: heroSlideCount() }, (_, i) => (
              <button
                key={i}
                type="button"
                className={`ztv-hero-dot${i === slide ? ' is-on' : ''}`}
                aria-label={heroSlide(lang, i).title}
                onClick={() => setSlide(i)}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="ztv-hero-strip" aria-hidden="true">
        <div className="ztv-hero-strip-fade" />
        <div className="ztv-hero-marquee">
          {marqueeSet.map((src, i) => <Poster key={`m-${i}`} src={src} />)}
        </div>
      </div>
    </section>
  );
}
