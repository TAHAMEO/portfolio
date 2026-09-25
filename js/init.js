/*
 * Runs in <head> before first paint (kept external so the CSP needs no 'unsafe-inline').
 * - "js" lets the CSS enable JS-only UI (terminal prompt, mobile menu).
 * - "booting" shows the boot sequence once per browser session, unless the
 *   visitor prefers reduced motion.
 */
(function () {
  var root = document.documentElement;
  root.classList.add('js');

  try {
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduceMotion && !sessionStorage.getItem('booted')) root.classList.add('booting');
  } catch {
    /* Storage blocked (private mode, strict settings): skip the boot sequence. */
  }
})();
