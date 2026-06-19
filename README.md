# Orbit - Red Social 🚀
### Trabajo Práctico N°2 - Programación IV

## Augusto Bottazzi

## Descripción
Orbit es una red social desarrollada con Angular 17 como trabajo práctico de la materia Programación IV. Permite a los usuarios registrarse, iniciar sesión, ver publicaciones y gestionar su perfil.

## Sprint 1 — Frontend

### Tecnologías utilizadas
- Angular 17 (Standalone Components)
- TypeScript
- Bootstrap 5
- Lucide Angular (iconos)
- Angular Signals

### Pantallas
| Pantalla | Ruta | Descripción |
|---|---|---|
| Login | `/login` | Inicio de sesión por email o nombre de usuario |
| Registro | `/registro` | Creación de cuenta con validaciones |
| Publicaciones | `/publicaciones` | Feed principal con posts y comentarios |
| Mi Perfil | `/mi-perfil` | Visualización y edición del perfil |

### Funcionalidades implementadas
- Formulario de login con validaciones (email/username, contraseña con mínimo 8 caracteres, una mayúscula y un número)
- Formulario de registro con validaciones completas
- Validación de edad mínima de 15 años en el registro
- Campo de carga de imagen de perfil con preview
- Atributo `perfil` con valor por defecto `usuario`
- Navegación entre componentes con Angular Router
- Diseño dark mode con estética espacial (estrellas animadas)
- Modales de éxito en lugar de alerts
- Favicon personalizado
- Signals para manejo de estado reactivo

### Deploy
La aplicación está deployada en Vercel:
🔗 [https://TU_URL.vercel.app](https://TU_URL.vercel.app)

### Ramas
| Rama | Descripción |
|---|---|
| `main` | Versión deployada en producción |
| `sprint-1` | Snapshot de entrega del Sprint 1 |

### Notas
- En Sprint 1 el frontend trabaja con datos simulados (setTimeout). La conexión real con el backend se implementa en Sprint 2.
- El perfil de Mi Perfil muestra datos placeholder hasta la integración con el backend en Sprint 2.