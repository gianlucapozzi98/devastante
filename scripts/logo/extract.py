import re, zlib, sys
data = open(sys.argv[1],'rb').read()
# find objects
objs = {}
for m in re.finditer(rb'(\d+) 0 obj\s*(.*?)endobj', data, re.S):
    objs[int(m.group(1))] = m.group(2)
for n in range(7,15):
    o = objs[n]
    sm = re.search(rb'stream\r?\n(.*?)\r?\nendstream', o, re.S)
    raw = sm.group(1)
    try:
        dec = zlib.decompress(raw)
    except Exception as e:
        dec = zlib.decompressobj().decompress(raw)
    open(f'stream{n}.txt','wb').write(dec)
    print(n, len(dec))
for n in (15,16):
    print(n, objs[n][:300])
