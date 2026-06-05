/* Pages intérieures / secondaires — burger, barre de lecture, reveal. */
(function () {
  var burger = document.getElementById('burger'), nav = document.getElementById('nav');
  if (burger) burger.addEventListener('click', function () { nav.classList.toggle('open'); });
  if (nav) nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { nav.classList.remove('open'); }); });

  var prog = document.querySelector('.rprog');
  function upd() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    if (prog) prog.style.width = (max > 0 ? (h.scrollTop / max * 100) : 0) + '%';
  }
  if (prog) {
    window.addEventListener('scroll', upd, { passive: true });
    window.addEventListener('resize', upd);
    upd();
  }

  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) e.target.classList.add('in'); });
  }, { threshold: 0.16 });
  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
})();
