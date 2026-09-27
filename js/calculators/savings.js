// calculators/savings.js — month-by-month simulation to estimate when a savings goal is reached.
window.CPH = window.CPH || {};
window.CPH.calculators = window.CPH.calculators || {};

(function () {
  const { formatCurrency, formatDate, num } = window.CPH.utils;
  const { getCurrency, onCurrencyChange } = window.CPH.currency;
  const { addHistoryEntry, getHistory, clearHistory } = window.CPH.storage;

  const MAX_MONTHS = 1200; // 100-year safety cap so an unreachable goal can't loop forever

  let lastResult = null;

  function compute({ target, current, monthlyContribution, annualRatePct }) {
  const monthlyRate = annualRatePct / 100 / 12;

  if (current >= target) {
    return { months: 0, totalContributed: 0, interestEarned: 0, reached: true, finalBalance: current };
  }

  let balance = current;
  let totalContributed = 0;
  let months = 0;

  while (balance < target && months < MAX_MONTHS) {
    const interest = balance * monthlyRate;
    balance += interest + monthlyContribution;
    totalContributed += monthlyContribution;
    months += 1;
    if (monthlyContribution <= 0 && interest <= 0) break; // no growth possible — stop early
  }

  const reached = balance >= target;
  const interestEarned = balance - current - totalContributed;
  return { months, totalContributed, interestEarned, reached, finalBalance: balance };
}

function render(result) {
  const currency = getCurrency();

  if (!result.reached) {
    document.getElementById('savings-out-time').textContent = 'Not reachable';
    document.getElementById('savings-out-date').textContent = 'Increase contribution or rate';
  } else {
    const years = Math.floor(result.months / 12);
    const months = result.months % 12;
    const parts = [];
    if (years) parts.push(`${years} yr${years !== 1 ? 's' : ''}`);
    if (months || !years) parts.push(`${months} mo${months !== 1 ? 's' : ''}`);
    document.getElementById('savings-out-time').textContent = parts.join(' ');

    const target = new Date();
    target.setMonth(target.getMonth() + result.months);
    document.getElementById('savings-out-date').textContent = formatDate(target);
  }

  document.getElementById('savings-out-contributed').textContent = formatCurrency(result.totalContributed, currency);
  document.getElementById('savings-out-interest').textContent = formatCurrency(Math.max(result.interestEarned, 0), currency);
  document.getElementById('savings-results').classList.remove('hidden');
}

function renderHistory() {
  const list = document.getElementById('savings-history');
  const entries = getHistory('savings');
  if (entries.length === 0) {
    list.innerHTML = '<li class="empty">No history yet.</li>';
    return;
  }
  list.innerHTML = entries.map((entry) => `<li><span>${entry.summary}</span></li>`).join('');
}

function initSavingsCalculator() {
  const form = document.getElementById('savings-form');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const inputs = {
      target: num(document.getElementById('savings-target').value),
      current: num(document.getElementById('savings-current').value, 0),
      monthlyContribution: num(document.getElementById('savings-monthly').value),
      annualRatePct: num(document.getElementById('savings-rate').value, 0),
    };
    if (inputs.target <= 0) return;

    lastResult = compute(inputs);
    render(lastResult);

    const currency = getCurrency();
    const label = lastResult.reached ? `${lastResult.months} months` : '100+ years';
    const summary = `${formatCurrency(inputs.target, currency)} goal → ${label}`;
    addHistoryEntry('savings', { summary });
    renderHistory();
  });

  form.addEventListener('reset', () => {
    document.getElementById('savings-results').classList.add('hidden');
    lastResult = null;
  });

  document.getElementById('savings-clear-history')?.addEventListener('click', () => {
    clearHistory('savings');
    renderHistory();
  });

  onCurrencyChange(() => {
    if (lastResult) render(lastResult);
  });

  renderHistory();
}

  window.CPH.calculators.savings = { initSavingsCalculator };
})();
