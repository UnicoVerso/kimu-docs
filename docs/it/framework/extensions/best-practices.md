# Best Practices per Estensioni

Questa guida raccoglie le migliori pratiche per sviluppare estensioni KIMU robuste, performanti e mantenibili.

## Architettura

### Principi di Design

#### Single Responsibility
Ogni estensione dovrebbe avere una singola responsabilità ben definita:

```typescript
// ✅ Buono - responsabilità specifica
@KimuComponent({
  tag: 'notification-display',
  name: 'Notification Display'
})
export class NotificationDisplay extends HTMLElement {
  // Solo visualizzazione notifiche
}

// ❌ Cattivo - troppe responsabilità
@KimuComponent({
  tag: 'mega-component',
  name: 'Mega Component'
})
export class MegaComponent extends HTMLElement {
  // Gestisce notifiche, user management, api calls, UI...
}
```

#### Composition over Inheritance
Preferisci la composizione all'ereditarietà:

```typescript
// ✅ Buono - composizione
export class DataTable extends HTMLElement {
  private dataService = new DataService();
  private renderer = new TableRenderer();
  private validator = new DataValidator();
}

// ❌ Cattivo - ereditarietà profonda
export class DataTable extends BaseTable extends BaseComponent extends HTMLElement {
  // Gerarchia complessa
}
```

### Modularità

#### Separazione delle Concerns

```typescript
// services/api-service.ts
export class ApiService {
  async fetchData(endpoint: string) {
    // Logica API
  }
}

// renderers/table-renderer.ts
export class TableRenderer {
  render(data: any[], container: HTMLElement) {
    // Logica rendering
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
  
  // Componente che coordina
}
```

## Performance

### Lazy Loading

#### Caricamento Differito di Componenti

```typescript
export class MyExtension extends HTMLElement {
  private heavyComponentLoaded = false;

  private async loadHeavyComponent() {
    if (this.heavyComponentLoaded) return;

    // Carica solo quando necessario
    const { HeavyComponent } = await import('./heavy-component');
    const component = new HeavyComponent();
    
    this.shadowRoot.appendChild(component);
    this.heavyComponentLoaded = true;
  }

  private handleUserAction() {
    // Carica componente pesante solo su azione utente
    this.loadHeavyComponent();
  }
}
```

#### Asset Loading Efficiente

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
    // Carica asset con caching
    const cached = this.preloadedAssets.get(name);
    if (cached) return cached;

    const assetManager = KimuAssetManager.getInstance();
    return await assetManager.getAsset(`my-extension/${name}`);
  }
}
```

### Ottimizzazione Rendering

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
    // Renderizza solo elementi cambiati
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
      // Aggiorna singola cella
      const cell = this.getCell(row, col);
      if (cell) {
        cell.textContent = value;
      }
    });
  }
}
```

## State Management

### Stato Locale vs Globale

#### Stato Locale per UI

```typescript
export class ToggleButton extends HTMLElement {
  // Stato locale per UI semplice
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

#### Stato Globale per Dati Condivisi

```typescript
export class UserProfile extends HTMLElement {
  private store = KimuStore.getInstance();
  private unsubscribe?: () => void;

  connectedCallback() {
    this.render();
    
    // Sottoscrivi a stato globale
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
    // Aggiorna UI basandoti su stato globale
  }
}
```

### Immutability

```typescript
// ✅ Buono - stato immutabile
private updateUserData(updates: Partial<UserData>) {
  const currentUser = this.store.getState('user');
  const updatedUser = {
    ...currentUser,
    ...updates,
    lastModified: new Date().toISOString()
  };
  
  this.store.setState('user', updatedUser);
}

// ❌ Cattivo - mutazione diretta
private updateUserData(updates: Partial<UserData>) {
  const user = this.store.getState('user');
  Object.assign(user, updates); // Mutazione diretta!
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
    indicator.textContent = 'Dati non aggiornati - modalità offline';
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
    
    // Log error al sistema di monitoring
    this.reportError(error, errorInfo);
    
    // Mostra UI di errore
    this.renderErrorUI(error);
  }

  private renderErrorUI(error: Error) {
    this.innerHTML = `
      <div class="error-boundary">
        <h3>⚠️ Qualcosa è andato storto</h3>
        <p>Si è verificato un errore nell'estensione.</p>
        <details>
          <summary>Dettagli tecnici</summary>
          <pre>${error.message}\n${error.stack}</pre>
        </details>
        <button onclick="location.reload()">Ricarica Pagina</button>
      </div>
    `;
  }

  private reportError(error: Error, context?: any) {
    // Invia errore al sistema di monitoring
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
    // Rimuovi script e HTML pericolosi
    const temp = document.createElement('div');
    temp.textContent = input;
    return temp.innerHTML;
  }

  private validateInput(input: string): boolean {
    // Validazione input
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
      this.showValidationError('Input non valido');
      return;
    }

    const sanitized = this.sanitizeInput(input);
    this.processInput(sanitized);
  }
}
```

### Content Security Policy

```typescript
// Evita eval() e innerHTML con contenuto non trusted
export class SecureRenderer extends HTMLElement {
  // ✅ Buono - usa textContent
  private renderSafeText(text: string) {
    const element = document.createElement('p');
    element.textContent = text; // Safe
    this.shadowRoot.appendChild(element);
  }

  // ✅ Buono - usa createElement per HTML strutturato
  private renderStructuredContent(data: any) {
    const container = document.createElement('div');
    
    const title = document.createElement('h3');
    title.textContent = data.title;
    
    const content = document.createElement('p');
    content.textContent = data.content;
    
    container.append(title, content);
    this.shadowRoot.appendChild(container);
  }

  // ❌ Cattivo - innerHTML con dati esterni
  private renderUnsafe(html: string) {
    this.innerHTML = html; // Potenziale XSS!
  }
}
```

## Accessibility

### ARIA e Semantic HTML

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
    
    // Test comunicazione
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
 * Componente per la visualizzazione di notifiche
 * 
 * @example
 * ```html
 * <notification-display
 *   type="success"
 *   message="Operazione completata"
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
   * Tipo di notifica
   * @default 'info'
   */
  @property({ type: String })
  type: 'info' | 'success' | 'warning' | 'error' = 'info';

  /**
   * Messaggio da visualizzare
   */
  @property({ type: String })
  message = '';

  /**
   * Se true, la notifica si chiude automaticamente
   * @default false
   */
  @property({ type: Boolean, attribute: 'auto-close' })
  autoClose = false;

  /**
   * Mostra la notifica
   * 
   * @param message - Messaggio da visualizzare
   * @param type - Tipo di notifica
   * @returns Promise che si risolve quando l'animazione è completata
   */
  public async show(message: string, type?: string): Promise<void> {
    // Implementation
  }
}
```

### README dell'Estensione

```markdown
# My Extension

Breve descrizione dell'estensione.

## Installazione

```bash
npm install my-extension
```

## Uso Base

```html
<my-extension
  config="value"
  theme="dark">
</my-extension>
```

## API

### Proprietà

| Proprietà | Tipo | Default | Descrizione |
|-----------|------|---------|-------------|
| config | string | '' | Configurazione |
| theme | string | 'light' | Tema UI |

### Metodi

- `initialize()` - Inizializza l'estensione
- `destroy()` - Pulisce le risorse

### Eventi

- `my-extension:ready` - Emesso quando pronta
- `my-extension:error` - Emesso in caso di errore

## Esempi

### Uso Avanzato

```typescript
const extension = document.querySelector('my-extension');
extension.addEventListener('my-extension:ready', () => {
  console.log('Extension ready!');
});
```
```

## Deployment e Versioning

### Semantic Versioning

```json
{
  "version": "1.2.3",
  "changelog": {
    "1.2.3": {
      "date": "2024-01-15",
      "changes": [
        "Fixed: Bug nella gestione errori",
        "Added: Nuovo tema dark",
        "Changed: Migliorata performance"
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
      // Trasforma proprietà rinominate
      theme: oldConfig.style || 'light'
    };
  }
}
```

Queste best practices ti aiuteranno a creare estensioni KIMU di alta qualità, mantenibili e robuste. Seguile come linee guida per un codice professionale e affidabile.

## Riferimenti

- [Creare un'Estensione](./creating-extensions.md)
- [Extension Lifecycle](./extension-lifecycle.md)
- [Build e Deployment](./build-deployment.md)
- [Framework Core](../core/index.md)
