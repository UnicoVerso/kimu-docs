# Extension Lifecycle

The extension lifecycle in KIMU follows the standard Web Components model, with specific additions for framework integration.

## Lifecycle Phases

### 1. Discovery

Extensions are discovered by the `KimuExtensionManager` through the `extensions-manifest.json` file.

```typescript
// KimuExtensionManager loads the manifest
const extensions = await this.loadExtensionsManifest();
console.log('Extensions discovered:', extensions.length);
```

### 2. Registration

The extension is registered as a custom element in the DOM.

```typescript
// Automatically managed by the @KimuComponent decorator
@KimuComponent({
  tag: 'my-extension',
  name: 'My Extension'
})
export class MyExtension extends HTMLElement {
  // Element is registered automatically
}
```

### 3. Instantiation

When the element is added to the DOM, a new instance is created.

```typescript
export class MyExtension extends HTMLElement {
  constructor() {
    super();
    console.log('Extension instantiated');
    
    // Basic initialization
    this.attachShadow({ mode: 'open' });
    this.setupInitialState();
  }

  private setupInitialState() {
    // Initial configuration
    this.setAttribute('data-kimu-extension', 'true');
  }
}
```

### 4. Connection

The element is connected to the DOM tree.

```typescript
export class MyExtension extends HTMLElement {
  connectedCallback() {
    console.log('Extension connected to DOM');
    
    // Operations to perform on connection
    this.initializeExtension();
    this.render();
    this.setupEventListeners();
    this.loadAssets();
  }

  private initializeExtension() {
    // Extension-specific initialization
    this.setupStyles();
    this.loadConfiguration();
    this.connectToStore();
  }
}
```

### 5. Attribute Changes

Reacts to changes in observed attributes.

```typescript
export class MyExtension extends HTMLElement {
  // Define observed attributes
  static get observedAttributes() {
    return ['theme', 'language', 'data-config'];
  }

  attributeChangedCallback(
    name: string, 
    oldValue: string, 
    newValue: string
  ) {
    console.log(`Attribute ${name} changed from ${oldValue} to ${newValue}`);
    
    switch (name) {
      case 'theme':
        this.updateTheme(newValue);
        break;
      case 'language':
        this.updateLanguage(newValue);
        break;
      case 'data-config':
        this.updateConfiguration(newValue);
        break;
    }
  }

  private updateTheme(theme: string) {
    this.classList.remove('theme-light', 'theme-dark');
    this.classList.add(`theme-${theme}`);
  }
}
```

### 6. Adoption

The element is moved to a new document.

```typescript
export class MyExtension extends HTMLElement {
  adoptedCallback() {
    console.log('Extension adopted to new document');
    
    // Reconfigure for new context
    this.reinitializeForNewDocument();
  }

  private reinitializeForNewDocument() {
    // Operations needed for the new document
    this.reapplyStyles();
    this.reconnectEventListeners();
  }
}
```

### 7. Disconnection

The element is removed from the DOM.

```typescript
export class MyExtension extends HTMLElement {
  private eventListeners: Array<() => void> = [];
  private intervals: number[] = [];
  private subscriptions: Array<() => void> = [];

  disconnectedCallback() {
    console.log('Extension disconnected from DOM');
    
    // Complete cleanup
    this.cleanup();
  }

  private cleanup() {
    // Remove event listeners
    this.eventListeners.forEach(removeListener => removeListener());
    this.eventListeners = [];

    // Clear intervals and timeouts
    this.intervals.forEach(id => clearInterval(id));
    this.intervals = [];

    // Cancel subscriptions
    this.subscriptions.forEach(unsubscribe => unsubscribe());
    this.subscriptions = [];

    // Clean up specific resources
    this.cleanupAssets();
    this.disconnectFromStore();
  }
}
```

## Lifecycle Hooks

### Pre-Connection Hook

```typescript
export class MyExtension extends HTMLElement {
  private async preConnectionSetup() {
    // Operations to complete before connection
    await this.loadConfiguration();
    await this.authenticateUser();
    await this.preloadAssets();
  }

  async connectedCallback() {
    await this.preConnectionSetup();
    this.render();
  }
}
```

### Post-Connection Hook

```typescript
export class MyExtension extends HTMLElement {
  connectedCallback() {
    this.render();
    
    // Post-connection operations
    requestAnimationFrame(() => {
      this.postConnectionSetup();
    });
  }

  private postConnectionSetup() {
    this.animateEntrance();
    this.notifyOtherExtensions();
    this.startPeriodicTasks();
  }
}
```

### Error Handling

```typescript
export class MyExtension extends HTMLElement {
  connectedCallback() {
    try {
      this.initializeExtension();
    } catch (error) {
      this.handleError('Connection failed', error);
    }
  }

  private handleError(context: string, error: Error) {
    console.error(`[MyExtension] ${context}:`, error);
    
    // Fallback UI
    this.renderErrorState(error.message);
    
    // Notify error system
    this.dispatchEvent(new CustomEvent('kimu:extension-error', {
      bubbles: true,
      detail: { extension: 'my-extension', context, error }
    }));
  }

  private renderErrorState(message: string) {
    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = `
        <div class="error-state">
          <h3>⚠️ Extension Error</h3>
          <p>${message}</p>
          <button onclick="location.reload()">Reload Page</button>
        </div>
      `;
    }
  }
}
```

## Asynchronous Management

### Asynchronous Operations in Connection

```typescript
export class MyExtension extends HTMLElement {
  private isInitialized = false;

  async connectedCallback() {
    if (this.isInitialized) return;

    try {
      // Show loading state
      this.renderLoadingState();

      // Asynchronous operations
      const [config, assets, data] = await Promise.all([
        this.loadConfiguration(),
        this.preloadAssets(),
        this.fetchInitialData()
      ]);

      // Initialize with loaded data
      this.initialize(config, assets, data);
      this.render();
      
      this.isInitialized = true;
    } catch (error) {
      this.handleError('Async initialization failed', error);
    }
  }

  private renderLoadingState() {
    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = `
        <div class="loading-state">
          <div class="spinner"></div>
          <p>Loading extension...</p>
        </div>
      `;
    }
  }
}
```

## Communication during Lifecycle

### Lifecycle Events

```typescript
export class MyExtension extends HTMLElement {
  connectedCallback() {
    // Notify connection
    this.dispatchEvent(new CustomEvent('kimu:extension-connected', {
      bubbles: true,
      detail: { 
        tag: 'my-extension',
        timestamp: Date.now()
      }
    }));

    this.render();
  }

  disconnectedCallback() {
    // Notify disconnection
    this.dispatchEvent(new CustomEvent('kimu:extension-disconnected', {
      bubbles: true,
      detail: { 
        tag: 'my-extension',
        timestamp: Date.now()
      }
    }));

    this.cleanup();
  }
}
```

### Coordination between Extensions

```typescript
export class MyExtension extends HTMLElement {
  connectedCallback() {
    this.render();
    
    // Listen to other extensions
    document.addEventListener('kimu:extension-connected', (event) => {
      const { tag } = event.detail;
      if (tag === 'dependency-extension') {
        this.handleDependencyReady();
      }
    });
  }

  private handleDependencyReady() {
    console.log('Dependency extension is ready');
    this.enableAdvancedFeatures();
  }
}
```

## Lifecycle Debugging

### Detailed Logging

```typescript
export class MyExtension extends HTMLElement {
  private debug = true;

  private log(phase: string, data?: any) {
    if (this.debug) {
      console.log(`[MyExtension] ${phase}`, data || '');
    }
  }

  constructor() {
    super();
    this.log('Constructor called');
  }

  connectedCallback() {
    this.log('Connected to DOM');
    this.render();
  }

  disconnectedCallback() {
    this.log('Disconnected from DOM');
    this.cleanup();
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    this.log('Attribute changed', { name, oldValue, newValue });
  }
}
```

## Best Practices

1. **Gradual Initialization**: Load only immediately necessary resources
2. **Error Handling**: Always handle errors during initialization
3. **Complete Cleanup**: Remove all listeners and resources on disconnection
4. **Performance**: Use `requestAnimationFrame` for rendering operations
5. **Persistent State**: Maintain state between disconnections if necessary
6. **Communication**: Use custom events to coordinate with other extensions

## References

- [Creating an Extension](./creating-extensions.md)
- [Extension Manifest](./extension-manifest.md)
- [Best Practices](./best-practices.md)
- [KimuExtensionManager](../core/kimu-extension-manager.md)
