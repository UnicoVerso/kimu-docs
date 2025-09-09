# Pattern di Sviluppo

I pattern di sviluppo ti aiutano a strutturare le estensioni secondo modelli consolidati e riutilizzabili.

## 🎭 Pattern Comuni

### **Pattern 1: Estensione Statica (Informativa)**

Ideale per contenuti che non cambiano durante l'esecuzione.

```typescript
@KimuComponent({
  tag: 'info-card',
  name: 'Scheda Informativa',
  description: 'Mostra informazioni statiche',
  icon: 'ℹ️'
})
export class InfoCard extends KimuComponentElement {
  getData() {
    return {
      title: 'Informazioni Sistema',
      content: 'Versione KIMU attiva',
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

**Quando usare:**
- Widget informativi
- Documentazione embedded
- Crediti e informazioni
- Dashboard con dati costanti

---

### **Pattern 2: Estensione Interattiva (Stateful)**

Per estensioni con stato interno e interazione utente.

```typescript
@KimuComponent({
  tag: 'interactive-counter',
  name: 'Contatore Interattivo',
  description: 'Contatore con controlli utente',
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
      history: this.history.slice(-5), // Ultimi 5 valori
      
      // Azioni dell'utente
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
      this.history.shift(); // Mantieni solo gli ultimi 10
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
    <small>Storia: ${history.join(', ')}</small>
  </div>
</div>
```

**Quando usare:**
- Widget con controlli utente
- Form e input
- Calcolatrici
- Configuratori

---

### **Pattern 3: Estensione con Timer (Dinamica)**

Per contenuti che si aggiornano automaticamente nel tempo.

```typescript
@KimuComponent({
  tag: 'live-clock',
  name: 'Orologio Live',
  description: 'Mostra data e ora in tempo reale',
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
        ? this.currentTime.toLocaleTimeString('it-IT', { hour12: false })
        : this.currentTime.toLocaleTimeString('it-IT', { hour12: true }),
      dateString: this.currentTime.toLocaleDateString('it-IT', {
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
    <small>${format24h ? '24h' : '12h'} - Click per cambiare</small>
  </div>
</div>
```

**Quando usare:**
- Orologi e timer
- Monitor di sistema
- Feed live
- Aggiornamenti automatici

---

### **Pattern 4: Estensione con Risorse Esterne**

Per estensioni che caricano dati da API o servizi esterni.

```typescript
@KimuComponent({
  tag: 'weather-widget',
  name: 'Meteo',
  description: 'Mostra informazioni meteo attuali',
  icon: '🌤️'
})
export class WeatherWidget extends KimuComponentElement {
  private weatherData: any = null;
  private loading = false;
  private error = '';
  private city = 'Roma';

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
      // Simulazione API call (sostituisci con API reale)
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${this.city}&appid=YOUR_API_KEY&units=metric&lang=it`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      this.weatherData = await response.json();
    } catch (err) {
      this.error = `Errore nel caricamento dei dati meteo: ${err.message}`;
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
    <input type="text" value="${city}" @input=${onCityChange} placeholder="Inserisci città">
    <button type="submit" ?disabled=${loading}>🔍</button>
  </form>

  ${loading ? `
    <div class="loading">Caricamento...</div>
  ` : error ? `
    <div class="error">${error}</div>
  ` : hasData ? `
    <div class="weather-info">
      <h3>${weatherData.name}</h3>
      <div class="temp">${Math.round(weatherData.main.temp)}°C</div>
      <div class="description">${weatherData.weather[0].description}</div>
      <div class="details">
        Umidità: ${weatherData.main.humidity}% | 
        Vento: ${weatherData.wind.speed} m/s
      </div>
    </div>
  ` : `
    <div class="no-data">Nessun dato disponibile</div>
  `}

  <button @click=${onRefresh} ?disabled=${loading} class="refresh-btn">
    ${loading ? 'Aggiornamento...' : 'Aggiorna'}
  </button>
</div>
```

**Quando usare:**
- Widget con dati da API
- Feed RSS/JSON
- Integrazioni servizi
- Dashboard con dati esterni

## 🎯 Scegliere il Pattern Giusto

| Tipo Estensione | Pattern | Caratteristiche |
|------------------|---------|-----------------|
| **Informativa** | Statica | Nessun stato, contenuto fisso |
| **Interattiva** | Stateful | Stato interno, azioni utente |
| **Dinamica** | Timer | Aggiornamenti automatici |
| **Connessa** | API/Esterni | Dati da fonti esterne |

## 📚 Prossimi Passi

---

## 🔗 Pattern: Estensione Composita (Padre con Estensioni Figlie)

Se vuoi creare un'estensione che includa altre estensioni come componenti, usa il metadata `dependencies` nel decorator `@KimuComponent`.

**Come funziona:**
- Nel campo `dependencies` inserisci i tag HTML delle estensioni figlie.
- Queste verranno caricate automaticamente e saranno disponibili nel template HTML come tag custom.

**Esempio pratico:**
```typescript
@KimuComponent({
  tag: 'dashboard-parent',
  name: 'Dashboard Completa',
  version: '1.0.0',
  dependencies: ['chart-widget', 'data-table', 'filter-panel']
})
export class DashboardParent extends KimuComponentElement {
  // Logica del componente padre
}
```

Nel template `view.html`:
```html
<div class="dashboard">
  <h2>Dashboard Interattiva</h2>
  <chart-widget data="${chartData}"></chart-widget>
  <data-table items="${tableItems}"></data-table>
  <filter-panel @filter="${onFilter}"></filter-panel>
</div>
```

**Vantaggi:**
- Modularità e riutilizzo
- Aggiornamenti separati per ogni modulo
- Caricamento automatico delle dipendenze

**Best practice:**
- Includi solo le dipendenze effettivamente necessarie
- Documenta sempre il ruolo di ogni estensione figlia
- Usa nomi di tag descrittivi per le dipendenze
