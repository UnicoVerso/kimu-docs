# KimuExtensionManager

The central manager responsible for discovering, loading, and managing all extensions in the KIMU framework. It implements the Singleton pattern and provides a complete lifecycle management system for extensions.

## Overview

KimuExtensionManager handles:
- **Extension discovery** through manifest files
- **Dynamic loading** of extension scripts
- **Dependency resolution** between extensions
- **Lifecycle management** (load, initialize, destroy)
- **Error handling** and recovery
- **Performance optimization** with lazy loading

## Class Definition

```typescript
interface ExtensionMeta {
  tag: string;
  path: string;
  name: string;
  version: string;
  internal?: boolean;
  dependencies?: string[];
  priority?: number;
}

export class KimuExtensionManager {
  private static instance: KimuExtensionManager;
  private extensions: Map<string, ExtensionMeta> = new Map();
  private loadedExtensions: Set<string> = new Set();
  private loadingPromises: Map<string, Promise<boolean>> = new Map();

  private constructor() {
    this.initializeManager();
  }

  public static getInstance(): KimuExtensionManager {
    if (!KimuExtensionManager.instance) {
      KimuExtensionManager.instance = new KimuExtensionManager();
    }
    return KimuExtensionManager.instance;
  }
}
```

## Main Methods

### `getInstance()`

Returns the singleton instance of the extension manager.

```typescript
const manager = KimuExtensionManager.getInstance();
```

### `loadExtension(tag: string)`

Loads a specific extension by its tag.

```typescript
const manager = KimuExtensionManager.getInstance();

try {
  const loaded = await manager.loadExtension('my-extension');
  if (loaded) {
    console.log('Extension loaded successfully');
  }
} catch (error) {
  console.error('Failed to load extension:', error);
}
```

**Parameters**:
- `tag`: Extension tag identifier

**Returns**: `Promise<boolean>` - Success status

### `loadAllExtensions()`

Loads all extensions found in the manifest.

```typescript
const manager = KimuExtensionManager.getInstance();
await manager.loadAllExtensions();
```

**Returns**: `Promise<void>`

### `getLoadedExtensions()`

Returns the list of currently loaded extensions.

```typescript
const loadedExtensions = manager.getLoadedExtensions();
console.log('Loaded:', loadedExtensions); // ['kimu-home', 'ui-components']
```

**Returns**: `string[]` - Array of loaded extension tags

### `isExtensionLoaded(tag: string)`

Checks if a specific extension is loaded.

```typescript
if (manager.isExtensionLoaded('data-manager')) {
  console.log('Data manager is available');
}
```

**Parameters**:
- `tag`: Extension tag

**Returns**: `boolean`

### `getExtensionMeta(tag: string)`

Gets the metadata of an extension.

```typescript
const meta = manager.getExtensionMeta('my-extension');
if (meta) {
  console.log(`Extension: ${meta.name} v${meta.version}`);
}
```

**Parameters**:
- `tag`: Extension tag

**Returns**: `ExtensionMeta | undefined`

## Extension Discovery

The manager automatically discovers extensions through the `extensions-manifest.json` file:

```json
[
  {
    "tag": "kimu-home",
    "path": "kimu-Home",
    "internal": true,
    "name": "KIMU Home App",
    "description": "Home App interface container",
    "version": "1.0.0",
    "author": "UnicòVerso",
    "icon": "🏠",
    "kimuVersion": "1.0.0"
  },
  {
    "tag": "notification-manager",
    "path": "notification-manager",
    "internal": false,
    "name": "Notification Manager",
    "version": "1.2.0",
    "dependencies": ["ui-components"],
    "priority": 5
  }
]
```

## Dependency Resolution

The manager automatically resolves dependencies between extensions:

```typescript
class KimuExtensionManager {
  private async loadExtensionWithDependencies(tag: string): Promise<boolean> {
    const meta = this.extensions.get(tag);
    if (!meta) {
      throw new Error(`Extension ${tag} not found`);
    }

    // Load dependencies first
    if (meta.dependencies) {
      for (const dep of meta.dependencies) {
        if (!this.loadedExtensions.has(dep)) {
          await this.loadExtension(dep);
        }
      }
    }

    // Load the extension itself
    return this.loadSingleExtension(meta);
  }

  private async loadSingleExtension(meta: ExtensionMeta): Promise<boolean> {
    if (this.loadedExtensions.has(meta.tag)) {
      return true; // Already loaded
    }

    // Check if already loading
    if (this.loadingPromises.has(meta.tag)) {
      return this.loadingPromises.get(meta.tag)!;
    }

    const loadingPromise = this.doLoadExtension(meta);
    this.loadingPromises.set(meta.tag, loadingPromise);

    try {
      const result = await loadingPromise;
      this.loadedExtensions.add(meta.tag);
      this.loadingPromises.delete(meta.tag);
      
      // Emit loaded event
      this.emitExtensionEvent('loaded', meta);
      
      return result;
    } catch (error) {
      this.loadingPromises.delete(meta.tag);
      this.emitExtensionEvent('error', meta, error);
      throw error;
    }
  }
}
```

## Practical Usage

### Basic Extension Loading

```typescript
import { KimuExtensionManager } from './core/kimu-extension-manager';

async function setupExtensions() {
  const manager = KimuExtensionManager.getInstance();
  
  // Load specific extensions
  await manager.loadExtension('kimu-home');
  await manager.loadExtension('ui-components');
  
  // Or load all at once
  await manager.loadAllExtensions();
  
  console.log('Extensions loaded:', manager.getLoadedExtensions());
}
```

### Priority-Based Loading

```typescript
async function loadExtensionsByPriority() {
  const manager = KimuExtensionManager.getInstance();
  const allExtensions = manager.getAllExtensions();
  
  // Sort by priority (higher priority first)
  const sortedExtensions = allExtensions.sort((a, b) => {
    return (b.priority || 0) - (a.priority || 0);
  });
  
  // Load in priority order
  for (const ext of sortedExtensions) {
    try {
      await manager.loadExtension(ext.tag);
      console.log(`✅ Loaded ${ext.name} (priority: ${ext.priority || 0})`);
    } catch (error) {
      console.warn(`⚠️ Failed to load ${ext.name}:`, error);
    }
  }
}
```

### Conditional Loading

```typescript
async function loadConditionalExtensions() {
  const manager = KimuExtensionManager.getInstance();
  
  // Load based on environment
  if (process.env.NODE_ENV === 'development') {
    await manager.loadExtension('debug-tools');
    await manager.loadExtension('performance-monitor');
  }
  
  // Load based on user permissions
  const user = getCurrentUser();
  if (user.role === 'admin') {
    await manager.loadExtension('admin-panel');
  }
  
  // Load based on feature flags
  const features = getFeatureFlags();
  if (features.experimentalUI) {
    await manager.loadExtension('experimental-ui');
  }
}
```

### Error Handling and Fallbacks

```typescript
async function loadExtensionsWithFallback() {
  const manager = KimuExtensionManager.getInstance();
  const criticalExtensions = ['kimu-app', 'core-ui'];
  const optionalExtensions = ['analytics', 'chat-widget'];
  
  // Load critical extensions (must succeed)
  for (const ext of criticalExtensions) {
    try {
      await manager.loadExtension(ext);
    } catch (error) {
      console.error(`Critical extension ${ext} failed to load:`, error);
      throw new Error('Application cannot start without critical extensions');
    }
  }
  
  // Load optional extensions (can fail)
  for (const ext of optionalExtensions) {
    try {
      await manager.loadExtension(ext);
      console.log(`✅ Optional extension ${ext} loaded`);
    } catch (error) {
      console.warn(`⚠️ Optional extension ${ext} failed to load:`, error);
      // Continue without this extension
    }
  }
}
```

## Events

The extension manager emits events during the extension lifecycle:

### Extension Loading Events

```typescript
// Listen to extension events
document.addEventListener('kimu:extension-loaded', (event) => {
  const { tag, name, version } = event.detail;
  console.log(`Extension loaded: ${name} v${version}`);
});

document.addEventListener('kimu:extension-error', (event) => {
  const { tag, error } = event.detail;
  console.error(`Extension error: ${tag}`, error);
});

document.addEventListener('kimu:all-extensions-loaded', (event) => {
  const { count, loadTime } = event.detail;
  console.log(`All ${count} extensions loaded in ${loadTime}ms`);
});
```

### Custom Extension Communication

```typescript
// Extension can communicate through the manager
class MyExtension extends HTMLElement {
  connectedCallback() {
    // Notify other extensions
    this.dispatchEvent(new CustomEvent('kimu:extension-ready', {
      bubbles: true,
      detail: { 
        tag: 'my-extension',
        api: this.getPublicAPI()
      }
    }));
  }
  
  getPublicAPI() {
    return {
      showDialog: this.showDialog.bind(this),
      getData: this.getData.bind(this)
    };
  }
}
```

## Performance Optimization

### Lazy Loading

```typescript
class KimuExtensionManager {
  private async lazyLoadExtension(tag: string): Promise<void> {
    // Load extension only when first accessed
    if (!this.loadedExtensions.has(tag)) {
      console.log(`Lazy loading extension: ${tag}`);
      await this.loadExtension(tag);
    }
  }
  
  // Create proxy for lazy loading
  public createExtensionProxy(tag: string): any {
    return new Proxy({}, {
      get: (target, prop) => {
        // Load extension on first property access
        this.lazyLoadExtension(tag);
        
        // Return temporary placeholder
        return () => {
          console.warn(`Extension ${tag} is still loading...`);
        };
      }
    });
  }
}
```

### Bundle Splitting

```typescript
// Dynamic imports for better performance
class KimuExtensionManager {
  private async loadExtensionScript(meta: ExtensionMeta): Promise<void> {
    const scriptPath = `./dist/extensions/${meta.path}/component.js`;
    
    try {
      // Dynamic import for modern browsers
      if (typeof import === 'function') {
        await import(scriptPath);
      } else {
        // Fallback for older browsers
        await this.loadScriptTag(scriptPath);
      }
    } catch (error) {
      throw new Error(`Failed to load extension script: ${scriptPath}`);
    }
  }
  
  private loadScriptTag(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.type = 'module';
      script.src = src;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Script load failed: ${src}`));
      document.head.appendChild(script);
    });
  }
}
```

## Integration with Build System

### Extension Manifest Generation

```typescript
// Build-time script to generate manifest
interface ExtensionConfig {
  tag: string;
  name: string;
  version: string;
  dependencies?: string[];
}

function generateManifest(extensions: ExtensionConfig[]): void {
  const manifest = extensions.map(ext => ({
    ...ext,
    path: ext.tag,
    buildTime: new Date().toISOString(),
    hash: generateHash(ext)
  }));
  
  writeFileSync(
    'src/extensions/extensions-manifest.json',
    JSON.stringify(manifest, null, 2)
  );
}
```

## Best Practices

### 1. Extension Dependencies

```typescript
// ✅ Good - Declare dependencies clearly
{
  "tag": "data-table",
  "dependencies": ["ui-components", "data-manager"],
  "priority": 3
}

// ❌ Bad - Hidden dependencies
{
  "tag": "data-table"
  // Missing dependencies, will fail at runtime
}
```

### 2. Error Recovery

```typescript
class RobustExtensionManager extends KimuExtensionManager {
  private async loadExtensionWithRetry(
    tag: string, 
    maxRetries: number = 3
  ): Promise<boolean> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await this.loadExtension(tag);
      } catch (error) {
        console.warn(`Attempt ${attempt}/${maxRetries} failed for ${tag}:`, error);
        
        if (attempt === maxRetries) {
          throw error;
        }
        
        // Exponential backoff
        await this.delay(Math.pow(2, attempt) * 1000);
      }
    }
    return false;
  }
}
```

### 3. Performance Monitoring

```typescript
class MonitoredExtensionManager extends KimuExtensionManager {
  private async loadExtension(tag: string): Promise<boolean> {
    const startTime = performance.now();
    
    try {
      const result = await super.loadExtension(tag);
      const loadTime = performance.now() - startTime;
      
      // Track performance metrics
      this.trackMetric('extension_load_time', loadTime, { tag });
      
      return result;
    } catch (error) {
      this.trackMetric('extension_load_error', 1, { tag, error: error.message });
      throw error;
    }
  }
}
```

## References

- [Creating Extensions](../extensions/creating-extensions.md) - How to develop extensions
- [Extension Lifecycle](../extensions/extension-lifecycle.md) - Extension lifecycle
- [Extension Manifest](../extensions/extension-manifest.md) - Manifest configuration
- [KimuApp](./kimu-app.md) - Main application class
- [Singleton Pattern](../patterns/singleton-pattern.md) - Design pattern
