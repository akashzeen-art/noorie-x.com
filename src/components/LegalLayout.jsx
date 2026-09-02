import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';

export default function LegalLayout({ title, children }) {
  const { tr } = useApp();

  return (
    <div className="legal-page">
      <header className="legal-header">
        <div className="legal-header-inner">
          <Link to="/" className="legal-brand">
            <img src="/img/logo/Noorie.png" alt="Noorie-X" />
          </Link>
          <Link to="/" className="legal-back">{tr('backHome')}</Link>
        </div>
      </header>
      <main className="legal-main">
        <h1>{title}</h1>
        {children}
      </main>
    </div>
  );
}
