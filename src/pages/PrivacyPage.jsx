import LegalLayout from '../components/LegalLayout.jsx';
import { useApp } from '../context/AppContext.jsx';
import { COMPANY_NAME, COMPANY_LINE } from '../data/company.js';

export default function PrivacyPage() {
  const { tr } = useApp();
  return (
    <LegalLayout title={tr('privacy')}>
      <p className="date">Last Updated: 23-04-2026</p>
      <p>This Privacy Policy describes how {COMPANY_NAME} collects, uses, and shares information about you when you use our services.</p>
      <p><strong>Company:</strong> {COMPANY_LINE}</p>
      <h2>1. Information We Collect</h2>
      <p>We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support.</p>
      <h2>2. How We Use Your Information</h2>
      <p>We use the information to provide, maintain, and improve our Service; process transactions; send notices; and personalise content.</p>
      <h2>3. Children&apos;s Privacy</h2>
      <p>Our Services are not intended for users under the age of 16. Contact us via the Contact page if you believe a child has submitted personal information.</p>
    </LegalLayout>
  );
}
