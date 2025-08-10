# KimuApp

The main application class that acts as the central coordinator and entry point for the KIMU framework. KimuApp follows the Singleton pattern to ensure a single instance manages the entire application.

## Overview

KimuApp is responsible for:
- **Application initialization** and configuration
- **Extension loading** and lifecycle management
- **Global state coordination** between components
- **Asset management** and resource loading
- **Framework bootstrap** and startup sequence

## Class Definition

```typescript
export class KimuApp {
  private static instance: KimuApp;
  private isInitialized: boolean = false;
  private extensions: Map<string, any> = new Map();
  private config: AppConfig = {};

  private constructor() {
    // Private constructor for Singleton pattern
  }

  public static getInstance(): KimuApp {
    if (!KimuApp.instance) {
      KimuApp.instance = new KimuApp();
    }
    return KimuApp.instance;
  }
}
```

## Main Methods

### `getInstance()`

Static method to get the singleton instance of KimuApp.

```typescript
const app = KimuApp.getInstance();
```

**Returns**: `KimuApp` - The unique application instance

### `initialize(config?: AppConfig)`

Initializes the application with the provided configuration.

```typescript
interface AppConfig {
  debug?: boolean;
  theme?: 'light' | 'dark' | 'auto';
  language?: string;
  apiUrl?: string;
  extensions?: string[];
}

const app = KimuApp.getInstance();
await app.initialize({
  debug: true,
  theme: 'dark',
  language: 'en',
  extensions: ['kimu-app', 'notification-manager']
});
```

**Parameters**:
- `config` (optional): Application configuration

**Returns**: `Promise<void>`

### `loadExtension(extensionName: string)`

Loads a specific extension into the application.

```typescript
const app = KimuApp.getInstance();
await app.loadExtension('my-extension');
```

**Parameters**:
- `extensionName`: Name of the extension to load

**Returns**: `Promise<boolean>` - `true` if successfully loaded

### `getExtension(name: string)`

Gets a loaded extension instance.

```typescript
const extension = app.getExtension('notification-manager');
if (extension) {
  extension.showNotification('Hello World!');
}
```

**Parameters**:
- `name`: Extension name

**Returns**: `any | undefined` - Extension instance or undefined

### `setConfig(key: string, value: any)`

Sets a global configuration value.

```typescript
app.setConfig('theme', 'dark');
app.setConfig('debug', true);
```

**Parameters**:
- `key`: Configuration key
- `value`: Configuration value

### `getConfig(key: string)`

Gets a global configuration value.

```typescript
const theme = app.getConfig('theme'); // 'dark'
const isDebug = app.getConfig('debug'); // true
```

**Parameters**:
- `key`: Configuration key

**Returns**: `any` - Configuration value

## Practical Usage

### Basic Application Setup

```typescript
import { KimuApp } from './core/kimu-app';

// Get application instance
const app = KimuApp.getInstance();

// Initialize with configuration
await app.initialize({
  debug: process.env.NODE_ENV === 'development',
  theme: 'auto',
  language: navigator.language.split('-')[0],
  apiUrl: 'https://api.example.com'
});

// Load essential extensions
await app.loadExtension('kimu-app');
await app.loadExtension('ui-components');

console.log('Application initialized successfully');
```

### Extension Loading with Error Handling

```typescript
async function setupApplication() {
  const app = KimuApp.getInstance();
  
  try {
    await app.initialize({
      extensions: ['kimu-app', 'data-manager', 'ui-toolkit']
    });
    
    console.log('All extensions loaded successfully');
  } catch (error) {
    console.error('Error during application setup:', error);
    
    // Fallback loading
    await app.loadExtension('kimu-app'); // Load minimum
  }
}
```

### Configuration Management

```typescript
const app = KimuApp.getInstance();

// Dynamic theme switching
function switchTheme(newTheme: 'light' | 'dark') {
  app.setConfig('theme', newTheme);
  
  // Notify all components
  document.dispatchEvent(new CustomEvent('theme-changed', {
    detail: { theme: newTheme }
  }));
}

// Language switching
function setLanguage(lang: string) {
  app.setConfig('language', lang);
  
  // Reload language-dependent extensions
  const i18nExtension = app.getExtension('i18n-manager');
  if (i18nExtension) {
    i18nExtension.loadLanguage(lang);
  }
}
```

### Extension Communication

```typescript
// Extension A
class ExtensionA {
  sendMessage(data: any) {
    const app = KimuApp.getInstance();
    const extensionB = app.getExtension('extension-b');
    
    if (extensionB) {
      extensionB.receiveMessage(data);
    }
  }
}

// Extension B
class ExtensionB {
  receiveMessage(data: any) {
    console.log('Received message:', data);
  }
}
```

## Integration with Other Components

### With KimuStore

```typescript
import { KimuApp } from './core/kimu-app';
import { KimuStore } from './core/kimu-store';

const app = KimuApp.getInstance();
const store = KimuStore.getInstance();

// Sync app config with store
app.setConfig('user', { name: 'John', role: 'admin' });
store.setState('appConfig', app.getConfig());
```

### With KimuExtensionManager

```typescript
import { KimuExtensionManager } from './core/kimu-extension-manager';

const app = KimuApp.getInstance();
const extensionManager = KimuExtensionManager.getInstance();

// Load extensions through the manager
await extensionManager.loadAllExtensions();

// Get loaded extensions in the app
const loadedExtensions = extensionManager.getLoadedExtensions();
loadedExtensions.forEach(ext => {
  app.extensions.set(ext.tag, ext.instance);
});
```

## Events

KimuApp emits custom events during its lifecycle:

### `kimu:app-initialized`

Emitted when the application has been successfully initialized.

```typescript
document.addEventListener('kimu:app-initialized', (event) => {
  console.log('KIMU app is ready:', event.detail);
});
```

### `kimu:extension-loaded`

Emitted when an extension is successfully loaded.

```typescript
document.addEventListener('kimu:extension-loaded', (event) => {
  const { extensionName, timestamp } = event.detail;
  console.log(`Extension ${extensionName} loaded at ${timestamp}`);
});
```

### `kimu:config-changed`

Emitted when configuration changes.

```typescript
document.addEventListener('kimu:config-changed', (event) => {
  const { key, value, oldValue } = event.detail;
  console.log(`Config ${key} changed from ${oldValue} to ${value}`);
});
```

## Error Handling

```typescript
class KimuApp {
  private handleError(context: string, error: Error): void {
    console.error(`[KimuApp] ${context}:`, error);
    
    // Emit error event
    document.dispatchEvent(new CustomEvent('kimu:app-error', {
      detail: { context, error: error.message, timestamp: Date.now() }
    }));
    
    // Send to error reporting service
    if (this.getConfig('errorReporting')) {
      this.reportError(context, error);
    }
  }
  
  private reportError(context: string, error: Error): void {
    // Implementation for error reporting
    fetch('/api/errors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        context,
        message: error.message,
        stack: error.stack,
        userAgent: navigator.userAgent,
        timestamp: Date.now()
      })
    });
  }
}
```

## Best Practices

### 1. Initialization Order

```typescript
// ✅ Good - Proper initialization order
async function initializeApp() {
  const app = KimuApp.getInstance();
  
  // 1. Basic configuration
  await app.initialize(baseConfig);
  
  // 2. Load core extensions first
  await app.loadExtension('kimu-app');
  
  // 3. Load dependent extensions
  await app.loadExtension('ui-components');
  await app.loadExtension('data-manager');
  
  // 4. Start application
  app.start();
}
```

### 2. Configuration Management

```typescript
// ✅ Good - Centralized configuration
const defaultConfig = {
  debug: false,
  theme: 'light',
  language: 'en',
  apiUrl: process.env.VITE_API_URL || 'http://localhost:3000'
};

const userConfig = loadUserPreferences();
const finalConfig = { ...defaultConfig, ...userConfig };

await app.initialize(finalConfig);
```

### 3. Extension Dependencies

```typescript
// ✅ Good - Handle extension dependencies
async function loadExtensionWithDependencies(extensionName: string) {
  const app = KimuApp.getInstance();
  
  // Check dependencies first
  const dependencies = getExtensionDependencies(extensionName);
  
  for (const dep of dependencies) {
    if (!app.getExtension(dep)) {
      await app.loadExtension(dep);
    }
  }
  
  // Load main extension
  await app.loadExtension(extensionName);
}
```

## Common Patterns

### Application Startup

```typescript
// main.ts
import { KimuApp } from './core/kimu-app';

async function main() {
  const app = KimuApp.getInstance();
  
  try {
    // Initialize with environment-specific config
    const config = await loadConfig();
    await app.initialize(config);
    
    // Load extensions based on configuration
    const extensions = config.extensions || ['kimu-app'];
    for (const ext of extensions) {
      await app.loadExtension(ext);
    }
    
    console.log('🚀 KIMU application started successfully');
    
  } catch (error) {
    console.error('❌ Failed to start KIMU application:', error);
    // Fallback or error page
  }
}

main();
```

### Plugin Architecture

```typescript
interface Plugin {
  name: string;
  version: string;
  initialize(app: KimuApp): Promise<void>;
  destroy(): Promise<void>;
}

class PluginManager {
  private plugins: Map<string, Plugin> = new Map();
  
  async registerPlugin(plugin: Plugin) {
    const app = KimuApp.getInstance();
    await plugin.initialize(app);
    this.plugins.set(plugin.name, plugin);
  }
}
```

## References

- [KimuExtensionManager](./kimu-extension-manager.md) - Extension loading and management
- [KimuStore](./kimu-store.md) - Global state management
- [KimuEngine](./kimu-engine.md) - Rendering engine
- [Singleton Pattern](../patterns/singleton-pattern.md) - Architectural pattern
- [Extension System](../extensions/index.md) - Extension development guide
