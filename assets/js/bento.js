'use strict';

// Highlight the nav item for the section currently in view.
const links = document.querySelectorAll('[data-nav]');
const sections = document.querySelectorAll('[data-section]');

const setActive = (id) => {
  links.forEach((l) => l.classList.toggle('is-active', l.getAttribute('href') === '#' + id));
};

if ('IntersectionObserver' in window) {
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) setActive(e.target.id === 'contact' ? 'writing' : e.target.id);
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach((s) => spy.observe(s));

  // Fade cards in as they scroll into view.
  const cards = document.querySelectorAll('.card');
  cards.forEach((c) => c.classList.add('reveal'));
  const reveal = new IntersectionObserver((entries, obs) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      obs.unobserve(e.target);
    });
  }, { threshold: 0.08 });
  cards.forEach((c) => reveal.observe(c));
}

document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });
