import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router) { }

  /**
   * Verifica si el usuario está autenticado
   * @returns true si el usuario está autenticado, false en caso contrario
   */
  isAuthenticated(): boolean {
    // Verificar si existe el token o información de usuario en localStorage
    const usuarioNombre = localStorage.getItem('usuarioNombre');
    return !!usuarioNombre; // Convertir a booleano
  }

  /**
   * Cierra la sesión del usuario
   */
  logout(): void {
    // Eliminar toda la información del usuario del localStorage
    localStorage.removeItem('usuarioId');
    localStorage.removeItem('usuarioNombre');
    localStorage.removeItem('usuarioRol');
    localStorage.removeItem('esAdmin');
    localStorage.removeItem('esEmpleado');
    
    // Limpiar localStorage para que las pantallas permitidas se recarguen en el próximo inicio de sesión
    localStorage.removeItem('pantallasPermitidas');
    
    // Redirigir al login
    this.router.navigate(['/iniciarsesion']);
  }
}
