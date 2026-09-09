import { useState, useCallback, useEffect, useRef } from 'react';
import { CHALCHITRA } from '../data/content.js';
import { PLANS } from '../data/heroData.js';
import {
  initAuth,
  isSubscriber,
  getSubscription,
  grantLocalAccess,
  logoutAuth,
  syncSubscriberState,
} from '../utils/auth.js';
import {
  ACCESS_PHONE,
  CONTACT_KEY,
  MYLIST_KEY,
  LIKES_KEY,
  LANG_KEY,
  SELECTED_VIDEO_KEY,
  sanitizeIndianMobile,
  isValidIndianMobile,
  getContact,
  saveContact,
  phoneFromCookie,
  writePhoneCookie,
  clearPhoneCookie,
  toggleIdInSet,
  readIdSet,
} from '../utils/phone.js';
import { titleDetailMeta, getVideoById, loadCachedDuration, saveCachedDuration, formatDurationMins } from '../utils/video.js';
import { t, isRtl } from '../i18n/translations.js';
import { AppContext } from './app-context.js';

export { useApp } from './app-context.js';

export function AppProvider({ children }) {
  const [ready, setReady] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [subscriber, setSubscriber] = useState(false);

  const [menuOpen, setMenuOpen] = useState(false);
  const [exploreSection, setExploreSection] = useState(null);
  const [comingDetailIdx, setComingDetailIdx] = useState(null);
  const [titleDetailVideo, setTitleDetailVideo] = useState(null);
  const [unlockOpen, setUnlockOpen] = useState(false);
  const [unlockStep, setUnlockStep] = useState(1);
  const [unlockPhone, setUnlockPhone] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [accountOpen, setAccountOpen] = useState(false);
  const [playerVideo, setPlayerVideo] = useState(null);
  const [toast, setToast] = useState('');
  const scrollLockY = useRef(0);
  const [lang, setLangState] = useState(() => {
    try {
      const saved = localStorage.getItem(LANG_KEY);
      if (saved === 'ur') return 'ur';
    } catch { /* ignore */ }
    return 'en';
  });

  const setLang = useCallback((next) => {
    const value = next === 'ur' ? 'ur' : 'en';
    setLangState(value);
    try { localStorage.setItem(LANG_KEY, value); } catch { /* ignore */ }
    document.documentElement.lang = value === 'ur' ? 'ur' : 'en';
    document.documentElement.dir = isRtl(value) ? 'rtl' : 'ltr';
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang === 'ur' ? 'ur' : 'en';
    document.documentElement.dir = isRtl(lang) ? 'rtl' : 'ltr';
  }, [lang]);

  const tr = useCallback((key) => t(lang, key), [lang]);

  const refreshSubscriber = useCallback(() => {
    syncSubscriberState();
    setSubscriber(isSubscriber());
  }, []);

  useEffect(() => {
    initAuth().then(() => {
      setSubscriber(isSubscriber());
      setReady(true);
    });
  }, []);

  useEffect(() => {
    const anyModal = exploreSection || comingDetailIdx !== null || titleDetailVideo || unlockOpen || accountOpen || playerVideo;
    const body = document.body;
    const locked = body.style.position === 'fixed';

    if (anyModal && !locked) {
      const y = window.scrollY || window.pageYOffset || 0;
      scrollLockY.current = y;
      body.style.overflow = 'hidden';
      body.style.position = 'fixed';
      body.style.top = `-${y}px`;
      body.style.left = '0';
      body.style.right = '0';
      body.style.width = '100%';
    } else if (!anyModal && locked) {
      const y = scrollLockY.current || 0;
      body.style.overflow = '';
      body.style.position = '';
      body.style.top = '';
      body.style.left = '';
      body.style.right = '';
      body.style.width = '';
      window.scrollTo(0, y);
    }

    body.classList.toggle('title-detail-open', !!titleDetailVideo);
  }, [exploreSection, comingDetailIdx, titleDetailVideo, unlockOpen, accountOpen, playerVideo]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        if (titleDetailVideo) setTitleDetailVideo(null);
        else if (comingDetailIdx !== null) setComingDetailIdx(null);
        else if (exploreSection) setExploreSection(null);
        else if (unlockOpen) setUnlockOpen(false);
        else if (accountOpen) setAccountOpen(false);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [titleDetailVideo, comingDetailIdx, exploreSection, unlockOpen, accountOpen]);

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 1800);
  }, []);

  const rememberSelectedVideo = useCallback((video) => {
    if (!video?.id) return;
    try {
      sessionStorage.setItem(SELECTED_VIDEO_KEY, JSON.stringify({
        id: video.id,
        displayThumb: video.displayThumb || '',
        aspect: video.aspect || 'landscape',
      }));
    } catch { /* ignore */ }
  }, []);

  const openTitleDetail = useCallback((video) => {
    if (!video) return;
    setSelectedVideo(video);
    setTitleDetailVideo(video);
    setComingDetailIdx(null);
    setUnlockOpen(false);
    setAccountOpen(false);
  }, []);

  const hasSavedPhone = useCallback(() => {
    const c = getContact();
    const phone = (c && c.phone) || phoneFromCookie();
    return isValidIndianMobile(sanitizeIndianMobile(phone));
  }, []);

  const grantAccessForAuthorizedPhone = useCallback((phone) => {
    const p = sanitizeIndianMobile(phone);
    if (p !== ACCESS_PHONE) return false;
    saveContact({ phone: p, plan: 'monthly' });
    writePhoneCookie(p);
    grantLocalAccess(p, 'monthly');
    refreshSubscriber();
    setUnlockOpen(false);
    setUnlockStep(1);
    if (selectedVideo) openTitleDetail(selectedVideo);
    return true;
  }, [selectedVideo, openTitleDetail, refreshSubscriber]);

  const openUnlockPlans = useCallback((phone) => {
    const p = sanitizeIndianMobile(phone || unlockPhone || phoneFromCookie());
    if (!isValidIndianMobile(p)) {
      setUnlockStep(1);
      setUnlockOpen(true);
      return;
    }
    if (p === ACCESS_PHONE) {
      grantAccessForAuthorizedPhone(p);
      return;
    }
    setUnlockPhone(p);
    setUnlockStep(2);
    setUnlockOpen(true);
  }, [unlockPhone, grantAccessForAuthorizedPhone]);

  const playVideo = useCallback((video) => {
    setSelectedVideo(video);
    rememberSelectedVideo(video);
    if (isSubscriber()) {
      openTitleDetail(video);
      return;
    }
    const saved = sanitizeIndianMobile((getContact()?.phone) || phoneFromCookie());
    if (isValidIndianMobile(saved) && saved === ACCESS_PHONE) {
      saveContact({ phone: saved, plan: 'monthly' });
      writePhoneCookie(saved);
      grantLocalAccess(saved, 'monthly');
      refreshSubscriber();
      openTitleDetail(video);
      return;
    }
    if (hasSavedPhone()) {
      openUnlockPlans();
      return;
    }
    setUnlockStep(1);
    setPhoneInput('');
    setPhoneError('');
    setUnlockOpen(true);
  }, [rememberSelectedVideo, openTitleDetail, hasSavedPhone, openUnlockPlans, refreshSubscriber]);

  const unlockWithPlan = useCallback((planCode, phone) => {
    const p = sanitizeIndianMobile(phone);
    if (!isValidIndianMobile(p) || !planCode) return;
    saveContact({ phone: p, plan: planCode });
    writePhoneCookie(p);
    grantLocalAccess(p, planCode);
    refreshSubscriber();
    setUnlockOpen(false);
    const video = selectedVideo;
    if (video) openTitleDetail(video);
  }, [selectedVideo, openTitleDetail, refreshSubscriber]);

  const handlePhoneChange = useCallback((value) => {
    let raw = String(value || '').replace(/\D/g, '').slice(0, 10);
    if (raw.length > 0 && /^[0-5]/.test(raw)) {
      setPhoneError(t(lang, 'phoneInvalid'));
      raw = raw.replace(/^[0-5]+/, '');
    } else if (raw.length === 10 && !isValidIndianMobile(raw)) {
      setPhoneError(t(lang, 'phoneInvalid'));
    } else if (isValidIndianMobile(raw)) {
      setPhoneError('');
    } else if (raw.length === 0) {
      setPhoneError('');
    }
    setPhoneInput(raw);
  }, [lang]);

  const unlockStepNext = useCallback(() => {
    const phone = sanitizeIndianMobile(phoneInput);
    if (!isValidIndianMobile(phone)) {
      setPhoneError(t(lang, 'phoneInvalid'));
      return;
    }
    if (phone !== ACCESS_PHONE) {
      setPhoneError(t(lang, 'phoneUnauthorized'));
      return;
    }
    setPhoneError('');
    setUnlockPhone(phone);
    grantAccessForAuthorizedPhone(phone);
  }, [phoneInput, grantAccessForAuthorizedPhone, lang]);

  const logoutAccount = useCallback(() => {
    logoutAuth();
    try {
      sessionStorage.removeItem(CONTACT_KEY);
      sessionStorage.removeItem(SELECTED_VIDEO_KEY);
    } catch { /* ignore */ }
    clearPhoneCookie();
    setAccountOpen(false);
    setPlayerVideo(null);
    setSelectedVideo(null);
    refreshSubscriber();
  }, [refreshSubscriber]);

  const value = {
    ready,
    subscriber,
    selectedVideo,
    setSelectedVideo,
    menuOpen,
    setMenuOpen,
    exploreSection,
    setExploreSection,
    comingDetailIdx,
    setComingDetailIdx,
    titleDetailVideo,
    setTitleDetailVideo,
    unlockOpen,
    setUnlockOpen,
    unlockStep,
    setUnlockStep,
    unlockPhone,
    phoneInput,
    phoneError,
    accountOpen,
    setAccountOpen,
    playerVideo,
    setPlayerVideo,
    toast,
    showToast,
    playVideo,
    openTitleDetail,
    openUnlockPlans,
    unlockWithPlan,
    handlePhoneChange,
    unlockStepNext,
    logoutAccount,
    refreshSubscriber,
    getSubscription,
    titleDetailMeta: (video) => titleDetailMeta(video, lang),
    getVideoById,
    toggleIdInSet,
    readIdSet,
    MYLIST_KEY,
    LIKES_KEY,
    PLANS,
    loadCachedDuration,
    saveCachedDuration,
    formatDurationMins: (sec) => formatDurationMins(sec, lang),
    CHALCHITRA,
    lang,
    setLang,
    tr,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
