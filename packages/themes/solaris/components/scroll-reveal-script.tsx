/**
 * SolarisScrollReveal
 *
 * Server Component that emits a tiny inline script to wire up
 * IntersectionObserver for .solaris-reveal and .solaris-heading elements.
 * CSS for these classes is in packages/themes/solaris/globals.css.
 */
export function SolarisScrollReveal() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
(function(){
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var els = document.querySelectorAll('.solaris-reveal, .solaris-heading');
  if (reduceMotion) {
    els.forEach(function(el){ el.classList.add('visible'); });
    return;
  }
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){ e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  els.forEach(function(el){ io.observe(el); });
})();
`,
      }}
    />
  );
}
