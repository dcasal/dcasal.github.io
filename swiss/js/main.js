/* ==========================================================================
   main.js — Diego Casal, Swiss portfolio (v2)
   Lightbox (architecture) · Cinema video (game dev) · Gallery shuffle (photography).
   Vanilla JS, no dependencies, progressive enhancement.
   ========================================================================== */
(function () {
  'use strict';

  initLightbox();
  initCinema();
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

  /* ---------- Game dev: cinema video overlay ---------- */
  function initCinema() {
    var overlay = document.querySelector('.cinema-overlay');
    var play = document.querySelector('.cinema__play');
    if (!overlay || !play) return;

    var frame = overlay.querySelector('iframe');
    var closeBtn = overlay.querySelector('.cinema-overlay__close');

    function open() {
      // Load the video only on demand (perf: no YouTube payload until played)
      frame.src = frame.getAttribute('data-src');
      overlay.classList.add('is-open');
      document.body.classList.add('no-scroll');
      closeBtn.focus();
    }

    function close() {
      overlay.classList.remove('is-open');
      document.body.classList.remove('no-scroll');
      frame.removeAttribute('src');
    }

    play.addEventListener('click', open);
    closeBtn.addEventListener('click', close);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
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
