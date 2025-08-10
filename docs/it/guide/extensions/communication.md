# Comunicazione tra Estensioni

Le estensioni KIMU possono comunicare tra loro usando diversi meccanismi, permettendo di creare applicazioni complesse e modulari.

## 🔄 Meccanismi di Comunicazione

### 1. **Eventi Custom (Event-driven)**
### 2. **Store Globale (State sharing)**
### 3. **DOM Events (Standard)**
### 4. **Callback Patterns**

---

## 📡 Comunicazione tramite Eventi Custom

Il pattern più pulito e decoupled per la comunicazione tra estensioni.

### Estensione Sender (Invia Eventi)

```typescript
@KimuComponent({
  tag: 'message-sender',
  name: 'Inviatore Messaggi',
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
          // Invia evento custom con payload
          this.dispatchEvent(new CustomEvent('kimu:message-sent', {
            detail: { 
              message: this.messageText,
              timestamp: Date.now(),
              sender: 'message-sender'
            },
            bubbles: true // Permette la propagazione
          }));
          
          this.messageText = ''; // Reset
          this.refresh();
        }
      }
    };
  }
}
```

**Template Sender:**
```html
<div class="message-sender">
  <h3>📤 Invia Messaggio</h3>
  <input 
    type="text" 
    value="${messageText}" 
    @input=${onMessageChange}
    placeholder="Scrivi un messaggio..."
  >
  <button @click=${onSendMessage} ?disabled=${!messageText.trim()}>
    Invia
  </button>
</div>
```

### Estensione Receiver (Riceve Eventi)

```typescript
@KimuComponent({
  tag: 'message-receiver',
  name: 'Ricevitore Messaggi',
  icon: '📥'
})
export class MessageReceiver extends KimuComponentElement {
  private messages: Array<{message: string, timestamp: number, sender: string}> = [];
  private eventListener?: (e: CustomEvent) => void;

  onInit() {
    // Crea il listener
    this.eventListener = (e: CustomEvent) => {
      this.messages.push(e.detail);
      this.refresh();
    };
    
    // Ascolta eventi custom
    document.addEventListener('kimu:message-sent', this.eventListener);
  }

  onDispose() {
    // Cleanup: rimuovi listener
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

**Template Receiver:**
```html
<div class="message-receiver">
  <h3>📥 Messaggi Ricevuti (${messageCount})</h3>
  
  ${hasMessages ? `
    <div class="messages">
      ${messages.map(msg => `
        <div class="message">
          <strong>${msg.message}</strong>
          <small>da ${msg.sender} - ${new Date(msg.timestamp).toLocaleTimeString()}</small>
        </div>
      `).join('')}
    </div>
    <button @click=${onClearMessages}>Cancella Tutti</button>
  ` : `
    <p>Nessun messaggio ricevuto</p>
  `}
</div>
```

---

## 🗃️ Comunicazione tramite Store Globale

Usa il KimuStore per condividere stato persistente tra estensioni.

### Store Writer (Scrive dati)

```typescript
@KimuComponent({
  tag: 'global-counter',
  name: 'Contatore Globale',
  icon: '🌍'
})
export class GlobalCounter extends KimuComponentElement {
  private currentValue = 0;

  onInit() {
    // Leggi valore iniziale dal store
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
      },
      
      onReset: () => {
        this.currentValue = 0;
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
    // Notifica altri componenti del cambiamento
    document.dispatchEvent(new CustomEvent('kimu:store-updated', {
      detail: { key: 'globalCounter', value: this.currentValue }
    }));
  }
}
```

### Store Reader (Legge dati)

```typescript
@KimuComponent({
  tag: 'counter-display',
  name: 'Display Contatore',
  icon: '📊'
})
export class CounterDisplay extends KimuComponentElement {
  private globalValue = 0;
  private history: number[] = [];
  private storeListener?: (e: CustomEvent) => void;

  onInit() {
    // Leggi valore iniziale
    this.globalValue = (window as any).kimuStore?.get('globalCounter') || 0;
    
    // Ascolta cambiamenti del store
    this.storeListener = (e: CustomEvent) => {
      if (e.detail.key === 'globalCounter') {
        this.history.push(this.globalValue); // Salva valore precedente
        this.globalValue = e.detail.value;
        this.refresh();
      }
    };
    
    document.addEventListener('kimu:store-updated', this.storeListener);
    this.refresh();
  }

  onDispose() {
    if (this.storeListener) {
      document.removeEventListener('kimu:store-updated', this.storeListener);
    }
  }

  getData() {
    return {
      globalValue: this.globalValue,
      history: this.history.slice(-5), // Ultimi 5 valori
      trend: this.calculateTrend(),
      
      onSyncFromStore: () => {
        this.globalValue = (window as any).kimuStore?.get('globalCounter') || 0;
        this.refresh();
      }
    };
  }

  private calculateTrend(): string {
    if (this.history.length === 0) return 'stabile';
    const lastValue = this.history[this.history.length - 1];
    return this.globalValue > lastValue ? '📈 crescita' : 
           this.globalValue < lastValue ? '📉 calo' : 
           '➡️ stabile';
  }
}
```

---

## 🎯 Best Practices per la Comunicazione

### 1. **Naming Convention per Eventi**
```typescript
// ✅ Buono: namespace con prefisso
'kimu:message-sent'
'kimu:user-logged-in'
'kimu:data-updated'

// ❌ Evita: nomi generici
'message'
'update'
'change'
```

### 2. **Gestione Memoria (Cleanup)**
```typescript
export class MyExtension extends KimuComponentElement {
  private eventListener?: (e: CustomEvent) => void;

  onInit() {
    this.eventListener = (e) => this.handleEvent(e);
    document.addEventListener('my-event', this.eventListener);
  }

  onDispose() {
    // ✅ Sempre pulire i listener!
    if (this.eventListener) {
      document.removeEventListener('my-event', this.eventListener);
    }
  }
}
```

### 3. **Struttura Payload Consistente**
```typescript
// ✅ Payload strutturato
{
  detail: {
    type: 'user-action',
    payload: { userId: 123, action: 'login' },
    timestamp: Date.now(),
    source: 'auth-component'
  }
}
```

### 4. **Error Handling**
```typescript
onInit() {
  document.addEventListener('kimu:data-request', (e: CustomEvent) => {
    try {
      this.handleDataRequest(e.detail);
    } catch (error) {
      console.error('Error handling data request:', error);
      // Invia evento di errore
      document.dispatchEvent(new CustomEvent('kimu:error', {
        detail: { error: error.message, source: 'data-handler' }
      }));
    }
  });
}
```

## 🔗 Pattern Avanzati

### Hub di Comunicazione Centralizzato

```typescript
@KimuComponent({
  tag: 'message-hub',
  name: 'Hub Messaggi',
  internal: true // Nascosto all'utente
})
export class MessageHub extends KimuComponentElement {
  private subscribers = new Map<string, Function[]>();

  onInit() {
    // Registra l'hub globalmente
    (window as any).kimuMessageHub = this;
  }

  subscribe(eventType: string, callback: Function) {
    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, []);
    }
    this.subscribers.get(eventType)!.push(callback);
  }

  unsubscribe(eventType: string, callback: Function) {
    const callbacks = this.subscribers.get(eventType);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  publish(eventType: string, data: any) {
    const callbacks = this.subscribers.get(eventType);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }

  getData() {
    return {
      activeSubscriptions: Array.from(this.subscribers.keys()),
      totalSubscribers: Array.from(this.subscribers.values())
        .reduce((sum, arr) => sum + arr.length, 0)
    };
  }
}
```

## 📚 Prossimi Passi

- **[Template Avanzati](./templates.md)** - UI complesse per comunicazioni
- **[Ciclo di Vita](./lifecycle.md)** - Gestire comunicazioni nel lifecycle
- **[Best Practices](./best-practices.md)** - Pattern scalabili e manutenibili
