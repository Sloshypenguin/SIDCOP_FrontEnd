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
import { Cargos } from 'src/app/Modelos/general/Cargos.Model';
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
  styleUrls: ['./list.component.scss']
})

export class ListComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;

  accionesDisponibles: string[] = [];
  accionPermitida(accion: string): boolean {
    return this.accionesDisponibles.some(a => a.trim().toLowerCase() === accion.trim().toLowerCase());
  }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'General' },
      { label: 'Cargos', active: true }
    ];
    this.cargarAccionesUsuario();
  }

  private readonly PANTALLA_CARGOS_ID = 9;

  showEdit = true;
  showDetails = true;
  showDelete = true;
  showCreateForm = false;
  showEditForm = false;
  showDetailsForm = false;
  cargoEditando: Cargos | null = null;
  cargoDetalle: Cargos | null = null;

  mostrarAlertaExito = false;
  mensajeExito = '';
  mostrarAlertaError = false;
  mensajeError = '';
  mostrarAlertaWarning = false;
  mensajeWarning = '';

  mostrarConfirmacionEliminar = false;
  cargoEliminar: Cargos | null = null;

  page: number = 1;

  constructor(
    public table: ReactiveTableService<Cargos>,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    public floatingMenuService: FloatingMenuService // <-- Agrega el servicio aquí
  ) {
    this.cargardatos();
    this.table.setConfig(['carg_Id', 'carg_Descripcion']);
  }

  cambiarPagina(nuevaPagina: number): void {
    this.page = nuevaPagina;
    this.table.setPage(nuevaPagina);
  }

  crear(): void {
    this.showCreateForm = !this.showCreateForm;
    this.showEditForm = false;
    this.showDetailsForm = false;
    // Elimina activeActionRow
  }

  editar(cargo: Cargos): void {
    this.cargoEditando = { ...cargo };
    this.showEditForm = true;
    this.showCreateForm = false;
    this.showDetailsForm = false;
    // Elimina activeActionRow
  }

  detalles(cargo: Cargos): void {
    this.cargoDetalle = { ...cargo };
    this.showDetailsForm = true;
    this.showCreateForm = false;
    this.showEditForm = false;
    // Elimina activeActionRow
  }

  cerrarFormulario(): void {
    this.showCreateForm = false;
  }

  cerrarFormularioEdicion(): void {
    this.showEditForm = false;
    this.cargoEditando = null;
  }

  cerrarFormularioDetalles(): void {
    this.showDetailsForm = false;
    this.cargoDetalle = null;
  }

  guardarCargo(cargo: Cargos): void {
    this.cargardatos();
    this.cerrarFormulario();
  }

  actualizarCargo(cargo: Cargos): void {
    this.cargardatos();
    this.cerrarFormularioEdicion();
  }

  confirmarEliminar(cargo: Cargos): void {
    this.cargoEliminar = cargo;
    this.mostrarConfirmacionEliminar = true;
    // Elimina activeActionRow
  }

  cancelarEliminar(): void {
    this.mostrarConfirmacionEliminar = false;
    this.cargoEliminar = null;
  }

  eliminar(): void {
    if (!this.cargoEliminar) return;
    // Si tu API requiere POST, cambia PUT por POST aquí
    this.http.put(`${environment.apiBaseUrl}/Cargo/Eliminar/${this.cargoEliminar.carg_Id}`, {}, {
      headers: {
        'X-Api-Key': environment.apiKey,
        'accept': '*/*'
      }
    }).subscribe({
      next: (response: any) => {
        if (response.success && response.data) {
          if (response.data.code_Status === 1) {
            this.mensajeExito = `Cargo "${this.cargoEliminar!.carg_Descripcion}" eliminado exitosamente`;
            this.mostrarAlertaExito = true;
            setTimeout(() => {
              this.mostrarAlertaExito = false;
              this.mensajeExito = '';
            }, 3000);
            this.cargardatos();
            this.cancelarEliminar();
          } else if (response.data.code_Status === -1) {
            this.mostrarAlertaError = true;
            this.mensajeError = response.data.message_Status || 'No se puede eliminar: el cargo, está siendo utilizado.';
            setTimeout(() => {
              this.mostrarAlertaError = false;
              this.mensajeError = '';
            }, 5000);
            this.cancelarEliminar();
          } else if (response.data.code_Status === 0) {
            this.mostrarAlertaError = true;
            this.mensajeError = response.data.message_Status || 'Error al eliminar el cargo.';
            setTimeout(() => {
              this.mostrarAlertaError = false;
              this.mensajeError = '';
            }, 5000);
            this.cancelarEliminar();
          }
        } else {
          this.mostrarAlertaError = true;
          this.mensajeError = response.message || 'Error inesperado al eliminar el cargo.';
          setTimeout(() => {
            this.mostrarAlertaError = false;
            this.mensajeError = '';
          }, 5000);
          this.cancelarEliminar();
        }
      },
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
    try {
      if (!permisosRaw) return;
      const permisos = JSON.parse(permisosRaw);
      let modulo = null;
      if (Array.isArray(permisos)) {
        modulo = permisos.find((m: any) => m.Pant_Id === this.PANTALLA_CARGOS_ID);
      } else if (typeof permisos === 'object' && permisos !== null) {
        modulo = permisos['Cargos'] || permisos['cargos'] || null;
      }
      if (modulo && Array.isArray(modulo.Acciones)) {
        this.accionesDisponibles = modulo.Acciones
          .map((a: any) => a.Accion?.trim().toLowerCase())
          .filter((a: string) => !!a);
      }
    } catch (error) {
      this.accionesDisponibles = [];
    }
  }

  private cargardatos(): void {
    this.http.get<Cargos[]>(`${environment.apiBaseUrl}/Cargo/Listar`, {
      headers: { 'x-api-key': environment.apiKey }
    }).subscribe(data => {
      this.table.setData(data);
    });
  }
}