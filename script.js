/* ── Modal projet ───────────────────────────── */
const modal        = document.getElementById('proj-modal');
const modalOverlay = document.getElementById('proj-modal-overlay');
const modalClose   = document.getElementById('proj-modal-close');

function openModal(card) {
  document.getElementById('modal-category').textContent = card.dataset.category || '';
  document.getElementById('modal-title').textContent    = card.dataset.title    || '';
  document.getElementById('modal-desc').textContent     = card.dataset.desc     || '';

  const link = document.getElementById('modal-link');
  link.href = card.dataset.link || '#';

  const tagsEl = document.getElementById('modal-tags');
  tagsEl.innerHTML = '';
  (card.dataset.tags || '').split('·').forEach(t => {
    const s = document.createElement('span');
    s.className = 'tag';
    s.textContent = t.trim();
    tagsEl.appendChild(s);
  });

  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

document.querySelectorAll('.proj-card').forEach(card => {
  card.addEventListener('click', () => openModal(card));
});
modalOverlay.addEventListener('click', closeModal);
modalClose.addEventListener('click', closeModal);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

/* ── Curseur projet ─────────────────────────── */
const projCursor = document.getElementById('proj-cursor');

document.addEventListener('mousemove', e => {
  projCursor.style.left = e.clientX + 'px';
  projCursor.style.top  = e.clientY  + 'px';
});

document.querySelectorAll('.proj-card').forEach(card => {
  card.addEventListener('mouseenter', () => projCursor.classList.add('visible'));
  card.addEventListener('mouseleave', () => projCursor.classList.remove('visible'));
});

/* ── Photo À propos ─────────────────────────── */
const aboutPlaceholder = document.getElementById('about-placeholder');
if (aboutPlaceholder) aboutPlaceholder.style.display = 'none';

/* ── Sticky nav ─────────────────────────────── */
const nav = document.getElementById('nav');

const darkSections = ['competences', 'parcours', 'contact', 'footer'];

function updateNav() {
  const y = window.scrollY;

  if (y > 60) nav.classList.add('compact');
  else        nav.classList.remove('compact');

  let isDark = false;
  darkSections.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.top <= 80 && rect.bottom > 80) isDark = true;
  });

  document.querySelectorAll('.process, .wheel-wrap').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top <= 80 && rect.bottom > 80) isDark = true;
  });

  if (isDark) {
    nav.classList.add('dark-nav');
    nav.classList.remove('compact');
  } else {
    nav.classList.remove('dark-nav');
  }
}

window.addEventListener('scroll', updateNav, { passive: true });

/* ── Scroll reveal ──────────────────────────── */
const reveals = document.querySelectorAll('.r');
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('on');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

reveals.forEach(el => io.observe(el));

// Immediately reveal elements visible on load
setTimeout(() => {
  document.querySelectorAll('.hero .r').forEach(el => el.classList.add('on'));
}, 100);

/* ── Hero word rotation ─────────────────── */
(function () {
  const words = ['web', 'métier', 'sur mesure'];
  let idx = 0;
  const el = document.querySelector('.hero-word');
  if (!el) return;

  setInterval(() => {
    el.classList.add('w-out');
    setTimeout(() => {
      idx = (idx + 1) % words.length;
      el.textContent = words[idx];
      el.classList.remove('w-out');
      void el.offsetWidth;           // force reflow
      el.classList.add('w-in');
      setTimeout(() => el.classList.remove('w-in'), 520);
    }, 320);
  }, 2600);
})();

/* ── Hero dot grid ──────────────────────── */
(function () {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas || window.matchMedia('(hover: none)').matches) return;

  const ctx = canvas.getContext('2d');
  const SPACING  = 30;
  const BASE_R   = 1.4;
  const MAX_R    = 5.5;
  const REACH    = 140;
  const BASE_A   = 0.10;
  const MAX_A    = 0.55;
  const DPR      = Math.min(window.devicePixelRatio || 1, 2);

  let W, H, cols, rows, dots;
  let mx = -9999, my = -9999;

  function build() {
    const rect = canvas.parentElement.getBoundingClientRect();
    W = rect.width;
    H = rect.height;
    canvas.width  = W * DPR;
    canvas.height = H * DPR;
    canvas.style.width  = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

    cols = Math.ceil(W / SPACING) + 1;
    rows = Math.ceil(H / SPACING) + 1;
    const offX = (W - (cols - 1) * SPACING) / 2;
    const offY = (H - (rows - 1) * SPACING) / 2;

    dots = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        dots.push({
          x: offX + c * SPACING,
          y: offY + r * SPACING,
          cr: BASE_R,
          ca: BASE_A
        });
      }
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < dots.length; i++) {
      const d = dots[i];
      const dx = d.x - mx;
      const dy = d.y - my;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const t = Math.max(0, 1 - dist / REACH);
      const tr = BASE_R + (MAX_R - BASE_R) * t * t;
      const ta = BASE_A + (MAX_A - BASE_A) * t * t;

      d.cr += (tr - d.cr) * 0.12;
      d.ca += (ta - d.ca) * 0.12;

      ctx.beginPath();
      ctx.arc(d.x, d.y, d.cr, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(26,26,26,${d.ca.toFixed(3)})`;
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }

  function onMove(e) {
    const rect = canvas.getBoundingClientRect();
    mx = e.clientX - rect.left;
    my = e.clientY - rect.top;
  }

  function onLeave() { mx = -9999; my = -9999; }

  build();
  draw();

  window.addEventListener('resize', build);
  canvas.parentElement.addEventListener('mousemove', onMove);
  canvas.parentElement.addEventListener('mouseleave', onLeave);
})();

/* ── Wheel 3D ───────────────────────────── */
(function () {
  const wheel = document.querySelector('.wheel');
  if (!wheel) return;

  const items   = Array.from(wheel.querySelectorAll('.wheel-item'));
  const n       = items.length;
  const step    = (2 * Math.PI) / n;   // 45° per item
  const radius  = 310;                  // cylinder radius in px
  let   rot     = 0;
  function tick() {
    rot += 0.007;

    items.forEach((el, i) => {
      const a   = i * step + rot;
      const cos = Math.cos(a);           // 1 = front, -1 = back
      const t   = (cos + 1) / 2;        // 0..1

      el.style.transform = `rotateY(${a}rad) translateZ(${radius}px)`;
      el.style.opacity   = (0.04 + t * 0.96).toFixed(3);
      el.style.filter    = t > 0.85 ? 'none' : `blur(${((1 - t) * 4.5).toFixed(1)}px)`;
    });

    requestAnimationFrame(tick);
  }

  tick();
})();

/* ── Menu mobile ────────────────────────── */
const navBurger = document.getElementById('navBurger');
const navMobile = document.getElementById('navMobile');

function closeMobileNav() {
  nav.classList.remove('mobile-open');
  navMobile.classList.remove('open');
  document.body.style.overflow = '';
}

navBurger.addEventListener('click', () => {
  const isOpen = navMobile.classList.contains('open');
  if (isOpen) { closeMobileNav(); }
  else {
    nav.classList.add('mobile-open');
    navMobile.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
});

navMobile.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', closeMobileNav);
});
