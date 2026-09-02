import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const HOME_SCROLL_KEY = 'noorie_home_scroll_y';

/** Remember home scroll; restore when returning from About / Terms / etc. */
export default function ScrollMemory() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname !== '/') {
      window.scrollTo(0, 0);
      return undefined;
    }

    const raw = sessionStorage.getItem(HOME_SCROLL_KEY);
    const y = raw ? parseInt(raw, 10) : 0;
    if (y > 0) {
      requestAnimationFrame(() => window.scrollTo(0, y));
    }

    const onScroll = () => {
      try {
        sessionStorage.setItem(HOME_SCROLL_KEY, String(window.scrollY || 0));
      } catch { /* ignore */ }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [pathname]);

  return null;
}
