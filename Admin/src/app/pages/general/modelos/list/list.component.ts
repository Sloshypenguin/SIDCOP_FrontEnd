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
import { Modelo } from 'src/app/Modelos/general/Modelo.Model';
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
  // Breadcrumb items
  breadCrumbItems!: Array<{}>;

  // Acciones disponibles para el usuario
  accionesDisponibles: string[] = [];

  // Form controls
  showCreateForm = false;
  showEditForm = false;
  showDetailsForm = false;
  modeloEditando: Modelo | null = null;
  modeloDetalle: Modelo | null = null;

  // Alertas
  mostrarAlertaExito = false;
  mensajeExito = '';
  mostrarAlertaError = false;
  mensajeError = '';
  mostrarAlertaWarning = false;
  mensajeWarning = '';

  // Confirmación eliminar
  mostrarConfirmacionEliminar = false;
  modeloAEliminar: Modelo | null = null;

  constructor(
    public table: ReactiveTableService<Modelo>,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    public floatingMenuService: FloatingMenuService
  ) {
    this.cargarDatos();
  }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'General' },
      { label: 'Modelos', active: true }
    ];
    this.cargarAccionesUsuario();
  }

  // Método para validar si una acción está permitida
  accionPermitida(accion: string): boolean {
    return this.accionesDisponibles.some(a => a.trim().toLowerCase() === accion.trim().toLowerCase());
  }

  // Métodos principales de CRUD
  crear(): void {
    this.showCreateForm = !this.showCreateForm;
    this.showEditForm = false;
    this.showDetailsForm = false;
  }

  editar(modelo: Modelo): void {
    this.modeloEditando = { ...modelo };
    this.showEditForm = true;
    this.showCreateForm = false;
    this.showDetailsForm = false;
  }

  detalles(modelo: Modelo): void {
    this.modeloDetalle = { ...modelo };
    this.showDetailsForm = true;
    this.showCreateForm = false;
    this.showEditForm = false;
  }

  confirmarEliminar(modelo: Modelo): void {
    this.modeloAEliminar = modelo;
    this.mostrarConfirmacionEliminar = true;
  }

  // Métodos para cerrar formularios
  cerrarFormulario(): void {
    this.showCreateForm = false;
  }

  cerrarFormularioEdicion(): void {
    this.showEditForm = false;
    this.modeloEditando = null;
  }

  cerrarFormularioDetalles(): void {
    this.showDetailsForm = false;
    this.modeloDetalle = null;
  }

  cancelarEliminar(): void {
    this.mostrarConfirmacionEliminar = false;
    this.modeloAEliminar = null;
  }

  // Métodos de respuesta de componentes hijos
  guardarModelo(modelo: Modelo): void {
    this.cargarDatos();
    this.cerrarFormulario();
    this.mostrarAlertaExito = true;
    this.mensajeExito = 'Modelo guardado exitosamente';
    setTimeout(() => this.mostrarAlertaExito = false, 3000);
  }

  actualizarModelo(modelo: Modelo): void {
    this.cargarDatos();
    this.cerrarFormularioEdicion();
    this.mostrarAlertaExito = true;
    this.mensajeExito = 'Modelo actualizado exitosamente';
    setTimeout(() => this.mostrarAlertaExito = false, 3000);
  }

  // Método de eliminación optimizado
  eliminar(): void {
    if (!this.modeloAEliminar) return;

    this.http.post(`${environment.apiBaseUrl}/Modelo/Eliminar?id=${this.modeloAEliminar.mode_Id}`, {}, {
      headers: {
        'X-Api-Key': environment.apiKey,
        'accept': '*/*'
      }
    }).subscribe({
      next: (response: any) => {
        // Extraer resultado del SP
        const resultado = this.extraerResultadoSP(response);
        
        if (resultado.code_Status === 1) {
          // Éxito
          this.mensajeExito = resultado.message_Status || 'Modelo eliminado correctamente.';
          this.mostrarAlertaExito = true;
          setTimeout(() => {
            this.mostrarAlertaExito = false;
            this.mensajeExito = '';
          }, 3000);
          this.cargarDatos();
          this.cancelarEliminar();
          
        } else {
          // Error (-1 o 0)
          this.mostrarAlertaError = true;
          this.mensajeError = resultado.message_Status || 'Error al eliminar el modelo.';
          setTimeout(() => {
            this.mostrarAlertaError = false;
            this.mensajeError = '';
          }, 5000);
          this.cancelarEliminar();
        }
      },
      error: (error) => {
        console.error('Error al eliminar modelo:', error);
        this.mostrarAlertaError = true;
        this.mensajeError = this.obtenerMensajeError(error);
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

  // Métodos privados de utilidad
  private extraerResultadoSP(response: any): any {
    if (response.data && typeof response.data === 'object') {
      return response.data;
    } else if (Array.isArray(response) && response.length > 0) {
      return response[0];
    }
    return response;
  }

  private obtenerMensajeError(error: any): string {
    if (error.status === 404) return 'El endpoint no fue encontrado.';
    if (error.status === 401) return 'No autorizado. Verifica tu API Key.';
    if (error.status === 400) return 'Petición incorrecta.';
    if (error.status === 500) return 'Error interno del servidor.';
    if (error.error?.message) return error.error.message;
    return 'Error de comunicación con el servidor.';
  }

  private cargarAccionesUsuario(): void {
    const permisosRaw = localStorage.getItem('permisosJson');
    let accionesArray: string[] = [];
    
    if (permisosRaw) {
      try {
        const permisos = JSON.parse(permisosRaw);
        let modulo = null;
        
        if (Array.isArray(permisos)) {
          modulo = permisos.find((m: any) => m.Pant_Id === 15);
        } else if (typeof permisos === 'object' && permisos !== null) {
          modulo = permisos['Modelos'] || permisos['modelos'] || null;
        }
        
        if (modulo?.Acciones && Array.isArray(modulo.Acciones)) {
          accionesArray = modulo.Acciones
            .map((a: any) => a.Accion)
            .filter((a: any) => typeof a === 'string');
        }
      } catch (e) {
        console.error('Error al parsear permisosJson:', e);
      }
    }
    
    this.accionesDisponibles = accionesArray
      .filter(a => typeof a === 'string' && a.length > 0)
      .map(a => a.trim().toLowerCase());
  }

  private cargarDatos(): void {
    this.http.get<Modelo[]>(`${environment.apiBaseUrl}/Modelo/Listar`, {
      headers: { 'x-api-key': environment.apiKey }
    }).subscribe({
      next: data => {
        this.table.setData(data);
      },
      error: error => {
        console.error('Error al cargar modelos:', error);
        this.table.setData([]);
      }
    });
  }
}