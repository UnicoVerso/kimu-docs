# Extension Lifecycle

The lifecycle of KIMU extensions follows a predictable pattern that allows you to properly manage initialization, rendering, and cleanup.

## 🔄 Lifecycle Hooks

### 1. **`onInit()`** - Initialization
### 2. **`onRender()`** - Post-Rendering  
### 3. **`onDestroy()`** - Cleanup

---

## 🚀 1. onInit() - Initial Setup

Executed **ONCE** when the extension is loaded for the first time.

```typescript
@KimuComponent({
  tag: 'lifecycle-demo',
  name: 'Lifecycle Demo'
})
export class LifecycleDemo extends KimuComponentElement {
  private intervalId?: number;
  private eventListener?: (e: Event) => void;
  private data: any[] = [];

  onInit(): void {
    console.log('🚀 1. onInit - Initialization');
    
    // ✅ Initial setup
    this.setupEventListeners();
    this.loadInitialData();
    this.startPeriodicUpdates();
  }

  private setupEventListeners() {
    this.eventListener = (e: Event) => {
      console.log('Event received:', e);
      this.refresh();
    };
    
    document.addEventListener('kimu:data-update', this.eventListener);
  }

  private async loadInitialData() {
    try {
      const response = await fetch('/api/initial-data');
      this.data = await response.json();
      this.refresh(); // Update UI with new data
    } catch (error) {
      console.error('Data loading error:', error);
    }
  }

  private startPeriodicUpdates() {
    this.intervalId = window.setInterval(() => {
      this.updateTimestamp();
    }, 1000);
  }

  getData() {
    return {
      data: this.data,
      timestamp: new Date().toLocaleTimeString(),
      status: 'Active'
    };
  }
}
```

### What to Do in `onInit()`

| ✅ **Do** | ❌ **Don't** |
|-----------|-------------|
| Setup event listeners | Direct DOM manipulation |
| Load initial data | Operations depending on DOM |
| Initialize timers | Heavy synchronous operations |
| Configure state | Access non-rendered elements |

---

## 🎨 2. onRender() - Post-Rendering

Executed **EVERY TIME** after the template has been rendered.

```typescript
export class RenderingExample extends KimuComponentElement {
  private chartInstance?: any;

  onRender(): void {
    console.log('🎨 2. onRender - Post-rendering');
    
    // ✅ Safe DOM manipulation
    this.attachDOMHandlers();
    this.initializeChart();
    this.updateDOMClasses();
  }

  private attachDOMHandlers() {
    // Safe access to DOM elements
    const button = this.querySelector('.special-button');
    if (button) {
      button.addEventListener('click', this.handleSpecialClick);
    }
  }

  private initializeChart() {
    const chartContainer = this.querySelector('.chart-container');
    if (chartContainer && !this.chartInstance) {
      // Initialize chart library only if container exists
      this.chartInstance = new Chart(chartContainer, {
        // Chart configuration
      });
    }
  }

  private handleSpecialClick = (e: Event) => {
    console.log('Special click:', e);
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

### What to Do in `onRender()`

| ✅ **Do** | ❌ **Don't** |
|-----------|-------------|
| DOM manipulation | Setup global event listeners |
| Initialize UI libraries | Heavy async operations |
| Update CSS classes | API calls |
| Bind specific events | State changes causing infinite re-render |

---

## 🧹 3. onDestroy() - Cleanup

Executed when the extension is **removed** from the layout.

```typescript
export class CleanupExample extends KimuComponentElement {
  private intervalId?: number;
  private eventListener?: (e: Event) => void;
  private observers: IntersectionObserver[] = [];
  private abortController = new AbortController();

  onInit(): void {
    // Setup with tracking for cleanup
    this.setupPeriodicUpdates();
    this.setupEventListeners();
    this.setupObservers();
  }

  onDestroy(): void {
    console.log('🧹 3. onDestroy - Cleanup');
    
    // ✅ Complete cleanup of all resources
    this.clearTimers();
    this.removeEventListeners();
    this.disconnectObservers();
    this.cancelAsyncOperations();
  }

  private clearTimers() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }

  private removeEventListeners() {
    if (this.eventListener) {
      document.removeEventListener('resize', this.eventListener);
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
      status: 'Active',
      activeTimers: this.intervalId ? 1 : 0,
      activeObservers: this.observers.length
    };
  }
}
```

### What to Do in `onDestroy()`

| ✅ **Always Do** | ⚠️ **Attention** |
|------------------|------------------|
| Clear timers/intervals | Don't call `refresh()` |
| Remove event listeners | Don't start new async operations |
| Disconnect observers | Don't access DOM |
| Cancel async operations | No complex logic |
| Reset references | Operations must be synchronous |

## 🚨 Common Mistakes to Avoid

### ❌ **Don't Do - Memory Leaks**

```typescript
// ❌ WRONG: Timer not cleaned up
onInit() {
  setInterval(() => {
    this.refresh();
  }, 1000); // Memory leak!
}

// ❌ WRONG: Listener not removed
onInit() {
  document.addEventListener('click', this.handleClick); // Memory leak!
}
```

### ✅ **Do - Proper Management**

```typescript
// ✅ CORRECT: Timer with cleanup
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

## 📚 Next Steps

- **[Best Practices](./best-practices.md)** - Advanced patterns and optimizations
- **[Communication](./communication.md)** - Lifecycle in communication
- **[Templates](./templates.md)** - Templates that respect lifecycle
