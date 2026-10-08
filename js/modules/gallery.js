/**
 * Carrossel leve baseado em CSS scroll-snap.
 * Sem JS ele continua funcionando com swipe; o JS só adiciona os botões anterior/próximo.
 */
export function initCarousel(root) {
  if (!root) return;
  const track = root.querySelector('[data-carousel-track]');
  const prev = root.querySelector('[data-carousel-prev]');
  const next = root.querySelector('[data-carousel-next]');
  if (!track) return;

  const step = () => track.querySelector('li')?.offsetWidth ?? track.clientWidth;

  prev?.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
  next?.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));

  const update = () => {
    const max = track.scrollWidth - track.clientWidth - 2;
    if (prev) prev.disabled = track.scrollLeft <= 2;
    if (next) next.disabled = track.scrollLeft >= max;
  };
  track.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update, { passive: true });
  update();
}
