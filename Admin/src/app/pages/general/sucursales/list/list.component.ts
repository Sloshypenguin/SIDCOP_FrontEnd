import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { BreadcrumbsComponent } from 'src/app/shared/breadcrumbs/breadcrumbs.component';
import { ReactiveTableService } from 'src/app/shared/reactive-table.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { TableModule } from 'src/app/pages/table/table.module';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { Sucursales } from 'src/app/Modelos/general/Sucursales.Model';
import { CreateComponent } from '../create/create.component';
import { EditComponent } from '../edit/edit.component';
import { DetailsComponent } from '../details/details.component';

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
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
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

  constructor(
    public table: ReactiveTableService<Sucursales>,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
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
      next: (response) => {
        this.mensajeExito = `Sucursal "${this.sucursalAEliminar!.sucu_Descripcion}" eliminada exitosamente`;
        this.mostrarAlertaExito = true;
        setTimeout(() => {
          this.mostrarAlertaExito = false;
        }, 3000);
        this.cargarDatos();
        this.cancelarEliminar();
      },
      error: () => {
        this.mostrarAlertaError = true;
        this.mensajeError = 'Error al eliminar la sucursal. Por favor, intente nuevamente.';
        setTimeout(() => {
          this.mostrarAlertaError = false;
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
        console.error('Error al parsear permisosJson:', e);
      }
    }
    this.accionesDisponibles = accionesArray.filter(a => typeof a === 'string' && a.length > 0).map(a => a.trim().toLowerCase());
  }

  private cargarDatos(): void {
    this.http.get<Sucursales[]>(`${environment.apiBaseUrl}/Sucursales/Listar`, {
      headers: { 'x-api-key': environment.apiKey }
    }).subscribe(data => {
      this.table.setData(data);
    });
  }
}