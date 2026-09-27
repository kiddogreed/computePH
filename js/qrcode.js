// qrcode.js — QR code generation UI, backed by the self-hosted js/vendor/qrcode.js library
// (davidshimjs/qrcodejs, MIT licensed — see that file's header). Exposes a global `QRCode` class.
window.CPH = window.CPH || {};

(function () {
  const { showToast } = window.CPH.utils;
  const { addHistoryEntry, getHistory, clearHistory } = window.CPH.storage;

  function renderHistory() {
    const list = document.getElementById('qr-history');
    const entries = getHistory('qr');
    if (entries.length === 0) {
      list.innerHTML = '<li class="empty">No history yet.</li>';
      return;
    }
    list.innerHTML = entries.map((entry) => `<li><span>${entry.summary}</span></li>`).join('');
  }

  function initQrGenerator() {
    const form = document.getElementById('qr-form');
    if (!form) return;

    const container = document.getElementById('qr-canvas-container');
    const resultsPanel = document.getElementById('qr-results');
    const downloadBtn = document.getElementById('qr-download');

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const text = document.getElementById('qr-text').value.trim();
      if (!text) return;

      if (window.QRCode === undefined) {
        showToast('QR library failed to load — please refresh the page.');
        return;
      }

      const size = Number.parseInt(document.getElementById('qr-size').value, 10);
      const eccKey = document.getElementById('qr-ecc').value;
      const dark = document.getElementById('qr-fg').value;
      const light = document.getElementById('qr-bg').value;

      container.innerHTML = '';
      // eslint-disable-next-line no-new -- the library draws into `container` as a side effect
      new window.QRCode(container, {
        text,
        width: size,
        height: size,
        colorDark: dark,
        colorLight: light,
        correctLevel: window.QRCode.CorrectLevel[eccKey],
      });

      resultsPanel.classList.remove('hidden');

      const summary = text.length > 40 ? `${text.slice(0, 40)}…` : text;
      addHistoryEntry('qr', { summary });
      renderHistory();
    });

    form.addEventListener('reset', () => {
      resultsPanel.classList.add('hidden');
      container.innerHTML = '';
    });

    downloadBtn?.addEventListener('click', () => {
      const canvas = container.querySelector('canvas');
      if (!canvas) {
        showToast('Generate a QR code first.');
        return;
      }
      const link = document.createElement('a');
      link.download = 'computeph-qrcode.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    });

    document.getElementById('qr-clear-history')?.addEventListener('click', () => {
      clearHistory('qr');
      renderHistory();
    });

    renderHistory();
  }

  window.CPH.qr = { initQrGenerator };
})();
