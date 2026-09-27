// utils.js — small shared helpers used across ComputePH modules.
// Plain global-namespace script (not an ES module) so the app also works when
// index.html is opened directly via file:// — browsers block module imports over file://.
window.CPH = window.CPH || {};

(function () {
  /** Locale used for Intl.NumberFormat per supported currency, chosen so the correct symbol renders. */
  const CURRENCY_LOCALES = {
    PHP: 'en-PH',
    USD: 'en-US',
    EUR: 'en-IE',
  };

  /** Format a number as currency using the app's currently selected currency (from storage). */
  function formatCurrency(value, currencyCode = 'PHP') {
    const locale = CURRENCY_LOCALES[currencyCode] || 'en-US';
    const safeValue = Number.isFinite(value) ? value : 0;
    try {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currencyCode,
        maximumFractionDigits: 2,
      }).format(safeValue);
    } catch {
      return `${currencyCode} ${safeValue.toFixed(2)}`;
    }
  }

  /** Format a plain number with thousands separators. */
  function formatNumber(value, decimals = 2) {
    const safeValue = Number.isFinite(value) ? value : 0;
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(safeValue);
  }

  /** Parse a form input's numeric value, defaulting to 0 for blank/invalid entries. */
  function num(value, fallback = 0) {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  /** Format a Date as a readable "Mon D, YYYY" string. */
  function formatDate(date) {
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  /** Debounce helper for input-driven recalculation. */
  function debounce(fn, delay = 250) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  }

  /** Show a short-lived toast message. */
  function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(() => toast.classList.remove('show'), 2600);
  }

  /** Copy text to the clipboard with a graceful fallback for older browsers. */
  async function copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      let success = false;
      try {
        success = document.execCommand('copy');
      } catch {
        success = false;
      }
      textarea.remove();
      return success;
    }
  }

  window.CPH.utils = {
    formatCurrency,
    formatNumber,
    num,
    formatDate,
    debounce,
    showToast,
    copyToClipboard,
  };
})();
