# 🗂️ Configuration & Environments

KIMU-CORE supports multiple environments and flexible configuration to adapt to different development and deployment needs.

---

## 📦 Configuration Files

- The `config/` and `env/` folders contain configuration files for each environment:
  - `dev.config.json` (development)
  - `prod.config.json` (production)
  - `test.config.json` (testing)
  - `local.config.json` (local development)
  - `staging.config.json` (staging)
- These files define variables, paths, build options, and runtime settings.

---

## 🌍 Environment Selection

- You can select the environment using npm scripts:
  - `npm run build:dev` (development)
  - `npm run build:prod` (production)
  - `npm run build:test` (testing)
  - `npm run build:local` (local)
- Each script loads the corresponding configuration file and applies its settings.
- You can create custom environments by adding new config files and scripts.

---

## ⚙️ Custom Configuration

- You can extend or override configuration by creating new files in `env/` or `config/`.
- Document your custom options for maintainability.

---

## 🕒 Runtime vs Build Time

- Some configuration options are read only at build time (e.g., bundling, environment variables).

---

## ⚡ Framework Optimization Configuration

KIMU-Core includes configurable safe optimizations to improve performance and reliability.

### Global Configuration

```typescript
import { KimuComponentElement } from './core/kimu-component-element';

// Configure optimizations at app startup
KimuComponentElement.configureOptimizations({
    enableTemplateCache: true,      // Cache compiled templates
    enableFileCache: true,          // Cache loaded files  
    enableRenderDebouncing: true,   // Render debouncing
    enableErrorBoundaries: true,    // Component error isolation
    cacheMaxSize: 50,              // Template cache limit (LRU)
    enableAssetPreloading: false   // Asset preloading (opt-in)
});
```

### Environment-Specific Configuration

#### Development
```typescript
// config/dev.config.json
{
    "optimizations": {
        "enableTemplateCache": false,     // Disable cache for hot-reload
        "enableErrorBoundaries": true,    // Keep error isolation
        "cacheMaxSize": 10,              // Reduced cache
        "enableAssetPreloading": false   // No preloading in dev
    }
}
```

#### Production
```typescript
// config/prod.config.json  
{
    "optimizations": {
        "enableTemplateCache": true,      // Full cache
        "enableFileCache": true,          // File cache enabled
        "enableRenderDebouncing": true,   // Active debouncing
        "enableErrorBoundaries": true,    // Critical error isolation
        "cacheMaxSize": 100,             // Extended cache
        "enableAssetPreloading": true    // Critical asset preloading
    }
}
```

#### Testing
```typescript
// config/test.config.json
{
    "optimizations": {
        "enableTemplateCache": false,     // Cache disabled for tests
        "enableErrorBoundaries": false,  // Visible errors for debugging
        "cacheMaxSize": 5,               // Minimal cache
        "enableAssetPreloading": false   // No preloading
    }
}
```

### Cache and Memory Management

```typescript
import { KimuEngine } from './core/kimu-engine';

// Configure cache size
KimuEngine.configureCaching(75); // Larger template cache

// Scheduled cache cleanup (useful for long-running SPAs)
setInterval(() => {
    KimuEngine.clearCaches();
}, 30 * 60 * 1000); // Every 30 minutes
```

### Strategic Asset Preloading

```typescript
// Preload critical assets at startup
async function initializeApp() {
    // Configure optimizations
    KimuComponentElement.configureOptimizations({
        enableAssetPreloading: true
    });
    
    // Preload critical assets
    await KimuComponentElement.preloadAssets([
        'extensions/dashboard/view.html',
        'extensions/dashboard/style.css',
        'extensions/navigation/view.html',
        'assets/theme.css',
        'assets/icons.css'
    ]);
    
    console.log('App initialized with preloaded assets');
}
```

### Performance Monitoring

```typescript
// Debug optimization configuration
console.log('Active optimizations:', 
    KimuComponentElement.getOptimizationSettings());

// Cache monitoring
setInterval(() => {
    const stats = getCacheStats(); // Custom implementation
    if (stats.usage > 0.8) {
        console.warn('High cache usage:', stats);
    }
}, 60000); // Every minute
```
