/* image-gallery-tiles: "Mehr anzeigen" reveals the remaining tiles; a tile opens the lightbox on its slide
   (prev / next, close button, backdrop click, Escape) — behaviours observed on the source. */
document.querySelectorAll('.image-gallery-tiles').forEach((g) => {
  const more = g.querySelector('.image-gallery-tiles__more');
  if (more) {
    more.addEventListener('click', () => {
      g.querySelectorAll('.image-gallery-tiles__item').forEach((t) => t.classList.add('is-loaded'));
      g.classList.add('is-all');
    });
  }
  const box = g.querySelector('.image-gallery-tiles__lightbox');
  if (!box) return;
  const slides = [...box.querySelectorAll('.image-gallery-tiles__slide')];
  const prev = box.querySelector('.image-gallery-tiles__prev');
  const next = box.querySelector('.image-gallery-tiles__next');
  let cur = 0;
  const show = (i) => {
    cur = Math.max(0, Math.min(slides.length - 1, i));
    slides.forEach((s, n) => s.classList.toggle('is-current', n === cur));
    if (prev) prev.disabled = cur === 0;
    if (next) next.disabled = cur === slides.length - 1;
  };
  const close = () => { box.hidden = true; document.body.classList.remove('is-scroll-locked'); };
  g.querySelectorAll('.image-gallery-tiles__link').forEach((a, i) => a.addEventListener('click', (e) => {
    e.preventDefault(); show(i); box.hidden = false; document.body.classList.add('is-scroll-locked');
  }));
  if (prev) prev.addEventListener('click', () => show(cur - 1));
  if (next) next.addEventListener('click', () => show(cur + 1));
  box.querySelector('.image-gallery-tiles__close').addEventListener('click', close);
  box.addEventListener('click', (e) => { if (e.target === box) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !box.hidden) close(); });
});
