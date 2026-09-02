import LegalLayout from '../components/LegalLayout.jsx';
import { useApp } from '../context/AppContext.jsx';
import { COMPANY_NAME, COMPANY_ADDRESS, COMPANY_LINE } from '../data/company.js';

export default function ContactPage() {
  const { tr } = useApp();
  return (
    <LegalLayout title={tr('contact')}>
      <p className="lead" style={{ textAlign: 'center' }}>{COMPANY_NAME}</p>
      <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.65)', marginBottom: '1.5rem' }}>{COMPANY_LINE}</p>
      <div className="contact-cards">
        <div className="contact-card">
          <div className="contact-icon">📍</div>
          <div>
            <p className="contact-label">Address</p>
            <p className="contact-value">{COMPANY_ADDRESS}</p>
          </div>
        </div>
        <div className="contact-card">
          <div className="contact-icon">🏢</div>
          <div>
            <p className="contact-label">Company</p>
            <p className="contact-value">{COMPANY_NAME}</p>
          </div>
        </div>
      </div>
    </LegalLayout>
  );
}
