(function(){
  document.documentElement.classList.add('js');
  var b=document.getElementById('menu-btn'),n=document.getElementById('site-nav');
  if(!b||!n)return;
  var mq=window.matchMedia('(max-width:52rem)');
  function sync(){ if(mq.matches){n.hidden=b.getAttribute('aria-expanded')!=='true';}else{n.hidden=false;} }
  b.addEventListener('click',function(){var o=b.getAttribute('aria-expanded')==='true';b.setAttribute('aria-expanded',String(!o));b.textContent=!o?'Close':'Menu';sync();});
  n.addEventListener('click',function(e){if(e.target.tagName==='A'&&mq.matches){b.setAttribute('aria-expanded','false');b.textContent='Menu';sync();}});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&b.getAttribute('aria-expanded')==='true'){b.setAttribute('aria-expanded','false');b.textContent='Menu';sync();b.focus();}});
  mq.addEventListener('change',sync);sync();
})();
