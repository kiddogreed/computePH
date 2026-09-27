// pwa.js — service worker registration + "Add to Home Screen" install prompt handling.
window.CPH = window.CPH || {};

(function () {
  let deferredPrompt = null;

  /** Web app manifest / service worker fetches are blocked over file:// — only wire up PWA bits on http(s). */
  function isInstallableContext() {
    return window.location.protocol === 'http:' || window.location.protocol === 'https:';
  }

  function injectManifestLink() {
    if (document.querySelector('link[rel="manifest"]')) return;
    const link = document.createElement('link');
    link.rel = 'manifest';
    link.href = 'manifest.json';
    document.head.appendChild(link);
  }

  function initPwa() {
    if (!isInstallableContext()) return;

    injectManifestLink();

    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js').catch(() => {
          /* offline support is a bonus, not critical — ignore registration failures */
        });
      });
    }

    const installBtn = document.getElementById('install-btn');
    const banner = document.getElementById('install-banner');
    const bannerYes = document.getElementById('install-banner-yes');
    const bannerNo = document.getElementById('install-banner-no');

    window.addEventListener('beforeinstallprompt', (event) => {
      event.preventDefault();
      deferredPrompt = event;
      installBtn?.removeAttribute('hidden');
      installBtn?.classList.remove('hidden');
      banner?.classList.remove('hidden');
    });

    async function triggerInstall() {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      deferredPrompt = null;
      installBtn?.setAttribute('hidden', '');
      banner?.classList.add('hidden');
    }

    installBtn?.addEventListener('click', triggerInstall);
    bannerYes?.addEventListener('click', triggerInstall);
    bannerNo?.addEventListener('click', () => banner?.classList.add('hidden'));

    window.addEventListener('appinstalled', () => {
      deferredPrompt = null;
      installBtn?.setAttribute('hidden', '');
      banner?.classList.add('hidden');
    });
  }

  window.CPH.pwa = { initPwa };
})();
