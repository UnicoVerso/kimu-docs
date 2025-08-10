# KimuApp

Classe singleton che gestisce la configurazione globale e il ciclo di vita dell'applicazione KIMU.

## Descrizione

La classe `KimuApp` rappresenta il cuore dell'applicazione KIMU. È implementata come singleton per garantire una singola istanza globale durante tutto il ciclo di vita dell'applicazione.

**Responsabilità principali:**
- Gestione della configurazione di sistema
- Controllo dell'ambiente di esecuzione (local, dev, prod)
- Inizializzazione del framework
- Accesso centralizzato alle impostazioni globali

## Utilizzo

### Ottenere l'Istanza

```typescript
import { KimuApp } from './core/kimu-app';

// Ottieni l'istanza singleton (async)
const kimuApp = await KimuApp.getInstance();
```

### Accedere alla Configurazione

```typescript
// Ottieni la configurazione completa
const config = kimuApp.config;

// Ottieni informazioni specifiche
console.log('Versione:', kimuApp.version);
console.log('Ambiente:', kimuApp.environment);
```

### Controllo Ambiente

```typescript
// Verifica l'ambiente di esecuzione
if (kimuApp.isLocal()) {
    console.log('Modalità sviluppo locale');
}

if (kimuApp.isDev()) {
    console.log('Modalità development');
}

if (kimuApp.isProd()) {
    console.log('Modalità production');
}
```

## API

### Metodi Statici

#### `getInstance(): Promise<KimuApp>`

Restituisce l'istanza singleton della classe, inizializzandola se necessario.

**Ritorna:** `Promise<KimuApp>` - L'istanza singleton

**Esempio:**
```typescript
const app = await KimuApp.getInstance();
```

### Proprietà

#### `config: any`

Configurazione completa del sistema caricata dal file di configurazione.

**Tipo:** `any`  
**Accesso:** `readonly`

**Esempio:**
```typescript
const appConfig = kimuApp.config;
console.log(appConfig.build['api-url']);
```

#### `version: string`

Versione corrente del framework KIMU.

**Tipo:** `string`  
**Accesso:** `readonly`

**Esempio:**
```typescript
console.log(`KIMU v${kimuApp.version}`);
```

#### `environment: string`

Ambiente di esecuzione corrente ('local', 'dev', 'staging', 'prod').

**Tipo:** `string`  
**Accesso:** `readonly`

### Metodi di Utilità

#### `isLocal(): boolean`

Verifica se l'applicazione è in esecuzione in ambiente locale.

**Ritorna:** `boolean`

#### `isDev(): boolean`

Verifica se l'applicazione è in esecuzione in ambiente di sviluppo.

**Ritorna:** `boolean`

#### `isProd(): boolean`

Verifica se l'applicazione è in esecuzione in ambiente di produzione.

**Ritorna:** `boolean`

## Configurazione

La configurazione viene caricata dal file `kimu-build-config.ts`:

```typescript
export const KimuBuildConfig = {
  "version": "0.1.0",
  "environment": "dev",
  "build": {
    "environment": "dev",
    "api-url": "http://localhost:3000",
    "web-url": "http://localhost:5173"
  }
} as const;
```

## Pattern di Design

`KimuApp` implementa il **Singleton Pattern** per garantire:
- Una sola istanza di configurazione globale
- Accesso centralizzato alle impostazioni
- Consistenza durante tutto il ciclo di vita

## Esempi Completi

### Inizializzazione Base

```typescript
import { KimuApp } from './core/kimu-app';

async function initializeApp() {
    try {
        const kimuApp = await KimuApp.getInstance();
        
        console.log(`🚀 KIMU v${kimuApp.version} avviato`);
        console.log(`📍 Ambiente: ${kimuApp.environment}`);
        
        // Configurazione specifica per ambiente
        if (kimuApp.isDev()) {
            console.log('🔧 Modalità debug attiva');
        }
        
    } catch (error) {
        console.error('❌ Errore inizializzazione:', error);
    }
}
```

### Configurazione Condizionale

```typescript
const kimuApp = await KimuApp.getInstance();

// URL API basato sull'ambiente
const apiUrl = kimuApp.config.build['api-url'];

// Impostazioni debug
const debugMode = kimuApp.isDev() || kimuApp.isLocal();

// Configurazione logging
const logLevel = kimuApp.isProd() ? 'error' : 'debug';
```

## Vedi Anche

- **[KimuEngine](./kimu-engine.md)** - Motore di rendering
- **[KimuExtensionManager](./kimu-extension-manager.md)** - Gestione estensioni
- **[Guida: Iniziare](../guide/get-started.md)** - Primi passi con KIMU
- **[Configurazione](../guide/configuration.md)** - Configurazione avanzata
