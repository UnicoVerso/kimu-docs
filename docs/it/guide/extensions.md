# Estensioni

KIMU-CORE è costruito attorno ai concetti di modularità ed estensibilità. Le estensioni sono il cuore della personalizzazione, dell'espansione e dell'evoluzione della tua applicazione—senza mai toccare il codice core.

## 🚀 Perché le Estensioni?

- **Modularità:** Ogni funzionalità, elemento UI o blocco logico può essere un'estensione. Aggiungi solo ciò che ti serve, mantenendo l'app leggera e focalizzata.
- **Caricamento a runtime:** Le estensioni possono essere caricate, aggiornate o rimosse anche a runtime—senza dover ricostruire o ridistribuire il core.
- **Web Component puro:** Ogni estensione, una volta compilata, diventa uno standard Web Component, compatibile con qualsiasi browser moderno e framework. Puoi riutilizzare le estensioni anche fuori da KIMU-CORE.
- **Struttura MVC:** Chiara separazione tra:
  - **Model:** logica e stato (`component.ts`)
  - **View:** template UI (`view.html`)
  - **Controller:** logica di ciclo di vita e interazione (`component.ts`)
  - **Style:** CSS personalizzato (`style.css`)
- **Scalabilità:** Puoi costruire qualsiasi cosa, da un semplice bottone a un'app completa come estensione.
- **Community & condivisione:** Le estensioni possono essere pacchettizzate, condivise e riutilizzate tra progetti e team.
- **Isolamento:** Ogni estensione gira nel proprio scope, evitando conflitti e facilitando la manutenzione.
- **Sicurezza:** L'isolamento riduce i rischi di collisione e vulnerabilità.
- **Didattica & Embedded:** La natura leggera e modulare rende KIMU-CORE ideale per progetti educativi, prototipazione rapida e applicazioni embedded.

## 🧩 Struttura di una Estensione
Ogni estensione è una cartella dentro `src/extensions/` con almeno questi file:

```
extensions/
  my-extension/
    component.ts      # Logica, metadata, controller
    view.html         # Template UI
    style.css         # Stili
```

### Esempio: Estensione Hello World

**component.ts**
```typescript
import { KimuComponent } from '../../core/kimu-component';
import { KimuComponentElement } from '../../core/kimu-component-element';
