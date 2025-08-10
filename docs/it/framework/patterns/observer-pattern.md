# Observer Pattern

Il pattern Observer implementa un meccanismo di notifica dove un oggetto (subject) mantiene una lista di osservatori (observers) e li notifica automaticamente di qualsiasi cambiamento di stato.

## Problema

Nelle applicazioni modulari come KIMU, spesso abbiamo bisogno di:

- **Comunicazione tra componenti**: Estensioni che devono reagire a cambiamenti in altre estensioni
- **State changes**: Componenti UI che devono aggiornarsi quando lo stato cambia
- **Event handling**: Gestione decentralizzata di eventi dell'applicazione
- **Loose coupling**: Mantenere basso accoppiamento tra componenti
- **Real-time updates**: Aggiornamenti in tempo reale dell'interfaccia

## Soluzione

Il pattern Observer fornisce:

1. **Subject/Observable**: L'oggetto che genera notifiche
2. **Observer**: Gli oggetti che ricevono le notifiche
3. **Subscribe/Unsubscribe**: Meccanismo per registrare/rimuovere osservatori
4. **Notification**: Sistema per inviare aggiornamenti agli osservatori

## Implementazione in KIMU

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
   * Aggiunge un osservatore generale
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
   * Aggiunge un osservatore per un evento specifico
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
   * Notifica tutti gli osservatori generali
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
   * Notifica osservatori di un evento specifico
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
   * Rimuove tutti gli osservatori
   */
  public clear(): void {
    this.observers.clear();
    this.eventObservers.clear();
  }

  /**
   * Restituisce il numero di osservatori
   */
  public get observerCount(): number {
    let total = this.observers.size;
    this.eventObservers.forEach(set => total += set.size);
    return total;
  }
}
```

### KimuStore con Observer Pattern

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
   * Sottoscrizione a cambiamenti di una chiave specifica
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
   * Sottoscrizione con callback function
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
   * Imposta un valore e notifica gli osservatori
   */
  public setState(key: string, value: any): void {
    const oldValue = this.state.get(key);
    this.state.set(key, value);

    // Notifica osservatori specifici della chiave
    this.notifyKeyObservers(key, value, oldValue);
    
    // Notifica osservatori generali
    this.emit('state-changed', { key, value, oldValue });
  }

  /**
   * Ottiene un valore
   */
  public getState(key: string): any {
    return this.state.get(key);
  }

  /**
   * Aggiorna parzialmente un oggetto
   */
  public updateState(key: string, updates: any): void {
    const currentValue = this.getState(key);
    const newValue = { ...currentValue, ...updates };
    this.setState(key, newValue);
  }

  /**
   * Rimuove una chiave
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
   * Registra un listener per un evento
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
   * Registra un listener che si esegue una sola volta
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
   * Emette un evento
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

    // Notifica anche osservatori generali
    super.emit('event', { event, data });
  }

  /**
   * Rimuove tutti i listener di un evento
   */
  public off(event: string): void {
    this.listeners.delete(event);
  }

  /**
   * Lista eventi attivi
   */
  public getActiveEvents(): string[] {
    return Array.from(this.listeners.keys());
  }

  /**
   * Numero di listener per evento
   */
  public getListenerCount(event: string): number {
    return this.listeners.get(event)?.size || 0;
  }
}
```

## Utilizzo nelle Estensioni

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
    // Pulisci tutte le sottoscrizioni
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.subscriptions = [];
  }

  private setupObservers() {
    // Osserva cambiamenti del contatore
    const counterSub = this.store.subscribe('counter', (newValue, oldValue) => {
      this.updateCounterDisplay(newValue);
      
      // Emetti evento di cambiamento
      this.eventBus.emit('counter-changed', {
        newValue,
        oldValue,
        component: this.tagName
      });
    });

    // Osserva eventi globali
    const resetSub = this.eventBus.on('reset-all-counters', () => {
      this.store.setState('counter', 0);
    });

    this.subscriptions.push(counterSub, resetSub);
  }

  private updateCounterDisplay(value: number) {
    const display = this.querySelector('.counter-value') as HTMLElement;
    if (display) {
      display.textContent = String(value);
      
      // Animazione visiva per il cambiamento
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
      // Simula caricamento dati
      this.eventBus.emit('data-loading', { provider: 'data-provider' });
      
      const data = await this.fetchDataFromAPI();
      
      // Salva nello store
      this.store.setState('applicationData', data);
      
      // Notifica caricamento completato
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
    // Simulazione API call
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
    // Osserva cambiamenti nei dati
    const dataSub = this.store.subscribe('applicationData', (newData) => {
      this.renderDataList(newData);
    });

    // Osserva stati di caricamento
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
    container.innerHTML = '<div class="loading">Caricamento dati...</div>';
  }

  private hideLoadingState() {
    const loading = this.querySelector('.loading');
    if (loading) {
      loading.remove();
    }
  }

  private showErrorState(message: string) {
    const container = this.querySelector('.data-container') as HTMLElement;
    container.innerHTML = `<div class="error">Errore: ${message}</div>`;
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
          <!-- Contenuto dinamico -->
        </div>
      </div>
    `;

    // Controlla se ci sono già dati
    const existingData = this.store.getState('applicationData');
    if (existingData) {
      this.renderDataList(existingData);
    }
  }
}
```

### Custom Observable Component

```typescript
interface ComponentState {
  isVisible: boolean;
  isLoading: boolean;
  hasError: boolean;
  data: any;
}

@KimuComponent({
  tag: 'observable-component',
  name: 'Observable Component'
})
export class ObservableComponent extends HTMLElement {
  private state: ComponentState = {
    isVisible: false,
    isLoading: false,
    hasError: false,
    data: null
  };

  private stateObservable = new Observable<ComponentState>();

  connectedCallback() {
    this.setupStateObserver();
    this.render();
  }

  private setupStateObserver() {
    // Auto-update UI quando lo stato cambia
    this.stateObservable.subscribe({
      update: (newState) => {
        this.updateUI(newState);
      }
    });

    // Osserva cambiamenti specifici
    this.stateObservable.on('loading-state-changed', {
      update: (data) => {
        console.log('Loading state changed:', data);
      }
    });
  }

  private setState(updates: Partial<ComponentState>) {
    const oldState = { ...this.state };
    this.state = { ...this.state, ...updates };
    
    // Notifica osservatori
    this.stateObservable.notify(this.state);
    
    // Notifica cambiamenti specifici
    if (updates.isLoading !== undefined) {
      this.stateObservable.emit('loading-state-changed', {
        isLoading: updates.isLoading,
        oldValue: oldState.isLoading
      });
    }
  }

  private updateUI(state: ComponentState) {
    const container = this.querySelector('.component-content') as HTMLElement;
    
    if (state.isLoading) {
      container.innerHTML = '<div class="loading">Loading...</div>';
    } else if (state.hasError) {
      container.innerHTML = '<div class="error">Error loading data</div>';
    } else if (state.data) {
      container.innerHTML = `<div class="data">${JSON.stringify(state.data)}</div>`;
    }
    
    this.style.display = state.isVisible ? 'block' : 'none';
  }

  // Public API
  public show() {
    this.setState({ isVisible: true });
  }

  public hide() {
    this.setState({ isVisible: false });
  }

  public async loadData() {
    this.setState({ isLoading: true, hasError: false });
    
    try {
      const data = await this.fetchData();
      this.setState({ isLoading: false, data });
    } catch (error) {
      this.setState({ isLoading: false, hasError: true });
    }
  }

  private async fetchData(): Promise<any> {
    // Simula fetch
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.8) {
          reject(new Error('Random error'));
        } else {
          resolve({ message: 'Hello from API' });
        }
      }, 1000);
    });
  }

  private render() {
    this.innerHTML = `
      <div class="observable-component">
        <h3>Observable Component</h3>
        <div class="controls">
          <button id="show-btn">Show</button>
          <button id="hide-btn">Hide</button>
          <button id="load-btn">Load Data</button>
        </div>
        <div class="component-content"></div>
      </div>
    `;

    // Event listeners
    this.querySelector('#show-btn')?.addEventListener('click', () => this.show());
    this.querySelector('#hide-btn')?.addEventListener('click', () => this.hide());
    this.querySelector('#load-btn')?.addEventListener('click', () => this.loadData());
  }
}
```

## Vantaggi

### Loose Coupling
- **Indipendenza**: Observer e Subject sono indipendenti
- **Flessibilità**: Facile aggiungere/rimuovere osservatori
- **Riusabilità**: Componenti riutilizzabili

### Scalabilità
- **Estensibilità**: Facile aggiungere nuovi osservatori
- **Performance**: Solo osservatori interessati ricevono notifiche
- **Modularità**: Componenti modulari e intercambiabili

### Reattività
- **Real-time updates**: Aggiornamenti automatici
- **Event-driven**: Architettura guidata dagli eventi
- **Consistency**: Stato sempre sincronizzato

## Svantaggi

### Complessità
- **Debug difficulty**: Difficile tracciare flusso di notifiche
- **Memory leaks**: Possibili memory leak se non si fa unsubscribe
- **Dependency tracking**: Difficile tracciare dipendenze

### Performance
- **Overhead**: Overhead per notifiche
- **Cascading updates**: Aggiornamenti a cascata
- **Memory usage**: Memoria per mantenere lista osservatori

## Best Practices

### Memory Management

```typescript
export class SafeObservableComponent extends HTMLElement {
  private subscriptions: Subscription[] = [];

  connectedCallback() {
    // Registra osservatori
    const sub1 = store.subscribe('data', this.handleDataChange.bind(this));
    const sub2 = eventBus.on('custom-event', this.handleCustomEvent.bind(this));
    
    this.subscriptions.push(sub1, sub2);
  }

  disconnectedCallback() {
    // IMPORTANTE: pulisci sempre le sottoscrizioni
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
      // Notifica sistema di errori
      errorHandler.report(error);
      // Non propagare l'errore
    }
  }

  private processUpdate(data: any): void {
    // Logica di aggiornamento
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
    }, 100); // Throttle a 100ms
  }

  private processUpdate(data: any): void {
    // Processo di aggiornamento ottimizzato
  }
}
```

Il pattern Observer è fondamentale in KIMU per mantenere la reattività e la modularità del framework, permettendo una comunicazione efficiente tra componenti mantenendo basso accoppiamento.

## Riferimenti

- [KimuStore](../core/kimu-store.md) - Implementazione Store con Observer
- [Singleton Pattern](./singleton-pattern.md) - Spesso usato insieme
- [Event Bus Pattern](./event-bus.md) - Implementazione specifica per eventi
- [State Management](./state-management.md) - Gestione stato reattivo
