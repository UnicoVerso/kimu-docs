# Template HTML Avanzati

I template KIMU supportano una sintassi potente per creare interfacce dinamiche e interattive.

## 🎨 Sintassi Template Avanzata

### 📋 Interpolazione di Base

```html
<!-- Valori semplici -->
<h1>${title}</h1>
<p>${description}</p>

<!-- Espressioni JavaScript -->
<p>Somma: ${a + b}</p>
<p>Nome completo: ${firstName + ' ' + lastName}</p>
<p>Uppercase: ${text.toUpperCase()}</p>

<!-- Chiamate di metodi -->
<p>Data formattata: ${formatDate(timestamp)}</p>
```

---

## 🔀 Rendering Condizionale

### If/Else con Operatore Ternario

```html
<div class="user-status">
  ${isLoggedIn ? `
    <div class="logged-in">
      <h3>👋 Benvenuto, ${userName}!</h3>
      <p>Ultimo accesso: ${lastLogin}</p>
      <button @click=${onLogout} class="btn-logout">Logout</button>
    </div>
  ` : `
    <div class="logged-out">
      <h3>🔐 Accedi per continuare</h3>
      <p>Effettua il login per accedere alle funzionalità</p>
      <button @click=${onLogin} class="btn-login">Login</button>
    </div>
  `}
</div>
```

### Rendering Condizionale Multiplo

```html
<div class="status-indicator">
  ${status === 'loading' ? `
    <div class="loading">
      <span class="spinner">⏳</span>
      <span>Caricamento...</span>
    </div>
  ` : status === 'error' ? `
    <div class="error">
      <span class="icon">❌</span>
      <span>${errorMessage}</span>
      <button @click=${onRetry}>Riprova</button>
    </div>
  ` : status === 'success' ? `
    <div class="success">
      <span class="icon">✅</span>
      <span>Operazione completata!</span>
    </div>
  ` : `
    <div class="idle">
      <span>In attesa...</span>
    </div>
  `}
</div>
```

### Rendering Condizionale Semplice

```html
<!-- Mostra solo se condizione è vera -->
${showAdvanced ? `
  <div class="advanced-options">
    <h4>Opzioni Avanzate</h4>
    <label>
      <input type="checkbox" @change=${onDebugToggle} ?checked=${debugMode}>
      Modalità Debug
    </label>
  </div>
` : ''}

<!-- Mostra contenuto diverso per diversi ruoli -->
${userRole === 'admin' ? `
  <button @click=${onAdminPanel}>Pannello Admin</button>
` : ''}
```

---

## 📋 Loop e Liste

### Lista Semplice

```html
<div class="items-container">
  <h3>Elementi (${items.length})</h3>
  
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
      <p>📭 Nessun elemento disponibile</p>
      <button @click=${onAddFirst}>Aggiungi Primo Elemento</button>
    </div>
  `}
</div>
```

### Lista con Controlli

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
  
  <div class="todo-summary">
    <p>Completate: ${todos.filter(t => t.completed).length}</p>
    <p>Rimanenti: ${todos.filter(t => !t.completed).length}</p>
  </div>
</div>
```

### Lista con Paginazione

```html
<div class="paginated-list">
  <div class="list-header">
    <h3>Risultati ${(currentPage - 1) * pageSize + 1}-${Math.min(currentPage * pageSize, totalItems)} di ${totalItems}</h3>
  </div>
  
  ${currentPageItems.map(item => `
    <div class="list-item">
      <h4>${item.title}</h4>
      <p>${item.description}</p>
      <small>Creato: ${new Date(item.createdAt).toLocaleDateString()}</small>
    </div>
  `).join('')}
  
  <div class="pagination">
    <button @click=${onPreviousPage} ?disabled=${currentPage === 1}>
      ← Precedente
    </button>
    
    <span class="page-info">Pagina ${currentPage} di ${totalPages}</span>
    
    <button @click=${onNextPage} ?disabled=${currentPage === totalPages}>
      Successiva →
    </button>
  </div>
</div>
```

---

## 📝 Form e Input Handling

### Form Completo con Validazione

```html
<form class="registration-form" @submit=${onSubmit}>
  <h3>📋 Registrazione</h3>
  
  <!-- Campo Username -->
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

  <!-- Campo Email -->
  <div class="form-group ${errors.email ? 'error' : ''}">
    <label for="email">Email *</label>
    <input 
      type="email" 
      id="email"
      value="${formData.email}"
      @input=${onEmailChange}
      @blur=${onEmailBlur}
      class="${errors.email ? 'invalid' : ''}"
      required
    />
    ${errors.email ? `<span class="error-message">${errors.email}</span>` : ''}
  </div>

  <!-- Campo Password -->
  <div class="form-group ${errors.password ? 'error' : ''}">
    <label for="password">Password *</label>
    <div class="password-input">
      <input 
        type="${showPassword ? 'text' : 'password'}"
        id="password"
        value="${formData.password}"
        @input=${onPasswordChange}
        class="${errors.password ? 'invalid' : ''}"
        required
        minlength="8"
      />
      <button type="button" @click=${onTogglePassword} class="toggle-password">
        ${showPassword ? '🙈' : '👁️'}
      </button>
    </div>
    ${errors.password ? `<span class="error-message">${errors.password}</span>` : ''}
  </div>

  <!-- Campo Select -->
  <div class="form-group">
    <label for="country">Paese</label>
    <select id="country" @change=${onCountryChange}>
      <option value="">Seleziona paese...</option>
      ${countries.map(country => `
        <option value="${country.code}" ${formData.country === country.code ? 'selected' : ''}>
          ${country.name}
        </option>
      `).join('')}
    </select>
  </div>

  <!-- Checkbox Terms -->
  <div class="form-group checkbox-group">
    <label class="checkbox-label">
      <input 
        type="checkbox" 
        @change=${onTermsChange}
        ?checked=${formData.acceptTerms}
        required
      />
      Accetto i <a href="#terms" target="_blank">termini e condizioni</a> *
    </label>
  </div>

  <!-- Submit -->
  <div class="form-actions">
    <button type="submit" ?disabled=${!isFormValid || isSubmitting} class="btn-primary">
      ${isSubmitting ? '⏳ Registrazione...' : '✅ Registrati'}
    </button>
    <button type="button" @click=${onReset} class="btn-secondary">
      🔄 Reset
    </button>
  </div>

  <!-- Errori generali -->
  ${generalErrors.length > 0 ? `
    <div class="form-errors">
      ${generalErrors.map(error => `
        <p class="error-message">❌ ${error}</p>
      `).join('')}
    </div>
  ` : ''}

  <!-- Messaggio successo -->
  ${successMessage ? `
    <div class="success-message">
      ✅ ${successMessage}
    </div>
  ` : ''}
</form>
```

### Input con Autocomplete

```html
<div class="search-input">
  <label for="search">Cerca utente</label>
  <div class="autocomplete-container">
    <input 
      type="text"
      id="search"
      value="${searchQuery}"
      @input=${onSearchInput}
      @keydown=${onSearchKeydown}
      placeholder="Inizia a digitare..."
      autocomplete="off"
    />
    
    ${suggestions.length > 0 && showSuggestions ? `
      <ul class="suggestions-list">
        ${suggestions.map((suggestion, index) => `
          <li 
            class="suggestion-item ${index === selectedSuggestionIndex ? 'selected' : ''}"
            @click=${() => onSelectSuggestion(suggestion)}
            @mouseover=${() => onHoverSuggestion(index)}
          >
            <img src="${suggestion.avatar}" alt="" class="user-avatar">
            <div class="user-info">
              <div class="user-name">${suggestion.name}</div>
              <div class="user-email">${suggestion.email}</div>
            </div>
          </li>
        `).join('')}
      </ul>
    ` : ''}
  </div>
</div>
```

---

## 🎯 Event Binding

### Event Binding Base

```html
<!-- Click events -->
<button @click=${onSave}>Salva</button>
<button @click=${() => onDelete(item.id)}>Elimina</button>

<!-- Input events -->
<input @input=${onTextChange} value="${text}">
<input @change=${onValueChange} type="number">
<input @blur=${onFieldBlur} @focus=${onFieldFocus}>

<!-- Form events -->
<form @submit=${onSubmit} @reset=${onReset}>

<!-- Keyboard events -->
<input @keydown=${onKeyDown} @keyup=${onKeyUp}>

<!-- Mouse events -->
<div @mouseenter=${onMouseEnter} @mouseleave=${onMouseLeave}>
```

### Event Binding con Parametri

```html
${items.map(item => `
  <div class="item">
    <button @click=${() => onEdit(item.id)}>Modifica</button>
    <button @click=${() => onDelete(item.id, item.name)}>Elimina</button>
    <input @change=${(e) => onItemUpdate(item.id, e.target.value)}>
  </div>
`).join('')}
```

---

## ⚡ Performance Tips

### 1. **Minimizza le Chiamate `.join('')`**
```html
<!-- ✅ Buono -->
${items.map(item => `<li>${item.name}</li>`).join('')}

<!-- ❌ Evita chiamate multiple -->
${items.map(item => `<li>${item.name}</li>`)}
```

### 2. **Usa Rendering Condizionale Efficiente**
```html
<!-- ✅ Efficiente -->
${showContent ? contentHtml : ''}

<!-- ❌ Meno efficiente -->
<div style="${showContent ? 'display: block' : 'display: none'}">
  ${contentHtml}
</div>
```

### 3. **Pre-computa Dati Complessi**
```typescript
// Nel component
getData() {
  const expensiveData = this.computeExpensiveData(); // Pre-computa
  return {
    expensiveData,
    // Altri dati...
  };
}
```

## 📚 Prossimi Passi

- **[Ciclo di Vita](./lifecycle.md)** - Gestire template nel lifecycle
- **[Best Practices](./best-practices.md)** - Template performanti e manutenibili
- **[Comunicazione](./communication.md)** - Template per comunicazioni complesse
