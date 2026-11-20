/* news-list: tag-filter slider arrows + tag toggle (initial state is authored; results stay the captured first page). */
document.querySelectorAll('.news-list').forEach((block) => {
  const tags = block.querySelector('.news-list__tags');
  const prev = block.querySelector('.news-list__control--prev');
  const next = block.querySelector('.news-list__control--next');
  if (tags && prev && next) {
    const sync = () => {
      prev.hidden = tags.scrollLeft <= 0;
      next.hidden = tags.scrollLeft + tags.clientWidth >= tags.scrollWidth - 1;
    };
    const step = (dir) => tags.scrollBy({ left: dir * tags.clientWidth * 0.8, behavior: 'smooth' });
    prev.addEventListener('click', () => step(-1));
    next.addEventListener('click', () => step(1));
    tags.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);
    sync();
  }
  block.querySelectorAll('.news-list__tag').forEach((tag) => {
    tag.addEventListener('click', () => {
      tag.setAttribute('aria-pressed', tag.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
    });
  });
  const input = block.querySelector('.news-list__input');
  const reset = block.querySelector('.news-list__search-btn--reset');
  if (input && reset) input.addEventListener('input', () => { reset.hidden = !input.value; });
});
