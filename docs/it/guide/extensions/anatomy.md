# Anatomia di un'Estensione

Approfondiamo i componenti fondamentali che costituiscono un'estensione KIMU.

## 🔧 I Tre Pilastri

Ogni estensione KIMU è composta da tre elementi principali:

1. **Decorator `@KimuComponent`** - Metadati e configurazione
2. **Classe Component** - Logica, stato e ciclo di vita
3. **Template HTML** - Interfaccia utente dinamica

## 1. 📋 Decorator @KimuComponent

Il decorator è il cuore della configurazione. Definisce tutti i metadati dell'estensione:

```typescript
@KimuComponent({
  tag: 'my-extension',          // ✅ Obbligatorio: nome univoco Web Component
  name: 'My Extension',         // ✅ Nome per UI
  version: '1.0.0',           // ✅ Versioning semantico
  description: 'Descrizione',  // Descrizione funzionalità
  icon: '🎯',                  // Icona emoji/unicode
  author: 'Sviluppatore',      // Autore o team
  path: 'my-extension',        // Path cartella (default: tag)
  internal: false,             // true = sistema, false = utente
  kimuVersion: '1.0.0',       // Versione KIMU richiesta
  dependencies: ['child-ext-1', 'child-ext-2'] // Tag delle estensioni figlie
})
```

### Proprietà del Decorator

| Proprietà | Tipo | Obbligatorio | Descrizione |
|-----------|------|:------------:|-------------|
| `tag` | `string` | ✅ | Nome univoco Web Component (kebab-case) |
| `name` | `string` | ✅ | Nome descrittivo per l'interfaccia |
| `version` | `string` | ✅ | Versione semantica (es. "1.2.3") |
| `description` | `string` | ❌ | Descrizione della funzionalità |
| `icon` | `string` | ❌ | Icona emoji o unicode |
| `author` | `string` | ❌ | Autore o team di sviluppo |
| `path` | `string` | ❌ | Path della cartella (default: tag) |
| `internal` | `boolean` | ❌ | Se `true`, nascosta agli utenti |
| `kimuVersion` | `string` | ❌ | Versione minima di KIMU richiesta |
| `dependencies` | `string[]` | ❌ | Array dei tag delle estensioni figlie |

### 🔗 Metadata Dependencies

Il metadata `dependencies` è fondamentale per gestire estensioni composte. È un array di stringhe che contiene i tag delle estensioni figlie contenute nell'estensione di riferimento.

**Come funziona:**
- Se la tua estensione è "padre" e contiene altre estensioni come componenti, specifica i loro tag nel campo `dependencies`
- Le estensioni figlie verranno automaticamente caricate e rese disponibili nel template HTML `view.html`
- Puoi utilizzare le estensioni figlie come normali tag HTML all'interno del tuo template

**Esempio pratico:**
```typescript
@KimuComponent({
  tag: 'dashboard-parent',
  name: 'Dashboard Completa',
  version: '1.0.0',
  dependencies: ['chart-widget', 'data-table', 'filter-panel'] // Estensioni figlie
})
export class DashboardParent extends KimuComponentElement {
  // La logica del componente padre
}
```

Nel template `view.html`:
```html
<div class="dashboard">
  <h2>Dashboard Interattiva</h2>
  
  <!-- Utilizzo delle estensioni figlie come tag HTML -->
  <chart-widget data="${chartData}"></chart-widget>
  <data-table items="${tableItems}"></data-table>
  <filter-panel @filter="${onFilter}"></filter-panel>
</div>
```

**Vantaggi:**
- ✅ Modularietà: ogni componente è indipendente
- ✅ Riutilizzo: le estensioni figlie possono essere usate in altri contesti
- ✅ Manutenibilità: aggiornamenti separati per ogni modulo
- ✅ Caricamento automatico: non devi gestire manualmente le dipendenze

**Best practice:**
- Includi solo le dipendenze effettivamente necessarie
- Documenta sempre il ruolo di ogni estensione figlia
- Usa nomi di tag descrittivi per le dipendenze
| `dependencies` | `string[]` | ❌ | Array dei tag delle estensioni figlie |

## 2. 🎯 Classe Component: Logica e Stato

La classe component gestisce la logica dell'estensione:

```typescript
export class MyExtension extends KimuComponentElement {
  
  // 🔐 Stato privato dell'estensione
  private counter = 0;
  private isActive = true;
  private timer?: number;

  // 📊 Metodo principale: collega dati al template
  getData() {
    return {
      // Dati semplici
      counter: this.counter,
      isActive: this.isActive,
      
      // Dati computati
      doubleCounter: this.counter * 2,
      statusMessage: this.isActive ? 'Attivo' : 'Inattivo',
      
      // Event handlers
      onIncrement: () => {
        this.counter++;
        this.refresh(); // Re-render dell'estensione
      },
      
      onToggle: () => {
        this.isActive = !this.isActive;
        this.refresh();
      },

      onReset: () => {
        this.counter = 0;
        this.refresh();
      }
    };
  }

  // 🔄 Hooks del ciclo di vita
  onInit(): void {
    // Eseguito quando l'estensione è caricata
    console.log('Estensione inizializzata');
    this.startTimer();
  }

  onRender(): void {
    // Eseguito dopo ogni render
    console.log('Estensione renderizzata');
  }

  onDestroy(): void {
    // Cleanup quando l'estensione viene rimossa
    console.log('Estensione rimossa');
    this.stopTimer();
  }

  // 🛠️ Metodi privati di utilità
  private startTimer(): void {
    this.timer = window.setInterval(() => {
      if (this.isActive) {
        this.counter++;
        this.refresh();
      }
    }, 1000);
  }

  private stopTimer(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = undefined;
    }
  }
}
```

### Metodi Fondamentali

| Metodo | Descrizione | Quando Chiamare |
|--------|-------------|-----------------|
| `getData()` | Espone dati e handler al template | ✅ Sempre richiesto |
| `refresh()` | Forza il re-render dell'estensione | Dopo cambi di stato |
| `onInit()` | Hook di inizializzazione | Setup iniziale |
| `onRender()` | Hook post-render | Manipolazione DOM |
| `onDestroy()` | Hook di cleanup | Pulizia risorse |

## 3. 🎨 Template HTML: UI Dinamica

Il template HTML definisce l'interfaccia utente con sintassi dinamica:

```html
<div class="extension-container">
  <!-- 📝 Interpolazione semplice -->
  <h3>${name}</h3>
  <p>Valore: ${counter}</p>
  
  <!-- 🎛️ Interpolazione con condizioni -->
  <div class="${isActive ? 'active' : 'inactive'}">
    Status: ${statusMessage}
  </div>
  
  <!-- 🔘 Event binding -->
  <button @click=${onIncrement}>Incrementa (${doubleCounter})</button>
  <button @click=${onToggle}>Toggle Status</button>
  <button @click=${onReset}>Reset</button>
  
  <!-- 🔀 Rendering condizionale -->
  ${isActive ? `
    <div class="active-content">
      <p>Contenuto attivo! Timer: ${counter}s</p>
    </div>
  ` : `
    <div class="inactive-content">
      <p>Contenuto in pausa</p>
    </div>
  `}
</div>
```

### Sintassi del Template

| Sintassi | Descrizione | Esempio |
|----------|-------------|---------|
| `${variable}` | Interpolazione semplice | `${message}` |
| `@click=${handler}` | Event binding | `@click=${onSave}` |
| `${condition ? 'a' : 'b'}` | Operatore ternario | `${active ? 'on' : 'off'}` |
| `${condition ? 'html' : ''}` | Rendering condizionale | `${show ? '<p>Visibile</p>' : ''}` |

## 🔗 Come Funziona Insieme

1. **Registrazione:** Il `@KimuComponent` registra l'estensione nel sistema
2. **Istanziazione:** KIMU crea un'istanza della classe quando richiesta
3. **Rendering:** Il template viene popolato con i dati di `getData()`
4. **Interazione:** Gli event handler gestiscono le azioni dell'utente
5. **Aggiornamento:** `refresh()` aggiorna l'interfaccia quando lo stato cambia

## 📚 Prossimi Passi

Ora che conosci l'anatomia di base, esplora:

- **[Pattern di Sviluppo](./patterns.md)** - Pattern comuni per diversi tipi di estensioni
- **[Template Avanzati](./templates.md)** - Tecniche avanzate per l'interfaccia
- **[Ciclo di Vita](./lifecycle.md)** - Gestione approfondita del lifecycle
