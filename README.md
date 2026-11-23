# DEVASTANTE · Pizza e smash — sito

Sito a capitoli per DEVASTANTE (Cesano Boscone): pizza in teglia e smash burger, nato in memoria dei nonni, erede di TABISCA.
Concept scelto: **"Un trancio alla volta"** — la pagina è la teglia dei nonni, la rotella taglia un capitolo alla volta e lascia la pennellata rossa del logo. Analisi dei riferimenti e i tre concept valutati: [`CONCEPT.md`](CONCEPT.md).

> Il brief del cliente (`DIREZIONE-ARTISTICA-DEVASTANTE.md`) e il PDF originale del logo **non sono nel repository** (che è pubblico): restano solo in locale.

> Stato: **versione completa da validare**. Nessuna foto vera ancora disponibile: al loro posto ci sono segnaposto dichiarati. Tutti i dati mancanti compaiono come **[… da confermare]** in giallo a righe.

---

## 1. Avvio

Node.js ≥ 22.23 (installato in questo computer in `~/.local/node`, versione 24.22.3 LTS).

```bash
export PATH="$HOME/.local/node/bin:$PATH"
```

```bash
npm install
```

```bash
npm run dev
```

Porta 4321. Se Astro 7 lo avvia in background (succede fuori da un terminale interattivo): `npx astro dev stop` per fermarlo, `npx astro dev logs` per i log.

```bash
npm run build
```

```bash
HOST=127.0.0.1 PORT=4322 node ./dist/server/entry.mjs
```

Altri comandi: `npm run check` (tipi), `npm run logo:verify` (logo identico al PDF; serve `DEVASTANTE LOGO PROP 2.pdf` nella cartella del progetto), `npm run links:check` (link interni della build), `node scripts/genera-icone.mjs` (favicon, icone, og.png).

## 2. Struttura

```
src/
  pages/            index (la storia) · menu · smash · la-storia · dove-siamo · allergeni
                    privacy · cookie · termini · accessibilita · 404 · robots.txt · api/iscrizione
  components/story/ Hero + 8 capitoli (Cap1999, CapTabisca, Cap2016, CapRicordo, CapOggi, CapTeglia, CapSmash, CapCasa)
  components/ui/    Nav, Footer, CookieBanner, Progresso (rotella), Foto, AvvisiForm, DaConfermare, TestaPagina
  components/brand/ Logo (tracciati originali), Rotella
  scripts/          app (Lenis + GSAP + ciclo pagine), loader, transitions, cursor, sound, consent, progress, menu, timeline…
  scripts/story/    un modulo per capitolo + heroGl (unico effetto WebGL, OGL)
  content/          capitoli, menu, offerte, faq (YAML, gestiti da Keystatic)
  data/             impostazioni, orari, azienda, smash (JSON, gestiti da Keystatic) · logo-parts.json
  styles/global.css design system (token, curve, durate, pulsanti a morso)
assets/foto/        qui vanno le foto vere (vedi IMMAGINI.md)
public/brand/       logo SVG: wordmark, monogramma, tavola completa
scripts/            verify-logo, check-links, genera-icone, logo/ (estrazione dal PDF)
docs/               anteprime e screenshot di verifica
```

### Cosa succede, capitolo per capitolo (un solo "wow" ciascuno)

| | Capitolo | Wow |
|---|---|---|
| — | Apertura | La pennellata del logo si dipinge, DEVA scende, STANTE sale, la rotella taglia la carta (≤ 1,1 s, saltabile, solo prima visita) |
| — | Hero | Logo vero + pennellata liquida WebGL che si piega verso il puntatore (mai sopra il logo); fallback SVG |
| 1 | 1999 · La teglia | La rotella taglia la teglia e il trancio del 1999 si alza |
| 2 | Gli anni di TABISCA | Album in due strisce opposte che si inclinano con la velocità dello scroll |
| 3 | 2016 · Il passaggio | La teglia diventa tonda (MorphSVG); resta il contorno della teglia |
| 4 | Il ricordo | **Niente**: una frase, dissolvenza lenta, la pennellata di progresso si ferma |
| 5 | Oggi · Due vetrine | La saracinesca si alza; con "Presto in apertura" si ferma a metà e scende il cartello |
| 6 | La teglia | LIEVITA cresce come un impasto mentre le ore salgono a "più di due giorni" |
| 7 | Lo smash | La spatola scende e SMASH si schiaccia (sfrigolio se il suono è acceso) |
| 8 | Vieni a casa | La pennellata arriva fino a "Ordina"; avvisi di apertura |

Pagine: **Menu** (teglia a griglia, filtri con Flip, schede in pannello laterale), **Smash** (anatomia a strati, "tieni premuto per schiacciare"), **La storia** (linea del tempo con tappe, frecce da tastiera e rotella trascinabile; spazio per il film), **Dove siamo** (indirizzo, orari, mappa su consenso, 3 passi per ordinare, FAQ).

Microinterazioni con le stesse curve e durate (`--ease-out`, `--ease-io`, 0,18 / 0,45 / 0,9 s): cursore a sfera rossa (solo desktop, il cursore di sistema resta), logo che ondeggia, pulsanti "a morso", filtri, feedback del modulo, suono **spento di default**.

## 3. Pannello contenuti (Keystatic, in italiano)

`/keystatic` — Impostazioni e apertura · Orari · Dati societari · Capitoli · Menu · Anatomia dello smash · Offerte · FAQ.

- In sviluppo funziona in **locale** (salva i file nel progetto).
- In produzione usa la **modalità GitHub**: creare il repository, impostare `PUBLIC_KEYSTATIC_GITHUB_REPO=proprietario/repo` e seguire la procedura di Keystatic per la GitHub App (`KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`, `KEYSTATIC_SECRET`, `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG`). Vedi `.env.example`.
- **Flag "Presto in apertura"** (Impostazioni): attivo di default. Con il flag attivo il sito non dice mai "aperto": bollino nell'hero, saracinesca a metà con cartello, "Presto in apertura" nel footer e nelle FAQ, modulo avvisi visibile. Disattivarlo **solo** all'apertura reale.
- Quando il telefono è inserito e il flag è spento, "Ordina" diventa un link `tel:`; finché no, porta a "Come ordinare".

## 4. Pubblicazione

- **Vercel** (https://devastante.vercel.app): quando la build gira su Vercel si usa da solo l'adattatore `@astrojs/vercel` (pagine statiche + funzioni per `/api/iscrizione` e Keystatic). Il dominio di canonical e sitemap è quello di produzione del progetto, finché non si imposta `SITE_URL`. Variabili da impostare in *Project Settings → Environment Variables*: `FORM_WEBHOOK_URL`, `SITE_URL` (con il dominio definitivo) e quelle di Keystatic.
- **Server proprio / locale**: adattatore `@astrojs/node` (standalone); le pagine statiche sono in `dist/client`, solo `/keystatic`, `/api/keystatic` e `/api/iscrizione` girano sul server.
- Variabili: `SITE_URL` (dominio definitivo: oggi è il segnaposto `https://devastante.example`), `FORM_WEBHOOK_URL` (servizio che riceve le iscrizioni: CRM, n8n, Make, servizio email…). Senza webhook il modulo risponde **"Il modulo non è ancora attivo: la tua richiesta NON è stata inviata"**.
- Reindirizzamenti da fare sull'hosting: `http → https` e una sola versione tra `www` e senza `www` (301). Esempio nginx:

```nginx
server { listen 80; server_name dominio.it www.dominio.it; return 301 https://www.dominio.it$request_uri; }
```

## 5. Verifica eseguita (23/11/2026)

| Controllo | Esito |
|---|---|
| `astro check` + `astro build` | 0 errori, 0 avvisi; build pulita |
| Logo | `npm run logo:verify`: SVG sovrapposto al PDF, nessuna differenza oltre 2 px di antialiasing; colori `#E30613` e `#000000` come nel PDF |
| Lighthouse mobile (localhost, Chrome headless) | Home: **Performance 100 · Accessibilità 100 · Best practices 100 · SEO 100**, LCP 1,3 s, TBT 20 ms, CLS 0,013. Menu, Smash, La storia, Dove siamo, Allergeni, Privacy, Cookie, Termini, Accessibilità: 100/100/100/100 |
| Screenshot 1440 e 390 px | `docs/screenshot/animato/` (un fotogramma per capitolo) e `docs/screenshot/ridotto/` (pagine intere) |
| Movimento ridotto | Niente apertura, niente Lenis, niente scrub: tutti i testi visibili e la storia completa (pagine intere in `docs/screenshot/ridotto/`) |
| Nessuno scorrimento orizzontale | Verificato a 1440 e 390 su home, menu, smash, la storia, dove siamo, allergeni, privacy e 404 |
| Tracciamento prima del consenso | Al primo caricamento solo richieste allo stesso dominio, nessun iframe; la mappa si crea solo dopo il consenso "Mappe" |
| Banner cookie | Accetta / Rifiuta / Personalizza, X = rifiuto, "Preferenze cookie" nel footer, nuova richiesta dopo 6 mesi |
| Link | `npm run links:check`: nessun link interno o ancora rotta; unico link esterno: garanteprivacy.it (risponde 200) |
| Modulo avvisi | Con webhook di prova: invio reale ricevuto (consensi separati registrati); honeypot bloccato (400); email errata e consenso mancante (422); senza JavaScript funziona; senza webhook risponde 503 e lo dice |
| Tastiera | Menu: filtri e schede (Esc chiude, il focus torna al trancio); La storia: frecce/Home/Fine sulle tappe; gesto smash con spazio/Invio; "Vai al contenuto" |
| Transizioni | Navigazione con View Transitions di Astro + pennellata MorphSVG; gli script si reinizializzano sulla nuova pagina |

**Non verificato**: prestazioni su una rete 4G reale e su telefoni fisici (solo emulazione a 390 px e misure Lighthouse su localhost); comportamento con un vero lettore di schermo (VoiceOver/NVDA); Lighthouse sul dominio di produzione.

## 6. Cosa serve ancora dal cliente

1. **Indirizzo e data di apertura** del localino (è già aperto o in apertura?), telefono, WhatsApp, email, orari e giorno di chiusura; cosa significa "che avremo di fronte".
2. **Logo definitivo** in vettoriale: il PDF si chiama "PROP 2". È la versione finale? Chi l'ha disegnato, cessione dei diritti, marchio registrato o registrabile? Per sostituirlo: rieseguire `scripts/logo/` sul nuovo PDF (un solo punto di sostituzione: `public/brand/` + `src/data/logo-parts.json`).
3. **Foto e video veri** (lista completa in `IMMAGINI.md`): teglia, tranci, smash, locale, team, video macro del taglio; foto d'epoca di TABISCA e dei nonni **solo con il consenso della famiglia**.
4. **Menu**: tranci, smash, bevande, prezzi IVA inclusa (al trancio o al peso con prezzo al kg?), ingredienti e **allergeni** per ogni prodotto, contaminazioni crociate; tipo e origine della carne.
5. **Storia**: conferma di date (1999, 2016) e fatti; nomi di nonni e zio (e se pubblicarli), nome del titolare, quando si è fermato il trancio, citazioni del titolare con permesso, cosa evitare.
6. **Dati societari**: ragione sociale e forma, sede legale, C.F., P.IVA, REA, capitale sociale (se società di capitali), PEC; relazione con la società di TABISCA.
7. **Modalità di ordine**: telefono, WhatsApp, app di consegna, asporto, pagamenti; testi delle condizioni di ordine/asporto.
8. **Social** ufficiali (URL), **dominio** definitivo, **hosting**, servizio per ricevere le iscrizioni (webhook) e per inviare l'email di apertura.
9. **Lievito madre e tempi**: conferma che è l'unico/prevalente agente lievitante e dei tempi reali ("più di due giorni").

## 7. Testi legali e claim: tutto da validare

- **Bozze da far validare** a un consulente: `privacy` (art. 13 GDPR), `cookie` (Linee guida Garante 2021), `termini` (la parte su ordini e asporto è vuota finché il titolare non fornisce i testi), `accessibilita`, `allergeni` (Reg. UE 1169/2011).
- **Claim del titolare usati come bozza** (da validare, nessuna promessa sanitaria — Reg. CE 1924/2006): "lievito madre", "più di due giorni tra lievitazione e maturazione", "pensata per essere leggera", "carne selezionata" (§8 del documento di direzione). **Non usati**: "digeribile", "altamente digeribile", "carne di qualità eccelsa", confronti ("l'unico", "nessuno in zona").
- Testi dei capitoli: scritti solo con i fatti del documento di direzione; vanno riletti dal titolare (soprattutto "Il ricordo").
- Nessun punteggio di recensioni, nessuna dichiarazione "aperto", nessun dato di TABISCA preso da fonti di terzi.

## 8. Limiti e scelte dichiarate

- **Zero stock**: il documento ammette stock "provvisorio" solo per non-prodotti; si è scelto di non usarne per evitare che una foto qualsiasi sembri il locale. Il sito regge sulla grafica (logo, pennellata, teglia, tipografia) finché non arrivano le foto.
- Hero: il video macro previsto dallo spunto è pronto a essere aggiunto quando esiste (oggi la scena è grafica). Il film della storia ha il suo spazio in `/la-storia`.
- "Componi il tuo smash" non è stato fatto: il menu non conferma varianti.
- Statistiche: nessuno strumento attivo; la categoria esiste già nel banner.
- I suoni sono sintetizzati (Web Audio), nessun file.
