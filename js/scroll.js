/* ===========================================================
   V2 JETS — scroll engine
   parallax · progress · reveals · nav · fleet drag · fallbacks
   =========================================================== */
(function () {
  'use strict';
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- image fallbacks (if a generated asset is missing) ---- */
  document.querySelectorAll('img[data-fallback]').forEach(function (img) {
    img.addEventListener('error', function () {
      if (img.src.indexOf(img.dataset.fallback) === -1) img.src = img.dataset.fallback;
    });
  });

  /* ---- elements ---- */
  var nav = document.getElementById('nav');
  var bar = document.getElementById('progressBar');
  var secNum = document.getElementById('secNum');
  var bgs = [].slice.call(document.querySelectorAll('.panel__bg'));
  var scenes = [].slice.call(document.querySelectorAll('.scene'));
  var sections = [].slice.call(document.querySelectorAll('[data-index]'));
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }

  /* ---- prime every scroll-scrubbed scene video (muted, first frame shown) ---- */
  [].slice.call(document.querySelectorAll('.scene__video')).forEach(function (v) {
    v.muted = true;
    v.addEventListener('loadeddata', function () { try { v.currentTime = 0.001; } catch (e) {} });
    try { v.load(); } catch (e) {}
  });
  document.getElementById('secTotal').textContent =
    String(sections.length).padStart(2, '0');

  /* ---- reveal + active-section via IntersectionObserver ---- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) e.target.classList.add('in');
    });
  }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });

  var activeIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('in-view');
        var idx = e.target.getAttribute('data-index');
        if (idx) secNum.textContent = idx;
      } else {
        e.target.classList.remove('in-view');
      }
    });
  }, { threshold: 0.5 });
  sections.forEach(function (s) { activeIO.observe(s); });

  /* ---- rAF scroll loop: progress bar + parallax + nav ---- */
  var ticking = false;
  function onScroll() {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }
  function update() {
    var y = window.pageYOffset;
    var h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';

    nav.classList.toggle('solid', y > window.innerHeight * 0.65);

    if (!reduce) {
      var vh = window.innerHeight;

      /* --- scroll-scrubbed camera scenes: dolly forward through the cabin --- */
      scenes.forEach(function (scene) {
        var cam = scene.querySelector('.scene__cam');
        var inner = scene.querySelector('.scene__inner');
        var cue = scene.querySelector('.scroll-cue');
        var vid = scene.querySelector('.scene__video');
        var total = scene.offsetHeight - vh;
        var p = clamp(-scene.getBoundingClientRect().top / (total || 1), 0, 1);

        if (vid) {                                    // scrub the clip → camera moves around / with the jet
          if (vid.readyState >= 1 && vid.duration) {
            var t = p * (vid.duration - 0.06);
            if (Math.abs(t - (vid._lt || 0)) >= 0.02) { vid._lt = t; try { vid.currentTime = t; } catch (e) {} }
          }
        } else if (cam) {                             // fallback dolly on a still
          var scale = 1.06 + p * 1.10;
          var panX = Math.sin(p * Math.PI) * 1.6;
          var panY = -2 + p * 5;
          cam.style.transform =
            'translate3d(' + panX.toFixed(2) + '%,' + panY.toFixed(2) + '%,0) scale(' + scale.toFixed(3) + ')';
        }
        if (inner) {
          if (scene.getAttribute('data-reveal') === 'in') {   // CTA: copy settles in as the jet lands
            var oi = clamp((p - 0.04) / 0.16, 0, 1);
            inner.style.opacity = oi.toFixed(3);
            inner.style.transform = 'translate3d(0,' + ((1 - oi) * 28).toFixed(1) + 'px,0)';
          } else {                                            // hero: hold, then fade + lift as it orbits
            var op = 1 - clamp((p - 0.40) / 0.18, 0, 1);
            inner.style.opacity = op.toFixed(3);
            inner.style.transform = 'translate3d(0,' + (p * -44).toFixed(1) + 'px,0)';
          }
        }
        if (cue) cue.style.opacity = (1 - clamp(p / 0.12, 0, 1)).toFixed(3);
      });

      /* --- gentle dolly + parallax on the other full-bleed panels --- */
      bgs.forEach(function (bg) {
        var r = bg.getBoundingClientRect();
        if (r.bottom < -vh || r.top > vh * 2) return;          // offscreen → skip
        var speed = parseFloat(bg.getAttribute('data-speed')) || 0.12;
        var offset = (r.top + r.height / 2 - vh / 2) * -speed;  // centre-relative parallax
        var prog = clamp(1 - (r.top + r.height / 2) / (vh + r.height / 2), 0, 1);
        var s = (1.04 + prog * 0.12).toFixed(3);               // slow zoom as it passes
        bg.style.transform = 'translate3d(0,' + offset.toFixed(1) + 'px,0) scale(' + s + ')';
      });
    }
    ticking = false;
  }
  window.addEventListener('resize', onScroll);
  // Native scroll drives the loop until Lenis is ready (and is the only driver
  // when reduced-motion disables Lenis). Once Lenis exists, bind update() to its
  // own animation frame so parallax + video-scrub move in lockstep with the
  // smoothed scroll position — no one-frame lag, far smoother.
  window.addEventListener('scroll', onScroll, { passive: true });
  (function bindLenis(tries) {
    if (window.lenis && typeof window.lenis.on === 'function') {
      window.removeEventListener('scroll', onScroll);
      window.lenis.on('scroll', update);
    } else if (tries > 0) {
      requestAnimationFrame(function () { bindLenis(tries - 1); });
    }
  })(180);
  update();

  /* ---- fleet: drag / wheel to scroll horizontally ---- */
  var track = document.getElementById('fleetTrack');
  if (track) {
    var down = false, startX = 0, startScroll = 0;
    track.addEventListener('pointerdown', function (e) {
      down = true; startX = e.clientX; startScroll = track.scrollLeft;
      track.classList.add('drag'); track.setPointerCapture(e.pointerId);
    });
    track.addEventListener('pointermove', function (e) {
      if (!down) return;
      track.scrollLeft = startScroll - (e.clientX - startX);
    });
    ['pointerup', 'pointercancel'].forEach(function (ev) {
      track.addEventListener(ev, function () { down = false; track.classList.remove('drag'); });
    });
    // vertical wheel → horizontal scroll while hovering the track, BUT only while
    // the carousel still has room to travel that way. At either edge, release the
    // wheel so the page keeps scrolling (don't trap vertical scroll over the fleet).
    track.addEventListener('wheel', function (e) {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;   // genuine horizontal → native
      var max = track.scrollWidth - track.clientWidth;
      // EDGE tolerance absorbs the carousel's scroll-snap padding: its resting
      // start position is ~40px (not 0), so a strict `<= 0` check would never fire
      // and would keep trapping upward scroll at the start.
      var EDGE = 56;
      var atStart = track.scrollLeft <= EDGE;
      var atEnd = track.scrollLeft >= max - EDGE;
      if ((e.deltaY < 0 && atStart) || (e.deltaY > 0 && atEnd)) return; // edge → page scrolls
      track.scrollLeft += e.deltaY;
      e.preventDefault();
    }, { passive: false });
  }
})();
