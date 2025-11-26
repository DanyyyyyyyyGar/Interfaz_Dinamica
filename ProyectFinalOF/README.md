# 🦖 Dino Dino - Juego Web Interactivo

## 📋 Descripción General

**Dino Dino** es un juego web estilo **Chrome Dinosaur Game** con autenticación de usuarios y almacenamiento de datos en JSON. El proyecto incluye:

- 🎮 **Juego de saltos**: Esquiva obstáculos y acumula puntos
- 👤 **Sistema de autenticación**: Registro e inicio de sesión
- 📊 **Historial de partidas**: Guarda ganadas/perdidas en JSON (localStorage)
- 📱 **Diseño responsivo**: Se adapta a cualquier tamaño de pantalla
- 🎨 **Gráficos personalizados**: Dibujados en Canvas (Dino, obstáculo, nube)

---

## 🗂️ Estructura del Proyecto

```
ProyectFinalOF/
├── index.html                  # Página principal del juego
├── Registrarse.html            # Formulario de registro
├── IniciarSesion.html          # Formulario de login
├── css/
│   ├── estilo.css              # Estilos generales y centrado
│   ├── registro.css            # Estilos del formulario de registro
│   └── iniciosesion.css        # Estilos del formulario de login
├── js/
│   ├── main.js                 # Lógica principal del juego
│   ├── registro.js             # Gestión del registro de usuarios
│   ├── iniciosesion.js         # Gestión del login
│   └── canvas.js               # (Opcional) Renderizado en canvas
└── recursos/                   # Carpeta para assets (imágenes, sonidos)
```

---

## 🎮 Cómo Funciona el Juego

### Mecánicas Principales

1. **El Dinosaurio (Dino)**
   - Forma: Cuadrado redondeado verde (#1aa35a) con brazos y ojo
   - Controles: Presiona `ESPACIO` para saltar
   - Física: Cae por gravedad (1.2), altura controlada por `dinoH`

2. **El Obstáculo**
   - Forma: Blob verde (#c6f03a) con manchas, pegado al suelo
   - Comportamiento: Se mueve de derecha a izquierda
   - Velocidad: Aumenta con el nivel (cada 50 puntos subes de nivel)

3. **La Nube**
   - Forma: Figura azul decorativa (#bfeaf6) en la parte superior
   - Propósito: Elemento visual/atmosférico

4. **Sistema de Puntuación**
   - **Ganas puntos** cada vez que evitas un obstáculo
   - **Pierdes vidas** (máx. 3) al chocar
   - **Nivel sube** cada 50 puntos (obstáculo se acelera)
   - **Victoria**: Alcanzas 200 puntos
   - **Derrota**: Se acaban las vidas

### Flujo del Juego

```
Inicio del Juego
    ↓
Presiona ESPACIO para saltar
    ↓
¿Chocaste con obstáculo?
    ├─ SÍ → Pierdes 1 vida
    │       ¿Quedan vidas?
    │       ├─ SÍ → Continúa el juego
    │       └─ NO → GAME OVER (Perdiste)
    └─ NO → +1 punto
             ¿Alcanzaste 200 puntos?
             ├─ SÍ → GANASTE
             └─ NO → Continúa
```

---

## 👤 Sistema de Autenticación

### Registro (`Registrarse.html` + `js/registro.js`)

**Campos del formulario:**
- Email (validación con `@`)
- Usuario (único)
- Contraseña (mínimo 4 caracteres)
- Color favorito (opcional)

**Validaciones:**
- ✓ Email válido
- ✓ Usuario no duplicado
- ✓ Email no duplicado
- ✓ Contraseña >= 4 caracteres

**Guardado en JSON:**
```json
{
  "users": [
    {
      "email": "user@example.com",
      "usuario": "juan",
      "password": "1234",
      "color": "azul",
      "fechaRegistro": "11/26/2025, 10:30:45 AM",
      "id": 1732123445123
    }
  ]
}
```

### Inicio de Sesión (`IniciarSesion.html` + `js/iniciosesion.js`)

**Validación:**
1. Busca el usuario en el JSON guardado
2. Verifica que usuario + contraseña coincidan
3. Si son correctos, guarda `loggedUser` en localStorage
4. Redirige a `index.html`

**Usuario Logueado (localStorage):**
```json
{
  "loggedUser": {
    "usuario": "juan",
    "email": "user@example.com",
    "color": "azul",
    "id": 1732123445123
  }
}
```

---

## 📊 Historial de Partidas

### Almacenamiento (`js/main.js` - función `renderHistory()`)

Cada partida guardada contiene:
```json
{
  "dd_gameHistory": [
    {
      "result": "Ganado",
      "score": 205,
      "level": 5,
      "date": "11/26/2025, 10:45:30 AM"
    },
    {
      "result": "Perdido",
      "score": 87,
      "level": 2,
      "date": "11/26/2025, 10:40:15 AM"
    }
  ]
}
```

### Visualización

En la pantalla del juego aparece un **resumen automático**:
```
Partidas: 2 — Ganadas: 1 — Perdidas: 1
```

El contenedor crece automáticamente cuando se agregan partidas.

---

## 🎨 Estilos y Diseño

### Centrado y Responsivo (`css/estilo.css`)

- `.page`: Flexbox centrado, altura mínima 100vh
- `.contenedor`: Ancho máximo 800px, crece con historial
- `.inner`: Flexbox vertical, agrupa canvas + resumen

### Canvas (`index.html`)

```html
<canvas id="gameCanvas"></canvas>
```

- Se redimensiona automáticamente al tamaño del contenedor
- Altura: 320px (visualización)
- Ancho: 100% (responsivo)

### Funciones de Dibujo (`js/main.js`)

```javascript
// Dibuja al dinosaurio
drawRoundedDino(ctx, dinoX, dinoY, dinoW, dinoH)

// Dibuja el obstáculo
drawBlobObstacle(ctx, obstacleX, obstacleY, obstacleW, obstacleH)

// Dibuja la nube
drawCloud(ctx, cx, cy, size)
```

---

## ⚙️ Variables Principales del Juego

| Variable | Valor Inicial | Descripción |
|----------|---------------|-------------|
| `dinoX` | 50 | Posición horizontal del dino |
| `dinoY` | 220 | Posición vertical del dino |
| `dinoW` | 80 | Ancho del dino |
| `dinoH` | 80 | Alto del dino |
| `obstacleX` | canvas.width + 50 | Posición X del obstáculo |
| `obstacleY` | 0 (= groundY) | Posición Y (pegado al suelo) |
| `obstacleW` | 50 | Ancho del obstáculo |
| `obstacleH` | 50 | Alto del obstáculo |
| `obstacleSpeed` | 5 | Velocidad (aumenta por nivel) |
| `gravity` | 1.2 | Aceleración de caída |
| `score` | 0 | Puntos actuales |
| `lives` | 3 | Vidas restantes |
| `level` | 1 | Nivel actual |
| `SCORE_TO_WIN` | 200 | Puntos para ganar |

---

## 🔄 Flujo de Eventos Principales

### Al Cargar la Página

```javascript
fitCanvas()           // Ajusta tamaño del canvas
resetSizes()          // Calcula groundY y tamaños
renderHistory()       // Muestra estadísticas guardadas
updateUI()            // Muestra score/lives
requestAnimationFrame(loop)  // Inicia el loop del juego
```

### En Cada Frame

```javascript
loop() {
  update(delta)       // Actualiza posiciones y lógica
  draw()              // Dibuja todo en canvas
}
```

### Al Hacer Click en ESPACIO

```javascript
jump() {
  dinoYVelocity = -22  // Salto hacia arriba
  isJumping = true
}
```

### Al Finalizar la Partida

```javascript
endGame(resultLabel) {
  gameRunning = false
  gameHistory.unshift(entry)  // Agrega al historial
  localStorage.setItem('dd_gameHistory', JSON.stringify(gameHistory))
  renderHistory()             // Actualiza resumen
  restartButton.show()        // Muestra botón reiniciar
}
```

---

## 📱 Responsividad

El juego se adapta automáticamente:

- **Desktop** (>800px): Canvas 100% ancho del contenedor
- **Tablet** (600px-800px): Canvas se reduce proporcionalmente
- **Mobile** (<600px): Canvas mínimo 600px ancho, scrolleable

La función `fitCanvas()` se ejecuta en cada `resize` para recalcular.

---

## 💾 Almacenamiento (localStorage)

El navegador guarda 3 tipos de datos:

1. **`users`** - Array de usuarios registrados
2. **`loggedUser`** - Usuario actualmente logueado
3. **`dd_gameHistory`** - Historial de partidas

Todos se guardan en **JSON** y persisten entre sesiones.

---

## 🚀 Cómo Usar

### 1. Abrir el Proyecto

```bash
# Abre index.html en el navegador (Firefox, Chrome, Edge, Safari)
# O usa un servidor local:
# python -m http.server 8000
# Luego ve a http://localhost:8000
```

### 2. Registrarse

- Click en "Registrarse"
- Completa email, usuario, contraseña, color favorito
- Datos se guardan en localStorage

### 3. Iniciar Sesión

- Click en "Iniciar Sesión"
- Ingresa usuario y contraseña
- Redirige a `index.html`

### 4. Jugar

- Presiona `ESPACIO` para saltar
- Esquiva obstáculos
- Acumula 200 puntos para ganar
- Historial se guarda automáticamente

### 5. Revisar Datos

Abre DevTools (F12):
- **Application** → **Local Storage** → Ver JSON guardado
- Console → `JSON.parse(localStorage.getItem('users'))` para ver usuarios
- Console → `JSON.parse(localStorage.getItem('dd_gameHistory'))` para ver partidas

---

## 🛠️ Tecnologías Usadas

- **HTML5**: Estructura y Canvas
- **CSS3**: Flexbox, Grid, animaciones
- **JavaScript (Vanilla)**: Sin frameworks
- **Canvas API**: Dibujo de gráficos
- **localStorage**: Persistencia de datos JSON

---

## 📝 Notas Técnicas

### Colisión (AABB)

```javascript
function isColliding(ax, ay, aw, ah, bx, by, bw, bh) {
  return !(ax + aw < bx || ax > bx + bw || ay + ah < by || ay > by + bh);
}
```

Detecta si dos rectángulos se solapan.

### Redimensionamiento

- `resetSizes()` recalcula variables globales (no locales)
- Se ejecuta en `fitCanvas()` al redimensionar
- `groundY` es dinámico según altura del canvas

### Animaciones

- Sin librería de animación
- Usa `requestAnimationFrame()` para 60 FPS
- Física simple: gravedad + velocidad

---

## 🐛 Problemas Comunes y Soluciones

| Problema | Solución |
|----------|----------|
| Obstáculo flotando | Asegurar `obstacleY = groundY` en `resetSizes()` |
| Datos no se guardan | Verificar localStorage no está deshabilitado |
| Canvas blanco | Comprobar que canvas tenga id="gameCanvas" |
| Usuario no se logea | Verificar email/usuario/password en storage |
| Historial no crece | Chequear `renderHistory()` se ejecuta |

---

## 🎯 Mejoras Futuras

- [ ] Encriptación de contraseñas
- [ ] Backend (Node.js/Express) para persistencia remota
- [ ] Sistema de puntuaciones global
- [ ] Diferentes temas/skins
- [ ] Sonidos y música
- [ ] Dificultad progresiva
- [ ] Logros/Badges
- [ ] Multijugador

---

## 📄 Licencia

Proyecto educativo - Uso libre para aprendizaje.

---

## 👨‍💻 Autor

Desarrollado como proyecto final de programación web.

**Fecha**: Noviembre 2025

---

## 📞 Soporte

Para dudas sobre el código, revisa los comentarios en:
- `js/main.js` - Lógica del juego
- `js/registro.js` - Autenticación
- `js/iniciosesion.js` - Login

¡Que disfrutes el juego! 🦖🎮
