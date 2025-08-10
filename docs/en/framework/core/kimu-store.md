# KimuStore

A centralized state management system for the KIMU framework that provides reactive data storage with persistence capabilities using IndexedDB. It implements the Singleton pattern and Observer pattern for efficient state management.

## Overview

KimuStore provides:
- **Centralized state management** for the entire application
- **Reactive updates** through the Observer pattern
- **Persistent storage** with IndexedDB
- **Type-safe** state access and manipulation
- **Subscription system** for component reactivity
- **Batch updates** for performance optimization

## Class Definition

```typescript
interface StoreSubscription {
  unsubscribe(): void;
}

export class KimuStore {
  private static instance: KimuStore;
  private state: Map<string, any> = new Map();
  private subscribers: Map<string, Set<Function>> = new Map();
  private db: IDBDatabase | null = null;

  private constructor() {
    this.initializeDB();
  }

  public static getInstance(): KimuStore {
    if (!KimuStore.instance) {
      KimuStore.instance = new KimuStore();
    }
    return KimuStore.instance;
  }
}
```

## Main Methods

### `setState(key: string, value: any)`

Sets a value in the store and notifies subscribers.

```typescript
const store = KimuStore.getInstance();

// Set simple values
store.setState('theme', 'dark');
store.setState('user', { name: 'John', role: 'admin' });

// Set complex objects
store.setState('appConfig', {
  language: 'en',
  notifications: true,
  autoSave: true
});
```

### `getState(key: string)`

Gets a value from the store.

```typescript
const theme = store.getState('theme'); // 'dark'
const user = store.getState('user'); // { name: 'John', role: 'admin' }
```

### `subscribe(key: string, callback: Function)`

Subscribes to changes in a specific state key.

```typescript
const store = KimuStore.getInstance();

// Subscribe to theme changes
const unsubscribe = store.subscribe('theme', (newTheme, oldTheme) => {
  console.log(`Theme changed from ${oldTheme} to ${newTheme}`);
  document.body.className = `theme-${newTheme}`;
});

// Unsubscribe when no longer needed
unsubscribe();
```

### `updateState(key: string, updates: object)`

Partially updates an object in the store.

```typescript
// Original state
store.setState('user', { name: 'John', role: 'user', email: 'john@example.com' });

// Partial update
store.updateState('user', { role: 'admin' });

// Result: { name: 'John', role: 'admin', email: 'john@example.com' }
```

### `removeState(key: string)`

Removes a key from the store.

```typescript
store.removeState('temporaryData');
```

### `clearState()`

Clears all state data.

```typescript
store.clearState();
```

## Practical Usage

### Component State Management

```typescript
import { KimuComponent } from '../decorators/kimu-component';
import { KimuStore } from '../core/kimu-store';

@KimuComponent({
  tag: 'user-profile',
  name: 'User Profile'
})
export class UserProfile extends HTMLElement {
  private store = KimuStore.getInstance();
  private subscriptions: StoreSubscription[] = [];

  connectedCallback() {
    this.render();
    this.setupSubscriptions();
  }

  disconnectedCallback() {
    // Clean up subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private setupSubscriptions() {
    // Subscribe to user data changes
    const userSub = this.store.subscribe('user', (newUser, oldUser) => {
      this.updateUserDisplay(newUser);
    });

    // Subscribe to theme changes
    const themeSub = this.store.subscribe('theme', (newTheme) => {
      this.updateTheme(newTheme);
    });

    this.subscriptions.push(userSub, themeSub);
  }

  private updateUserDisplay(user: any) {
    const nameElement = this.querySelector('.user-name') as HTMLElement;
    const roleElement = this.querySelector('.user-role') as HTMLElement;
    
    if (nameElement) nameElement.textContent = user.name;
    if (roleElement) roleElement.textContent = user.role;
  }

  private updateTheme(theme: string) {
    this.className = `user-profile theme-${theme}`;
  }

  private render() {
    const user = this.store.getState('user') || {};
    const theme = this.store.getState('theme') || 'light';
    
    this.innerHTML = `
      <div class="user-profile theme-${theme}">
        <h3 class="user-name">${user.name || 'Guest'}</h3>
        <p class="user-role">${user.role || 'User'}</p>
        <button id="editBtn">Edit Profile</button>
      </div>
    `;

    // Event listeners
    this.querySelector('#editBtn')?.addEventListener('click', () => {
      this.openEditDialog();
    });
  }

  private openEditDialog() {
    // Update store when user edits profile
    this.store.setState('ui.activeDialog', 'editProfile');
  }
}
```

### Application Configuration

```typescript
class AppConfiguration {
  private store = KimuStore.getInstance();

  async loadConfiguration() {
    // Load from server
    const config = await fetch('/api/config').then(r => r.json());
    
    // Store in state
    this.store.setState('appConfig', config);
    this.store.setState('apiUrl', config.apiUrl);
    this.store.setState('features', config.features);
  }

  updateConfiguration(updates: any) {
    this.store.updateState('appConfig', updates);
    
    // Persist changes
    this.saveConfiguration();
  }

  private async saveConfiguration() {
    const config = this.store.getState('appConfig');
    
    try {
      await fetch('/api/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
    } catch (error) {
      console.error('Failed to save configuration:', error);
    }
  }
}
```

### Inter-Component Communication

```typescript
// Component A - Data Provider
@KimuComponent({ tag: 'data-provider' })
export class DataProvider extends HTMLElement {
  private store = KimuStore.getInstance();

  async loadData() {
    this.store.setState('loading', true);
    
    try {
      const data = await fetch('/api/data').then(r => r.json());
      this.store.setState('data', data);
      this.store.setState('lastUpdated', new Date().toISOString());
    } catch (error) {
      this.store.setState('error', error.message);
    } finally {
      this.store.setState('loading', false);
    }
  }
}

// Component B - Data Consumer
@KimuComponent({ tag: 'data-list' })
export class DataList extends HTMLElement {
  private store = KimuStore.getInstance();
  private subscription: StoreSubscription;

  connectedCallback() {
    this.subscription = this.store.subscribe('data', (newData) => {
      this.renderData(newData);
    });

    // Initial render
    const existingData = this.store.getState('data');
    if (existingData) {
      this.renderData(existingData);
    }
  }

  disconnectedCallback() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private renderData(data: any[]) {
    this.innerHTML = `
      <ul class="data-list">
        ${data.map(item => `<li>${item.name}</li>`).join('')}
      </ul>
    `;
  }
}
```

## Persistence with IndexedDB

### Automatic Persistence

```typescript
class KimuStore {
  private async initializeDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('KimuStore', 1);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        this.loadPersistedState();
        resolve();
      };
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('state')) {
          db.createObjectStore('state', { keyPath: 'key' });
        }
      };
    });
  }

  private async persistState(key: string, value: any): Promise<void> {
    if (!this.db) return;

    const transaction = this.db.transaction(['state'], 'readwrite');
    const store = transaction.objectStore('state');
    
    await store.put({ key, value, timestamp: Date.now() });
  }

  private async loadPersistedState(): Promise<void> {
    if (!this.db) return;

    const transaction = this.db.transaction(['state'], 'readonly');
    const store = transaction.objectStore('state');
    const request = store.getAll();

    request.onsuccess = () => {
      const items = request.result;
      items.forEach(item => {
        this.state.set(item.key, item.value);
      });
    };
  }
}
```

### Selective Persistence

```typescript
class KimuStore {
  private persistentKeys = new Set(['user', 'theme', 'language', 'appConfig']);

  setState(key: string, value: any, persist: boolean = true): void {
    const oldValue = this.state.get(key);
    this.state.set(key, value);

    // Notify subscribers
    this.notifySubscribers(key, value, oldValue);

    // Persist if needed
    if (persist && this.persistentKeys.has(key)) {
      this.persistState(key, value);
    }
  }
}
```

## Advanced Features

### Computed Values

```typescript
class KimuStore {
  private computedCache = new Map<string, any>();
  
  setComputed(key: string, computeFn: (store: KimuStore) => any): void {
    // Cache computed value
    const value = computeFn(this);
    this.computedCache.set(key, value);
    
    // Re-compute when dependencies change
    // This is a simplified implementation
    this.subscribe('*', () => {
      const newValue = computeFn(this);
      if (newValue !== this.computedCache.get(key)) {
        this.computedCache.set(key, newValue);
        this.notifySubscribers(key, newValue, value);
      }
    });
  }
  
  getComputed(key: string): any {
    return this.computedCache.get(key);
  }
}

// Usage
const store = KimuStore.getInstance();

store.setComputed('userDisplayName', (store) => {
  const user = store.getState('user');
  return user ? `${user.name} (${user.role})` : 'Guest';
});

const displayName = store.getComputed('userDisplayName');
```

### Batch Updates

```typescript
class KimuStore {
  private batchMode = false;
  private batchedUpdates = new Map<string, any>();

  startBatch(): void {
    this.batchMode = true;
    this.batchedUpdates.clear();
  }

  commitBatch(): void {
    if (!this.batchMode) return;

    // Apply all batched updates
    this.batchedUpdates.forEach((value, key) => {
      const oldValue = this.state.get(key);
      this.state.set(key, value);
      this.notifySubscribers(key, value, oldValue);
    });

    this.batchMode = false;
    this.batchedUpdates.clear();
  }

  setState(key: string, value: any): void {
    if (this.batchMode) {
      this.batchedUpdates.set(key, value);
    } else {
      // Normal update
      const oldValue = this.state.get(key);
      this.state.set(key, value);
      this.notifySubscribers(key, value, oldValue);
    }
  }
}

// Usage
const store = KimuStore.getInstance();

store.startBatch();
store.setState('user.name', 'John');
store.setState('user.email', 'john@example.com');
store.setState('user.role', 'admin');
store.commitBatch(); // All updates applied at once
```

## Best Practices

### 1. State Structure

```typescript
// ✅ Good - Flat, organized structure
const state = {
  'user.profile': { name: 'John', email: 'john@example.com' },
  'user.preferences': { theme: 'dark', language: 'en' },
  'app.config': { version: '1.0.0', debug: false },
  'ui.modals': { activeModal: null, history: [] }
};

// ❌ Bad - Deeply nested structure
const state = {
  'app': {
    user: {
      profile: {
        personal: {
          name: 'John' // Too deep
        }
      }
    }
  }
};
```

### 2. Subscription Management

```typescript
// ✅ Good - Proper cleanup
class MyComponent extends HTMLElement {
  private subscriptions: StoreSubscription[] = [];

  connectedCallback() {
    const sub1 = store.subscribe('data', this.handleDataChange.bind(this));
    const sub2 = store.subscribe('theme', this.handleThemeChange.bind(this));
    
    this.subscriptions.push(sub1, sub2);
  }

  disconnectedCallback() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.subscriptions = [];
  }
}
```

### 3. Performance Optimization

```typescript
// ✅ Good - Throttled updates
class OptimizedComponent extends HTMLElement {
  private updateTimeout?: number;

  private setupSubscription() {
    store.subscribe('highFrequencyData', (newData) => {
      // Throttle rapid updates
      clearTimeout(this.updateTimeout);
      this.updateTimeout = setTimeout(() => {
        this.updateUI(newData);
      }, 100);
    });
  }
}
```

## References

- [KimuApp](./kimu-app.md) - Main application integration
- [Observer Pattern](../patterns/observer-pattern.md) - Design pattern used
- [State Management Pattern](../patterns/state-management.md) - Architectural pattern
- [Component Reactivity](../extensions/best-practices.md) - Component integration
