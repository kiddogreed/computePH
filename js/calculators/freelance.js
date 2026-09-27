// calculators/freelance.js — recommended hourly/daily rate from a target income + expenses + tax.
window.CPH = window.CPH || {};
window.CPH.calculators = window.CPH.calculators || {};

(function () {
  const { formatCurrency, num } = window.CPH.utils;
  const { getCurrency, onCurrencyChange } = window.CPH.currency;
  const { addHistoryEntry, getHistory, clearHistory } = window.CPH.storage;

  let lastResult = null;

  function compute({ desiredIncome, expenses, taxPct, billableHours, hoursPerDay }) {
  const needed = desiredIncome + expenses;
  const taxFactor = 1 - Math.min(Math.max(taxPct, 0), 90) / 100;
  const requiredGross = taxFactor > 0 ? needed / taxFactor : needed;
  const hourlyRate = billableHours > 0 ? requiredGross / billableHours : 0;
  const dailyRate = hourlyRate * hoursPerDay;
  return { requiredGross, hourlyRate, dailyRate };
}

function render(result) {
  const currency = getCurrency();
  document.getElementById('freelance-out-gross').textContent = formatCurrency(result.requiredGross, currency);
  document.getElementById('freelance-out-hourly').textContent = formatCurrency(result.hourlyRate, currency);
  document.getElementById('freelance-out-daily').textContent = formatCurrency(result.dailyRate, currency);
  document.getElementById('freelance-results').classList.remove('hidden');
}

function renderHistory() {
  const list = document.getElementById('freelance-history');
  const entries = getHistory('freelance');
  if (entries.length === 0) {
    list.innerHTML = '<li class="empty">No history yet.</li>';
    return;
  }
  list.innerHTML = entries.map((entry) => `<li><span>${entry.summary}</span></li>`).join('');
}

function initFreelanceCalculator() {
  const form = document.getElementById('freelance-form');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const inputs = {
      desiredIncome: num(document.getElementById('freelance-income').value),
      expenses: num(document.getElementById('freelance-expenses').value, 0),
      taxPct: num(document.getElementById('freelance-tax').value, 0),
      billableHours: num(document.getElementById('freelance-hours').value, 120),
      hoursPerDay: num(document.getElementById('freelance-hours-per-day').value, 6),
    };
    lastResult = compute(inputs);
    render(lastResult);

    const currency = getCurrency();
    const summary = `${formatCurrency(inputs.desiredIncome, currency)}/month goal → ${formatCurrency(lastResult.hourlyRate, currency)}/hr`;
    addHistoryEntry('freelance', { summary });
    renderHistory();
  });

  form.addEventListener('reset', () => {
    document.getElementById('freelance-results').classList.add('hidden');
    lastResult = null;
  });

  document.getElementById('freelance-clear-history')?.addEventListener('click', () => {
    clearHistory('freelance');
    renderHistory();
  });

  onCurrencyChange(() => {
    if (lastResult) render(lastResult);
  });

  renderHistory();
}

  window.CPH.calculators.freelance = { initFreelanceCalculator };
})();
