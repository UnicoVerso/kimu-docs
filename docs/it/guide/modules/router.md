# Modulo Router

Il modulo **Router** di KIMU-Core permette di gestire la navigazione tra diverse pagine o componenti all'interno di un'applicazione single-page (SPA) in modo semplice e modulare.

## Cos'è il Router?
Il Router è un modulo che consente di:
- Definire percorsi (route) associati a componenti o estensioni
- Gestire la navigazione tramite URL senza ricaricare la pagina
- Ascoltare i cambi di percorso e reagire dinamicamente

## Quando usarlo
Utilizza il Router quando vuoi:
- Creare un'applicazione con più viste o sezioni
- Gestire la navigazione tra estensioni o componenti
- Implementare una SPA (Single Page Application)

## Caratteristiche principali
- Configurazione centralizzata delle route
- Supporto per la navigazione tramite History API
- Callback su cambio route
- Possibilità di registrare route dinamicamente

## API Principali

### Configurazione delle route
```typescript
import KimuRouterModule from 'src/modules/router/module';
import { HomeComponent } from 'src/extensions/home/component';
import { ChatComponent } from 'src/extensions/chat/component';

const routerModule = new KimuRouterModule('router', '1.0.0', {
  routes: [
    { path: '/', component: HomeComponent },
    { path: '/chat', component: ChatComponent }
  ]
});
const router = routerModule.getService();
```

### Ascoltare i cambi di route
```typescript
router.onRouteChange((route) => {
  if (route && route.component) {
    mountKimuComponent(route.component, '#main');
  } else {
    showNotFound();
  }
});
```

### Navigare da codice
```typescript
router.navigate('/chat');
```

### Aggiungere una nuova route a runtime
```typescript
router.registerRoute({ path: '/about', component: AboutComponent });
```

## Esempio completo
```typescript
// Configurazione
const routerModule = new KimuRouterModule('router', '1.0.0', {
  routes: [
    { path: '/', component: HomeComponent },
    { path: '/chat', component: ChatComponent }
  ]
});
const router = routerModule.getService();

// Monta il componente corretto quando cambia la route
router.onRouteChange((route) => {
  if (route && route.component) {
    mountKimuComponent(route.component, '#main');
  }
});

// Navigazione da menu
function vaiAllaChat() {
  router.navigate('/chat');
}
```

## Best practice
- Registra tutte le route principali all'avvio dell'applicazione
- Usa il router per separare la logica di navigazione dalla logica di rendering
- Per route dinamiche o parametri, estendi il modulo secondo le tue esigenze

## Vantaggi
- Decoupling tra navigazione e UI
- Facilità di estensione
- Integrazione nativa con le estensioni KIMU

## Risorse utili
- [Esempio di utilizzo del router](../examples/router-example.md)
- [Documentazione API KimuRouterService](../../framework/modules/router)
