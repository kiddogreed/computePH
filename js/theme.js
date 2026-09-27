// theme.js — dark mode toggle with localStorage persistence + system preference fallback.
window.CPH = window.CPH || {};

(function () {
  const { getPreference, setPreference } = window.CPH.storage;
  const root = document.documentElement;
  const STORAGE_KEY = 'theme';

  function applyTheme(theme) {
    const isDark = theme === 'dark';
    root.classList.toggle('dark', isDark);

    const toggle = document.getElementById('theme-toggle');
    const sun = document.getElementById('icon-sun');
    const moon = document.getElementById('icon-moon');
    if (toggle) toggle.setAttribute('aria-pressed', String(isDark));
    if (sun) sun.classList.toggle('hidden', !isDark);
    if (moon) moon.classList.toggle('hidden', isDark);
  }

  function initTheme() {
    const stored = getPreference(STORAGE_KEY, null);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial = stored || (prefersDark ? 'dark' : 'light');
    applyTheme(initial);

    const toggle = document.getElementById('theme-toggle');
    toggle?.addEventListener('click', () => {
      const next = root.classList.contains('dark') ? 'light' : 'dark';
      setPreference(STORAGE_KEY, next);
      applyTheme(next);
    });
  }

  window.CPH.theme = { initTheme };
})();
