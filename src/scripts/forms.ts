import { gsap } from 'gsap';
import { suona } from './sound';

/**
 * Modulo avvisi: validazione accessibile, honeypot, invio reale. Mai "inviato" se il server non conferma.
 */
export default function modulo(el: HTMLElement) {
  const form = el as HTMLFormElement;
  const esito = form.querySelector<HTMLElement>('[data-esito]')!;
  const btn = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;
  const etichetta = btn.querySelector('[data-etichetta]')!;
  const mostraErrore = (nome: string, on: boolean) => {
    const campo = form.querySelector<HTMLInputElement>(`[name="${nome}"]`);
    const msg = form.querySelector<HTMLElement>(`[data-errore="${nome}"]`);
    campo?.setAttribute('aria-invalid', String(on));
    if (msg) msg.hidden = !on;
  };
  const scrivi = (testo: string, tipo: 'ok' | 'errore' | '') => {
    esito.textContent = testo;
    esito.dataset.tipo = tipo;
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const dati = new FormData(form);
    const email = String(dati.get('email') ?? '').trim();
    const okEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
    const okCons = dati.get('consensoAvviso') === 'si';
    mostraErrore('email', !okEmail);
    mostraErrore('consensoAvviso', !okCons);
    if (!okEmail || !okCons) {
      scrivi('Controlla i campi evidenziati.', 'errore');
      form.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
      gsap.fromTo(form, { x: -6 }, { x: 0, duration: 0.4, ease: 'elastic.out(1, 0.3)' });
      return;
    }
    btn.setAttribute('aria-busy', 'true');
    etichetta.textContent = 'Invio in corso…';
    scrivi('', '');
    try {
      const r = await fetch(form.action, { method: 'POST', body: dati, headers: { Accept: 'application/json' } });
      const j = (await r.json().catch(() => ({}))) as { messaggio?: string };
      if (r.ok) {
        scrivi(j.messaggio ?? 'Fatto: ti scriviamo quando apriamo.', 'ok');
        form.reset();
        suona('morso', 0.7);
      } else {
        scrivi(j.messaggio ?? 'Non è stato possibile inviare la richiesta. Riprova più tardi.', 'errore');
      }
    } catch {
      scrivi('Connessione non riuscita: la richiesta non è stata inviata. Riprova più tardi.', 'errore');
    } finally {
      btn.removeAttribute('aria-busy');
      etichetta.textContent = 'Avvisami';
    }
  });
  form.querySelectorAll('input').forEach((i) => i.addEventListener('input', () => i.getAttribute('aria-invalid') === 'true' && mostraErrore(i.name, false)));
}
