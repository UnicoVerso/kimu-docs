# @KimuComponent Decorator

The main decorator for registering and configuring Web Components in the KIMU framework. It provides a declarative way to define component metadata and automatically registers components with the custom elements registry.

## Overview

The `@KimuComponent` decorator:
- **Automatically registers** components as custom elements
- **Provides metadata** for the component system
- **Enables declarative configuration** of component properties
- **Integrates** with the KIMU extension system
- **Supports TypeScript** with full type safety

## Decorator Definition

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
    // Registration and configuration logic
    return constructor;
  };
}
```

## Configuration Properties

### Required Properties

#### `tag`
The custom element tag name (must include a hyphen).

```typescript
@KimuComponent({
  tag: 'my-component' // ✅ Valid
})
// tag: 'mycomponent' // ❌ Invalid - no hyphen
```

### Optional Properties

#### `name`
Human-readable component name.

```typescript
@KimuComponent({
  tag: 'user-profile',
  name: 'User Profile Component'
})
```

#### `version`
Component version (semantic versioning recommended).

```typescript
@KimuComponent({
  tag: 'data-table',
  version: '1.2.0'
})
```

#### `description`
Component description and purpose.

```typescript
@KimuComponent({
  tag: 'notification-toast',
  description: 'Displays temporary notification messages to users'
})
```

#### `author`
Component author or team.

```typescript
@KimuComponent({
  tag: 'chart-widget',
  author: 'Data Visualization Team'
})
```

#### `styles`
CSS styles for the component (string or array of strings).

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
Default HTML template for the component.

```typescript
@KimuComponent({
  tag: 'welcome-message',
  template: `
    <div class="welcome">
      <h2>Welcome!</h2>
      <p>Thanks for using our application.</p>
    </div>
  `
})
```

#### `dependencies`

List of child extensions (HTML tags) that will be automatically loaded and made available as custom tags in the parent extension's HTML template.

**How it works:**
- If your extension is a "parent" and contains other extensions as components, specify their tags in the `dependencies` field.
- Child extensions will be automatically loaded and made available in the `view.html` template.
- You can use child extensions as regular HTML tags inside your template.

**Practical example:**
```typescript
@KimuComponent({
        tag: 'dashboard-parent',
        name: 'Complete Dashboard',
        version: '1.0.0',
        dependencies: ['chart-widget', 'data-table', 'filter-panel'] // Child extensions
})
export class DashboardParent extends KimuComponentElement {
        // Parent component logic
}
```

In the `view.html` template:
```html
<div class="dashboard">
    <h2>Interactive Dashboard</h2>
    <!-- Use child extensions as HTML tags -->
    <chart-widget data="${chartData}"></chart-widget>
    <data-table items="${tableItems}"></data-table>
    <filter-panel @filter="${onFilter}"></filter-panel>
</div>
```

**Advantages:**
- Modularity: each component is independent
- Reusability: child extensions can be used in other contexts
- Maintainability: separate updates for each module
- Automatic loading: you don't have to manually manage dependencies

**Best practices:**
- Include only the dependencies you really need
- Always document the role of each child extension
- Use descriptive tag names for dependencies

#### `observedAttributes`
Attributes that should trigger `attributeChangedCallback`.

```typescript
@KimuComponent({
  tag: 'configurable-widget',
  observedAttributes: ['theme', 'size', 'data-source']
})
```

## Basic Usage

### Simple Component

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
        <h1>Hello, World!</h1>
        <p>This is my first KIMU component.</p>
      </div>
    `;
  }
}
```

### Component with Styles

```typescript
@KimuComponent({
  tag: 'custom-button',
  name: 'Custom Button',
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
        /* Styles are automatically injected by the decorator */
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
      
      // Dispatch custom event
      this.dispatchEvent(new CustomEvent('custom-click', {
        bubbles: true,
        detail: { timestamp: Date.now() }
      }));
    });
  }
}
```

### Advanced Component with Observed Attributes

```typescript
@KimuComponent({
  tag: 'data-display',
  name: 'Data Display Component',
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

## Extension Integration

### Creating Extension Components

```typescript
// Extension component with metadata
@KimuComponent({
  tag: 'extension-widget',
  name: 'Extension Widget',
  version: '2.1.0',
  description: 'A widget component for the extension system',
  author: 'KIMU Team',
  dependencies: ['kimu-core']
})
export class ExtensionWidget extends HTMLElement {
  connectedCallback() {
    // Register with extension system
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
    // Update component with new data
    this.render();
  }

  private render() {
    this.innerHTML = `
      <div class="extension-widget">
        <h3>Extension Widget</h3>
        <div class="widget-content">
          <!-- Dynamic content -->
        </div>
      </div>
    `;
  }
}
```

## Decorator Implementation

### Internal Decorator Logic

```typescript
function KimuComponent(config: KimuComponentConfig) {
  return function<T extends CustomElementConstructor>(constructor: T): T {
    // Validate configuration
    validateConfig(config);
    
    // Store metadata
    storeComponentMetadata(constructor, config);
    
    // Register custom element
    if (!customElements.get(config.tag)) {
      customElements.define(config.tag, constructor);
    }
    
    // Inject styles if provided
    if (config.styles) {
      injectStyles(constructor, config.styles);
    }
    
    // Set up template if provided
    if (config.template) {
      setupTemplate(constructor, config.template);
    }
    
    // Register observed attributes
    if (config.observedAttributes) {
      registerObservedAttributes(constructor, config.observedAttributes);
    }
    
    return constructor;
  };
}

function validateConfig(config: KimuComponentConfig): void {
  if (!config.tag) {
    throw new Error('Component tag is required');
  }
  
  if (!config.tag.includes('-')) {
    throw new Error('Component tag must contain a hyphen');
  }
  
  if (customElements.get(config.tag)) {
    console.warn(`Component ${config.tag} is already registered`);
  }
}

function storeComponentMetadata(constructor: any, config: KimuComponentConfig): void {
  // Store metadata for runtime access
  constructor._kimuMetadata = {
    ...config,
    registeredAt: Date.now()
  };
}
```

## TypeScript Integration

### Type-Safe Component Definition

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

  // Typed getters and setters
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

### 1. Component Naming

```typescript
// ✅ Good - Descriptive, kebab-case
@KimuComponent({ tag: 'user-profile-card' })
@KimuComponent({ tag: 'data-visualization-chart' })

// ❌ Bad - Too generic or wrong format
@KimuComponent({ tag: 'component' })
@KimuComponent({ tag: 'userProfile' }) // No hyphen
```

### 2. Metadata Completeness

```typescript
// ✅ Good - Complete metadata
@KimuComponent({
  tag: 'notification-banner',
  name: 'Notification Banner',
  version: '1.0.0',
  description: 'Displays important notifications to users',
  author: 'UI Team',
  dependencies: ['icon-library']
})

// ❌ Bad - Minimal metadata
@KimuComponent({
  tag: 'notification-banner'
})
```

### 3. Style Encapsulation

```typescript
// ✅ Good - Use Shadow DOM and :host
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

## References

- [Creating Extensions](../extensions/creating-extensions.md) - Using decorator in extensions
- [KimuComponentElement](../core/kimu-component-element.md) - Base component class
- [Web Components Standards](https://developer.mozilla.org/en-US/docs/Web/Web_Components) - Web Components API
- [Custom Elements Registry](https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry) - Browser API
