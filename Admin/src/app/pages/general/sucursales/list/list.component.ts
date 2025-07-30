import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
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
import { Sucursales } from 'src/app/Modelos/general/Sucursales.Model';
import { CreateComponent } from '../create/create.component';
import { EditComponent } from '../edit/edit.component';
import { DetailsComponent } from '../details/details.component';
import { FloatingMenuService } from 'src/app/shared/floating-menu.service';


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
  styleUrls: ['./list.component.scss'],
  animations: [
    trigger('fadeExpand', [
      transition(':enter', [
        style({ opacity: 0, height: 0 }),
        animate('300ms cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 1, height: '*' }))
      ]),
      transition(':leave', [
        animate('300ms cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 0, height: 0 }))
      ])
    ])
  ]
})
export class ListComponent implements OnInit {
  // Overlay de carga animado
  mostrarOverlayCarga = false;
  breadCrumbItems!: Array<{}>;
  accionesDisponibles: string[] = [];

  accionPermitida(accion: string): boolean {
    return this.accionesDisponibles.some(a => a.trim().toLowerCase() === accion.trim().toLowerCase());
  }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'General' },
      { label: 'Sucursales', active: true }
    ];
    this.cargarAccionesUsuario();
  }

  // Dropdown y control de formularios
  activeActionRow: number | null = null;
  showEdit = true;
  showDetails = true;
  showDelete = true;
  showCreateForm = false;
  showEditForm = false;
  showDetailsForm = false;
  sucursalEditando: Sucursales | null = null;
  sucursalDetalle: Sucursales | null = null;

  // Alertas
  mostrarAlertaExito = false;
  mensajeExito = '';
  mostrarAlertaError = false;
  mensajeError = '';
  mostrarAlertaWarning = false;
  mensajeWarning = '';

  // Confirmación de eliminación
  mostrarConfirmacionEliminar = false;
  sucursalAEliminar: Sucursales | null = null;

  // Ordenamiento
  sortField: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(
    public table: ReactiveTableService<Sucursales>,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    public floatingMenuService: FloatingMenuService
  ) {
    this.cargarDatos();
  }

  onActionMenuClick(rowIndex: number) {
    this.activeActionRow = this.activeActionRow === rowIndex ? null : rowIndex;
  }

  crear(): void {
    this.showCreateForm = !this.showCreateForm;
    this.showEditForm = false;
    this.showDetailsForm = false;
    this.activeActionRow = null;
  }

  editar(sucursal: Sucursales): void {
    this.sucursalEditando = { ...sucursal };
    this.showEditForm = true;
    this.showCreateForm = false;
    this.showDetailsForm = false;
    this.activeActionRow = null;
  }

  detalles(sucursal: Sucursales): void {
    this.sucursalDetalle = { ...sucursal };
    this.showDetailsForm = true;
    this.showCreateForm = false;
    this.showEditForm = false;
    this.activeActionRow = null;
  }

  cerrarFormulario(): void {
    this.showCreateForm = false;
  }

  cerrarFormularioEdicion(): void {
    this.showEditForm = false;
    this.sucursalEditando = null;
  }

  cerrarFormularioDetalles(): void {
    this.showDetailsForm = false;
    this.sucursalDetalle = null;
  }

  guardarSucursal(sucursal: Sucursales): void {
    this.cargarDatos();
    this.cerrarFormulario();
  }
  actualizarSucursal(sucursal: Sucursales): void {
    this.cargarDatos();
    this.cerrarFormularioEdicion();
  }

  confirmarEliminar(sucursal: Sucursales): void {
    this.sucursalAEliminar = sucursal;
    this.mostrarConfirmacionEliminar = true;
    this.activeActionRow = null;
  }

  cancelarEliminar(): void {
    this.mostrarConfirmacionEliminar = false;
    this.sucursalAEliminar = null;
  }

  eliminar(): void {
    if (!this.sucursalAEliminar) return;
    this.http.post<any>(`${environment.apiBaseUrl}/Sucursales/Eliminar/${this.sucursalAEliminar.sucu_Id}`, {}, {
      headers: {
        'X-Api-Key': environment.apiKey,
        'accept': '*/*'
      }
    }).subscribe({
      next: (response: any) => {
        if (response.success && response.data) {
          if (response.data.code_Status === 1) {
            this.mensajeExito = `Sucursal "${this.sucursalAEliminar!.sucu_Descripcion}" eliminada exitosamente`;
            this.mostrarAlertaExito = true;
            setTimeout(() => {
              this.mostrarAlertaExito = false;
              this.mensajeExito = '';
            }, 3000);
            this.cargarDatos();
            this.cancelarEliminar();
          } else if (response.data.code_Status === -1) {
            this.mostrarAlertaError = true;
            this.mensajeError = response.data.message_Status || 'No se puede eliminar: la sucursal está siendo utilizada.';
            setTimeout(() => {
              this.mostrarAlertaError = false;
              this.mensajeError = '';
            }, 5000);
            this.cancelarEliminar();
          } else if (response.data.code_Status === 0) {
            this.mostrarAlertaError = true;
            this.mensajeError = response.data.message_Status || 'Error al eliminar la sucursal.';
            setTimeout(() => {
              this.mostrarAlertaError = false;
              this.mensajeError = '';
            }, 5000);
            this.cancelarEliminar();
          }
        } else {
          this.mostrarAlertaError = true;
          this.mensajeError = response.message || 'Error inesperado al eliminar la sucursal.';
          setTimeout(() => {
            this.mostrarAlertaError = false;
            this.mensajeError = '';
          }, 5000);
          this.cancelarEliminar();
        }
      },
      error: (err) => {
        const codeStatus = err?.error?.data?.code_Status;
        const messageStatus = err?.error?.data?.message_Status;
        this.mostrarAlertaError = true;
        if (codeStatus === -1) {
          this.mensajeError = messageStatus || 'No se puede eliminar: la sucursal está siendo utilizada.';
        } else if (codeStatus === 0) {
          this.mensajeError = messageStatus || 'Error al eliminar la sucursal.';
        } else {
          this.mensajeError = err?.error?.message || 'Error al eliminar la sucursal. Intenta de nuevo.';
        }
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

  private cargarAccionesUsuario(): void {
    const permisosRaw = localStorage.getItem('permisosJson');
    let accionesArray: string[] = [];
    if (permisosRaw) {
      try {
        const permisos = JSON.parse(permisosRaw);
        let modulo = null;
        if (Array.isArray(permisos)) {
          modulo = permisos.find((m: any) => m.Pant_Id === 20); // Ajusta el ID si es diferente
        } else if (typeof permisos === 'object' && permisos !== null) {
          modulo = permisos['Sucursales'] || permisos['sucursales'] || null;
        }
        if (modulo && modulo.Acciones && Array.isArray(modulo.Acciones)) {
          accionesArray = modulo.Acciones.map((a: any) => a.Accion).filter((a: any) => typeof a === 'string');
        }
      } catch (e) {
        // Silenciar error de parseo de permisosJson
      }
    }
    this.accionesDisponibles = accionesArray.filter(a => typeof a === 'string' && a.length > 0).map(a => a.trim().toLowerCase());
  }

  private cargarDatos(): void {
    this.mostrarOverlayCarga = true;
    this.http.get<Sucursales[]>(`${environment.apiBaseUrl}/Sucursales/Listar`, {
      headers: { 'x-api-key': environment.apiKey }
    }).subscribe({
      next: data => {
        const tienePermisoListar = this.accionPermitida('listar');
        const userId = getUserId();

        const datosFiltrados = tienePermisoListar
          ? data
          : data.filter(r => r.usua_Creacion?.toString() === userId.toString());

        this.table.setData(datosFiltrados);
        this.mostrarOverlayCarga = false;
      },
      error: error => {
        this.mostrarOverlayCarga = false;
        this.table.setData([]);
      }
    });
  }
}