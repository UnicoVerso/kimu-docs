# KimuExtensionMeta

Interfaccia TypeScript che definisce i metadata e la configurazione delle estensioni KIMU.

## Descrizione

`KimuExtensionMeta` è l'interfaccia centrale per definire le proprietà di un'estensione KIMU. Viene utilizzata in:

- **Decorator @KimuComponent**: Configurazione componenti
- **Manifest JSON**: Definizione estensioni disponibili
- **ExtensionManager**: Gestione runtime delle estensioni
- **Store persistente**: Salvataggio metadata in IndexedDB

## Definizione Completa

```typescript
interface KimuExtensionMeta {
  tag: string;              // Identificativo univoco e tag HTML
  name: string;             // Nome descrittivo per UI
  version?: string;         // Versione componente (semver)
  description?: string;     // Descrizione funzionalità
  author?: string;          // Autore o team
  icon?: string;            // Icona emoji o path
  source?: string;          // Origine: 'local' | 'git' | 'marketplace'
  link?: string;            // URL documentazione/repository
  path?: string;            // Path base per risorse
  basePath?: string;        // Path calcolato (interno)
  kimuVersion?: string;     // Versione KIMU richiesta
  enabled?: boolean;        // Se l'estensione è abilitata
  installed?: boolean;      // Se l'estensione è installata
  internal?: boolean;       // Se è interna al framework
  template?: string;        // Path template HTML
  style?: string;           // Path file CSS
  external?: KimuGroupAsset; // Asset esterni da caricare
  dependencies?: string[];  // Estensioni dipendenti
  languages?: KimuExtensionLanguages; // Configurazione i18n
}
```

## Proprietà

### Identificazione

#### `tag: string` *(obbligatorio)*

Identificativo univoco dell'estensione e nome del tag HTML Web Component.

**Regole:**
- Deve contenere almeno un trattino (standard Web Components)
- Dovrebbe essere univoco globalmente
- Usato come primary key nel database

**Esempi:**
```typescript
{
  tag: "user-profile"        // <user-profile></user-profile>
}

{
  tag: "myapp-data-chart"    // Con namespace per evitare conflitti
}
```

#### `name: string` *(obbligatorio)*

Nome descrittivo dell'estensione per interfacce utente e documentazione.

**Esempi:**
```typescript
{
  tag: "user-widget",
  name: "User Profile Widget"
}

{
  tag: "chart-component", 
  name: "Interactive Data Chart Component"
}
```

### Versioning

#### `version?: string`

Versione dell'estensione (formato semantic versioning consigliato).

**Formato consigliato:** `MAJOR.MINOR.PATCH`

**Esempi:**
```typescript
{
  tag: "my-component",
  version: "1.0.0"      // Prima release stabile
}

{
  tag: "beta-feature",
  version: "2.1.0-beta.3"  // Pre-release
}
```

#### `kimuVersion?: string`

Versione minima di KIMU richiesta per l'estensione.

**Esempi:**
```typescript
{
  tag: "advanced-widget",
  kimuVersion: "1.2.0"  // Richiede KIMU 1.2.0+
}
```

### Metadata Descrittivi

#### `description?: string`

Descrizione dettagliata delle funzionalità dell'estensione.

**Esempi:**
```typescript
{
  tag: "search-component",
  name: "Smart Search",
  description: "Componente di ricerca avanzata con autocompletamento, filtri e risultati in tempo reale"
}
```

#### `author?: string`

Autore, team o organizzazione responsabile dell'estensione.

**Esempi:**
```typescript
{
  tag: "company-widget",
  author: "Frontend Team - Acme Corp"
}

{
  tag: "open-component", 
  author: "Community Contributors"
}
```

#### `icon?: string`

Icona per rappresentare l'estensione (emoji, Unicode, o path).

**Esempi:**
```typescript
{
  tag: "notification-bell",
  icon: "🔔"           // Emoji
}

{
  tag: "user-profile",
  icon: "👤"           // Unicode
}

{
  tag: "custom-widget",
  icon: "assets/widget-icon.svg"  // Path relativo
}
```

### Origine e Collegamenti

#### `source?: string`

Tipo di origine dell'estensione.

**Valori supportati:**
- `'local'` - Sviluppata localmente
- `'git'` - Da repository Git
- `'marketplace'` - Da marketplace estensioni

**Esempi:**
```typescript
{
  tag: "custom-component",
  source: "local"
}

{
  tag: "community-widget",
  source: "git"
}
```

#### `link?: string`

URL per documentazione, repository o sito web dell'estensione.

**Esempi:**
```typescript
{
  tag: "open-widget",
  link: "https://github.com/username/kimu-widget"
}

{
  tag: "docs-component",
  link: "https://docs.example.com/components/docs-component"
}
```

### Path e Risorse

#### `path?: string`

Path base per le risorse dell'estensione (template, stili, asset).

**Default:** `extensions/${tag}`

**Esempi:**
```typescript
{
  tag: "user-card",
  path: "components/user-card"
  // Risorse in: /extensions/components/user-card/
}

{
  tag: "admin-panel",
  path: "admin/panels/main"
  // Risorse in: /extensions/admin/panels/main/
}
```

#### `basePath?: string` *(calcolato)*

Path completo calcolato automaticamente (uso interno).

#### `template?: string`

Nome del file template HTML.

**Default:** `"view.html"`

**Esempi:**
```typescript
{
  tag: "custom-view",
  template: "custom-template.html"
}

{
  tag: "multi-view",
  template: "main-view.html"
}
```

#### `style?: string`

Nome del file CSS per gli stili.

**Default:** `"style.css"`

**Esempi:**
```typescript
{
  tag: "themed-component",
  style: "dark-theme.css"
}

{
  tag: "responsive-widget",
  style: "responsive-styles.css"
}
```

### Stato dell'Estensione

#### `enabled?: boolean`

Indica se l'estensione è abilitata.

**Default:** `true`

**Esempi:**
```typescript
{
  tag: "experimental-feature",
  enabled: false    // Disabilitata di default
}

{
  tag: "production-widget",
  enabled: true     // Abilitata
}
```

#### `installed?: boolean`

Indica se l'estensione è installata nel sistema.

**Default:** `false`

#### `internal?: boolean`

Indica se l'estensione è interna al framework (non visibile agli utenti).

**Default:** `false`

**Esempi:**
```typescript
{
  tag: "kimu-core-utils",
  internal: true    // Utility interna
}

{
  tag: "user-component",
  internal: false   // Visibile agli utenti
}
```

### Asset Esterni

#### `external?: KimuGroupAsset`

Definisce asset esterni (CSS/JS) da caricare automaticamente.

**Struttura:**
```typescript
{
  external: {
    css: [
      { path: "https://cdn.example.com/styles.css", id: "external-styles" }
    ],
    js: [
      { path: "https://cdn.example.com/library.js", id: "external-lib" }
    ]
  }
}
```

### Dipendenze

#### `dependencies?: string[]`

Lista di tag delle estensioni richieste (caricate automaticamente).

**Esempi:**
```typescript
{
  tag: "advanced-form",
  dependencies: [
    "input-validator",
    "date-picker", 
    "file-uploader"
  ]
}

{
  tag: "dashboard-widget",
  dependencies: [
    "chart-library",
    "data-fetcher"
  ]
}
```

### Internazionalizzazione

#### `languages?: KimuExtensionLanguages`

Configurazione per supporto multilingua.

**Struttura:**
```typescript
{
  languages: {
    default: "en",
    supported: {
      "en": { code: "en", name: "English", file: "en.json" },
      "it": { code: "it", name: "Italiano", file: "it.json" },
      "es": { code: "es", name: "Español", file: "es.json" }
    }
  }
}
```

## Esempi Completi

### Estensione Base

```typescript
const basicExtension: KimuExtensionMeta = {
  tag: "hello-world",
  name: "Hello World Component",
  version: "1.0.0",
  description: "Componente di esempio per introduzione a KIMU",
  author: "KIMU Team",
  icon: "👋"
};
```

### Estensione Avanzata

```typescript
const advancedExtension: KimuExtensionMeta = {
  tag: "data-dashboard",
  name: "Advanced Data Dashboard",
  version: "2.3.1",
  description: "Dashboard completa per visualizzazione e analisi dati con grafici interattivi",
  author: "Data Analytics Team",
  icon: "📊",
  source: "git",
  link: "https://github.com/company/data-dashboard",
  path: "dashboards/advanced-data",
  kimuVersion: "1.1.0",
  enabled: true,
  template: "dashboard-view.html",
  style: "dashboard-theme.css",
  external: {
    css: [
      { path: "https://cdn.chartjs.org/chart.js/3.9.1/chart.min.css", id: "chartjs-css" }
    ],
    js: [
      { path: "https://cdn.chartjs.org/chart.js/3.9.1/chart.min.js", id: "chartjs-lib" }
    ]
  },
  dependencies: [
    "data-fetcher",
    "export-utils",
    "notification-system"
  ],
  languages: {
    default: "en",
    supported: {
      "en": { code: "en", name: "English", file: "en.json" },
      "it": { code: "it", name: "Italiano", file: "it.json" }
    }
  }
};
```

### Estensione del Sistema

```typescript
const systemExtension: KimuExtensionMeta = {
  tag: "kimu-error-handler",
  name: "KIMU Error Handler",
  version: "1.0.0",
  description: "Sistema centrale di gestione errori per il framework",
  author: "KIMU Core Team", 
  icon: "⚠️",
  path: "system/error-handler",
  internal: true,  // Non visibile agli utenti
  enabled: true,
  kimuVersion: "1.0.0"
};
```

## Uso nel Manifest

Il manifest delle estensioni (`extensions-manifest.json`) contiene un array di `KimuExtensionMeta`:

```json
[
  {
    "tag": "kimu-home",
    "name": "KIMU Home Main App", 
    "version": "1.0.0",
    "path": "kimu-home",
    "internal": true,
    "author": "UnicòVerso",
    "icon": "🏠"
  },
  {
    "tag": "user-widget",
    "name": "User Widget",
    "version": "1.2.0", 
    "path": "widgets/user",
    "description": "Widget per gestione profilo utente",
    "dependencies": ["icon-library"]
  }
]
```

## Validazione e Sicurezza

### Validazione Obbligatoria

```typescript
function validateExtensionMeta(meta: KimuExtensionMeta): boolean {
  // Tag obbligatorio e valido
  if (!meta.tag || !meta.tag.includes('-')) {
    throw new Error('Tag obbligatorio e deve contenere un trattino');
  }
  
  // Nome obbligatorio
  if (!meta.name) {
    throw new Error('Nome obbligatorio');
  }
  
  // Versione valida se presente
  if (meta.version && !isValidSemver(meta.version)) {
    throw new Error('Formato versione non valido');
  }
  
  return true;
}
```

### Sanitizzazione Path

```typescript
function sanitizePaths(meta: KimuExtensionMeta): KimuExtensionMeta {
  return {
    ...meta,
    path: meta.path?.replace(/[^a-zA-Z0-9\/\-_]/g, ''),
    template: meta.template?.replace(/[^a-zA-Z0-9\-_.]/g, ''),
    style: meta.style?.replace(/[^a-zA-Z0-9\-_.]/g, '')
  };
}
```

## Best Practices

### ✅ Naming Convention

```typescript
{
  tag: "myapp-user-profile",      // Namespace per evitare conflitti
  name: "User Profile Component", // Nome descrittivo
  version: "1.2.3"               // Semantic versioning
}
```

### ✅ Documentazione Completa

```typescript
{
  tag: "data-table",
  name: "Advanced Data Table",
  description: "Tabella dati con sorting, filtering, pagination e export",
  author: "Frontend Team",
  version: "2.1.0",
  link: "https://docs.company.com/components/data-table"
}
```

### ✅ Gestione Dipendenze

```typescript
{
  tag: "complex-widget",
  dependencies: [
    "base-utils",     // Utilità base sempre necessarie
    "ui-components"   // Componenti UI riutilizzabili
  ],
  kimuVersion: "1.0.0"  // Compatibilità framework
}
```

### ✅ Asset Management

```typescript
{
  tag: "chart-widget",
  external: {
    css: [
      { path: "https://cdn.chartjs.org/chart.min.css", id: "chart-css" }
    ],
    js: [
      { path: "https://cdn.chartjs.org/chart.min.js", id: "chart-js" }
    ]
  }
}
```

## Vedi Anche

- **[@KimuComponent](../decorators/kimu-component.md)** - Decorator che usa questa interfaccia
- **[KimuAsset](./kimu-asset.md)** - Tipi per asset esterni
- **[KimuLang](./kimu-lang.md)** - Configurazione lingue
- **[Manifest](../extensions/manifest.md)** - Struttura manifest estensioni
