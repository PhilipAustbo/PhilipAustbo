const subMenuButton = document.querySelector('.sub-menu');
const subNav = document.querySelector('.sub-nav');

subMenuButton?.addEventListener('click', () => {
  const open = subMenuButton.getAttribute('aria-expanded') === 'true';
  subMenuButton.setAttribute('aria-expanded', String(!open));
  subMenuButton.textContent = open ? 'Menu' : 'Close';
  subNav?.classList.toggle('open', !open);
});

subNav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  subMenuButton?.setAttribute('aria-expanded', 'false');
  if (subMenuButton) subMenuButton.textContent = 'Menu';
  subNav.classList.remove('open');
}));

document.querySelectorAll('[data-year]').forEach((element) => {
  element.textContent = new Date().getFullYear();
});

document.querySelectorAll('.chart-toggle').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.chart-toggle').forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
  });
});
