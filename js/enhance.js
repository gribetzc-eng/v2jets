/* ===========================================================
   V2 JETS — experience polish
   Lenis inertia scroll · line reveals · intro curtain · tilt + magnetic
   =========================================================== */
(function () {
  'use strict';
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---- 1) Lenis inertia smooth-scroll ---- */
  var lenis = null;
  if (!reduce && window.Lenis) {
    lenis = new Lenis({
      duration: 1.05,                        // weighted, decelerating glide (cinematic feel)
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); }, // easeOutExpo
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,                  // a touch more reach per swipe on mobile
      syncTouch: false                       // keep native momentum on touch (smoothing it feels laggy)
    });
    window.lenis = lenis;
    (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })();
    // route in-page anchors through Lenis, offset for the fixed nav
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = a.getAttribute('href');
        if (!id || id.length < 2) return;
        var el = document.querySelector(id);
        if (!el) return;
        e.preventDefault();
        lenis.scrollTo(el, { offset: -86, duration: 1.25 });
      });
    });
  }

  /* ---- 2) Cinematic line-by-line heading reveals ---- */
  var heads = [].slice.call(document.querySelectorAll('.display, .title, .statement, .heading, .phero h1, .cta-band h2'));
  heads.forEach(function (h) {
    if (h.dataset.split) return;
    h.dataset.split = '1';
    var parts = h.innerHTML.split(/<br\s*\/?>/i);
    h.innerHTML = parts.map(function (p, i) {
      return '<span class="ln" style="--d:' + (i * 0.09).toFixed(2) + 's"><span class="ln__i">' + p + '</span></span>';
    }).join('');
    h.classList.remove('reveal');   // the lines handle the reveal now
  });
  if (reduce) {
    heads.forEach(function (h) { h.classList.add('lit'); });
  } else {
    var lineIO = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('lit'); lineIO.unobserve(e.target); } });
    }, { threshold: 0.25, rootMargin: '0px 0px -6% 0px' });
    heads.forEach(function (h) { lineIO.observe(h); });
  }

  /* ---- 2b) Pages without scroll.js (inner pages): nav-solid + reveal ---- */
  if (!document.querySelector('.scene')) {
    var navEl = document.getElementById('nav');
    if (navEl) {
      var navSolid = function () { navEl.classList.toggle('solid', (window.pageYOffset || 0) > 60); };
      window.addEventListener('scroll', navSolid, { passive: true });
      navSolid();
    }
    var revIO = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); revIO.unobserve(e.target); } });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.reveal').forEach(function (el) { revIO.observe(el); });
  }

  /* ---- 3) Intro curtain ---- */
  var intro = document.getElementById('intro');
  if (intro) {
    if (reduce) {
      intro.remove();
    } else {
      var html = document.documentElement;
      html.style.overflow = 'hidden';
      if (lenis) lenis.stop();
      requestAnimationFrame(function () { requestAnimationFrame(function () { intro.classList.add('show'); }); });
      setTimeout(function () { intro.classList.add('lift'); }, 1550);
      setTimeout(function () {
        if (intro.parentNode) intro.remove();
        html.style.overflow = '';
        if (lenis) lenis.start();
      }, 2650);
    }
  }

  /* ---- 4) Card tilt + magnetic buttons (fine pointers only) ---- */
  if (!reduce && fine) {
    [].slice.call(document.querySelectorAll('.fcard')).forEach(function (card) {
      var track = card.closest('#fleetTrack');
      card.addEventListener('pointermove', function (e) {
        if (track && track.classList.contains('drag')) return;
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transition = 'transform .12s ease';
        card.style.transform = 'perspective(900px) rotateY(' + (px * 5).toFixed(2) + 'deg) rotateX(' +
          (-py * 5).toFixed(2) + 'deg) translateY(-6px)';
      });
      card.addEventListener('pointerleave', function () {
        card.style.transition = '';
        card.style.transform = '';
      });
    });
    [].slice.call(document.querySelectorAll('.btn, .nav__cta')).forEach(function (b) {
      b.addEventListener('pointermove', function (e) {
        var r = b.getBoundingClientRect();
        var mx = e.clientX - (r.left + r.width / 2);
        var my = e.clientY - (r.top + r.height / 2);
        b.style.transition = 'transform .12s ease';
        b.style.transform = 'translate(' + (mx * 0.22).toFixed(1) + 'px,' + (my * 0.3).toFixed(1) + 'px)';
      });
      b.addEventListener('pointerleave', function () {
        b.style.transition = '';
        b.style.transform = '';
      });
    });
  }

  /* ---- 5) Full-screen menu (links to the real V2 Jets pages) ---- */
  var menuBtn = document.getElementById('menuBtn');
  var menu = document.getElementById('menu');
  var nav = document.getElementById('nav');
  if (menuBtn && menu) {
    var setMenu = function (open) {
      menu.classList.toggle('open', open);
      if (nav) nav.classList.toggle('menu-open', open);
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      menu.setAttribute('aria-hidden', open ? 'false' : 'true');
      menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      document.documentElement.style.overflow = open ? 'hidden' : '';
      if (window.lenis) { open ? window.lenis.stop() : window.lenis.start(); }
    };
    menuBtn.addEventListener('click', function () { setMenu(!menu.classList.contains('open')); });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { setMenu(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('open')) setMenu(false);
    });
  }
})();
