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
import { ConfiguracionFactura } from 'src/app/Modelos/ventas/ConfiguracionFactura.Model';
import { CreateComponent } from '../create/create.component';
import { EditConfigFacturaComponent } from '../edit/edit.component';
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
    EditConfigFacturaComponent,
DetailsComponent
  ],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  breadCrumbItems!: Array<{}>;
   // Acciones disponibles para el usuario en esta pantalla
  accionesDisponibles: string[] = [];

  // Método robusto para validar si una acción está permitida
  accionPermitida(accion: string): boolean {
    return this.accionesDisponibles.some(a => a.trim().toLowerCase() === accion.trim().toLowerCase());
  }
  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Ventas' },
      { label: 'ConfiguracionFactura', active: true }
    ];

        this.cargarAccionesUsuario();
    console.log('Acciones disponibles:', this.accionesDisponibles);
  }

  onDocumentClick(event: MouseEvent, rowIndex: number) {
    const target = event.target as HTMLElement;
    const dropdowns = document.querySelectorAll('.dropdown-action-list');
    let clickedInside = false;
    dropdowns.forEach((dropdown) => {
      if (dropdown.contains(target) && this.activeActionRow === rowIndex) {
        clickedInside = true;
      }
    });
    if (!clickedInside && this.activeActionRow === rowIndex) {
      this.activeActionRow = null;
    }
  }

  crear(): void {
    this.showCreateForm = !this.showCreateForm;
    this.showEditForm = false;
    this.showDetailsForm = false;
    this.activeActionRow = null;
  }

  editar(impuesto: ConfiguracionFactura): void {
    this.impuestoEditando = { ...impuesto };
    this.showEditForm = true;
    this.showCreateForm = false;
    this.showDetailsForm = false;
    this.activeActionRow = null;
  }

  detalles(impuesto: ConfiguracionFactura): void {
    this.impuestoDetalle = { ...impuesto };
    this.showDetailsForm = true;
    this.showCreateForm = false;
    this.showEditForm = false;
    this.activeActionRow = null;
  }

  confirmarEliminar(impuesto: ConfiguracionFactura): void {
    this.impuestoAEliminar = impuesto;
    this.mostrarConfirmacionEliminar = true;
    this.activeActionRow = null;
  }

  cancelarEliminar(): void {
    this.mostrarConfirmacionEliminar = false;
    this.impuestoAEliminar = null;
  }

  eliminar(): void {
    if (!this.impuestoAEliminar) return;

    this.http.post(`${environment.apiBaseUrl}/ConfiguracionFactura/Eliminar/${this.impuestoAEliminar.coFa_Id}`, {}, {
      headers: {
        'X-Api-Key': environment.apiKey,
        'accept': '*/*'
      }
    }).subscribe({
      next: (response: any) => {
        if (response.success && response.data) {
          const status = response.data.code_Status;
          const message = response.data.message_Status || '';
          if (status === 1) {
            this.mensajeExito = `Impuesto "${this.impuestoAEliminar!.coFa_NombreEmpresa}" eliminado exitosamente`;
            this.mostrarAlertaExito = true;
            setTimeout(() => this.cerrarAlerta(), 3000);
            this.cargardatos();
            this.cancelarEliminar();
          } else if (status === -1) {
            this.mensajeError = message || 'No se puede eliminar: el impuesto está siendo utilizado.';
            this.mostrarAlertaError = true;
            setTimeout(() => this.cerrarAlerta(), 5000);
            this.cancelarEliminar();
          } else {
            this.mensajeError = message || 'Error al eliminar el impuesto.';
            this.mostrarAlertaError = true;
            setTimeout(() => this.cerrarAlerta(), 5000);
            this.cancelarEliminar();
          }
        } else {
          this.mensajeError = response.message || 'Error inesperado al eliminar el impuesto.';
          this.mostrarAlertaError = true;
          setTimeout(() => this.cerrarAlerta(), 5000);
          this.cancelarEliminar();
        }
      }
    });
  }

  guardarImpuesto(impuesto: ConfiguracionFactura): void {
    console.log('Impuesto guardado exitosamente desde create component:', impuesto);
    this.cargardatos();
    this.cerrarFormulario();
  }

  actualizarImpuesto(impuesto: ConfiguracionFactura): void {
    console.log('Impuesto actualizado exitosamente desde edit component:', impuesto);
    this.cargardatos();
    this.cerrarFormularioEdicion();
  }

  cerrarFormulario(): void {
    this.showCreateForm = false;
  }

  cerrarFormularioEdicion(): void {
    this.showEditForm = false;
    this.impuestoEditando = null;
  }

  cerrarFormularioDetalles(): void {
    this.showDetailsForm = false;
    this.impuestoDetalle = null;
  }

  cerrarAlerta(): void {
    this.mostrarAlertaExito = false;
    this.mensajeExito = '';
    this.mostrarAlertaError = false;
    this.mensajeError = '';
    this.mostrarAlertaWarning = false;
    this.mensajeWarning = '';
  }

  onActionMenuClick(rowIndex: number) {
    this.activeActionRow = this.activeActionRow === rowIndex ? null : rowIndex;
  }

  private cargardatos(): void {
    this.http.get<ConfiguracionFactura[]>(`${environment.apiBaseUrl}/ConfiguracionFactura/Listar`, {
      headers: { 'x-api-key': environment.apiKey }
    }).subscribe(data => {
      this.table.setData(data);
    });
  }

  constructor(
    public table: ReactiveTableService<ConfiguracionFactura>,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.cargardatos();
  }

  activeActionRow: number | null = null;
  showEdit = true;
  showDetails = true;
  showDelete = true;
  showCreateForm = false;
  showEditForm = false;
  showDetailsForm = false;

  impuestoEditando: ConfiguracionFactura | null = null;
  impuestoDetalle: ConfiguracionFactura | null = null;
  impuestoAEliminar: ConfiguracionFactura | null = null;

  mostrarAlertaExito = false;
  mensajeExito = '';
  mostrarAlertaError = false;
  mensajeError = '';
  mostrarAlertaWarning = false;
  mensajeWarning = '';

  mostrarConfirmacionEliminar = false;


  // Método para cargar las acciones disponibles del usuario
  private cargarAccionesUsuario(): void {
    // Obtener permisosJson del localStorage
    const permisosRaw = localStorage.getItem('permisosJson');
    console.log('Valor bruto en localStorage (permisosJson):', permisosRaw);
    let accionesArray: string[] = [];
    if (permisosRaw) {
      try {
        const permisos = JSON.parse(permisosRaw);
        // Buscar el módulo de Estados Civiles (ajusta el nombre si es diferente)
        let modulo = null;
        if (Array.isArray(permisos)) {
          // Buscar por ID de pantalla (ajusta el ID si cambia en el futuro)
          modulo = permisos.find((m: any) => m.Pant_Id === 33);
        } else if (typeof permisos === 'object' && permisos !== null) {
          // Si es objeto, buscar por clave
          modulo = permisos['Configuracion de Facturas'] || permisos['configuracion de facturas'] || null;
        }
        if (modulo && modulo.Acciones && Array.isArray(modulo.Acciones)) {
          // Extraer solo el nombre de la acción
          accionesArray = modulo.Acciones.map((a: any) => a.Accion).filter((a: any) => typeof a === 'string');
        }
      } catch (e) {
        console.error('Error al parsear permisosJson:', e);
      }
    }
    this.accionesDisponibles = accionesArray.filter(a => typeof a === 'string' && a.length > 0).map(a => a.trim().toLowerCase());
    console.log('Acciones finales:', this.accionesDisponibles);
  }







}
