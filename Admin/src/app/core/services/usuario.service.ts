import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  
  constructor() { }

  /**
   * Obtiene el ID del usuario actual desde localStorage
   * @returns El ID del usuario o 1 como valor predeterminado si no hay usuario autenticado
   */
  obtenerUsuarioId(): number {
    const usuarioId = localStorage.getItem('usuarioId');
    if (usuarioId) {
      return parseInt(usuarioId, 10);
    }
    return 1; // Valor predeterminado si no hay usuario autenticado
  }

  /**
   * Obtiene el nombre del usuario actual desde localStorage
   * @returns El nombre del usuario o cadena vacía si no hay usuario autenticado
   */
  obtenerUsuarioNombre(): string {
    return localStorage.getItem('usuarioNombre') || '';
  }

  /**
   * Obtiene el objeto completo del usuario actual desde localStorage
   * @returns El objeto de usuario o null si no hay usuario autenticado
   */
  obtenerUsuario(): any {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      try {
        return JSON.parse(userData);
      } catch (e) {
        console.error('Error al parsear datos de usuario:', e);
        return null;
      }
    }
    return null;
  }

  /**
   * Verifica si hay un usuario autenticado
   * @returns true si hay un usuario autenticado, false en caso contrario
   */
  estaAutenticado(): boolean {
    return !!localStorage.getItem('token') && !!localStorage.getItem('currentUser');
  }
}
