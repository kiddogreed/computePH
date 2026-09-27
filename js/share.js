// share.js — generic "copy result" + "share link" behavior wired up for every calculator.
window.CPH = window.CPH || {};

(function () {
  const { copyToClipboard, showToast } = window.CPH.utils;

  const SECTION_IDS = {
    salary: 'salary-calculator',
    loan: 'loan-calculator',
    freelance: 'freelance-calculator',
    savings: 'savings-calculator',
    qr: 'qr-generator',
  };

  function collectResultText(target) {
    const panel = document.getElementById(`${target}-results`);
    if (!panel) return '';
    if (target === 'qr') {
      const text = document.getElementById('qr-text')?.value || '';
      return `QR Code content: ${text}`;
    }
    const items = [...panel.querySelectorAll('.result-item')].map((item) => {
      const label = item.querySelector('span')?.textContent?.trim();
      const value = item.querySelector('strong')?.textContent?.trim();
      return `${label}: ${value}`;
    });
    return ['ComputePH results:', ...items].join('\n');
  }

  function buildShareUrl(target) {
    const sectionId = SECTION_IDS[target];
    const section = document.getElementById(sectionId);
    const form = section?.querySelector('form');
    const url = new URL(window.location.href.split('?')[0]);
    url.searchParams.set('tool', target);
    if (form) {
      form.querySelectorAll('[id]').forEach((field) => {
        if (!field.id || field.tagName === 'BUTTON') return;
        url.searchParams.set(field.id, field.value);
      });
    }
    url.hash = sectionId;
    return url.toString();
  }

  /** Populate a tool's form from the current page URL and trigger its calculation (used for shared links). */
  function applySharedParamsFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const target = params.get('tool');
    if (!target || !SECTION_IDS[target]) return;

    const section = document.getElementById(SECTION_IDS[target]);
    const form = section?.querySelector('form');
    if (!form) return;

    params.forEach((value, key) => {
      const field = form.querySelector(`#${CSS.escape(key)}`);
      if (field) field.value = value;
    });

    requestAnimationFrame(() => {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      form.dispatchEvent(new Event('submit', { cancelable: true }));
    });
  }

  function initResultActions() {
    document.querySelectorAll('.copy-btn').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const target = btn.dataset.target;
        const text = collectResultText(target);
        if (!text) return;
        const ok = await copyToClipboard(text);
        showToast(ok ? 'Copied to clipboard ✅' : 'Could not copy — please copy manually');
      });
    });

    document.querySelectorAll('.share-btn').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const target = btn.dataset.target;
        const url = buildShareUrl(target);
        if (navigator.share) {
          try {
            await navigator.share({ title: 'ComputePH result', url });
            return;
          } catch {
            /* user cancelled share sheet — fall back to clipboard copy below */
          }
        }
        const ok = await copyToClipboard(url);
        showToast(ok ? 'Share link copied 🔗' : 'Could not copy link');
      });
    });
  }

  window.CPH.share = { initResultActions, applySharedParamsFromUrl };
})();
