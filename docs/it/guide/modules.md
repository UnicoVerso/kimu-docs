# Moduli

## Cos'è un Modulo?
Un modulo è un "contenitore" che raccoglie tutto ciò che serve per una funzionalità o area dell'applicazione. Serve per organizzare codice riusabile e condiviso.

> **Nota:** Un modulo può esportare più servizi, helper, costanti, provider, ecc. Un servizio è una singola classe/funzione con responsabilità specifica.

### Cosa può contenere un modulo?
- **Servizi**: classi con una responsabilabilità specifica (es. gestione dati, localizzazione, autenticazione)
- **Helper**: funzioni di supporto per semplificare operazioni comuni
- **API**: metodi pubblici per interagire con il modulo
- **Provider di dati**: classi o funzioni che forniscono dati all'applicazione
- **Costanti e configurazioni**: valori statici, opzioni, impostazioni
- **Risorse**: file di dati, stringhe localizzate, template

I moduli sono pensati per essere importati e usati da estensioni, componenti e altri moduli. La struttura tipica è una cartella dedicata (es. `/src/modules/`) che contiene tutto il necessario.

---

## Come creare un nuovo modulo
1. Crea una cartella in `/src/modules/` (es. `my-module/`)
2. Crea un file `module.ts` o `index.ts` che esporta i servizi e le API pubbliche
3. Implementa uno o più servizi, helper, costanti, risorse
4. (Opzionale) Registra il modulo nel manifest se richiesto

**Esempio struttura:**
```
src/
  modules/
    my-module/
      my-service.ts
      helpers.ts
      config.ts
      module.ts
```

---

## Gestione dei Moduli con il Module Manager

KIMU-Core integra un gestore dei moduli (Module Manager) che permette di caricare e utilizzare moduli in modo dinamico e centralizzato. Questo consente di mantenere il core leggero e di estendere facilmente le funzionalità.

### Esempio: Caricamento del modulo i18n

```typescript
const i18nModule = await app.moduleManager.loadModule('i18n');
const i18nService = i18nModule.getService();
await i18nService.setLang('en');
console.log(i18nService.translate('welcome'));
```

Il Module Manager si occupa di istanziare il modulo una sola volta (singleton) e di fornire i servizi pubblici definiti dal modulo stesso.

---

### Esempio pratico di Modulo
i18n (internazionalizzazione) può includere:
- Una classe `KimuI18nService` che gestisce le lingue e le traduzioni (servizio)
- Funzioni helper per formattare date e numeri
- File di risorse con le stringhe localizzate
- Costanti per le lingue supportate
Tutto questo viene esportato dal modulo e può essere usato da estensioni e componenti tramite il Module Manager.

---

## Cos'è un Servizio?
Un servizio è una classe o funzione che svolge una singola responsabilità (es. traduzione, gestione dati, autenticazione). I servizi sono pensati per essere riusabili, testabili e facilmente sostituibili.

### Esempio pratico di Servizio
`KimuI18nService` è una classe che espone metodi come `translate(key)`, `setLang(lang)`, `getLang()`. Viene istanziata una sola volta e usata ovunque serva la traduzione.

---

## Altre funzionalità nei moduli
Oltre ai servizi, un modulo può esportare:
- Funzioni helper (es. `formatDate`, `parseNumber`)
- Provider di dati (es. `LocaleProvider`)
- Costanti e configurazioni (es. `SUPPORTED_LANGUAGES`)
- File di risorse (es. `translations.json`)

---

## Schema sintetico
```
src/
  core/
    kimu-module-manager.ts   // gestore moduli
  modules/
    i18n/
      kimu-i18n-service.ts   // servizio i18n
      module.ts              // entrypoint modulo
      helpers.ts             // funzioni di supporto
      resources.json         // dati
      index.ts               // esporta tutto
```

---

## Best practice
- Mantieni i servizi base nei moduli.
- Usa il Module Manager per integrare e scalare le funzionalità.
- Sfrutta la modularità per aggiungere, sostituire o aggiornare funzionalità senza modificare il core o le estensioni.

---

## FAQ
- **Posso avere più servizi in un modulo?** Sì, puoi esportare più classi/funzioni.
- **Come condivido dati tra moduli?** Tramite servizi pubblici o eventi.
- **I moduli sono caricati sempre?** No, vengono caricati solo quando richiesti (lazy loading).

---

## Glossario
- **Modulo**: contenitore di servizi, helper, costanti, risorse.
- **Servizio**: classe/funzione con responsabilità unica.
- **Provider**: fornitore di dati o risorse.
- **Helper**: funzione di supporto.

---

# Gestione Modulare Avanzata in KIMU-Core

## Sistema di Gestione Moduli

KIMU-Core adotta un sistema avanzato per la gestione dei moduli opzionali tramite repository centrale, scripts automatici e manifest dedicato. Questo permette di installare/rimuovere moduli senza modificare il core e di mantenere la build leggera e personalizzata.

### Struttura delle Directory

```
kimu-core/
├── src/
│   ├── modules/                  # Moduli attivi (inclusi nella build)
│   │   ├── modules-manifest.json # Elenco moduli installati
│   │   ├── i18n/                 # Modulo i18n (installato di default)
│   │   └── .gitkeep
│   └── modules-repository/       # Repository moduli disponibili (NON in build)
│       ├── router/               # Modulo router disponibile
│       │   ├── module.ts
│       │   ├── router.ts
│       │   ├── manifest.json
│       │   └── README.md
│       └── ...                   # Altri moduli futuri
└── scripts/
    ├── install-module.js         # Script installazione moduli
    ├── remove-module.js          # Script rimozione moduli
    └── list-modules.js           # Script lista moduli
```

### Comandi Principali

- `npm run list:modules` — Mostra moduli installati e disponibili
- `npm run install:module <nome>` — Installa un modulo dal repository
- `npm run remove:module <nome>` — Rimuove un modulo installato

### Come Funziona

- **Installazione:**
  1. Il modulo viene copiato da `modules-repository/<nome>` a `modules/<nome>`
  2. Aggiornamento di `modules-manifest.json`
  3. Il modulo sarà incluso nella prossima build

- **Rimozione:**
  1. La cartella del modulo viene eliminata da `modules/<nome>`
  2. Aggiornamento di `modules-manifest.json`
  3. Il modulo resta disponibile nel repository per future installazioni

### Esempio Manifest Centrale

```json
{
  "installedModules": [
    {
      "name": "i18n",
      "version": "1.0.0",
      "path": "i18n",
      "installedAt": "2025-01-17T00:00:00.000Z"
    },
    {
      "name": "router",
      "version": "1.0.0",
      "path": "router",
      "installedAt": "2025-10-17T20:20:55.120Z"
    }
  ],
  "availableModules": [],
  "lastUpdate": "2025-10-17T20:20:55.120Z"
}
```

## Manifest del Modulo

Il manifest di un modulo KIMU è un file `manifest.json` che descrive tutte le informazioni essenziali per la gestione, installazione e compatibilità del modulo. È fondamentale per il funzionamento degli script di installazione/rimozione e per la corretta inclusione nella build.

### Struttura e Campi del Manifest

Esempio generico:
```json
{
  "name": "nome-modulo",
  "version": "1.0.0",
  "description": "Descrizione dettagliata del modulo",
  "author": "Autore o team",
  "license": "MPL-2.0",
  "dependencies": [],
  "kimuCoreVersion": "^0.3.0",
  "keywords": ["parole", "chiave", "modulo"],
  "repository": {
    "type": "git",
    "url": "https://github.com/UnicoVerso/kimu-core",
    "directory": "src/modules/nome-modulo"
  }
}
```

#### Campi obbligatori
- `name`: Nome univoco del modulo (es. "i18n", "router")
- `version`: Versione semantica del modulo (es. "1.0.0")
- `description`: Breve descrizione della funzionalità
- `author`: Autore o team di sviluppo
- `license`: Licenza del modulo (es. "MPL-2.0")
- `dependencies`: Array di nomi di altri moduli richiesti (può essere vuoto)
- `kimuCoreVersion`: Versione minima di kimu-core compatibile

#### Campi opzionali
- `keywords`: Parole chiave per ricerca e categorizzazione
- `repository`: Informazioni sul repository GitHub o altro VCS

### Esempio Manifest i18n
```json
{
  "name": "i18n",
  "version": "1.0.0",
  "description": "Internationalization module for KIMU applications with multi-language support and dynamic translation system",
  "author": "KIMU Team",
  "license": "MPL-2.0",
  "dependencies": [],
  "kimuCoreVersion": "^0.3.0",
  "keywords": ["i18n", "internationalization", "localization", "translation", "multilingual", "language"],
  "repository": {
    "type": "git",
    "url": "https://github.com/UnicoVerso/kimu-core",
    "directory": "src/modules/i18n"
  }
}
```

### Utilizzo del Manifest
- Gli script di installazione/rimozione leggono il manifest per verificare compatibilità, dipendenze e informazioni da mostrare all’utente.
- Il manifest viene usato per aggiornare il manifest centrale (`modules-manifest.json`) dopo ogni installazione/rimozione.
- I campi come `dependencies` e `kimuCoreVersion` permetteranno in futuro la risoluzione automatica delle dipendenze e il controllo delle versioni.

### Best Practice per la Creazione
- Compila sempre tutti i campi obbligatori.
- Aggiorna la versione ad ogni modifica significativa del modulo.
- Usa descrizioni chiare e parole chiave utili.
- Documenta eventuali dipendenze da altri moduli.
- Mantieni il manifest aggiornato e coerente con il codice del modulo.

### Checklist Manifest
- [x] Nome univoco
- [x] Versione semantica
- [x] Descrizione chiara
- [x] Autore e licenza
- [x] Dipendenze (se presenti)
- [x] Versione minima di kimu-core
- [x] Parole chiave e repository (opzionali)

---

### Best Practices

- Non modificare mai `modules-repository/` direttamente
- Installa solo i moduli necessari per ridurre la dimensione della build
- Committa sempre `modules-manifest.json` per tracciare i moduli usati
- Usa solo gli script forniti per installare/rimuovere moduli
- Documenta le dipendenze nel manifest del modulo

### Workflow Sviluppatore

1. Crea nuovo modulo in `modules-repository/`
2. Testa installazione con `npm run install:module <nome>`
3. Sviluppa e testa
4. Rimuovi con `npm run remove:module <nome>`
5. Il modulo resta disponibile nel repository

### Workflow Utilizzatore

1. Vedi moduli disponibili con `npm run list:modules`
2. Installa solo ciò che serve
3. Build con solo i moduli installati

### Vantaggi

- Build più leggera e personalizzata
- Moduli opzionali e facilmente gestibili
- Repository centrale sempre integro
- Sviluppo e test semplificati

### Esempi di Utilizzo

```bash
# Progetto nuovo - solo core + i18n
npm run build                    # ~50KB

# Aggiungo router
npm run install:module router
npm run build                    # ~58KB

# Rimuovo router
npm run remove:module router
npm run build                    # ~50KB
```

### FAQ Moduli

- **Posso installare/rimuovere moduli senza toccare il core?** Sì, tutto avviene tramite scripts e repository.
- **I moduli sono inclusi nella build solo se installati?** Sì, la build legge solo i moduli attivi.
- **Posso creare moduli personalizzati?** Sì, basta seguire la struttura e aggiungere il manifest.

---

Per dettagli e guida completa consulta anche:
- [docs/MODULE_MANAGEMENT.md] del progetto kimu-core
- [src/modules/README.md] e [src/modules-repository/README.md] del progetto kimu-core

---

**Questa sezione è aggiornata con tutte le regole e workflow della gestione moduli KIMU-Core.**
