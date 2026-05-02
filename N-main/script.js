/* ══════════════════════════════════════════════════════
   bundle-fix.js — Corrección de bugs en animaciones Bundle
   NODE Soluciones Tecnológicas — Abril 2026

   BUGS CORREGIDOS:
   1. startBundleAnimations / stopBundleAnimations vivían dentro
      de un IIFE y NO eran accesibles en scope global.
      → switchTab() nunca podía llamarlas → animaciones
        corrían indefinidamente → "se traban" en laptop/PC.

   2. orbitLoop (planeta B7) no verificaba animationsRunning
      antes de pedir el siguiente frame → el RAF continuaba
      incluso después de cancelAnimationFrame → CPU leak.

   3. Animaciones GSAP corrían en móvil (repeat:-1 con elastic/
      bounce sobre SVG) → alto uso de CPU/GPU → layout breaks
      y congelamiento en dispositivos móviles.

   4. openBIM / closeBIM usaban document.body.style.overflow='hidden'
      que NO funciona en iOS Safari → body seguía scrolleando
      bajo el modal.

   INSTRUCCIONES DE INSTALACIÓN:
   Agrega ANTES de </body> en tu HTML, DESPUÉS del script
   de GSAP y DESPUÉS del script principal:

     <script src="bundle-fix.js"></script>

   Este script:
     a) Reemplaza el IIFE de animaciones del script original
     b) Parchea las funciones openBIM / closeBIM globales
     c) No requiere modificar el HTML existente
   ══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ──────────────────────────────────────────────────
     PARTE 1 — Motor de animaciones de bundles
     (reemplaza el IIFE original del index.html)
  ────────────────────────────────────────────────── */

  var timelines = [];
  var orbitRAF = null;
  var orbitAngle = 0;
  var animationsRunning = false;

  /* Detección de móvil y preferencia de movimiento reducido */
  function checkMobile() {
    return window.innerWidth < 768;
  }
  var isMobile = checkMobile();
  var prefersReduced = !!(
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  /* ── startBundleAnimations ── */
  function startBundleAnimations() {
    if (animationsRunning) return;
    if (typeof gsap === 'undefined') return;
    /* FIX 3: No correr animaciones en móvil ni con movimiento reducido */
    if (isMobile || prefersReduced) return;

    animationsRunning = true;
    timelines = [];

    /* ── B1: COHETE — squash-launch ── */
    var tl1 = gsap.timeline({ repeat: -1, repeatDelay: 1.2 });
    tl1
      .to('#bi1-exhaust', { opacity: 0.8, duration: 0.1 })
      .to('#bi1', { scaleX: 1.3, scaleY: 0.7, transformOrigin: 'center bottom', duration: 0.14, ease: 'power2.in' })
      .to('#bi1', { scaleX: 0.75, scaleY: 1.35, transformOrigin: 'center bottom', duration: 0.1, ease: 'power1.out' })
      .to('#bi1', { y: -24, duration: 0.32, ease: 'power2.out' })
      .to('#bi1-flame', { scaleY: 1.8, transformOrigin: 'center top', duration: 0.32, ease: 'power1.in' }, '<')
      .to('#bi1', { rotation: 7, duration: 0.1, ease: 'power1.inOut' })
      .to('#bi1', { rotation: -7, duration: 0.1, ease: 'power1.inOut' })
      .to('#bi1', { rotation: 0, duration: 0.08 })
      .to('#bi1', { y: 0, duration: 0.45, ease: 'bounce.out' })
      .to('#bi1-exhaust', { opacity: 0, duration: 0.15 }, '<')
      .to('#bi1-flame', { scaleY: 1, transformOrigin: 'center top', duration: 0.2 }, '<0.1')
      .to('#bi1', { scaleX: 1.22, scaleY: 0.8, transformOrigin: 'center bottom', duration: 0.1, ease: 'power2.out' })
      .to('#bi1', { scaleX: 1, scaleY: 1, duration: 0.4, ease: 'elastic.out(1,0.4)', transformOrigin: 'center bottom' });
    timelines.push(tl1);

    /* ── B2: MONEDA — flip + destellos ── */
    var tl2 = gsap.timeline({ repeat: -1, repeatDelay: 0.9 });
    tl2
      .to('#bi2', { scaleX: 0, duration: 0.18, ease: 'power2.in', transformOrigin: 'center center' })
      .to('#bi2', { scaleX: 1, duration: 0.18, ease: 'power2.out', transformOrigin: 'center center' })
      .to('#bi2-s1', { x: -12, y: -14, scale: 1.5, duration: 0.28, ease: 'power2.out' }, '-=0.1')
      .to('#bi2-s2', { x: -10, y: 12, scale: 1.3, duration: 0.28, ease: 'power2.out' }, '<0.04')
      .to('#bi2-s3', { x: 12, y: 8, scale: 1.4, duration: 0.28, ease: 'power2.out' }, '<0.04')
      .to('#bi2-s4', { x: 9, y: -12, scale: 1.3, duration: 0.28, ease: 'power2.out' }, '<0.04')
      .to(['#bi2-s1', '#bi2-s2', '#bi2-s3', '#bi2-s4'], { x: 0, y: 0, scale: 1, duration: 0.45, ease: 'power2.in' }, '+=0.1')
      .to('#bi2', { scale: 1.15, duration: 0.15, ease: 'power1.out', transformOrigin: 'center center' })
      .to('#bi2', { scale: 1, duration: 0.35, ease: 'elastic.out(1,0.5)', transformOrigin: 'center center' });
    timelines.push(tl2);

    /* ── B3: BOLSA — balancea + guiño ── */
    var tl3 = gsap.timeline({ repeat: -1, repeatDelay: 1.1 });
    tl3
      .to('#bi3', { rotation: -14, y: -5, transformOrigin: 'center bottom', duration: 0.22, ease: 'power2.out' })
      .to('#bi3', { rotation: 14, y: -5, transformOrigin: 'center bottom', duration: 0.22, ease: 'power2.inOut' })
      .to('#bi3', { rotation: 0, y: 0, transformOrigin: 'center bottom', duration: 0.22, ease: 'power2.in' })
      .to('#bi3', { scaleX: 1.15, scaleY: 0.84, transformOrigin: 'center bottom', duration: 0.1, ease: 'power2.out' })
      .to('#bi3', { scaleX: 1, scaleY: 1, duration: 0.38, ease: 'elastic.out(1,0.4)', transformOrigin: 'center bottom' })
      .to('#bi3-ojo-l', { scaleY: 0.08, duration: 0.08, ease: 'power3.in', transformOrigin: 'center center' }, '+=0.1')
      .to('#bi3-ojo-l', { scaleY: 1, duration: 0.14, ease: 'elastic.out(1,0.4)', transformOrigin: 'center center' });
    timelines.push(tl3);

    /* ── B4: BARRAS — crecen una por una ── */
    var tl4 = gsap.timeline({ repeat: -1, repeatDelay: 1.3 });
    tl4
      .set(['#bi4-b1', '#bi4-b2', '#bi4-b3'], { scaleY: 0, transformOrigin: 'center bottom', opacity: 1 })
      .set(['#bi4-arrow', '#bi4-star'], { opacity: 0 })
      .to('#bi4-b1', { scaleY: 1, duration: 0.3, ease: 'elastic.out(1,0.45)', transformOrigin: 'center bottom' })
      .to('#bi4-b3', { scaleY: 1, duration: 0.3, ease: 'elastic.out(1,0.45)', transformOrigin: 'center bottom' }, '<0.12')
      .to('#bi4-b2', { scaleY: 1, duration: 0.35, ease: 'elastic.out(1,0.4)', transformOrigin: 'center bottom' }, '<0.12')
      .to('#bi4-arrow', { opacity: 1, y: 0, duration: 0.25, ease: 'power2.out' }, '<0.2')
      .to('#bi4-star', { opacity: 1, scale: 1.3, duration: 0.2, ease: 'elastic.out(1,0.3)', transformOrigin: 'center center' })
      .to('#bi4-star', { scale: 1, duration: 0.15 })
      .to({}, { duration: 0.9 })
      .to(['#bi4-b1', '#bi4-b2', '#bi4-b3', '#bi4-arrow', '#bi4-star'], { opacity: 0, duration: 0.22 });
    timelines.push(tl4);

    /* ── B5: ROBOT — antena + parpadeo ── */
    var tl5 = gsap.timeline({ repeat: -1, repeatDelay: 0.7 });
    tl5
      .to('#bi5-ball', { rotation: 40, transformOrigin: 'bottom center', duration: 0.16, ease: 'power2.out' })
      .to('#bi5-ball', { rotation: -40, transformOrigin: 'bottom center', duration: 0.16, ease: 'power2.inOut' })
      .to('#bi5-ball', { rotation: 0, transformOrigin: 'bottom center', duration: 0.28, ease: 'elastic.out(1,0.35)' })
      .to('#bi5-ojo-l', { scaleY: 0.08, duration: 0.07, transformOrigin: 'center center' }, '+=0.05')
      .to('#bi5-ojo-l', { scaleY: 1, duration: 0.13, ease: 'elastic.out(1,0.4)', transformOrigin: 'center center' })
      .to('#bi5-ojo-r', { scaleY: 0.08, duration: 0.07, transformOrigin: 'center center' }, '<0.1')
      .to('#bi5-ojo-r', { scaleY: 1, duration: 0.13, ease: 'elastic.out(1,0.4)', transformOrigin: 'center center' })
      .to('#bi5', { rotation: 9, duration: 0.22, ease: 'power2.inOut' })
      .to('#bi5', { rotation: -9, duration: 0.22, ease: 'power2.inOut' })
      .to('#bi5', { rotation: 0, duration: 0.28, ease: 'elastic.out(1,0.4)' });
    timelines.push(tl5);

    /* ── B6: RAYO — golpe + líneas de energía ── */
    var tl6 = gsap.timeline({ repeat: -1, repeatDelay: 1.0 });
    tl6
      .to('#bi6-bolt', { scaleY: 0.78, transformOrigin: 'center top', duration: 0.13, ease: 'power2.in' })
      .to('#bi6-bolt', { scaleY: 1.18, transformOrigin: 'center top', duration: 0.09, ease: 'power1.out' })
      .to('#bi6-bolt', { opacity: 0.35, duration: 0.06 })
      .to('#bi6-bolt', { opacity: 1, duration: 0.1 })
      .to('#bi6-bolt', { scaleY: 1, duration: 0.3, ease: 'elastic.out(1,0.4)', transformOrigin: 'center top' })
      .to(['#bi6-l1', '#bi6-l2', '#bi6-l3'], { opacity: 0.8, x: 0, stagger: 0.05, duration: 0.18, ease: 'power2.out' }, '<0.05')
      .to(['#bi6-l1', '#bi6-l2', '#bi6-l3'], { opacity: 0, x: -12, stagger: 0.04, duration: 0.25, ease: 'power2.in' }, '+=0.25')
      .to('#bi6', { scale: 1.1, duration: 0.12, transformOrigin: 'center center' })
      .to('#bi6', { scale: 1, duration: 0.3, ease: 'elastic.out(1,0.5)', transformOrigin: 'center center' });
    timelines.push(tl6);

    /* ── B7: PLANETA — órbita via RAF ── */
    var b7dot = document.getElementById('bi7-dot');
    function orbitLoop() {
      /* FIX 2: verificar flag ANTES de solicitar el siguiente frame */
      if (!animationsRunning) return;

      orbitAngle += 0.022;
      if (b7dot) {
        b7dot.setAttribute('cx', String(27 + 26 * Math.cos(orbitAngle)));
        b7dot.setAttribute('cy', String(27 + 11 * Math.sin(orbitAngle)));
      }
      orbitRAF = requestAnimationFrame(orbitLoop);
    }
    orbitRAF = requestAnimationFrame(orbitLoop);

    var tlPlanet = gsap.to('#bi7-planet', {
      scale: 1.06, duration: 2.2, repeat: -1, yoyo: true,
      ease: 'sine.inOut', transformOrigin: 'center center'
    });
    timelines.push(tlPlanet);

    /* ── B8: DIAMANTE — giro + destello ── */
    var tl8 = gsap.timeline({ repeat: -1, repeatDelay: 1.4 });
    tl8
      .to('#bi8-gem', { rotation: 360, duration: 1.6, ease: 'power1.inOut', transformOrigin: '27px 30px' })
      .to('#bi8-shine', { opacity: 0, scale: 2.2, transformOrigin: '27px 4px', duration: 0.18, ease: 'power2.out' })
      .to('#bi8-shine', { opacity: 1, scale: 1, transformOrigin: '27px 4px', duration: 0.12 })
      .to('#bi8-glow', { opacity: 0.28, scale: 1.18, duration: 0.22, transformOrigin: 'center center' })
      .to('#bi8-glow', { opacity: 0.07, scale: 1, duration: 0.45, ease: 'power2.out', transformOrigin: 'center center' })
      .to('#bi8', { scale: 1.08, duration: 0.15, transformOrigin: 'center center' })
      .to('#bi8', { scale: 1, duration: 0.4, ease: 'elastic.out(1,0.4)', transformOrigin: 'center center' });
    timelines.push(tl8);
  }

  /* ── stopBundleAnimations ── */
  function stopBundleAnimations() {
    if (!animationsRunning) return;

    /* FIX 2: marcar como parado PRIMERO para que orbitLoop no
       solicite otro frame si ya hay uno en cola */
    animationsRunning = false;

    if (orbitRAF !== null) {
      cancelAnimationFrame(orbitRAF);
      orbitRAF = null;
    }

    timelines.forEach(function (tl) {
      if (tl && typeof tl.kill === 'function') tl.kill();
    });
    timelines = [];
  }

  /* ──────────────────────────────────────────────────
     FIX 1 — EXPOSICIÓN GLOBAL (bug principal en desktop)
     El IIFE original NUNCA exponía estas funciones al scope
     global, por eso switchTab() nunca podía llamarlas y
     las animaciones corrían indefinidamente.
  ────────────────────────────────────────────────── */
  window.startBundleAnimations = startBundleAnimations;
  window.stopBundleAnimations = stopBundleAnimations;

  /* ──────────────────────────────────────────────────
     Page Visibility API:
     Parar animaciones cuando el usuario cambia de pestaña
     del browser (libera CPU/GPU inmediatamente)
  ────────────────────────────────────────────────── */
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      stopBundleAnimations();
    } else {
      /* Solo reanudar si el tab de bundles está activo */
      var bundleTab = document.getElementById('tab-bun');
      if (bundleTab && bundleTab.classList.contains('active')) {
        startBundleAnimations();
      }
    }
  });

  /* ──────────────────────────────────────────────────
     Resize listener: re-evaluar si estamos en móvil
     (útil para rotación de dispositivo)
  ────────────────────────────────────────────────── */
  window.addEventListener('resize', function () {
    isMobile = checkMobile();
    if (isMobile && animationsRunning) {
      stopBundleAnimations();
    }
  }, { passive: true });

  /* ──────────────────────────────────────────────────
     IntersectionObserver: igual que el original pero
     ahora sí funciona porque stop es accesible
  ────────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    var bundleTab = document.getElementById('tab-bun');
    if (!bundleTab) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          startBundleAnimations();
        } else {
          stopBundleAnimations();
        }
      });
    }, { threshold: 0.05 });

    observer.observe(bundleTab);
  });

  /* ──────────────────────────────────────────────────
     PARTE 2 — iOS Scroll Lock para modales BIM
     FIX 4: document.body.style.overflow='hidden' no
     funciona en iOS Safari. Solución: position:fixed +
     guardar/restaurar la posición de scroll.
  ────────────────────────────────────────────────── */
  var bimScrollY = 0;

  function openBIM(id) {
    var overlay = document.getElementById(id);
    if (!overlay) return;

    /* Cerrar cualquier modal BIM que esté abierto */
    document.querySelectorAll('.bim-overlay.open').forEach(function (el) {
      el.classList.remove('open');
    });

    overlay.classList.add('open');

    /* iOS-safe scroll lock */
    bimScrollY = window.scrollY || window.pageYOffset;
    document.body.style.top = '-' + bimScrollY + 'px';
    document.body.classList.add('bim-lock');
  }

  function closeBIM(id) {
    var overlay = document.getElementById(id);
    if (!overlay) return;
    overlay.classList.remove('open');
    _unlockScroll();
  }

  function closeBIMOutside(event, overlay) {
    if (event.target === overlay) {
      overlay.classList.remove('open');
      _unlockScroll();
    }
  }

  function _unlockScroll() {
    document.body.classList.remove('bim-lock');
    document.body.style.top = '';
    window.scrollTo(0, bimScrollY);
  }

  /* Escape key: cerrar modal BIM abierto */
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    var openModal = document.querySelector('.bim-overlay.open');
    if (openModal) {
      openModal.classList.remove('open');
      _unlockScroll();
    }
  });

  /* ──────────────────────────────────────────────────
     PARTE 3 — Sobrescribir funciones globales
     El HTML original ya tiene openBIM / closeBIM / closeBIMOutside
     definidos inline. Este script los sobreescribe con las
     versiones corregidas (iOS-safe + limpieza correcta).
  ────────────────────────────────────────────────── */
  window.openBIM = openBIM;
  window.closeBIM = closeBIM;
  window.closeBIMOutside = closeBIMOutside;

})();
