# 🚀 Inizia con KIMU Core

Benvenuto in **KIMU – Keep It Minimal UI Framework**!  

Questa guida ti accompagnerà nei passaggi fondamentali per scaricare, installare ed eseguire il core-framework per la prima volta.

## 🔧 Prerequisiti

Prima di iniziare, assicurati di avere installato sul tuo sistema i seguenti strumenti:

- [**Git**](https://git-scm.com/) – per clonare il repository e gestire le versioni del codice  
  Consigliato: versione ≥ 2.30

- [**Node.js**](https://nodejs.org/) – per installare ed eseguire le dipendenze del progetto  
  Consigliato: versione **LTS** (≥ 18.x)  
  Include anche `npm`, il gestore pacchetti di Node.js

- [**TypeScript**](https://www.typescriptlang.org/) – necessario per compilare i file `.ts`  
  Installa localmente con:
  ```bash
  npm install --save-dev typescript
  ```
  Oppure installa globalmente con:
  ```bash
  npm install -g typescript
  ```

- (Opzionale) [**Python 3.x**](https://www.python.org/downloads/) – usato per lo script `py-server` per servire rapidamente i file statici dalla cartella `dist`:
  ```bash
  python3 -m http.server 5173 --directory ./dist
  ```
  
💡 Puoi verificare l'installazione eseguendo:
```bash
git --version
node -v
npm -v
```
Se uno di questi comandi fallisce, installa lo strumento corrispondente dai link sopra prima di continuare.

---

## 🏗️ Come creare un nuovo progetto con KIMU Core

Questa sezione ti guida passo-passo nella creazione di un nuovo progetto che utilizza **KIMU Core** come framework, ideale per chi vuole partire da zero e sviluppare estensioni personalizzate.

### 1. Struttura consigliata del progetto

Organizza il tuo progetto come segue:

```text
my-kimu-app/
  src/
    core/         # (opzionale) Override o estensioni core
    extensions/   # Le tue estensioni personalizzate
    utils/        # Utility
    models/       # Modelli dati
  tests/          # Test
  scripts/        # Script CLI
  docs/           # Documentazione
  dist/           # Build di produzione
  package.json
  tsconfig.json
  README.md
```

### 2. Inizializza il progetto e installa KIMU Core

```bash
git clone https://github.com/UnicoVerso/kimu-core.git
# oppure, se disponibile su npm:
# npm install kimu-core

cd my-kimu-app
npm init -y
npm install --save-dev typescript
# Copia/crea un tsconfig.json adatto (puoi ispirarti a quello di kimu-core)
```

### 3. Crea la tua prima estensione

1. Crea una cartella in `src/extensions/hello-world/`
2. All'interno crea questi file:
   - `component.ts` (logica principale)
   - `style.css` (stili)
   - `view.html` (template UI)

Esempio di `component.ts`:

```typescript
import { KimuComponent } from 'kimu-core/src/core/kimu-component';
import { KimuComponentElement } from 'kimu-core/src/core/kimu-component-element';

@KimuComponent({
  tag: 'hello-world',
  name: 'Hello World',
  version: '1.0.0',
  description: 'Minimal example extension',
  author: 'YourName',
  icon: '👋',
  internal: false,
  path: 'hello-world',
  dependencies: []
})
export class HelloWorldComponent extends KimuComponentElement {
  onInit() {
    console.log('Hello World extension loaded!');
  }
}
```

### 4. Registra l’estensione

Aggiungi la tua estensione nel file `extension-manifest.json` alla radice del progetto, ad esempio:

```json
[
  {
    "tag": "hello-world",
    "name": "Hello World",
    "version": "1.0.0",
    "description": "Minimal example extension",
    "author": "YourName",
    "icon": "👋",
    "internal": false,
    "path": "hello-world",
    "dependencies": []
  }
]
```

### 5. Best practice e checklist

- Segui le convenzioni di stile e struttura di KIMU Core
- Scrivi codice modulare e documentato
- Usa solo le API pubbliche di KIMU Core
- Aggiungi test in `/tests` e aggiorna la documentazione in `/docs`
- Consulta sempre la documentazione ufficiale e aggiorna la tua se aggiungi nuove funzionalità

---
