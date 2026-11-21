(function () {
  var btn = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  if (!btn || !nav) return;
  btn.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.textContent = open ? 'Close' : 'Menu';
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('open')) {
      nav.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      btn.textContent = 'Menu';
      btn.focus();
    }
  });
})();

(function () {
  var tabs = [].slice.call(document.querySelectorAll('.uc-tabs button'));
  if (!tabs.length) return;
  var data = [
    { img: 'rollerbanners', alt: 'Illustrative mock-up: roller banners at a trade show', h: 'Stand out on the hall floor', items: ['Roller banners', 'Backdrop', 'Floor graphics', 'Table cover', 'Flyers'] },
    { img: 'hoarding', alt: 'Illustrative mock-up: building site hoarding', h: 'Be seen before the scaffolding comes down', items: ['Hoarding panels', 'Site boards', 'Mesh banners', 'Van signs'] },
    { img: 'window', alt: 'Illustrative mock-up: window graphics for a new unit', h: 'Ready for day one', items: ['Window vinyl', 'Fascia sign', 'A-board', 'Menus and cards'] },
    { img: 'floor', alt: 'Illustrative mock-up: floor graphics in a workplace', h: 'Guide people, show who you are', items: ['Floor graphics', 'Wall graphics', 'Reception logo', 'Door and glass vinyl'] }
  ];
  var img = document.querySelector('.uc-pic img');
  var h = document.querySelector('.uc-h');
  var ul = document.querySelector('.uc-kit ul');
  tabs.forEach(function (b) { new Image().src = b.getAttribute('data-src'); });
  function sel(i) {
    var d = data[i];
    tabs.forEach(function (b, j) { b.setAttribute('aria-selected', i === j ? 'true' : 'false'); });
    img.src = tabs[i].getAttribute('data-src');
    img.alt = d.alt;
    h.textContent = d.h;
    ul.innerHTML = d.items.map(function (x) { return '<li>' + x + '</li>'; }).join('');
  }
  tabs.forEach(function (b, i) { b.setAttribute('role', 'tab'); b.addEventListener('click', function () { sel(i); }); });
})();
