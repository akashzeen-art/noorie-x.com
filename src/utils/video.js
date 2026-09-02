import { CHALCHITRA, thumbUrl } from '../data/content.js';
import { CHALCHITRA_DURATIONS } from '../data/durations.js';
import { videoTitle, videoCategory } from '../i18n/videoTitles.js';

const _durationCache = {};

export function hashSeed(str) {
  let h = 0;
  String(str || '').split('').forEach((ch) => {
    h = ((h << 5) - h) + ch.charCodeAt(0);
    h |= 0;
  });
  return Math.abs(h);
}

export function loadCachedDuration(id) {
  if (!id) return 0;
  if (_durationCache[id]) return _durationCache[id];
  const baked = CHALCHITRA_DURATIONS[id];
  if (baked && isFinite(baked) && baked > 0) {
    _durationCache[id] = baked;
    return baked;
  }
  try {
    const raw = sessionStorage.getItem('cc_dur_' + id);
    if (raw) {
      const n = parseFloat(raw);
      if (isFinite(n) && n > 0) {
        _durationCache[id] = n;
        return n;
      }
    }
  } catch { /* ignore */ }
  return 0;
}

export function saveCachedDuration(id, sec) {
  if (!id || !isFinite(sec) || sec <= 0) return;
  _durationCache[id] = sec;
  try { sessionStorage.setItem('cc_dur_' + id, String(sec)); } catch { /* ignore */ }
}

export function formatDurationMins(sec, lang = 'en') {
  if (!sec || !isFinite(sec) || sec <= 0) return '—';
  const m = Math.max(1, Math.round(sec / 60));
  if (lang === 'hi') {
    if (m < 60) return `${m} मिनट`;
    const h = Math.floor(m / 60);
    const rm = m % 60;
    return rm ? `${h} घं ${rm} मि` : `${h} घंटे`;
  }
  if (lang === 'ur') {
    if (m < 60) return `${m} منٹ`;
    const h = Math.floor(m / 60);
    const rm = m % 60;
    return rm ? `${h} گھ ${rm} م` : `${h} گھنٹے`;
  }
  if (m < 60) return m + ' min';
  const h = Math.floor(m / 60);
  const rm = m % 60;
  return h + 'h ' + rm + 'm';
}

export function videoRating(video) {
  const seed = hashSeed(video && video.id);
  return (4.1 + (seed % 9) / 10).toFixed(1);
}

export function getVideoById(id) {
  return (CHALCHITRA.allVideos || []).find((v) => v.id === id);
}

export function titleDetailMeta(video, lang = 'en') {
  const seed = hashSeed(video && video.id);
  const taglines = {
    en: [
      'Her Story Was Different',
      'Every secret has a price',
      'Trust no one after dark',
      'One night. No way back.',
      'The truth never stays buried',
    ],
    hi: [
      'उसकी कहानी अलग थी',
      'हर राज़ की एक कीमत होती है',
      'अँधेरे के बाद किसी पर भरोसा न करें',
      'एक रात। वापसी नहीं।',
      'सच कभी दबा नहीं रहता',
    ],
    ur: [
      'اس کی کہانی مختلف تھی',
      'ہر راز کی ایک قیمت ہوتی ہے',
      'اندھیرے کے بعد کسی پر بھروسہ نہ کریں',
      'ایک رات۔ واپسی نہیں۔',
      'سچ کبھی دبا نہیں رہتا',
    ],
  };
  const moodsByCat = {
    en: {
      Thriller: 'Suspenseful, Intense',
      Crime: 'Gritty, Dark',
      Action: 'Explosive, Fast-paced',
      Mystery: 'Twisty, Atmospheric',
      Drama: 'Romantic, Emotional',
      Adventure: 'Bold, Adventurous',
    },
    hi: {
      Thriller: 'सस्पेंसफुल, इंटेंस',
      Crime: 'कठोर, डार्क',
      Action: 'धमाकेदार, तेज़',
      Mystery: 'पेंचदार, माहौल वाला',
      Drama: 'रोमांटिक, भावनात्मक',
      Adventure: 'साहसी, रोमांचक',
    },
    ur: {
      Thriller: 'سنسپنس فل، شدید',
      Crime: 'سخت، ڈارک',
      Action: 'دھماکہ خیز، تیز',
      Mystery: 'پیچیدہ، ماحولاتی',
      Drama: 'رومانوی، جذباتی',
      Adventure: 'جرأت مند، سنسنی خیز',
    },
  };
  const cat = (video && video.category) || 'Thriller';
  const rawTitle = (video && video.title) || 'Untitled';
  const title = videoTitle(lang, rawTitle);
  const match = 88 + (seed % 11);
  const progress = 35 + (seed % 50);
  const runtime = formatDurationMins(loadCachedDuration(video && video.id), lang);
  const line = taglines[lang] || taglines.en;
  const moods = moodsByCat[lang] || moodsByCat.en;
  const matchLabel =
    lang === 'hi' ? `${match}% मैच` : lang === 'ur' ? `${match}% میچ` : `${match}% Match`;
  const maturity =
    lang === 'hi'
      ? 'यू/ए 13+ · परिपक्व थीम्स'
      : lang === 'ur'
        ? 'یو/اے 13+ · میچور تھیمز'
        : 'U/A 13+ · mature themes';
  const desc =
    lang === 'hi'
      ? `${title} में जब राज़ सामने आते हैं, गठबंधन टूटते हैं और हर फैसला दांव बढ़ा देता है।`
      : lang === 'ur'
        ? `${title} میں جب راز سامنے آتے ہیں، اتحاد ٹوٹتے ہیں اور ہر فیصلہ داؤ بڑھاتا ہے۔`
        : `When secrets surface in ${rawTitle}, alliances fracture and every choice raises the stakes.`;
  return {
    title,
    display: title,
    tagline: line[seed % line.length],
    runtime,
    match: matchLabel,
    year: '2025',
    rating: 'U/A 13+',
    genre: videoCategory(lang, cat),
    moods: moods[cat] || moods.Drama,
    maturity,
    progress,
    desc,
  };
}

export function getThumb(video) {
  return thumbUrl(video);
}

export { thumbUrl };
