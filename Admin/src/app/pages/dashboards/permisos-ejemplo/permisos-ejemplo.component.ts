import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PermisoDirective } from '../../../core/directives/permiso.directive';

@Component({
  selector: 'app-permisos-ejemplo',
  standalone: true,
  imports: [CommonModule, PermisoDirective],
  template: `
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h4 class="card-title">Ejemplo de Uso de Directiva de Permisos</h4>
            </div>
            <div class="card-body">
              <div class="alert alert-info">
                Este componente muestra cómo usar la directiva appPermiso para mostrar u ocultar elementos según los permisos del usuario.
              </div>
              
              <h5>Elementos de Roles (Pantalla ID: 6)</h5>
              <div class="mb-3">
                <button class="btn btn-primary me-2" appPermiso [pantallaId]="6" [accion]="'Crear'">
                  Crear Rol
                </button>
                <button class="btn btn-warning me-2" appPermiso [pantallaId]="6" [accion]="'Editar'">
                  Editar Rol
                </button>
                <button class="btn btn-danger me-2" appPermiso [pantallaId]="6" [accion]="'Eliminar'">
                  Eliminar Rol
                </button>
                <button class="btn btn-info me-2" appPermiso [pantallaId]="6" [accion]="'Detalle'">
                  Ver Detalle de Rol
                </button>
              </div>
              
              <h5>Elementos de Usuarios (Pantalla ID: 7)</h5>
              <div class="mb-3">
                <button class="btn btn-primary me-2" appPermiso [pantallaId]="7" [accion]="'Crear'">
                  Crear Usuario
                </button>
                <button class="btn btn-warning me-2" appPermiso [pantallaId]="7" [accion]="'Editar'">
                  Editar Usuario
                </button>
                <button class="btn btn-danger me-2" appPermiso [pantallaId]="7" [accion]="'Eliminar'">
                  Eliminar Usuario
                </button>
                <button class="btn btn-info me-2" appPermiso [pantallaId]="7" [accion]="'Detalle'">
                  Ver Detalle de Usuario
                </button>
              </div>
              
              <h5>Elementos de Categorías (Pantalla ID: 21)</h5>
              <div class="mb-3">
                <button class="btn btn-primary me-2" appPermiso [pantallaId]="21" [accion]="'Crear'">
                  Crear Categoría
                </button>
                <button class="btn btn-warning me-2" appPermiso [pantallaId]="21" [accion]="'Editar'">
                  Editar Categoría
                </button>
                <button class="btn btn-danger me-2" appPermiso [pantallaId]="21" [accion]="'Eliminar'">
                  Eliminar Categoría
                </button>
                <button class="btn btn-info me-2" appPermiso [pantallaId]="21" [accion]="'Detalle'">
                  Ver Detalle de Categoría
                </button>
              </div>
              
              <h5>Elementos de Productos (Pantalla ID: 25)</h5>
              <div class="mb-3">
                <button class="btn btn-primary me-2" appPermiso [pantallaId]="25" [accion]="'Crear'">
                  Crear Producto
                </button>
                <button class="btn btn-warning me-2" appPermiso [pantallaId]="25" [accion]="'Editar'">
                  Editar Producto
                </button>
                <button class="btn btn-danger me-2" appPermiso [pantallaId]="25" [accion]="'Eliminar'">
                  Eliminar Producto
                </button>
                <button class="btn btn-info me-2" appPermiso [pantallaId]="25" [accion]="'Detalle'">
                  Ver Detalle de Producto
                </button>
              </div>
              
              <div class="alert alert-warning mt-4">
                <strong>Nota:</strong> Los botones solo se mostrarán si el usuario tiene los permisos correspondientes.
                Utiliza el componente de "Depuración de Permisos" para configurar los permisos y ver cómo afectan a estos elementos.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class PermisosEjemploComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
