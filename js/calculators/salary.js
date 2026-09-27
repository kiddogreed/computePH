// calculators/salary.js — monthly/annual/hourly/daily salary conversion + overtime pay.
window.CPH = window.CPH || {};
window.CPH.calculators = window.CPH.calculators || {};

(function () {
  const { formatCurrency, num } = window.CPH.utils;
  const { getCurrency, onCurrencyChange } = window.CPH.currency;
  const { addHistoryEntry, getHistory, clearHistory } = window.CPH.storage;

  const WEEKS_PER_MONTH = 52 / 12;
  let lastResult = null;

  function compute(inputs) {
  const { amount, period, hoursPerDay, daysPerWeek, otHours, otMultiplier } = inputs;
  const hoursPerMonth = hoursPerDay * daysPerWeek * WEEKS_PER_MONTH;
  const daysPerMonth = daysPerWeek * WEEKS_PER_MONTH;

  let monthly;
  switch (period) {
    case 'annual': monthly = amount / 12; break;
    case 'hourly': monthly = amount * hoursPerMonth; break;
    case 'daily': monthly = amount * daysPerMonth; break;
    default: monthly = amount;
  }

  const annual = monthly * 12;
  const hourly = hoursPerMonth > 0 ? monthly / hoursPerMonth : 0;
  const daily = daysPerMonth > 0 ? monthly / daysPerMonth : 0;
  const overtimePay = hourly * otMultiplier * otHours;
  const total = monthly + overtimePay;

  return { monthly, annual, hourly, daily, overtimePay, total };
}

function render(result) {
  const currency = getCurrency();
  document.getElementById('salary-out-monthly').textContent = formatCurrency(result.monthly, currency);
  document.getElementById('salary-out-annual').textContent = formatCurrency(result.annual, currency);
  document.getElementById('salary-out-hourly').textContent = formatCurrency(result.hourly, currency);
  document.getElementById('salary-out-daily').textContent = formatCurrency(result.daily, currency);
  document.getElementById('salary-out-ot').textContent = formatCurrency(result.overtimePay, currency);
  document.getElementById('salary-out-total').textContent = formatCurrency(result.total, currency);
  document.getElementById('salary-results').classList.remove('hidden');
}

function renderHistory() {
  const list = document.getElementById('salary-history');
  const entries = getHistory('salary');
  if (entries.length === 0) {
    list.innerHTML = '<li class="empty">No history yet.</li>';
    return;
  }
  list.innerHTML = entries.map((entry) => `<li><span>${entry.summary}</span></li>`).join('');
}

  function initSalaryCalculator() {
    const form = document.getElementById('salary-form');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const inputs = {
      amount: num(document.getElementById('salary-amount').value),
      period: document.getElementById('salary-period').value,
      hoursPerDay: num(document.getElementById('salary-hours-per-day').value, 8),
      daysPerWeek: num(document.getElementById('salary-days-per-week').value, 5),
      otHours: num(document.getElementById('salary-ot-hours').value, 0),
      otMultiplier: num(document.getElementById('salary-ot-multiplier').value, 1.25),
    };
    lastResult = compute(inputs);
    render(lastResult);

    const currency = getCurrency();
    const summary = `${formatCurrency(inputs.amount, currency)}/${inputs.period} → ${formatCurrency(lastResult.monthly, currency)}/month, ${formatCurrency(lastResult.annual, currency)}/year`;
    addHistoryEntry('salary', { summary });
    renderHistory();
  });

  form.addEventListener('reset', () => {
    document.getElementById('salary-results').classList.add('hidden');
    lastResult = null;
  });

  document.getElementById('salary-clear-history')?.addEventListener('click', () => {
    clearHistory('salary');
    renderHistory();
  });

  onCurrencyChange(() => {
    if (lastResult) render(lastResult);
  });

  renderHistory();
}

  window.CPH.calculators.salary = { initSalaryCalculator };
})();
