# Development Patterns

Development patterns help you structure extensions according to proven and reusable models.

## 🎭 Common Patterns

### **Pattern 1: Static Extension (Informational)**

Ideal for content that doesn't change during execution.

```typescript
@KimuComponent({
  tag: 'info-card',
  name: 'Info Card',
  description: 'Displays static information',
  icon: 'ℹ️'
})
export class InfoCard extends KimuComponentElement {
  getData() {
    return {
      title: 'System Information',
      content: 'Active KIMU version',
      version: '2.1.0',
      buildDate: '2024-01-15'
    };
  }
}
```

**When to use:**
- Informational widgets
- Embedded documentation
- Credits and information
- Dashboards with constant data

---

### **Pattern 2: Interactive Extension (Stateful)**

For extensions with internal state and user interaction.

```typescript
@KimuComponent({
  tag: 'interactive-counter',
  name: 'Interactive Counter',
  description: 'Counter with user controls',
  icon: '🔢'
})
export class InteractiveCounter extends KimuComponentElement {
  private count = 0;
  private step = 1;

  getData() {
    return {
      count: this.count,
      step: this.step,
      
      // User actions
      increment: () => {
        this.count += this.step;
        this.refresh();
      },
      
      decrement: () => {
        this.count -= this.step;
        this.refresh();
      },
      
      reset: () => {
        this.count = 0;
        this.refresh();
      }
    };
  }
}
```

**When to use:**
- Widgets with user controls
- Forms and inputs
- Calculators
- Configurators

---

### **Pattern 3: Timer Extension (Dynamic)**

For content that updates automatically over time.

```typescript
@KimuComponent({
  tag: 'live-clock',
  name: 'Live Clock',
  description: 'Shows real-time date and time',
  icon: '🕐'
})
export class LiveClock extends KimuComponentElement {
  private currentTime = new Date();
  private intervalId?: number;

  getData() {
    return {
      timeString: this.currentTime.toLocaleTimeString(),
      dateString: this.currentTime.toLocaleDateString()
    };
  }

  onInit(): void {
    this.updateTime();
    this.intervalId = window.setInterval(() => {
      this.updateTime();
    }, 1000);
  }

  onDispose(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private updateTime() {
    this.currentTime = new Date();
    this.refresh();
  }
}
```

**When to use:**
- Clocks and timers
- System monitors
- Live feeds
- Automatic updates

---

### **Pattern 4: External Resources Extension**

For extensions that load data from APIs or external services.

```typescript
@KimuComponent({
  tag: 'data-fetcher',
  name: 'Data Fetcher',
  description: 'Loads external data',
  icon: '🌐'
})
export class DataFetcher extends KimuComponentElement {
  private data: any[] = [];
  private loading = false;
  private error = '';

  getData() {
    return {
      data: this.data,
      loading: this.loading,
      error: this.error,
      hasData: this.data.length > 0,
      
      onLoadData: async () => {
        await this.loadExternalData();
      }
    };
  }

  async onInit() {
    await this.loadExternalData();
  }

  private async loadExternalData() {
    this.loading = true;
    this.error = '';
    this.refresh();

    try {
      const response = await fetch('https://api.example.com/data');
      this.data = await response.json();
    } catch (err) {
      this.error = 'Error loading data';
      console.error('Fetch error:', err);
    } finally {
      this.loading = false;
      this.refresh();
    }
  }
}
```

**When to use:**
- API data widgets
- RSS/JSON feeds
- Service integrations
- External data dashboards

## 🎯 Choosing the Right Pattern

| Extension Type | Pattern | Characteristics |
|----------------|---------|-----------------|
| **Informational** | Static | No state, fixed content |
| **Interactive** | Stateful | Internal state, user actions |
| **Dynamic** | Timer | Automatic updates |
| **Connected** | API/External | Data from external sources |

## 📚 Next Steps

- **[Communication](./communication.md)** - Make extensions communicate
- **[Advanced Templates](./templates.md)** - Complex and dynamic UIs
- **[Lifecycle](./lifecycle.md)** - Advanced lifecycle management
