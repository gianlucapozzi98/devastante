# CONCEPT — DEVASTANTE · Pizza e Smash

Documento di lavoro dell'art direction. Fonte unica dei fatti: `DIREZIONE-ARTISTICA-DEVASTANTE.md`.
Data analisi: 23 novembre 2026. Browser: pannello integrato (Chromium), viewport 1440×900.

---

## 1. Analisi dei riferimenti (meccaniche reali osservate)

### 1.1 Savor — https://www.savor.it/

**Stack visto nel codice caricato dalla pagina**
- App **Vue + Vite** (stato iniziale Pinia in `window.__INITIAL_STATE__`), contenuti da **Sanity** (immagini e video da `cdn.sanity.io`).
- Bundle principale (`app-*.js`, ~1,1 MB): stringhe **gsap** (114 occorrenze), **ScrollTrigger** (10), **SplitText** (5), **Flip** (7), un riferimento a **DrawSVG**; **Lenis** (classe `lenis` su `<html>`, opzioni di default `lerp: 0.1`, `smoothWheel: true`, `syncTouch: false`); shader **WebGL** propri (`gl_FragColor`, uniform), cinque `<canvas>` in pagina.
- Easing più usati nel JS: `power2.out`, `sine.out`, `quad.out`, `circ.out`, `power4.out`; durate ricorrenti 0,8 s · 1,5 s · 2,2 s · 2,5 s. Nel CSS: `cubic-bezier(0,0,0,1)` (uscita molto morbida, tipo expo-out).
- Tag di Google Analytics/GTM caricati subito (da **non** riprodurre: da noi niente script prima del consenso).

**Struttura e meccaniche osservate (home, 16.663 px di altezza a 1440×900)**
1. `HeroVideo` (100vh): video macro in loop, muto, autoplay (~30 s, file .mov) con poster WebP, titolo serif enorme in basso a sinistra, testo breve a destra, link "Watch Episode".
2. `StoryCanvasDesktop` (**9.000 px**, cioè 10 schermate) con un blocco **sticky** alto 100vh e un canvas WebGL: le immagini a tutto schermo si susseguono mentre si scorre; una **forma organica color crema** ("bubble") entra come una maschera curva e copre l'immagine; piccole "stazioni" di testo sono collegate da una **linea sottile disegnata con lo scroll** (prima dritta, poi curva, poi tratteggiata): "From butter —— to palm oil", una colonna "Without / animals / hormones / …", la parola **"more" ripetuta cinque volte** in colonna prima di "of the foods we love" (ritmo tipografico).
3. `EntrypointVertical` (3.870 px): **colonna di foto sfalsate a scala** (due corsie, alcune immagini sovrapposte) che scorre a velocità diverse, con un titolo serif grande a destra ("Real fats, real flavor").
4. `BannerFullbleed` (1.980 px) con blocco sticky: foto a tutta pagina che resta ferma mentre il contenuto scorre.
5. Rassegna stampa, footer con newsletter.
- Errore visibile nel testo: "undefined null" (titolo vuoto del CMS).

**Cosa non ho potuto vedere**: la logica esatta degli shader (minificati), le curve di scroll per ogni scena, il comportamento su touch reale, il caricatore `BubbleLoader` (shader, si vede solo il codice), l'audio.

### 1.2 Aupale Vodka — https://www.aupalevodka.com/en/

**Stack visto nel codice**
- **Astro v5.15.9** (meta generator), componenti come **custom element** (`c-hero`, `c-story`, `c-story-chapter`, `c-cartography`, `c-triptych`, `c-bottle`, `c-product-modal`).
- Transizioni di pagina con **Swup** (`swup-enabled`, contenitore `#swup.transition-fade`).
- Scroll fluido **Lenis** (classe `lenis` + attributi `data-scroll` / `data-scroll-speed` per la parallasse, tipici di Locomotive Scroll v5 — il footer cita Locomotive).
- Animazioni con **anime.js v4** (moduli `animation`, `timeline`, `stagger`, `split`, `scroll`): per esempio il video della bottiglia passa da `scale .9 → 1` e da clip-path "chiuso → aperto" con `ease inOut(2)` sincronizzato allo scroll (`enter: "bottom top+=100", leave: "top top", sync: true`).
- **OGL** (WebGL leggero) nel bundle; CMS **Storyblok**. Easing CSS: `cubic-bezier(.4,0,.2,1)` e `cubic-bezier(.645,.045,.355,1)`.
- Google Analytics caricato prima di qualunque consenso (da **non** riprodurre).

**Struttura e meccaniche osservate (18.217 px)**
1. **Verifica dell'età** a schermo intero (modale). Per analizzare il resto ho **nascosto la modale via script** senza rispondere: non ho dichiarato nulla per conto dell'utente.
2. Hero 100dvh con il film ("Watch the film (play) 2 min 26 s").
3. `#philosophy` → `c-story` alto **5.400 px**: capitoli sovrapposti (`position: absolute`) che si alternano; frase serif grande centrata con parole in corsivo ("We go back to *basics*, only *real* ingredients."), **una piccola card video arrotondata** messa di lato, didascalie in monospace maiuscolo; sullo sfondo una **mappa a curve di livello** SVG (`#west`, `#east`) sticky che si disegna e si sposta.
4. `c-triptych`: frase dentro una **capsula** (forma a pillola) su fondo chiaro, con note in monospace ai lati.
5. `#the-bottle` (3.474 px): **anatomia della bottiglia** — la bottiglia resta fissa mentre a sinistra cambiano le schede "THE NAME / Aupale", "THE BOTTLE / Modern Classic", …
6. `#vodka`, `#seltzers`, `#mocktails`: catalogo con card immagine e **modale di dettaglio** (`c-product-modal`) con pannello e chiusura.
7. Navigazione a **ancore** (Philosophy, The Bottle, Vodka, Seltzers, …) su un'unica pagina lunga.

**Cosa non ho potuto vedere**: l'hero e i video dopo la verifica dell'età (non ho risposto alla modale), la transizione Swup in uso reale, il film, le schede aperte, l'animazione della mappa nel dettaglio, il comportamento mobile reale.

### 1.3 Cosa prendiamo (meccanica, non contenuto)

| Meccanica osservata | Come diventa DEVASTANTE |
|---|---|
| Linea sottile che collega le "stazioni" di testo (Savor) | **La pennellata rossa** che corre lungo la storia e la **rotella** che la traccia |
| Parola ripetuta in colonna ("more ×5", Savor) | "tempo / tempo / tempo / tempo" → "Più di due giorni." (capitolo 6) |
| Blocco sticky con scene che si alternano (Savor, Aupale) | Capitoli "fissati" in cui una sola cosa si muove: il taglio, la saracinesca, lo smash |
| Colonna di foto sfalsate (Savor) | Strisce di foto degli anni di TABISCA (capitolo 2), che si muovono con la velocità dello scroll |
| Frase serif centrata + card video piccola (Aupale) | Frase in display morbido + **finestra foto** a forma di trancio |
| Anatomia della bottiglia con schede (Aupale) | **Anatomia dello smash** con strati da confermare |
| Catalogo con modale di dettaglio (Aupale) | **Menu a teglia**: tranci che si aprono in un pannello |
| Pagina lunga con ancore (Aupale) | Indice dei capitoli cliccabile sull'indicatore di progresso |
| Transizioni di pagina (Swup) | Astro View Transitions + **pennellata rossa** che attraversa lo schermo |

Non riproduciamo testi, immagini, video, codice, colori o identità dei due siti.

---

## 2. Tre concept

Valutazione 1–5 (5 = migliore; per il **peso**, 5 = più leggero).

### Concept A — "Un trancio alla volta" ✅ scelto

**Idea.** La pagina **è la teglia dei nonni**. Si scorre e la **rotella** taglia: ogni capitolo è un trancio servito. La rotella è anche l'indicatore di progresso: corre lungo il bordo della pagina e lascia dietro di sé **la pennellata rossa del logo**. Il filo rosso è il taglio. Il finale lascia nella teglia un trancio "per te": *Vieni a casa*.

- **Apertura**: la pennellata del logo si dipinge (maschera a pennello), DEVA e STANTE cadono con l'ondeggiamento delle lettere disegnate, "PIZZA E SMASH" chiude con le due linee ondulate. 1,1 s, saltabile, solo alla prima visita della sessione.
- **Hero**: il logo vero, grande; "La teglia dei nonni, di nuovo qui."; **una sola scena WebGL**: una **pennellata liquida rossa** (salsa stesa col cucchiaio) che scorre dietro al titolo e si piega al passaggio del mouse/dito. Dal basso spunta il bordo della teglia.
- **Un "wow" per capitolo**: 1999 la teglia viene tagliata e un trancio si alza · TABISCA strisce di foto · 2016 la **teglia diventa tonda** (MorphSVG rettangolo → cerchio) · il ricordo: **fermo**, la pennellata si interrompe · due vetrine: **la saracinesca si alza** (a metà se "Presto in apertura") · la teglia: **LIEVITA cresce** come un impasto, con le ore che salgono · lo smash: la parola **SMASH schiacciata** dalla spatola · vieni a casa: la pennellata finisce dentro **Ordina**.

| Impatto | Realismo | Fattibilità | Peso |
|---|---|---|---|
| 5 | 5 — tutto grafico finché non arrivano le foto vere; zero cibo finto | 4 | 4 (1 canvas, SVG, GSAP) |

### Concept B — "Le due vetrine"

**Idea.** Tutto il sito è il nuovo localino visto dalla strada: **due vetrine** affiancate. Sinistra = ieri (TABISCA, la teglia, carta, bianco e nero), destra = oggi (smash, rosso, piastra). Le due colonne scorrono in **direzioni opposte**; al capitolo "Due vetrine" si uniscono in una sola. Il logo è una vetrofania.

| Impatto | Realismo | Fattibilità | Peso |
|---|---|---|---|
| 5 | 4 | 2 — lo split a scorrimento opposto è fragile a 360 px e con lettori di schermo | 3 (doppie immagini) |

Teniamo l'idea **dentro** il concept A: è il "wow" del capitolo 5 (saracinesca + due vetrine).

### Concept C — "La salsa"

**Idea.** Un nastro rosso liquido in WebGL attraversa **tutta** la pagina come salsa stesa sulla teglia; i capitoli sono stazioni lungo il nastro (alla Savor).

| Impatto | Realismo | Fattibilità | Peso |
|---|---|---|---|
| 4 | 4 | 3 | 2 — WebGL a tutta pagina per tutta la storia: rischio su telefoni medi e per Lighthouse ≥ 90 |

Teniamo la salsa liquida **solo nell'hero** (l'unico effetto WebGL), con fallback SVG.

### Scelta

**A — "Un trancio alla volta"**, con la vetrina di B nel capitolo 5 e la salsa di C nell'hero. Motivo: è l'unico concept in cui **ogni meccanica viene dal mestiere** (teglia, rotella, saracinesca, spatola) e dal logo (la pennellata), funziona senza foto finte, si legge anche senza movimento e resta leggero.

---

## 3. Regole che il concept rispetta (dai FISSO)

- **Logo**: SVG estratto 1:1 dai tracciati del PDF (nessun ritocco). Le animazioni muovono i pezzi (trasformazioni, maschere) ma la forma finale è identica. Il monogramma "DE" per favicon, loader e dettagli.
- **Cibo**: solo foto e video veri del cliente. **In questa versione non c'è nessuna foto**: ogni finestra foto mostra un **segnaposto dichiarato** ("Foto in arrivo" + descrizione dello scatto da fare). Nessuno stock per i prodotti; nessuna illustrazione di cibo; nessuna AI.
- **Ricordo**: capitolo quasi fermo, nessuna data di morte, nessun nome senza consenso, nessun effetto legato alla scomparsa. La pennellata **si ferma** e basta.
- **Prestazioni**: solo transform, opacity, clip-path; un solo canvas WebGL in pausa fuori schermo; `prefers-reduced-motion` = niente loader, niente Lenis, niente scrub: la storia è testo e immagini in ordine.
- **Una sola azione principale**: Ordina (nav, hero, chiusura).

## 4. Sistema (sintesi)

- **Colori misurati dal PDF**: rosso `#E30613` (`0.89 0.024 0.075 rg`), nero `#000000` (`0 g`). Fondo carta `#F6F1E7`, teglia `#9C9A96`, cenere `#3A3836`, formaggio `#F2C14E` (solo smash, accento).
  - Contrasti: bianco su rosso 4,9:1 ✔ (pulsanti); rosso su carta 4,3:1 → **solo testo grande** (≥ 24 px o ≥ 19 px bold); nero su carta 18:1.
- **Caratteri**: *Bagel Fat One* (OFL) per i titoli — grassetto morbido e un po' irregolare, parente delle lettere del logo; *Figtree* variabile (OFL) per il testo. Self-hosted, solo latino.
- **Curve e durate uniche**: `--ease-out: cubic-bezier(.16,1,.3,1)` (GSAP `expo.out` equivalente "morbido"), `--ease-io: cubic-bezier(.65,0,.35,1)`, rimbalzo morbido solo per le lettere (`back.out(1.6)`); durate 0,18 s (micro) · 0,45 s (UI) · 0,9 s (scene) · 1,1 s (apertura).
- **Rotella**: icona grafica (cerchio + raggi + manico) che segna il progresso; non è cibo.
