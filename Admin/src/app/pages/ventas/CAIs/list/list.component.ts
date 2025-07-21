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
import { CAIs } from 'src/app/Modelos/ventas/CAIs.Model';
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
      { label: 'CAIs', active: true }
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

  editar(cai: CAIs): void {
    console.log('Abriendo formulario de edición para:', cai);
    console.log('Datos específicos:', {
      id: cai.nCai_Id,
      codigo: cai.nCai_Codigo,
      descripcion: cai.nCai_Descripcion,
      completo: cai
    });
    this.caiEditando = { ...cai }; // Hacer copia profunda
    this.showEditForm = true;
    this.showCreateForm = false; // Cerrar create si está abierto
    this.showDetailsForm = false; // Cerrar details si está abierto
    this.activeActionRow = null; // Cerrar menú de acciones
  }

  detalles(cai: CAIs): void {
    console.log('Abriendo detalles para:', cai);
    this.caiDetalle = { ...cai }; // Hacer copia profunda
    this.showDetailsForm = true;
    this.showCreateForm = false; // Cerrar create si está abierto
    this.showEditForm = false; // Cerrar edit si está abierto
    this.activeActionRow = null; // Cerrar menú de acciones
  }

  constructor(
    public table: ReactiveTableService<CAIs>, 
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
  caiEditando: CAIs | null = null;
  caiDetalle: CAIs | null = null;
  
  // Propiedades para alertas
  mostrarAlertaExito = false;
  mensajeExito = '';
  mostrarAlertaError = false;
  mensajeError = '';
  mostrarAlertaWarning = false;
  mensajeWarning = '';
  
  // Propiedades para confirmación de eliminación
  mostrarConfirmacionEliminar = false;
  caiAEliminar: CAIs | null = null;

  cerrarFormulario(): void {
    this.showCreateForm = false;
  }

  cerrarFormularioEdicion(): void {
    this.showEditForm = false;
    this.caiEditando = null;
  }

  cerrarFormularioDetalles(): void {
    this.showDetailsForm = false;
    this.caiDetalle = null;
  }

  guardarCai(cai: CAIs): void {
    console.log('CAI guardado exitosamente desde create component:', cai);
    // Recargar los datos de la tabla
    this.cargarDatos();
    this.cerrarFormulario();
  }

  actualizarCai(cai: CAIs): void {
    console.log('CAI actualizado exitosamente desde edit component:', cai);
    // Recargar los datos de la tabla
    this.cargarDatos();
    this.cerrarFormularioEdicion();
  }

  confirmarEliminar(cai: CAIs): void {
    console.log('Solicitando confirmación para eliminar:', cai);
    this.caiAEliminar = cai;
    this.mostrarConfirmacionEliminar = true;
    this.activeActionRow = null; // Cerrar menú de acciones
  }

  cancelarEliminar(): void {
    this.mostrarConfirmacionEliminar = false;
    this.caiAEliminar = null;
  }

  eliminar(): void {
    if (!this.caiAEliminar) return;
    
    console.log('Eliminando CAI:', this.caiAEliminar);
    
    this.http.post(`${environment.apiBaseUrl}/CAIs/Eliminar/${this.caiAEliminar.nCai_Id}`, {}, {
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
            console.log('CAI eliminado exitosamente');
            this.mensajeExito = `CAI "${this.caiAEliminar!.nCai_Descripcion}" eliminado exitosamente`;
            this.mostrarAlertaExito = true;
            
            // Ocultar la alerta después de 3 segundos
            setTimeout(() => {
              this.mostrarAlertaExito = false;
              this.mensajeExito = '';
            }, 3000);
            
            this.cargarDatos();
            this.cancelarEliminar();
          } else if (response.data.code_Status === -1) {
            //result: está siendo utilizado
            console.log('CAI está siendo utilizado');
            this.mostrarAlertaError = true;
            this.mensajeError = response.data.message_Status || 'No se puede eliminar: el CAI está siendo utilizado.';
            
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
            this.mensajeError = response.data.message_Status || 'Error al eliminar el CAI.';
            
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
          this.mensajeError = response.message || 'Error inesperado al eliminar el CAI.';
          
          setTimeout(() => {
            this.mostrarAlertaError = false;
            this.mensajeError = '';
          }, 5000);
          
          // Cerrar el modal de confirmación
          this.cancelarEliminar();
        }
      },
      error: (error) => {
        console.error('Error en la petición:', error);
        this.mostrarAlertaError = true;
        this.mensajeError = 'Error de conexión al eliminar el CAI.';
        
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
        // Buscar el módulo de CAIs (ajusta el ID de pantalla si es diferente)
        let modulo = null;
        if (Array.isArray(permisos)) {
          // Buscar por ID de pantalla - ajusta este ID según corresponda a CAIs
          modulo = permisos.find((m: any) => m.Pant_Id === 16); // Cambia el ID según tu configuración
        } else if (typeof permisos === 'object' && permisos !== null) {
          // Si es objeto, buscar por clave
          modulo = permisos['CAIs'] || permisos['cais'] || null;
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
    this.http.get<CAIs[]>(`${environment.apiBaseUrl}/CAIs/Listar`, {
      headers: { 'x-api-key': environment.apiKey }
    }).subscribe(data => {
      console.log('Datos recargados:', data);
      this.table.setData(data);
    });
  }
}