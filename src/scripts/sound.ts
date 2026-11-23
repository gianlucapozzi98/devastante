/**
 * Suono opzionale, SPENTO di default. Sintetizzato con Web Audio (nessun file da scaricare):
 * sfrigolio (piastra dello smash), scatto della rotella, morso.
 * La scelta è salvata come preferenza tecnica (localStorage "dev-suono").
 */
type Effetto = 'sfrigolio' | 'rotella' | 'morso';
let attivo = false;
let ac: AudioContext | null = null;
let rumore: AudioBuffer | null = null;

function contesto() {
  if (!ac) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    ac = new AC();
    rumore = ac.createBuffer(1, ac.sampleRate * 2, ac.sampleRate);
    const d = rumore.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  if (ac.state === 'suspended') ac.resume();
  return ac;
}

export function suona(effetto: Effetto, intensita = 1) {
  if (!attivo) return;
  const c = contesto();
  const t = c.currentTime;
  const out = c.createGain();
  out.connect(c.destination);
  if (effetto === 'sfrigolio') {
    const src = c.createBufferSource();
    src.buffer = rumore;
    const hp = c.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 2600;
    const bp = c.createBiquadFilter();
    bp.type = 'peaking';
    bp.frequency.value = 6000;
    bp.gain.value = 8;
    src.connect(hp).connect(bp).connect(out);
    const dur = 1.6;
    out.gain.setValueAtTime(0, t);
    out.gain.linearRampToValueAtTime(0.12 * intensita, t + 0.05);
    // crepitii casuali
    for (let k = 0; k < 26; k++) {
      const tk = t + 0.05 + Math.random() * (dur - 0.2);
      out.gain.setValueAtTime(0.12 * intensita, tk);
      out.gain.linearRampToValueAtTime(0.2 * intensita, tk + 0.008);
      out.gain.linearRampToValueAtTime(0.1 * intensita, tk + 0.03);
    }
    out.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.start(t, Math.random());
    src.stop(t + dur);
  } else if (effetto === 'rotella') {
    for (let k = 0; k < 6; k++) {
      const o = c.createOscillator();
      const g = c.createGain();
      o.type = 'square';
      o.frequency.value = 1800 + Math.random() * 400;
      g.gain.setValueAtTime(0.0001, t + k * 0.045);
      g.gain.exponentialRampToValueAtTime(0.03 * intensita, t + k * 0.045 + 0.002);
      g.gain.exponentialRampToValueAtTime(0.0001, t + k * 0.045 + 0.02);
      o.connect(g).connect(out);
      o.start(t + k * 0.045);
      o.stop(t + k * 0.045 + 0.03);
    }
  } else {
    const src = c.createBufferSource();
    src.buffer = rumore;
    const lp = c.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(3200, t);
    lp.frequency.exponentialRampToValueAtTime(400, t + 0.12);
    src.connect(lp).connect(out);
    out.gain.setValueAtTime(0.25 * intensita, t);
    out.gain.exponentialRampToValueAtTime(0.0001, t + 0.14);
    src.start(t);
    src.stop(t + 0.16);
  }
}

function aggiornaPulsanti() {
  document.querySelectorAll<HTMLButtonElement>('[data-suono]').forEach((b) => {
    b.setAttribute('aria-pressed', String(attivo));
    b.title = attivo ? 'Spegni il suono' : 'Accendi il suono';
    const s = b.querySelector('.suono__stato');
    if (s) s.textContent = attivo ? 'on' : 'off';
  });
}

export function initSuono() {
  try { attivo = localStorage.getItem('dev-suono') === '1'; } catch { attivo = false; }
  document.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest('[data-suono]');
    if (!b) return;
    attivo = !attivo;
    try { localStorage.setItem('dev-suono', attivo ? '1' : '0'); } catch { /* niente */ }
    aggiornaPulsanti();
    if (attivo) { contesto(); suona('morso', 0.6); }
  });
  document.addEventListener('astro:page-load', aggiornaPulsanti);
  aggiornaPulsanti();
}
