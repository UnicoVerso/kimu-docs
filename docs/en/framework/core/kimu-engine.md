# KimuEngine

Rendering engine and template management that provides core functionality for rendering, template loading, and dynamic component management.

## Description

`KimuEngine` acts as a bridge between the rendering system (Lit) and the asset manager, providing unified APIs for:

- Style injection in Shadow DOM
- HTML template loading and compilation
- Reactive rendering with Lit
- Dynamic component loading

**All methods are static**, making the class a central utility for rendering operations.

## Usage

### Style Injection

```typescript
import { KimuEngine } from './core/kimu-engine';

// Inject style into a component
await KimuEngine.injectStyle(
    this,                           // Target component
    'assets/theme.css',            // CSS path
    'my-theme-style'               // Unique ID (optional)
);
```

### Template Loading

```typescript
// Load and compile HTML template
const renderFunction = await KimuEngine.loadTemplate('/extensions/my-app/view.html');

// Use the rendering function
KimuEngine.render(this, { title: 'Hello!' }, renderFunction);
```

### Direct Rendering

```typescript
// Compile template from string
const templateString = '<h1>${title}</h1><p>${description}</p>';
const renderFn = KimuEngine.compileTemplate(templateString);

// Rendering with data
KimuEngine.render(this, {
    title: 'Dynamic Title',
    description: 'Updated content'
}, renderFn);
```

## API

### Style Management

#### `injectStyle(component, stylePath, styleId?): Promise<void>`

Injects a CSS file into the component's Shadow DOM.

**Parameters:**
- `component: HTMLElement` - Target component
- `stylePath: string` - Path to CSS file
- `styleId: string | null` - Unique ID for the style element (optional)

**Example:**
```typescript
// Inject main style
await KimuEngine.injectStyle(this, 'assets/main.css', 'main-style');

// Inject conditional theme
if (isDarkMode) {
    await KimuEngine.injectStyle(this, 'assets/dark-theme.css', 'dark-theme');
}
```

### Template Management

#### `loadTemplate(path): Promise<Function>`

Loads an HTML template file and compiles it into a Lit rendering function.

**Parameters:**
- `path: string` - Path to template file

**Returns:** `Promise<Function>` - Compiled rendering function

**Example:**
```typescript
// In a component
async connectedCallback(): Promise<void> {
    const templatePath = `/extensions/${this.getMeta().basePath}/view.html`;
    this._renderFn = await KimuEngine.loadTemplate(templatePath);
    this.refresh();
}
```

#### `compileTemplate(template): Function`

Compiles an HTML string into a Lit rendering function.

**Parameters:**
- `template: string` - HTML template string

**Returns:** `Function` - Rendering function

**Example:**
```typescript
// Dynamic template
const templateStr = `
    <div class="card">
        <h2>\${title}</h2>
        <p>\${description}</p>
        <button onclick="\${onClick}">\${buttonLabel}</button>
    </div>
`;

const renderFn = KimuEngine.compileTemplate(templateStr);

// Immediate use
KimuEngine.render(this, {
    title: 'Dynamic Card',
    description: 'Generated at runtime',
    buttonLabel: 'Click here',
    onClick: 'handleClick()'
}, renderFn);
```

### Rendering

#### `render(component, data, renderFn): void`

Performs reactive rendering using Lit.

**Parameters:**
- `component: HTMLElement` - Target component
- `data: Record<string, any>` - Data for the template
- `renderFn: Function` - Rendering function

**Example:**
```typescript
// Rendering with dynamic data
const data = {
    users: ['Alice', 'Bob', 'Charlie'],
    currentTime: new Date().toLocaleString(),
    isLoggedIn: true
};

KimuEngine.render(this, data, this._renderFn);
```

### Component Loading

#### `loadComponent(tag, path): Promise<any>`

Loads a component from a specific path and registers it if not already registered.

**Parameters:**
- `tag: string` - Component tag name
- `path: string` - Path to component module

**Returns:** `Promise<any>` - Loaded module

**Example:**
```typescript
// Dynamic component loading
await KimuEngine.loadComponent(
    'custom-widget',
    '/extensions/widgets/custom-widget/component.js'
);

// Now the component can be used
const widget = document.createElement('custom-widget');
```

## Advanced Examples

### Dynamic Theme System

```typescript
class ThemeManager {
    static async applyTheme(component: HTMLElement, themeName: string): Promise<void> {
        // Remove previous theme
        const oldTheme = component.shadowRoot?.getElementById('current-theme');
        if (oldTheme) {
            oldTheme.remove();
        }
        
        // Load new theme
        await KimuEngine.injectStyle(
            component,
            `assets/themes/${themeName}.css`,
            'current-theme'
        );
    }
}

// Usage
await ThemeManager.applyTheme(this, 'dark');
```

### Conditional Templates

```typescript
class ConditionalRenderer {
    static async renderByCondition(
        component: HTMLElement, 
        condition: string, 
        data: any
    ): Promise<void> {
        // Select template based on condition
        const templateMap = {
            'loading': 'templates/loading.html',
            'error': 'templates/error.html',
            'success': 'templates/content.html'
        };
        
        const templatePath = templateMap[condition] || templateMap['error'];
        const renderFn = await KimuEngine.loadTemplate(templatePath);
        
        KimuEngine.render(component, data, renderFn);
    }
}

// Usage
await ConditionalRenderer.renderByCondition(this, 'loading', {
    message: 'Loading in progress...'
});
```

### Dynamic Template Builder

```typescript
class TemplateBuilder {
    private static buildListTemplate(items: any[]): string {
        const itemTemplates = items.map((_, index) => 
            `<li class="item">\${items[${index}].name}</li>`
        ).join('');
        
        return `
            <div class="list-container">
                <h3>\${title}</h3>
                <ul class="items">
                    ${itemTemplates}
                </ul>
            </div>
        `;
    }
    
    static renderDynamicList(component: HTMLElement, data: any): void {
        const template = this.buildListTemplate(data.items);
        const renderFn = KimuEngine.compileTemplate(template);
        
        KimuEngine.render(component, data, renderFn);
    }
}

// Usage
TemplateBuilder.renderDynamicList(this, {
    title: 'Dynamic List',
    items: [
        { name: 'Item 1' },
        { name: 'Item 2' },
        { name: 'Item 3' }
    ]
});
```

### Rendering with Performance Monitoring

```typescript
class PerformantRenderer {
    static async renderWithProfiling(
        component: HTMLElement,
        data: any,
        renderFn: Function,
        label = 'render'
    ): Promise<void> {
        // Start profiling
        performance.mark(`${label}-start`);
        
        try {
            KimuEngine.render(component, data, renderFn);
            
            // End profiling
            performance.mark(`${label}-end`);
            performance.measure(label, `${label}-start`, `${label}-end`);
            
            const measure = performance.getEntriesByName(label)[0];
            console.log(`🎯 Rendering ${label}: ${measure.duration.toFixed(2)}ms`);
            
        } catch (error) {
            console.error(`❌ Rendering error ${label}:`, error);
        } finally {
            // Cleanup
            performance.clearMarks(`${label}-start`);
            performance.clearMarks(`${label}-end`);
            performance.clearMeasures(label);
        }
    }
}
```

## Integration with Lit

`KimuEngine` internally uses **Lit** for reactive rendering:

```typescript
import { html, render as litRender, TemplateResult } from 'lit';

// The compiled template uses Lit syntax
const template = html`
    <div class="component">
        <h1>${data.title}</h1>
        <p>${data.content}</p>
    </div>
`;

// Rendering in Shadow DOM
litRender(template, component.shadowRoot!);
```

## Best Practices

### ✅ Error Handling

```typescript
try {
    const renderFn = await KimuEngine.loadTemplate(templatePath);
    KimuEngine.render(this, data, renderFn);
} catch (error) {
    console.error('Rendering error:', error);
    // Fallback template
    const fallbackFn = KimuEngine.compileTemplate('<p>Loading error</p>');
    KimuEngine.render(this, {}, fallbackFn);
}
```

### ✅ Template Caching

```typescript
private static templateCache = new Map<string, Function>();

static async getCachedTemplate(path: string): Promise<Function> {
    if (!this.templateCache.has(path)) {
        const renderFn = await KimuEngine.loadTemplate(path);
        this.templateCache.set(path, renderFn);
    }
    return this.templateCache.get(path)!;
}
```

### ✅ Lazy Loading Components

```typescript
static async loadComponentLazy(tag: string): Promise<void> {
    if (!customElements.get(tag)) {
        const path = `/extensions/${tag}/component.js`;
        await KimuEngine.loadComponent(tag, path);
    }
}
```

## See Also

- **[KimuRender](./kimu-render.md)** - Lit rendering system
- **[KimuAssetManager](./kimu-asset-manager.md)** - Asset management
- **[KimuComponentElement](./kimu-component-element.md)** - Component base class
- **[Asset Loading](../patterns/asset-loading.md)** - Loading pattern
