import { Injectable, inject } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Pantalla } from '../models/pantalla.model';
import { Respuesta } from '../models/respuesta.model';

@Injectable({
  providedIn: 'root'
})
export class PantallasGuardService {
  private apiUrl = 'https://localhost:7211';
  private pantallasPermitidas: string[] = [];

  constructor(private http: HttpClient, private router: Router) {}

  /**
   * Mapeo de rutas a nombres de pantallas
   */
  private rutaAPantalla: Record<string, string> = {
    'dashboard': 'Dashboard',
    'dashboard-cliente': 'Dashboard Cliente',
    'cargos': 'Cargos',
    'casilleros': 'Casilleros',
    'clientes': 'Clientes',
    'departamentos': 'Departamentos',
    'despachos': 'Despachos',
    'direcciones': 'Direcciones',
    'direccionesporcliente': 'Direcciones por Cliente',
    'empleados': 'Empleados',
    'estadosciviles': 'Estados Civiles',
    'municipios': 'Municipios',
    'paquetes': 'Paquetes',
    'precios': 'Precios',
    'recepcionpaquetes': 'Recepción de Paquetes',
    'reempaquetados': 'Reempaquetados',
    'roles': 'Roles',
    'transportes': 'Transportes',
    'usuarios': 'Usuarios',
    'vehiculos': 'Vehículos',
    '': 'Principal',
  };

  /**
   * Verifica si el usuario puede acceder a una ruta específica
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    // Verificar si el usuario está autenticado
    const usuarioNombre = localStorage.getItem('usuarioNombre');
    if (!usuarioNombre) {
      console.log('Usuario no autenticado, redirigiendo a login');
      this.router.navigate(['/iniciarsesion']);
      return of(false);
    }
    
    // Determinar la página de inicio según el tipo de usuario
    const esEmpleado = localStorage.getItem('usuarioEsEmpleado') === 'true';
    const esAdmin = localStorage.getItem('usuarioEsAdmin') === 'true';
    // Si es admin o empleado, tratar como empleado para propósitos de redirección
    const esTratadoComoEmpleado = esEmpleado || esAdmin;

    // Obtener la ruta principal (primer segmento)
    const url = state.url;
    const segmentos = url.split('/').filter(s => s.length > 0);
    const rutaPrincipal = segmentos.length > 0 ? segmentos[0] : '';
    
    // Verificar si el usuario es administrador - permitir acceso a todo excepto dashboard-cliente
    if (esAdmin) {
      // Si es administrador pero intenta acceder al dashboard de cliente, redirigir al dashboard administrativo
      if (rutaPrincipal === 'dashboard-cliente') {
        console.log('Administrador intentando acceder al dashboard de cliente, redirigiendo al dashboard administrativo');
        this.router.navigate(['/dashboard']);
        return of(false);
      }
      
      console.log('Usuario es administrador, permitiendo acceso a:', rutaPrincipal);
      return of(true);
    }

    // La ruta principal ya fue obtenida arriba

    // Permitir siempre acceso a la página de inicio correspondiente
    if ((rutaPrincipal === 'dashboard' && esTratadoComoEmpleado) || 
        (rutaPrincipal === 'dashboard-cliente' && !esTratadoComoEmpleado)) {
      return of(true);
    }
    
    // Si el usuario intenta acceder a una página de inicio que no le corresponde
    if ((rutaPrincipal === 'dashboard' && !esTratadoComoEmpleado) || 
        (rutaPrincipal === 'dashboard-cliente' && esTratadoComoEmpleado)) {
      console.log(`Redirigiendo al usuario a su página de inicio correspondiente`);
      this.router.navigate([esTratadoComoEmpleado ? '/dashboard' : '/dashboard-cliente']);
      return of(false);
    }

    // Obtener el nombre de la pantalla correspondiente a la ruta
    const nombrePantalla = this.rutaAPantalla[rutaPrincipal] || rutaPrincipal;
    console.log(`Verificando acceso a pantalla: ${nombrePantalla} (ruta: ${rutaPrincipal})`);

    // Obtener el ID del rol del usuario
    const roleId = localStorage.getItem('usuarioRol') || localStorage.getItem('roleId');
    if (!roleId) {
      console.error('No se encontró el ID del rol del usuario');
      this.router.navigate(['/dashboard']);
      return of(false);
    }

    // Obtener las pantallas asignadas al rol
    return this.http.post<Respuesta<Pantalla[]>>(`${this.apiUrl}/Pantallas/ListarAsignadas`, {
      role_Id: Number(roleId)
    }).pipe(
      tap(response => {
        if (response && response.data) {
          // Guardar las pantallas permitidas en localStorage para referencia
          this.pantallasPermitidas = response.data.map(p => p.pant_Descripcion || '');
          localStorage.setItem('pantallasPermitidas', JSON.stringify(this.pantallasPermitidas));
          console.log('Pantallas permitidas:', this.pantallasPermitidas);
        }
      }),
      map(response => {
        if (!response || !response.data) {
          console.error('No se recibieron datos de pantallas permitidas');
          return false;
        }

        // Verificar si la pantalla está en la lista de permitidas
        const puedeAcceder = response.data.some(pantalla => 
          (pantalla.pant_Descripcion === nombrePantalla) || 
          (pantalla.pant_Ruta && pantalla.pant_Ruta.includes(rutaPrincipal))
        );

        console.log(`Acceso a ${nombrePantalla}: ${puedeAcceder ? 'Permitido' : 'Denegado'}`);

        if (!puedeAcceder) {
          console.log(`Acceso denegado a ${nombrePantalla}, redirigiendo a la página de inicio correspondiente`);
          this.router.navigate([esTratadoComoEmpleado ? '/dashboard' : '/dashboard-cliente']);
        }

        return puedeAcceder;
      }),
      catchError(error => {
        console.error('Error al verificar permisos:', error);
        this.router.navigate([esTratadoComoEmpleado ? '/dashboard' : '/dashboard-cliente']);
        return of(false);
      })
    );
  }
}

/**
 * Guard de función para verificar permisos de pantallas
 */
export const pantallasGuard: CanActivateFn = (route, state) => {
  return inject(PantallasGuardService).canActivate(route, state);
};
