# Singleton Pattern

Il pattern Singleton garantisce che una classe abbia una sola istanza nell'applicazione e fornisce un punto di accesso globale a tale istanza.

## Problema

In KIMU, alcuni componenti devono essere unici nell'applicazione:
- **KimuStore**: Gestione centralizzata dello stato
- **KimuExtensionManager**: Gestione delle estensioni
- **KimuAssetManager**: Gestione degli asset
- **KimuEngine**: Motore principale del framework

Avere multiple istanze di questi componenti porterebbe a:
- Inconsistenza dello stato
- Spreco di risorse
- Comportamenti imprevedibili
- Difficoltà di sincronizzazione

## Soluzione

Il pattern Singleton implementa:
1. Un costruttore privato per impedire istanziazione diretta
2. Un metodo statico `getInstance()` per accesso controllato
3. Una variabile statica per mantenere l'istanza unica

## Implementazione in KIMU

### KimuStore Singleton

```typescript
export class KimuStore {
  private static instance: KimuStore;
  private state: Map<string, any> = new Map();
  private subscribers: Map<string, Array<(state: any) => void>> = new Map();

  // Costruttore privato
  private constructor() {
    console.log('KimuStore instance created');
  }

  // Metodo statico per ottenere l'istanza
  public static getInstance(): KimuStore {
    if (!KimuStore.instance) {
      KimuStore.instance = new KimuStore();
    }
    return KimuStore.instance;
  }

  // Metodi dell'istanza
  public setState(key: string, value: any): void {
    this.state.set(key, value);
    this.notifySubscribers(key, value);
  }

  public getState(key: string): any {
    return this.state.get(key);
  }

  public subscribe(key: string, callback: (state: any) => void): () => void {
    if (!this.subscribers.has(key)) {
      this.subscribers.set(key, []);
    }
    
    this.subscribers.get(key)!.push(callback);

    // Ritorna funzione per annullare sottoscrizione
    return () => {
      const callbacks = this.subscribers.get(key);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    };
  }

  private notifySubscribers(key: string, value: any): void {
    const callbacks = this.subscribers.get(key);
    if (callbacks) {
      callbacks.forEach(callback => callback(value));
    }
  }

  // Metodo per reset (utile per testing)
  public static reset(): void {
    KimuStore.instance = null as any;
  }
}
```

### KimuExtensionManager Singleton

```typescript
export class KimuExtensionManager {
  private static instance: KimuExtensionManager;
  private extensions: Map<string, ExtensionMeta> = new Map();
  private loadedExtensions: Set<string> = new Set();

  private constructor() {
    this.initializeManager();
  }

  public static getInstance(): KimuExtensionManager {
    if (!KimuExtensionManager.instance) {
      KimuExtensionManager.instance = new KimuExtensionManager();
    }
    return KimuExtensionManager.instance;
  }

  private initializeManager(): void {
    console.log('Initializing Extension Manager');
    this.loadExtensionsManifest();
  }

  public async loadExtension(tag: string): Promise<boolean> {
    if (this.loadedExtensions.has(tag)) {
      console.log(`Extension ${tag} already loaded`);
      return true;
    }

    try {
      const extensionMeta = this.extensions.get(tag);
      if (!extensionMeta) {
        throw new Error(`Extension ${tag} not found in manifest`);
      }

      await this.loadExtensionScript(extensionMeta);
      this.loadedExtensions.add(tag);
      
      console.log(`Extension ${tag} loaded successfully`);
      return true;
    } catch (error) {
      console.error(`Failed to load extension ${tag}:`, error);
      return false;
    }
  }

  private async loadExtensionScript(meta: ExtensionMeta): Promise<void> {
    const script = document.createElement('script');
    script.type = 'module';
    script.src = `./dist/extensions/${meta.path}/component.js`;
    
    return new Promise((resolve, reject) => {
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load script for ${meta.tag}`));
      document.head.appendChild(script);
    });
  }

  public static reset(): void {
    KimuExtensionManager.instance = null as any;
  }
}
```

### KimuAssetManager Singleton

```typescript
export class KimuAssetManager {
  private static instance: KimuAssetManager;
  private assetCache: Map<string, string> = new Map();
  private loadingPromises: Map<string, Promise<string>> = new Map();

  private constructor() {
    this.initializeAssetManager();
  }

  public static getInstance(): KimuAssetManager {
    if (!KimuAssetManager.instance) {
      KimuAssetManager.instance = new KimuAssetManager();
    }
    return KimuAssetManager.instance;
  }

  private initializeAssetManager(): void {
    console.log('Asset Manager initialized');
  }

  public async getAsset(path: string): Promise<string> {
    // Controlla cache
    if (this.assetCache.has(path)) {
      return this.assetCache.get(path)!;
    }

    // Controlla se già in caricamento
    if (this.loadingPromises.has(path)) {
      return this.loadingPromises.get(path)!;
    }

    // Avvia nuovo caricamento
    const loadingPromise = this.loadAsset(path);
    this.loadingPromises.set(path, loadingPromise);

    try {
      const assetUrl = await loadingPromise;
      this.assetCache.set(path, assetUrl);
      this.loadingPromises.delete(path);
      return assetUrl;
    } catch (error) {
      this.loadingPromises.delete(path);
      throw error;
    }
  }

  private async loadAsset(path: string): Promise<string> {
    const response = await fetch(`/assets/${path}`);
    if (!response.ok) {
      throw new Error(`Failed to load asset: ${path}`);
    }
    
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  }

  public preloadAssets(paths: string[]): Promise<void[]> {
    return Promise.all(paths.map(path => this.getAsset(path).then(() => {})));
  }

  public clearCache(): void {
    // Revoca URL oggetti per liberare memoria
    this.assetCache.forEach(url => {
      if (url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
      }
    });
    
    this.assetCache.clear();
  }

  public static reset(): void {
    if (KimuAssetManager.instance) {
      KimuAssetManager.instance.clearCache();
    }
    KimuAssetManager.instance = null as any;
  }
}
```

## Utilizzo

### Accesso alle Istanze Singleton

```typescript
// In qualsiasi parte dell'applicazione
const store = KimuStore.getInstance();
store.setState('user', { name: 'Marco', role: 'admin' });

const extensionManager = KimuExtensionManager.getInstance();
await extensionManager.loadExtension('my-extension');

const assetManager = KimuAssetManager.getInstance();
const logoUrl = await assetManager.getAsset('logo.png');
```

### Nelle Estensioni

```typescript
@KimuComponent({
  tag: 'my-extension',
  name: 'My Extension'
})
export class MyExtension extends HTMLElement {
  private store = KimuStore.getInstance();
  private assetManager = KimuAssetManager.getInstance();

  connectedCallback() {
    this.render();
    
    // Sottoscrivi ai cambiamenti dello store
    this.store.subscribe('theme', (theme) => {
      this.updateTheme(theme);
    });
  }

  private async render() {
    const logoUrl = await this.assetManager.getAsset('my-extension/logo.svg');
    
    this.innerHTML = `
      <div class="extension-header">
        <img src="${logoUrl}" alt="Logo" />
        <h2>My Extension</h2>
      </div>
    `;
  }
}
```

## Vantaggi

### Controllo di Istanze
- **Una sola istanza**: Garantisce una sola istanza per tutta l'applicazione
- **Accesso globale**: Facile accesso da qualsiasi parte del codice
- **Inizializzazione lazy**: L'istanza viene creata solo quando necessaria

### Gestione delle Risorse
- **Condivisione di stato**: Stato centralizzato e condiviso
- **Cache condivisa**: Cache degli asset condivisa tra tutti i componenti
- **Efficienza memoria**: Evita duplicazione di istanze pesanti

### Coerenza
- **Configurazione unica**: Una sola configurazione per tutto il sistema
- **Sincronizzazione**: Tutti i componenti vedono lo stesso stato
- **Debug semplificato**: Un punto centrale per debug e monitoring

## Svantaggi

### Testing
- **Stato globale**: Può rendere i test interdipendenti
- **Difficoltà di mock**: Difficile fare mock per unit test
- **Cleanup necessario**: Richiede reset tra test

```typescript
// Soluzione per testing
describe('MyExtension', () => {
  afterEach(() => {
    // Reset singleton per test isolati
    KimuStore.reset();
    KimuExtensionManager.reset();
    KimuAssetManager.reset();
  });

  it('should work correctly', () => {
    const extension = new MyExtension();
    // Test...
  });
});
```

### Accoppiamento
- **Dipendenza implicita**: Crea dipendenze implicite difficili da tracciare
- **Rigidità**: Difficile cambiare implementazione
- **Dependency injection**: Rende difficile l'iniezione di dipendenze

### Concorrenza
- **Thread safety**: Potenziali problemi in ambienti multi-thread (meno rilevante in JS)
- **Race conditions**: Possibili in inizializzazione asincrona

## Varianti

### Lazy Singleton

```typescript
export class LazyKimuService {
  private static _instance?: LazyKimuService;

  public static get instance(): LazyKimuService {
    if (!LazyKimuService._instance) {
      LazyKimuService._instance = new LazyKimuService();
    }
    return LazyKimuService._instance;
  }

  private constructor() {
    // Inizializzazione pesante solo quando necessaria
  }
}

// Uso
const service = LazyKimuService.instance;
```

### Registry Singleton

```typescript
export class ServiceRegistry {
  private static services: Map<string, any> = new Map();

  public static register<T>(key: string, service: T): void {
    ServiceRegistry.services.set(key, service);
  }

  public static get<T>(key: string): T {
    return ServiceRegistry.services.get(key);
  }

  public static has(key: string): boolean {
    return ServiceRegistry.services.has(key);
  }
}

// Uso
ServiceRegistry.register('store', new KimuStore());
const store = ServiceRegistry.get<KimuStore>('store');
```

### Multiton Pattern

```typescript
export class ExtensionInstances {
  private static instances: Map<string, ExtensionInstances> = new Map();

  public static getInstance(key: string): ExtensionInstances {
    if (!ExtensionInstances.instances.has(key)) {
      ExtensionInstances.instances.set(key, new ExtensionInstances(key));
    }
    return ExtensionInstances.instances.get(key)!;
  }

  private constructor(private key: string) {}
}
```

## Best Practices

### Inizializzazione
```typescript
export class KimuEngine {
  private static instance: KimuEngine;
  private initialized = false;

  public static getInstance(): KimuEngine {
    if (!KimuEngine.instance) {
      KimuEngine.instance = new KimuEngine();
    }
    return KimuEngine.instance;
  }

  private constructor() {
    // Inizializzazione leggera nel costruttore
  }

  public async initialize(): Promise<void> {
    if (this.initialized) return;

    // Inizializzazione pesante in metodo separato
    await this.loadConfiguration();
    await this.setupServices();
    
    this.initialized = true;
  }
}
```

### Error Handling
```typescript
export class RobustSingleton {
  private static instance: RobustSingleton;

  public static getInstance(): RobustSingleton {
    if (!RobustSingleton.instance) {
      try {
        RobustSingleton.instance = new RobustSingleton();
      } catch (error) {
        console.error('Failed to create singleton instance:', error);
        throw error;
      }
    }
    return RobustSingleton.instance;
  }

  private constructor() {
    if (RobustSingleton.instance) {
      throw new Error('Use getInstance() instead of new');
    }
  }
}
```

### Memory Management
```typescript
export class ManagedSingleton {
  private static instance: ManagedSingleton;
  private resources: any[] = [];

  public static getInstance(): ManagedSingleton {
    if (!ManagedSingleton.instance) {
      ManagedSingleton.instance = new ManagedSingleton();
      
      // Cleanup automatico quando la pagina si chiude
      window.addEventListener('beforeunload', () => {
        ManagedSingleton.instance.cleanup();
      });
    }
    return ManagedSingleton.instance;
  }

  public cleanup(): void {
    this.resources.forEach(resource => {
      if (resource.cleanup) {
        resource.cleanup();
      }
    });
    this.resources = [];
  }
}
```

## Casi d'Uso Appropriati

✅ **Quando Usarlo**:
- Gestione centralizzata dello stato
- Manager di risorse condivise
- Configurazione globale dell'applicazione
- Cache globale
- Logger centralizzato
- Connection pool

❌ **Quando NON Usarlo**:
- Semplici utility functions
- Oggetti stateless
- Quando serve dependency injection
- In presenza di molti test unitari
- Quando la concorrenza è critica

## Implementazione Thread-Safe

Anche se JavaScript è single-threaded, con Web Workers potresti aver bisogno di considerazioni speciali:

```typescript
export class ThreadSafeSingleton {
  private static instance: ThreadSafeSingleton;
  private static creating = false;

  public static async getInstance(): Promise<ThreadSafeSingleton> {
    if (ThreadSafeSingleton.instance) {
      return ThreadSafeSingleton.instance;
    }

    if (ThreadSafeSingleton.creating) {
      // Aspetta che l'altra istanza finisca di crearsi
      return new Promise(resolve => {
        const checkInstance = () => {
          if (ThreadSafeSingleton.instance) {
            resolve(ThreadSafeSingleton.instance);
          } else {
            setTimeout(checkInstance, 10);
          }
        };
        checkInstance();
      });
    }

    ThreadSafeSingleton.creating = true;
    ThreadSafeSingleton.instance = new ThreadSafeSingleton();
    await ThreadSafeSingleton.instance.asyncInitialization();
    ThreadSafeSingleton.creating = false;

    return ThreadSafeSingleton.instance;
  }
}
```

Il pattern Singleton è fondamentale in KIMU per garantire la coerenza e l'efficienza del framework, ma deve essere usato giudiziosamente per evitare di creare accoppiamenti eccessivi.

## Riferimenti

- [Observer Pattern](./observer-pattern.md) - Spesso usato insieme al Singleton
- [Factory Pattern](./factory-pattern.md) - Per creare istanze controllate
- [KimuStore](../core/kimu-store.md) - Implementazione del pattern
- [KimuExtensionManager](../core/kimu-extension-manager.md) - Altro esempio
- [KimuAssetManager](../core/kimu-asset-manager.md) - Gestione asset singleton
