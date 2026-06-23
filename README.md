# Orbit - Red Social 🚀
### Trabajo Práctico N°2 - Programación IV

## Augusto Bottazzi

## Descripción
Orbit es una red social desarrollada con Angular 17 como trabajo práctico de la materia Programación IV. Permite a los usuarios registrarse, iniciar sesión, ver publicaciones y gestionar su perfil.

## Sprint 2 — Frontend

### Tecnologías utilizadas
- Angular 17 (Standalone Components)
- TypeScript
- Bootstrap 5
- Lucide Angular (iconos)
- Angular Signals
- Angular Computed Signals

### Nuevas funcionalidades implementadas

#### Publicaciones
- Componente `PublicacionCard` reutilizable e independiente
- Ordenamiento del feed por fecha o por cantidad de likes
- Paginación del feed (5 publicaciones por página)
- Subida de imágenes en publicaciones con preview inmediato
- Eliminación de publicaciones propias con modal de confirmación
- Likes con toggle (dar y quitar me gusta)
- Comentarios por publicación con input inline

#### Mi Perfil
- Datos del usuario leídos desde `localStorage` (usuario logueado)
- Foto de perfil con preview antes de guardar
- Edición de nombre, apellido y descripción
- Últimas 3 publicaciones propias con sus comentarios
- Toggle para mostrar/ocultar comentarios de cada publicación

### Estructura del proyecto
```
src/
└── app/
    ├── components/
    │   └── publicacion-card/
    │       ├── publicacion-card.ts
    │       ├── publicacion-card.html
    │       └── publicacion-card.css
    ├── pages/
    │   ├── login/
    │   ├── registro/
    │   ├── publicaciones/
    │   └── mi-perfil/
    ├── app.routes.ts
    ├── app.config.ts
    └── app.ts
```

### Instalación y uso

```bash
# Clonar el repositorio
git clone https://github.com/TU_USUARIO/red-social-front.git
cd red-social-front

# Instalar dependencias
npm install

# Correr en desarrollo
ng serve

# La app estará disponible en http://localhost:4200
```

### Deploy
La aplicación está deployada en Vercel:
🔗 [https://red-social-front-one.vercel.app/login]

### Ramas
| Rama | Descripción |
|---|---|
| `main` | Versión deployada en producción |
| `sprint-1` | Snapshot de entrega del Sprint 1 |
| `sprint-2` | Snapshot de entrega del Sprint 2 |

### Notas
- En Sprint 2 el frontend sigue trabajando con datos simulados en `localStorage`. La conexión real con el backend se implementa en Sprint 3.
- Las publicaciones no persisten al recargar la página hasta la integración con el backend.
- La foto de perfil se guarda localmente en memoria hasta la integración con Cloudinary en Sprint 3.
