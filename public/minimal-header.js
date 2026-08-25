const minimalMenuButton = document.querySelector('.sub-menu');
const minimalNavigation = document.querySelector('.sub-nav');

minimalMenuButton?.addEventListener('click', () => {
  const open = minimalMenuButton.getAttribute('aria-expanded') === 'true';
  minimalMenuButton.setAttribute('aria-expanded', String(!open));
  minimalMenuButton.textContent = open ? 'Menu' : 'Close';
  minimalNavigation?.classList.toggle('open', !open);
});

minimalNavigation?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    minimalMenuButton?.setAttribute('aria-expanded', 'false');
    if (minimalMenuButton) minimalMenuButton.textContent = 'Menu';
    minimalNavigation.classList.remove('open');
  });
});
