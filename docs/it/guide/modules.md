# Moduli

## Cos'è un Modulo?
Un modulo è un "contenitore" che raccoglie tutto ciò che serve per una funzionalità o area dell'applicazione. Serve per organizzare codice riusabile e condiviso.

### Cosa può contenere un modulo?
- **Servizi**: classi con una responsabilità specifica (es. gestione dati, localizzazione, autenticazione)
- **Helper**: funzioni di supporto per semplificare operazioni comuni
- **API**: metodi pubblici per interagire con il modulo
- **Provider di dati**: classi o funzioni che forniscono dati all'applicazione
- **Costanti e configurazioni**: valori statici, opzioni, impostazioni
- **Risorse**: file di dati, stringhe localizzate, template

I moduli sono pensati per essere importati e usati da estensioni, componenti e altri moduli. La struttura tipica è una cartella dedicata (es. `/src/modules/`) che contiene tutto il necessario.

### Esempio pratico di Modulo
Il modulo di internalizzazione (`i18n`) può includere:
- Una classe `I18nService` che gestisce le lingue e le traduzioni (servizio)
- Funzioni helper per formattare date e numeri
- File di risorse con le stringhe localizzate
- Costanti per le lingue supportate
Tutto questo viene esportato dal modulo e può essere usato da estensioni e componenti.

---

## Cos'è un Servizio?
Un servizio è una classe o funzione che svolge una singola responsabilità (es. traduzione, gestione dati, autenticazione). I servizi sono pensati per essere riusabili, testabili e facilmente sostituibili.

### Esempio pratico di Servizio
`I18nService` è una classe che espone metodi come `translate(key)`, `setLanguage(lang)`, `getCurrentLanguage()`. Viene istanziata una sola volta e usata ovunque serva la traduzione.

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
  modules/
    i18n/
      I18nService.ts   // servizio
      helpers.ts       // funzioni di supporto
      resources.json   // dati
      index.ts         // esporta tutto
```
