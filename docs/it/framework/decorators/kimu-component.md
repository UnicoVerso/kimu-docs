# @KimuComponent Decorator

Il decorator principale per registrare e configurare Web Components nel framework KIMU. Fornisce un modo dichiarativo per definire i metadata dei componenti e registra automaticamente i componenti con il registro degli elementi personalizzati.

## Panoramica

Il decorator `@KimuComponent`:
- **Registra automaticamente** i componenti come elementi personalizzati
- **Fornisce metadata** per il sistema di componenti
- **Abilita la configurazione dichiarativa** delle proprietà dei componenti
- **Si integra** con il sistema di estensioni KIMU
- **Supporta TypeScript** con completa sicurezza dei tipi

## Definizione del Decorator

```typescript
interface KimuComponentConfig {
  tag: string;
  name?: string;
  version?: string;
  description?: string;
  author?: string;
  styles?: string | string[];
  template?: string;
  dependencies?: string[];
  observedAttributes?: string[];
}

function KimuComponent(config: KimuComponentConfig) {
  return function<T extends CustomElementConstructor>(constructor: T): T {
    // Logica di registrazione e configurazione
    return constructor;
  };
}
```

## Proprietà di Configurazione

### Proprietà Obbligatorie

#### `tag`
Il nome del tag dell'elemento personalizzato (deve includere un trattino).

```typescript
@KimuComponent({
  tag: 'my-component' // ✅ Valido
})
// tag: 'mycomponent' // ❌ Non valido - manca il trattino
```

### Proprietà Opzionali

#### `name`
Nome leggibile del componente.

```typescript
@KimuComponent({
  tag: 'user-profile',
  name: 'User Profile Component'
})
```

#### `version`
Versione del componente (raccomandato semantic versioning).

```typescript
@KimuComponent({
  tag: 'data-table',
  version: '1.2.0'
})
```

#### `description`
Descrizione e scopo del componente.

```typescript
@KimuComponent({
  tag: 'notification-toast',
  description: 'Mostra messaggi di notifica temporanei agli utenti'
})
```

#### `author`
Autore o team del componente.

```typescript
@KimuComponent({
  tag: 'chart-widget',
  author: 'Team Visualizzazione Dati'
})
```

#### `styles`
Stili CSS per il componente (stringa o array di stringhe).

```typescript
@KimuComponent({
  tag: 'styled-button',
  styles: `
    :host {
      display: inline-block;
      padding: 8px 16px;
      background: #007acc;
      color: white;
      border-radius: 4px;
      cursor: pointer;
    }
    
    :host(:hover) {
      background: #005999;
    }
  `
})
```

#### `template`
Template HTML di default per il componente.

```typescript
@KimuComponent({
  tag: 'welcome-message',
  template: `
    <div class="welcome">
      <h2>Benvenuto!</h2>
      <p>Grazie per aver scelto la nostra applicazione.</p>
    </div>
  `
})
```

#### `dependencies`

Lista di estensioni figlie (tag HTML) che verranno caricate automaticamente e rese disponibili come tag personalizzati nel template HTML dell'estensione padre.

**Come funziona:**
- Se la tua estensione è "padre" e contiene altre estensioni come componenti, specifica i loro tag nel campo `dependencies`.
- Le estensioni figlie verranno automaticamente caricate e rese disponibili nel template `view.html`.
- Puoi utilizzare le estensioni figlie come normali tag HTML all'interno del tuo template.

**Esempio pratico:**
```typescript
@KimuComponent({
        tag: 'dashboard-parent',
        name: 'Dashboard Completa',
        version: '1.0.0',
        dependencies: ['chart-widget', 'data-table', 'filter-panel'] // Estensioni figlie
})
export class DashboardParent extends KimuComponentElement {
        // Logica del componente padre
}
```

Nel template `view.html`:
```html
<div class="dashboard">
    <h2>Dashboard Interattiva</h2>
    <!-- Utilizzo delle estensioni figlie come tag HTML -->
    <chart-widget data="${chartData}"></chart-widget>
    <data-table items="${tableItems}"></data-table>
    <filter-panel @filter="${onFilter}"></filter-panel>
</div>
```

**Vantaggi:**
- Modularità: ogni componente è indipendente
- Riutilizzo: le estensioni figlie possono essere usate in altri contesti
- Manutenibilità: aggiornamenti separati per ogni modulo
- Caricamento automatico: non devi gestire manualmente le dipendenze

**Best practice:**
- Includi solo le dipendenze effettivamente necessarie
- Documenta sempre il ruolo di ogni estensione figlia
- Usa nomi di tag descrittivi per le dipendenze

#### `observedAttributes`
Attributi che dovrebbero attivare `attributeChangedCallback`.

```typescript
@KimuComponent({
  tag: 'configurable-widget',
  observedAttributes: ['theme', 'size', 'data-source']
})
```

## Utilizzo Base

### Componente Semplice

```typescript
import { KimuComponent } from '../decorators/kimu-component';

@KimuComponent({
  tag: 'hello-world',
  name: 'Hello World Component',
  version: '1.0.0'
})
export class HelloWorld extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div>
        <h1>Ciao, Mondo!</h1>
        <p>Questo è il mio primo componente KIMU.</p>
      </div>
    `;
  }
}
```

### Componente con Stili

```typescript
@KimuComponent({
  tag: 'custom-button',
  name: 'Pulsante Personalizzato',
  styles: `
    :host {
      display: inline-block;
      padding: 10px 20px;
      background: var(--primary-color, #007acc);
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-family: inherit;
      font-size: 14px;
      transition: all 0.2s ease;
    }
    
    :host(:hover) {
      background: var(--primary-color-hover, #005999);
      transform: translateY(-1px);
    }
    
    :host(:active) {
      transform: translateY(0);
    }
    
    :host([disabled]) {
      opacity: 0.6;
      cursor: not-allowed;
      pointer-events: none;
    }
  `
})
export class CustomButton extends HTMLElement {
  private shadowRoot: ShadowRoot;

  constructor() {
    super();
    this.shadowRoot = this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  private render() {
    this.shadowRoot.innerHTML = `
      <style>
        /* Gli stili vengono automaticamente iniettati dal decorator */
      </style>
      <button>
        <slot></slot>
      </button>
    `;
  }

  private setupEventListeners() {
    const button = this.shadowRoot.querySelector('button');
    button?.addEventListener('click', (e) => {
      if (this.hasAttribute('disabled')) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      
      // Invia evento personalizzato
      this.dispatchEvent(new CustomEvent('custom-click', {
        bubbles: true,
        detail: { timestamp: Date.now() }
      }));
    });
  }
}
```

### Componente Avanzato con Attributi Osservati

```typescript
@KimuComponent({
  tag: 'data-display',
  name: 'Componente Visualizzazione Dati',
  observedAttributes: ['data-source', 'format', 'theme'],
  dependencies: ['loading-spinner', 'error-message']
})
export class DataDisplay extends HTMLElement {
  private data: any = null;
  private format: 'table' | 'list' | 'grid' = 'list';
  private theme: 'light' | 'dark' = 'light';

  static get observedAttributes() {
    return ['data-source', 'format', 'theme'];
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    switch (name) {
      case 'data-source':
        this.loadData(newValue);
        break;
      case 'format':
        this.format = newValue as 'table' | 'list' | 'grid';
        this.render();
        break;
      case 'theme':
        this.theme = newValue as 'light' | 'dark';
        this.updateTheme();
        break;
    }
  }

  private async loadData(source: string) {
    this.showLoading();
    
    try {
      const response = await fetch(source);
      this.data = await response.json();
      this.render();
    } catch (error) {
      this.showError(error.message);
    }
  }

  private render() {
    if (!this.data) return;

    const content = this.format === 'table' 
      ? this.renderTable()
      : this.format === 'grid'
      ? this.renderGrid()
      : this.renderList();

    this.innerHTML = `
      <div class="data-display theme-${this.theme}">
        ${content}
      </div>
    `;
  }

  private renderTable(): string {
    if (!Array.isArray(this.data)) return '';
    
    const headers = Object.keys(this.data[0] || {});
    return `
      <table>
        <thead>
          <tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>
        </thead>
        <tbody>
          ${this.data.map(row => `
            <tr>${headers.map(h => `<td>${row[h] || ''}</td>`).join('')}</tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  private renderList(): string {
    if (!Array.isArray(this.data)) return '';
    
    return `
      <ul class="data-list">
        ${this.data.map(item => `
          <li class="data-item">${JSON.stringify(item)}</li>
        `).join('')}
      </ul>
    `;
  }

  private renderGrid(): string {
    if (!Array.isArray(this.data)) return '';
    
    return `
      <div class="data-grid">
        ${this.data.map(item => `
          <div class="grid-item">${JSON.stringify(item)}</div>
        `).join('')}
      </div>
    `;
  }

  private showLoading() {
    this.innerHTML = '<loading-spinner></loading-spinner>';
  }

  private showError(message: string) {
    this.innerHTML = `<error-message message="${message}"></error-message>`;
  }

  private updateTheme() {
    this.className = `data-display theme-${this.theme}`;
  }
}
```

## Integrazione con le Estensioni

### Creazione di Componenti Estensione

```typescript
// Componente estensione con metadata
@KimuComponent({
  tag: 'extension-widget',
  name: 'Widget Estensione',
  version: '2.1.0',
  description: 'Un componente widget per il sistema di estensioni',
  author: 'KIMU Team',
  dependencies: ['kimu-core']
})
export class ExtensionWidget extends HTMLElement {
  connectedCallback() {
    // Registra con il sistema di estensioni
    this.dispatchEvent(new CustomEvent('kimu:component-ready', {
      bubbles: true,
      detail: {
        tag: 'extension-widget',
        version: '2.1.0',
        api: this.getPublicAPI()
      }
    }));

    this.render();
  }

  getPublicAPI() {
    return {
      show: this.show.bind(this),
      hide: this.hide.bind(this),
      setData: this.setData.bind(this)
    };
  }

  show() {
    this.style.display = 'block';
  }

  hide() {
    this.style.display = 'none';
  }

  setData(data: any) {
    // Aggiorna il componente con nuovi dati
    this.render();
  }

  private render() {
    this.innerHTML = `
      <div class="extension-widget">
        <h3>Widget Estensione</h3>
        <div class="widget-content">
          <!-- Contenuto dinamico -->
        </div>
      </div>
    `;
  }
}
```

## Implementazione del Decorator

### Logica Interna del Decorator

```typescript
function KimuComponent(config: KimuComponentConfig) {
  return function<T extends CustomElementConstructor>(constructor: T): T {
    // Valida la configurazione
    validateConfig(config);
    
    // Memorizza metadata
    storeComponentMetadata(constructor, config);
    
    // Registra l'elemento personalizzato
    if (!customElements.get(config.tag)) {
      customElements.define(config.tag, constructor);
    }
    
    // Inietta gli stili se forniti
    if (config.styles) {
      injectStyles(constructor, config.styles);
    }
    
    // Imposta il template se fornito
    if (config.template) {
      setupTemplate(constructor, config.template);
    }
    
    // Registra gli attributi osservati
    if (config.observedAttributes) {
      registerObservedAttributes(constructor, config.observedAttributes);
    }
    
    return constructor;
  };
}

function validateConfig(config: KimuComponentConfig): void {
  if (!config.tag) {
    throw new Error('Il tag del componente è obbligatorio');
  }
  
  if (!config.tag.includes('-')) {
    throw new Error('Il tag del componente deve contenere un trattino');
  }
  
  if (customElements.get(config.tag)) {
    console.warn(`Il componente ${config.tag} è già registrato`);
  }
}

function storeComponentMetadata(constructor: any, config: KimuComponentConfig): void {
  // Memorizza metadata per accesso runtime
  constructor._kimuMetadata = {
    ...config,
    registeredAt: Date.now()
  };
}
```

## Integrazione TypeScript

### Definizione di Componenti Type-Safe

```typescript
interface ComponentProps {
  title: string;
  items: string[];
  theme: 'light' | 'dark';
}

@KimuComponent({
  tag: 'typed-component',
  observedAttributes: ['title', 'theme']
})
export class TypedComponent extends HTMLElement implements ComponentProps {
  private _title: string = '';
  private _items: string[] = [];
  private _theme: 'light' | 'dark' = 'light';

  // Getter e setter tipizzati
  get title(): string {
    return this._title;
  }

  set title(value: string) {
    this._title = value;
    this.setAttribute('title', value);
  }

  get items(): string[] {
    return this._items;
  }

  set items(value: string[]) {
    this._items = value;
    this.render();
  }

  get theme(): 'light' | 'dark' {
    return this._theme;
  }

  set theme(value: 'light' | 'dark') {
    this._theme = value;
    this.setAttribute('theme', value);
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    switch (name) {
      case 'title':
        this._title = newValue;
        this.render();
        break;
      case 'theme':
        this._theme = newValue as 'light' | 'dark';
        this.updateTheme();
        break;
    }
  }

  private render() {
    this.innerHTML = `
      <div class="typed-component theme-${this.theme}">
        <h2>${this.title}</h2>
        <ul>
          ${this.items.map(item => `<li>${item}</li>`).join('')}
        </ul>
      </div>
    `;
  }

  private updateTheme() {
    this.className = `typed-component theme-${this.theme}`;
  }
}
```

## Best Practices

### 1. Denominazione dei Componenti

```typescript
// ✅ Buono - Descrittivo, kebab-case
@KimuComponent({ tag: 'user-profile-card' })
@KimuComponent({ tag: 'data-visualization-chart' })

// ❌ Cattivo - Troppo generico o formato sbagliato
@KimuComponent({ tag: 'component' })
@KimuComponent({ tag: 'userProfile' }) // Manca il trattino
```

### 2. Completezza dei Metadata

```typescript
// ✅ Buono - Metadata completi
@KimuComponent({
  tag: 'notification-banner',
  name: 'Banner di Notifica',
  version: '1.0.0',
  description: 'Mostra notifiche importanti agli utenti',
  author: 'UI Team',
  dependencies: ['icon-library']
})

// ❌ Cattivo - Metadata minimi
@KimuComponent({
  tag: 'notification-banner'
})
```

### 3. Incapsulamento degli Stili

```typescript
// ✅ Buono - Usa Shadow DOM e :host
@KimuComponent({
  tag: 'encapsulated-component',
  styles: `
    :host {
      display: block;
      padding: 1rem;
    }
    
    :host(.compact) {
      padding: 0.5rem;
    }
  `
})
export class EncapsulatedComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }
}
```

## Riferimenti

- [Creare Estensioni](../extensions/creating-extensions.md) - Uso del decorator nelle estensioni
- [KimuComponentElement](../core/kimu-component-element.md) - Classe base per componenti
- [Web Components Standards](https://developer.mozilla.org/en-US/docs/Web/Web_Components) - API Web Components
- [Custom Elements Registry](https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry) - API browser
    
    return constructor;
  };
}

function validateConfig(config: KimuComponentConfig): void {
  if (!config.tag) {
    throw new Error('Il tag del componente è obbligatorio');
  }
  
  if (!config.tag.includes('-')) {
    throw new Error('Il tag del componente deve contenere un trattino');
  }
  
  if (customElements.get(config.tag)) {
    console.warn(`Il componente ${config.tag} è già registrato`);
  }
}

function storeComponentMetadata(constructor: any, config: KimuComponentConfig): void {
  // Memorizza metadata per accesso runtime
  constructor._kimuMetadata = {
    ...config,
    registeredAt: Date.now()
  };
}
}

## Decorator Definition
