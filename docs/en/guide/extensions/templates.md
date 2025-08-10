# Advanced HTML Templates

KIMU templates support powerful syntax for creating dynamic and interactive interfaces.

## 🎨 Advanced Template Syntax

### 📋 Basic Interpolation

```html
<!-- Simple values -->
<h1>${title}</h1>
<p>${description}</p>

<!-- JavaScript expressions -->
<p>Sum: ${a + b}</p>
<p>Full name: ${firstName + ' ' + lastName}</p>
<p>Uppercase: ${text.toUpperCase()}</p>

<!-- Method calls -->
<p>Formatted date: ${formatDate(timestamp)}</p>
```

---

## 🔀 Conditional Rendering

### If/Else with Ternary Operator

```html
<div class="user-status">
  ${isLoggedIn ? `
    <div class="logged-in">
      <h3>👋 Welcome, ${userName}!</h3>
      <p>Last login: ${lastLogin}</p>
      <button @click=${onLogout} class="btn-logout">Logout</button>
    </div>
  ` : `
    <div class="logged-out">
      <h3>🔐 Please login to continue</h3>
      <p>Login to access features</p>
      <button @click=${onLogin} class="btn-login">Login</button>
    </div>
  `}
</div>
```

### Multiple Conditional Rendering

```html
<div class="status-indicator">
  ${status === 'loading' ? `
    <div class="loading">
      <span class="spinner">⏳</span>
      <span>Loading...</span>
    </div>
  ` : status === 'error' ? `
    <div class="error">
      <span class="icon">❌</span>
      <span>${errorMessage}</span>
      <button @click=${onRetry}>Retry</button>
    </div>
  ` : status === 'success' ? `
    <div class="success">
      <span class="icon">✅</span>
      <span>Operation completed!</span>
    </div>
  ` : `
    <div class="idle">
      <span>Waiting...</span>
    </div>
  `}
</div>
```

---

## 📋 Loops and Lists

### Simple List

```html
<div class="items-container">
  <h3>Items (${items.length})</h3>
  
  ${items.length > 0 ? `
    <ul class="items-list">
      ${items.map(item => `
        <li class="item">
          <span class="item-name">${item.name}</span>
          <span class="item-value">${item.value}</span>
        </li>
      `).join('')}
    </ul>
  ` : `
    <div class="empty-state">
      <p>📭 No items available</p>
      <button @click=${onAddFirst}>Add First Item</button>
    </div>
  `}
</div>
```

### List with Controls

```html
<div class="todo-list">
  <h3>📝 Todo List (${todos.filter(t => !t.completed).length}/${todos.length})</h3>
  
  ${todos.map((todo, index) => `
    <div class="todo-item ${todo.completed ? 'completed' : ''}" data-id="${todo.id}">
      <input 
        type="checkbox" 
        ?checked=${todo.completed}
        @change=${() => onToggleTodo(todo.id)}
      >
      <span class="todo-text">${todo.text}</span>
      <div class="todo-actions">
        <button @click=${() => onEditTodo(todo.id)} class="btn-edit">✏️</button>
        <button @click=${() => onDeleteTodo(todo.id)} class="btn-delete">🗑️</button>
      </div>
    </div>
  `).join('')}
</div>
```

---

## 📝 Forms and Input Handling

### Complete Form with Validation

```html
<form class="registration-form" @submit=${onSubmit}>
  <h3>📋 Registration</h3>
  
  <!-- Username Field -->
  <div class="form-group ${errors.username ? 'error' : ''}">
    <label for="username">Username *</label>
    <input 
      type="text" 
      id="username"
      value="${formData.username}"
      @input=${onUsernameChange}
      @blur=${onUsernameBlur}
      class="${errors.username ? 'invalid' : ''}"
      required
      minlength="3"
    />
    ${errors.username ? `<span class="error-message">${errors.username}</span>` : ''}
  </div>

  <!-- Email Field -->
  <div class="form-group ${errors.email ? 'error' : ''}">
    <label for="email">Email *</label>
    <input 
      type="email" 
      id="email"
      value="${formData.email}"
      @input=${onEmailChange}
      class="${errors.email ? 'invalid' : ''}"
      required
    />
    ${errors.email ? `<span class="error-message">${errors.email}</span>` : ''}
  </div>

  <!-- Submit -->
  <div class="form-actions">
    <button type="submit" ?disabled=${!isFormValid || isSubmitting} class="btn-primary">
      ${isSubmitting ? '⏳ Registering...' : '✅ Register'}
    </button>
    <button type="button" @click=${onReset} class="btn-secondary">
      🔄 Reset
    </button>
  </div>

  <!-- General errors -->
  ${generalErrors.length > 0 ? `
    <div class="form-errors">
      ${generalErrors.map(error => `
        <p class="error-message">❌ ${error}</p>
      `).join('')}
    </div>
  ` : ''}
</form>
```

---

## 🎯 Event Binding

### Basic Event Binding

```html
<!-- Click events -->
<button @click=${onSave}>Save</button>
<button @click=${() => onDelete(item.id)}>Delete</button>

<!-- Input events -->
<input @input=${onTextChange} value="${text}">
<input @change=${onValueChange} type="number">

<!-- Form events -->
<form @submit=${onSubmit} @reset=${onReset}>

<!-- Keyboard events -->
<input @keydown=${onKeyDown} @keyup=${onKeyUp}>
```

### Event Binding with Parameters

```html
${items.map(item => `
  <div class="item">
    <button @click=${() => onEdit(item.id)}>Edit</button>
    <button @click=${() => onDelete(item.id, item.name)}>Delete</button>
    <input @change=${(e) => onItemUpdate(item.id, e.target.value)}>
  </div>
`).join('')}
```

## ⚡ Performance Tips

### 1. **Minimize `.join('')` Calls**
```html
<!-- ✅ Good -->
${items.map(item => `<li>${item.name}</li>`).join('')}

<!-- ❌ Avoid multiple calls -->
${items.map(item => `<li>${item.name}</li>`)}
```

### 2. **Use Efficient Conditional Rendering**
```html
<!-- ✅ Efficient -->
${showContent ? contentHtml : ''}

<!-- ❌ Less efficient -->
<div style="${showContent ? 'display: block' : 'display: none'}">
  ${contentHtml}
</div>
```

## 📚 Next Steps

- **[Lifecycle](./lifecycle.md)** - Managing templates in lifecycle
- **[Best Practices](./best-practices.md)** - Performant and maintainable templates
- **[Communication](./communication.md)** - Templates for complex communications
