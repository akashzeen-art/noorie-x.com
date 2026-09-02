import { useRef, useState, useEffect } from 'react';
import VideoCard from './VideoCard.jsx';
import DeviceShowcase from './DeviceShowcase.jsx';
import Carousel3D from './Carousel3D.jsx';
import RssSections from './RssSections.jsx';
import { useApp } from '../context/AppContext.jsx';
import { TOP_HOME_SECTION_IDS } from '../data/heroData.js';
import { sectionTitle } from '../i18n/translations.js';

function VideoRow({ videos, tr }) {
  const rowRef = useRef(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    const update = () => {
      setShowLeft(row.scrollLeft > 4);
      setShowRight(row.scrollLeft < row.scrollWidth - row.clientWidth - 4);
    };
    row.addEventListener('scroll', update, { passive: true });
    update();
    return () => row.removeEventListener('scroll', update);
  }, [videos]);

  const scroll = (dir) => {
    const row = rowRef.current;
    if (!row) return;
    row.scrollBy({ left: dir * row.clientWidth * 0.75, behavior: 'smooth' });
  };

  return (
    <div className="row-wrap">
      <button type="button" className={`row-arrow left${showLeft ? ' show' : ''}`} aria-label={tr('scrollLeft')} onClick={() => scroll(-1)}>‹</button>
      <div className="video-row scrollbar-hide" ref={rowRef}>
        {videos.map((v) => <VideoCard key={v.id} video={v} />)}
      </div>
      <button type="button" className={`row-arrow right${showRight ? ' show' : ''}`} aria-label={tr('scrollRight')} onClick={() => scroll(1)}>›</button>
    </div>
  );
}

function ContentSectionBlock({ sec, videos, onExplore, lang, tr }) {
  const isGrid = sec.layout === 'grid2x4';
  const count = sec.layout === 'grid2x6' ? 12 : isGrid ? 8 : 14;
  const slice = videos.slice(0, count);

  if (!slice.length) return null;

  return (
    <section className="content-section" id={sec.id}>
      <div className="section-header">
        <div className="section-bar" />
        <h2 className="section-title">{sectionTitle(lang, sec.id, sec.title)}</h2>
        <button type="button" className="section-explore" onClick={() => onExplore(sec.id)}>{tr('exploreAll')}</button>
      </div>
      {isGrid ? (
        <div className="video-grid-2x4">
          {slice.map((v) => <VideoCard key={v.id} video={v} />)}
        </div>
      ) : (
        <VideoRow videos={slice} tr={tr} />
      )}
    </section>
  );
}

export default function ContentSections() {
  const { CHALCHITRA, setExploreSection, lang, tr } = useApp();

  const usedIds = {};
  const sections = [];

  CHALCHITRA.homeSections.forEach((sec) => {
    const raw = CHALCHITRA[sec.videosKey] || [];
    const isTop = !!TOP_HOME_SECTION_IDS[sec.id];
    let videos;

    if (isTop) {
      videos = raw;
      raw.forEach((v) => { if (v?.id) usedIds[v.id] = true; });
    } else {
      videos = raw.filter((v) => v?.id && !usedIds[v.id]);
      videos.forEach((v) => { usedIds[v.id] = true; });
    }

    sections.push({ sec, videos });
  });

  return (
    <>
      {sections.map(({ sec, videos }) => (
        <div key={sec.id}>
          <ContentSectionBlock sec={sec} videos={videos} onExplore={setExploreSection} lang={lang} tr={tr} />
          {sec.id === 'wanted-landscape' && <DeviceShowcase />}
          {sec.id === 'chase-danger' && <Carousel3D />}
          {sec.id === 'trending' && <RssSections />}
        </div>
      ))}
    </>
  );
}
