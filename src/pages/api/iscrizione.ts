import type { APIRoute } from 'astro';

export const prerender = false;

/**
 * Riceve l'iscrizione agli avvisi di apertura e la inoltra a FORM_WEBHOOK_URL (servizio scelto dal titolare).
 * Senza configurazione risponde 503 e NON dichiara l'invio. Nessun dato viene salvato su questo server.
 */
const json = (stato: number, corpo: Record<string, unknown>) =>
  new Response(JSON.stringify(corpo), { status: stato, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' } });

const html = (stato: number, messaggio: string) =>
  new Response(
    `<!doctype html><html lang="it"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>DEVASTANTE</title><body style="font-family:system-ui;padding:2rem;max-width:40rem;margin:auto;background:#F6F1E7"><p>${messaggio}</p><p><a href="/">Torna al sito</a></p></body></html>`,
    { status: stato, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } },
  );

export const POST: APIRoute = async ({ request }) => {
  const vuoleJson = (request.headers.get('accept') ?? '').includes('application/json');
  const rispondi = (stato: number, messaggio: string) => (vuoleJson ? json(stato, { messaggio }) : html(stato, messaggio));
  let dati: FormData;
  try {
    dati = await request.formData();
  } catch {
    return rispondi(400, 'Richiesta non valida.');
  }
  // honeypot: i robot compilano il campo nascosto. Rispondiamo in modo neutro senza inoltrare nulla.
  if (String(dati.get('sito') ?? '').trim() !== '') return rispondi(400, 'Richiesta non valida.');
  const email = String(dati.get('email') ?? '').trim().slice(0, 160);
  const nome = String(dati.get('nome') ?? '').trim().slice(0, 80);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return rispondi(422, 'Indirizzo email non valido.');
  if (dati.get('consensoAvviso') !== 'si') return rispondi(422, 'Serve il consenso per ricevere l\'avviso di apertura.');

  const webhook = process.env.FORM_WEBHOOK_URL ?? import.meta.env.FORM_WEBHOOK_URL;
  if (!webhook) {
    return rispondi(503, 'Il modulo non è ancora attivo: la tua richiesta NON è stata inviata. Riprova più avanti.');
  }
  const record = {
    tipo: 'avviso-apertura',
    email,
    nome: nome || null,
    consensoAvviso: true,
    consensoNewsletter: dati.get('consensoNewsletter') === 'si',
    data: new Date().toISOString(),
    versioneInformativa: 'bozza-1',
  };
  try {
    const r = await fetch(webhook, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(record), signal: AbortSignal.timeout(8000) });
    if (!r.ok) throw new Error(String(r.status));
  } catch {
    return rispondi(502, 'Il servizio di iscrizione non ha risposto: la richiesta NON è stata registrata. Riprova più tardi.');
  }
  return rispondi(200, 'Fatto: ti scriviamo quando apriamo.');
};

export const ALL: APIRoute = () => json(405, { messaggio: 'Metodo non consentito.' });
