import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { PermisosService } from '../services/permisos.service';

@Injectable({
  providedIn: 'root'
})
export class PermisoGuard {
  
  constructor(
    private permisosService: PermisosService,
    private router: Router
  ) {}
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    // Permitir siempre acceso a rutas de login y página de error
    if (state.url.includes('/account/login') || 
        state.url.includes('/account/auth/errors/error404')) {
      return true;
    }
    
    
    // Obtener el ID de pantalla requerido de los datos de la ruta
    // Primero intentamos obtenerlo de la ruta actual
    let pantallaId = route.data['pantallaId'] as number;
    
    // Si no está en la ruta actual, buscamos en las rutas padre
    if (!pantallaId && route.parent) {
      pantallaId = route.parent.data['pantallaId'] as number;
    }
    
    // Si aún no lo encontramos y hay más padres, seguimos buscando
    let currentRoute = route.parent;
    while (!pantallaId && currentRoute && currentRoute.parent) {
      currentRoute = currentRoute.parent;
      pantallaId = currentRoute.data['pantallaId'] as number;
    }
    
    // Si no se especifica un ID de pantalla, permitir el acceso con advertencia
    if (!pantallaId) {
      return true;
    }
    
    // Los IDs negativos son para herramientas de desarrollo/depuración
    if (pantallaId < 0) {
      return true;
    }
    
    // Verificar si el usuario tiene permiso para acceder a la pantalla
    const permisos = this.permisosService.obtenerPermisos();
    
    // Si no hay permisos, redirigir al login
    if (!permisos || permisos.length === 0) {
      localStorage.removeItem('currentUser'); // Limpiar sesión inválida
      return this.router.createUrlTree(['/account/login']);
    }
    
    const tienePermiso = this.permisosService.tienePantallaPermiso(pantallaId);
    
    if (!tienePermiso) {
      return this.router.createUrlTree(['/account/auth/errors/error404']);
    }
    
    return true;
  }
}
