# Executed by build_inner.py (shares its namespace: page, IMG, quote, crumbs, SVC, LOC, CATS, hrefs).
from html import escape as _e
E=lambda t:_e(t,quote=True)
CAT_BY_SLUG={c['slug']:c for c in CATS}
def _img(key): return IMG+key+'.jpg'
def _faqs(items,first_open=True):
    return ''.join('<details%s><summary>%s</summary><p>%s</p></details>'%(' open' if i==0 and first_open else '',E(f['q']),E(f['a'])) for i,f in enumerate(items))
def _card(sl):
    s=SVC[sl]; return '<a href="%s"><img src="%s" alt="" width="1800" height="1195" loading="lazy"><span>%s</span></a>'%(svc_href(sl),_img(s['image']),E(s['title']))

def service_page(sl,s):
    cat=CAT_BY_SLUG[s['category']]; hub=s.get('hub')
    if hub: cr=crumbs('<a href="index.html">Home</a>','<a href="services.html">Services</a>',E(s['title']))
    else: cr=crumbs('<a href="index.html">Home</a>','<a href="services.html">Services</a>','<a href="%s">%s</a>'%(svc_href(cat['slug']),E(cat['name'])),E(s['title']))
    ntl='<p class="nowrap-note">No full wraps. Lettering and partial graphics only.</p>' if s['category']=='vehicle-graphics' else ''
    b=cr+'''
<section class="sd-hero"><div class="sd-copy"><p class="label">%s</p><h1 class="display">%s</h1>
<p class="lead">%s</p>
<div class="cta"><a class="btn" href="contact.html">Get a free quote</a><a class="btn btn--ghost" href="tel:01323589700">01323 589 700</a></div>%s</div>
<div class="sd-pic"><img src="%s" alt="%s" width="1800" height="1018" fetchpriority="high"><p class="tag">Illustrative mock-up. Real project photos to come.</p></div></section>
'''%(E(cat['name']),E(s['title']),E(s['lead']),ntl,_img(s['image']),E(s['imageAlt']))
    if s.get('intro'):
        b+='<section class="sd-intro"><div class="wrap"><p class="lead">%s</p></div></section>\n'%E(s['intro'])
    if hub:
        kids=''.join(_card(k) for k in cat['children'] if k in SVC)
        b+='<section class="sd-rel" aria-labelledby="kids-h"><div class="wrap"><h2 id="kids-h" class="display">In this category</h2><div class="rel rel--hub">%s</div></div></section>\n'%kids
    b+='''
<section class="sd-two" aria-labelledby="good-h"><div class="wrap two">
<div><h2 id="good-h" class="display">When you need it</h2><ul class="ticks">%s</ul></div>
<div class="kit"><h2 class="display">What you get</h2><ul class="ticks ticks--on-paper">%s</ul></div></div></section>

<section class="sd-steps" aria-labelledby="how-h"><div class="wrap"><h2 id="how-h" class="display">How it works</h2>
<ol class="steps">%s</ol></div></section>

<section class="sd-faq" aria-labelledby="faq-h"><div class="wrap two"><div><h2 id="faq-h" class="display">Questions</h2><p class="lead">Can't see yours? Ring 01323 589 700.</p></div>
<div class="faqs">%s</div></div></section>
'''%(''.join('<li>%s</li>'%E(x) for x in s['whenNeeded']),
     ''.join('<li><b>%s.</b> %s</li>'%(E(x['title']),E(x['text'])) for x in s['whatYouGet']),
     ''.join('<li><b>%s</b><span>%s</span></li>'%(E(x['title']),E(x['text'])) for x in s['steps']),
     _faqs(s['faqs']))
    rel=[r for r in s.get('related',[]) if r in SVC]
    if rel:
        b+='<section class="sd-rel" aria-labelledby="rel-h"><div class="wrap"><h2 id="rel-h" class="display">Related</h2><div class="rel">%s</div></div></section>\n'%''.join(_card(r) for r in rel)
    b+=quote.replace('@@@','Tell us what<br>you need.')
    page(svc_href(sl),s['title'],s['description'],b)

def location_page(sl,l):
    n=E(l['name'])
    b=crumbs('<a href="index.html">Home</a>','<a href="locations.html">Areas</a>',n)+'''
<section class="loc-hero"><div class="loc-copy"><p class="label">%s and nearby</p><h1 class="display">Graphics and print<br>in <em>%s</em></h1>
<p class="lead">%s</p>
<div class="cta"><a class="btn" href="contact.html">Get a free quote</a><a class="btn btn--ghost" href="tel:01323589700">01323 589 700</a></div></div>
<div class="loc-pic"><img src="%s" alt="%s" width="1800" height="1195" fetchpriority="high"><p class="tag">Illustrative mock-up. Real project photos to come.</p></div></section>

<section class="sd-rel" aria-labelledby="lw-h"><div class="wrap"><h2 id="lw-h" class="display">What we make for %s</h2><div class="rel">%s</div></div></section>

<section class="loc-local"><div class="wrap two"><div><h2 class="display">Working in %s</h2><p class="lead">%s</p></div>
<div><h2 class="display">Close by</h2><ul class="towns towns--sm">%s</ul>
<p class="not-covered">Not currently covering Brighton, Hove, Portslade, Rottingdean or Saltdean.</p></div></div></section>

<section class="sd-faq" aria-labelledby="faq-h"><div class="wrap two"><div><h2 id="faq-h" class="display">Questions</h2><p class="lead">Can't see yours? Ring 01323 589 700.</p></div>
<div class="faqs">%s</div></div></section>
'''%(n,n,E(l['lead']),_img(l['image']),E(l['imageAlt']),n,
     ''.join(_card(p) for p in l['popular'] if p in SVC),
     n,E(l['local']),
     ''.join('<li><a href="%s">%s</a></li>'%(loc_href(x),E(LOC[x]['name'])) for x in l['nearby'] if x in LOC),
     _faqs(l['faqs']))
    b+=quote.replace('@@@','%s business?<br>Get a quote.'%n)
    page(loc_href(sl),l['name'],l['description'],b)

for _sl,_s in SVC.items(): service_page(_sl,_s)
for _sl,_l in LOC.items(): location_page(_sl,_l)
