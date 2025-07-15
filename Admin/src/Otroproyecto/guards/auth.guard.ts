import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    // Usuario autenticado, permitir acceso
    return true;
  }

  // Usuario no autenticado, redirigir al login
  console.log('Acceso denegado: Usuario no autenticado');
  router.navigate(['/iniciarsesion']);
  return false;
};
