# Minimal, lossless PDF content-stream -> SVG converter for the DEVASTANTE logo.
# Handles only what this file contains: q/Q/cm, m/l/c/v/y/h/re, f/f*/S/n, W/W*, rg/RG/g/G, gs, BDC/EMC.
import re, json, sys
H = 2119.396  # MediaBox height (PDF y-up -> SVG y-down)
tok_re = re.compile(rb'/[^\s/\[\]<>()]+|-?\d*\.?\d+|[A-Za-z*\'"]+|\[|\]|<<|>>')
def mul(a,b):
    return [a[0]*b[0]+a[1]*b[2], a[0]*b[1]+a[1]*b[3], a[2]*b[0]+a[3]*b[2], a[2]*b[1]+a[3]*b[3], a[4]*b[0]+a[5]*b[2]+b[4], a[4]*b[1]+a[5]*b[3]+b[5]]
def fmt(v):
    s = f"{v:.3f}".rstrip('0').rstrip('.')
    return '0' if s in ('-0','') else s
def color(rgb):
    return '#%02X%02X%02X' % tuple(round(c*255) for c in rgb)
shapes = []
data = b'\n'.join(open(f'stream{n}.txt','rb').read() for n in range(7,15))
n=0
if True:
    toks = tok_re.findall(data)
    st = []; ctm=[1,0,0,1,0,0]; fill=(0,0,0); stroke=(0,0,0); lw=1
    ops=[]; path=[]; pts=[]
    def T(x,y):
        X = ctm[0]*x+ctm[2]*y+ctm[4]; Y = ctm[1]*x+ctm[3]*y+ctm[5]
        Y = H - Y
        pts.append((X,Y)); return fmt(X)+' '+fmt(Y)
    cur=(0,0)
    for t in toks:
        try:
            ops.append(float(t)); continue
        except ValueError: pass
        s = t.decode()
        if s.startswith('/') or s in ('[',']','<<','>>'):
            ops.append(s); continue
        o = s; a = ops; ops=[]
        if o=='q': st.append((ctm[:],fill,stroke,lw))
        elif o=='Q': ctm,fill,stroke,lw = st.pop(); ctm=ctm[:]
        elif o=='cm': ctm = mul(a[-6:], ctm)
        elif o=='m': path.append('M'+T(a[0],a[1])); cur=(a[0],a[1])
        elif o=='l': path.append('L'+T(a[0],a[1])); cur=(a[0],a[1])
        elif o=='c': path.append('C'+T(a[0],a[1])+' '+T(a[2],a[3])+' '+T(a[4],a[5])); cur=(a[4],a[5])
        elif o=='v': path.append('C'+T(*cur)+' '+T(a[0],a[1])+' '+T(a[2],a[3])); cur=(a[2],a[3])
        elif o=='y': path.append('C'+T(a[0],a[1])+' '+T(a[2],a[3])+' '+T(a[2],a[3])); cur=(a[2],a[3])
        elif o=='h': path.append('Z')
        elif o=='re':
            x,y,w,h_=a[-4:]; path.append('M'+T(x,y)+'L'+T(x+w,y)+'L'+T(x+w,y+h_)+'L'+T(x,y+h_)+'Z')
        elif o in ('f','F','f*','S','n'):
            if o!='n' and path:
                xs=[p[0] for p in pts]; ys=[p[1] for p in pts]
                shapes.append(dict(stream=n, op=o, d=''.join(path), fill=color(fill), stroke=color(stroke), lw=lw,
                                   bbox=[min(xs),min(ys),max(xs),max(ys)]))
            path=[]; pts=[]
        elif o in ('W','W*'): pass
        elif o=='rg': fill=tuple(a[-3:])
        elif o=='RG': stroke=tuple(a[-3:])
        elif o=='g': fill=(a[-1],)*3
        elif o=='G': stroke=(a[-1],)*3
        elif o=='w': lw=a[-1]
        elif o in ('gs','BDC','EMC','BMC'): pass
        else: print('UNHANDLED', o, file=sys.stderr)
json.dump(shapes, open('shapes.json','w'))
for i,s in enumerate(shapes):
    print(i, s['stream'], s['op'], s['fill'], [round(v) for v in s['bbox']], len(s['d']))
