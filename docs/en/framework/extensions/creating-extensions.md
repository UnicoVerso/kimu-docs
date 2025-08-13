# Creating an Extension

This guide walks you through creating a new extension for the KIMU framework step by step.

## Prerequisites

- Basic knowledge of TypeScript
- Familiarity with Web Components
- KIMU framework configured and running

## Step 1: Extension Structure

Create a new folder in the `src/extensions/` directory:

```bash
mkdir src/extensions/my-extension
cd src/extensions/my-extension
```

## Step 2: Main Component File

Create the `component.ts` file which will be the entry point:

```typescript
import { KimuComponent } from '../../core/kimu-component';

@KimuComponent({
  tag: 'my-extension',
  name: 'My Extension',
  version: '1.0.0',
  description: 'A simple example extension'
})
export class MyExtension extends HTMLElement {
  private shadowRoot: ShadowRoot;

  constructor() {
    super();
    this.shadowRoot = this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  disconnectedCallback() {
    this.cleanup();
  }

  private render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          padding: 1rem;
          border: 1px solid #ddd;
          border-radius: 8px;
        }
        
        .container {
          text-align: center;
        }
        
        .title {
          color: var(--kimu-primary-color, #007acc);
          margin-bottom: 1rem;
        }
        
        .button {
          background: var(--kimu-accent-color, #00d4aa);
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          transition: opacity 0.2s;
        }
        
        .button:hover {
          opacity: 0.8;
        }
      </style>
      
      <div class="container">
        <h2 class="title">My Extension</h2>
        <p>This is my first KIMU extension!</p>
        <button class="button" id="actionBtn">Click Here</button>
        <div id="output"></div>
      </div>
    `;
  }

  private setupEventListeners() {
    const button = this.shadowRoot.querySelector('#actionBtn');
    const output = this.shadowRoot.querySelector('#output');

    button?.addEventListener('click', () => {
      if (output) {
        output.innerHTML = `<p>Button clicked at ${new Date().toLocaleTimeString()}!</p>`;
      }
    });
  }

  private cleanup() {
    // Clean up event listeners, timers, etc.
    console.log('MyExtension cleanup');
  }
}
```

## Step 3: Register the Extension

Add the extension to the `extensions-manifest.json` file:

```json
[
  {
    "tag": "kimu-home",
    "path": "kimu-home",
    "internal": true,
    "name": "KIMU Home Main App",
    "description": "Main interface container",
    "version": "1.0.0",
    "author": "UnicòVerso",
    "icon": "🏠",
    "kimuVersion": "1.0.0"
  },
  {
    "tag": "my-extension",
    "path": "my-extension",
    "internal": false,
    "name": "My Extension",
    "description": "A simple example extension",
    "version": "1.0.0",
    "author": "My Name",
    "icon": "🚀",
    "kimuVersion": "1.0.0"
  }
]
```

## Step 4: Build the Extension

Use the build script to compile your extension:

```bash
npm run build:extension my-extension
```

Or use the Node.js script directly:

```bash
node scripts/build-extension.js my-extension
```

## Step 5: Test the Extension

You can test your extension by including it in an HTML page:

```html
<!DOCTYPE html>
<html>
<head>
  <script type="module" src="dist/extensions/my-extension/component.js"></script>
</head>
<body>
  <my-extension></my-extension>
</body>
</html>
```

## Advanced Features

### Asset Management

If your extension needs assets (images, files, etc.), create an `assets/` folder:

```typescript
import { KimuAssetManager } from '../../core/kimu-asset-manager';

@KimuComponent({
  tag: 'my-extension',
  name: 'My Extension'
})
export class MyExtension extends HTMLElement {
  private async loadAssets() {
    const assetManager = KimuAssetManager.getInstance();
    const imageUrl = await assetManager.getAsset('my-extension/logo.png');
    
    const img = this.shadowRoot.querySelector('#logo') as HTMLImageElement;
    if (img) {
      img.src = imageUrl;
    }
  }

  connectedCallback() {
    this.render();
    this.loadAssets();
  }
}
```

### Inter-Extension Communication

Use KIMU's event system to communicate between extensions:

```typescript
// Send an event
this.dispatchEvent(new CustomEvent('my-extension:action', {
  bubbles: true,
  detail: { data: 'some data' }
}));

// Listen to events
document.addEventListener('other-extension:event', (event) => {
  console.log('Received event:', event.detail);
});
```

### State Management

Integrate with KimuStore for global state management:

```typescript
import { KimuStore } from '../../core/kimu-store';

@KimuComponent({
  tag: 'stateful-extension',
  name: 'Stateful Extension'
})
export class StatefulExtension extends HTMLElement {
  private store = KimuStore.getInstance();
  private unsubscribe?: () => void;

  connectedCallback() {
    this.render();
    
    // Subscribe to state changes
    this.unsubscribe = this.store.subscribe('myExtension', (state) => {
      this.updateUI(state);
    });
  }

  disconnectedCallback() {
    // Unsubscribe
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  private updateState(newData: any) {
    this.store.setState('myExtension', {
      ...this.store.getState('myExtension'),
      ...newData
    });
  }

  private updateUI(state: any) {
    // Update UI based on state
  }
}
```

## Best Practices

1. **Use Shadow DOM**: Ensures style isolation
2. **Manage Lifecycle**: Properly implement `connectedCallback` and `disconnectedCallback`
3. **Clean Up Resources**: Remove event listeners and timers on disconnection
4. **Use TypeScript**: Leverage typing for more robust code
5. **Test Your Extension**: Write tests for main functionality
6. **Document API**: Document props, events, and public methods

## Debugging

### Debug Tools

```typescript
// Enable detailed logging
@KimuComponent({
  tag: 'my-extension',
  name: 'My Extension',
  debug: true // Enable logging
})
export class MyExtension extends HTMLElement {
  // ...
}
```

### Console Logging

```typescript
private log(message: string, data?: any) {
  if (this.debug) {
    console.log(`[MyExtension] ${message}`, data || '');
  }
}
```

## References

- [Extension Lifecycle](./extension-lifecycle.md)
- [Extension Manifest](./extension-manifest.md)
- [KimuComponent Decorator](../decorators/kimu-component.md)
- [Best Practices](./best-practices.md)
