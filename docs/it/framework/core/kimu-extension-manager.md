# KimuExtensionManager

Gestore singleton per il caricamento, la sincronizzazione e la gestione dinamica delle estensioni nel framework KIMU.

## Descrizione

`KimuExtensionManager` è il cuore del sistema modulare di KIMU. Gestisce tutto il ciclo di vita delle estensioni:

- **Inizializzazione**: Caricamento manifest e setup IndexedDB
- **Sincronizzazione**: Allineamento tra manifest JSON e database
- **Caricamento dinamico**: Import on-demand delle estensioni
- **Registry**: Tracciamento estensioni caricate e disponibili

**Pattern Singleton** garantisce una gestione centralizzata e consistente.

## Utilizzo

### Inizializzazione

```typescript
import { KimuExtensionManager } from './core/kimu-extension-manager';

// Ottieni l'istanza singleton
const manager = KimuExtensionManager.getInstance();

// Inizializza il sistema (da chiamare una volta all'avvio)
await manager.init();
```

### Caricamento Estensioni

```typescript
// Carica una singola estensione
await manager.load('kimu-app');

// Carica più estensioni
const extensions = ['header-component', 'footer-component', 'sidebar'];
for (const ext of extensions) {
    await manager.load(ext);
}
```

### Gestione Registry

```typescript
// Lista estensioni disponibili
const available = manager.listAvailable();
console.log('Estensioni disponibili:', available.map(e => e.name));

// Verifica se un'estensione è caricata
if (manager.isLoaded('my-widget')) {
    console.log('Widget già caricato');
} else {
    await manager.load('my-widget');
}

// Ottieni metadata estensione
const meta = manager.get('kimu-app');
console.log(`${meta?.name} v${meta?.version}`);
```

## API

### Metodi Statici

#### `getInstance(): KimuExtensionManager`

Restituisce l'istanza singleton del gestore estensioni.

**Ritorna:** `KimuExtensionManager`

**Esempio:**
```typescript
const manager = KimuExtensionManager.getInstance();
```

### Inizializzazione

#### `init(): Promise<void>`

Inizializza il sistema di estensioni:
1. Setup IndexedDB store
2. Caricamento manifest iniziale
3. Sincronizzazione database/manifest
4. Popolazione registry in memoria

**Esempio:**
```typescript
const manager = KimuExtensionManager.getInstance();
await manager.init();
console.log('✅ Sistema estensioni inizializzato');
```

### Caricamento Dinamico

#### `load(tag): Promise<void>`

Carica dinamicamente un'estensione se non già caricata.

**Parametri:**
- `tag: string` - Tag identificativo dell'estensione

**Processo:**
1. Verifica se già caricata
2. Risolve dipendenze
3. Import dinamico del modulo
4. Registrazione automatica del Web Component

**Esempio:**
```typescript
// Caricamento semplice
await manager.load('user-profile');

// Caricamento con gestione errori
try {
    await manager.load('advanced-widget');
    console.log('Widget caricato con successo');
} catch (error) {
    console.error('Errore caricamento widget:', error);
}
```

### Registry e Query

#### `listAvailable(): KimuExtensionMeta[]`

Restituisce tutte le estensioni disponibili in memoria.

**Ritorna:** `KimuExtensionMeta[]`

**Esempio:**
```typescript
const extensions = manager.listAvailable();

extensions.forEach(ext => {
    console.log(`📦 ${ext.name} (${ext.tag}) v${ext.version}`);
    if (ext.description) {
        console.log(`   ${ext.description}`);
    }
});
```

#### `list(): Promise<KimuExtensionMeta[]>`

Restituisce tutte le estensioni salvate in IndexedDB.

**Ritorna:** `Promise<KimuExtensionMeta[]>`

**Esempio:**
```typescript
const stored = await manager.list();
console.log(`💾 Estensioni in database: ${stored.length}`);
```

#### `get(tag): KimuExtensionMeta | undefined`

Ottiene i metadata di un'estensione specifica.

**Parametri:**
- `tag: string` - Tag dell'estensione

**Ritorna:** `KimuExtensionMeta | undefined`

**Esempio:**
```typescript
const appMeta = manager.get('kimu-app');
if (appMeta) {
    console.log(`App principale: ${appMeta.name}`);
    console.log(`Versione: ${appMeta.version}`);
    console.log(`Autore: ${appMeta.author}`);
}
```

#### `getTags(): string[]`

Restituisce i tag di tutte le estensioni disponibili.

**Ritorna:** `string[]`

**Esempio:**
```typescript
const tags = manager.getTags();
console.log('Tag disponibili:', tags.join(', '));
```

#### `isLoaded(tag): boolean`

Verifica se un'estensione è stata caricata.

**Parametri:**
- `tag: string` - Tag dell'estensione

**Ritorna:** `boolean`

**Esempio:**
```typescript
if (!manager.isLoaded('optional-feature')) {
    // Carica solo se necessario
    await manager.load('optional-feature');
}
```

### Gestione Manifest

#### `reloadManifest(): Promise<void>`

Ricarica il manifest delle estensioni dal file remoto e aggiorna il database.

**Uso tipico:** Aggiornamento runtime delle estensioni disponibili

**Esempio:**
```typescript
// Aggiornamento periodico
setInterval(async () => {
    try {
        await manager.reloadManifest();
        console.log('📄 Manifest aggiornato');
    } catch (error) {
        console.warn('Errore aggiornamento manifest:', error);
    }
}, 300000); // Ogni 5 minuti
```

## Struttura Manifest

Il manifest delle estensioni (`extensions-manifest.json`) definisce le estensioni disponibili:

```json
[
  {
    "tag": "kimu-app",
    "path": "kimu-app",
    "internal": true,
    "name": "KIMU Main App",
    "description": "Main interface container",
    "version": "1.0.0",
    "author": "UnicòVerso",
    "icon": "🏠",
    "kimuVersion": "1.0.0",
    "dependencies": []
  },
  {
    "tag": "user-widget",
    "path": "widgets/user-widget",
    "name": "User Widget",
    "description": "Display user information",
    "version": "2.1.0",
    "author": "Community",
    "icon": "👤",
    "dependencies": ["base-utils", "icon-library"]
  }
]
```

## Gestione Dipendenze

Il sistema risolve automaticamente le dipendenze:

```typescript
// Extension A dipende da B e C
{
  "tag": "extension-a",
  "dependencies": ["extension-b", "extension-c"]
}

// Caricando A, vengono automaticamente caricate B e C
await manager.load('extension-a');
// → carica extension-b
// → carica extension-c  
// → carica extension-a
```

## Esempi Avanzati

### Loader di Estensioni Condizionale

```typescript
class ConditionalLoader {
    static async loadByFeature(feature: string): Promise<void> {
        const manager = KimuExtensionManager.getInstance();
        
        const featureMap = {
            'user-management': ['user-profile', 'user-settings', 'user-permissions'],
            'data-visualization': ['charts-widget', 'tables-widget', 'graphs-widget'],
            'content-editing': ['rich-editor', 'image-uploader', 'file-manager']
        };
        
        const extensions = featureMap[feature] || [];
        
        for (const ext of extensions) {
            if (!manager.isLoaded(ext)) {
                console.log(`🔄 Caricamento ${ext} per feature ${feature}`);
                await manager.load(ext);
            }
        }
    }
}

// Uso
await ConditionalLoader.loadByFeature('user-management');
```

### Dashboard delle Estensioni

```typescript
class ExtensionDashboard {
    static async getStatus(): Promise<any> {
        const manager = KimuExtensionManager.getInstance();
        const available = manager.listAvailable();
        
        return {
            total: available.length,
            loaded: available.filter(e => manager.isLoaded(e.tag)).length,
            internal: available.filter(e => e.internal).length,
            byAuthor: this.groupByAuthor(available),
            versions: available.map(e => ({ tag: e.tag, version: e.version }))
        };
    }
    
    private static groupByAuthor(extensions: any[]): Record<string, number> {
        return extensions.reduce((acc, ext) => {
            const author = ext.author || 'Unknown';
            acc[author] = (acc[author] || 0) + 1;
            return acc;
        }, {});
    }
    
    static async printReport(): Promise<void> {
        const status = await this.getStatus();
        
        console.log('📊 Rapporto Estensioni:');
        console.log(`   Totali: ${status.total}`);
        console.log(`   Caricate: ${status.loaded}`);
        console.log(`   Interne: ${status.internal}`);
        console.log(`   Per autore:`, status.byAuthor);
    }
}

// Uso
await ExtensionDashboard.printReport();
```

### Hot Reload di Estensioni

```typescript
class HotReloader {
    private static loadedModules = new Map<string, any>();
    
    static async hotReload(tag: string): Promise<void> {
        const manager = KimuExtensionManager.getInstance();
        const meta = manager.get(tag);
        
        if (!meta) {
            console.warn(`❌ Estensione ${tag} non trovata`);
            return;
        }
        
        try {
            // Rimuovi componente esistente
            if (customElements.get(tag)) {
                console.log(`🔄 Hot reload di ${tag}`);
                
                // Ricarica modulo con cache-busting
                const modulePath = `/extensions/${meta.path}/component.js?t=${Date.now()}`;
                const newModule = await import(/* @vite-ignore */ modulePath);
                
                this.loadedModules.set(tag, newModule);
                console.log(`✅ ${tag} ricaricato`);
            }
        } catch (error) {
            console.error(`❌ Errore hot reload ${tag}:`, error);
        }
    }
}

// Uso in sviluppo
if (isDevelopment) {
    await HotReloader.hotReload('my-component');
}
```

### Lazy Loading Intelligente

```typescript
class IntelligentLoader {
    private static loadQueue = new Set<string>();
    private static loading = new Map<string, Promise<void>>();
    
    static async lazyLoad(tag: string): Promise<void> {
        const manager = KimuExtensionManager.getInstance();
        
        // Evita caricamenti duplicati
        if (manager.isLoaded(tag) || this.loading.has(tag)) {
            return this.loading.get(tag);
        }
        
        const loadPromise = this.performLoad(tag);
        this.loading.set(tag, loadPromise);
        
        try {
            await loadPromise;
        } finally {
            this.loading.delete(tag);
        }
    }
    
    private static async performLoad(tag: string): Promise<void> {
        const manager = KimuExtensionManager.getInstance();
        
        console.log(`⏳ Lazy loading ${tag}...`);
        const startTime = performance.now();
        
        await manager.load(tag);
        
        const endTime = performance.now();
        console.log(`⚡ ${tag} caricato in ${(endTime - startTime).toFixed(2)}ms`);
    }
    
    static async preloadCritical(): Promise<void> {
        const criticalExtensions = ['kimu-app', 'error-handler', 'loading-spinner'];
        
        await Promise.all(
            criticalExtensions.map(tag => this.lazyLoad(tag))
        );
    }
}
```

## Best Practices

### ✅ Inizializzazione Corretta

```typescript
// All'avvio dell'app
async function initializeApp(): Promise<void> {
    const manager = KimuExtensionManager.getInstance();
    
    // 1. Inizializza sistema
    await manager.init();
    
    // 2. Carica estensioni critiche
    await manager.load('kimu-app');
    
    // 3. Pre-carica estensioni comuni
    const common = ['header', 'footer', 'navigation'];
    await Promise.all(common.map(tag => manager.load(tag)));
}
```

### ✅ Gestione Errori

```typescript
async function safeLoadExtension(tag: string): Promise<boolean> {
    const manager = KimuExtensionManager.getInstance();
    
    try {
        await manager.load(tag);
        return true;
    } catch (error) {
        console.error(`Errore caricamento ${tag}:`, error);
        
        // Fallback o retry logic
        return false;
    }
}
```

### ✅ Performance Monitoring

```typescript
class ExtensionProfiler {
    static async profileLoad(tag: string): Promise<void> {
        const manager = KimuExtensionManager.getInstance();
        
        const start = performance.now();
        await manager.load(tag);
        const end = performance.now();
        
        console.log(`⏱️ ${tag}: ${(end - start).toFixed(2)}ms`);
    }
}
```

## Vedi Anche

- **[KimuStore](./kimu-store.md)** - Persistenza IndexedDB
- **[KimuEngine](./kimu-engine.md)** - Caricamento componenti
- **[Manifest](../extensions/manifest.md)** - Configurazione estensioni
- **[Creare Estensioni](../extensions/creating-extensions.md)** - Guida sviluppo
