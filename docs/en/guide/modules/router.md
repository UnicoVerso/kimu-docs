# Router Module

The **Router** module in KIMU-Core allows you to manage navigation between different pages or components within a single-page application (SPA) in a simple and modular way.

## What is the Router?
The Router is a module that lets you:
- Define routes associated with components or extensions
- Manage navigation via URL without reloading the page
- Listen to route changes and react dynamically
- Handle dynamic parameters and query strings
- Protect routes with authentication/authorization guards
- Support transitions, nested routing, and base path

## When to use it
Use the Router when you want to:
- Create an application with multiple views or sections
- Manage navigation between extensions or components
- Implement a Single Page Application (SPA)
- Handle advanced routing with parameters, query, roles

## Main features
- Centralized route configuration
- Support for hash-based routing and History API
- Dynamic parameters (`:id`, `:slug`)
- Route guards (authentication/authorization)
- Programmatic navigation (`navigate`, `back`, `forward`, `replace`)
- Callback on route change
- Ability to register routes dynamically
- Support for nested routing
- Automatic base path handling

## Detailed API
| Method | Description |
|--------|-------------|
| `navigate(path)` | Navigate to a route |
| `back()` | Go back in history |
| `forward()` | Go forward in history |
| `replace(path)` | Replace the current route |
| `addRoute(path, handler)` | Register a new route |
| `removeRoute(path)` | Remove a route |
| `getCurrentRoute()` | Get info about the current route |
| `getParams()` | Get dynamic parameters |
| `getQuery()` | Get query string |
| `onRouteChange(cb)` | Callback on route change |
| `offRouteChange(cb)` | Remove callback |

## Practical examples
### Route configuration
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

### Listen to route changes
```typescript
router.onRouteChange((route) => {
  if (route && route.component) {
    mountKimuComponent(route.component, '#main');
  } else {
    showNotFound();
  }
});
```

### Navigate programmatically
```typescript
router.navigate('/chat');
router.navigate('/user/42?tab=profile');
```

### Get parameters and query
```typescript
router.addRoute('/user/:id', () => {
  const params = router.getParams();
  const query = router.getQuery();
  // params: { id: '42' }
  // query: { tab: 'profile' }
});
```

### Route guard (authentication)
```typescript
router.addRoute('/dashboard', () => {
  if (!isAuthenticated()) {
    router.navigate('/login');
    return;
  }
  loadDashboard();
});
```

### Add a new route at runtime
```typescript
router.addRoute('/about', () => {
  mountKimuComponent(AboutComponent, '#main');
});
```

### Integration with extensions
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

## Best practices
- Register all main routes at application startup
- Use the router to separate navigation logic from rendering logic
- Organize route constants in a dedicated file
- Handle 404 routes with a catch-all (`*`)
- Validate parameters before using them
- Use lazy loading for heavy components
- Clean up resources when changing routes
- Document the route structure

## Base path handling
The router automatically adapts to the base path configured in the application. No additional configuration is needed.

## Troubleshooting
- Route not found: add a catch-all (`*`) and handle fallback
- Navigation errors: check route registration and parameters
- Issues with parameters/query: always use `getParams()` and `getQuery()`
- If the UI does not update: make sure to call `onRender()` after route change

## Advantages
- Decoupling between navigation and UI
- Easy to extend
- Native integration with KIMU extensions
- Advanced routing and parameter management

## Useful resources
- [Router usage example](../examples/router-example.md)
- [KimuRouterService API documentation](../../framework/modules/router)
- [Best Practices and Patterns](../../framework/extensions/best-practices.md)
- [Build and Script Commands Guide](../../framework/extensions/build-deployment.md)
