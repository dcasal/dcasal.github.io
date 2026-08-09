/* ==========================================================================
   main.js — Diego Casal, Swiss portfolio (v2)
   Lightbox (architecture) · Media carousel (game dev) · Gallery shuffle (photography).
   Vanilla JS, no dependencies, progressive enhancement.
   ========================================================================== */
(function () {
  'use strict';

  initLightbox();
  initMediaCarousels();
  initGalleryShuffle();

  /* ---------- Architecture: full-res lightbox ---------- */
  function initLightbox() {
    var lightbox = document.querySelector('.lightbox');
    if (!lightbox) return;

    var img = lightbox.querySelector('.lightbox__img');
    var cap = lightbox.querySelector('.lightbox__cap');
    var closeBtn = lightbox.querySelector('.lightbox__close');

    function open(src, caption) {
      img.src = src;
      img.alt = caption || '';
      cap.textContent = caption || '';
      lightbox.classList.add('is-open');
      document.body.classList.add('no-scroll');
      closeBtn.focus();
    }

    function close() {
      lightbox.classList.remove('is-open');
      document.body.classList.remove('no-scroll');
      img.removeAttribute('src');
    }

    document.querySelectorAll('.project-grid a[href$=".jpg"], .project-grid a[href$=".png"]')
      .forEach(function (link) {
        link.addEventListener('click', function (e) {
          e.preventDefault();
          var fig = link.closest('figure');
          var captionEl = fig ? fig.querySelector('.figure__cap') : null;
          var caption = captionEl ? captionEl.textContent.trim() : '';
          open(link.getAttribute('href'), caption);
        });
      });

    closeBtn.addEventListener('click', close);
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  }

  /* ---------- Game dev: Steam-style media carousel ---------- */
  function initMediaCarousels() {
    document.querySelectorAll('.steam-carousel').forEach(function (carousel) {
      var stage = carousel.querySelector('.steam-carousel__stage');
      var track = carousel.querySelector('.steam-carousel__track');
      var thumbs = Array.prototype.slice.call(track.querySelectorAll('.steam-carousel__thumb'));
      var prev = carousel.querySelector('.steam-carousel__nav--prev');
      var next = carousel.querySelector('.steam-carousel__nav--next');
      if (!stage || !track || !thumbs.length) return;

      function buildMedia(thumb, autoplay) {
        var media = thumb.getAttribute('data-media');
        var src = thumb.getAttribute('data-src');
        var label = thumb.getAttribute('aria-label') || '';

        if (media === 'video') {
          var iframe = document.createElement('iframe');
          iframe.src = autoplay
            ? src + (src.indexOf('?') !== -1 ? '&' : '?') + 'autoplay=1'
            : src;
          iframe.title = label;
          iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
          iframe.setAttribute('allowfullscreen', '');
          return iframe;
        }

        var img = document.createElement('img');
        img.src = src;
        img.alt = label;
        img.loading = 'eager';
        img.decoding = 'async';
        return img;
      }

      function select(thumb, autoplay) {
        // Replace media (removes any playing video)
        stage.innerHTML = '';
        stage.appendChild(buildMedia(thumb, autoplay));

        thumbs.forEach(function (t) {
          var on = t === thumb;
          t.classList.toggle('is-active', on);
          t.setAttribute('aria-selected', on ? 'true' : 'false');
        });
      }

      thumbs.forEach(function (thumb) {
        thumb.addEventListener('click', function () { select(thumb, true); });
      });

      function step() {
        var first = track.querySelector('.steam-carousel__thumb');
        if (!first) return 200;
        var gap = parseFloat(getComputedStyle(track).columnGap) || 12;
        return Math.round(first.getBoundingClientRect().width + gap);
      }

      function updateNav() {
        var max = track.scrollWidth - track.clientWidth;
        prev.disabled = track.scrollLeft <= 1;
        next.disabled = track.scrollLeft >= max - 1;
      }

      prev.addEventListener('click', function () {
        track.scrollBy({ left: -step() * 3, behavior: 'smooth' });
      });
      next.addEventListener('click', function () {
        track.scrollBy({ left: step() * 3, behavior: 'smooth' });
      });

      track.addEventListener('scroll', updateNav, { passive: true });
      window.addEventListener('resize', updateNav);

      // Initial state: first media, video without autoplay (browser blocks it)
      select(thumbs[0], false);
      updateNav();
    });
  }

  /* ---------- Photography: randomise gallery order on load ---------- */
  function initGalleryShuffle() {
    var gallery = document.querySelector('.gallery');
    if (!gallery) return;

    var items = Array.prototype.slice.call(gallery.children);
    items.sort(function () { return Math.random() - 0.5; });
    items.forEach(function (item) { gallery.appendChild(item); });
  }
})();
