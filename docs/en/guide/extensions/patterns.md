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

**Template (`view.html`):**
```html
<div class="info-card">
  <h3>${title}</h3>
  <p>${content}</p>
  <div class="metadata">
    <span>v${version}</span>
    <span>${buildDate}</span>
  </div>
</div>
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
  private history: number[] = [];

  getData() {
    return {
      count: this.count,
      step: this.step,
      history: this.history.slice(-5), // Last 5 values
      
      // User actions
      increment: () => {
        this.addToHistory(this.count);
        this.count += this.step;
        this.refresh();
      },
      
      decrement: () => {
        this.addToHistory(this.count);
        this.count -= this.step;
        this.refresh();
      },
      
      reset: () => {
        this.addToHistory(this.count);
        this.count = 0;
        this.refresh();
      },
      
      setStep: (event: Event) => {
        const input = event.target as HTMLInputElement;
        this.step = parseInt(input.value) || 1;
        this.refresh();
      }
    };
  }

  private addToHistory(value: number) {
    this.history.push(value);
    if (this.history.length > 10) {
      this.history.shift(); // Keep only last 10
    }
  }
}
```

**Template (`view.html`):**
```html
<div class="counter-widget">
  <div class="display">
    <h2>${count}</h2>
  </div>
  
  <div class="controls">
    <button @click=${decrement}>-${step}</button>
    <input type="number" value="${step}" @change=${setStep} min="1" max="100">
    <button @click=${increment}>+${step}</button>
  </div>
  
  <button @click=${reset} class="reset-btn">Reset</button>
  
  <div class="history">
    <small>History: ${history.join(', ')}</small>
  </div>
</div>
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
  private format24h = true;

  getData() {
    return {
      currentTime: this.currentTime.toISOString(),
      timeString: this.format24h 
        ? this.currentTime.toLocaleTimeString('en-US', { hour12: false })
        : this.currentTime.toLocaleTimeString('en-US', { hour12: true }),
      dateString: this.currentTime.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      format24h: this.format24h,
      
      toggleFormat: () => {
        this.format24h = !this.format24h;
        this.refresh();
      }
    };
  }

  onInit(): void {
    this.updateTime();
    this.intervalId = window.setInterval(() => {
      this.updateTime();
    }, 1000);
  }

  onDestroy(): void {
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

**Template (`view.html`):**
```html
<div class="clock-widget">
  <div class="time-display" @click=${toggleFormat}>
    <div class="time">${timeString}</div>
    <div class="date">${dateString}</div>
  </div>
  <div class="format-info">
    <small>${format24h ? '24h' : '12h'} - Click to change</small>
  </div>
</div>
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
  tag: 'weather-widget',
  name: 'Weather',
  description: 'Shows current weather information',
  icon: '�️'
})
export class WeatherWidget extends KimuComponentElement {
  private weatherData: any = null;
  private loading = false;
  private error = '';
  private city = 'London';

  getData() {
    return {
      weatherData: this.weatherData,
      loading: this.loading,
      error: this.error,
      city: this.city,
      hasData: !!this.weatherData,
      
      onRefresh: async () => {
        await this.loadWeatherData();
      },
      
      onCityChange: (event: Event) => {
        const input = event.target as HTMLInputElement;
        this.city = input.value;
      },
      
      onCitySubmit: async (event: Event) => {
        event.preventDefault();
        await this.loadWeatherData();
      }
    };
  }

  async onInit() {
    await this.loadWeatherData();
  }

  private async loadWeatherData() {
    this.loading = true;
    this.error = '';
    this.refresh();

    try {
      // API call simulation (replace with real API)
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${this.city}&appid=YOUR_API_KEY&units=metric&lang=en`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      this.weatherData = await response.json();
    } catch (err) {
      this.error = `Error loading weather data: ${err.message}`;
      console.error('Weather API error:', err);
    } finally {
      this.loading = false;
      this.refresh();
    }
  }
}
```

**Template (`view.html`):**
```html
<div class="weather-widget">
  <form @submit=${onCitySubmit} class="city-form">
    <input type="text" value="${city}" @input=${onCityChange} placeholder="Enter city">
    <button type="submit" ?disabled=${loading}>🔍</button>
  </form>

  ${loading ? `
    <div class="loading">Loading...</div>
  ` : error ? `
    <div class="error">${error}</div>
  ` : hasData ? `
    <div class="weather-info">
      <h3>${weatherData.name}</h3>
      <div class="temp">${Math.round(weatherData.main.temp)}°C</div>
      <div class="description">${weatherData.weather[0].description}</div>
      <div class="details">
        Humidity: ${weatherData.main.humidity}% | 
        Wind: ${weatherData.wind.speed} m/s
      </div>
    </div>
  ` : `
    <div class="no-data">No data available</div>
  `}

  <button @click=${onRefresh} ?disabled=${loading} class="refresh-btn">
    ${loading ? 'Updating...' : 'Refresh'}
  </button>
</div>
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

---

## 🔗 Pattern: Composite Extension (Parent with Child Extensions)

If you want to create an extension that includes other extensions as components, use the `dependencies` metadata in the `@KimuComponent` decorator.

**How it works:**
- In the `dependencies` field, add the HTML tags of the child extensions.
- These will be automatically loaded and available in the HTML template as custom tags.

**Practical example:**
```typescript
@KimuComponent({
  tag: 'dashboard-parent',
  name: 'Complete Dashboard',
  version: '1.0.0',
  dependencies: ['chart-widget', 'data-table', 'filter-panel']
})
export class DashboardParent extends KimuComponentElement {
  // Parent component logic
}
```

In the `view.html` template:
```html
<div class="dashboard">
  <h2>Interactive Dashboard</h2>
  <chart-widget data="${chartData}"></chart-widget>
  <data-table items="${tableItems}"></data-table>
  <filter-panel @filter="${onFilter}"></filter-panel>
</div>
```

**Advantages:**
- Modularity and reusability
- Separate updates for each module
- Automatic loading of dependencies

**Best practices:**
- Include only necessary dependencies
- Always document the role of each child extension
- Use descriptive tag names for dependencies
