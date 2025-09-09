# Modulo Router

Il modulo **Router** di KIMU-Core permette di gestire la navigazione tra diverse pagine o componenti all'interno di un'applicazione single-page (SPA) in modo semplice e modulare.

## Cos'è il Router?
Il Router è un modulo che consente di:
- Definire percorsi (route) associati a componenti o estensioni
- Gestire la navigazione tramite URL senza ricaricare la pagina
- Ascoltare i cambi di percorso e reagire dinamicamente
- Gestire parametri dinamici e query string
- Proteggere route con controlli di autenticazione/autorizzazione
- Supportare transizioni, nested routing e base path

## Quando usarlo
Utilizza il Router quando vuoi:
- Creare un'applicazione con più viste o sezioni
- Gestire la navigazione tra estensioni o componenti
- Implementare una SPA (Single Page Application)
- Gestire routing avanzato con parametri, query, ruoli

## Caratteristiche principali
- Configurazione centralizzata delle route
- Supporto per hash-based routing e History API
- Parametri dinamici (`:id`, `:slug`)
- Route guards (autenticazione/autorizzazione)
- Navigazione programmata (`navigate`, `back`, `forward`, `replace`)
- Callback su cambio route
- Possibilità di registrare route dinamicamente
- Supporto per nested routing
- Gestione automatica del base path

## API Dettagliata
| Metodo | Descrizione |
|--------|-------------|
| `navigate(path)` | Naviga verso una route |
| `back()` | Torna indietro nella history |
| `forward()` | Avanza nella history |
| `replace(path)` | Sostituisce la route corrente |
| `addRoute(path, handler)` | Registra una nuova route |
| `removeRoute(path)` | Rimuove una route |
| `getCurrentRoute()` | Restituisce info sulla route attuale |
| `getParams()` | Restituisce i parametri dinamici |
| `getQuery()` | Restituisce la query string |
| `onRouteChange(cb)` | Callback su cambio route |
| `offRouteChange(cb)` | Rimuove callback |

## Esempi pratici
### Configurazione delle route
```typescript
import KimuRouterModule from 'src/modules/router/module';
import { HomeComponent } from 'src/extensions/home/component';
import { ChatComponent } from 'src/extensions/chat/component';

const routerModule = new KimuRouterModule('router', '1.0.0', {
  routes: [
    { path: '/', component: HomeComponent },
    { path: '/chat', component: ChatComponent },
    { path: '/user/:id', component: UserComponent }
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
router.navigate('/user/42?tab=profile');
```

### Recuperare parametri e query
```typescript
router.addRoute('/user/:id', () => {
  const params = router.getParams();
  const query = router.getQuery();
  // params: { id: '42' }
  // query: { tab: 'profile' }
});
```

### Route guard (autenticazione)
```typescript
router.addRoute('/dashboard', () => {
  if (!isAuthenticated()) {
    router.navigate('/login');
    return;
  }
  loadDashboard();
});
```

### Aggiungere una nuova route a runtime
```typescript
router.addRoute('/about', () => {
  mountKimuComponent(AboutComponent, '#main');
});
```

### Integrazione con estensioni
```typescript
@KimuComponent({
  tag: 'app-router',
  name: 'App Router',
  version: '1.0.0',
  description: 'Main application router component',
  author: 'KIMU Team',
  icon: '🧭',
  internal: false,
  path: 'app-router',
  dependencies: []
})
export class AppRouterComponent extends KimuComponentElement {
  private router: KimuRouterService;

  async onInit() {
    this.router = KimuModuleManager.getInstance().getRouterService();
    this.setupRoutes();
    this.router.onRouteChange(this.handleRouteChange.bind(this));
  }

  private setupRoutes() {
    this.router.addRoute('/', this.renderHome.bind(this));
    this.router.addRoute('/about', this.renderAbout.bind(this));
    this.router.addRoute('/contact', this.renderContact.bind(this));
  }

  private handleRouteChange(route: RouteInfo) {
    this.onRender();
  }
}
```

## Best practice
- Registra tutte le route principali all'avvio dell'applicazione
- Usa il router per separare la logica di navigazione dalla logica di rendering
- Organizza le costanti delle route in un file dedicato
- Gestisci le route 404 con una catch-all (`*`)
- Valida i parametri prima di usarli
- Usa lazy loading per componenti pesanti
- Pulisci risorse quando cambi route
- Documenta la struttura delle route

## Gestione base path
Il router si adatta automaticamente al base path configurato nell'applicazione. Non serve configurazione aggiuntiva.

## Troubleshooting
- Route non trovata: aggiungi una catch-all (`*`) e gestisci il fallback
- Errori di navigazione: verifica la registrazione delle route e i parametri
- Problemi con parametri/query: usa sempre `getParams()` e `getQuery()`
- Se la UI non si aggiorna: assicurati di chiamare `onRender()` dopo il cambio route

## Vantaggi
- Decoupling tra navigazione e UI
- Facilità di estensione
- Integrazione nativa con le estensioni KIMU
- Gestione avanzata di routing e parametri

## Risorse utili
- [Esempio di utilizzo del router](../examples/router-example.md)
- [Documentazione API KimuRouterService](../../framework/modules/router)
- [Best Practice e Pattern](../../framework/extensions/best-practices.md)
- [Guida ai comandi di build e script](../../framework/extensions/build-deployment.md)
