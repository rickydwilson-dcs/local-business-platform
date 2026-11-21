(function () {
  document.documentElement.classList.add('js');
  var btn = document.querySelector('.menu-toggle');
  var nav = document.getElementById('site-nav');
  if (!btn || !nav) return;
  var mq = window.matchMedia('(max-width: 860px)');
  function sync() {
    if (mq.matches) { nav.hidden = true; btn.setAttribute('aria-expanded', 'false'); }
    else { nav.hidden = false; }
  }
  btn.addEventListener('click', function () {
    var open = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!open));
    nav.hidden = open;
  });
  nav.addEventListener('click', function (e) { if (e.target.tagName === 'A' && mq.matches) sync(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && mq.matches && !nav.hidden) { sync(); btn.focus(); } });
  mq.addEventListener('change', sync);
  sync();
})();
