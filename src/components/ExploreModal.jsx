import { useApp } from '../context/AppContext.jsx';
import { TOP_HOME_SECTION_IDS } from '../data/heroData.js';
import { sectionTitle } from '../i18n/translations.js';
import VideoCard from './VideoCard.jsx';

export default function ExploreModal() {
  const { exploreSection, setExploreSection, CHALCHITRA, lang, tr } = useApp();
  if (!exploreSection) return null;

  const sec = CHALCHITRA.homeSections.find((s) => s.id === exploreSection);
  if (!sec) return null;

  let videos = CHALCHITRA[sec.videosKey] || [];
  if (!TOP_HOME_SECTION_IDS[sec.id]) {
    const topUsed = {};
    CHALCHITRA.homeSections.forEach((s) => {
      if (!TOP_HOME_SECTION_IDS[s.id]) return;
      (CHALCHITRA[s.videosKey] || []).forEach((v) => {
        if (v?.id) topUsed[v.id] = true;
      });
    });
    videos = videos.filter((v) => v?.id && !topUsed[v.id]);
  }

  return (
    <div className="explore-modal open" id="explore-modal">
      <div className="explore-modal-header">
        <h3>{sectionTitle(lang, sec.id, sec.title)}</h3>
        <button type="button" className="modal-close-btn" onClick={() => setExploreSection(null)} aria-label={tr('close')}>&times;</button>
      </div>
      <div className="explore-grid">
        {videos.map((v) => <VideoCard key={v.id} video={v} />)}
      </div>
    </div>
  );
}
