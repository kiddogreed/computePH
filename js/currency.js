// currency.js — shared currency selection used to format results across every calculator.
window.CPH = window.CPH || {};

(function () {
  const { getPreference, setPreference } = window.CPH.storage;
  const STORAGE_KEY = 'currency';
  const listeners = new Set();

  let current = getPreference(STORAGE_KEY, 'PHP');

  function getCurrency() {
    return current;
  }

  function onCurrencyChange(callback) {
    listeners.add(callback);
  }

  function initCurrency() {
    const select = document.getElementById('currency-select');
    if (!select) return;
    select.value = current;
    select.addEventListener('change', () => {
      current = select.value;
      setPreference(STORAGE_KEY, current);
      listeners.forEach((cb) => cb(current));
    });
  }

  window.CPH.currency = { getCurrency, onCurrencyChange, initCurrency };
})();
