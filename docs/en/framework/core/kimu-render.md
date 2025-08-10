# KimuRender

KimuRender is the rendering engine of the KIMU framework, based on the Lit library. It provides an efficient and reactive system for rendering templates and managing the DOM.

## Overview

KimuRender handles:
- **Template rendering** using Lit HTML templates
- **Reactive updates** based on property changes
- **Performance optimization** with efficient diff algorithms
- **Component lifecycle** integration
- **Style encapsulation** with Shadow DOM

## Key Features

### Lit-based Template System
Uses Lit's powerful template system for declarative UI:

```typescript
import { html, css } from 'lit';
import { KimuRender } from './kimu-render';

const template = html`
  <div class="container">
    <h1>${title}</h1>
    <p>${description}</p>
  </div>
`;

KimuRender.render(template, container);
```

### Reactive Property System
Automatic re-rendering when properties change:

```typescript
@KimuComponent({
  tag: 'reactive-component',
  name: 'Reactive Component'
})
export class ReactiveComponent extends HTMLElement {
  @property({ type: String })
  title = 'Default Title';

  @property({ type: Number })
  count = 0;

  render() {
    return html`
      <div>
        <h1>${this.title}</h1>
        <p>Count: ${this.count}</p>
        <button @click=${this.increment}>+</button>
      </div>
    `;
  }

  private increment() {
    this.count++;
    // Automatic re-render triggered
  }
}
```

## Core Methods

### render()

```typescript
public static render(
  template: TemplateResult, 
  container: HTMLElement | ShadowRoot,
  options?: RenderOptions
): void {
  render(template, container, options);
}
```

Renders a Lit template into a DOM container.

**Parameters**:
- `template` (TemplateResult): The Lit HTML template to render
- `container` (HTMLElement | ShadowRoot): Target container
- `options` (RenderOptions): Rendering options

**Example**:
```typescript
const template = html`<p>Hello, ${name}!</p>`;
KimuRender.render(template, this.shadowRoot);
```

### createTemplateResult()

```typescript
public static createTemplateResult(
  strings: TemplateStringsArray,
  values: any[]
): TemplateResult {
  return html(strings, ...values);
}
```

Creates a template result from template strings and values.

### renderStyles()

```typescript
public static renderStyles(styles: CSSResult[]): TemplateResult {
  return html`
    <style>
      ${styles.map(style => style.cssText).join('\n')}
    </style>
  `;
}
```

Renders CSS styles as a template result.

## Template Syntax

### Basic Interpolation

```typescript
const name = 'World';
const template = html`<h1>Hello, ${name}!</h1>`;
```

### Conditional Rendering

```typescript
const template = html`
  <div>
    ${isLoggedIn
      ? html`<p>Welcome back!</p>`
      : html`<p>Please log in</p>`
    }
  </div>
`;
```

### List Rendering

```typescript
const items = ['apple', 'banana', 'orange'];
const template = html`
  <ul>
    ${items.map(item => html`<li>${item}</li>`)}
  </ul>
`;
```

### Event Handling

```typescript
const template = html`
  <button @click=${handleClick}>
    Click me
  </button>
`;

function handleClick(event: Event) {
  console.log('Button clicked!');
}
```

### Property Binding

```typescript
const template = html`
  <input 
    .value=${inputValue}
    @input=${handleInput}
    ?disabled=${isDisabled}
  />
`;
```

### Attribute Binding

```typescript
const template = html`
  <div 
    class=${classNames}
    id=${elementId}
    data-value=${dataValue}
  >
    Content
  </div>
`;
```

## Advanced Features

### Directives

```typescript
import { classMap, styleMap } from 'lit/directives/class-map.js';

const template = html`
  <div 
    class=${classMap({
      active: isActive,
      disabled: isDisabled,
      'custom-class': hasCustomClass
    })}
    style=${styleMap({
      color: textColor,
      fontSize: `${fontSize}px`,
      display: isVisible ? 'block' : 'none'
    })}
  >
    Content with dynamic classes and styles
  </div>
`;
```

### Refs and Element Access

```typescript
import { ref, createRef } from 'lit/directives/ref.js';

export class MyComponent extends HTMLElement {
  private inputRef = createRef<HTMLInputElement>();

  render() {
    return html`
      <input ${ref(this.inputRef)} type="text" />
      <button @click=${this.focusInput}>Focus Input</button>
    `;
  }

  private focusInput() {
    this.inputRef.value?.focus();
  }
}
```

### Async Templates

```typescript
import { until } from 'lit/directives/until.js';

export class AsyncComponent extends HTMLElement {
  private async loadData(): Promise<TemplateResult> {
    const data = await fetch('/api/data').then(r => r.json());
    return html`<div>${data.content}</div>`;
  }

  render() {
    return html`
      <div>
        ${until(
          this.loadData(),
          html`<div class="loading">Loading...</div>`
        )}
      </div>
    `;
  }
}
```

## Style Management

### CSS Results

```typescript
import { css } from 'lit';

const styles = css`
  :host {
    display: block;
    padding: 1rem;
  }
  
  .title {
    color: var(--primary-color, #007acc);
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
  
  .content {
    line-height: 1.6;
  }
`;
```

### Dynamic Styles

```typescript
const dynamicStyles = css`
  .container {
    background-color: ${backgroundColor};
    border: 1px solid ${borderColor};
  }
`;
```

### Style Composition

```typescript
const baseStyles = css`
  :host {
    display: block;
  }
`;

const themeStyles = css`
  .dark-theme {
    background: #333;
    color: #fff;
  }
`;

const combinedStyles = [baseStyles, themeStyles];
```

## Performance Optimization

### Keyed Lists

```typescript
import { repeat } from 'lit/directives/repeat.js';

const template = html`
  <ul>
    ${repeat(
      items,
      (item) => item.id, // Key function
      (item) => html`<li>${item.name}</li>` // Template function
    )}
  </ul>
`;
```

### Lazy Rendering

```typescript
import { lazy } from 'lit/directives/lazy.js';

const template = html`
  <div>
    ${lazy(() => expensiveTemplate())}
  </div>
`;
```

### Memoization

```typescript
import { cache } from 'lit/directives/cache.js';

const template = html`
  <div>
    ${cache(
      isDetailView
        ? html`<detail-view .data=${data}></detail-view>`
        : html`<summary-view .data=${data}></summary-view>`
    )}
  </div>
`;
```

## Integration with KIMU Components

### Component Base Class

```typescript
@KimuComponent({
  tag: 'my-component',
  name: 'My Component'
})
export class MyComponent extends HTMLElement {
  private shadowRoot: ShadowRoot;

  constructor() {
    super();
    this.shadowRoot = this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  private render() {
    const template = html`
      <style>
        ${this.getStyles()}
      </style>
      <div class="container">
        ${this.getContent()}
      </div>
    `;

    KimuRender.render(template, this.shadowRoot);
  }

  private getStyles() {
    return css`
      .container {
        padding: 1rem;
        border: 1px solid #ddd;
      }
    `;
  }

  private getContent() {
    return html`
      <h2>My Component</h2>
      <p>This is a KIMU component using KimuRender</p>
    `;
  }
}
```

### Reactive Properties

```typescript
export class ReactiveKimuComponent extends HTMLElement {
  private _title = '';
  private _items: string[] = [];

  get title() { return this._title; }
  set title(value: string) {
    this._title = value;
    this.requestUpdate();
  }

  get items() { return this._items; }
  set items(value: string[]) {
    this._items = value;
    this.requestUpdate();
  }

  private requestUpdate() {
    // Debounced re-render
    if (!this.updateScheduled) {
      this.updateScheduled = true;
      requestAnimationFrame(() => {
        this.render();
        this.updateScheduled = false;
      });
    }
  }

  private render() {
    const template = html`
      <div>
        <h1>${this.title}</h1>
        <ul>
          ${this.items.map(item => html`<li>${item}</li>`)}
        </ul>
      </div>
    `;

    KimuRender.render(template, this.shadowRoot);
  }
}
```

## Error Handling

### Template Error Boundaries

```typescript
function safeTemplate(templateFn: () => TemplateResult): TemplateResult {
  try {
    return templateFn();
  } catch (error) {
    console.error('Template error:', error);
    return html`
      <div class="error">
        <h3>⚠️ Rendering Error</h3>
        <p>Something went wrong while rendering this component.</p>
      </div>
    `;
  }
}

// Usage
const template = safeTemplate(() => html`
  <div>${potentiallyErrorProneContent}</div>
`);
```

### Validation

```typescript
function validateTemplate(template: unknown): template is TemplateResult {
  return template && typeof template === 'object' && 'strings' in template;
}
```

## Best Practices

### Template Organization

```typescript
export class WellOrganizedComponent extends HTMLElement {
  // Separate template methods for better organization
  private renderHeader() {
    return html`
      <header class="component-header">
        <h1>${this.title}</h1>
      </header>
    `;
  }

  private renderContent() {
    return html`
      <main class="component-content">
        ${this.items.map(item => this.renderItem(item))}
      </main>
    `;
  }

  private renderItem(item: any) {
    return html`
      <div class="item" data-id=${item.id}>
        <h3>${item.title}</h3>
        <p>${item.description}</p>
      </div>
    `;
  }

  private renderFooter() {
    return html`
      <footer class="component-footer">
        <button @click=${this.handleAction}>Action</button>
      </footer>
    `;
  }

  render() {
    return html`
      <div class="component-wrapper">
        ${this.renderHeader()}
        ${this.renderContent()}
        ${this.renderFooter()}
      </div>
    `;
  }
}
```

### Performance Tips

1. **Use keyed lists** for dynamic content
2. **Memoize expensive templates** with cache directive
3. **Avoid creating functions in templates** - they break memoization
4. **Use lazy directive** for expensive content
5. **Batch property updates** to avoid multiple re-renders

### Accessibility

```typescript
const accessibleTemplate = html`
  <div 
    role="button"
    tabindex="0"
    aria-label=${buttonLabel}
    aria-pressed=${isPressed}
    @click=${handleClick}
    @keydown=${handleKeydown}
  >
    ${buttonText}
  </div>
`;
```

## Related Components

- [KimuComponentElement](./kimu-component-element.md) - Base class for components
- [KimuComponent Decorator](../decorators/kimu-component.md) - Component registration
- [KimuEngine](./kimu-engine.md) - Template engine integration
- [Extension Development](../extensions/creating-extensions.md) - Using render in extensions
