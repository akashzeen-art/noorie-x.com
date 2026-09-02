import LegalLayout from '../components/LegalLayout.jsx';
import { useApp } from '../context/AppContext.jsx';
import { COMPANY_NAME, COMPANY_ADDRESS, COMPANY_LINE } from '../data/company.js';

export default function AboutPage() {
  const { tr } = useApp();
  return (
    <LegalLayout title={tr('aboutUs')}>
      <p className="lead">{COMPANY_NAME}</p>
      <p>{COMPANY_NAME} is a premium OTT streaming platform delivering movies, web series, TV shows, live channels, documentaries, and exclusive entertainment across multiple devices with a secure subscription experience.</p>
      <p>Our library features blockbuster movies, binge-worthy web series, TV shows, live channels, documentaries, and exclusive originals with fresh content added regularly.</p>
      <h2>What We Offer</h2>
      <ul>
        <li>Premium movies, web series, TV shows, live channels, HD &amp; 4K streaming, multi-device access, personalized recommendations, regular content updates.</li>
        <li>Flexible subscription plans</li>
        <li>New content added regularly</li>
      </ul>
      <p><strong>Disclaimer:</strong> Content is provided for entertainment purposes only. Availability may vary by region, licensing, and subscription plan. Unauthorized reproduction or redistribution is prohibited.</p>
      <h2>Company Details</h2>
      <p><strong>Registered Name:</strong> {COMPANY_NAME}</p>
      <p><strong>Address:</strong> {COMPANY_ADDRESS}</p>
      <p><strong>Company:</strong> {COMPANY_LINE}</p>
    </LegalLayout>
  );
}
