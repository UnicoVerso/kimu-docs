# Observer Pattern

The Observer pattern implements a notification mechanism where an object (subject) maintains a list of observers and automatically notifies them of any state changes.

## Problem

In modular applications like KIMU, we often need:

- **Communication between components**: Extensions that need to react to changes in other extensions
- **State changes**: UI components that need to update when state changes
- **Event handling**: Decentralized application event management
- **Loose coupling**: Maintain low coupling between components
- **Real-time updates**: Real-time interface updates

## Solution

The Observer pattern provides:

1. **Subject/Observable**: The object that generates notifications
2. **Observer**: Objects that receive notifications
3. **Subscribe/Unsubscribe**: Mechanism to register/remove observers
4. **Notification**: System to send updates to observers

## Implementation in KIMU

### Observable Base Class

```typescript
interface Observer<T = any> {
  update(data: T): void;
}

interface Subscription {
  unsubscribe(): void;
}

export class Observable<T = any> {
  private observers: Set<Observer<T>> = new Set();
  private eventObservers: Map<string, Set<Observer<T>>> = new Map();

  /**
   * Adds a general observer
   */
  public subscribe(observer: Observer<T>): Subscription {
    this.observers.add(observer);
    
    return {
      unsubscribe: () => {
        this.observers.delete(observer);
      }
    };
  }

  /**
   * Adds an observer for a specific event
   */
  public on(event: string, observer: Observer<T>): Subscription {
    if (!this.eventObservers.has(event)) {
      this.eventObservers.set(event, new Set());
    }
    
    this.eventObservers.get(event)!.add(observer);
    
    return {
      unsubscribe: () => {
        const eventSet = this.eventObservers.get(event);
        if (eventSet) {
          eventSet.delete(observer);
          if (eventSet.size === 0) {
            this.eventObservers.delete(event);
          }
        }
      }
    };
  }

  /**
   * Notifies all general observers
   */
  protected notify(data: T): void {
    this.observers.forEach(observer => {
      try {
        observer.update(data);
      } catch (error) {
        console.error('Error in observer:', error);
      }
    });
  }

  /**
   * Notifies observers of a specific event
   */
  protected emit(event: string, data: T): void {
    const eventObservers = this.eventObservers.get(event);
    if (eventObservers) {
      eventObservers.forEach(observer => {
        try {
          observer.update(data);
        } catch (error) {
          console.error(`Error in observer for event ${event}:`, error);
        }
      });
    }
  }

  /**
   * Removes all observers
   */
  public clear(): void {
    this.observers.clear();
    this.eventObservers.clear();
  }

  /**
   * Returns the number of observers
   */
  public get observerCount(): number {
    let total = this.observers.size;
    this.eventObservers.forEach(set => total += set.size);
    return total;
  }
}
```

### KimuStore with Observer Pattern

```typescript
interface StoreObserver<T = any> {
  update(key: string, newValue: T, oldValue: T): void;
}

interface StoreSubscription {
  unsubscribe(): void;
}

export class KimuStore extends Observable {
  private static instance: KimuStore;
  private state: Map<string, any> = new Map();
  private keyObservers: Map<string, Set<StoreObserver>> = new Map();

  private constructor() {
    super();
  }

  public static getInstance(): KimuStore {
    if (!KimuStore.instance) {
      KimuStore.instance = new KimuStore();
    }
    return KimuStore.instance;
  }

  /**
   * Subscribe to changes of a specific key
   */
  public subscribe(key: string, observer: StoreObserver): StoreSubscription {
    if (!this.keyObservers.has(key)) {
      this.keyObservers.set(key, new Set());
    }
    
    this.keyObservers.get(key)!.add(observer);
    
    return {
      unsubscribe: () => {
        const keySet = this.keyObservers.get(key);
        if (keySet) {
          keySet.delete(observer);
          if (keySet.size === 0) {
            this.keyObservers.delete(key);
          }
        }
      }
    };
  }

  /**
   * Subscription with callback function
   */
  public subscribe(key: string, callback: (newValue: any, oldValue: any) => void): StoreSubscription {
    const observer: StoreObserver = {
      update: (storeKey, newValue, oldValue) => {
        if (storeKey === key) {
          callback(newValue, oldValue);
        }
      }
    };

    return this.subscribe(key, observer);
  }

  /**
   * Sets a value and notifies observers
   */
  public setState(key: string, value: any): void {
    const oldValue = this.state.get(key);
    this.state.set(key, value);

    // Notify key-specific observers
    this.notifyKeyObservers(key, value, oldValue);
    
    // Notify general observers
    this.emit('state-changed', { key, value, oldValue });
  }

  /**
   * Gets a value
   */
  public getState(key: string): any {
    return this.state.get(key);
  }

  /**
   * Partially updates an object
   */
  public updateState(key: string, updates: any): void {
    const currentValue = this.getState(key);
    const newValue = { ...currentValue, ...updates };
    this.setState(key, newValue);
  }

  /**
   * Removes a key
   */
  public removeState(key: string): void {
    const oldValue = this.state.get(key);
    this.state.delete(key);
    this.notifyKeyObservers(key, undefined, oldValue);
  }

  private notifyKeyObservers(key: string, newValue: any, oldValue: any): void {
    const observers = this.keyObservers.get(key);
    if (observers) {
      observers.forEach(observer => {
        try {
          observer.update(key, newValue, oldValue);
        } catch (error) {
          console.error(`Error in store observer for key ${key}:`, error);
        }
      });
    }
  }
}
```

### Event Bus Implementation

```typescript
interface EventData {
  [key: string]: any;
}

interface EventListener<T = EventData> {
  (data: T): void;
}

export class KimuEventBus extends Observable {
  private static instance: KimuEventBus;
  private listeners: Map<string, Set<EventListener>> = new Map();

  private constructor() {
    super();
  }

  public static getInstance(): KimuEventBus {
    if (!KimuEventBus.instance) {
      KimuEventBus.instance = new KimuEventBus();
    }
    return KimuEventBus.instance;
  }

  /**
   * Registers a listener for an event
   */
  public on<T = EventData>(event: string, listener: EventListener<T>): Subscription {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    
    this.listeners.get(event)!.add(listener as EventListener);
    
    return {
      unsubscribe: () => {
        const eventListeners = this.listeners.get(event);
        if (eventListeners) {
          eventListeners.delete(listener as EventListener);
          if (eventListeners.size === 0) {
            this.listeners.delete(event);
          }
        }
      }
    };
  }

  /**
   * Registers a listener that executes only once
   */
  public once<T = EventData>(event: string, listener: EventListener<T>): Subscription {
    const onceListener = (data: T) => {
      listener(data);
      subscription.unsubscribe();
    };
    
    const subscription = this.on(event, onceListener);
    return subscription;
  }

  /**
   * Emits an event
   */
  public emit<T = EventData>(event: string, data?: T): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach(listener => {
        try {
          listener(data as any);
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error);
        }
      });
    }

    // Also notify general observers
    super.emit('event', { event, data });
  }

  /**
   * Removes all listeners of an event
   */
  public off(event: string): void {
    this.listeners.delete(event);
  }

  /**
   * List active events
   */
  public getActiveEvents(): string[] {
    return Array.from(this.listeners.keys());
  }

  /**
   * Number of listeners per event
   */
  public getListenerCount(event: string): number {
    return this.listeners.get(event)?.size || 0;
  }
}
```

## Usage in Extensions

### Reactive Component

```typescript
@KimuComponent({
  tag: 'reactive-counter',
  name: 'Reactive Counter'
})
export class ReactiveCounter extends HTMLElement {
  private store = KimuStore.getInstance();
  private eventBus = KimuEventBus.getInstance();
  private subscriptions: StoreSubscription[] = [];

  connectedCallback() {
    this.render();
    this.setupObservers();
  }

  disconnectedCallback() {
    // Clean up all subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.subscriptions = [];
  }

  private setupObservers() {
    // Observe counter changes
    const counterSub = this.store.subscribe('counter', (newValue, oldValue) => {
      this.updateCounterDisplay(newValue);
      
      // Emit change event
      this.eventBus.emit('counter-changed', {
        newValue,
        oldValue,
        component: this.tagName
      });
    });

    // Observe global events
    const resetSub = this.eventBus.on('reset-all-counters', () => {
      this.store.setState('counter', 0);
    });

    this.subscriptions.push(counterSub, resetSub);
  }

  private updateCounterDisplay(value: number) {
    const display = this.querySelector('.counter-value') as HTMLElement;
    if (display) {
      display.textContent = String(value);
      
      // Visual animation for change
      display.classList.add('updated');
      setTimeout(() => display.classList.remove('updated'), 300);
    }
  }

  private increment() {
    const current = this.store.getState('counter') || 0;
    this.store.setState('counter', current + 1);
  }

  private decrement() {
    const current = this.store.getState('counter') || 0;
    this.store.setState('counter', current - 1);
  }

  private render() {
    const currentValue = this.store.getState('counter') || 0;
    
    this.innerHTML = `
      <div class="counter-container">
        <button class="btn-decrement">-</button>
        <span class="counter-value">${currentValue}</span>
        <button class="btn-increment">+</button>
      </div>
    `;

    // Event listeners
    this.querySelector('.btn-increment')?.addEventListener('click', () => this.increment());
    this.querySelector('.btn-decrement')?.addEventListener('click', () => this.decrement());
  }
}
```

### Communication Between Extensions

```typescript
// Extension A - Data Provider
@KimuComponent({
  tag: 'data-provider',
  name: 'Data Provider'
})
export class DataProvider extends HTMLElement {
  private eventBus = KimuEventBus.getInstance();
  private store = KimuStore.getInstance();

  async connectedCallback() {
    this.loadData();
  }

  private async loadData() {
    try {
      // Simulate data loading
      this.eventBus.emit('data-loading', { provider: 'data-provider' });
      
      const data = await this.fetchDataFromAPI();
      
      // Save to store
      this.store.setState('applicationData', data);
      
      // Notify loading completed
      this.eventBus.emit('data-loaded', { 
        provider: 'data-provider',
        dataSize: data.length 
      });
      
    } catch (error) {
      this.eventBus.emit('data-error', { 
        provider: 'data-provider',
        error: error.message 
      });
    }
  }

  private async fetchDataFromAPI(): Promise<any[]> {
    // API call simulation
    return new Promise(resolve => {
      setTimeout(() => {
        resolve([
          { id: 1, name: 'Item 1' },
          { id: 2, name: 'Item 2' },
          { id: 3, name: 'Item 3' }
        ]);
      }, 2000);
    });
  }
}

// Extension B - Data Consumer
@KimuComponent({
  tag: 'data-list',
  name: 'Data List'
})
export class DataList extends HTMLElement {
  private store = KimuStore.getInstance();
  private eventBus = KimuEventBus.getInstance();
  private subscriptions: Subscription[] = [];

  connectedCallback() {
    this.render();
    this.setupDataObservers();
  }

  disconnectedCallback() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private setupDataObservers() {
    // Observe data changes
    const dataSub = this.store.subscribe('applicationData', (newData) => {
      this.renderDataList(newData);
    });

    // Observe loading states
    const loadingSub = this.eventBus.on('data-loading', () => {
      this.showLoadingState();
    });

    const loadedSub = this.eventBus.on('data-loaded', (info) => {
      console.log(`Data loaded from ${info.provider}: ${info.dataSize} items`);
      this.hideLoadingState();
    });

    const errorSub = this.eventBus.on('data-error', (error) => {
      this.showErrorState(error.error);
    });

    this.subscriptions.push(dataSub, loadingSub, loadedSub, errorSub);
  }

  private showLoadingState() {
    const container = this.querySelector('.data-container') as HTMLElement;
    container.innerHTML = '<div class="loading">Loading data...</div>';
  }

  private hideLoadingState() {
    const loading = this.querySelector('.loading');
    if (loading) {
      loading.remove();
    }
  }

  private showErrorState(message: string) {
    const container = this.querySelector('.data-container') as HTMLElement;
    container.innerHTML = `<div class="error">Error: ${message}</div>`;
  }

  private renderDataList(data: any[]) {
    if (!data) return;

    const container = this.querySelector('.data-container') as HTMLElement;
    container.innerHTML = `
      <ul class="data-list">
        ${data.map(item => `<li data-id="${item.id}">${item.name}</li>`).join('')}
      </ul>
    `;
  }

  private render() {
    this.innerHTML = `
      <div class="data-list-container">
        <h3>Data List</h3>
        <div class="data-container">
          <!-- Dynamic content -->
        </div>
      </div>
    `;

    // Check if there's already data
    const existingData = this.store.getState('applicationData');
    if (existingData) {
      this.renderDataList(existingData);
    }
  }
}
```

## Advantages

### Loose Coupling
- **Independence**: Observer and Subject are independent
- **Flexibility**: Easy to add/remove observers
- **Reusability**: Reusable components

### Scalability
- **Extensibility**: Easy to add new observers
- **Performance**: Only interested observers receive notifications
- **Modularity**: Modular and interchangeable components

### Reactivity
- **Real-time updates**: Automatic updates
- **Event-driven**: Event-driven architecture
- **Consistency**: Always synchronized state

## Disadvantages

### Complexity
- **Debug difficulty**: Hard to trace notification flow
- **Memory leaks**: Possible memory leaks if not unsubscribing
- **Dependency tracking**: Hard to track dependencies

### Performance
- **Overhead**: Overhead for notifications
- **Cascading updates**: Cascading updates
- **Memory usage**: Memory for maintaining observer lists

## Best Practices

### Memory Management

```typescript
export class SafeObservableComponent extends HTMLElement {
  private subscriptions: Subscription[] = [];

  connectedCallback() {
    // Register observers
    const sub1 = store.subscribe('data', this.handleDataChange.bind(this));
    const sub2 = eventBus.on('custom-event', this.handleCustomEvent.bind(this));
    
    this.subscriptions.push(sub1, sub2);
  }

  disconnectedCallback() {
    // IMPORTANT: always clean up subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.subscriptions = [];
  }
}
```

### Error Handling

```typescript
export class RobustObserver implements Observer {
  update(data: any): void {
    try {
      this.processUpdate(data);
    } catch (error) {
      console.error('Observer error:', error);
      // Notify error system
      errorHandler.report(error);
      // Don't propagate the error
    }
  }

  private processUpdate(data: any): void {
    // Update logic
  }
}
```

### Performance Optimization

```typescript
export class ThrottledObserver implements Observer {
  private updateTimeout?: NodeJS.Timeout;
  private latestData: any;

  update(data: any): void {
    this.latestData = data;
    
    if (this.updateTimeout) {
      clearTimeout(this.updateTimeout);
    }
    
    this.updateTimeout = setTimeout(() => {
      this.processUpdate(this.latestData);
      this.updateTimeout = undefined;
    }, 100); // Throttle to 100ms
  }

  private processUpdate(data: any): void {
    // Optimized update process
  }
}
```

The Observer pattern is fundamental in KIMU for maintaining reactivity and modularity of the framework, enabling efficient communication between components while maintaining loose coupling.

## References

- [KimuStore](../core/kimu-store.md) - Store implementation with Observer
- [Singleton Pattern](./singleton-pattern.md) - Often used together
- [Asset Loading Pattern](./asset-loading.md) - Related pattern implementation
