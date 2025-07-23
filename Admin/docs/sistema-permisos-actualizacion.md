# Actualización del Sistema de Permisos

## Cambios Realizados

### 1. Corrección del Modelo de Permisos

Se actualizó el modelo de permisos para incluir propiedades adicionales que permiten una mejor gestión de la jerarquía de pantallas:

```typescript
export interface Permiso {
    Pant_Id: number;
    Pantalla: string;
    Pant_Padre?: number; // ID del módulo padre (opcional)
    Pant_EsPadre?: boolean; // Indica si es un módulo padre (opcional)
    Acciones: Accion[];
}
```

### 2. Mejora del Servicio de Permisos

Se mejoró el servicio de permisos (`permisos.service.ts`) para:

- Manejar correctamente diferentes formatos de JSON que pueden venir de la API
- Implementar una lógica especial para los módulos padres (IDs 1-5)
- Agregar un mapa de pantallas hijas para cada módulo padre

```typescript
private getPantallasHijas(idModuloPadre: number): number[] {
  // Mapa de módulos padres y sus pantallas hijas según la tabla de pantallas
  const mapaPantallas: Record<number, number[]> = {
    1: [6, 7],                                // Acceso: Roles, Usuarios
    2: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 45], // General
    3: [21, 22, 23, 24, 25, 26, 27],        // Inventario
    4: [28, 29, 30, 31],                     // Logística
    5: [32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43] // Ventas
  };
  
  return mapaPantallas[idModuloPadre] || [];
}
```

### 3. Actualización del Guard de Permisos

Se mejoró el `PermisoGuard` para:

- Buscar el ID de pantalla en toda la jerarquía de rutas (actual y padres)
- Agregar mensajes de depuración detallados
- Manejar correctamente los casos de sesión inválida
- Permitir siempre acceso a rutas de login y acceso denegado

### 4. Corrección de Rutas

Se actualizaron los módulos de rutas para incluir los IDs correctos:

- `/acceso/usuarios`: ID 7
- `/acceso/roles`: ID 6
- Módulos principales con sus respectivos IDs (1-5)

### 5. Script SQL para Actualizar la Base de Datos

Se creó un script SQL (`actualizar_pantallas.sql`) para actualizar las rutas en la base de datos y asegurar que coincidan con las rutas en la aplicación Angular.

## Funcionamiento del Sistema de Permisos

### Validación de Permisos

1. Cuando un usuario intenta acceder a una ruta, el `PermisoGuard` verifica si tiene permiso para la pantalla asociada.
2. Para módulos padres (IDs 1-5), se permite el acceso si el usuario tiene permiso para al menos una pantalla hija.
3. Para pantallas normales, se verifica el permiso exacto.
4. Los IDs negativos están reservados para herramientas de desarrollo/depuración y siempre están permitidos.

### Flujo de Inicio de Sesión

1. El usuario inicia sesión con sus credenciales.
2. El servidor devuelve los datos del usuario y sus permisos en formato JSON.
3. El servicio de autenticación guarda esta información en localStorage.
4. El servicio de menú filtra los elementos del menú según los permisos del usuario.
5. El `PermisoGuard` utiliza estos permisos para controlar el acceso a las rutas.

## Depuración y Solución de Problemas

Si encuentras problemas con los permisos, puedes verificar:

1. La consola del navegador para ver los mensajes de depuración detallados.
2. El localStorage para verificar que los permisos se estén guardando correctamente.
3. La base de datos para asegurarte de que los IDs de pantallas coincidan con los de la aplicación.

## Estructura de la Base de Datos

La tabla `Acce.tbPantallas` contiene la información de todas las pantallas del sistema:

- `Pant_Id`: ID único de la pantalla
- `Pant_Descripcion`: Nombre descriptivo de la pantalla
- `Pant_EsPadre`: Indica si es un módulo padre (1) o una pantalla hija (0)
- `Pant_Padre`: ID del módulo padre (NULL para módulos padres)
- `Pant_Icon`: Icono asociado a la pantalla
- `Pant_Ruta`: Ruta de la pantalla en la aplicación Angular
