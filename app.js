/* Dietrichs Marketing — ocean-inspirert forside
   Reveal, nav-scroll, mobilmeny, tall-telling. */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Nav: skygge/blur ved scroll ---- */
  var nav = document.getElementById('nav');
  function onScroll() {
    if (window.scrollY > 12) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- Mobilmeny ---- */
  var burger = document.getElementById('burger');
  var mobileMenu = document.getElementById('mobileMenu');
  function setMenu(open) {
    mobileMenu.classList.toggle('open', open);
    document.body.classList.toggle('mobile-open', open);
  }
  if (burger && mobileMenu) {
    burger.addEventListener('click', function () {
      setMenu(!mobileMenu.classList.contains('open'));
    });
    mobileMenu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { setMenu(false); });
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  }

  /* ---- Reveal ved scroll ---- */
  var reveals = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  if (reduce || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* ---- Tall-telling ---- */
  function animateCount(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var suffix = el.getAttribute('data-suffix') || '';
    if (reduce || isNaN(target)) { el.textContent = target + suffix; return; }
    var dur = 1100, start = null;
    function tick(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = target + suffix;
    }
    requestAnimationFrame(tick);
  }
  var counters = Array.prototype.slice.call(document.querySelectorAll('[data-count]'));
  if ('IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { animateCount(en.target); cio.unobserve(en.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { cio.observe(el); });
  } else {
    counters.forEach(animateCount);
  }

  /* ---- Subtil parallax på hero-grid (GSAP, kun hvis tilgjengelig) ---- */
  if (!reduce && window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    var grid = document.querySelector('.hero-grid-overlay');
    if (grid) {
      gsap.to(grid, {
        yPercent: 12, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
      });
    }
  }
})();
