/**
 * common.js — 食堂 うめぼし 天神南 共通スクリプト
 */

(function () {
  'use strict';

  const currentPage = document.body.dataset.page || 'home';

  const ownScript = [...document.scripts].find(s => /(?:^|\/)common\.js(?:\?|$)/.test(s.src));
  const ROOT = new URL('.', ownScript ? ownScript.src : location.href).pathname;
  function resolvePartial(html) {
    return html.replace(/src="\.\//g, `src="${ROOT}`);
  }

  function loadHeader() {
    const mount = document.getElementById('shared-header');
    if (!mount) return;

    fetch(ROOT + 'partials/header.html')
      .then(r => { if (!r.ok) throw new Error('partial'); return r.text(); })
      .then(html => {
        html = resolvePartial(html);
        mount.outerHTML = html;
        initNav();
        initDrawer();
        initStickyHeader();
      })
      .catch(() => {});
  }

  function initNav() {
    document.querySelectorAll('[data-nav]').forEach(a => {
      if (a.dataset.nav === currentPage) {
        a.setAttribute('aria-current', 'page');
      }
    });
  }

  function initDrawer() {
    const btn     = document.querySelector('.nav-toggle');
    const drawer  = document.getElementById('drawerMenu');
    const overlay = document.getElementById('drawerOverlay');
    if (!btn || !drawer || !overlay) return;

    function openDrawer() {
      drawer.inert = false;
      drawer.classList.add('is-open');
      overlay.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      btn.setAttribute('aria-expanded', 'true');
      drawer.setAttribute('aria-hidden', 'false');
      overlay.setAttribute('aria-hidden', 'false');
      document.querySelector('main').inert = true;
      drawer.querySelector('button').focus();
    }

    function closeDrawer() {
      drawer.inert = true;
      document.querySelector('main').inert = false;
      btn.focus();
      drawer.classList.remove('is-open');
      overlay.classList.remove('is-open');
      document.body.style.overflow = '';
      btn.setAttribute('aria-expanded', 'false');
      drawer.setAttribute('aria-hidden', 'true');
      overlay.setAttribute('aria-hidden', 'true');
    }

    btn.addEventListener('click', () =>
      drawer.classList.contains('is-open') ? closeDrawer() : openDrawer()
    );

    document.querySelectorAll('[data-close="drawer"]').forEach(el =>
      el.addEventListener('click', closeDrawer)
    );

    drawer.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', closeDrawer)
    );

    document.addEventListener('keydown', e => {
      if (!drawer.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeDrawer();
      if (e.key === 'Tab') {
        const items = [...drawer.querySelectorAll('button, a[href]')];
        const first = items[0], last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }

  function loadBottom() {
    const mount = document.getElementById('shared-bottom');
    if (!mount) return;

    fetch(ROOT + 'partials/bottom.html')
      .then(r => { if (!r.ok) throw new Error('partial'); return r.text(); })
      .then(html => {
        mount.innerHTML = resolvePartial(html);
        mount.querySelectorAll('.section').forEach(sec => sec.classList.add('is-inview'));

        if (currentPage === 'home') {
          mount.querySelectorAll('.js-hide-on-home').forEach(el => el.style.display = 'none');
        }

        const hash = location.hash;
        if (hash) {
          setTimeout(() => {
            const target = document.getElementById(decodeURIComponent(hash.slice(1)));
            if (target) target.scrollIntoView({ behavior: 'smooth' });
          }, 400);
        }
      })
      .catch(() => {});
  }

  function initStickyHeader() {
    const header = document.querySelector('.site-header');
    if (!header) return;
    const update = () => header.classList.toggle('has-scrolled', scrollY > 30);
    window.addEventListener('scroll', update, {passive:true});
    update();
  }

  function initPageTop() {
    const pageTop = document.querySelector('.page-top');
    if (!pageTop) return;

    function toggle() {
      const y = window.scrollY || document.documentElement.scrollTop;
      pageTop.classList.toggle('is-show', y > 480);
    }

    window.addEventListener('scroll', toggle, { passive: true });
    toggle();
  }

  function initScrollReveal() {
    const sections = document.querySelectorAll('.section');
    if (!sections.length) return;
    if (!('IntersectionObserver' in window)) { sections.forEach(s => s.classList.add('is-inview')); return; }

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-inview');
          io.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.10,
      rootMargin: '0px 0px -8% 0px'
    });

    sections.forEach(sec => io.observe(sec));
  }

  function initGA4Tracking() {
    document.addEventListener('click', function(e) {
      if (typeof gtag !== 'function') return;
      const a = e.target.closest('a');
      if (!a) return;
      const href = a.getAttribute('href') || '';

      if (href.startsWith('tel:')) {
        gtag('event', 'phone_click', {
          event_category: 'contact',
          event_label: href.replace('tel:', ''),
          page_location: location.href
        });
      }

      if (href.includes('toreta') || href.includes('autoreserve') || href.includes('hotpepper') || href.includes('maps/reserve')) {
        gtag('event', 'reservation_click', {
          event_category: 'conversion',
          event_label: a.textContent.trim().slice(0, 50),
          page_location: location.href
        });
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    loadHeader();
    loadBottom();
    initPageTop();
    initScrollReveal();
    initGA4Tracking();
  });

})();
