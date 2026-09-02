import Navbar from '../components/Navbar.jsx';
import MobileMenu from '../components/MobileMenu.jsx';
import Hero from '../components/Hero.jsx';
import ContentSections from '../components/ContentSections.jsx';
import ComingSoon from '../components/ComingSoon.jsx';
import Footer from '../components/Footer.jsx';
import ExploreModal from '../components/ExploreModal.jsx';
import ComingDetailModal from '../components/ComingDetailModal.jsx';
import TitleDetailModal from '../components/TitleDetailModal.jsx';
import UnlockModal from '../components/UnlockModal.jsx';
import AccountModal from '../components/AccountModal.jsx';
import PlayerModal from '../components/PlayerModal.jsx';
import Toast from '../components/Toast.jsx';

function scrollToSection(id) {
  if (!id || id === 'top') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export default function HomePage() {
  return (
    <>
      <div className="page-wrap">
        <Navbar onScrollTo={scrollToSection} />
        <MobileMenu onScrollTo={scrollToSection} />
        <Hero onExplore={() => document.getElementById('premium-collection')?.scrollIntoView({ behavior: 'smooth', block: 'start' })} />
        <div id="premium-collection">
          <ContentSections />
          <ComingSoon />
        </div>
        <Footer />
      </div>
      <ExploreModal />
      <ComingDetailModal />
      <TitleDetailModal />
      <UnlockModal />
      <AccountModal />
      <PlayerModal />
      <Toast />
    </>
  );
}
