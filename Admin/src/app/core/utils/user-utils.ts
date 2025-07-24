/**
 * Utilidades para manejo de datos de usuario
 */

/**
 * Obtiene el ID del usuario actual desde localStorage o environment
 * Si no está disponible, devuelve un valor predeterminado (0)
 * @returns number - ID del usuario o 0 si no está disponible
 */
export function getUserId(): number {
  const usuarioId = localStorage.getItem('usuarioId');
  return usuarioId ? parseInt(usuarioId, 10) : 0;
}

/**
 * Obtiene el nombre del usuario actual desde localStorage
 * @returns string - Nombre del usuario o cadena vacía si no está disponible
 */
export function getUserName(): string {
  return localStorage.getItem('nombreUsuario') || '';
}

/**
 * Obtiene el rol del usuario actual desde localStorage
 * @returns string - Rol del usuario o cadena vacía si no está disponible
 */
export function getUserRole(): string {
  return localStorage.getItem('rolUsuario') || '';
}
