# Communication Between Extensions

KIMU extensions can communicate with each other using different mechanisms, allowing you to create complex and modular applications.

## 🔄 Communication Mechanisms

### 1. **Custom Events (Event-driven)**
### 2. **Global Store (State sharing)**
### 3. **DOM Events (Standard)**
### 4. **Callback Patterns**

---

## 📡 Communication via Custom Events

The cleanest and most decoupled pattern for extension communication.

### Sender Extension (Sends Events)

```typescript
@KimuComponent({
  tag: 'message-sender',
  name: 'Message Sender',
  icon: '📤'
})
export class MessageSender extends KimuComponentElement {
  private messageText = '';

  getData() {
    return {
      messageText: this.messageText,
      
      onMessageChange: (event: Event) => {
        const input = event.target as HTMLInputElement;
        this.messageText = input.value;
        this.refresh();
      },
      
      onSendMessage: () => {
        if (this.messageText.trim()) {
          // Send custom event with payload
          this.dispatchEvent(new CustomEvent('kimu:message-sent', {
            detail: { 
              message: this.messageText,
              timestamp: Date.now(),
              sender: 'message-sender'
            },
            bubbles: true // Allow propagation
          }));
          
          this.messageText = ''; // Reset
          this.refresh();
        }
      }
    };
  }
}
```

### Receiver Extension (Receives Events)

```typescript
@KimuComponent({
  tag: 'message-receiver',
  name: 'Message Receiver',
  icon: '📥'
})
export class MessageReceiver extends KimuComponentElement {
  private messages: Array<{message: string, timestamp: number, sender: string}> = [];
  private eventListener?: (e: CustomEvent) => void;

  onInit() {
    // Create listener
    this.eventListener = (e: CustomEvent) => {
      this.messages.push(e.detail);
      this.refresh();
    };
    
    // Listen to custom events
    document.addEventListener('kimu:message-sent', this.eventListener);
  }

  onDestroy() {
    // Cleanup: remove listener
    if (this.eventListener) {
      document.removeEventListener('kimu:message-sent', this.eventListener);
    }
  }

  getData() {
    return {
      messages: this.messages,
      messageCount: this.messages.length,
      hasMessages: this.messages.length > 0,
      
      onClearMessages: () => {
        this.messages = [];
        this.refresh();
      }
    };
  }
}
```

---

## 🗃️ Communication via Global Store

Use KimuStore to share persistent state between extensions.

### Store Writer (Writes Data)

```typescript
@KimuComponent({
  tag: 'global-counter',
  name: 'Global Counter',
  icon: '🌍'
})
export class GlobalCounter extends KimuComponentElement {
  private currentValue = 0;

  onInit() {
    // Read initial value from store
    const stored = (window as any).kimuStore?.get('globalCounter');
    this.currentValue = stored || 0;
    this.refresh();
  }

  getData() {
    return {
      currentValue: this.currentValue,
      
      onIncrement: () => {
        this.currentValue++;
        this.saveToStore();
        this.notifyChange();
      },
      
      onDecrement: () => {
        this.currentValue--;
        this.saveToStore();
        this.notifyChange();
      }
    };
  }

  private saveToStore() {
    (window as any).kimuStore?.set('globalCounter', this.currentValue);
    this.refresh();
  }

  private notifyChange() {
    // Notify other components of change
    document.dispatchEvent(new CustomEvent('kimu:store-updated', {
      detail: { key: 'globalCounter', value: this.currentValue }
    }));
  }
}
```

### Store Reader (Reads Data)

```typescript
@KimuComponent({
  tag: 'counter-display',
  name: 'Counter Display',
  icon: '📊'
})
export class CounterDisplay extends KimuComponentElement {
  private globalValue = 0;
  private storeListener?: (e: CustomEvent) => void;

  onInit() {
    // Read initial value
    this.globalValue = (window as any).kimuStore?.get('globalCounter') || 0;
    
    // Listen to store changes
    this.storeListener = (e: CustomEvent) => {
      if (e.detail.key === 'globalCounter') {
        this.globalValue = e.detail.value;
        this.refresh();
      }
    };
    
    document.addEventListener('kimu:store-updated', this.storeListener);
    this.refresh();
  }

  onDestroy() {
    if (this.storeListener) {
      document.removeEventListener('kimu:store-updated', this.storeListener);
    }
  }

  getData() {
    return {
      globalValue: this.globalValue,
      
      onSyncFromStore: () => {
        this.globalValue = (window as any).kimuStore?.get('globalCounter') || 0;
        this.refresh();
      }
    };
  }
}
```

## 🎯 Best Practices for Communication

### 1. **Event Naming Convention**
```typescript
// ✅ Good: namespaced with prefix
'kimu:message-sent'
'kimu:user-logged-in'
'kimu:data-updated'

// ❌ Avoid: generic names
'message'
'update'
'change'
```

### 2. **Memory Management (Cleanup)**
```typescript
export class MyExtension extends KimuComponentElement {
  private eventListener?: (e: CustomEvent) => void;

  onInit() {
    this.eventListener = (e) => this.handleEvent(e);
    document.addEventListener('my-event', this.eventListener);
  }

  onDestroy() {
    // ✅ Always clean up listeners!
    if (this.eventListener) {
      document.removeEventListener('my-event', this.eventListener);
    }
  }
}
```

## 📚 Next Steps

- **[Advanced Templates](./templates.md)** - Complex UIs for communications
- **[Lifecycle](./lifecycle.md)** - Managing communications in lifecycle
- **[Best Practices](./best-practices.md)** - Scalable and maintainable patterns
