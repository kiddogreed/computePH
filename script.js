// script.js — ComputePH entry point. Wires up every module once the DOM is ready.
// Plain script (not type="module") so the app also runs when opened directly via file://.
(function () {
  const { initTheme } = window.CPH.theme;
  const { initCurrency } = window.CPH.currency;
  const { initPwa } = window.CPH.pwa;
  const { initResultActions, applySharedParamsFromUrl } = window.CPH.share;
  const { showToast } = window.CPH.utils;
  const { initSalaryCalculator } = window.CPH.calculators.salary;
  const { initLoanCalculator } = window.CPH.calculators.loan;
  const { initFreelanceCalculator } = window.CPH.calculators.freelance;
  const { initSavingsCalculator } = window.CPH.calculators.savings;
  const { initQrGenerator } = window.CPH.qr;

  function initMobileNav() {
    const toggle = document.getElementById('mobile-nav-toggle');
    const nav = document.getElementById('mobile-nav');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', () => {
      const isOpen = !nav.classList.contains('hidden');
      nav.classList.toggle('hidden');
      toggle.setAttribute('aria-expanded', String(!isOpen));
    });

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        nav.classList.add('hidden');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  function initNewsletter() {
    const form = document.getElementById('newsletter-form');
    const note = document.getElementById('newsletter-note');
    form?.addEventListener('submit', (event) => {
      event.preventDefault();
      // No backend is wired up yet — replace with Mailchimp/ConvertKit/Buttondown endpoint.
      note.textContent = "Thanks for subscribing! We'll be in touch. 📬";
      form.reset();
    });
  }

  function initPremiumCta() {
    document.getElementById('premium-cta-btn')?.addEventListener('click', () => {
      showToast("You're on the list! We'll email you when ComputePH Pro launches.");
    });
  }

  function initSupport() {
    const btn = document.getElementById('support-copy-btn');
    const number = document.getElementById('support-gcash-number');
    btn?.addEventListener('click', async () => {
      const ok = await window.CPH.utils.copyToClipboard(number.textContent.trim());
      showToast(ok ? 'GCash number copied 📋' : 'Could not copy — please copy it manually');
    });
  }

  function initFooterYear() {
    const el = document.getElementById('footer-year');
    if (el) el.textContent = new Date().getFullYear();
  }

  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initCurrency();
    initMobileNav();
    initFooterYear();
    initNewsletter();
    initPremiumCta();
    initSupport();
    initPwa();

    initSalaryCalculator();
    initLoanCalculator();
    initFreelanceCalculator();
    initSavingsCalculator();
    initQrGenerator();

    initResultActions();
    applySharedParamsFromUrl();
  });
})();
