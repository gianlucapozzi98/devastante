# IMMAGINI — catalogo e lista degli scatti

**Stato attuale: foto di prova.** Su richiesta, tutti gli spazi foto sono riempiti con **foto d'archivio di Unsplash** (licenza Unsplash: uso commerciale gratuito, attribuzione non obbligatoria) per vedere l'effetto finale. Sul sito **non** compaiono scritte né crediti.

> Attenzione: **non sono foto di DEVASTANTE** né dei suoi prodotti. Prima di mostrare il sito al pubblico spegnere *Impostazioni → Foto di prova* in Keystatic (o mettere `"fotoProva": false` in `src/data/impostazioni.json`): ogni spazio torna al segnaposto "Foto in arrivo". Ogni foto vera caricata in uno spazio prende comunque il posto di quella di prova.

Collegamento spazio → foto: `src/data/foto-prova.json`. Nessuna foto con volti riconoscibili o insegne/marchi di altri locali; gli spazi "foto di famiglia" usano solo mani che impastano.

| File | Soggetto | Fonte (solo per uso interno) |
|---|---|---|
| `assets/foto/prova/tranci-teglia.jpg` | Tranci di pizza in teglia con pomodoro e cipolla | https://unsplash.com/photos/rEz3aG61O_w |
| `assets/foto/prova/focaccia-vassoio.jpg` | Tranci di focaccia su un vassoio | https://unsplash.com/photos/DJLEKfKNjQc |
| `assets/foto/prova/bordo-croccante.jpg` | Il bordo di una pizza con pomodorini, da vicino | https://unsplash.com/photos/brC9jqsAxmU |
| `assets/foto/prova/pizza-margherita.jpg` | Una pizza tonda margherita | https://unsplash.com/photos/Dw43aeVA0VU |
| `assets/foto/prova/focaccia-pomodorini.jpg` | Focaccia con pomodorini e rosmarino | https://unsplash.com/photos/ZRIs5xcMFeE |
| `assets/foto/prova/focaccia-fette.jpg` | Fette di focaccia al rosmarino | https://unsplash.com/photos/c530QV4mDE4 |
| `assets/foto/prova/trancio-pomodori.jpg` | Trancio con pomodori arrostiti | https://unsplash.com/photos/WLbD34w3kRQ |
| `assets/foto/prova/rotella.jpg` | Una rotella che taglia una pizza | https://unsplash.com/photos/mAp0Exihhks |
| `assets/foto/prova/forno-legna.jpg` | Pizze nel forno a legna | https://unsplash.com/photos/uzWpbXFNU6c |
| `assets/foto/prova/fuoco-forno.jpg` | Il fuoco di un forno per pizza | https://unsplash.com/photos/RsiNFKMvqtg |
| `assets/foto/prova/pizze-tavola.jpg` | Pizze su un tavolo, viste dall'alto | https://unsplash.com/photos/T_PbUhfwd0U |
| `assets/foto/prova/sala-sera.jpg` | La sala di un ristorante la sera | https://unsplash.com/photos/wjt5wUNhQgE |
| `assets/foto/prova/smash-doppio.jpg` | Uno smash burger doppio con formaggio e cetrioli | https://unsplash.com/photos/pu6b4yIlQF4 |
| `assets/foto/prova/smash-sesamo.jpg` | Un cheeseburger doppio con pane al sesamo | https://unsplash.com/photos/jh5XyK4Rr3Y |
| `assets/foto/prova/smash-carne.jpg` | Strati di carne schiacciata e formaggio fuso | https://unsplash.com/photos/j1NmLRIlJGI |
| `assets/foto/prova/mani-impasto.jpg` | Mani che impastano | https://unsplash.com/photos/nj-vKBHtFqY |
| `assets/foto/prova/impasto-palla.jpg` | Mani che formano una palla di impasto | https://unsplash.com/photos/2uiZDQYTHBM |
| `assets/foto/prova/impasto-mani.jpg` | Mani che lavorano l'impasto sul banco infarinato | https://unsplash.com/photos/h3tP-D2eABI |
| `assets/foto/prova/lievito-madre.jpg` | Lievito madre in un barattolo di vetro | https://unsplash.com/photos/eWLshlonxtg |
| `assets/foto/prova/impasto-maturo.jpg` | Un impasto lievitato e filante | https://unsplash.com/photos/wERV2r_soCk |
| `assets/foto/prova/panini-sesamo.jpg` | Panini da burger con sesamo | https://unsplash.com/photos/9tPTZuqMsVY |
| `assets/foto/prova/panino-base.jpg` | Un panino su un tagliere | https://unsplash.com/photos/qR8O-dOXH0o |
| `assets/foto/prova/burger-scomposto.jpg` | Gli strati di un burger scomposti in aria | https://unsplash.com/photos/ndNw_6QGR_c |
| `assets/foto/prova/formaggio-fette.jpg` | Fette di formaggio su un tagliere | https://unsplash.com/photos/_L5MGd0w1FQ |
| `assets/foto/prova/bottiglie.jpg` | Bottiglie di vetro in una cassetta gialla | https://unsplash.com/photos/rJPY9L2f_SM |

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
