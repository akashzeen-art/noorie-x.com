import LegalLayout from '../components/LegalLayout.jsx';
import { useApp } from '../context/AppContext.jsx';
import { COMPANY_NAME, COMPANY_LINE } from '../data/company.js';

export default function TermsPage() {
  const { tr } = useApp();
  return (
    <LegalLayout title={tr('terms')}>
      <p className="date">Last Updated: 15-01-2026</p>
      <p>At {COMPANY_NAME}, one of our main priorities is the privacy of our visitors. This document explains the terms that apply when you use our platform.</p>
      <p><strong>Company:</strong> {COMPANY_LINE}</p>
      <h2>Consent</h2>
      <p>By using our website, you hereby consent to our Terms &amp; Conditions and agree to its terms.</p>
      <h2>Information we collect</h2>
      <p>The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information.</p>
      <h2>How we use your information</h2>
      <p>We use the information we collect in various ways, including to provide, operate, and maintain our website; improve and personalize our website; and communicate with you.</p>
    </LegalLayout>
  );
}
