# Ciclo di Vita delle Estensioni

Il ciclo di vita delle estensioni KIMU segue un pattern prevedibile che ti permette di gestire correttamente inizializzazione, rendering e cleanup.

## 🔄 Hook del Ciclo di Vita

### 1. **`onInit()`** - Inizializzazione
### 2. **`onRender()`** - Post-Rendering  
### 3. **`onDestroy()`** - Cleanup e Pulizia

---

## 🚀 1. onInit() - Setup Iniziale

Eseguito **UNA VOLTA** quando l'estensione viene caricata la prima volta.

```typescript
@KimuComponent({
  tag: 'lifecycle-demo',
  name: 'Demo Ciclo di Vita'
})
export class LifecycleDemo extends KimuComponentElement {
  private intervalId?: number;
  private eventListener?: (e: Event) => void;
  private data: any[] = [];

  onInit(): void {
    console.log('🚀 1. onInit - Inizializzazione');
    
    // ✅ Setup iniziale
    this.setupEventListeners();
    this.loadInitialData();
    this.startPeriodicUpdates();
  }

  private setupEventListeners() {
    this.eventListener = (e: Event) => {
      console.log('Evento ricevuto:', e);
      this.refresh();
    };
    
    document.addEventListener('kimu:data-update', this.eventListener);
  }

  private async loadInitialData() {
    try {
      const response = await fetch('/api/initial-data');
      this.data = await response.json();
      this.refresh(); // Aggiorna UI con nuovi dati
    } catch (error) {
      console.error('Errore caricamento dati:', error);
    }
  }

  private startPeriodicUpdates() {
    this.intervalId = window.setInterval(() => {
      this.updateTimestamp();
    }, 1000);
  }

  private updateTimestamp() {
    // Aggiorna timestamp interno
    this.refresh();
  }

  getData() {
    return {
      data: this.data,
      timestamp: new Date().toLocaleTimeString(),
      status: 'Attivo'
    };
  }
}
```

### Cosa Fare in `onInit()`

| ✅ **Fare** | ❌ **Non Fare** |
|------------|----------------|
| Setup event listeners | Manipolazione DOM diretta |
| Caricamento dati iniziali | Operazioni che dipendono dal DOM |
| Inizializzazione timer | Operazioni pesanti sincrone |
| Configurazione stato | Accesso a elementi non ancora renderizzati |

---

## 🎨 2. onRender() - Post-Rendering

Eseguito **OGNI VOLTA** dopo che il template è stato renderizzato.

```typescript
export class RenderingExample extends KimuComponentElement {
  private chartInstance?: any;

  onRender(): void {
    console.log('🎨 2. onRender - Post-rendering');
    
    // ✅ Manipolazione DOM sicura
    this.attachDOMHandlers();
    this.initializeChart();
    this.updateDOMClasses();
  }

  private attachDOMHandlers() {
    // Accesso sicuro agli elementi DOM
    const button = this.querySelector('.special-button');
    if (button) {
      button.addEventListener('click', this.handleSpecialClick);
    }
  }

  private initializeChart() {
    const chartContainer = this.querySelector('.chart-container');
    if (chartContainer && !this.chartInstance) {
      // Inizializza libreria chart solo se il container esiste
      this.chartInstance = new Chart(chartContainer, {
        // Configurazione chart
      });
    }
  }

  private updateDOMClasses() {
    // Aggiorna classi CSS basate sullo stato
    const container = this.querySelector('.container');
    if (container) {
      container.classList.toggle('active', this.isActive);
      container.classList.toggle('loading', this.isLoading);
    }
  }

  private handleSpecialClick = (e: Event) => {
    console.log('Click speciale:', e);
  }

  getData() {
    return {
      isActive: true,
      isLoading: false,
      chartData: [1, 2, 3, 4, 5]
    };
  }
}
```

### Cosa Fare in `onRender()`

| ✅ **Fare** | ❌ **Non Fare** |
|------------|----------------|
| Manipolazione DOM | Setup event listeners globali |
| Inizializzazione librerie UI | Operazioni asincrone pesanti |
| Aggiornamento classi CSS | Chiamate API |
| Binding eventi specifici | Modifica stato che causa re-render infinito |

---

## 🧹 3. onDestroy() - Cleanup

Eseguito quando l'estensione viene **rimossa** dal layout.

```typescript
export class CleanupExample extends KimuComponentElement {
  private intervalId?: number;
  private timeoutId?: number;
  private eventListener?: (e: Event) => void;
  private observers: IntersectionObserver[] = [];
  private abortController = new AbortController();

  onInit(): void {
    // Setup con tracking per cleanup
    this.setupPeriodicUpdates();
    this.setupEventListeners();
    this.setupObservers();
    this.setupAsyncOperations();
  }

  onDestroy(): void {
    console.log('🧹 3. onDestroy - Cleanup');
    
    // ✅ Cleanup completo di tutte le risorse
    this.clearTimers();
    this.removeEventListeners();
    this.disconnectObservers();
    this.cancelAsyncOperations();
  }

  private setupPeriodicUpdates() {
    this.intervalId = window.setInterval(() => {
      this.updateData();
    }, 1000);

    this.timeoutId = window.setTimeout(() => {
      this.doDelayedAction();
    }, 5000);
  }

  private setupEventListeners() {
    this.eventListener = (e: Event) => {
      this.handleGlobalEvent(e);
    };
    
    document.addEventListener('resize', this.eventListener);
    window.addEventListener('beforeunload', this.eventListener);
  }

  private setupObservers() {
    const observer = new IntersectionObserver((entries) => {
      console.log('Intersection:', entries);
    });
    
    this.observers.push(observer);
    
    const element = this.querySelector('.observed-element');
    if (element) {
      observer.observe(element);
    }
  }

  private setupAsyncOperations() {
    // Operazioni async con AbortController
    fetch('/api/data', { 
      signal: this.abortController.signal 
    }).then(response => {
      // Handle response
    }).catch(error => {
      if (error.name !== 'AbortError') {
        console.error('Fetch error:', error);
      }
    });
  }

  // 🧹 Metodi di Cleanup

  private clearTimers() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
    
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = undefined;
    }
  }

  private removeEventListeners() {
    if (this.eventListener) {
      document.removeEventListener('resize', this.eventListener);
      window.removeEventListener('beforeunload', this.eventListener);
      this.eventListener = undefined;
    }
  }

  private disconnectObservers() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }

  private cancelAsyncOperations() {
    this.abortController.abort();
  }

  getData() {
    return {
      status: 'Attivo',
      activeTimers: [this.intervalId, this.timeoutId].filter(Boolean).length,
      activeObservers: this.observers.length
    };
  }
}
```

### Cosa Fare in `onDestroy()`

| ✅ **Sempre Fare** | ⚠️ **Attenzione** |
|-------------------|-------------------|
| Clear timer/interval | Non chiamare `refresh()` |
| Remove event listeners | Non iniziare nuove operazioni async |
| Disconnect observers | Non accedere al DOM |
| Cancel async operations | Non logiche complesse |
| Reset riferimenti | Operazioni devono essere sincrone |

---

## 🎯 Pattern Avanzati

### 1. **Lifecycle con State Management**

```typescript
export class StateLifecycleExample extends KimuComponentElement {
  private state = {
    initialized: false,
    rendered: false,
    disposed: false,
    data: null
  };

  onInit(): void {
    this.updateState({ initialized: true });
    console.log('State dopo init:', this.state);
  }

  onRender(): void {
    this.updateState({ rendered: true });
    console.log('State dopo render:', this.state);
  }

  onDestroy(): void {
    this.updateState({ disposed: true });
    console.log('State finale:', this.state);
  }

  private updateState(updates: Partial<typeof this.state>) {
    this.state = { ...this.state, ...updates };
    if (!this.state.disposed) {
      this.refresh(); // Solo se non siamo in fase di dispose
    }
  }

  getData() {
    return {
      ...this.state,
      lifecycle: `Init: ${this.state.initialized}, Render: ${this.state.rendered}`
    };
  }
}
```

### 2. **Cleanup Automatico con Utility**

```typescript
class ResourceManager {
  private timers: number[] = [];
  private listeners: Array<{target: EventTarget, event: string, handler: EventListener}> = [];
  private observers: IntersectionObserver[] = [];

  addTimer(id: number) {
    this.timers.push(id);
  }

  addListener(target: EventTarget, event: string, handler: EventListener) {
    this.listeners.push({ target, event, handler });
    target.addEventListener(event, handler);
  }

  addObserver(observer: IntersectionObserver) {
    this.observers.push(observer);
  }

  cleanup() {
    // Clear timers
    this.timers.forEach(id => {
      clearInterval(id);
      clearTimeout(id);
    });

    // Remove listeners
    this.listeners.forEach(({ target, event, handler }) => {
      target.removeEventListener(event, handler);
    });

    // Disconnect observers
    this.observers.forEach(observer => observer.disconnect());

    // Reset arrays
    this.timers = [];
    this.listeners = [];
    this.observers = [];
  }
}

export class ManagedResourcesExample extends KimuComponentElement {
  private resourceManager = new ResourceManager();

  onInit(): void {
    // Setup con resource manager
    const intervalId = window.setInterval(() => {
      this.updateData();
    }, 1000);
    this.resourceManager.addTimer(intervalId);

    this.resourceManager.addListener(document, 'click', this.handleDocumentClick);
  }

  onDestroy(): void {
    // Cleanup automatico di tutte le risorse
    this.resourceManager.cleanup();
  }

  private handleDocumentClick = (e: Event) => {
    console.log('Document clicked');
  }

  getData() {
    return {
      timestamp: new Date().toLocaleTimeString()
    };
  }
}
```

---

## 🐛 Debug del Ciclo di Vita

### Tracking Hook Calls

```typescript
export class DebugLifecycle extends KimuComponentElement {
  private lifecycleLog: string[] = [];

  onInit(): void {
    this.addToLog('onInit chiamato');
    console.log('🔍 Debug Lifecycle - Init');
  }

  onRender(): void {
    this.addToLog('onRender chiamato');
    console.log('🔍 Debug Lifecycle - Render');
  }

  onDestroy(): void {
    this.addToLog('onDestroy chiamato');
    console.log('🔍 Debug Lifecycle - Dispose');
    console.log('📊 Lifecycle completo:', this.lifecycleLog);
  }

  private addToLog(message: string) {
    const timestamp = new Date().toISOString();
    this.lifecycleLog.push(`${timestamp}: ${message}`);
  }

  getData() {
    return {
      lifecycleLog: this.lifecycleLog,
      renderCount: this.lifecycleLog.filter(log => log.includes('onRender')).length
    };
  }
}
```

## 🚨 Errori Comuni da Evitare

### ❌ **Non Fare - Memory Leaks**

```typescript
// ❌ SBAGLIATO: Timer non pulito
onInit() {
  setInterval(() => {
    this.refresh();
  }, 1000); // Memory leak!
}

// ❌ SBAGLIATO: Listener non rimosso
onInit() {
  document.addEventListener('click', this.handleClick); // Memory leak!
}
```

### ✅ **Fare - Gestione Corretta**

```typescript
// ✅ CORRETTO: Timer con cleanup
private timerId?: number;

onInit() {
  this.timerId = window.setInterval(() => {
    this.refresh();
  }, 1000);
}

onDestroy() {
  if (this.timerId) {
    clearInterval(this.timerId);
  }
}
```

## 📚 Prossimi Passi

- **[Best Practices](./best-practices.md)** - Pattern avanzati e ottimizzazioni
- **[Comunicazione](./communication.md)** - Lifecycle nella comunicazione
- **[Template](./templates.md)** - Template che rispettano il lifecycle
