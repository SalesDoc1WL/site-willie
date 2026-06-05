/* Accueil V2 — interactions : count-up, reveal, mini-nav, burger,
   séquences « voyage du document ». Le contenu est rendu côté serveur
   par Astro ; ce script ne fait QUE l'animation et la navigation. */
(function () {
  var fmt = function (n) { return n.toLocaleString('fr-FR'); };

  /* ---------- count-up (pré-rempli, anime à l'entrée) ---------- */
  document.querySelectorAll('.count').forEach(function (el) {
    if (el.dataset.to != null) el.textContent = fmt(+el.dataset.to);
  });
  function runCount(el) {
    if (el.dataset.done || el.dataset.to == null) return;
    el.dataset.done = '1';
    var to = +el.dataset.to, dur = +el.dataset.dur || 1400, t0 = null;
    el.textContent = '0';
    function step(t) {
      if (!t0) t0 = t;
      var p = Math.min((t - t0) / dur, 1), e = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(Math.round(to * e));
      if (p < 1) requestAnimationFrame(step); else el.textContent = fmt(to);
    }
    requestAnimationFrame(step);
  }

  /* ---------- reveal + count on scroll ---------- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) {
        en.target.classList.add('in');
        if (en.target.classList.contains('count')) runCount(en.target);
        en.target.querySelectorAll && en.target.querySelectorAll('.count').forEach(runCount);
      }
    });
  }, { threshold: 0.25 });
  document.querySelectorAll('.reveal, .count').forEach(function (el) { io.observe(el); });

  /* ---------- nav mobile (burger) ---------- */
  var burger = document.getElementById('burger'), nav = document.getElementById('nav');
  if (burger) burger.addEventListener('click', function () { nav.classList.toggle('open'); });
  if (nav) nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { nav.classList.remove('open'); }); });

  /* ---------- mini-nav latérale (section active + clic) ---------- */
  (function () {
    var snav = document.getElementById('snav'); if (!snav) return;
    var items = Array.prototype.slice.call(snav.querySelectorAll('.snav__item'));
    var targets = items.map(function (it) { return document.querySelector(it.dataset.go); });
    items.forEach(function (it) {
      it.addEventListener('click', function () {
        var t = document.querySelector(it.dataset.go);
        if (t) window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 70, behavior: 'smooth' });
      });
    });
    function onScroll() {
      var y = window.scrollY + window.innerHeight * 0.4, idx = 0;
      for (var i = 0; i < targets.length; i++) { if (targets[i] && targets[i].offsetTop <= y) idx = i; }
      items.forEach(function (it, i) { it.classList.toggle('is-active', i === idx); });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();
  })();

  /* ---------- séquences « voyage du document » (scroll-driven) ---------- */
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var easeIO = function (p) { return p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2; };
  var frFix = function (n, dec) { return n.toFixed(dec).replace('.', ','); };

  document.querySelectorAll('.journey').forEach(function (section) {
    var sticky = section.querySelector('.journey__sticky');
    if (!sticky) return;
    var idxEl = section.querySelector('.jindex');
    var metrics = Array.prototype.map.call(section.querySelectorAll('[data-metric]'), function (el) {
      return { el: el, from: +el.dataset.from, to: +el.dataset.to, dec: +el.dataset.dec || 0 };
    });
    var target = 0, current = 0, lastStage = -1;

    function computeTarget() {
      var r = section.getBoundingClientRect();
      var total = section.offsetHeight - window.innerHeight;
      target = Math.max(0, Math.min(1, (-r.top) / total));
    }
    function apply(p) {
      sticky.style.setProperty('--p', p.toFixed(4));
      var stage = p < 0.25 ? 0 : p < 0.5 ? 1 : p < 0.75 ? 2 : 3;
      if (stage !== lastStage) {
        lastStage = stage;
        sticky.dataset.stage = stage;
        if (idxEl) idxEl.textContent = '0' + (stage + 1);
      }
      var e = easeIO(p);
      metrics.forEach(function (m) { m.el.firstChild.textContent = frFix(m.from + (m.to - m.from) * e, m.dec); });
    }
    function onScroll() { computeTarget(); apply(target); }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();
    (function loop() {
      current += (target - current) * (reduce ? 1 : 0.09);
      apply(current);
      requestAnimationFrame(loop);
    })();
  });
})();
