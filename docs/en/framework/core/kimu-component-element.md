# KimuComponentElement

Abstract base class for all KIMU framework components and extensions.

## Description

`KimuComponentElement` is the fundamental class from which all KIMU components derive. It extends `HTMLElement` and provides essential functionality for lifecycle, rendering, and resource management.

**Key Features:**
- Automatic Shadow DOM for CSS/DOM isolation
- Lifecycle hooks for component lifecycle management
- Template-based rendering system
- Automatic asset and dependency management
- Utilities for DOM queries and resource loading

## Basic Usage

### Creating a Component

```typescript
import { KimuComponentElement } from './core/kimu-component-element';
import { KimuComponent } from './core/kimu-component';

@KimuComponent({
    tag: 'my-component',
    name: 'My Component',
    version: '1.0.0',
    path: 'my-component'
})
export class MyComponent extends KimuComponentElement {
    
    // Provides data for rendering
    getData(): Record<string, any> {
        return {
            title: 'Hello KIMU!',
            timestamp: Date.now()
        };
    }
    
    // Initialization hook
    onInit(): void {
        console.log('Component initialized');
    }
    
    // Hook after each render
    onRender(): void {
        console.log('Component rendered');
        
        // Access template elements
        const button = this.$('button');
        if (button) {
            button.addEventListener('click', () => {
                this.refresh(); // Re-render
            });
        }
    }
    
    // Destruction hook
    onDispose(): void {
        console.log('Component destroyed');
    }
}
```

### HTML Template (`view.html`)

```html
<div class="container">
    <h1>${title}</h1>
    <p>Timestamp: ${timestamp}</p>
    <button>Update</button>
</div>
```

### CSS Styles (`style.css`)

```css
:host {
    display: block;
    padding: 20px;
}

.container {
    background: #f0f0f0;
    border-radius: 8px;
    padding: 16px;
}

button {
    background: #007acc;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
}
```

## API

### Abstract Methods

#### `getData(): Record<string, any>`

**Required**: Provides data for template rendering.

**Returns:** `Record<string, any>` - Object with component data

**Example:**
```typescript
getData(): Record<string, any> {
    return {
        username: this.getAttribute('username') || 'Guest',
        isLoggedIn: this.hasAttribute('logged-in'),
        items: this.items || []
    };
}
```

### Lifecycle Hooks

#### `onInit(): void`

Hook called once after the component has been connected to the DOM and initialized.

**Typical usage:**
- Event setup
- State initialization
- Initial configuration

```typescript
onInit(): void {
    // Setup global events
    window.addEventListener('resize', this.handleResize.bind(this));
    
    // State initialization
    this.state = { count: 0 };
}
```

#### `onRender(): void`

Hook called after each template rendering.

**Typical usage:**
- DOM event binding
- Dynamic element updates
- Animations

```typescript
onRender(): void {
    // Event binding
    this.$('.btn-increment')?.addEventListener('click', () => {
        this.state.count++;
        this.refresh();
    });
    
    // Element updates
    const counter = this.$('.counter');
    if (counter) {
        counter.textContent = this.state.count.toString();
    }
}
```

#### `onDispose(): void`

Hook called when the component is removed from the DOM.

**Typical usage:**
- Event cleanup
- Timer cancellation
- Resource release

```typescript
onDispose(): void {
    // Event cleanup
    window.removeEventListener('resize', this.handleResize);
    
    // Timer cancellation
    if (this.timer) {
        clearInterval(this.timer);
    }
}
```

### Utility Methods

#### `$(selector: string): HTMLElement | null`

Shortcut for DOM query within the Shadow DOM.

**Parameters:**
- `selector: string` - CSS selector

**Returns:** `HTMLElement | null`

**Example:**
```typescript
onRender(): void {
    const button = this.$('button.primary');
    const inputs = this.shadowRoot?.querySelectorAll('input');
}
```

#### `refresh(): Promise<void>`

Forces a re-render of the component with current data.

**Usage:**
```typescript
// Update state and re-render
this.updateState();
await this.refresh();
```

#### `getMeta(): KimuExtensionMeta`

Gets the metadata associated with the component (defined in the decorator).

**Returns:** `KimuExtensionMeta`

**Example:**
```typescript
onInit(): void {
    const meta = this.getMeta();
    console.log(`Component: ${meta.name} v${meta.version}`);
}
```

### Resource Methods

#### `loadResource(file: string): Promise<any>`

Loads a JSON resource from the extension's `resources/` folder.

**Parameters:**
- `file: string` - Resource file name

**Returns:** `Promise<any>` - JSON content of the resource

**Example:**
```typescript
async onInit(): Promise<void> {
    try {
        const config = await this.loadResource('config.json');
        const translations = await this.loadResource('i18n/en.json');
        
        this.setupWithConfig(config);
    } catch (error) {
        console.error('Resource loading error:', error);
    }
}
```

#### `loadAssetUrl(file: string): string`

Generates the URL for an asset in the extension's `assets/` folder.

**Parameters:**
- `file: string` - Asset file name

**Returns:** `string` - Complete asset URL

**Example:**
```typescript
getData(): Record<string, any> {
    return {
        logoUrl: this.loadAssetUrl('logo.png'),
        iconUrl: this.loadAssetUrl('icons/user.svg')
    };
}
```

## Complete Lifecycle

```typescript
@KimuComponent({
    tag: 'advanced-component',
    name: 'Advanced Component',
    path: 'advanced-component',
    dependencies: ['base-utils'] // Load dependencies first
})
export class AdvancedComponent extends KimuComponentElement {
    private state: any = {};
    private timer?: number;
    
    // 1. Data for template
    getData(): Record<string, any> {
        return {
            ...this.state,
            timestamp: new Date().toLocaleString()
        };
    }
    
    // 2. Initialization (once)
    async onInit(): Promise<void> {
        // Load configuration
        const config = await this.loadResource('config.json');
        this.state = { ...config.defaultState };
        
        // Setup timer
        this.timer = window.setInterval(() => {
            this.refresh();
        }, 1000);
        
        console.log('✅ Component initialized');
    }
    
    // 3. After each render
    onRender(): void {
        // Event binding
        this.$('.update-btn')?.addEventListener('click', () => {
            this.handleUpdate();
        });
        
        console.log('🎨 Component rendered');
    }
    
    // 4. Cleanup (when removed)
    onDispose(): void {
        if (this.timer) {
            clearInterval(this.timer);
        }
        
        console.log('🗑️ Component destroyed');
    }
    
    private handleUpdate(): void {
        this.state.counter = (this.state.counter || 0) + 1;
        this.refresh();
    }
}
```

## Best Practices

### State Management

```typescript
// ✅ Local state in component
private state = {
    count: 0,
    isLoading: false
};

// ✅ State update with refresh
updateCount(newCount: number): void {
    this.state.count = newCount;
    this.refresh(); // Re-render with new data
}
```

### Event Management

```typescript
// ✅ Event binding in onRender
onRender(): void {
    // Remove old listeners if necessary
    this.$('.btn')?.removeEventListener('click', this.handleClick);
    
    // Add new listeners
    this.$('.btn')?.addEventListener('click', this.handleClick.bind(this));
}

// ✅ Cleanup in onDispose
onDispose(): void {
    this.$('.btn')?.removeEventListener('click', this.handleClick);
}
```

### Async Loading

```typescript
async onInit(): Promise<void> {
    try {
        // ✅ Parallel resource loading
        const [config, translations, userData] = await Promise.all([
            this.loadResource('config.json'),
            this.loadResource('i18n/en.json'),
            this.fetchUserData()
        ]);
        
        this.setupComponent(config, translations, userData);
        
    } catch (error) {
        this.handleError(error);
    }
}
```

## See Also

- **[@KimuComponent](../decorators/kimu-component.md)** - Decorator for registration
- **[KimuEngine](./kimu-engine.md)** - Rendering engine
- **[Creating Extensions](../extensions/creating-extensions.md)** - Extensions guide
- **[Asset Loading](../patterns/asset-loading.md)** - Asset loading patterns
