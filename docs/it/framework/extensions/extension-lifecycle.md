# Lifecycle delle Estensioni

Il lifecycle delle estensioni in KIMU segue il modello standard dei Web Components, con aggiunte specifiche per l'integrazione con il framework.

## Fasi del Lifecycle

### 1. Discovery (Scoperta)

Le estensioni vengono scoperte dal `KimuExtensionManager` attraverso il file `extensions-manifest.json`.

```typescript
// KimuExtensionManager carica il manifest
const extensions = await this.loadExtensionsManifest();
console.log('Estensioni scoperte:', extensions.length);
```

### 2. Registration (Registrazione)

L'estensione viene registrata come custom element nel DOM.

```typescript
// Automaticamente gestito dal decorator @KimuComponent
@KimuComponent({
  tag: 'my-extension',
  name: 'My Extension'
})
export class MyExtension extends HTMLElement {
  // L'elemento viene registrato automaticamente
}
```

### 3. Instantiation (Istanziazione)

Quando l'elemento viene aggiunto al DOM, viene creata una nuova istanza.

```typescript
export class MyExtension extends HTMLElement {
  constructor() {
    super();
    console.log('Extension instantiated');
    
    // Inizializzazione base
    this.attachShadow({ mode: 'open' });
    this.setupInitialState();
  }

  private setupInitialState() {
    // Configurazione iniziale
    this.setAttribute('data-kimu-extension', 'true');
  }
}
```

### 4. Connection (Connessione)

L'elemento viene collegato al DOM tree.

```typescript
export class MyExtension extends HTMLElement {
  connectedCallback() {
    console.log('Extension connected to DOM');
    
    // Operazioni da eseguire alla connessione
    this.initializeExtension();
    this.render();
    this.setupEventListeners();
    this.loadAssets();
  }

  private initializeExtension() {
    // Inizializzazione specifica dell'estensione
    this.setupStyles();
    this.loadConfiguration();
    this.connectToStore();
  }
}
```

### 5. Attribute Changes (Cambiamenti Attributi)

Reagisce ai cambiamenti degli attributi osservati.

```typescript
export class MyExtension extends HTMLElement {
  // Definisci gli attributi osservati
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

### 6. Adoption (Adozione)

L'elemento viene spostato in un nuovo document.

```typescript
export class MyExtension extends HTMLElement {
  adoptedCallback() {
    console.log('Extension adopted to new document');
    
    // Riconfigura per il nuovo contesto
    this.reinitializeForNewDocument();
  }

  private reinitializeForNewDocument() {
    // Operazioni necessarie per il nuovo document
    this.reapplyStyles();
    this.reconnectEventListeners();
  }
}
```

### 7. Disconnection (Disconnessione)

L'elemento viene rimosso dal DOM.

```typescript
export class MyExtension extends HTMLElement {
  private eventListeners: Array<() => void> = [];
  private intervals: number[] = [];
  private subscriptions: Array<() => void> = [];

  disconnectedCallback() {
    console.log('Extension disconnected from DOM');
    
    // Pulizia completa
    this.cleanup();
  }

  private cleanup() {
    // Rimuovi event listeners
    this.eventListeners.forEach(removeListener => removeListener());
    this.eventListeners = [];

    // Cancella interval e timeout
    this.intervals.forEach(id => clearInterval(id));
    this.intervals = [];

    // Annulla sottoscrizioni
    this.subscriptions.forEach(unsubscribe => unsubscribe());
    this.subscriptions = [];

    // Pulisci risorse specifiche
    this.cleanupAssets();
    this.disconnectFromStore();
  }
}
```

## Hooks del Lifecycle

### Pre-Connection Hook

```typescript
export class MyExtension extends HTMLElement {
  private async preConnectionSetup() {
    // Operazioni da completare prima della connessione
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
    
    // Operazioni post-connessione
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
    
    // Notifica sistema di errori
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
          <button onclick="location.reload()">Ricarica Pagina</button>
        </div>
      `;
    }
  }
}
```

## Gestione Asincrona

### Operazioni Asincrone nella Connessione

```typescript
export class MyExtension extends HTMLElement {
  private isInitialized = false;

  async connectedCallback() {
    if (this.isInitialized) return;

    try {
      // Mostra loading state
      this.renderLoadingState();

      // Operazioni asincrone
      const [config, assets, data] = await Promise.all([
        this.loadConfiguration(),
        this.preloadAssets(),
        this.fetchInitialData()
      ]);

      // Inizializzazione con dati caricati
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
          <p>Caricamento estensione...</p>
        </div>
      `;
    }
  }
}
```

## Comunicazione durante il Lifecycle

### Eventi del Lifecycle

```typescript
export class MyExtension extends HTMLElement {
  connectedCallback() {
    // Notifica connessione
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
    // Notifica disconnessione
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

### Coordinazione tra Estensioni

```typescript
export class MyExtension extends HTMLElement {
  connectedCallback() {
    this.render();
    
    // Ascolta altre estensioni
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

## Debugging del Lifecycle

### Logging Dettagliato

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

1. **Inizializzazione Graduale**: Carica solo le risorse necessarie immediatamente
2. **Gestione Errori**: Sempre gestire errori durante l'inizializzazione
3. **Pulizia Completa**: Rimuovi tutti i listener e risorse nella disconnessione
4. **Performance**: Usa `requestAnimationFrame` per operazioni di rendering
5. **Stato Persistente**: Mantieni lo stato tra disconnessioni se necessario
6. **Comunicazione**: Usa eventi personalizzati per coordinare con altre estensioni

## Riferimenti

- [Creare un'Estensione](./creating-extensions.md)
- [Extension Manifest](./extension-manifest.md)
- [Best Practices](./best-practices.md)
- [KimuExtensionManager](../core/kimu-extension-manager.md)
