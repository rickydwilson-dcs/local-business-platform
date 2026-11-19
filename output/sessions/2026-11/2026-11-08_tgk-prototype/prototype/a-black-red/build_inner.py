import re
home=open('index.html').read()
head=home[:home.index('<main')]
head=re.sub(r'<title>.*?</title>','<title>@@T@@ | The Graphic Kings</title>',head)
head=re.sub(r'<meta name="description"[^>]*>','<meta name="description" content="@@D@@">',head)
head=head.replace('<link rel="stylesheet" href="styles.css?v=20261123">','<link rel="stylesheet" href="styles.css?v=20261123"><link rel="stylesheet" href="inner.css?v=20261123">')
head=head.replace('href="#services"','href="services.html"').replace('href="#areas"','href="index.html#areas"').replace('href="#about"','href="index.html#about"').replace('href="#contact"','href="contact.html"').replace('href="#quote"','href="contact.html"').replace('class="brand" href="#"','class="brand" href="index.html"')
foot=home[home.index('<footer'):]
foot=foot.replace('Direction A: black and red.','Direction A: black and red. Inner pages.')
foot=foot.replace('href="#contact"','')
def page(fn,title,desc,body):
    h=head.replace('@@T@@',title).replace('@@D@@',desc)
    open(fn,'w').write(h+'<main id="main">\n'+body+'\n</main>\n\n'+foot)
IMG='https://pub-a159d5c51e44442897e06986a53dda1d.r2.dev/prototypes/2026-11-08_tgk-prototype/assets/img/web/'
quote='''<section class="quote" aria-labelledby="quote-h"><div class="wrap"><h2 id="quote-h" class="display">@@@</h2><div class="acts"><a class="phone" href="tel:01323589700">01323 589 700</a><a class="btn btn--on-red" href="contact.html">Get a free quote</a></div></div></section>'''
import json,glob,os
def _load(p):
    t=open(p).read().split('---',2)[1]; return json.loads(t)
SVC={os.path.basename(f)[:-4]:_load(f) for f in glob.glob('content/services/*.mdx')}
LOC={os.path.basename(f)[:-4]:_load(f) for f in glob.glob('content/locations/*.mdx')}
CATS=json.load(open('content/categories.json'))
svc_href=lambda s:'service-%s.html'%s
loc_href=lambda s:'location-%s.html'%s
crumbs=lambda *c:'<nav class="crumbs" aria-label="Breadcrumb"><div class="wrap">'+' <span>/</span> '.join(c)+'</div></nav>'

# ---------- services hub
cats=[
 ('Vehicle graphics','fleet','Vans, cars, fleets and magnetic signs. Lettering, logos and partial graphics.',['Van graphics','Car graphics','Fleet graphics','Magnetic signs']),
 ('Signs and signage','shopfront','Fixed and portable signs for shops, sites and workplaces.',['Shop signs','A-boards','Directional signs','Safety signs','Site boards','Foam board and Correx','Hoarding graphics']),
 ('Banners','banner','Short-term or long-term, indoors or out.',['PVC banners','Mesh banners','Fabric banners','Roller banners']),
 ('Large format, window and wall','window','Big prints and graphics for glass, walls and floors.',['Large format print','Poster printing','Exhibition prints','Window graphics','Window stickers','Wall graphics','Floor graphics']),
 ('Stickers and labels','stickers','Custom shapes, sizes and quantities.',['Custom stickers','Labels']),
 ('Print and stationery','print','The everyday print every business runs out of.',['Business cards','Flyers and leaflets','Brochures','Letterheads','Presentation folders','Menu printing']),
 ('Design','design','Artwork that is ready to print, from a rough sketch or a blank page.',['Graphic design','Logo design','Brand identity','Print design','Artwork and pre-press']),
]
b='''<section class="hero-split"><div class="hero-copy-in"><p class="label">Services</p><h1 class="display">What we make</h1><p class="lead">Seven families, forty ways to put your name on something. Pick the one nearest and we'll take it from there.</p>
<ul class="jump">'''+''.join(f'<li><a href="#c{i+1}"><span>{i+1:02d}</span>{c[0]}</a></li>' for i,c in enumerate(cats))+'''</ul></div>
<div class="hero-pic-in stripe"><img src="'''+IMG+'''wall.jpg" alt="Illustrative mock-up: a wall graphic for The Graphic Kings" width="1800" height="1195" fetchpriority="high"><p class="tag">Illustrative mock-up. Real project photos to come.</p></div></section>'''
for i,(n,img,d,items) in enumerate(cats):
    alt=' cat--flip' if i%2 else ''
    C=CATS[i]; lst=''.join(f'<li><a href="{svc_href(sl)}">{SVC[sl]["title"] if sl in SVC else sl}<span aria-hidden="true">&rarr;</span></a></li>' for sl in [C['slug']]+C['children'])
    b+=f'''
<section class="cat{alt}" id="c{i+1}" aria-labelledby="c{i+1}h"><div class="cat-pic stripe"><img src="{IMG}{img}.jpg" alt="Illustrative mock-up: {n.lower()}" width="1800" height="1195" loading="lazy"><span class="tag">Illustrative mock-up</span></div>
<div class="cat-body"><span class="num">{i+1:02d}</span><h2 id="c{i+1}h" class="display">{n}</h2><p>{d}</p><ul class="subs">{lst}</ul></div></section>'''
b+='''
<section class="note-band"><div class="wrap"><p><strong>No full vehicle wraps.</strong> Lettering, partial graphics and livery only.</p><a href="#">Clothing and workwear &rarr; The Clothing Kings</a></div></section>
'''+quote.replace('@@@','Not sure which<br>one you need?')
page('services.html','Services','Vehicle graphics, signs, banners, large format, stickers, print and design from The Graphic Kings in East Sussex.',crumbs('<a href="index.html">Home</a>','Services')+b)

exec(open('build_content.py').read())

# ---------- contact
opts=''.join(f'<option>{c[0]}</option>' for c in cats)
b=crumbs('<a href="index.html">Home</a>','Contact')+'''
<section class="ct"><div class="wrap two">
<div class="ct-form"><p class="label">Contact</p><h1 class="display">Get a free quote</h1><p class="lead">Tell us what it is and where it's going. A photo helps. We'll come back to you.</p>
<form onsubmit="return false"><div class="row"><label>Name<input name="name" autocomplete="name" required></label><label>Phone<input name="tel" type="tel" autocomplete="tel"></label></div>
<div class="row"><label>Email<input name="email" type="email" autocomplete="email" required></label>
<label>What's it for?<select name="what"><option value="">Choose a service</option>'''+opts+'''<option>Not sure</option></select></label></div>
<label>Tell us more<textarea name="msg" rows="3"></textarea></label>
<div class="row row--end"><label>Add a photo (optional)<input type="file" name="photo" accept="image/*"></label>
<button class="btn" type="submit">Send enquiry</button></div><p class="tag">Prototype form. It does not send anything yet.</p></form></div>
<aside class="ct-side"><div class="ct-block"><h2>Call</h2><a class="big" href="tel:01323589700">01323 589 700</a></div>
<div class="ct-block"><h2>Email</h2><a class="mid" href="mailto:office@thegraphickings.co.uk">office@thegraphickings.co.uk</a></div>
<div class="ct-block"><h2>Hours</h2><p>Mon to Fri 8am to 5pm<br>Sat by appointment<br>Sun closed</p></div>
<div class="ct-block"><h2>Find us</h2><p>Unit H2, Chaucer Business Park,<br>Dittons Road, Polegate, East Sussex BN26</p></div></aside></div></section>'''

page('contact.html','Contact','Contact The Graphic Kings in Polegate, East Sussex. Call 01323 589 700 or send an enquiry for a free quote.',b)

def towns_li(ts):
    o=''
    for t in ts:
        _sl=t.lower().replace(' ','-'); href=loc_href(_sl) if _sl in LOC else '#'
        cls=' class="base"' if t=='Polegate' else ''
        o+='<li><a href="%s"%s><span>%s</span><i aria-hidden="true">&rarr;</i></a></li>'%(href,cls,t)
    return o


# ---------- about
b=crumbs('<a href="index.html">Home</a>','About')+"""
<section class="ab-hero"><div class="ab-copy"><p class="label">About</p><h1 class="display">Local graphics,<br>made <em>properly</em></h1>
<p class="lead">The Graphic Kings is the new name for Mad Graphics. Same workshop in Polegate, same phone number, new look. We design, make and supply vehicle graphics, signs, banners, stickers and print for businesses across East Sussex.</p>
<div class="cta"><a class="btn" href="contact.html">Get a free quote</a><a class="btn btn--ghost" href="services.html">See what we make</a></div></div>
<div class="ab-pic"><img src=\""""+IMG+"""design.jpg" alt="Illustrative mock-up: a designer's desk with Graphic Kings artwork" width="1800" height="1195" fetchpriority="high"><p class="tag">Illustrative mock-up. Workshop photos to come.</p></div></section>

<section class="ab-do" aria-labelledby="ab-h"><div class="wrap"><h2 id="ab-h" class="display">How we work</h2>
<div class="pillars">
<article><span class="n">01</span><h3>Designed here</h3><p>Our own artwork team, so the design and the making happen under one roof and nothing gets lost in between.</p></article>
<article><span class="n">02</span><h3>Made to last</h3><p>UV-rated materials, chosen for where the job will live, indoors or out.</p></article>
<article><span class="n">03</span><h3>Local</h3><p>Based at Chaucer Business Park in Polegate, working with businesses across nineteen East Sussex towns and villages.</p></article>
<article><span class="n">04</span><h3>Free quotes</h3><p>Tell us what you need and we'll quote for it, at no charge.</p></article></div></div></section>

<section class="ab-kings" aria-labelledby="k-h"><div class="wrap"><div class="k-head"><h2 id="k-h" class="display">One family of Kings</h2><p class="lead">We're one of three sister companies. Each does its own thing well.</p></div>
<div class="k-cards">
<a class="k k--red" href="index.html"><span class="k-dot" aria-hidden="true"></span><h3>The Graphic Kings</h3><p>Vehicle graphics, signs, banners and print. You are here.</p></a>
<a class="k k--blue" href="https://www.thetapekings.co.uk/" rel="noopener"><span class="k-dot" aria-hidden="true"></span><h3>The Tape Kings</h3><p>Our sister company's online tape shop.</p><span class="go">Visit &rarr;</span></a>
<a class="k k--yellow" href="https://www.theclothingkings.co.uk/" rel="noopener"><span class="k-dot" aria-hidden="true"></span><h3>The Clothing Kings</h3><p>Our sister company for clothing and workwear.</p><span class="go">Visit &rarr;</span></a></div></div></section>
"""+quote.replace('@@@','Want to know<br>more? Ask us.')
page('about.html','About','The Graphic Kings, formerly Mad Graphics: in-house design, UV-rated materials and free quotes from Polegate, East Sussex.',b)

# ---------- locations index
b=crumbs('<a href="index.html">Home</a>','Areas')+"""
<section class="hero-split hero-split--flip"><div class="hero-copy-in"><p class="label">Areas</p><h1 class="display">Where we work</h1>
<p class="lead">Nineteen East Sussex towns and villages, all within reach of our workshop in Polegate. Pick yours.</p>
<p class="not-covered">Not currently covering Brighton, Hove, Portslade, Rottingdean or Saltdean.</p>
<div class="lx-base"><span class="label">Our base</span><p>Unit H2, Chaucer Business Park,<br>Dittons Road, Polegate BN26</p></div></div>
<div class="hero-pic-in stripe"><img src=\""""+IMG+"""shopfront.jpg" alt="Illustrative mock-up: a shopfront with The Graphic Kings signage" width="1800" height="1195" fetchpriority="high"><p class="tag">Illustrative mock-up. Real project photos to come.</p></div></section>
<section class="lx"><div class="wrap"><ul class="lx-towns">"""+towns_li(["Eastbourne","Hastings","Lewes","Bexhill-on-Sea","Uckfield","Crowborough","Seaford","Hailsham","Newhaven","Polegate","Peacehaven","Battle","St Leonards-on-Sea","Heathfield","Pevensey","Ringmer","Herstmonceux","Wadhurst","Alfriston"])+"""</ul></div></section>"""+quote.replace('@@@','Not on the list?<br>Ask anyway.')
page('locations.html','Areas we cover','The Graphic Kings covers nineteen East Sussex towns and villages from Polegate, including Eastbourne, Hastings, Lewes and Bexhill-on-Sea.',b)

