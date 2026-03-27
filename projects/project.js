/* ── Carrousel projet ───────────────────────── */
(function () {
  const viewport = document.querySelector('.proj-carousel-viewport');
  const slides   = document.querySelectorAll('.proj-carousel-slide');
  const dots     = document.querySelectorAll('.proj-carousel-dot');
  const counter  = document.querySelector('.proj-carousel-counter');
  const btnPrev  = document.querySelector('.proj-carousel-prev');
  const btnNext  = document.querySelector('.proj-carousel-next');

  if (!viewport || slides.length === 0) return;

  let current  = 0;
  let timer    = null;
  const total  = slides.length;
  const DELAY  = 4500;

  function goTo(index) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (index + total) % total;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
    if (counter) counter.textContent = `${String(current + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
  }

  function startTimer() {
    timer = setInterval(() => goTo(current + 1), DELAY);
  }

  function resetTimer() {
    clearInterval(timer);
    startTimer();
  }

  if (btnPrev) btnPrev.addEventListener('click', () => { goTo(current - 1); resetTimer(); });
  if (btnNext) btnNext.addEventListener('click', () => { goTo(current + 1); resetTimer(); });

  const tapL = viewport.querySelector('.proj-carousel-tap-l');
  const tapR = viewport.querySelector('.proj-carousel-tap-r');
  if (tapL) tapL.addEventListener('click', () => { goTo(current - 1); resetTimer(); });
  if (tapR) tapR.addEventListener('click', () => { goTo(current + 1); resetTimer(); });
  dots.forEach((dot, i) => dot.addEventListener('click', () => { goTo(i); resetTimer(); }));

  /* Pause au hover */
  const carousel = document.querySelector('.proj-carousel');
  if (carousel) {
    carousel.addEventListener('mouseenter', () => clearInterval(timer));
    carousel.addEventListener('mouseleave', startTimer);
  }

  /* Swipe tactile */
  let startX = 0;
  viewport.addEventListener('pointerdown', e => { startX = e.clientX; });
  viewport.addEventListener('pointerup',   e => {
    const delta = e.clientX - startX;
    if (Math.abs(delta) > 40) { goTo(current + (delta < 0 ? 1 : -1)); resetTimer(); }
  });

  /* Touches clavier */
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft')  { goTo(current - 1); resetTimer(); }
    if (e.key === 'ArrowRight') { goTo(current + 1); resetTimer(); }
  });

  goTo(0);
  startTimer();
})();
