# Orbit - Red Social 🚀
### Trabajo Práctico N°2 - Programación IV

## Augusto Bottazzi

## Descripción
Orbit es una red social desarrollada con Angular 17 como trabajo práctico de la materia Programación IV. Permite a los usuarios registrarse, iniciar sesión, publicar contenido, comentar, dar likes y gestionar su perfil.

---

## Sprint 1 — Frontend

### Pantallas implementadas
- Login
- Registro
- Publicaciones (mock)
- Mi Perfil (mock)

### Funcionalidades
- Formularios con validaciones reactivas
- Navegación entre pantallas con Angular Router
- Favicon personalizado
- Diseño trabajado con CSS custom y Bootstrap 5

---

## Sprint 2 — Frontend

### Tecnologías utilizadas
- Angular 17 (Standalone Components)
- TypeScript
- Bootstrap 5
- Lucide Angular (iconos)
- Angular Signals y Computed Signals
- JWT guardado en localStorage
- Cloudinary (imágenes de perfil y publicaciones)

### Nuevas funcionalidades implementadas

#### Publicaciones
- Componente `PublicacionCard` reutilizable e independiente
- Ordenamiento del feed por fecha o por cantidad de likes (desde el backend)
- Paginación del feed (5 publicaciones por página con offset/limit)
- Subida de imágenes en publicaciones via Cloudinary
- Eliminación de publicaciones propias con modal de confirmación (baja lógica)
- Likes con toggle (dar y quitar me gusta)
- Comentarios por publicación con input inline
- Avatar del autor con foto de perfil o iniciales

#### Mi Perfil
- Datos del usuario leídos desde `localStorage` (usuario logueado)
- Foto de perfil guardada en Cloudinary
- Edición de nombre, apellido, descripción e imagen de perfil (persiste en MongoDB)
- Últimas 3 publicaciones propias con sus comentarios
- Toggle para mostrar/ocultar comentarios

#### Servicios Angular
- `AuthService` — login, registro, logout, token
- `PublicacionesService` — CRUD publicaciones, likes, comentarios
- `UsuariosService` — edición de perfil
- `AuthInterceptor` — agrega JWT automáticamente a todas las requests
- `AuthGuard` — protege rutas que requieren login

---

## Sprint 3 — Frontend

### Nuevas funcionalidades implementadas

#### Página de publicación detalle
- Vista expandida de la publicación con todos sus datos
- Comentarios paginados (3 por carga), ordenados más recientes primero
- Botón "Ver todos los comentarios" para cargar todos de una
- Botón "Mostrar menos" para volver a los primeros 3
- Input para escribir nuevos comentarios
- Edición inline de comentarios propios
- Marca "(editado)" en comentarios modificados
- Navegación desde el feed haciendo click en el contenido de la publicación

#### Pantalla de carga
- Splash screen con logo Orbit animado y spinner al iniciar la app
- Validación del token contra `POST /auth/autorizar`
- Redirige a publicaciones si el token es válido
- Redirige al login si el token es inválido o no existe

#### Gestión de sesión
- Contador de 10 minutos que arranca al hacer login
- Modal de aviso cuando quedan 5 minutos de sesión
- Opciones: extender sesión, usar los 5 minutos restantes, o cerrar sesión
- Al extender, llama a `POST /auth/refrescar` y renueva el token
- Si una petición devuelve 401, redirige automáticamente al login
- Modal de sesión expirada con animación de cohete estrellado 🚀💥

### Estructura del proyecto
```
src/
└── app/
    ├── components/
    │   └── publicacion-card/
    ├── guards/
    │   └── auth.guard.ts
    ├── interceptors/
    │   └── auth.interceptor.ts
    ├── pages/
    │   ├── login/
    │   ├── registro/
    │   ├── publicaciones/
    │   ├── publicacion-detalle/
    │   └── mi-perfil/
    ├── services/
    │   ├── auth.service.ts
    │   ├── publicaciones.service.ts
    │   ├── usuarios.service.ts
    │   └── sesion.service.ts
    ├── environments/
    │   ├── environment.ts          (localhost)
    │   └── environment.prod.ts     (Railway)
    ├── app.routes.ts
    ├── app.routes.server.ts
    ├── app.config.ts
    └── app.component.ts
```

### Instalación y uso

```bash
# Clonar el repositorio
git clone https://github.com/47016464/red-social-front.git
cd red-social-front

# Instalar dependencias
npm install

# Correr en desarrollo (apunta a localhost:3000)
ng serve

# Build de producción (apunta a Railway automáticamente)
ng build
```

### Deploy
La aplicación está deployada en Vercel:
🔗 https://red-social-front-one.vercel.app

### Ramas
| Rama | Descripción |
|---|---|
| `main` | Versión actual en producción |
| `sprint-1` | Snapshot de entrega del Sprint 1 |
| `sprint-2` | Snapshot de entrega del Sprint 2 |
| `sprint-3` | Snapshot de entrega del Sprint 3 |

---

## Sprint 4 — Frontend

### Nuevas tecnologías
- ng2-charts + Chart.js (gráficos)
- @angular/pwa + @angular/service-worker (PWA)

### Nuevas funcionalidades implementadas

#### Administrador en publicaciones
- Si el usuario logueado es administrador, aparece el botón de eliminar en **cualquier publicación** (no solo las propias)
- La eliminación es baja lógica — la publicación y sus comentarios dejan de estar disponibles

#### Dashboard — Usuarios (solo admin)
- Accesible desde la navbar cuando el usuario es administrador
- Listado completo de usuarios con nombre, email, rol, fecha de registro y estado
- Crear nuevos usuarios con el mismo formulario que el registro, con radio buttons para elegir perfil (`usuario` o `administrador`)
- Deshabilitar usuarios (baja lógica) — el usuario no puede ingresar y es notificado al intentar el login
- Habilitar usuarios previamente deshabilitados
- No se puede deshabilitar al propio usuario logueado

#### Dashboard — Estadísticas (solo admin)
- Tres gráficos con tipos variados:
  - **Torta** — cantidad de publicaciones por usuario
  - **Línea** — cantidad de comentarios por día
  - **Barras** — cantidad de comentarios por publicación (top 10)
- Filtro de lapso de tiempo con fechas "Desde" y "Hasta" + botón Aplicar

#### PWA
- Progressive Web App configurada con `@angular/pwa`
- Service worker habilitado en producción
- Manifest con íconos y nombre de la app
- Instalable desde el navegador en dispositivos móviles y desktop

#### 3 Pipes propias
| Pipe | Uso |
|---|---|
| `tiempoRelativo` | Convierte una fecha a "hace X minutos/horas/días" |
| `truncar` | Trunca un texto con ellipsis según un límite de caracteres |
| `iniciales` | Extrae las iniciales de un nombre completo |

#### 3 Directivas propias
| Directiva | Uso |
|---|---|
| `appResaltar` | Resalta el fondo del elemento al hacer hover |
| `appAutoFocus` | Hace foco automático en el elemento al renderizarse |
| `appSoloNumeros` | Bloquea la entrada de caracteres no numéricos en inputs |

#### Nuevo guard
- `AdminGuard` — protege las rutas `/dashboard/usuarios` y `/dashboard/estadisticas`, redirige a publicaciones si el usuario no es administrador

### Estructura del proyecto (actualizada)
```
src/
└── app/
    ├── components/
    │   └── publicacion-card/
    ├── directivas/
    │   └── directivas.ts
    ├── guards/
    │   ├── auth.guard.ts
    │   └── admin.guard.ts
    ├── interceptors/
    │   └── auth.interceptor.ts
    ├── pages/
    │   ├── login/
    │   ├── registro/
    │   ├── publicaciones/
    │   ├── publicacion-detalle/
    │   ├── mi-perfil/
    │   ├── dashboard-usuarios/
    │   └── dashboard-estadisticas/
    ├── pipes/
    │   └── pipes.ts
    ├── services/
    │   ├── auth.service.ts
    │   ├── publicaciones.service.ts
    │   ├── usuarios.service.ts
    │   ├── estadisticas.service.ts
    │   └── sesion.service.ts
    ├── environments/
    │   ├── environment.ts
    │   └── environment.prod.ts
    ├── app.routes.ts
    ├── app.config.ts
    └── app.component.ts
```

### Ramas
| Rama | Descripción |
|---|---|
| `main` | Versión actual en producción |
| `sprint-1` | Snapshot de entrega del Sprint 1 |
| `sprint-2` | Snapshot de entrega del Sprint 2 |
| `sprint-3` | Snapshot de entrega del Sprint 3 |
| `sprint-4` | Snapshot de entrega del Sprint 4 |