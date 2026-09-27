// storage.js — localStorage helpers for preferences and per-tool calculation history.
// All data stays on-device; nothing is ever sent to a server.
window.CPH = window.CPH || {};

(function () {
  const PREFIX = 'computeph_';
  const HISTORY_LIMIT = 5;

  function safeGet(key) {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  function safeSet(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch {
      /* storage unavailable (private browsing / quota) — fail silently */
    }
  }

  function getPreference(name, fallback) {
    const raw = safeGet(PREFIX + name);
    return raw === null ? fallback : raw;
  }

  function setPreference(name, value) {
    safeSet(PREFIX + name, value);
  }

  function getHistory(tool) {
    const raw = safeGet(`${PREFIX}history_${tool}`);
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function addHistoryEntry(tool, entry) {
    const list = getHistory(tool);
    list.unshift({ id: Date.now(), timestamp: new Date().toISOString(), ...entry });
    const trimmed = list.slice(0, HISTORY_LIMIT);
    safeSet(`${PREFIX}history_${tool}`, JSON.stringify(trimmed));
    return trimmed;
  }

  function clearHistory(tool) {
    safeSet(`${PREFIX}history_${tool}`, JSON.stringify([]));
  }

  window.CPH.storage = {
    getPreference,
    setPreference,
    getHistory,
    addHistoryEntry,
    clearHistory,
  };
})();
