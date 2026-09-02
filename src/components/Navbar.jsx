import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { LANG_OPTIONS } from '../i18n/translations.js';
import { videoTitle } from '../i18n/videoTitles.js';

const NOTIFICATIONS = [
  { text: 'New release: CHASE TO DANGER EP4 is now streaming!', time: '2m ago' },
  { text: "DANGEROUS MINDS EP4 finale — don't miss the shocking twist.", time: '1h ago' },
  { text: 'Your weekly plan renews in 2 days.', time: '3h ago' },
  { text: 'New arrival: BLACK HORIZON added to Premium Collection.', time: '5h ago' },
];

export default function Navbar({ onScrollTo }) {
  const { setMenuOpen, playVideo, CHALCHITRA, lang, setLang, tr } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [bellOpen, setBellOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const searchWrapRef = useRef(null);
  const bellWrapRef = useRef(null);
  const langWrapRef = useRef(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', fn);
    fn();
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    const onDocClick = (e) => {
      if (bellWrapRef.current && !bellWrapRef.current.contains(e.target)) setBellOpen(false);
      if (langWrapRef.current && !langWrapRef.current.contains(e.target)) setLangOpen(false);
      if (searchWrapRef.current && !searchWrapRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  const hits = searchQuery.trim().length >= 2
    ? (CHALCHITRA.allVideos || []).filter((v) => {
        const q = searchQuery.toLowerCase();
        const localized = videoTitle(lang, v.title).toLowerCase();
        return (
          v.title.toLowerCase().includes(q) ||
          localized.includes(q) ||
          v.category.toLowerCase().includes(q)
        );
      }).slice(0, 6)
    : [];

  const handleSearchSelect = (video) => {
    playVideo({ ...video, displayThumb: CHALCHITRA.thumbUrl(video) });
    setSearchOpen(false);
    setSearchQuery('');
  };

  const currentLang = LANG_OPTIONS.find((o) => o.id === lang) || LANG_OPTIONS[0];

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`} id="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <img src="/img/logo/Noorie.png" alt="Noorie-X" />
        </Link>
        <div className="navbar-links">
          {[
            ['top', tr('home')],
            ['fatal', tr('tvShows')],
            ['mission', tr('movies')],
            ['dangerous', tr('newHot')],
            ['escape', tr('myList')],
          ].map(([id, label]) => (
            <button key={id} type="button" onClick={() => onScrollTo(id)}>{label}</button>
          ))}
        </div>
        <div className="navbar-right">
          <div className={`nav-lang-wrap${langOpen ? ' open' : ''}`} ref={langWrapRef}>
            <button
              type="button"
              className="nav-lang-btn"
              aria-label={tr('language')}
              onClick={(e) => { e.stopPropagation(); setLangOpen((o) => !o); setBellOpen(false); }}
            >
              {currentLang.native}
              <span aria-hidden="true">▾</span>
            </button>
            <div className={`nav-lang-dropdown${langOpen ? ' open' : ''}`}>
              <div className="nav-lang-heading">{tr('language')}</div>
              {LANG_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  className={`nav-lang-item${lang === opt.id ? ' active' : ''}`}
                  onClick={() => { setLang(opt.id); setLangOpen(false); }}
                >
                  <span>{opt.native}</span>
                  <span className="nav-lang-item-en">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div className={`nav-search-wrap${searchOpen ? ' open' : ''}`} ref={searchWrapRef}>
            <input
              className="nav-search-input"
              type="search"
              placeholder={tr('searchPlaceholder')}
              autoComplete="off"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchOpen(true)}
            />
            <button
              type="button"
              className="nav-icon-btn"
              aria-label="Search"
              onClick={() => setSearchOpen((o) => !o)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="7" /><path d="M20 20l-3-3" />
              </svg>
            </button>
            <div className={`nav-search-dropdown${hits.length || (searchQuery.length >= 2) ? ' open' : ''}`}>
              {searchQuery.length >= 2 && !hits.length && (
                <div className="nav-search-empty">{tr('noMatches')}</div>
              )}
              {hits.map((v) => (
                <button key={v.id} type="button" className="nav-search-item" onClick={() => handleSearchSelect(v)}>
                  <img src={CHALCHITRA.thumbUrl(v)} alt="" />
                  <span>{videoTitle(lang, v.title)}</span>
                </button>
              ))}
            </div>
          </div>
          <div style={{ position: 'relative' }} ref={bellWrapRef}>
            <button
              type="button"
              className="nav-icon-btn"
              aria-label="Notifications"
              onClick={(e) => { e.stopPropagation(); setBellOpen((o) => !o); setLangOpen(false); }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10 21a2 2 0 0 0 4 0" />
              </svg>
              <span className="nav-bell-dot" />
            </button>
            <div className={`nav-bell-dropdown${bellOpen ? ' open' : ''}`}>
              <span className="nav-bell-badge">N New</span>
              {NOTIFICATIONS.map((n, i) => (
                <div key={i} className="nav-bell-item">
                  {n.text}
                  <span className="nav-bell-time">{n.time}</span>
                </div>
              ))}
            </div>
          </div>
          <button
            type="button"
            className="navbar-hamburger"
            aria-label={tr('menu')}
            onClick={() => setMenuOpen(true)}
          >
            <span /><span /><span />
          </button>
        </div>
      </div>
    </nav>
  );
}
