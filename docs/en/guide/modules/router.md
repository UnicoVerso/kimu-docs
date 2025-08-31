# Router Module

The **Router** module in KIMU-Core allows you to manage navigation between different pages or components within a single-page application (SPA) in a simple and modular way.

## What is the Router?
The Router is a module that lets you:
- Define routes associated with components or extensions
- Manage navigation via URL without reloading the page
- Listen to route changes and react dynamically

## When to use it
Use the Router when you want to:
- Create an application with multiple views or sections
- Manage navigation between extensions or components
- Implement a Single Page Application (SPA)

## Main features
- Centralized route configuration
- Support for navigation via the History API
- Callback on route change
- Ability to register routes dynamically

## Main API

### Route configuration
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
```

### Add a new route at runtime
```typescript
router.registerRoute({ path: '/about', component: AboutComponent });
```

## Complete example
```typescript
// Configuration
const routerModule = new KimuRouterModule('router', '1.0.0', {
  routes: [
    { path: '/', component: HomeComponent },
    { path: '/chat', component: ChatComponent }
  ]
});
const router = routerModule.getService();

// Mount the correct component when the route changes
router.onRouteChange((route) => {
  if (route && route.component) {
    mountKimuComponent(route.component, '#main');
  }
});

// Navigation from a menu
function goToChat() {
  router.navigate('/chat');
}
```

## Best practices
- Register all main routes at application startup
- Use the router to separate navigation logic from rendering logic
- For dynamic routes or parameters, extend the module as needed

## Advantages
- Decoupling between navigation and UI
- Easy to extend
- Native integration with KIMU extensions

## Useful resources
- [Router usage example](../examples/router-example.md)
- [KimuRouterService API documentation](../../framework/modules/router)
