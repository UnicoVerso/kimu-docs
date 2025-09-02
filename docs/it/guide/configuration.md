# 🗂️ Configurazione & Ambienti

KIMU-CORE supporta più ambienti e una configurazione flessibile per adattarsi a diverse esigenze di sviluppo e deploy.

---

## 📦 File di Configurazione

- Le cartelle `config/` e `env/` contengono i file di configurazione per ogni ambiente:
  - `dev.config.json` (sviluppo)
  - `prod.config.json` (produzione)
  - `test.config.json` (test)
  - `local.config.json` (sviluppo locale)
  - `staging.config.json` (staging)
- Questi file definiscono variabili, percorsi, opzioni di build e impostazioni di runtime.

---

## 🌍 Selezione dell'Ambiente

- Puoi selezionare l'ambiente usando gli script npm:
  - `npm run build:dev` (sviluppo)
  - `npm run build:prod` (produzione)
  - `npm run build:test` (test)
  - `npm run build:local` (locale)
- Ogni script carica il file di configurazione corrispondente e applica le sue impostazioni.
- Puoi creare ambienti personalizzati aggiungendo nuovi file di configurazione e script.

---

## ⚙️ Configurazione Personalizzata

- Puoi estendere o sovrascrivere la configurazione creando nuovi file in `env/` o `config/`.
- Documenta le tue opzioni personalizzate per una migliore manutenzione.

---

## 🕒 Runtime vs Build Time

- Alcune opzioni di configurazione vengono lette solo in fase di build (es. bundling, variabili d'ambiente).

---

## ⚡ Configurazione Ottimizzazioni Framework

KIMU-Core include ottimizzazioni sicure configurabili per migliorare performance e affidabilità.

### Configurazione Globale

```typescript
import { KimuComponentElement } from './core/kimu-component-element';

// Configurazione ottimizzazioni all'avvio dell'app
KimuComponentElement.configureOptimizations({
    enableTemplateCache: true,      // Cache template compilati
    enableFileCache: true,          // Cache file caricati  
    enableRenderDebouncing: true,   // Debouncing rendering
    enableErrorBoundaries: true,    // Isolamento errori componenti
    cacheMaxSize: 50,              // Limite cache template (LRU)
    enableAssetPreloading: false   // Precaricamento asset (opt-in)
});
```

### Configurazione per Ambiente

#### Sviluppo (Development)
```typescript
// config/dev.config.json
{
    "optimizations": {
        "enableTemplateCache": false,     // Disabilita cache per hot-reload
        "enableErrorBoundaries": true,    // Mantieni isolamento errori
        "cacheMaxSize": 10,              // Cache ridotta
        "enableAssetPreloading": false   // Nessun preloading in dev
    }
}
```

#### Produzione (Production)
```typescript
// config/prod.config.json  
{
    "optimizations": {
        "enableTemplateCache": true,      // Cache completa
        "enableFileCache": true,          // Cache file abilitata
        "enableRenderDebouncing": true,   // Debouncing attivo
        "enableErrorBoundaries": true,    // Isolamento errori critico
        "cacheMaxSize": 100,             // Cache estesa
        "enableAssetPreloading": true    // Precaricamento asset critici
    }
}
```

#### Test (Testing)
```typescript
// config/test.config.json
{
    "optimizations": {
        "enableTemplateCache": false,     // Cache disabilitata per test
        "enableErrorBoundaries": false,  // Errori visibili per debugging
        "cacheMaxSize": 5,               // Cache minima
        "enableAssetPreloading": false   // Nessun preloading
    }
}
```

### Cache e Memory Management

```typescript
import { KimuEngine } from './core/kimu-engine';

// Configurazione dimensione cache
KimuEngine.configureCaching(75); // Template cache più grande

// Pulizia cache programmata (utile per SPA long-running)
setInterval(() => {
    KimuEngine.clearCaches();
}, 30 * 60 * 1000); // Ogni 30 minuti
```

### Preloading Asset Strategico

```typescript
// Precaricamento asset critici all'avvio
async function initializeApp() {
    // Configura ottimizzazioni
    KimuComponentElement.configureOptimizations({
        enableAssetPreloading: true
    });
    
    // Precarica asset critici
    await KimuComponentElement.preloadAssets([
        'extensions/dashboard/view.html',
        'extensions/dashboard/style.css',
        'extensions/navigation/view.html',
        'assets/theme.css',
        'assets/icons.css'
    ]);
    
    console.log('App inizializzata con asset precaricati');
}
```

### Monitoraggio Performance

```typescript
// Debug configurazione ottimizzazioni
console.log('Ottimizzazioni attive:', 
    KimuComponentElement.getOptimizationSettings());

// Monitoraggio cache
setInterval(() => {
    const stats = getCacheStats(); // Implementazione custom
    if (stats.usage > 0.8) {
        console.warn('Cache usage alta:', stats);
    }
}, 60000); // Ogni minuto
```
