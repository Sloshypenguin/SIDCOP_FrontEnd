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
  // bread crumb items
  breadCrumbItems!: Array<{}>;

  // Acciones disponibles para el usuario en esta pantalla
  accionesDisponibles: string[] = [];

  // Método robusto para validar si una acción está permitida
  accionPermitida(accion: string): boolean {
    return this.accionesDisponibles.some(a => a.trim().toLowerCase() === accion.trim().toLowerCase());
  }

  ngOnInit(): void {
    /**
     * BreadCrumb
     */
    this.breadCrumbItems = [
      { label: 'General' },
      { label: 'Modelos', active: true }
    ];

    // Obtener acciones disponibles del usuario (ejemplo: desde API o localStorage)
    this.cargarAccionesUsuario();
    console.log('Acciones disponibles:', this.accionesDisponibles);
  }

  // Métodos para los botones de acción principales (crear, editar, detalles)
  crear(): void {
    console.log('Toggleando formulario de creación...');
    this.showCreateForm = !this.showCreateForm;
    this.showEditForm = false; // Cerrar edit si está abierto
    this.showDetailsForm = false; // Cerrar details si está abierto
    this.activeActionRow = null; // Cerrar menú de acciones
  }

  editar(modelo: Modelo): void {
    console.log('Abriendo formulario de edición para:', modelo);
    console.log('Datos específicos:', {
      id: modelo.mode_Id,
      descripcion: modelo.mode_Descripcion,
      marca: modelo.maVe_Marca,
      completo: modelo
    });
    this.modeloEditando = { ...modelo }; // Hacer copia profunda
    this.showEditForm = true;
    this.showCreateForm = false; // Cerrar create si está abierto
    this.showDetailsForm = false; // Cerrar details si está abierto
    this.activeActionRow = null; // Cerrar menú de acciones
  }

  detalles(modelo: Modelo): void {
    console.log('Abriendo detalles para:', modelo);
    this.modeloDetalle = { ...modelo }; // Hacer copia profunda
    this.showDetailsForm = true;
    this.showCreateForm = false; // Cerrar create si está abierto
    this.showEditForm = false; // Cerrar edit si está abierto
    this.activeActionRow = null; // Cerrar menú de acciones
  }

  constructor(public table: ReactiveTableService<Modelo>, 
    private http: HttpClient, 
    private router: Router, 
    private route: ActivatedRoute,
    public floatingMenuService: FloatingMenuService
  ) {
    this.cargarDatos();
  }

  activeActionRow: number | null = null;
  showEdit = true;
  showDetails = true;
  showDelete = true;
  showCreateForm = false; // Control del collapse
  showEditForm = false; // Control del collapse de edición
  showDetailsForm = false; // Control del collapse de detalles
  modeloEditando: Modelo | null = null;
  modeloDetalle: Modelo | null = null;

  // Propiedades para alertas
  mostrarAlertaExito = false;
  mensajeExito = '';
  mostrarAlertaError = false;
  mensajeError = '';
  mostrarAlertaWarning = false;
  mensajeWarning = '';

  // Propiedades para confirmación de eliminación
  mostrarConfirmacionEliminar = false;
  modeloAEliminar: Modelo | null = null;

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

  guardarModelo(modelo: Modelo): void {
    console.log('Modelo guardado exitosamente desde create component:', modelo);
    // Recargar los datos de la tabla
    this.cargarDatos();
    this.cerrarFormulario();
  }

  actualizarModelo(modelo: Modelo): void {
    console.log('Modelo actualizado exitosamente desde edit component:', modelo);
    // Recargar los datos de la tabla
    this.cargarDatos();
    this.cerrarFormularioEdicion();
  }

  confirmarEliminar(modelo: Modelo): void {
    console.log('Solicitando confirmación para eliminar:', modelo);
    this.modeloAEliminar = modelo;
    this.mostrarConfirmacionEliminar = true;
    this.activeActionRow = null; // Cerrar menú de acciones
  }

  cancelarEliminar(): void {
    this.mostrarConfirmacionEliminar = false;
    this.modeloAEliminar = null;
  }

  eliminar(): void {
    if (!this.modeloAEliminar) return;
    
    console.log('Eliminando modelo:', this.modeloAEliminar);
    
    this.http.post(`${environment.apiBaseUrl}/Modelo/Eliminar/${this.modeloAEliminar.mode_Id}`, {}, {
      headers: { 
        'X-Api-Key': environment.apiKey,
        'accept': '*/*'
      }
    }).subscribe({
      next: (response: any) => {
        console.log('Respuesta del servidor:', response);
        
        // Verificar el código de estado en la respuesta
        if (response.success && response.data) {
          if (response.data.code_Status === 1) {
            // Éxito: eliminado correctamente
            console.log('Modelo eliminado exitosamente');
            this.mensajeExito = `Modelo "${this.modeloAEliminar!.mode_Descripcion}" eliminado exitosamente`;
            this.mostrarAlertaExito = true;
            
            // Ocultar la alerta después de 3 segundos
            setTimeout(() => {
              this.mostrarAlertaExito = false;
              this.mensajeExito = '';
            }, 3000);
            
            this.cargarDatos();
            this.cancelarEliminar();
          } else if (response.data.code_Status === -1) {
            // Error: está siendo utilizado
            console.log('Modelo está siendo utilizado');
            this.mostrarAlertaError = true;
            this.mensajeError = response.data.message_Status || 'No se puede eliminar: el modelo está siendo utilizado.';
            
            setTimeout(() => {
              this.mostrarAlertaError = false;
              this.mensajeError = '';
            }, 5000);
            
            // Cerrar el modal de confirmación
            this.cancelarEliminar();
          } else if (response.data.code_Status === 0) {
            // Error general
            console.log('Error general al eliminar');
            this.mostrarAlertaError = true;
            this.mensajeError = response.data.message_Status || 'Error al eliminar el modelo.';
            
            setTimeout(() => {
              this.mostrarAlertaError = false;
              this.mensajeError = '';
            }, 5000);
            
            // Cerrar el modal de confirmación
            this.cancelarEliminar();
          }
        } else {
          // Respuesta inesperada
          console.log('Respuesta inesperada del servidor');
          this.mostrarAlertaError = true;
          this.mensajeError = response.message || 'Error inesperado al eliminar el modelo.';
          
          setTimeout(() => {
            this.mostrarAlertaError = false;
            this.mensajeError = '';
          }, 5000);
          
          // Cerrar el modal de confirmación
          this.cancelarEliminar();
        }
      },
      error: (error) => {
        console.error('Error al eliminar modelo:', error);
        this.mostrarAlertaError = true;
        this.mensajeError = 'Error de comunicación con el servidor.';
        
        setTimeout(() => {
          this.mostrarAlertaError = false;
          this.mensajeError = '';
        }, 5000);
        
        // Cerrar el modal de confirmación
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

  // Método para cargar las acciones disponibles del usuario
  private cargarAccionesUsuario(): void {
    // Obtener permisosJson del localStorage
    const permisosRaw = localStorage.getItem('permisosJson');
    console.log('Valor bruto en localStorage (permisosJson):', permisosRaw);
    let accionesArray: string[] = [];
    if (permisosRaw) {
      try {
        const permisos = JSON.parse(permisosRaw);
        // Buscar el módulo de Modelos (ajusta el nombre si es diferente)
        let modulo = null;
        if (Array.isArray(permisos)) {
          // Buscar por ID de pantalla (ajusta el ID según corresponda para Modelos)
          modulo = permisos.find((m: any) => m.Pant_Id === 15); // Cambiar ID según sea necesario
        } else if (typeof permisos === 'object' && permisos !== null) {
          // Si es objeto, buscar por clave
          modulo = permisos['Modelos'] || permisos['modelos'] || null;
        }
        if (modulo && modulo.Acciones && Array.isArray(modulo.Acciones)) {
          console.log('Acciones del módulo:', modulo.Acciones);
          // Extraer solo el nombre de la acción
          accionesArray = modulo.Acciones.map((a: any) => a.Accion).filter((a: any) => typeof a === 'string');
          console.log('Acciones del módulo:', accionesArray);
        }
      } catch (e) {
        console.error('Error al parsear permisosJson:', e);
      }
    }
    this.accionesDisponibles = accionesArray.filter(a => typeof a === 'string' && a.length > 0).map(a => a.trim().toLowerCase());
    console.log('Acciones finales:', this.accionesDisponibles);
  }

  private cargarDatos(): void {
    this.http.get<Modelo[]>(`${environment.apiBaseUrl}/Modelo/Listar`, {
      headers: { 'x-api-key': environment.apiKey }
    }).subscribe(data => {
      console.log('Datos recargados:', data);
      this.table.setData(data);
    });
  }
}