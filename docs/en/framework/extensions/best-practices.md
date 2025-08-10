# Best Practices for Extensions

This guide collects the best practices for developing robust, performant, and maintainable KIMU extensions.

## Architecture

### Design Principles

#### Single Responsibility
Each extension should have a single well-defined responsibility:

```typescript
// ✅ Good - specific responsibility
@KimuComponent({
  tag: 'notification-display',
  name: 'Notification Display'
})
export class NotificationDisplay extends HTMLElement {
  // Only notification display
}

// ❌ Bad - too many responsibilities
@KimuComponent({
  tag: 'mega-component',
  name: 'Mega Component'
})
export class MegaComponent extends HTMLElement {
  // Handles notifications, user management, api calls, UI...
}
```

#### Composition over Inheritance
Prefer composition over inheritance:

```typescript
// ✅ Good - composition
export class DataTable extends HTMLElement {
  private dataService = new DataService();
  private renderer = new TableRenderer();
  private validator = new DataValidator();
}

// ❌ Bad - deep inheritance
export class DataTable extends BaseTable extends BaseComponent extends HTMLElement {
  // Complex hierarchy
}
```

### Modularity

#### Separation of Concerns

```typescript
// services/api-service.ts
export class ApiService {
  async fetchData(endpoint: string) {
    // API logic
  }
}

// renderers/table-renderer.ts
export class TableRenderer {
  render(data: any[], container: HTMLElement) {
    // Rendering logic
  }
}

// components/data-table.ts
import { ApiService } from '../services/api-service';
import { TableRenderer } from '../renderers/table-renderer';

@KimuComponent({
  tag: 'data-table',
  name: 'Data Table'
})
export class DataTable extends HTMLElement {
  private apiService = new ApiService();
  private renderer = new TableRenderer();
  
  // Component that coordinates
}
```

## Performance

### Lazy Loading

#### Deferred Component Loading

```typescript
export class MyExtension extends HTMLElement {
  private heavyComponentLoaded = false;

  private async loadHeavyComponent() {
    if (this.heavyComponentLoaded) return;

    // Load only when needed
    const { HeavyComponent } = await import('./heavy-component');
    const component = new HeavyComponent();
    
    this.shadowRoot.appendChild(component);
    this.heavyComponentLoaded = true;
  }

  private handleUserAction() {
    // Load heavy component only on user action
    this.loadHeavyComponent();
  }
}
```

#### Efficient Asset Loading

```typescript
export class MediaExtension extends HTMLElement {
  private preloadedAssets = new Map<string, string>();

  private async preloadCriticalAssets() {
    const criticalAssets = ['logo.svg', 'main-bg.jpg'];
    
    const promises = criticalAssets.map(async (asset) => {
      const url = await this.loadAsset(asset);
      this.preloadedAssets.set(asset, url);
    });

    await Promise.all(promises);
  }

  private async loadAsset(name: string): Promise<string> {
    // Load asset with caching
    const cached = this.preloadedAssets.get(name);
    if (cached) return cached;

    const assetManager = KimuAssetManager.getInstance();
    return await assetManager.getAsset(`my-extension/${name}`);
  }
}
```

### Rendering Optimization

#### Virtual DOM Pattern

```typescript
interface VirtualNode {
  tag: string;
  props: Record<string, any>;
  children: (VirtualNode | string)[];
}

export class OptimizedList extends HTMLElement {
  private virtualDOM: VirtualNode[] = [];
  private renderedItems = new Set<string>();

  private createVirtualNode(item: any): VirtualNode {
    return {
      tag: 'div',
      props: { 
        class: 'list-item',
        'data-id': item.id 
      },
      children: [item.name]
    };
  }

  private renderVirtualDOM() {
    // Render only changed elements
    this.virtualDOM.forEach(node => {
      if (!this.renderedItems.has(node.props['data-id'])) {
        this.renderNode(node);
        this.renderedItems.add(node.props['data-id']);
      }
    });
  }
}
```

#### Batch Updates

```typescript
export class DataGrid extends HTMLElement {
  private pendingUpdates: Array<() => void> = [];
  private updateScheduled = false;

  private scheduleUpdate(updateFn: () => void) {
    this.pendingUpdates.push(updateFn);
    
    if (!this.updateScheduled) {
      this.updateScheduled = true;
      requestAnimationFrame(() => {
        this.processPendingUpdates();
      });
    }
  }

  private processPendingUpdates() {
    this.pendingUpdates.forEach(update => update());
    this.pendingUpdates = [];
    this.updateScheduled = false;
  }

  public updateCell(row: number, col: number, value: any) {
    this.scheduleUpdate(() => {
      // Update single cell
      const cell = this.getCell(row, col);
      if (cell) {
        cell.textContent = value;
      }
    });
  }
}
```

## State Management

### Local vs Global State

#### Local State for UI

```typescript
export class ToggleButton extends HTMLElement {
  // Local state for simple UI
  private isExpanded = false;

  private toggle() {
    this.isExpanded = !this.isExpanded;
    this.updateUI();
  }

  private updateUI() {
    this.classList.toggle('expanded', this.isExpanded);
    this.setAttribute('aria-expanded', String(this.isExpanded));
  }
}
```

#### Global State for Shared Data

```typescript
export class UserProfile extends HTMLElement {
  private store = KimuStore.getInstance();
  private unsubscribe?: () => void;

  connectedCallback() {
    this.render();
    
    // Subscribe to global state
    this.unsubscribe = this.store.subscribe('user', (userData) => {
      this.updateProfile(userData);
    });
  }

  disconnectedCallback() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  private updateProfile(userData: any) {
    // Update UI based on global state
  }
}
```

### Immutability

```typescript
// ✅ Good - immutable state
private updateUserData(updates: Partial<UserData>) {
  const currentUser = this.store.getState('user');
  const updatedUser = {
    ...currentUser,
    ...updates,
    lastModified: new Date().toISOString()
  };
  
  this.store.setState('user', updatedUser);
}

// ❌ Bad - direct mutation
private updateUserData(updates: Partial<UserData>) {
  const user = this.store.getState('user');
  Object.assign(user, updates); // Direct mutation!
  this.store.setState('user', user);
}
```

## Error Handling

### Graceful Degradation

```typescript
export class ApiDrivenComponent extends HTMLElement {
  private fallbackData = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' }
  ];

  private async loadData() {
    try {
      const data = await this.apiService.fetchData();
      this.renderData(data);
    } catch (error) {
      console.warn('API failed, using fallback data:', error);
      this.renderData(this.fallbackData);
      this.showOfflineIndicator();
    }
  }

  private showOfflineIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'offline-indicator';
    indicator.textContent = 'Data not up to date - offline mode';
    this.shadowRoot.prepend(indicator);
  }
}
```

### Error Boundaries

```typescript
export class ErrorBoundary extends HTMLElement {
  private hasError = false;

  private handleError(error: Error, errorInfo?: any) {
    this.hasError = true;
    console.error('Extension error:', error, errorInfo);
    
    // Log error to monitoring system
    this.reportError(error, errorInfo);
    
    // Show error UI
    this.renderErrorUI(error);
  }

  private renderErrorUI(error: Error) {
    this.innerHTML = `
      <div class="error-boundary">
        <h3>⚠️ Something went wrong</h3>
        <p>An error occurred in the extension.</p>
        <details>
          <summary>Technical details</summary>
          <pre>${error.message}\n${error.stack}</pre>
        </details>
        <button onclick="location.reload()">Reload Page</button>
      </div>
    `;
  }

  private reportError(error: Error, context?: any) {
    // Send error to monitoring system
    if (window.kimu?.errorReporter) {
      window.kimu.errorReporter.report(error, {
        component: this.tagName,
        context
      });
    }
  }
}
```

## Security

### Input Sanitization

```typescript
export class UserInputComponent extends HTMLElement {
  private sanitizeInput(input: string): string {
    // Remove dangerous scripts and HTML
    const temp = document.createElement('div');
    temp.textContent = input;
    return temp.innerHTML;
  }

  private validateInput(input: string): boolean {
    // Input validation
    const patterns = {
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      username: /^[a-zA-Z0-9_]{3,20}$/,
      safeText: /^[a-zA-Z0-9\s\-_.,!?]{1,200}$/
    };

    return patterns.safeText.test(input);
  }

  private handleUserInput(event: Event) {
    const input = (event.target as HTMLInputElement).value;
    
    if (!this.validateInput(input)) {
      this.showValidationError('Invalid input');
      return;
    }

    const sanitized = this.sanitizeInput(input);
    this.processInput(sanitized);
  }
}
```

### Content Security Policy

```typescript
// Avoid eval() and innerHTML with untrusted content
export class SecureRenderer extends HTMLElement {
  // ✅ Good - use textContent
  private renderSafeText(text: string) {
    const element = document.createElement('p');
    element.textContent = text; // Safe
    this.shadowRoot.appendChild(element);
  }

  // ✅ Good - use createElement for structured HTML
  private renderStructuredContent(data: any) {
    const container = document.createElement('div');
    
    const title = document.createElement('h3');
    title.textContent = data.title;
    
    const content = document.createElement('p');
    content.textContent = data.content;
    
    container.append(title, content);
    this.shadowRoot.appendChild(container);
  }

  // ❌ Bad - innerHTML with external data
  private renderUnsafe(html: string) {
    this.innerHTML = html; // Potential XSS!
  }
}
```

## Accessibility

### ARIA and Semantic HTML

```typescript
export class AccessibleModal extends HTMLElement {
  private isOpen = false;

  connectedCallback() {
    this.setupAccessibility();
    this.render();
  }

  private setupAccessibility() {
    // ARIA attributes
    this.setAttribute('role', 'dialog');
    this.setAttribute('aria-modal', 'true');
    this.setAttribute('aria-labelledby', 'modal-title');
    this.setAttribute('aria-describedby', 'modal-description');
    
    // Keyboard navigation
    this.tabIndex = -1;
    this.addEventListener('keydown', this.handleKeyDown.bind(this));
  }

  private handleKeyDown(event: KeyboardEvent) {
    switch (event.key) {
      case 'Escape':
        this.close();
        break;
      case 'Tab':
        this.handleTabNavigation(event);
        break;
    }
  }

  private handleTabNavigation(event: KeyboardEvent) {
    const focusableElements = this.getFocusableElements();
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  }

  private getFocusableElements(): HTMLElement[] {
    const selector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    return Array.from(this.querySelectorAll(selector));
  }

  open() {
    this.isOpen = true;
    this.setAttribute('aria-hidden', 'false');
    this.focus();
    
    // Trap focus
    document.addEventListener('focus', this.trapFocus.bind(this), true);
  }

  close() {
    this.isOpen = false;
    this.setAttribute('aria-hidden', 'true');
    
    // Release focus trap
    document.removeEventListener('focus', this.trapFocus.bind(this), true);
  }
}
```

### Focus Management

```typescript
export class TabPanel extends HTMLElement {
  private activeTabIndex = 0;

  private setupKeyboardNavigation() {
    const tabs = this.getAllTabs();
    
    tabs.forEach((tab, index) => {
      tab.addEventListener('keydown', (event) => {
        switch (event.key) {
          case 'ArrowRight':
            event.preventDefault();
            this.activateTab((index + 1) % tabs.length);
            break;
          case 'ArrowLeft':
            event.preventDefault();
            this.activateTab((index - 1 + tabs.length) % tabs.length);
            break;
          case 'Home':
            event.preventDefault();
            this.activateTab(0);
            break;
          case 'End':
            event.preventDefault();
            this.activateTab(tabs.length - 1);
            break;
        }
      });
    });
  }

  private activateTab(index: number) {
    const tabs = this.getAllTabs();
    const panels = this.getAllPanels();

    // Deactivate all
    tabs.forEach(tab => {
      tab.setAttribute('aria-selected', 'false');
      tab.tabIndex = -1;
    });
    
    panels.forEach(panel => {
      panel.setAttribute('aria-hidden', 'true');
    });

    // Activate selected
    tabs[index].setAttribute('aria-selected', 'true');
    tabs[index].tabIndex = 0;
    tabs[index].focus();
    
    panels[index].setAttribute('aria-hidden', 'false');
    
    this.activeTabIndex = index;
  }
}
```

## Testing

### Unit Testing

```typescript
// my-extension.test.ts
import { MyExtension } from './my-extension';

describe('MyExtension', () => {
  let element: MyExtension;

  beforeEach(() => {
    element = new MyExtension();
    document.body.appendChild(element);
  });

  afterEach(() => {
    document.body.removeChild(element);
  });

  it('should render correctly', () => {
    expect(element.shadowRoot.querySelector('h1')).toBeTruthy();
  });

  it('should handle user interaction', () => {
    const button = element.shadowRoot.querySelector('button');
    const spy = jest.spyOn(element, 'handleClick');
    
    button.click();
    
    expect(spy).toHaveBeenCalled();
  });

  it('should manage state correctly', () => {
    element.updateData({ test: 'value' });
    
    expect(element.getData()).toEqual({ test: 'value' });
  });
});
```

### Integration Testing

```typescript
// integration.test.ts
describe('Extension Integration', () => {
  it('should communicate with other extensions', async () => {
    const extension1 = new Extension1();
    const extension2 = new Extension2();
    
    document.body.append(extension1, extension2);
    
    // Test communication
    extension1.sendMessage('test-data');
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    expect(extension2.receivedMessage).toBe('test-data');
  });

  it('should integrate with KimuStore', () => {
    const store = KimuStore.getInstance();
    const extension = new MyExtension();
    
    store.setState('test', { value: 'initial' });
    document.body.appendChild(extension);
    
    expect(extension.getData()).toEqual({ value: 'initial' });
  });
});
```

## Documentation

### Code Documentation

```typescript
/**
 * Component for displaying notifications
 * 
 * @example
 * ```html
 * <notification-display
 *   type="success"
 *   message="Operation completed"
 *   auto-close="true">
 * </notification-display>
 * ```
 */
@KimuComponent({
  tag: 'notification-display',
  name: 'Notification Display'
})
export class NotificationDisplay extends HTMLElement {
  /**
   * Notification type
   * @default 'info'
   */
  @property({ type: String })
  type: 'info' | 'success' | 'warning' | 'error' = 'info';

  /**
   * Message to display
   */
  @property({ type: String })
  message = '';

  /**
   * If true, notification closes automatically
   * @default false
   */
  @property({ type: Boolean, attribute: 'auto-close' })
  autoClose = false;

  /**
   * Show the notification
   * 
   * @param message - Message to display
   * @param type - Notification type
   * @returns Promise that resolves when animation is complete
   */
  public async show(message: string, type?: string): Promise<void> {
    // Implementation
  }
}
```

### Extension README

```markdown
# My Extension

Brief description of the extension.

## Installation

```bash
npm install my-extension
```

## Basic Usage

```html
<my-extension
  config="value"
  theme="dark">
</my-extension>
```

## API

### Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| config | string | '' | Configuration |
| theme | string | 'light' | UI theme |

### Methods

- `initialize()` - Initialize the extension
- `destroy()` - Clean up resources

### Events

- `my-extension:ready` - Emitted when ready
- `my-extension:error` - Emitted on error

## Examples

### Advanced Usage

```typescript
const extension = document.querySelector('my-extension');
extension.addEventListener('my-extension:ready', () => {
  console.log('Extension ready!');
});
```
```

## Deployment and Versioning

### Semantic Versioning

```json
{
  "version": "1.2.3",
  "changelog": {
    "1.2.3": {
      "date": "2024-01-15",
      "changes": [
        "Fixed: Bug in error handling",
        "Added: New dark theme",
        "Changed: Improved performance"
      ]
    }
  }
}
```

### Migration Guide

```typescript
// migrations/v2.0.0.ts
export class MigrationV2 {
  static migrate(oldConfig: any): any {
    return {
      ...oldConfig,
      newProperty: 'default-value',
      // Transform renamed properties
      theme: oldConfig.style || 'light'
    };
  }
}
```

These best practices will help you create high-quality, maintainable, and robust KIMU extensions. Follow them as guidelines for professional and reliable code.

## References

- [Creating an Extension](./creating-extensions.md)
- [Extension Lifecycle](./extension-lifecycle.md)
- [Build and Deployment](./build-deployment.md)
- [Framework Core](../core/index.md)
