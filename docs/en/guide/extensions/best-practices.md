# Best Practices

Follow these best practices to create robust, performant, and maintainable KIMU extensions.

## 🏗️ Architecture and Organization

### 1. **Consistent File Structure**

```
extensions/
  my-extension/
    component.ts          # Main logic
    view.html            # UI template  
    style.css            # Styles
    types.ts             # TypeScript types (optional)
    utils.ts             # Utility functions (optional)
    README.md            # Documentation (optional)
```

### 2. **Naming Convention**

```typescript
// ✅ GOOD: Descriptive and consistent names
@KimuComponent({
  tag: 'user-profile-card',        // kebab-case, descriptive
  name: 'User Profile Card',       // Spaces, Title Case
  path: 'user-profile-card'        // Same as tag
})
export class UserProfileCard extends KimuComponentElement {
  // Private properties with underscore or private keyword
  private _userData: UserData | null = null;
  private isLoading = false;
  
  // Public methods camelCase
  public getUserData(): UserData | null {
    return this._userData;
  }
  
  // Private methods with prefix
  private handleUserUpdate(): void {
    // ...
  }
}
```

---

## 🎯 State Management

### 1. **Immutable State**

```typescript
// ✅ GOOD: Immutable state with helper methods
export class StateManagementExample extends KimuComponentElement {
  private state = {
    counter: 0,
    items: [] as Item[],
    loading: false,
    error: null as string | null
  };

  // Centralized method for state updates
  private updateState(updates: Partial<typeof this.state>) {
    this.state = { ...this.state, ...updates };
    this.refresh();
  }

  // Specific methods for actions
  private incrementCounter() {
    this.updateState({ counter: this.state.counter + 1 });
  }

  private addItem(item: Item) {
    this.updateState({ 
      items: [...this.state.items, item] 
    });
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

---

## ⚡ Performance and Optimization

### 1. **Avoid Unnecessary Re-renders**

```typescript
// ✅ GOOD: Check changes before refresh
export class OptimizedComponent extends KimuComponentElement {
  private lastRenderedData: any = null;

  getData() {
    const currentData = {
      items: this.items,
      counter: this.counter,
      // ...
    };

    // Only refresh if data actually changed
    if (!this.dataEquals(currentData, this.lastRenderedData)) {
      this.lastRenderedData = { ...currentData };
    }

    return currentData;
  }

  private dataEquals(a: any, b: any): boolean {
    return JSON.stringify(a) === JSON.stringify(b);
  }
}
```

### 2. **Debouncing and Throttling**

```typescript
// ✅ GOOD: Debouncing for heavy inputs
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
        
        this.refresh(); // Update UI immediately for input
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

  onDispose() {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
  }
}
```

---

## 🛡️ Error Handling and Resilience

### 1. **Error Boundaries for Components**

```typescript
// ✅ GOOD: Robust error handling
export class ResilientComponent extends KimuComponentElement {
  private error: Error | null = null;
  private retryCount = 0;
  private maxRetries = 3;

  getData() {
    // If there's an error, show fallback UI
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
      error: this.error?.message || 'Unknown error',
      canRetry: this.retryCount < this.maxRetries,
      onRetry: () => this.retry(),
      onReset: () => this.reset()
    };
  }

  private handleError(error: any) {
    console.error('Component error:', error);
    this.error = error instanceof Error ? error : new Error(String(error));
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
}
```

---

## 📦 Memory Management

### 1. **Resource Cleanup Pattern**

```typescript
// ✅ GOOD: Systematic memory management
export class MemoryEfficientComponent extends KimuComponentElement {
  private resources = new ComponentResourceManager();
  private cache = new Map<string, any>();
  private maxCacheSize = 100;

  onInit() {
    // Register all resources for automatic cleanup
    const interval = window.setInterval(() => this.updateData(), 1000);
    this.resources.addTimer(interval);

    const observer = new IntersectionObserver(this.handleIntersection);
    this.resources.addObserver(observer);

    this.resources.addEventListener(document, 'visibilitychange', this.handleVisibilityChange);
  }

  onDispose() {
    // Automatic cleanup of all resources
    this.resources.cleanup();
    this.clearCache();
  }

  private addToCache(key: string, value: any) {
    // Cache management with memory limit
    if (this.cache.size >= this.maxCacheSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }

  private clearCache() {
    this.cache.clear();
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
    // Systematic cleanup of all resources
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

## 🎯 Best Practices Summary

### ✅ **Always Do**
- Use TypeScript for type safety
- Implement cleanup in `onDispose()`
- Handle errors gracefully
- Use immutable state
- Implement logging for debugging
- Validate external data
- Use consistent naming conventions

### ❌ **Avoid**
- Memory leaks (timers, listeners)
- Direct state mutations
- Heavy synchronous operations in `onInit()`
- DOM access in `onInit()`
- Calling `refresh()` in infinite loops
- Unhandled errors
- Untyped code

### 🚀 **For Performance**
- Debounce expensive operations
- Cache computational results
- Lazy load heavy dependencies
- Check changes before re-rendering
- Use weak references where appropriate

KIMU extensions following these best practices will be **robust, performant, and maintainable**, ensuring excellent user experience and long-term development ease.
