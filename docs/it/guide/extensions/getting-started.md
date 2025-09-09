# Inizia Subito

Questa guida ti accompagnerà nella creazione della tua prima estensione KIMU, passo dopo passo.

## 🧩 Struttura di una Estensione

Ogni estensione è una cartella dentro `src/extensions/` con almeno questi file:

```
extensions/
  my-extension/
    component.ts      # Logica, metadata, controller
    view.html         # Template UI
    style.css         # Stili
```

### File Richiesti

| File | Descrizione | Obbligatorio |
|------|-------------|:------------:|
| `component.ts` | Classe principale con metadata e logica | ✅ |
| `view.html` | Template HTML dell'interfaccia | ✅ |
| `style.css` | Fogli di stile personalizzati | ❌ |

## 🚀 Il Tuo Primo "Hello World"

Creiamo insieme una semplice estensione per capire i concetti base.

### 1. Crea la Cartella

```bash
mkdir src/extensions/hello-world
```

### 2. Component TypeScript (`component.ts`)

```typescript
import { KimuComponent } from '../../core/kimu-component';
import { KimuComponentElement } from '../../core/kimu-component-element';

@KimuComponent({
  tag: 'hello-world',           // Tag HTML univoco (obbligatorio)
  name: 'Hello World',          // Nome descrittivo
  version: '1.0.0',            // Versione semantica
  description: 'La mia prima estensione KIMU',
  icon: '👋',                  // Icona emoji
  author: 'Il tuo nome',       // Autore
  path: 'hello-world',         // Path della cartella
  internal: false              // false = visibile agli utenti
})
export class HelloWorld extends KimuComponentElement {
  
  // Metodo principale: espone dati e handler al template
  getData() {
    return {
      message: 'Ciao Mondo da KIMU!',
      timestamp: new Date().toLocaleString()
    };
  }

  // Hook del ciclo di vita (opzionale)
  onInit(): void {
    console.log('Estensione Hello World inizializzata');
  }
}
```

### 3. Template HTML (`view.html`)

```html
<div class="hello-container">
  <h2>🚀 ${message}</h2>
  <p>Creato il: ${timestamp}</p>
</div>
```

### 4. Stili CSS (`style.css`)

```css
.hello-container {
  padding: 2rem;
  text-align: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

.hello-container h2 {
  margin: 0 0 1rem 0;
  font-size: 1.5rem;
}
```

## 🎯 Testare l'Estensione

1. **Salva tutti i file** nella cartella `src/extensions/hello-world/`
2. **Riavvia il server** di sviluppo:
   ```bash
   npm run dev
   ```
3. **Apri l'app** e cerca "Hello World" nella lista delle estensioni
4. **Aggiungi l'estensione** al layout—dovresti vedere il tuo messaggio!

## 🔍 Cosa Succede Sotto?

1. **Registrazione:** Il decorator `@KimuComponent` registra automaticamente l'estensione
2. **Compilazione:** KIMU compila l'estensione in un Web Component standard
3. **Rendering:** Il metodo `getData()` fornisce i dati al template `view.html`
4. **Stile:** Il CSS viene incapsulato nel Shadow DOM dell'estensione

## ✨ Prossimi Passi

Ora che hai creato la tua prima estensione, puoi:

- **[Approfondire l'anatomia](./anatomy.md)** per capire meglio i componenti
- **[Scoprire i pattern](./patterns.md)** per diversi tipi di estensioni  
- **[Imparare la comunicazione](./communication.md)** tra estensioni
- **[Esplorare template avanzati](./templates.md)** per UI più complesse

## 🎉 Congratulazioni!


Hai appena creato la tua prima estensione KIMU! 🚀

Il prossimo passo è esplorare l'[anatomia dettagliata](./anatomy.md) per capire meglio ogni componente.

---

## 🔗 Inclusione di Estensioni Figlie (Composite Extensions)

Se vuoi che la tua estensione "padre" includa e utilizzi altre estensioni come componenti, puoi sfruttare il metadata `dependencies` nel decorator `@KimuComponent`.

**Come funziona:**
- Nel campo `dependencies` inserisci i tag HTML delle estensioni figlie che vuoi includere.
- Queste estensioni verranno caricate automaticamente e saranno disponibili nel template HTML come tag custom.

**Esempio pratico:**
```typescript
@KimuComponent({
  tag: 'dashboard-parent',
  name: 'Dashboard Completa',
  version: '1.0.0',
  dependencies: ['chart-widget', 'data-table', 'filter-panel'] // Estensioni figlie
})
export class DashboardParent extends KimuComponentElement {
  // Logica del componente padre
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
- Modularità e riutilizzo
- Aggiornamenti separati per ogni modulo
- Caricamento automatico delle dipendenze

**Best practice:**
- Includi solo le dipendenze effettivamente necessarie
- Documenta sempre il ruolo di ogni estensione figlia
- Usa nomi di tag descrittivi per le dipendenze
