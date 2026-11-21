import json,glob,os,re,sys
BANS=[r'£',r'\bfrom \d',r'\bEst\.? ?2004|since 2004|20\+|\bdecades?\b|years of experience|\bestablished\b',r'insured|insurance|accredit|\baward',r'\b\d+(-\d+)? ?(working )?(days?|hours?|weeks?|months?|years?)\b',r'same[- ]day|next[- ]day|overnight|turnaround',r'full (vehicle )?wraps?',r'workwear|hi-?vis|embroider|merchandise|canvas|gift',r'Mad Graphics',r'Brighton|Hove|Portslade|Rottingdean|Saltdean',r'\b(Avery|3M|Oracal|Mimaki|Roland|Hexis)\b',r'—|–',r'free delivery|discount|\d+ ?%|testimonial|\d ?stars?',r'weatherproof|waterproof|fade[- ]?proof|guarantee|compliant|compliance|certified']
ok=True
def walk(o):
    if isinstance(o,str): yield o
    elif isinstance(o,list):
        for x in o: yield from walk(x)
    elif isinstance(o,dict):
        for k,v in o.items():
            if k=='reviewFlags': continue
            yield from walk(v)
for kind,req in (('services',['slug','title','category','description','image','imageAlt','lead','intro','whenNeeded','whatYouGet','steps','faqs','related','reviewFlags']),('locations',['slug','name','description','image','imageAlt','lead','local','popular','nearby','faqs','reviewFlags'])):
    for f in sorted(glob.glob(f'content/{kind}/*.mdx')):
        d=json.loads(open(f).read().split('---',2)[1]); b=os.path.basename(f)[:-4]
        miss=[k for k in req if k not in d or not d[k]]
        if miss or d['slug']!=b: print(f,'MISSING',miss,d.get('slug')); ok=False
        for t in walk(d):
            for p in BANS:
                m=re.search(p,t,re.I)
                if m and not (p.startswith('full') and re.search(r"\bno\b|not|n't|\?$",t)): print(f,'BAN',repr(m.group(0)),'::',t[:90]); ok=False
print('OK' if ok else 'ISSUES')
