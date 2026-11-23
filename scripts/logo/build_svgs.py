import json, math
S = json.load(open('shapes.json'))
W, H = 2570.391, 2119.396
# Part labelling (by position, see listing): order kept as in PDF paint order.
labels = {0:'deva-d',7:'deva-e',5:'deva-v',4:'deva-a',6:'stante-s',9:'stante-t1',3:'stante-a',1:'stante-n',8:'stante-t2',2:'stante-e',
          10:'onda',15:'linea-sx',14:'linea-dx',24:'tag-p',26:'tag-i',21:'tag-z1',20:'tag-z2',22:'tag-a1',23:'tag-e',18:'tag-s1',16:'tag-m',25:'tag-a2',19:'tag-s2',17:'tag-h',
          11:'mono-d',12:'mono-e',13:'mono-onda',27:'separatore-tavola'}
def bbox(ids):
    b=[min(S[i]['bbox'][0] for i in ids), min(S[i]['bbox'][1] for i in ids), max(S[i]['bbox'][2] for i in ids), max(S[i]['bbox'][3] for i in ids)]
    return b
def vb(b, pad=0):
    x0=math.floor(b[0]-pad); y0=math.floor(b[1]-pad); x1=math.ceil(b[2]+pad); y1=math.ceil(b[3]+pad)
    return f"{x0} {y0} {x1-x0} {y1-y0}", (x1-x0, y1-y0)
def path(i, attrs=True):
    s=S[i]
    if s['op']=='S':
        return f'<path d="{s["d"]}" fill="none" stroke="{s["stroke"]}" stroke-width="{s["lw"]:g}"/>'
    a = f' data-part="{labels[i]}"' if attrs else ''
    return f'<path{a} fill="{s["fill"]}" d="{s["d"]}"/>'
HEAD='<!-- DEVASTANTE: tracciati estratti 1:1 da "DEVASTANTE LOGO PROP 2.pdf" (Illustrator). Nessuna modifica di forma, colore o proporzioni. -->\n'
wm = [i for i in range(len(S)) if labels[i].split('-')[0] in ('deva','stante','onda','linea','tag')]
mono = [i for i in range(len(S)) if labels[i].startswith('mono')]
for name, ids, title in (('devastante-logo', wm, 'DEVASTANTE · Pizza e smash'), ('devastante-monogramma', mono, 'DEVASTANTE')):
    v,(w,h) = vb(bbox(ids))
    svg = HEAD+f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{v}" width="{w}" height="{h}" role="img" aria-label="{title}"><title>{title}</title>' + ''.join(path(i) for i in ids) + '</svg>\n'
    open(name+'.svg','w').write(svg); print(name, v, len(svg))
# full board, identical to PDF page (including the board separator line)
svg = HEAD+f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}"><rect width="100%" height="100%" fill="#FFFFFF"/>' + ''.join(path(i, False) for i in range(len(S))) + '</svg>\n'
open('devastante-logo-tavola.svg','w').write(svg)
# parts json for the Astro component
json.dump({'wordmark': {'viewBox': vb(bbox(wm))[0], 'parts':[{'id':labels[i],'fill':S[i]['fill'],'d':S[i]['d']} for i in wm]},
           'monogram': {'viewBox': vb(bbox(mono))[0], 'parts':[{'id':labels[i],'fill':S[i]['fill'],'d':S[i]['d']} for i in mono]}},
          open('logo-parts.json','w'))
