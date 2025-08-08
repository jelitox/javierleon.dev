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

function detectInitialLang() {
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

// Init i18n
(async () => {
  const lang = detectInitialLang();
  await setLanguage(lang);
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


