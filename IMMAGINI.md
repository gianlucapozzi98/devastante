# IMMAGINI — catalogo e lista degli scatti

**Stato attuale: nessuna foto nel sito.** Tutte le finestre foto mostrano un segnaposto dichiarato ("Foto in arrivo · …"). Non è stato usato **nessuno stock**, nessuna illustrazione di cibo, nessuna immagine generata con AI.

## Dove mettere le foto

1. Copiare i file originali in `assets/foto/` (JPG/PNG/WebP, lato lungo almeno 2400 px).
2. Collegarli dal pannello **Keystatic** (`/keystatic`) nei campi "Foto" di capitoli, menu e anatomia dello smash, oppure scrivere il nome del file nel campo `foto` dei file in `src/content/` e `src/data/`.
3. In build `sharp` crea AVIF e WebP alle larghezze 480/800/1200/1600 (componente `src/components/ui/Foto.astro`).

Ritocco ammesso: **solo nitidezza, esposizione, rumore**. Le foto d'epoca e quelle con persone vanno pubblicate solo con il consenso (campo "Consenso" in Keystatic; il capitolo "Il ricordo" mostra una foto **solo** se il consenso è spuntato).

## Scatti richiesti (dove compaiono)

| # | Scatto | Dove | Note |
|---|---|---|---|
| 1 | Video macro: un trancio tagliato con la rotella, formaggio che fila, vapore (6–10 s, loop) | Hero (sostituibile alla pennellata come sfondo, poster AVIF) | Luce calda, 4K → esportare ≤ 6 MB H.264 + AV1 |
| 2 | La teglia appena sfornata, dall'alto | Capitolo 1, teglia | |
| 3 | Foto d'epoca di TABISCA (insegna, banco, forno, sala, vetrina, teglie in fila) | Capitolo 2, strisce; La storia | **Solo se le dà la famiglia**, con diritti |
| 4 | Foto di famiglia | Capitolo 2; La storia | **Solo con consenso** della famiglia e delle persone ritratte |
| 5 | Il taglio con la rotella, macro | Capitolo 1 | |
| 6 | Il bordo croccante di un trancio, macro | Capitolo 1 | |
| 7 | La pizza tonda di TABISCA e il suo impasto | La storia, tappa 2016 | Se esistono foto dell'epoca |
| 8 | Le due vetrine, da fuori (giorno e sera) | Capitolo 5; La storia | Quando il locale è pronto |
| 9 | Il banco di oggi | La storia, tappa Oggi | |
| 10 | Il lievito madre, macro | Capitolo 6 | |
| 11 | L'impasto steso nella teglia | Capitolo 6 | Possibile fotosequenza della lievitazione (12–24 foto, stessa inquadratura) |
| 12 | Gli strati dello smash, uno per foto, su fondo neutro | Pagina Smash, anatomia | Solo ingredienti reali del menu |
| 13 | Il gesto dello smash sulla piastra (video 3–5 s) | Capitolo 7 / pagina Smash | Facoltativo |
| 14 | Una foto per ogni prodotto del menu | Menu, schede prodotto | Stessa luce e stessa angolazione per tutti |
| 15 | Foto verticale/orizzontale per Open Graph (1200×630) | Condivisioni social | Sostituisce `public/og.png` (oggi: solo logo) |
| 16 | Materiale per il "film della storia" (60–90 s) | La storia | Montaggio solo con foto e video veri |

## Grafiche presenti (non sono foto)

| File / elemento | Cos'è | Origine |
|---|---|---|
| `public/brand/devastante-logo.svg`, `devastante-monogramma.svg`, `devastante-logo-tavola.svg` | Logo e monogramma | Tracciati estratti 1:1 dal PDF del cliente |
| Pennellata rossa dell'hero (WebGL, fallback SVG) | Grafica astratta color #E30613 | Disegnata nel codice |
| Teglia, rotella, saracinesca, spatola, forme del 2016 | Grafiche geometriche, non cibo | Disegnate nel codice |
| `public/og.png`, favicon e icone | Logo e monogramma su fondo chiaro | Generati da `scripts/genera-icone.mjs` |
