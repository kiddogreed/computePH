// calculators/loan.js — amortized loan payment, totals, and yearly repayment breakdown.
window.CPH = window.CPH || {};
window.CPH.calculators = window.CPH.calculators || {};

(function () {
  const { formatCurrency, num } = window.CPH.utils;
  const { getCurrency, onCurrencyChange } = window.CPH.currency;
  const { addHistoryEntry, getHistory, clearHistory } = window.CPH.storage;

  let lastResult = null;

  function compute({ principal, annualRatePct, termMonths }) {
  const monthlyRate = annualRatePct / 100 / 12;
  const n = termMonths;

  const monthlyPayment = monthlyRate === 0
    ? principal / n
    : (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -n));

  const totalRepayment = monthlyPayment * n;
  const totalInterest = totalRepayment - principal;

  // Simulate amortization to build a year-by-year breakdown.
  let balance = principal;
  const yearly = [];
  let yearPrincipal = 0;
  let yearInterest = 0;

  for (let month = 1; month <= n; month += 1) {
    const interestPortion = balance * monthlyRate;
    const principalPortion = Math.min(monthlyPayment - interestPortion, balance);
    balance = Math.max(balance - principalPortion, 0);
    yearPrincipal += principalPortion;
    yearInterest += interestPortion;

    if (month % 12 === 0 || month === n) {
      yearly.push({
        year: Math.ceil(month / 12),
        principalPaid: yearPrincipal,
        interestPaid: yearInterest,
        balance,
      });
      yearPrincipal = 0;
      yearInterest = 0;
    }
  }

  return { monthlyPayment, totalRepayment, totalInterest, paymentCount: n, yearly };
}

function render(result) {
  const currency = getCurrency();
  document.getElementById('loan-out-monthly').textContent = formatCurrency(result.monthlyPayment, currency);
  document.getElementById('loan-out-total').textContent = formatCurrency(result.totalRepayment, currency);
  document.getElementById('loan-out-interest').textContent = formatCurrency(result.totalInterest, currency);
  document.getElementById('loan-out-count').textContent = result.paymentCount;

  const tbody = document.querySelector('#loan-breakdown-table tbody');
  tbody.innerHTML = result.yearly.map((row) => `
    <tr>
      <td>Year ${row.year}</td>
      <td>${formatCurrency(row.principalPaid, currency)}</td>
      <td>${formatCurrency(row.interestPaid, currency)}</td>
      <td>${formatCurrency(row.balance, currency)}</td>
    </tr>
  `).join('');

  document.getElementById('loan-results').classList.remove('hidden');
}

function renderHistory() {
  const list = document.getElementById('loan-history');
  const entries = getHistory('loan');
  if (entries.length === 0) {
    list.innerHTML = '<li class="empty">No history yet.</li>';
    return;
  }
  list.innerHTML = entries.map((entry) => `<li><span>${entry.summary}</span></li>`).join('');
}

function initLoanCalculator() {
  const form = document.getElementById('loan-form');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const termValue = num(document.getElementById('loan-term').value, 1);
    const termUnit = document.getElementById('loan-term-unit').value;
    const inputs = {
      principal: num(document.getElementById('loan-amount').value),
      annualRatePct: num(document.getElementById('loan-rate').value),
      termMonths: termUnit === 'years' ? Math.round(termValue * 12) : Math.round(termValue),
    };
    if (inputs.principal <= 0 || inputs.termMonths <= 0) return;

    lastResult = compute(inputs);
    render(lastResult);

    const currency = getCurrency();
    const summary = `${formatCurrency(inputs.principal, currency)} @ ${inputs.annualRatePct}% for ${termValue} ${termUnit} → ${formatCurrency(lastResult.monthlyPayment, currency)}/mo`;
    addHistoryEntry('loan', { summary });
    renderHistory();
  });

  form.addEventListener('reset', () => {
    document.getElementById('loan-results').classList.add('hidden');
    document.querySelector('#loan-breakdown-table tbody').innerHTML = '';
    lastResult = null;
  });

  document.getElementById('loan-clear-history')?.addEventListener('click', () => {
    clearHistory('loan');
    renderHistory();
  });

  onCurrencyChange(() => {
    if (lastResult) render(lastResult);
  });

  renderHistory();
}

  window.CPH.calculators.loan = { initLoanCalculator };
})();
