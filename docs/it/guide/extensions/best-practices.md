# Best Practices

Segui queste best practices per creare estensioni KIMU robuste, performanti e manutenibili.

## 🏗️ Architettura e Organizzazione

### 1. **Struttura dei File Consistente**

```
extensions/
  my-extension/
    component.ts          # Logica principale
    view.html            # Template UI  
    style.css            # Stili
    types.ts             # Tipi TypeScript (opzionale)
    utils.ts             # Utility functions (opzionale)
    README.md            # Documentazione (opzionale)
```

### 2. **Naming Convention**

```typescript
// ✅ BUONO: Nomi descrittivi e consistenti
@KimuComponent({
  tag: 'user-profile-card',        // kebab-case, descrittivo
  name: 'User Profile Card',       // Spazi, Title Case
  path: 'user-profile-card'        // Stesso del tag
})
export class UserProfileCard extends KimuComponentElement {
  // Proprietà private con underscore o private keyword
  private _userData: UserData | null = null;
  private isLoading = false;
  
  // Metodi pubblici camelCase
  public getUserData(): UserData | null {
    return this._userData;
  }
  
  // Metodi privati con prefisso
  private handleUserUpdate(): void {
    // ...
  }
}
```

### 3. **Separazione delle Responsabilità**

```typescript
// ✅ BUONO: Logica separata in moduli
// types.ts
export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

// utils.ts
export class TodoUtils {
  static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
  
  static sortByCreationDate(todos: TodoItem[]): TodoItem[] {
    return [...todos].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
}

// component.ts
import { TodoItem, TodoUtils } from './types';

@KimuComponent({tag: 'todo-list', name: 'Todo List'})
export class TodoList extends KimuComponentElement {
  private todos: TodoItem[] = [];
  
  getData() {
    return {
      todos: TodoUtils.sortByCreationDate(this.todos),
      // ...
    };
  }
}
```

---

## 🎯 Gestione dello Stato

### 1. **Stato Immutabile**

```typescript
// ✅ BUONO: Stato immutabile con metodi helper
export class StateManagementExample extends KimuComponentElement {
  private state = {
    counter: 0,
    items: [] as Item[],
    loading: false,
    error: null as string | null
  };

  // Metodo centralizzato per aggiornamenti stato
  private updateState(updates: Partial<typeof this.state>) {
    this.state = { ...this.state, ...updates };
    this.refresh();
  }

  // Metodi specifici per azioni
  private incrementCounter() {
    this.updateState({ counter: this.state.counter + 1 });
  }

  private addItem(item: Item) {
    this.updateState({ 
      items: [...this.state.items, item] 
    });
  }

  private setLoading(loading: boolean) {
    this.updateState({ loading });
  }

  getData() {
    return {
      ...this.state,
      // Action handlers
      onIncrement: () => this.incrementCounter(),
      onAddItem: (item: Item) => this.addItem(item)
    };
  }
}
```

### 2. **Stato Tipizzato**

```typescript
// types.ts
interface AppState {
  user: UserInfo | null;
  notifications: Notification[];
  settings: AppSettings;
  ui: {
    loading: boolean;
    error: string | null;
    theme: 'light' | 'dark';
  };
}

// ✅ BUONO: Stato fortemente tipizzato
export class TypedStateExample extends KimuComponentElement {
  private state: AppState = {
    user: null,
    notifications: [],
    settings: DEFAULT_SETTINGS,
    ui: {
      loading: false,
      error: null,
      theme: 'light'
    }
  };

  private updateState(updates: DeepPartial<AppState>) {
    this.state = deepMerge(this.state, updates);
    this.refresh();
  }
}
```

---

## ⚡ Performance e Ottimizzazione

### 1. **Evita Re-render Inutili**

```typescript
// ✅ BUONO: Controllo cambiamenti prima del refresh
export class OptimizedComponent extends KimuComponentElement {
  private lastRenderedData: any = null;

  getData() {
    const currentData = {
      items: this.items,
      counter: this.counter,
      // ...
    };

    // Solo refresh se i dati sono effettivamente cambiati
    if (!this.dataEquals(currentData, this.lastRenderedData)) {
      this.lastRenderedData = { ...currentData };
    }

    return currentData;
  }

  private dataEquals(a: any, b: any): boolean {
    return JSON.stringify(a) === JSON.stringify(b);
  }

  // Metodo più sofisticato per confronti deep
  private deepEquals(a: any, b: any): boolean {
    // Implementazione deep comparison
  }
}
```

### 2. **Lazy Loading e Code Splitting**

```typescript
// ✅ BUONO: Caricamento lazy di dipendenze pesanti
export class LazyLoadedComponent extends KimuComponentElement {
  private chartLib: any = null;
  private mapLib: any = null;

  async onInit() {
    // Carica solo le librerie necessarie
    if (this.needsChart()) {
      this.chartLib = await import('./chart-library');
    }
    
    if (this.needsMap()) {
      this.mapLib = await import('./map-library');
    }
  }

  private needsChart(): boolean {
    return this.config.showChart;
  }

  private needsMap(): boolean {
    return this.config.showMap;
  }
}
```

### 3. **Debouncing e Throttling**

```typescript
// ✅ BUONO: Debouncing per input pesanti
export class DebouncedSearchComponent extends KimuComponentElement {
  private searchQuery = '';
  private searchResults: any[] = [];
  private searchTimeout?: number;

  getData() {
    return {
      searchQuery: this.searchQuery,
      searchResults: this.searchResults,
      
      onSearchInput: (event: Event) => {
        const input = event.target as HTMLInputElement;
        this.searchQuery = input.value;
        
        // Debounce search API calls
        if (this.searchTimeout) {
          clearTimeout(this.searchTimeout);
        }
        
        this.searchTimeout = window.setTimeout(() => {
          this.performSearch();
        }, 300);
        
        this.refresh(); // Aggiorna UI immediatamente per input
      }
    };
  }

  private async performSearch() {
    if (this.searchQuery.length < 2) {
      this.searchResults = [];
      this.refresh();
      return;
    }

    try {
      const results = await this.searchAPI(this.searchQuery);
      this.searchResults = results;
      this.refresh();
    } catch (error) {
      console.error('Search error:', error);
    }
  }

  onDestroy() {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
  }
}
```

---

## 🛡️ Error Handling e Resilienza

### 1. **Error Boundaries per Componenti**

```typescript
// ✅ BUONO: Gestione errori robusta
export class ResilientComponent extends KimuComponentElement {
  private error: Error | null = null;
  private retryCount = 0;
  private maxRetries = 3;

  getData() {
    // Se c'è un errore, mostra UI di fallback
    if (this.error) {
      return this.getErrorState();
    }

    try {
      return this.getNormalState();
    } catch (error) {
      this.handleError(error);
      return this.getErrorState();
    }
  }

  private getNormalState() {
    return {
      data: this.processData(),
      loading: this.isLoading,
      onAction: () => this.safePerformAction()
    };
  }

  private getErrorState() {
    return {
      error: this.error?.message || 'Errore sconosciuto',
      canRetry: this.retryCount < this.maxRetries,
      onRetry: () => this.retry(),
      onReset: () => this.reset()
    };
  }

  private handleError(error: any) {
    console.error('Component error:', error);
    this.error = error instanceof Error ? error : new Error(String(error));
    
    // Report error to monitoring service
    this.reportError(this.error);
  }

  private async safePerformAction() {
    try {
      await this.performAction();
    } catch (error) {
      this.handleError(error);
      this.refresh();
    }
  }

  private retry() {
    if (this.retryCount < this.maxRetries) {
      this.retryCount++;
      this.error = null;
      this.refresh();
    }
  }

  private reset() {
    this.error = null;
    this.retryCount = 0;
    this.refresh();
  }

  private reportError(error: Error) {
    // Integrazione con servizio di monitoring
    (window as any).errorReporter?.report(error, {
      component: 'ResilientComponent',
      context: this.getContextInfo()
    });
  }
}
```

### 2. **Validation e Type Guards**

```typescript
// ✅ BUONO: Validazione robusta dei dati
export class ValidatedComponent extends KimuComponentElement {
  private data: UserData[] = [];

  async loadData() {
    try {
      const response = await fetch('/api/users');
      const rawData = await response.json();
      
      // Valida i dati prima dell'uso
      const validatedData = this.validateUserData(rawData);
      this.data = validatedData;
      this.refresh();
    } catch (error) {
      this.handleError(error);
    }
  }

  private validateUserData(data: any): UserData[] {
    if (!Array.isArray(data)) {
      throw new Error('Expected array of users');
    }

    return data.map((item, index) => {
      if (!this.isValidUser(item)) {
        console.warn(`Invalid user data at index ${index}:`, item);
        return this.createFallbackUser(item);
      }
      return item as UserData;
    });
  }

  private isValidUser(item: any): item is UserData {
    return (
      typeof item === 'object' &&
      typeof item.id === 'string' &&
      typeof item.name === 'string' &&
      typeof item.email === 'string' &&
      item.email.includes('@')
    );
  }

  private createFallbackUser(item: any): UserData {
    return {
      id: item.id || 'unknown',
      name: item.name || 'Nome non disponibile',
      email: item.email || 'email@non-disponibile.com',
      avatar: item.avatar || '/default-avatar.png'
    };
  }
}
```

---

## 🧪 Testing e Debugging

### 1. **Component Testing**

```typescript
// ✅ BUONO: Metodi per testing
export class TestableComponent extends KimuComponentElement {
  private data: any[] = [];

  // Metodi pubblici per testing
  public getDataForTesting() {
    return { ...this.state };
  }

  public setDataForTesting(data: any[]) {
    this.data = data;
    this.refresh();
  }

  public simulateUserAction(action: string, payload?: any) {
    switch (action) {
      case 'add':
        this.addItem(payload);
        break;
      case 'remove':
        this.removeItem(payload);
        break;
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  }

  // Debug helpers
  public getDebugInfo() {
    return {
      componentName: 'TestableComponent',
      dataLength: this.data.length,
      lastUpdate: this.lastUpdateTime,
      renderCount: this.renderCount
    };
  }
}
```

### 2. **Logging e Monitoring**

```typescript
// ✅ BUONO: Logging strutturato
export class MonitoredComponent extends KimuComponentElement {
  private logger = new ComponentLogger('MonitoredComponent');

  async performCriticalAction() {
    const actionId = this.generateActionId();
    
    this.logger.info('Starting critical action', { actionId });
    
    try {
      const result = await this.executeAction();
      
      this.logger.info('Critical action completed', {
        actionId,
        result: result.summary
      });
      
      return result;
    } catch (error) {
      this.logger.error('Critical action failed', {
        actionId,
        error: error.message,
        stack: error.stack
      });
      
      throw error;
    }
  }

  private generateActionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

class ComponentLogger {
  constructor(private componentName: string) {}

  info(message: string, data?: any) {
    console.log(`[${this.componentName}] ${message}`, data);
  }

  error(message: string, data?: any) {
    console.error(`[${this.componentName}] ${message}`, data);
  }
}
```

---

## 🔧 Configurazione e Personalizzazione

### 1. **Configuration Pattern**

```typescript
// ✅ BUONO: Configurazione tipizzata e flessibile
interface ComponentConfig {
  theme: 'light' | 'dark';
  autoRefresh: boolean;
  refreshInterval: number;
  maxItems: number;
  features: {
    search: boolean;
    export: boolean;
    notifications: boolean;
  };
}

const DEFAULT_CONFIG: ComponentConfig = {
  theme: 'light',
  autoRefresh: true,
  refreshInterval: 30000,
  maxItems: 100,
  features: {
    search: true,
    export: false,
    notifications: true
  }
};

export class ConfigurableComponent extends KimuComponentElement {
  private config: ComponentConfig;

  constructor() {
    super();
    this.config = this.loadConfig();
  }

  private loadConfig(): ComponentConfig {
    // Carica configurazione da store o usa default
    const stored = (window as any).kimuStore?.get('component-config');
    return { ...DEFAULT_CONFIG, ...stored };
  }

  private updateConfig(updates: Partial<ComponentConfig>) {
    this.config = { ...this.config, ...updates };
    (window as any).kimuStore?.set('component-config', this.config);
    this.refresh();
  }

  getData() {
    return {
      config: this.config,
      onConfigUpdate: (field: keyof ComponentConfig, value: any) => {
        this.updateConfig({ [field]: value });
      }
    };
  }
}
```

---

## 📦 Memory Management

### 1. **Resource Cleanup Pattern**

```typescript
// ✅ BUONO: Gestione memoria sistematica
export class MemoryEfficientComponent extends KimuComponentElement {
  private resources = new ComponentResourceManager();
  private cache = new Map<string, any>();
  private maxCacheSize = 100;

  onInit() {
    // Registra tutte le risorse per cleanup automatico
    const interval = window.setInterval(() => this.updateData(), 1000);
    this.resources.addTimer(interval);

    const observer = new IntersectionObserver(this.handleIntersection);
    this.resources.addObserver(observer);

    this.resources.addEventListener(document, 'visibilitychange', this.handleVisibilityChange);
  }

  onDestroy() {
    // Cleanup automatico di tutte le risorse
    this.resources.cleanup();
    this.clearCache();
  }

  private addToCache(key: string, value: any) {
    // Gestione cache con limite di memoria
    if (this.cache.size >= this.maxCacheSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }

  private clearCache() {
    this.cache.clear();
  }

  private handleIntersection = (entries: IntersectionObserverEntry[]) => {
    // Handler con weak reference per evitare memory leaks
  }

  private handleVisibilityChange = (e: Event) => {
    // Handler con cleanup automatico
  }
}

class ComponentResourceManager {
  private timers: number[] = [];
  private listeners: Array<{target: EventTarget, event: string, handler: EventListener}> = [];
  private observers: (IntersectionObserver | MutationObserver)[] = [];

  addTimer(id: number) {
    this.timers.push(id);
  }

  addEventListener(target: EventTarget, event: string, handler: EventListener) {
    this.listeners.push({ target, event, handler });
    target.addEventListener(event, handler);
  }

  addObserver(observer: IntersectionObserver | MutationObserver) {
    this.observers.push(observer);
  }

  cleanup() {
    // Cleanup sistematico di tutte le risorse
    this.timers.forEach(id => {
      clearInterval(id);
      clearTimeout(id);
    });

    this.listeners.forEach(({ target, event, handler }) => {
      target.removeEventListener(event, handler);
    });

    this.observers.forEach(observer => observer.disconnect());

    // Reset
    this.timers = [];
    this.listeners = [];
    this.observers = [];
  }
}
```

## 🎯 Riassunto Best Practices

### ✅ **Da Fare Sempre**
- Usa TypeScript per type safety
- Implementa cleanup in `onDestroy()`
- Gestisci errori gracefully
- Usa stato immutabile
- Implementa logging per debug
- Valida dati esterni
- Usa naming conventions consistenti

### ❌ **Da Evitare**
- Memory leaks (timer, listeners)
- Mutazioni dirette dello stato
- Operazioni sincrone pesanti in `onInit()`
- Accesso DOM in `onInit()`
- Chiamate `refresh()` in loop infiniti
- Errori non gestiti
- Codice non tipizzato

### 🚀 **Per Performance**
- Debounce operazioni costose
- Cache risultati computazionali
- Lazy load dipendenze pesanti
- Controlla cambiamenti prima del re-render
- Usa weak references dove appropriato

Le estensioni KIMU seguendo queste best practices saranno **robuste, performanti e manutenibili**, garantendo un'esperienza utente eccellente e facilità di sviluppo a lungo termine.
