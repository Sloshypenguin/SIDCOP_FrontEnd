# Sistema de Permisos y Menú Dinámico

## Descripción General

Este sistema permite filtrar dinámicamente el menú lateral según los permisos del usuario, así como controlar el acceso a rutas y la visibilidad de elementos de la interfaz de usuario basándose en los permisos almacenados en localStorage.

## Estructura de Permisos

Los permisos se almacenan en localStorage como un JSON con la siguiente estructura:

```json
[
  {
    "Pant_Id": 6,
    "Pantalla": "Roles",
    "Acciones": [
      { "Accion": "Crear" },
      { "Accion": "Editar" },
      { "Accion": "Eliminar" },
      { "Accion": "Detalle" }
    ]
  },
  {
    "Pant_Id": 7,
    "Pantalla": "Usuarios",
    "Acciones": [
      { "Accion": "Crear" },
      { "Accion": "Editar" }
    ]
  }
]
```

## Componentes del Sistema

### 1. Modelo de Permisos (`permisos.model.ts`)

Define la estructura de datos para los permisos y proporciona funciones helper para verificar permisos.

### 2. Servicio de Menú (`menu.service.ts`)

- Filtra el menú estático según los permisos del usuario
- Expone un observable para que el sidebar se suscriba a los cambios
- Actualiza el menú cuando cambian los permisos

### 3. Servicio de Permisos (`permisos.service.ts`)

- Proporciona métodos para verificar permisos de pantallas y acciones
- Facilita la obtención de permisos desde localStorage

### 4. Directiva de Permisos (`permiso.directive.ts`)

- Permite ocultar elementos de la UI según permisos
- Uso: `<button appPermiso [pantallaId]="6" [accion]="'Crear'">Crear</button>`

### 5. Guard de Permisos (`permiso.guard.ts`)

- Protege rutas según permisos de pantalla
- Redirige a página de acceso denegado si no tiene permisos

### 6. Componente de Depuración (`permisos-debug.component.ts`)

- Permite visualizar, editar y probar permisos en tiempo real
- Incluye función para cargar datos de ejemplo

### 7. Componente de Ejemplo (`permisos-ejemplo.component.ts`)

- Muestra ejemplos de uso de la directiva de permisos
- Útil para pruebas y demostración

### 8. Componente de Acceso Denegado (`acceso-denegado.component.ts`)

- Página mostrada cuando se intenta acceder a una ruta sin permisos

## Integración con Login/Logout

El servicio de autenticación (`auth.service.ts`) actualiza el menú:

1. Al iniciar sesión:
   - Guarda los permisos en localStorage
   - Llama a `menuService.filtrarMenuPorPermisos()`

2. Al cerrar sesión:
   - Elimina los permisos de localStorage
   - Llama a `menuService.filtrarMenuPorPermisos(null)`

## Cómo Usar

### Proteger una Ruta

```typescript
const routes: Routes = [
  {
    path: 'usuarios',
    component: UsuariosComponent,
    canActivate: [PermisoGuard],
    data: { pantallaId: 7 }
  }
];
```

### Ocultar Elementos de UI

```html
<!-- Solo visible si tiene permiso para la pantalla 7 y acción "Crear" -->
<button appPermiso [pantallaId]="7" [accion]="'Crear'" class="btn btn-primary">
  Crear Usuario
</button>

<!-- Solo visible si tiene acceso a la pantalla 6 (cualquier acción) -->
<div appPermiso [pantallaId]="6">
  Contenido para administradores de roles
</div>
```

### Verificar Permisos en Componentes

```typescript
constructor(private permisosService: PermisosService) {}

ngOnInit() {
  if (this.permisosService.tieneAccionPermiso(7, 'Crear')) {
    // Lógica para usuarios con permiso de creación
  }
}
```

## Pruebas y Depuración

1. Acceda a la ruta `/dashboards/permisos-debug` para:
   - Ver los permisos actuales
   - Editar permisos manualmente
   - Cargar datos de ejemplo
   - Probar el menú con diferentes configuraciones

2. Acceda a la ruta `/dashboards/permisos-ejemplo` para ver ejemplos de la directiva de permisos en acción.

## Notas Importantes

- Los IDs de pantalla en el menú (`menu.ts`) deben coincidir con los IDs en los permisos JSON.
- La estructura de permisos debe mantenerse como se especificó para garantizar compatibilidad.
- El sistema está diseñado para ser no invasivo y funcionar con la estructura existente de la aplicación.

## Herramientas de Depuración y Acceso Especial

### IDs Negativos

Los elementos del menú y rutas con IDs negativos son considerados herramientas de desarrollo/depuración y siempre están permitidos, independientemente de los permisos del usuario:

- Las rutas `/dashboards/permisos-debug` y `/dashboards/permisos-ejemplo` tienen asignados IDs negativos (-1 y -2)
- El servicio de permisos y el guard permiten automáticamente el acceso a elementos con IDs negativos
- Esto garantiza que las herramientas de depuración siempre sean accesibles

### Acceso a Rutas de Depuración

Las rutas de depuración tienen acceso garantizado mediante tres mecanismos:

1. IDs negativos en el menú lateral
2. Verificación especial en el `PermisoGuard` para permitir siempre estas rutas
3. Ausencia de guard de permisos en las definiciones de ruta

Esto asegura que incluso si el menú está filtrado, siempre se pueda acceder a las herramientas de depuración directamente por URL.
