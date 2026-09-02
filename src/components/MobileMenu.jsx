import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { LANG_OPTIONS } from '../i18n/translations.js';

export default function MobileMenu({ onScrollTo }) {
  const { menuOpen, setMenuOpen, setAccountOpen, lang, setLang, tr } = useApp();

  const close = () => setMenuOpen(false);

  const handleScroll = (id) => {
    close();
    onScrollTo(id);
  };

  const handleAccount = () => {
    close();
    setAccountOpen(true);
  };

  return (
    <>
      <div className={`mobile-menu-overlay${menuOpen ? ' open' : ''}`} onClick={close} />
      <aside className={`mobile-menu${menuOpen ? ' open' : ''}`}>
        <div className="mobile-menu-header">
          <span>{tr('menu')}</span>
          <button type="button" onClick={close} aria-label="Close">&times;</button>
        </div>
        <p className="mobile-menu-tagline">{tr('tagline')}</p>
        <div className="mobile-lang-row" aria-label={tr('language')}>
          {LANG_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              className={`mobile-lang-btn${lang === opt.id ? ' active' : ''}`}
              onClick={() => setLang(opt.id)}
            >
              {opt.native}
            </button>
          ))}
        </div>
        <nav>
          <button type="button" onClick={() => handleScroll('top')}>{tr('home')}</button>
          <button type="button" onClick={() => handleScroll('fatal')}>{tr('tvShows')}</button>
          <button type="button" onClick={() => handleScroll('mission')}>{tr('movies')}</button>
          <button type="button" onClick={() => handleScroll('dangerous')}>{tr('newHot')}</button>
          <button type="button" onClick={handleAccount}>{tr('myAccount')}</button>
          <Link to="/about" onClick={close}>{tr('aboutUs')}</Link>
          <Link to="/terms" onClick={close}>{tr('terms')}</Link>
          <Link to="/refund" onClick={close}>{tr('refund')}</Link>
          <Link to="/privacy" onClick={close}>{tr('privacy')}</Link>
          <Link to="/contact" onClick={close}>{tr('contact')}</Link>
        </nav>
      </aside>
    </>
  );
}
