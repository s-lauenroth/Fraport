// milestones: marker / arrow navigation between slides (initial state = slide 1)
(() => {
  document.querySelectorAll('.milestones').forEach((m) => {
    const slides = [...m.querySelectorAll('.milestones__slide')];
    const items = [...m.querySelectorAll('.milestones__item')];
    const track = m.querySelector('.milestones__slides');
    const prev = m.querySelector('.milestones__prev');
    const next = m.querySelector('.milestones__next');
    let cur = 0;
    const go = (i) => {
      cur = Math.max(0, Math.min(slides.length - 1, i));
      track.style.transform = `translateX(${-100 * cur}%)`;
      slides.forEach((s, n) => { const on = n === cur; s.classList.toggle('is-off', !on); s.toggleAttribute('aria-hidden', !on); s.toggleAttribute('inert', !on); });
      items.forEach((it, n) => { it.classList.toggle('is-active', n === cur); it.toggleAttribute('aria-current', n === cur); });
      const nav = m.querySelector('.milestones__nav'); nav.scrollTo({ left: items[cur].offsetLeft - items[0].offsetLeft, behavior: 'smooth' });
      prev.disabled = cur === 0; next.disabled = cur === slides.length - 1;
    };
    items.forEach((it, n) => it.addEventListener('click', () => go(n)));
    prev.addEventListener('click', () => go(cur - 1));
    next.addEventListener('click', () => go(cur + 1));
  });
})();
