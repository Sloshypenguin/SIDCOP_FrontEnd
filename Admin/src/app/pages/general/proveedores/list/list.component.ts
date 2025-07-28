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
import { Proveedor } from 'src/app/Modelos/general/Proveedor.Model';
import { CreateComponent } from '../create/create.component';
import { EditComponent } from '../edit/edit.component';
import { DetailsComponent } from '../details/details.component';
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
  styleUrls: ['./list.component.scss'],
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
  // bread crumb items
  breadCrumbItems!: Array<{}>;

  activeActionRow: number | null = null;
  showEdit = true;
  showDetails = true;
  showDelete = true;
  showCreateForm = false;
  showEditForm = false;
  showDetailsForm = false;

  // Propiedades para alertas
  mostrarOverlayCarga = false;
  mostrarAlertaExito = false;
  mensajeExito = '';
  mostrarAlertaError = false;
  mensajeError = '';
  mostrarAlertaWarning = false;
  mensajeWarning = '';

  accionesDisponibles: string[] = [];

  proveedorEditando: Proveedor | null = null;
  proveedorDetalle: Proveedor | null = null;
  proveedorAEliminar: Proveedor | null = null;

  mostrarConfirmacionEliminar = false;

  constructor(
    public table: ReactiveTableService<Proveedor>, 
    private http: HttpClient, 
    private router: Router, 
    private route: ActivatedRoute,
    public floatingMenuService: FloatingMenuService
  ) {
    this.cargardatos(true);
  }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'General' },
      { label: 'Proveedores', active: true }
    ];
    this.cargarAccionesUsuario();

  // this.showEdit = this.accionPermitida('editar');
  // this.showDelete = this.accionPermitida('eliminar');
  // this.showDetails = this.accionPermitida('detalle');
  }

  // Permisos
  accionPermitida(accion: string): boolean {
    return this.accionesDisponibles.some(a => a.trim().toLowerCase() === accion.trim().toLowerCase());
  }

  private cargarAccionesUsuario(): void {
    const permisosRaw = localStorage.getItem('permisosJson');
    let accionesArray: string[] = [];
    if (permisosRaw) {
      try {
        const permisos = JSON.parse(permisosRaw);
        let modulo = null;
        if (Array.isArray(permisos)) {
          // Ajusta el Pant_Id según corresponda para Proveedores
          modulo = permisos.find((m: any) => m.Pant_Id === 19);
        } else if (typeof permisos === 'object' && permisos !== null) {
          modulo = permisos['Proveedores'] || permisos['proveedores'] || null;
        }
        if (modulo && modulo.Acciones && Array.isArray(modulo.Acciones)) {
          accionesArray = modulo.Acciones.map((a: any) => a.Accion).filter((a: any) => typeof a === 'string');
        }
      } catch (e) {
        // Error parseando permisos
      }
    }
    this.accionesDisponibles = accionesArray.filter(a => typeof a === 'string' && a.length > 0).map(a => a.trim().toLowerCase());
  }

  onActionMenuClick(event: MouseEvent, data: Proveedor) {
    this.floatingMenuService.open(event, data);
  }

  cerrarAlerta(): void {
    this.mostrarAlertaExito = false;
    this.mensajeExito = '';
    this.mostrarAlertaError = false;
    this.mensajeError = '';
    this.mostrarAlertaWarning = false;
    this.mensajeWarning = '';
  }

  crear(): void {
    this.showCreateForm = !this.showCreateForm;
    this.showEditForm = false;
    this.showDetailsForm = false;
    this.activeActionRow = null;
  }

  editar(proveedor: Proveedor): void {
    this.proveedorEditando = { ...proveedor };
    this.showEditForm = true;
    this.showCreateForm = false;
    this.showDetailsForm = false;
    this.activeActionRow = null;
  }

  detalles(proveedor: Proveedor): void {
    this.proveedorDetalle = { ...proveedor };
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
    this.proveedorEditando = null;
  }

  cerrarFormularioDetalles(): void {
    this.showDetailsForm = false;
    this.proveedorDetalle = null;
  }

  guardarProveedor(proveedor: Proveedor): void {
    this.cargardatos(false);
    this.cerrarFormulario();
  }

  actualizarProveedor(proveedor: Proveedor): void {
    this.cargardatos(false);
    this.cerrarFormularioEdicion();
  }

  confirmarEliminar(proveedor: Proveedor): void {
    this.proveedorAEliminar = proveedor;
    console.log('Proveedor a eliminar:', this.proveedorAEliminar);
    this.mostrarConfirmacionEliminar = true;
    this.activeActionRow = null;
  }

  cancelarEliminar(): void {
    this.mostrarConfirmacionEliminar = false;
    this.proveedorAEliminar = null;
  }

  eliminar(): void {
    if (!this.proveedorAEliminar) return;
    console.log('Eliminando proveedor:', this.proveedorAEliminar);
    this.http.post(`${environment.apiBaseUrl}/Proveedor/Eliminar?id=${this.proveedorAEliminar.prov_Id}`,{}, {
      headers: { 
        'X-Api-Key': environment.apiKey,
        'accept': '*/*'
      }
    }).subscribe({
      next: (response: any) => {
        this.mostrarAlertaExito = true;
        this.mensajeExito = 'Proveedor eliminado correctamente.';
        setTimeout(() => {
          this.mostrarAlertaExito = false;
          this.mensajeExito = '';
        }, 3000);
        this.cargardatos(false);
        this.cancelarEliminar();
      },
      error: (error) => {
        this.mostrarAlertaError = true;
        this.mensajeError = 'Error al eliminar el proveedor.';
        setTimeout(() => {
          this.mostrarAlertaError = false;
          this.mensajeError = '';
        }, 5000);
      }
    });
  }

  // Declaramos un estado en el cargarDatos, esto para hacer el overlay
  // segun dicha funcion de recargar, ya que si vienes de hacer una accion
  // es innecesario mostrar el overlay de carga
  private cargardatos(state: boolean): void {
    this.mostrarOverlayCarga = state;
    this.http.get<Proveedor[]>(`${environment.apiBaseUrl}/Proveedor/Listar`, {
      headers: { 'x-api-key': environment.apiKey }
    }).subscribe({
      next: data => {
        const tienePermisoListar = this.accionPermitida && this.accionPermitida('listar');
        const userId = typeof getUserId === 'function' ? getUserId() : null;

        const datosFiltrados = tienePermisoListar
          ? data
          : data.filter(p => p.usua_Creacion?.toString() === userId?.toString());

        setTimeout(() => {
          this.mostrarOverlayCarga = false;
          this.table.setData(datosFiltrados);
        }, 500);
      },
      error: error => {
        console.error('Error al cargar proveedores:', error);
        setTimeout(() => {
          this.mostrarOverlayCarga = false;
          this.table.setData([]);
        }, 500);
      }
    });
  }
}