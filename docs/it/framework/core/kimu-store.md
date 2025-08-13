# KimuStore

Wrapper per IndexedDB che fornisce persistenza dati per le estensioni del framework KIMU.

## Descrizione

`KimuStore` gestisce la persistenza delle estensioni utilizzando **IndexedDB** come storage del browser. Fornisce un'interfaccia semplificata per:

- **Setup automatico**: Inizializzazione database e object store
- **CRUD operations**: Create, Read, Update, Delete per estensioni
- **Gestione asincrona**: API Promise-based per tutte le operazioni
- **Error handling**: Gestione robusta degli errori IndexedDB

**Configurazione:**
- Database: `kimu-db`
- Object Store: `extensions`
- Primary Key: `tag` (identificativo estensione)

## Utilizzo

### Inizializzazione

```typescript
import { KimuStore } from './core/kimu-store';

// Inizializza IndexedDB (chiamare all'avvio app)
await KimuStore.init();
console.log('✅ IndexedDB inizializzato');
```

### Operazioni Base

```typescript
// Salva estensione
const extension = {
    tag: 'user-widget',
    name: 'User Widget',
    version: '1.2.0',
    path: 'widgets/user',
    author: 'TeamDev'
};

await KimuStore.save(extension);

// Recupera estensione
const userWidget = await KimuStore.get('user-widget');
console.log('Widget trovato:', userWidget?.name);

// Lista tutte le estensioni
const allExtensions = await KimuStore.list();
console.log(`Totale estensioni: ${allExtensions.length}`);

// Rimuovi estensione
await KimuStore.remove('old-widget');
```

### Verifica Stato Database

```typescript
// Verifica se database vuoto (prima volta)
const isEmpty = await KimuStore.isEmpty();
if (isEmpty) {
    console.log('Database vuoto, caricamento manifest iniziale...');
    // Logica di inizializzazione
}
```

## API

### Inizializzazione

#### `init(): Promise<void>`

Inizializza IndexedDB e crea l'object store se non esiste.

**Processo:**
1. Verifica se database già inizializzato
2. Apre connessione a `kimu-db` (versione 1)
3. Crea object store `extensions` con keyPath `tag`
4. Gestisce upgrade del database

**Esempio:**
```typescript
try {
    await KimuStore.init();
    console.log('✅ Store inizializzato');
} catch (error) {
    console.error('❌ Errore inizializzazione:', error);
    // Fallback o retry logic
}
```

### Verifica Stato

#### `isEmpty(): Promise<boolean>`

Verifica se il database è vuoto (nessuna estensione salvata).

**Ritorna:** `Promise<boolean>` - `true` se vuoto, `false` altrimenti

**Uso tipico:** Determinare se caricare manifest iniziale

**Esempio:**
```typescript
const isEmpty = await KimuStore.isEmpty();

if (isEmpty) {
    console.log('🆕 Prima esecuzione, setup iniziale...');
    // Carica manifest di default
    await loadInitialManifest();
} else {
    console.log('💾 Database esistente, caricamento estensioni...');
    const extensions = await KimuStore.list();
    console.log(`Trovate ${extensions.length} estensioni`);
}
```

### Operazioni CRUD

#### `save(entry): Promise<void>`

Salva o aggiorna un'estensione nel database.

**Parametri:**
- `entry: KimuExtensionMeta` - Metadata dell'estensione

**Comportamento:**
- Sovrascrive se estensione già esiste (stesso `tag`)
- Crea nuova entry se non esiste

**Esempio:**
```typescript
const newExtension = {
    tag: 'chart-component',
    name: 'Chart Component',
    version: '2.0.0',
    path: 'components/chart',
    author: 'DataViz Team',
    description: 'Advanced charting component',
    dependencies: ['math-utils'],
    enabled: true
};

await KimuStore.save(newExtension);
console.log('📦 Estensione salvata');

// Aggiornamento versione
newExtension.version = '2.0.1';
await KimuStore.save(newExtension); // Aggiorna entry esistente
```

#### `get(tag): Promise<KimuExtensionMeta | undefined>`

Recupera un'estensione specifica dal database.

**Parametri:**
- `tag: string` - Identificativo univoco dell'estensione

**Ritorna:** `Promise<KimuExtensionMeta | undefined>`

**Esempio:**
```typescript
const extension = await KimuStore.get('user-profile');

if (extension) {
    console.log(`Trovata: ${extension.name} v${extension.version}`);
    console.log(`Autore: ${extension.author}`);
    console.log(`Path: ${extension.path}`);
} else {
    console.log('❌ Estensione non trovata');
}
```

#### `list(): Promise<KimuExtensionMeta[]>`

Recupera tutte le estensioni salvate nel database.

**Ritorna:** `Promise<KimuExtensionMeta[]>` - Array di tutte le estensioni

**Esempio:**
```typescript
const extensions = await KimuStore.list();

console.log(`📋 Estensioni disponibili (${extensions.length}):`);
extensions.forEach(ext => {
    const status = ext.enabled ? '✅' : '❌';
    console.log(`  ${status} ${ext.name} (${ext.tag}) v${ext.version}`);
});

// Filtra per autore
const myExtensions = extensions.filter(e => e.author === 'MyTeam');
console.log(`🏷️ Mie estensioni: ${myExtensions.length}`);
```

#### `remove(tag): Promise<void>`

Rimuove un'estensione dal database.

**Parametri:**
- `tag: string` - Identificativo dell'estensione da rimuovere

**Esempio:**
```typescript
try {
    await KimuStore.remove('deprecated-widget');
    console.log('🗑️ Estensione rimossa');
} catch (error) {
    console.error('❌ Errore rimozione:', error);
}

// Rimozione condizionale
const extension = await KimuStore.get('old-component');
if (extension && extension.version.startsWith('1.')) {
    await KimuStore.remove('old-component');
    console.log('🧹 Versione obsoleta rimossa');
}
```

#### `clear(): Promise<void>`

Svuota completamente il database (rimuove tutte le estensioni).

**⚠️ Attenzione:** Operazione irreversibile

**Esempio:**
```typescript
// Conferma prima di procedere
const confirmClear = confirm('Sei sicuro di voler svuotare il database?');
if (confirmClear) {
    await KimuStore.clear();
    console.log('🧹 Database svuotato');
    
    // Reinizializza con manifest di default
    await loadDefaultExtensions();
}
```

## Esempi Avanzati

### Migration Manager

```typescript
class MigrationManager {
    static async migrateExtensions(): Promise<void> {
        console.log('🔄 Inizio migrazione estensioni...');
        
        const extensions = await KimuStore.list();
        let migratedCount = 0;
        
        for (const ext of extensions) {
            let needsMigration = false;
            
            // Migrazione 1: Aggiungi campo 'enabled' se mancante
            if (ext.enabled === undefined) {
                ext.enabled = true;
                needsMigration = true;
            }
            
            // Migrazione 2: Normalizza versioni
            if (ext.version && !ext.version.match(/^\d+\.\d+\.\d+$/)) {
                ext.version = '1.0.0';
                needsMigration = true;
            }
            
            // Migrazione 3: Aggiungi campo 'internal' per estensioni core
            if (['kimu-home', 'kimu-core'].includes(ext.tag) && ext.internal === undefined) {
                ext.internal = true;
                needsMigration = true;
            }
            
            if (needsMigration) {
                await KimuStore.save(ext);
                migratedCount++;
                console.log(`✅ Migrata: ${ext.tag}`);
            }
        }
        
        console.log(`🎉 Migrazione completata: ${migratedCount} estensioni aggiornate`);
    }
}

// Esegui migrazione all'avvio
await MigrationManager.migrateExtensions();
```

### Extension Analytics

```typescript
class ExtensionAnalytics {
    static async getAnalytics(): Promise<any> {
        const extensions = await KimuStore.list();
        
        const analytics = {
            total: extensions.length,
            enabled: extensions.filter(e => e.enabled !== false).length,
            disabled: extensions.filter(e => e.enabled === false).length,
            internal: extensions.filter(e => e.internal === true).length,
            external: extensions.filter(e => e.internal !== true).length,
            
            byAuthor: this.groupBy(extensions, 'author'),
            byVersion: this.analyzeVersions(extensions),
            withDependencies: extensions.filter(e => e.dependencies?.length > 0).length,
            
            lastUpdated: this.getLastUpdateInfo(extensions)
        };
        
        return analytics;
    }
    
    private static groupBy(extensions: any[], field: string): Record<string, number> {
        return extensions.reduce((acc, ext) => {
            const value = ext[field] || 'Unknown';
            acc[value] = (acc[value] || 0) + 1;
            return acc;
        }, {});
    }
    
    private static analyzeVersions(extensions: any[]): any {
        const versions = extensions.map(e => e.version).filter(Boolean);
        return {
            unique: [...new Set(versions)].length,
            latest: versions.sort((a, b) => b.localeCompare(a))[0],
            distribution: this.groupBy(extensions, 'version')
        };
    }
    
    private static getLastUpdateInfo(extensions: any[]): any {
        // Assumendo che ci sia un campo lastUpdated
        const withDates = extensions.filter(e => e.lastUpdated);
        const sorted = withDates.sort((a, b) => 
            new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
        );
        
        return {
            mostRecent: sorted[0]?.tag,
            date: sorted[0]?.lastUpdated,
            totalWithDates: withDates.length
        };
    }
    
    static async printReport(): Promise<void> {
        const analytics = await this.getAnalytics();
        
        console.log('📊 Report Estensioni:');
        console.log(`   📦 Totali: ${analytics.total}`);
        console.log(`   ✅ Abilitate: ${analytics.enabled}`);
        console.log(`   ❌ Disabilitate: ${analytics.disabled}`);
        console.log(`   🏠 Interne: ${analytics.internal}`);
        console.log(`   🌐 Esterne: ${analytics.external}`);
        console.log(`   🔗 Con dipendenze: ${analytics.withDependencies}`);
        console.log(`   👥 Autori:`, analytics.byAuthor);
        console.log(`   🏷️ Versioni:`, analytics.byVersion.distribution);
    }
}

// Genera report
await ExtensionAnalytics.printReport();
```

### Backup & Restore

```typescript
class BackupManager {
    static async createBackup(): Promise<string> {
        const extensions = await KimuStore.list();
        const backup = {
            version: '1.0',
            timestamp: new Date().toISOString(),
            extensions: extensions
        };
        
        const backupString = JSON.stringify(backup, null, 2);
        console.log(`💾 Backup creato: ${extensions.length} estensioni`);
        
        return backupString;
    }
    
    static async restoreFromBackup(backupString: string): Promise<void> {
        try {
            const backup = JSON.parse(backupString);
            
            if (!backup.extensions || !Array.isArray(backup.extensions)) {
                throw new Error('Formato backup non valido');
            }
            
            // Conferma prima di sovrascrivere
            const current = await KimuStore.list();
            console.log(`⚠️ Attenzione: ${current.length} estensioni esistenti verranno sostituite`);
            console.log(`📥 Backup contiene ${backup.extensions.length} estensioni`);
            
            // Svuota database
            await KimuStore.clear();
            
            // Ripristina estensioni
            for (const ext of backup.extensions) {
                await KimuStore.save(ext);
            }
            
            console.log(`✅ Ripristino completato: ${backup.extensions.length} estensioni`);
            
        } catch (error) {
            console.error('❌ Errore ripristino backup:', error);
            throw error;
        }
    }
    
    static async exportToFile(): Promise<void> {
        const backup = await this.createBackup();
        const blob = new Blob([backup], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `kimu-extensions-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
        console.log('💾 Backup salvato come file');
    }
}

// Crea ed esporta backup
await BackupManager.exportToFile();
```

### Smart Sync Manager

```typescript
class SmartSyncManager {
    static async syncWithManifest(manifest: any[]): Promise<void> {
        console.log('🔄 Sincronizzazione intelligente...');
        
        const stored = await KimuStore.list();
        const storedMap = new Map(stored.map(e => [e.tag, e]));
        
        let added = 0;
        let updated = 0;
        let removed = 0;
        
        // Aggiungi/aggiorna dal manifest
        for (const manifestItem of manifest) {
            const existing = storedMap.get(manifestItem.tag);
            
            if (!existing) {
                await KimuStore.save(manifestItem);
                added++;
                console.log(`➕ Aggiunta: ${manifestItem.tag}`);
            } else if (this.needsUpdate(existing, manifestItem)) {
                // Preserva impostazioni utente
                const merged = {
                    ...manifestItem,
                    enabled: existing.enabled, // Mantieni preferenza utente
                    userSettings: existing.userSettings // Mantieni impostazioni custom
                };
                
                await KimuStore.save(merged);
                updated++;
                console.log(`🔄 Aggiornata: ${manifestItem.tag} (${existing.version} → ${manifestItem.version})`);
            }
        }
        
        // Rimuovi estensioni non più nel manifest (opzionale)
        const manifestTags = new Set(manifest.map(m => m.tag));
        for (const stored of storedMap.values()) {
            if (!manifestTags.has(stored.tag) && !stored.internal) {
                await KimuStore.remove(stored.tag);
                removed++;
                console.log(`➖ Rimossa: ${stored.tag}`);
            }
        }
        
        console.log(`✅ Sync completata: +${added} ~${updated} -${removed}`);
    }
    
    private static needsUpdate(existing: any, manifest: any): boolean {
        return (
            existing.version !== manifest.version ||
            existing.path !== manifest.path ||
            existing.name !== manifest.name ||
            JSON.stringify(existing.dependencies) !== JSON.stringify(manifest.dependencies)
        );
    }
}
```

## Gestione Errori

### Error Handling Robusto

```typescript
class SafeKimuStore {
    static async safeGet(tag: string): Promise<any | null> {
        try {
            return await KimuStore.get(tag);
        } catch (error) {
            console.error(`Errore lettura ${tag}:`, error);
            return null;
        }
    }
    
    static async safeSave(extension: any): Promise<boolean> {
        try {
            await KimuStore.save(extension);
            return true;
        } catch (error) {
            console.error(`Errore salvataggio ${extension.tag}:`, error);
            return false;
        }
    }
    
    static async safeInit(): Promise<boolean> {
        try {
            await KimuStore.init();
            return true;
        } catch (error) {
            console.error('Errore inizializzazione IndexedDB:', error);
            
            // Fallback: localStorage
            console.log('📱 Fallback a localStorage...');
            return this.initLocalStorageFallback();
        }
    }
    
    private static initLocalStorageFallback(): boolean {
        try {
            localStorage.setItem('kimu-test', 'test');
            localStorage.removeItem('kimu-test');
            console.log('✅ LocalStorage disponibile come fallback');
            return true;
        } catch {
            console.error('❌ Nessun storage disponibile');
            return false;
        }
    }
}
```

## Best Practices

### ✅ Inizializzazione Sicura

```typescript
async function initStorage(): Promise<void> {
    try {
        await KimuStore.init();
        
        // Verifica funzionamento
        const testKey = 'test-extension';
        await KimuStore.save({ tag: testKey, name: 'Test' });
        await KimuStore.get(testKey);
        await KimuStore.remove(testKey);
        
        console.log('✅ Storage funzionante');
    } catch (error) {
        console.error('❌ Storage non disponibile:', error);
        // Implementa fallback
    }
}
```

### ✅ Operazioni Batch

```typescript
async function batchSave(extensions: any[]): Promise<void> {
    console.log(`💾 Salvataggio batch di ${extensions.length} estensioni...`);
    
    const results = await Promise.allSettled(
        extensions.map(ext => KimuStore.save(ext))
    );
    
    const succeeded = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.length - succeeded;
    
    console.log(`✅ Salvate: ${succeeded}, ❌ Fallite: ${failed}`);
}
```

### ✅ Performance Monitoring

```typescript
async function timedOperation<T>(operation: () => Promise<T>, label: string): Promise<T> {
    const start = performance.now();
    const result = await operation();
    const duration = performance.now() - start;
    
    console.log(`⏱️ ${label}: ${duration.toFixed(2)}ms`);
    return result;
}

// Uso
const extensions = await timedOperation(
    () => KimuStore.list(),
    'Caricamento estensioni'
);
```

## Vedi Anche

- **[KimuExtensionManager](./kimu-extension-manager.md)** - Gestore che usa KimuStore
- **[Manifest](../extensions/manifest.md)** - Struttura dati estensioni
- **[Data Persistence](../patterns/data-persistence.md)** - Pattern di persistenza
- **[Error Handling](../patterns/error-handling.md)** - Gestione errori
