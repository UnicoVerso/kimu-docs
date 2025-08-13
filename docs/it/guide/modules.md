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
