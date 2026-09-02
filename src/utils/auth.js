import {
  ACCESS_PHONE,
  LOCAL_SUB_KEY,
  sanitizeIndianMobile,
  writePhoneCookie,
  clearPhoneCookie,
} from './phone.js';

let _state = false;
let _sub = null;

function isAuthorized(phone) {
  return sanitizeIndianMobile(phone) === ACCESS_PHONE;
}

function readLocalSub() {
  try {
    const raw = localStorage.getItem(LOCAL_SUB_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!data || !data.phone || !data.plan) return null;
    if (!isAuthorized(data.phone)) return null;
    return data;
  } catch {
    return null;
  }
}

function writeLocalSub(data) {
  try { localStorage.setItem(LOCAL_SUB_KEY, JSON.stringify(data)); } catch { /* ignore */ }
}

function clearLocalSub() {
  try { localStorage.removeItem(LOCAL_SUB_KEY); } catch { /* ignore */ }
}

export function grantLocalAccess(phone, plan) {
  const digits = sanitizeIndianMobile(phone);
  if (!isAuthorized(digits)) return false;
  const data = { phone: digits, plan: plan || 'monthly', at: Date.now() };
  writeLocalSub(data);
  writePhoneCookie(digits);
  _sub = data;
  _state = true;
  return true;
}

export async function initAuth() {
  const sub = readLocalSub();
  if (sub) {
    _sub = sub;
    _state = true;
    writePhoneCookie(sub.phone);
    return;
  }
  _state = false;
  _sub = null;
}

export function isSubscriber() {
  return _state === true;
}

export function getSubscription() {
  return _sub || readLocalSub();
}

export function logoutAuth() {
  clearLocalSub();
  clearPhoneCookie();
  _state = false;
  _sub = null;
}

export function syncSubscriberState() {
  const sub = readLocalSub();
  _sub = sub;
  _state = !!sub;
}
