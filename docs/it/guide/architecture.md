# Architettura

KIMU-CORE è progettato per essere leggero, modulare e altamente estensibile.
Questa sezione descrive la struttura interna, i componenti principali e come interagiscono per offrire un framework UI minimale ma potente.

## 📁 Struttura del Progetto

```
src/
  core/
    kimu-app.ts
    kimu-component.ts
    kimu-component-element.ts
    kimu-engine.ts
    kimu-render.ts
    kimu-asset-manager.ts
    kimu-extension-manager.ts
    kimu-store.ts
    kimu-types.ts
  extensions/
    extensions-manifest.json
    kimu-app/
      component.ts
      view.html
      style.css
  config/
  assets/
  index.html
  main.ts
```

## 🧩 Componenti Principali

- **KimuComponentElement**  
  La classe base per tutti i componenti. Fornisce ciclo di vita, rendering e gestione dello stato.

- **KimuComponent (decoratore)**  
  Usato per definire i metadati di componenti ed estensioni (tag, nome, versione, ecc.).
