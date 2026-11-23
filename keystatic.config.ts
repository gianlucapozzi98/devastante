import { config, collection, singleton, fields } from '@keystatic/core';

/**
 * Pannello contenuti DEVASTANTE (Keystatic, interfaccia in italiano).
 * - Modalità GitHub se PUBLIC_KEYSTATIC_GITHUB_REPO è impostata (es. "proprietario/repo"), altrimenti locale (sviluppo).
 * - Regola d'oro: un campo vuoto mostra sul sito un segnaposto evidente. Mai inventare dati.
 */
const repo = import.meta.env.PUBLIC_KEYSTATIC_GITHUB_REPO as `${string}/${string}` | undefined;

const foto = (label: string) =>
  fields.image({
    label,
    description: 'Solo foto vere del locale e dei prodotti. Ritocco ammesso: nitidezza, esposizione, rumore.',
    directory: 'assets/foto',
    publicPath: '/assets/foto/',
  });

const allergeniUE = [
  { label: 'Glutine', value: 'glutine' },
  { label: 'Crostacei', value: 'crostacei' },
  { label: 'Uova', value: 'uova' },
  { label: 'Pesce', value: 'pesce' },
  { label: 'Arachidi', value: 'arachidi' },
  { label: 'Soia', value: 'soia' },
  { label: 'Latte', value: 'latte' },
  { label: 'Frutta a guscio', value: 'frutta-a-guscio' },
  { label: 'Sedano', value: 'sedano' },
  { label: 'Senape', value: 'senape' },
  { label: 'Sesamo', value: 'sesamo' },
  { label: 'Anidride solforosa e solfiti', value: 'solfiti' },
  { label: 'Lupini', value: 'lupini' },
  { label: 'Molluschi', value: 'molluschi' },
] as const;

export default config({
  locale: 'it-IT',
  storage: repo ? { kind: 'github', repo } : { kind: 'local' },
  ui: {
    brand: { name: 'DEVASTANTE' },
    navigation: {
      Locale: ['impostazioni', 'orari', 'azienda'],
      Storia: ['capitoli'],
      Cucina: ['menu', 'smash', 'offerte', 'faq'],
    },
  },
  singletons: {
    impostazioni: singleton({
      label: 'Impostazioni e apertura',
      path: 'src/data/impostazioni',
      format: { data: 'json' },
      schema: {
        prestoInApertura: fields.checkbox({
          label: 'Modalità "Presto in apertura"',
          description: 'Attiva finché il locale non è aperto davvero. Il sito non dirà mai "aperto" con questa opzione attiva.',
          defaultValue: true,
        }),
        fotoProva: fields.checkbox({
          label: 'Foto di prova',
          description: "Riempie gli spazi senza foto vere con foto d'archivio per vedere l'effetto. Non sono foto del locale: da spegnere prima di far vedere il sito al pubblico.",
          defaultValue: false,
        }),
        dataApertura: fields.date({ label: 'Data di apertura (solo se confermata)' }),
        indirizzo: fields.text({ label: 'Via e numero civico' }),
        cap: fields.text({ label: 'CAP' }),
        citta: fields.text({ label: 'Città', defaultValue: 'Cesano Boscone' }),
        telefono: fields.text({ label: 'Telefono (formato +39…)' }),
        whatsapp: fields.text({ label: 'WhatsApp (formato +39…)' }),
        email: fields.text({ label: 'Email pubblica' }),
        mappaUrl: fields.url({ label: 'Link alla mappa (Google Maps / OpenStreetMap)' }),
        mappaEmbed: fields.url({ label: 'URL embed della mappa (caricata solo dopo consenso)' }),
        app: fields.array(
          fields.object({ nome: fields.text({ label: 'Nome app' }), url: fields.url({ label: 'Link' }) }),
          { label: 'App di consegna / ordine online', itemLabel: (p) => p.fields.nome.value || 'App' },
        ),
        social: fields.array(
          fields.object({ nome: fields.text({ label: 'Social' }), url: fields.url({ label: 'Link al profilo' }) }),
          { label: 'Social ufficiali', itemLabel: (p) => p.fields.nome.value || 'Social' },
        ),
        asporto: fields.select({
          label: 'Asporto',
          options: [
            { label: 'Da confermare', value: 'da-confermare' },
            { label: 'Sì', value: 'si' },
            { label: 'No', value: 'no' },
          ],
          defaultValue: 'da-confermare',
        }),
        consegna: fields.select({
          label: 'Consegna a domicilio',
          options: [
            { label: 'Da confermare', value: 'da-confermare' },
            { label: 'Sì, con app', value: 'app' },
            { label: 'Sì, diretta', value: 'diretta' },
            { label: 'No', value: 'no' },
          ],
          defaultValue: 'da-confermare',
        }),
        pagamenti: fields.text({ label: 'Metodi di pagamento accettati' }),
      },
    }),
    orari: singleton({
      label: 'Orari',
      path: 'src/data/orari',
      format: { data: 'json' },
      schema: {
        giorni: fields.array(
          fields.object({
            giorno: fields.text({ label: 'Giorno' }),
            stato: fields.select({
              label: 'Stato',
              options: [
                { label: 'Da confermare', value: 'da-confermare' },
                { label: 'Aperto', value: 'aperto' },
                { label: 'Chiuso', value: 'chiuso' },
              ],
              defaultValue: 'da-confermare',
            }),
            fasce: fields.text({ label: 'Fasce orarie (es. 11:30–14:30, 18:00–22:30)' }),
          }),
          { label: 'Settimana', itemLabel: (p) => p.fields.giorno.value },
        ),
        nota: fields.text({ label: 'Nota (festività, chiusure)', multiline: true }),
      },
    }),
    azienda: singleton({
      label: 'Dati societari',
      path: 'src/data/azienda',
      format: { data: 'json' },
      schema: {
        ragioneSociale: fields.text({ label: 'Denominazione / ragione sociale' }),
        formaGiuridica: fields.text({ label: 'Forma giuridica' }),
        sedeLegale: fields.text({ label: 'Sede legale' }),
        codiceFiscale: fields.text({ label: 'Codice fiscale' }),
        partitaIva: fields.text({ label: 'Partita IVA' }),
        rea: fields.text({ label: 'REA (ufficio e numero)' }),
        capitaleSociale: fields.text({ label: 'Capitale sociale (solo società di capitali)' }),
        pec: fields.text({ label: 'PEC' }),
      },
    }),
    smash: singleton({
      label: 'Anatomia dello smash',
      path: 'src/data/smash',
      format: { data: 'json' },
      schema: {
        strati: fields.array(
          fields.object({
            nome: fields.text({ label: 'Strato' }),
            descrizione: fields.text({ label: 'Descrizione (solo ingredienti reali)', multiline: true }),
            confermato: fields.checkbox({ label: 'Confermato dal titolare', defaultValue: false }),
            foto: foto('Foto dello strato'),
          }),
          { label: 'Strati dall\'alto in basso', itemLabel: (p) => p.fields.nome.value },
        ),
      },
    }),
  },
  collections: {
    capitoli: collection({
      label: 'Capitoli della storia',
      path: 'src/content/capitoli/*',
      slugField: 'titolo',
      format: { data: 'yaml' },
      schema: {
        titolo: fields.slug({ name: { label: 'Titolo' } }),
        ordine: fields.integer({ label: 'Ordine', defaultValue: 1 }),
        ancora: fields.text({ label: 'Ancora (id nella pagina)' }),
        etichetta: fields.text({ label: 'Etichetta breve (indice)' }),
        occhiello: fields.text({ label: 'Occhiello' }),
        testo: fields.text({ label: 'Testo', multiline: true }),
        nota: fields.text({ label: 'Nota interna (non pubblicata)', multiline: true }),
        foto: fields.array(
          fields.object({
            src: foto('Foto'),
            alt: fields.text({ label: 'Testo alternativo (descrive la foto)' }),
            didascalia: fields.text({ label: 'Didascalia vera (chi, dove, quando)' }),
            consenso: fields.checkbox({ label: 'Consenso delle persone ritratte / della famiglia', defaultValue: false }),
          }),
          { label: 'Foto', itemLabel: (p) => p.fields.alt.value || 'Foto' },
        ),
      },
    }),
    menu: collection({
      label: 'Menu',
      path: 'src/content/menu/*',
      slugField: 'nome',
      format: { data: 'yaml' },
      schema: {
        nome: fields.slug({ name: { label: 'Nome' } }),
        categoria: fields.select({
          label: 'Categoria',
          options: [
            { label: 'Pizze in teglia', value: 'pizze' },
            { label: 'Smash', value: 'smash' },
            { label: 'Bevande', value: 'bevande' },
          ],
          defaultValue: 'pizze',
        }),
        ordine: fields.integer({ label: 'Ordine', defaultValue: 1 }),
        descrizione: fields.text({ label: 'Descrizione', multiline: true }),
        ingredienti: fields.array(fields.text({ label: 'Ingrediente' }), { label: 'Ingredienti', itemLabel: (p) => p.value }),
        allergeni: fields.multiselect({ label: 'Allergeni (Reg. UE 1169/2011)', options: allergeniUE }),
        prezzo: fields.text({ label: 'Prezzo IVA inclusa (es. 3,50)' }),
        unita: fields.select({
          label: 'Unità di vendita',
          options: [
            { label: 'Da confermare', value: 'da-confermare' },
            { label: 'Al trancio', value: 'trancio' },
            { label: 'Al peso (prezzo al kg)', value: 'kg' },
            { label: 'Al pezzo', value: 'pezzo' },
          ],
          defaultValue: 'da-confermare',
        }),
        foto: foto('Foto vera del piatto'),
        confermato: fields.checkbox({ label: 'Confermato dal titolare', defaultValue: false }),
      },
    }),
    offerte: collection({
      label: 'Offerte',
      path: 'src/content/offerte/*',
      slugField: 'titolo',
      format: { data: 'yaml' },
      schema: {
        titolo: fields.slug({ name: { label: 'Titolo' } }),
        testo: fields.text({ label: 'Testo', multiline: true }),
        dal: fields.date({ label: 'Valida dal' }),
        al: fields.date({ label: 'Valida fino al' }),
        attiva: fields.checkbox({ label: 'Pubblicata', defaultValue: false }),
      },
    }),
    faq: collection({
      label: 'Domande frequenti',
      path: 'src/content/faq/*',
      slugField: 'domanda',
      format: { data: 'yaml' },
      schema: {
        domanda: fields.slug({ name: { label: 'Domanda' } }),
        ordine: fields.integer({ label: 'Ordine', defaultValue: 1 }),
        risposta: fields.text({ label: 'Risposta', multiline: true }),
        confermata: fields.checkbox({ label: 'Risposta confermata (va nei dati strutturati FAQPage)', defaultValue: false }),
      },
    }),
  },
});
