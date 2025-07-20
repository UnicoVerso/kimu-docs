# 🔄 Ciclo di Vita dei Componenti in KIMU-CORE

Comprendere il ciclo di vita di un componente è essenziale per costruire estensioni e UI robuste e manutenibili in KIMU-CORE.

## Fasi del Ciclo di Vita

1. **Creazione**
   - Il componente viene istanziato e viene chiamato il suo costruttore.
   - Vengono impostate le proprietà e lo stato iniziali.

2. **Inizializzazione**
   - Vengono attivati gli hook di ciclo di vita (es. `onInit`, `connectedCallback`).
   - Il componente è registrato e pronto a interagire con il sistema.

3. **Rendering**
   - Il template del componente viene renderizzato nel DOM.
   - Vengono applicati dati dinamici e binding.

4. **Aggiornamento**
   - Quando stato o proprietà cambiano, il componente esegue il re-render o aggiorna solo le parti interessate.
   - Possono essere chiamati hook come `onUpdate` o `attributeChangedCallback`.

5. **Distruzione**
   - Quando il componente viene rimosso dal DOM, vengono chiamati hook di cleanup (es. `onDestroy`, `disconnectedCallback`).
   - Risorse, listener e timer vengono rilasciati.

## Esempio di Hook del Ciclo di Vita

```typescript
class MyComponent extends KimuComponentElement {
  constructor() {
    super();
    // Logica di inizializzazione
  }

  connectedCallback() {
    super.connectedCallback();
    // Chiamato quando aggiunto al DOM
