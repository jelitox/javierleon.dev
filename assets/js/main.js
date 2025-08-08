// Mobile nav toggle
const navToggleButton = document.querySelector('.nav-toggle');
const siteNav = document.getElementById('site-nav');
if (navToggleButton && siteNav) {
  navToggleButton.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('open');
    navToggleButton.setAttribute('aria-expanded', String(isOpen));
  });
}

// Dynamic year
const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = String(new Date().getFullYear());
}

// Simple i18n
const DEFAULT_LANG = 'en';
const SUPPORTED_LANGS = ['en', 'es'];

function getStoredOrNavigatorLang() {
  const stored = localStorage.getItem('lang');
  if (stored && SUPPORTED_LANGS.includes(stored)) return stored;
  const fromHtml = document.documentElement.lang;
  if (SUPPORTED_LANGS.includes(fromHtml)) return fromHtml;
  const fromNavigator = (navigator.language || navigator.userLanguage || 'en').slice(0, 2).toLowerCase();
  return SUPPORTED_LANGS.includes(fromNavigator) ? fromNavigator : DEFAULT_LANG;
}

async function loadTranslations(lang) {
  const res = await fetch(`assets/i18n/${lang}.json`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Failed to load i18n for ${lang}`);
  return res.json();
}

function applyTextTranslations(dict) {
  // Elements with data-i18n (innerText)
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (!key) return;
    const value = key.split('.').reduce((acc, k) => (acc && acc[k] !== undefined ? acc[k] : undefined), dict);
    if (typeof value === 'string') el.textContent = value;
  });

  // Elements with data-i18n-attr (single attribute)
  document.querySelectorAll('[data-i18n-attr]').forEach((el) => {
    const attr = el.getAttribute('data-i18n-attr');
    const key = el.getAttribute('data-i18n-key');
    if (!attr || !key) return;
    const value = key.split('.').reduce((acc, k) => (acc && acc[k] !== undefined ? acc[k] : undefined), dict);
    if (typeof value === 'string') el.setAttribute(attr, value);
  });

  // Meta/title with data-i18n-meta
  document.querySelectorAll('[data-i18n-meta]').forEach((el) => {
    const metaKey = el.getAttribute('data-i18n-meta');
    const map = {
      title: 'meta.title',
      description: 'meta.description',
      ogTitle: 'meta.ogTitle',
      ogDescription: 'meta.ogDescription',
      twitterTitle: 'meta.twitterTitle',
      twitterDescription: 'meta.twitterDescription',
    };
    const key = map[metaKey];
    if (!key) return;
    const value = key.split('.').reduce((acc, k) => (acc && acc[k] !== undefined ? acc[k] : undefined), dict);
    if (!value) return;
    if (el.tagName.toLowerCase() === 'title') {
      document.title = value;
    } else if (el.tagName.toLowerCase() === 'meta') {
      el.setAttribute('content', value);
    }
  });
}

async function setLanguage(lang) {
  try {
    const dict = await loadTranslations(lang);
    applyTextTranslations(dict);
    document.documentElement.lang = lang;
    localStorage.setItem('lang', lang);
    const select = document.getElementById('lang-select');
    if (select) select.value = lang;
  } catch (e) {
    console.error(e);
  }
}

// Geo-based detection
const SPANISH_COUNTRIES = new Set([
  'AR','BO','CL','CO','CR','CU','DO','EC','SV','GQ','GT','HN','MX','NI','PA','PY','PE','PR','ES','UY','VE'
]);

function fetchWithTimeout(resource, options = {}) {
  const { timeout = 1500, ...rest } = options;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  return fetch(resource, { ...rest, signal: controller.signal, referrerPolicy: 'no-referrer' })
    .finally(() => clearTimeout(id));
}

async function guessLangByGeo() {
  try {
    // Try ipapi.co
    const r1 = await fetchWithTimeout('https://ipapi.co/json/', { timeout: 1200 });
    if (r1.ok) {
      const j = await r1.json();
      const cc = (j && j.country_code) ? String(j.country_code).toUpperCase() : '';
      if (SPANISH_COUNTRIES.has(cc)) return 'es';
      return 'en';
    }
  } catch (_) { /* noop */ }
  try {
    // Fallback ipwho.is
    const r2 = await fetchWithTimeout('https://ipwho.is/', { timeout: 1200 });
    if (r2.ok) {
      const j = await r2.json();
      const cc = (j && j.country_code) ? String(j.country_code).toUpperCase() : '';
      if (SPANISH_COUNTRIES.has(cc)) return 'es';
      return 'en';
    }
  } catch (_) { /* noop */ }
  // Final fallback to navigator
  return getStoredOrNavigatorLang();
}

// Init i18n
(async () => {
  const stored = localStorage.getItem('lang');
  if (stored && SUPPORTED_LANGS.includes(stored)) {
    await setLanguage(stored);
    return;
  }
  // Default to EN immediately to avoid blank content
  await setLanguage('en');
  try {
    const geoLang = await guessLangByGeo();
    if (geoLang !== 'en') await setLanguage(geoLang);
  } catch (e) {
    // ignore, EN already set
  }
})();

// Language switcher
const langSelect = document.getElementById('lang-select');
if (langSelect) {
  langSelect.addEventListener('change', (e) => {
    const target = e.target;
    const nextLang = (target && target.value) || DEFAULT_LANG;
    setLanguage(nextLang);
  });
}


