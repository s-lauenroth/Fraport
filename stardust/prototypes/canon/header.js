/* Header scroll morph — same states, same thresholds and the same (inverted-name) logic as the source
   frach-m-sticky-page-header-container (100 ms throttle): scrolling down past the header height hides it
   (sticky + translateY(-100%)); scrolling up shows a collapsed bar; it expands again near the top. */
(() => {
  const h = document.getElementById('site-header');
  if (!h) return;
  let last = window.scrollY;
  let busy = false;
  const add = (c) => h.classList.add(c);
  const rm = (c) => h.classList.remove(c);
  const onScroll = () => {
    const y = window.scrollY;
    if (last < y) { // scrolling down
      rm('is-visible');
      if (y > h.offsetHeight) { add('is-sticky'); setTimeout(() => add('is-animating'), 50); } else rm('is-sticky');
    } else { // scrolling up
      add('is-collapsed'); add('is-visible'); add('is-sticky');
      if (!(y > h.offsetHeight)) rm('is-animating');
      if (last < 10) rm('is-collapsed');
    }
    last = y;
  };
  window.addEventListener('scroll', () => {
    if (busy) return;
    busy = true;
    setTimeout(() => { busy = false; onScroll(); }, 100);
  }, { passive: true });

  // menus: mobile burger, desktop level-1 flyouts, meta dropdowns
  const closeAll = (except) => h.querySelectorAll('[aria-expanded="true"]').forEach((b) => { if (b !== except) b.setAttribute('aria-expanded', 'false'); });
  h.addEventListener('click', (e) => {
    const t = e.target.closest('.header__menu-btn, .header__meta-wrap > button, .header__menu > .header__list > .header__item > .header__nav-link[aria-expanded]');
    if (!t) return;
    e.preventDefault();
    const open = t.getAttribute('aria-expanded') !== 'true';
    if (!t.classList.contains('header__menu-btn')) closeAll(h.querySelector('.header__menu-btn[aria-expanded="true"]'));
    t.setAttribute('aria-expanded', String(open));
  });
  document.addEventListener('click', (e) => { if (!h.contains(e.target)) closeAll(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeAll(); });
})();
