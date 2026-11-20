/* Minimal block behaviour observed on the source: sticky-patch open/close, teaser-slider paging + mobile "load more". */
(() => {
  // scroll-in entrances (appear-right panels, ribbon wipes): one shot per element
  const io = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add('is-animating'); io.unobserve(en.target); }
  }), { threshold: 0.1 });
  document.querySelectorAll('[data-animate]').forEach((el) => io.observe(el));
  document.querySelectorAll('.sticky-patch').forEach((p) => {
    const open = p.querySelector('.sticky-patch__open');
    const close = p.querySelector('.sticky-patch__close');
    open.addEventListener('animationend', () => open.classList.remove('is-ringing'));
    open.addEventListener('click', () => { p.classList.add('is-open'); open.setAttribute('aria-expanded', 'true'); });
    close.addEventListener('click', () => { p.classList.remove('is-open'); open.setAttribute('aria-expanded', 'false'); });
  });
  document.querySelectorAll('.teaser-slider').forEach((ts) => {
    const slides = [...ts.querySelectorAll('.slider__slide')];
    const track = ts.querySelector('.slider__slides');
    const prev = ts.querySelector('.slider__prev');
    const next = ts.querySelector('.slider__next');
    const dots = [...ts.querySelectorAll('.slider__dot')];
    const per = 3;
    let page = 0;
    const pages = Math.ceil(slides.length / per);
    const go = (p) => {
      page = Math.max(0, Math.min(pages - 1, p));
      const first = page * per;
      track.style.transition = 'transform .15s cubic-bezier(.6,.15,.6,.95)';
      track.style.transform = `translateX(${-slides[first].offsetLeft + slides[0].offsetLeft}px)`;
      slides.forEach((s, i) => { const on = i >= first && i < first + per; s.classList.toggle('is-off', !on); s.toggleAttribute('aria-hidden', !on); });
      dots.forEach((d, i) => d.classList.toggle('is-active', i === first));
      prev.disabled = page === 0; next.disabled = page === pages - 1;
    };
    prev && prev.addEventListener('click', () => go(page - 1));
    next && next.addEventListener('click', () => go(page + 1));
    const more = ts.querySelector('.teaser-slider__more button');
    more && more.addEventListener('click', () => ts.classList.add('is-loaded'));
  });
  // anchor-list: collapses to an accordion row while pinned (source: frach-state-collapsed); label = section in view
  document.querySelectorAll('.anchor-list').forEach((al) => {
    const wrap = al.closest('.anchor-list-wrapper') || al;
    const label = al.querySelector('.anchor-list__label .anchor-list__text');
    const links = [...al.querySelectorAll('.anchor-list__items .anchor-list__anchor')];
    const update = () => {
      const stuck = window.scrollY > 0 && wrap.getBoundingClientRect().top <= 0;
      al.classList.toggle('is-collapsed', stuck);
      if (!stuck) al.classList.remove('is-open');
    };
    window.addEventListener('scroll', update, { passive: true });
    al.querySelector('.anchor-list__label a').addEventListener('click', (e) => { if (al.classList.contains('is-collapsed')) { e.preventDefault(); al.classList.toggle('is-open'); } });
    links.forEach((a) => a.addEventListener('click', () => { label.textContent = a.textContent; al.classList.remove('is-open'); }));
    update();
  });
})();
