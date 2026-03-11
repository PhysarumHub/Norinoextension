(function () {
  'use strict';

  /* ── Before/After Slider ─────────────────────── */
  var wrap    = document.getElementById('baWrap');
  var layer   = document.getElementById('baLayer');
  var divider = document.getElementById('baDivider');
  var handle  = document.getElementById('baHandle');

  if (wrap && layer && divider && handle) {
    function setPosition(clientX) {
      var rect = wrap.getBoundingClientRect();
      var pct  = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
      var val  = pct * 100 + '%';
      layer.style.width  = val;
      divider.style.left = val;
      handle.style.left  = val;
      wrap.style.setProperty('--full-w', rect.width + 'px');
    }

    var dragging = false;

    wrap.addEventListener('mousedown', function (e) {
      dragging = true;
      setPosition(e.clientX);
    });
    document.addEventListener('mousemove', function (e) {
      if (dragging) setPosition(e.clientX);
    });
    document.addEventListener('mouseup', function () {
      dragging = false;
    });

    wrap.addEventListener('touchstart', function (e) {
      setPosition(e.touches[0].clientX);
    }, { passive: true });
    wrap.addEventListener('touchmove', function (e) {
      setPosition(e.touches[0].clientX);
    }, { passive: true });

    function syncWidth() {
      wrap.style.setProperty('--full-w', wrap.getBoundingClientRect().width + 'px');
    }
    syncWidth();
    window.addEventListener('resize', syncWidth);
  }

  /* ── Hotspot popups ──────────────────────────── */
  var overlay    = document.getElementById('hsOverlay');
  var isMobile   = function () { return window.matchMedia('(max-width: 640px)').matches; };
  var activePopup = null;

  function closeAll() {
    document.querySelectorAll('.hs-popup.visible').forEach(function (p) {
      p.classList.remove('visible');
    });
    document.querySelectorAll('.hs-btn.active').forEach(function (b) {
      b.classList.remove('active');
    });
    if (overlay) overlay.classList.remove('visible');
    activePopup = null;
  }

  document.querySelectorAll('.hs-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var popId = btn.getAttribute('data-pop');
      var pop   = document.getElementById(popId);
      if (!pop) return;

      if (pop.classList.contains('visible')) {
        closeAll();
        return;
      }

      closeAll();
      pop.classList.add('visible');
      btn.classList.add('active');
      activePopup = pop;

      if (isMobile() && overlay) {
        overlay.classList.add('visible');
      }
    });
  });

  document.querySelectorAll('.hs-close').forEach(function (btn) {
    btn.addEventListener('click', closeAll);
  });

  if (overlay) {
    overlay.addEventListener('click', closeAll);
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeAll();
  });

  /* ── Trends Slider ───────────────────────────── */
  var track   = document.getElementById('trendsTrack');
  var prevBtn = document.getElementById('trendPrev');
  var nextBtn = document.getElementById('trendNext');

  if (track && prevBtn && nextBtn) {
    function getScrollAmount() {
      var card = track.querySelector('.trends__card');
      if (!card) return 300;
      var style = getComputedStyle(track);
      var gap   = parseInt(style.gap) || 18;
      return card.offsetWidth + gap;
    }

    prevBtn.addEventListener('click', function () {
      track.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
    });
    nextBtn.addEventListener('click', function () {
      track.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
    });
  }

  /* ── Navbar scroll ───────────────────────────── */
  var siteNav = document.getElementById('site-nav');
  if (siteNav) {
    window.addEventListener('scroll', function () {
      siteNav.classList.toggle('scrolled', window.scrollY > 10);
    }, { passive: true });
  }

  /* ── Hero gallery infinite scroll ────────────── */
  /* (moved outside IIFE — see bottom of file) */
})();

/* ── Hero gallery infinite scroll ──────────────── */
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var gallery = document.querySelector('.hero-header__gallery');
  if (!gallery) return;

  var cfg = [
    { dir: 'up',   dur: 22, delay:   0 },
    { dir: 'down', dur: 28, delay: -14 },
    { dir: 'up',   dur: 22, delay:  -8 }
  ];

  function initCols() {
    var cols     = gallery.querySelectorAll('.hero-header__col');
    var galleryH = gallery.offsetHeight;
    if (!galleryH) return;

    cols.forEach(function (col, i) {
      var c = cfg[i];
      if (!c) return;

      // Reset
      col.classList.remove('hero-col-up', 'hero-col-down');
      col.style.removeProperty('--loop-h');
      col.style.removeProperty('--hero-dur');
      col.style.removeProperty('animation-delay');
      col.style.removeProperty('transform');
      col.style.removeProperty('animation');
      col.querySelectorAll('.hero-clone').forEach(function (el) { el.remove(); });

      var wraps = Array.from(col.querySelectorAll('.hero-header__img-wrap'));
      if (!wraps.length) return;

      var gap  = parseFloat(getComputedStyle(col).gap) || 10;
      var n    = wraps.length;
      var imgH = (galleryH - gap * (n - 1)) / n;
      var loopPx = Math.round(n * imgH + n * gap);

      wraps.forEach(function (w) {
        w.style.flex   = '0 0 ' + Math.round(imgH) + 'px';
        w.style.height = Math.round(imgH) + 'px';
      });

      // Clone for seamless loop
      wraps.forEach(function (w) {
        var clone = w.cloneNode(true);
        clone.classList.add('hero-clone');
        col.appendChild(clone);
      });

      // Force reflow before applying animation
      void col.offsetHeight;

      col.style.setProperty('--loop-h', loopPx + 'px');
      col.style.setProperty('--hero-dur', c.dur + 's');
      col.style.animationDelay = c.delay + 's';
      col.classList.add('hero-col-' + c.dir);
    });
  }

  // Run on load to guarantee layout is complete
  window.addEventListener('load', function () {
    requestAnimationFrame(function () {
      initCols();
    });
  });

  // Also try immediately if DOM is ready
  if (document.readyState === 'complete') {
    requestAnimationFrame(initCols);
  }

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(initCols, 250);
  }, { passive: true });
})();

/* ── Timeline reveal on scroll ──────────────────── */
(function () {
  if (!('IntersectionObserver' in window)) return;
  var items = document.querySelectorAll('.tl-item');
  if (!items.length) return;

  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('tl-item--visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });

  items.forEach(function (el) { obs.observe(el); });
})();

/* ── FAQ accordion ─────────────────────────────── */
(function () {
  var items = document.querySelectorAll('#faqList .faq-item');
  items.forEach(function (item) {
    var btn = item.querySelector('.faq-item__btn');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');
      items.forEach(function (i) {
        i.classList.remove('open');
        var b = i.querySelector('.faq-item__btn');
        if (b) b.setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
})();

/* ── Consulenza popup — multi-step ─────────────── */
var consultStepMeta = [
  null,
  { eyebrow: 'Passo 1 di 3', title: 'Scegli il salone.', sub: 'Seleziona la sede più vicina a te.' },
  { eyebrow: 'Passo 2 di 3', title: 'I tuoi dati.', sub: 'Ti contatteremo entro 24 ore per confermare.' },
  { eyebrow: 'Passo 3 di 3', title: 'Quasi fatto.', sub: 'Conferma il consenso per completare la prenotazione.' }
];

function openConsultPopup() {
  var overlay = document.getElementById('consultOverlay');
  if (!overlay) return;
  consultGoStep(1, true);
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeConsultPopup() {
  var overlay = document.getElementById('consultOverlay');
  if (!overlay) return;
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

function consultGoStep(n, silent) {
  document.querySelectorAll('.consult-step').forEach(function (s) { s.classList.remove('active'); });
  var target = document.querySelector('.consult-step[data-step="' + n + '"]');
  if (target) target.classList.add('active');

  document.querySelectorAll('[data-step-dot]').forEach(function (d) {
    var dn = parseInt(d.getAttribute('data-step-dot'));
    d.className = 'consult-progress__dot' + (dn < n ? ' done' : dn === n ? ' active' : '');
  });

  var meta = consultStepMeta[n];
  if (meta) {
    var ey = document.getElementById('consultEyebrow');
    var ti = document.getElementById('consultTitle');
    var su = document.getElementById('consultSub');
    if (ey) ey.textContent = meta.eyebrow;
    if (ti) ti.textContent = meta.title;
    if (su) su.textContent = meta.sub;
  }

  if (!silent) {
    var modal = document.querySelector('.consult-modal');
    if (modal) modal.scrollTop = 0;
  }
}

function consultSelectSalon(card) {
  document.querySelectorAll('.consult-salon-card').forEach(function (c) { c.classList.remove('selected'); });
  card.classList.add('selected');
  var hidden = document.getElementById('cf-salon');
  if (hidden) hidden.value = card.getAttribute('data-salon');
  setTimeout(function () { consultGoStep(2); }, 200);
}

(function () {
  var overlay = document.getElementById('consultOverlay');
  if (!overlay) return;
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closeConsultPopup();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeConsultPopup();
  });
  var form = document.getElementById('consult-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      closeConsultPopup();
    });
  }
})();

/* ── Declarative event binding ─────────────────── */
(function () {
  document.addEventListener('click', function (e) {
    var openBtn = e.target.closest('[data-action="open-consult"]');
    if (openBtn) { openConsultPopup(); return; }

    var closeBtn = e.target.closest('[data-action="close-consult"]');
    if (closeBtn) { closeConsultPopup(); return; }

    var stepBtn = e.target.closest('[data-action="consult-step"]');
    if (stepBtn) { consultGoStep(parseInt(stepBtn.getAttribute('data-step'))); return; }

    var salonCard = e.target.closest('[data-action="select-salon"]');
    if (salonCard) { consultSelectSalon(salonCard); return; }
  });
})();
