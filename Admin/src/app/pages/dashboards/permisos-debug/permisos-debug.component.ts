import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MenuService } from '../../../core/services/menu.service';
import { Permiso } from '../../../Modelos/acceso/permisos.model';

@Component({
  selector: 'app-permisos-debug',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h4 class="card-title">Depuración de Permisos</h4>
            </div>
            <div class="card-body">
              <div class="row mb-3">
                <div class="col-12">
                  <button class="btn btn-primary me-2" (click)="actualizarPermisos()">
                    Actualizar Menú con Permisos
                  </button>
                  <button class="btn btn-warning me-2" (click)="mostrarMenuCompleto()">
                    Mostrar Menú Completo
                  </button>
                  <button class="btn btn-danger me-2" (click)="limpiarPermisos()">
                    Limpiar Permisos
                  </button>
                  <button class="btn btn-success" (click)="cargarEjemplo()">
                    Cargar Datos de Ejemplo
                  </button>
                </div>
              </div>
              <div class="row mb-3" *ngIf="cargando">
                <div class="col-12">
                  <div class="alert alert-info">
                    Cargando datos de ejemplo...
                  </div>
                </div>
              </div>
              
              <div class="row">
                <div class="col-md-6">
                  <h5>Permisos Actuales</h5>
                  <div class="table-responsive">
                    <table class="table table-bordered">
                      <thead>
                        <tr>
                          <th>ID Pantalla</th>
                          <th>Pantalla</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr *ngIf="!permisos || permisos.length === 0">
                          <td colspan="3" class="text-center">No hay permisos configurados</td>
                        </tr>
                        <tr *ngFor="let permiso of permisos">
                          <td>{{ permiso.Pant_Id }}</td>
                          <td>{{ permiso.Pantalla }}</td>
                          <td>
                            <span *ngFor="let accion of permiso.Acciones; let last = last">
                              {{ accion.Accion }}{{ !last ? ', ' : '' }}
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div class="col-md-6">
                  <h5>Editar Permisos</h5>
                  <div class="mb-3">
                    <label for="permisosJson" class="form-label">JSON de Permisos</label>
                    <textarea 
                      class="form-control" 
                      id="permisosJson" 
                      rows="10" 
                      [(ngModel)]="permisosJsonText"
                    ></textarea>
                  </div>
                  <button class="btn btn-success" (click)="guardarPermisos()">
                    Guardar y Aplicar
                  </button>
                </div>
              </div>
              
              <div class="row mt-4">
                <div class="col-12">
                  <h5>Ejemplo de Formato JSON de Permisos</h5>
                  <pre class="bg-light p-3 rounded">
[&#10;  {{ '{' }}&#10;    "Pant_Id": 6,&#10;    "Pantalla": "Roles",&#10;    "Acciones": [&#10;      {{ '{' }} "Accion": "Crear" {{ '}' }},&#10;      {{ '{' }} "Accion": "Editar" {{ '}' }},&#10;      {{ '{' }} "Accion": "Eliminar" {{ '}' }},&#10;      {{ '{' }} "Accion": "Detalle" {{ '}' }}&#10;    ]&#10;  {{ '}' }},&#10;  {{ '{' }}&#10;    "Pant_Id": 7,&#10;    "Pantalla": "Usuarios",&#10;    "Acciones": [&#10;      {{ '{' }} "Accion": "Crear" {{ '}' }},&#10;      {{ '{' }} "Accion": "Editar" {{ '}' }}&#10;    ]&#10;  {{ '}' }}&#10;]</pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class PermisosDebugComponent implements OnInit {
  permisos: Permiso[] = [];
  permisosJsonText: string = '';
  cargando: boolean = false;

  constructor(
    private menuService: MenuService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.cargarPermisosActuales();
  }
  
  cargarEjemplo(): void {
    this.cargando = true;
    this.http.get<Permiso[]>('assets/data/permisos-ejemplo.json')
      .subscribe({
        next: (data) => {
          this.permisos = data;
          this.permisosJsonText = JSON.stringify(data, null, 2);
          this.cargando = false;
          
          // Preguntar al usuario si desea aplicar los permisos inmediatamente
          if (confirm('¿Desea aplicar estos permisos al menú inmediatamente?')) {
            this.guardarPermisos();
          }
        },
        error: (error) => {
          alert('Error al cargar los datos de ejemplo');
          this.cargando = false;
        }
      });
  }

  cargarPermisosActuales(): void {
    const permisosJson = localStorage.getItem('permisosJson');
    if (permisosJson) {
      try {
        this.permisos = JSON.parse(permisosJson);
        this.permisosJsonText = JSON.stringify(this.permisos, null, 2);
      } catch (error) {
        this.permisos = [];
        this.permisosJsonText = '';
      }
    } else {
      this.permisos = [];
      this.permisosJsonText = '';
    }
  }

  guardarPermisos(): void {
    try {
      // Validar que sea un JSON válido
      const permisosObj = JSON.parse(this.permisosJsonText);
      
      // Guardar en localStorage
      localStorage.setItem('permisosJson', this.permisosJsonText);
      
      // Actualizar permisos en memoria
      this.permisos = permisosObj;
      
      // Actualizar el menú
      this.menuService.filtrarMenuPorPermisos(this.permisosJsonText);
      
      alert('Permisos guardados y aplicados correctamente');
    } catch (error) {
      alert('Error: El formato JSON no es válido');
    }
  }

  actualizarPermisos(): void {
    const permisosJson = localStorage.getItem('permisosJson');
    this.menuService.filtrarMenuPorPermisos(permisosJson);
    alert('Menú actualizado con los permisos actuales');
  }

  mostrarMenuCompleto(): void {
    this.menuService.filtrarMenuPorPermisos(null);
    alert('Mostrando menú completo (sin filtrar por permisos)');
  }

  limpiarPermisos(): void {
    if (confirm('¿Está seguro de que desea eliminar todos los permisos?')) {
      localStorage.removeItem('permisosJson');
      this.permisos = [];
      this.permisosJsonText = '';
      this.menuService.filtrarMenuPorPermisos(null);
      alert('Permisos eliminados');
    }
  }
}
