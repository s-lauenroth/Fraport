// anchor-list (numbered, desktop unstuck row): prev/next arrows scroll the overflowing anchor row (source slider controls)
(() => {
  document.querySelectorAll('.anchor-list--numbered').forEach((al) => {
    const row = al.querySelector('.anchor-list__section');
    const prev = al.querySelector('.anchor-list__prev');
    const next = al.querySelector('.anchor-list__next');
    if (!row || !prev || !next) return;
    const sync = () => {
      prev.hidden = row.scrollLeft <= 0;
      next.hidden = row.scrollLeft + row.clientWidth >= row.scrollWidth - 1;
    };
    prev.addEventListener('click', () => row.scrollBy({ left: -row.clientWidth, behavior: 'smooth' }));
    next.addEventListener('click', () => row.scrollBy({ left: row.clientWidth, behavior: 'smooth' }));
    row.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);
    sync();
  });
})();
