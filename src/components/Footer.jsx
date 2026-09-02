import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { COMPANY_LINE } from '../data/company.js';

export default function Footer() {
  const { tr } = useApp();
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <img src="/img/logo/Noorie.png" alt="Noorie-X" />
        </div>
        <nav className="footer-links" aria-label="Footer">
          <Link to="/about">{tr('aboutUs')}</Link>
          <Link to="/terms">{tr('terms')}</Link>
          <Link to="/privacy">{tr('privacy')}</Link>
          <Link to="/refund">{tr('refund')}</Link>
          <Link to="/contact">{tr('contact')}</Link>
        </nav>
        <p className="footer-company">{COMPANY_LINE}</p>
        <p className="footer-copy">© {new Date().getFullYear()} Noorie-X. {tr('footerRights')}</p>
      </div>
    </footer>
  );
}
