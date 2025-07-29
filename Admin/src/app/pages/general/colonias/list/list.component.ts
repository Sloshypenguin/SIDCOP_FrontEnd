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
import {Colonias} from 'src/app/Modelos/general/Colonias.Model';
import {Municipio} from 'src/app/Modelos/general/Municipios.Model';
import { FloatingMenuService } from 'src/app/shared/floating-menu.service';
import {
  trigger,
  state,
  style,
  transition,
  animate
} from '@angular/animations';


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
  mostrarOverlayCarga: boolean = false;

  activeActionRow: number | null = null;
  // Variables para control de alertas
  mostrarAlertaExito = false;
  mensajeExito = '';
  mostrarAlertaError = false;
  mensajeError = '';
  mostrarAlertaWarning = false;
  mensajeWarning = '';
  
  // Acciones disponibles para el usuario
  accionesDisponibles: string[] = [];
  showCreateForm = false; // Control del collapse
  showEditForm = false; // Control del collapse de edición
  showDetailsForm = false; // Control del collapse de detalles
  coloniaEditando: Colonias | null = null;
  coloniaDetalle: Colonias | null = null;
  municipios: Municipio[] = [];

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

  editar(colonia: Colonias): void {
    console.log('Abriendo formulario de edición para:', colonia);
    console.log('Datos específicos:', {
      codigo: colonia.colo_Id,
      descripcion: colonia.colo_Descripcion,
      completo: colonia
    });
    this.coloniaEditando = { ...colonia }; // Hacer copia profunda
    this.showEditForm = true;
    this.showCreateForm = false; // Cerrar create si está abierto
    this.showDetailsForm = false; // Cerrar details si está abierto
    this.activeActionRow = null; // Cerrar menú de acciones
  }

   detalles(colonia: Colonias): void {
    console.log('Abriendo detalles para:', colonia);
    // Validar campos esperados
    const camposEsperados = [
      'colo_Descripcion', 'muni_Descripcion', 'depa_Descripcion',
      'secuencia', 'muni_Codigo', 'depa_Codigo',
      'usuarioCreacion', 'usuarioModificacion',
      'colo_FechaCreacion', 'colo_FechaModificacion'
    ];
    let faltantes: string[] = [];
    camposEsperados.forEach(campo => {
      if (!(campo in colonia)) {
        faltantes.push(campo);
      }
    });
    if (faltantes.length > 0) {
      console.warn('ADVERTENCIA: El objeto colonia recibido NO contiene los siguientes campos esperados por el detalle:', faltantes);
    } else {
      console.log('Todos los campos esperados están presentes.');
    }
    this.coloniaDetalle = { 
      ...colonia, 
    };
    this.showDetailsForm = true;
    this.showCreateForm = false;
    this.showEditForm = false;
    this.activeActionRow = null;
  }

  // Propiedades para alertas (ya definidas al inicio de la clase)
  
  // Propiedades para confirmación de eliminación
  mostrarConfirmacionEliminar = false;
  coloniaAEliminar: Colonias | null = null;

  private cargardatos(mostrarOverlay: boolean = true): void {
    if (mostrarOverlay) this.mostrarOverlayCarga = true;
    this.http.get<Colonias[]>(`${environment.apiBaseUrl}/Colonia/Listar`, {
      headers: { 'x-api-key': environment.apiKey }
    }).subscribe({
      next: (data) => {
        const tienePermisoListar = this.accionPermitida('listar');
        const userId = getUserId();

        const datosFiltrados = tienePermisoListar
          ? data
          : data.filter(r => r.usua_Creacion?.toString() === userId.toString());

        this.table.setData(datosFiltrados);
        this.mostrarOverlayCarga = false;
      },
      error: (error) => {
        this.mostrarOverlayCarga = false;
        this.mostrarAlertaError = true;
        this.mensajeError = 'Error al cargar las colonias.';
        setTimeout(() => {
          this.mostrarAlertaError = false;
          this.mensajeError = '';
        }, 5000);
      }
    });
  }

  constructor(public table: ReactiveTableService<Colonias>, 
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
          // Buscar por ID de pantalla (17 para colonias)
                    modulo = permisos.find((m: any) => m.Pant_Id === 11);
        } else if (typeof permisos === 'object' && permisos !== null) {
          // Si es objeto, buscar por clave
          modulo = permisos['Colonias'] || permisos['colonias'] || null;
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
    console.log('Acciones disponibles para colonias:', this.accionesDisponibles);
  }

  // Inicializar componente
    ngOnInit() {
    this.cargarAccionesUsuario();
    this.cargardatos();
    this.cargarMunicipios();
  }

    onActionMenuClick(rowIndex: number) {
    this.activeActionRow = this.activeActionRow === rowIndex ? null : rowIndex;
  }

  private cargarMunicipios(): void {
    this.http.get<Municipio[]>(`${environment.apiBaseUrl}/Municipios/Listar`, {
      headers: { 'x-api-key': environment.apiKey }
    }).subscribe(data => {
      this.municipios = data;
    }, error => {
      console.error('Error al cargar los municipios', error);
    });
  }

  // (navigateToCreate eliminado, lógica movida a crear)

  // (navigateToEdit y navigateToDetails eliminados, lógica movida a editar y detalles)

  cerrarFormulario(): void {
    this.showCreateForm = false;
  }

  cerrarFormularioEdicion(): void {
    this.showEditForm = false;
    this.coloniaEditando = null;
  }

  cerrarFormularioDetalles(): void {
    this.showDetailsForm = false;
    this.coloniaDetalle = null;
  }

  guardarColonias(colonia: Colonias): void {
    this.mostrarOverlayCarga = true;
    this.http.post(`${environment.apiBaseUrl}/Colonia/Crear`, colonia, {
      headers: { 
        'X-Api-Key': environment.apiKey,
        'accept': '*/*'
      }
    }).subscribe({
      next: (response: any) => {
        setTimeout(() => {
          this.cargardatos(false);
          if (response.success && response.data && response.data.code_Status === 1) {
            this.mensajeExito = 'Colonia creada exitosamente';
            this.mostrarAlertaExito = true;
            setTimeout(() => {
              this.mostrarAlertaExito = false;
              this.mensajeExito = '';
            }, 3000);
            this.cerrarFormulario();
          } else {
            this.mostrarAlertaError = true;
            this.mensajeError = response.data?.message_Status || 'Error al crear la colonia.';
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
        this.mensajeError = 'Error inesperado al crear la colonia.';
        setTimeout(() => {
          this.mostrarAlertaError = false;
          this.mensajeError = '';
        }, 5000);
      }
    });
  }

  actualizarColonias(colonia: Colonias): void {
    this.mostrarOverlayCarga = true;
    this.http.post(`${environment.apiBaseUrl}/Colonia/Actualizar`, colonia, {
      headers: { 
        'X-Api-Key': environment.apiKey,
        'accept': '*/*'
      }
    }).subscribe({
      next: (response: any) => {
        setTimeout(() => {
          this.cargardatos(false);
          if (response.success && response.data && response.data.code_Status === 1) {
            this.mensajeExito = 'Colonia actualizada exitosamente';
            this.mostrarAlertaExito = true;
            setTimeout(() => {
              this.mostrarAlertaExito = false;
              this.mensajeExito = '';
            }, 3000);
            this.cerrarFormularioEdicion();
          } else {
            this.mostrarAlertaError = true;
            this.mensajeError = response.data?.message_Status || 'Error al actualizar la colonia.';
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
        this.mensajeError = 'Error inesperado al actualizar la colonia.';
        setTimeout(() => {
          this.mostrarAlertaError = false;
          this.mensajeError = '';
        }, 5000);
      }
    });
  }

  confirmarEliminar(  colonia: Colonias): void {
    console.log('Solicitando confirmación para eliminar:', colonia);
    this.coloniaAEliminar = colonia;
    this.mostrarConfirmacionEliminar = true;
    this.activeActionRow = null; // Cerrar menú de acciones
  }

  cancelarEliminar(): void {
    this.mostrarConfirmacionEliminar = false;
    this.coloniaAEliminar = null;
  }

  eliminar(): void {
    if (!this.coloniaAEliminar) return;
    this.mostrarOverlayCarga = true;
    this.http.post(`${environment.apiBaseUrl}/Colonia/Eliminar/${this.coloniaAEliminar.colo_Id}`, {}, {
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
              this.mensajeExito = `Colonia "${this.coloniaAEliminar!.colo_Descripcion}" eliminada exitosamente`;
              this.mostrarAlertaExito = true;
              setTimeout(() => {
                this.mostrarAlertaExito = false;
                this.mensajeExito = '';
              }, 3000);
              this.cancelarEliminar();
            } else if (response.data.code_Status === -1) {
              this.mostrarAlertaError = true;
              this.mensajeError = response.data.message_Status || 'No se puede eliminar: la colonia está siendo utilizada.';
              setTimeout(() => {
                this.mostrarAlertaError = false;
                this.mensajeError = '';
              }, 5000);
              this.cancelarEliminar();
            } else if (response.data.code_Status === 0) {
              this.mostrarAlertaError = true;
              this.mensajeError = response.data.message_Status || 'Error al eliminar la colonia.';
              setTimeout(() => {
                this.mostrarAlertaError = false;
                this.mensajeError = '';
              }, 5000);
              this.cancelarEliminar();
            }
          } else {
            this.mostrarAlertaError = true;
            this.mensajeError = response.message || 'Error inesperado al eliminar la colonia.';
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
        this.mensajeError = 'Error inesperado al eliminar la colonia.';
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
