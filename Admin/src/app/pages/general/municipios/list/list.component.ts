import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { BreadcrumbsComponent } from 'src/app/shared/breadcrumbs/breadcrumbs.component';
import { ReactiveTableService } from 'src/app/shared/reactive-table.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { getUserId } from 'src/app/core/utils/user-utils';
import { TableModule } from 'src/app/pages/table/table.module';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { CreateComponent } from '../create/create.component';
import { EditComponent } from '../edit/edit.component';
import { DetailsComponent } from '../details/details.component';
import { Municipio } from 'src/app/Modelos/general/Municipios.Model';
import { Departamento } from 'src/app/Modelos/general/Departamentos.Model';
import { FloatingMenuService } from 'src/app/shared/floating-menu.service';

import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    CommonModule,
      FormsModule,
      RouterModule,
      BreadcrumbsComponent,
      TableModule,
      PaginationModule,
      CreateComponent,
      EditComponent,
      DetailsComponent
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
  animations: [
    trigger('fadeExpand', [
      transition(':enter', [
        style({
          height: '0',
          opacity: 0,
          transform: 'scaleY(0.90)',
          overflow: 'hidden'
        }),
        animate(
          '300ms ease-out',
          style({
            height: '*',
            opacity: 1,
            transform: 'scaleY(1)',
            overflow: 'hidden'
          })
        )
      ]),
      transition(':leave', [
        style({ overflow: 'hidden' }),
        animate(
          '300ms ease-in',
          style({
            height: '0',
            opacity: 0,
            transform: 'scaleY(0.95)'
          })
        )
      ])
    ])
  ]
})
export class ListComponent implements OnInit {

  activeActionRow: number | null = null;
  // Variables para control de alertas
  mostrarAlertaExito = false;
  mensajeExito = '';
  mostrarAlertaError = false;
  mensajeError = '';
  mostrarAlertaWarning = false;
  mensajeWarning = '';

  // Overlay de carga
  mostrarOverlayCarga = false;
  
  // Acciones disponibles para el usuario
  accionesDisponibles: string[] = [];
  showCreateForm = false; // Control del collapse
  showEditForm = false; // Control del collapse de edición
  showDetailsForm = false; // Control del collapse de detalles
  municipioEditando: Municipio | null = null;
  municipioDetalle: Municipio | null = null;
  departamentos: Departamento[] = [];

  // Cierra el dropdown si se hace click fuera
  onDocumentClick(event: MouseEvent, rowIndex: number) {
    const target = event.target as HTMLElement;
    // Busca el dropdown abierto
    const dropdowns = document.querySelectorAll('.dropdown-action-list');
    let clickedInside = false;
    dropdowns.forEach((dropdown, idx) => {
      if (dropdown.contains(target) && this.activeActionRow === rowIndex) {
        clickedInside = true;
      }
    });
    if (!clickedInside && this.activeActionRow === rowIndex) {
      this.activeActionRow = null;
    }
  }

  // Métodos para los botones de acción principales (crear, editar, detalles)
  crear(): void {
    console.log('Toggleando formulario de creación...');
    this.showCreateForm = !this.showCreateForm;
    this.showEditForm = false; // Cerrar edit si está abierto
    this.showDetailsForm = false; // Cerrar details si está abierto
    this.activeActionRow = null; // Cerrar menú de acciones
  }

  editar(municipio: Municipio): void {
    console.log('Abriendo formulario de edición para:', municipio);
    console.log('Datos específicos:', {
      codigo: municipio.muni_Codigo,
      descripcion: municipio.muni_Descripcion,
      completo: municipio
    });
    this.municipioEditando = { ...municipio }; // Hacer copia profunda
    this.showEditForm = true;
    this.showCreateForm = false; // Cerrar create si está abierto
    this.showDetailsForm = false; // Cerrar details si está abierto
    this.activeActionRow = null; // Cerrar menú de acciones
  }

   detalles(municipio: Municipio): void {
    console.log('Abriendo detalles para:', municipio);
    const depto = this.departamentos.find(d => d.depa_Codigo === municipio.depa_Codigo);
    this.municipioDetalle = { 
      ...municipio, 
      depa_Descripcion: depto ? depto.depa_Descripcion : 'N/A' 
    };
    this.showDetailsForm = true;
    this.showCreateForm = false; // Cerrar create si está abierto
    this.showEditForm = false; // Cerrar edit si está abierto
    this.activeActionRow = null; // Cerrar menú de acciones
  }

  // Propiedades para alertas (ya definidas al inicio de la clase)
  
  // Propiedades para confirmación de eliminación
  mostrarConfirmacionEliminar = false;
  municipioAEliminar: Municipio | null = null;

  private cargardatos(mostrarOverlay: boolean = true): void {
    if (mostrarOverlay) this.mostrarOverlayCarga = true;
    this.http.get<Municipio[]>(`${environment.apiBaseUrl}/Municipios/Listar`, {
      headers: { 'x-api-key': environment.apiKey }
    }).subscribe({
      next: (data) => {
        this.table.setData(data);
        this.mostrarOverlayCarga = false;
      },
      error: (error) => {
        this.mostrarOverlayCarga = false;
        this.mostrarAlertaError = true;
        this.mensajeError = 'Error al cargar los municipios.';
        setTimeout(() => {
          this.mostrarAlertaError = false;
          this.mensajeError = '';
        }, 5000);
      }
    });
  }

  constructor(public table: ReactiveTableService<Municipio>, 
    private http: HttpClient, 
    private router: Router, 
    private route: ActivatedRoute,
    public floatingMenuService: FloatingMenuService) {
      this.cargardatos(true);
    }

  // Verificar si una acción está permitida
  accionPermitida(accion: string): boolean {
    const accionBuscada = accion.toLowerCase();
    const accionesMapeadas: {[key: string]: string} = {
      'detalles': 'detalle',
      'nuevo': 'crear'
    };
    const accionReal = accionesMapeadas[accionBuscada] || accionBuscada;
    return this.accionesDisponibles.some(a => a === accionReal);
  }

  // Cargar acciones disponibles del usuario
  cargarAccionesUsuario() {
    let accionesArray: string[] = [];
    let modulo: any = null;
    const permisosJson = localStorage.getItem('permisosJson');
    if (permisosJson) {
      try {
        const permisos = JSON.parse(permisosJson);
        if (Array.isArray(permisos)) {
          // Buscar por ID de pantalla (16 para municipios)
                    modulo = permisos.find((m: any) => m.Pant_Id === 18);
        } else if (typeof permisos === 'object' && permisos !== null) {
          // Si es objeto, buscar por clave
          modulo = permisos['Municipios'] || permisos['municipios'] || null;
        }
        if (modulo && modulo.Acciones && Array.isArray(modulo.Acciones)) {
          accionesArray = modulo.Acciones
            .map((a: any) => {
              const accion = a.Accion || a.accion || a;
              return typeof accion === 'string' ? accion.trim().toLowerCase() : '';
            })
            .filter((a: string) => a.length > 0);
        }
      } catch (e) {
        console.error('Error al parsear permisosJson:', e);
      }
    }
    this.accionesDisponibles = accionesArray;
    console.log('Acciones disponibles para municipios:', this.accionesDisponibles);
  }

  // Inicializar componente
  ngOnInit() {
    this.cargarAccionesUsuario();
    this.cargardatos();
    this.cargarDepartamentos();
  }

  onActionMenuClick(rowIndex: number) {
    this.activeActionRow = this.activeActionRow === rowIndex ? null : rowIndex;
  }

  private cargarDepartamentos(): void {
    this.http.get<Departamento[]>(`${environment.apiBaseUrl}/Departamentos/Listar`, {
      headers: { 'x-api-key': environment.apiKey }
    }).subscribe(data => {
      this.departamentos = data;
    }, error => {
      console.error('Error al cargar los departamentos', error);
    });
  }

  // (navigateToCreate eliminado, lógica movida a crear)

  // (navigateToEdit y navigateToDetails eliminados, lógica movida a editar y detalles)

  cerrarFormulario(): void {
    this.showCreateForm = false;
  }

  cerrarFormularioEdicion(): void {
    this.showEditForm = false;
    this.municipioEditando = null;
  }

  cerrarFormularioDetalles(): void {
    this.showDetailsForm = false;
    this.municipioDetalle = null;
  }

  guardarMunicipio(municipio: Municipio): void {
    this.mostrarOverlayCarga = true;
    this.http.post(`${environment.apiBaseUrl}/Municipios/Crear`, municipio, {
      headers: { 
        'X-Api-Key': environment.apiKey,
        'accept': '*/*'
      }
    }).subscribe({
      next: (response: any) => {
        setTimeout(() => {
          this.cargardatos(false);
          if (response.success && response.data && response.data.code_Status === 1) {
            this.mensajeExito = 'Municipio creado exitosamente';
            this.mostrarAlertaExito = true;
            setTimeout(() => {
              this.mostrarAlertaExito = false;
              this.mensajeExito = '';
            }, 3000);
            this.cargardatos(false);
            this.cerrarFormulario();
          } else {
            this.mostrarAlertaError = true;
            this.mensajeError = response.data?.message_Status || 'Error al crear el municipio.';
            setTimeout(() => {
              this.mostrarAlertaError = false;
              this.mensajeError = '';
            }, 5000);
          }
        }, 1000);
      },
      error: (error) => {
        this.mostrarOverlayCarga = false;
        this.mostrarAlertaError = true;
        this.mensajeError = 'Error inesperado al crear el municipio.';
        setTimeout(() => {
          this.mostrarAlertaError = false;
          this.mensajeError = '';
        }, 5000);
      }
    });
  }

  actualizarMunicipio(municipio: Municipio): void {
    this.mostrarOverlayCarga = true;
    this.http.post(`${environment.apiBaseUrl}/Municipios/Actualizar`, municipio, {
      headers: { 
        'X-Api-Key': environment.apiKey,
        'accept': '*/*'
      }
    }).subscribe({
      next: (response: any) => {
        setTimeout(() => {
          this.cargardatos(false);
          if (response.success && response.data && response.data.code_Status === 1) {
            this.mensajeExito = 'Municipio actualizado exitosamente';
            this.mostrarAlertaExito = true;
            setTimeout(() => {
              this.mostrarAlertaExito = false;
              this.mensajeExito = '';
            }, 3000);
            this.cargardatos(false);
            this.cerrarFormularioEdicion();
          } else {
            this.mostrarAlertaError = true;
            this.mensajeError = response.data?.message_Status || 'Error al actualizar el municipio.';
            setTimeout(() => {
              this.mostrarAlertaError = false;
              this.mensajeError = '';
            }, 5000);
          }
        }, 1000);
      },
      error: (error) => {
        this.mostrarOverlayCarga = false;
        this.mostrarAlertaError = true;
        this.mensajeError = 'Error inesperado al actualizar el municipio.';
        setTimeout(() => {
          this.mostrarAlertaError = false;
          this.mensajeError = '';
        }, 5000);
      }
    });
  }

  confirmarEliminar(municipio: Municipio): void {
    console.log('Solicitando confirmación para eliminar:', municipio);
    this.municipioAEliminar = municipio;
    this.mostrarConfirmacionEliminar = true;
    this.activeActionRow = null; // Cerrar menú de acciones
  }

  cancelarEliminar(): void {
    this.mostrarConfirmacionEliminar = false;
    this.municipioAEliminar = null;
  }

  eliminar(): void {
    if (!this.municipioAEliminar) return;
    this.mostrarOverlayCarga = true;
    this.http.post(`${environment.apiBaseUrl}/Municipios/Eliminar/${this.municipioAEliminar.muni_Codigo}`, {}, {
      headers: { 
        'X-Api-Key': environment.apiKey,
        'accept': '*/*'
      }
    }).subscribe({
      next: (response: any) => {
        setTimeout(() => {
          this.cargardatos(false);
          if (response.success && response.data) {
            if (response.data.code_Status === 1) {
              this.mensajeExito = `Municipio "${this.municipioAEliminar!.muni_Descripcion}" eliminado exitosamente`;
              this.mostrarAlertaExito = true;
              setTimeout(() => {
                this.mostrarAlertaExito = false;
                this.mensajeExito = '';
              }, 3000);
              this.cargardatos(false);
              this.cancelarEliminar();
            } else if (response.data.code_Status === -1) {
              this.mostrarAlertaError = true;
              this.mensajeError = response.data.message_Status || 'No se puede eliminar: el municipio está siendo utilizado.';
              setTimeout(() => {
                this.mostrarAlertaError = false;
                this.mensajeError = '';
              }, 5000);
              this.cancelarEliminar();
            } else if (response.data.code_Status === 0) {
              this.mostrarAlertaError = true;
              this.mensajeError = response.data.message_Status || 'Error al eliminar el municipio.';
              setTimeout(() => {
                this.mostrarAlertaError = false;
                this.mensajeError = '';
              }, 5000);
              this.cancelarEliminar();
            }
          } else {
            this.mostrarAlertaError = true;
            this.mensajeError = response.message || 'Error inesperado al eliminar el municipio.';
            setTimeout(() => {
              this.mostrarAlertaError = false;
              this.mensajeError = '';
            }, 5000);
            this.cancelarEliminar();
          }
        }, 1000);
      },
      error: (error) => {
        this.mostrarOverlayCarga = false;
        this.mostrarAlertaError = true;
        this.mensajeError = 'Error inesperado al eliminar el municipio.';
        setTimeout(() => {
          this.mostrarAlertaError = false;
          this.mensajeError = '';
        }, 5000);
        this.cancelarEliminar();
      }
    });
  }

  cerrarAlerta(): void {
    this.mostrarAlertaExito = false;
    this.mensajeExito = '';
    this.mostrarAlertaError = false;
    this.mensajeError = '';
    this.mostrarAlertaWarning = false;
    this.mensajeWarning = '';
  }

}
