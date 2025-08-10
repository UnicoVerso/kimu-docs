# Singleton Pattern

The Singleton pattern ensures that a class has only one instance in the application and provides a global access point to that instance.

## Problem

In KIMU, some components must be unique in the application:
- **KimuStore**: Centralized state management
- **KimuExtensionManager**: Extension management
- **KimuAssetManager**: Asset management
- **KimuEngine**: Main framework engine

Having multiple instances of these components would lead to:
- State inconsistency
- Resource waste
- Unpredictable behaviors
- Synchronization difficulties

## Solution

The Singleton pattern implements:
1. A private constructor to prevent direct instantiation
2. A static `getInstance()` method for controlled access
3. A static variable to maintain the unique instance

## Implementation in KIMU

### KimuStore Singleton

```typescript
export class KimuStore {
  private static instance: KimuStore;
  private state: Map<string, any> = new Map();
  private subscribers: Map<string, Array<(state: any) => void>> = new Map();

  // Private constructor
  private constructor() {
    console.log('KimuStore instance created');
  }

  // Static method to get the instance
  public static getInstance(): KimuStore {
    if (!KimuStore.instance) {
      KimuStore.instance = new KimuStore();
    }
    return KimuStore.instance;
  }

  // Instance methods
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

    // Return function to unsubscribe
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

  // Method for reset (useful for testing)
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
    // Check cache
    if (this.assetCache.has(path)) {
      return this.assetCache.get(path)!;
    }

    // Check if already loading
    if (this.loadingPromises.has(path)) {
      return this.loadingPromises.get(path)!;
    }

    // Start new loading
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
    // Revoke object URLs to free memory
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

## Usage

### Accessing Singleton Instances

```typescript
// Anywhere in the application
const store = KimuStore.getInstance();
store.setState('user', { name: 'Marco', role: 'admin' });

const extensionManager = KimuExtensionManager.getInstance();
await extensionManager.loadExtension('my-extension');

const assetManager = KimuAssetManager.getInstance();
const logoUrl = await assetManager.getAsset('logo.png');
```

### In Extensions

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
    
    // Subscribe to store changes
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

## Advantages

### Instance Control
- **Single instance**: Guarantees only one instance throughout the application
- **Global access**: Easy access from anywhere in the code
- **Lazy initialization**: Instance is created only when needed

### Resource Management
- **State sharing**: Centralized and shared state
- **Shared cache**: Asset cache shared among all components
- **Memory efficiency**: Avoids duplication of heavy instances

### Consistency
- **Single configuration**: One configuration for the entire system
- **Synchronization**: All components see the same state
- **Simplified debugging**: Central point for debugging and monitoring

## Disadvantages

### Testing
- **Global state**: Can make tests interdependent
- **Difficulty mocking**: Hard to mock for unit tests
- **Cleanup needed**: Requires reset between tests

```typescript
// Solution for testing
describe('MyExtension', () => {
  afterEach(() => {
    // Reset singletons for isolated tests
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

### Coupling
- **Implicit dependency**: Creates implicit dependencies hard to track
- **Rigidity**: Hard to change implementation
- **Dependency injection**: Makes dependency injection difficult

### Concurrency
- **Thread safety**: Potential issues in multi-threaded environments (less relevant in JS)
- **Race conditions**: Possible in asynchronous initialization

## Variants

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
    // Heavy initialization only when needed
  }
}

// Usage
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

// Usage
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

### Initialization
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
    // Light initialization in constructor
  }

  public async initialize(): Promise<void> {
    if (this.initialized) return;

    // Heavy initialization in separate method
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
      
      // Automatic cleanup when page closes
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

## Appropriate Use Cases

✅ **When to Use**:
- Centralized state management
- Shared resource managers
- Global application configuration
- Global cache
- Centralized logger
- Connection pool

❌ **When NOT to Use**:
- Simple utility functions
- Stateless objects
- When dependency injection is needed
- In presence of many unit tests
- When concurrency is critical

## Thread-Safe Implementation

Even though JavaScript is single-threaded, with Web Workers you might need special considerations:

```typescript
export class ThreadSafeSingleton {
  private static instance: ThreadSafeSingleton;
  private static creating = false;

  public static async getInstance(): Promise<ThreadSafeSingleton> {
    if (ThreadSafeSingleton.instance) {
      return ThreadSafeSingleton.instance;
    }

    if (ThreadSafeSingleton.creating) {
      // Wait for the other instance to finish creating
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

The Singleton pattern is fundamental in KIMU to ensure framework consistency and efficiency, but it must be used judiciously to avoid creating excessive coupling.

## References

- [Observer Pattern](./observer-pattern.md) - Often used together with Singleton
- [KimuStore](../core/kimu-store.md) - Pattern implementation
- [KimuExtensionManager](../core/kimu-extension-manager.md) - Another example
- [KimuAssetManager](../core/kimu-asset-manager.md) - Singleton asset management
