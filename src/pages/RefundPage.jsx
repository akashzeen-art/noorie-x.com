import LegalLayout from '../components/LegalLayout.jsx';
import { useApp } from '../context/AppContext.jsx';
import { COMPANY_NAME, COMPANY_LINE } from '../data/company.js';

export default function RefundPage() {
  const { tr } = useApp();
  return (
    <LegalLayout title={tr('refund')}>
      <p className="date">Last Updated: 23-04-2026</p>
      <p>Thank you for subscribing to {COMPANY_NAME}. We hope you are satisfied with our services, but if not, we&apos;re here to help.</p>
      <p><strong>Company:</strong> {COMPANY_LINE}</p>
      <h2>1. Free Trial</h2>
      <p>{COMPANY_NAME} does not offer a free trial. Users can cancel their subscription at any time from their account page.</p>
      <h2>2. Cancellation Policy</h2>
      <p>Subscribers may cancel their recurring subscription at any time. Upon cancellation, access remains active until the end of the current billing cycle.</p>
      <h2>3. Refund Eligibility</h2>
      <p>To be eligible for a refund, you must submit a request within 2 days of your subscription start date.</p>
      <h2>4. Process for Requesting a Refund</h2>
      <p>Contact our customer support team via the Contact page.</p>
    </LegalLayout>
  );
}
