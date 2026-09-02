export const PHONE_INVALID_MSG = 'Please enter a valid mobile number';
export const ACCESS_PHONE = '9999999991';
export const CONTACT_KEY = 'cc_contact';
export const SELECTED_VIDEO_KEY = 'cc_selected_video';
export const MYLIST_KEY = 'cc_mylist';
export const LIKES_KEY = 'cc_likes';
export const LOCAL_SUB_KEY = 'ott_local_sub';
export const LANG_KEY = 'nx_lang';

export function sanitizeIndianMobile(value) {
  const digits = String(value || '').replace(/\D/g, '').slice(0, 10);
  return digits.replace(/^[0-5]+/, '');
}

export function isValidIndianMobile(phone) {
  return /^[6-9]\d{9}$/.test(phone);
}

export function formatPhone(phone) {
  const digits = String(phone).replace(/\D/g, '').slice(-10);
  return '+91 ' + digits;
}

export function phoneFromCookie() {
  const m = document.cookie.match(/(?:^|; )user_phone=([^;]+)/);
  if (!m) return '';
  return decodeURIComponent(m[1]).replace(/\D/g, '').slice(-10);
}

export function writePhoneCookie(phone) {
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = 'user_phone=' + encodeURIComponent('+91' + phone)
    + '; path=/; max-age=15552000; SameSite=Lax' + secure;
}

export function clearPhoneCookie() {
  document.cookie = 'user_phone=; path=/; max-age=0; SameSite=Lax';
}

export function getContact() {
  try { return JSON.parse(sessionStorage.getItem(CONTACT_KEY) || 'null'); }
  catch { return null; }
}

export function saveContact(data) {
  sessionStorage.setItem(CONTACT_KEY, JSON.stringify(data));
}

export function readIdSet(key) {
  try {
    const raw = JSON.parse(localStorage.getItem(key) || '[]');
    return Array.isArray(raw) ? raw.map(String) : [];
  } catch {
    return [];
  }
}

export function writeIdSet(key, ids) {
  try { localStorage.setItem(key, JSON.stringify(ids)); } catch { /* ignore */ }
}

export function toggleIdInSet(key, id) {
  const sid = String(id);
  const ids = readIdSet(key);
  const idx = ids.indexOf(sid);
  if (idx >= 0) {
    ids.splice(idx, 1);
    writeIdSet(key, ids);
    return false;
  }
  ids.push(sid);
  writeIdSet(key, ids);
  return true;
}
