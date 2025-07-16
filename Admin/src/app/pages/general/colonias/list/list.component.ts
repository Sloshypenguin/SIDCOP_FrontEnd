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
import { CreateComponent } from '../create/create.component';
import { EditComponent } from '../edit/edit.component';
import { DetailsComponent } from '../details/details.component';
import { Colonias } from 'src/app/Modelos/general/Colonias.Model';
import { Municipio } from 'src/app/Modelos/general/Municipios.Model';

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
  styleUrl: './list.component.scss'
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
    //const muni = this.municipios.find(m => m.muni_Codigo === colonia.muni_Codigo);
    this.coloniaDetalle = { 
      ...colonia, 
      //muni_Descripcion: muni ? muni.muni_Descripcion : 'N/A' 
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

  private cargardatos(): void {
    this.http.get<Colonias[]>(`${environment.apiBaseUrl}/Colonia/Listar`, {
      headers: { 'x-api-key': environment.apiKey }
    }).subscribe(data => {
      console.log('Datos recargados:', data);
      this.table.setData(data);
    });
  }

  constructor(public table: ReactiveTableService<Colonias>, private http: HttpClient, private router: Router, private route: ActivatedRoute) {}

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
    console.log('colonia guardado exitosamente desde create component:', colonia);
    // Recargar los datos de la tabla
    this.cargardatos();
    this.cerrarFormulario();
  }

  actualizarColonias(colonia: Colonias): void {
    console.log('colonia actualizado exitosamente desde edit component:', colonia);
    // Recargar los datos de la tabla
    this.cargardatos();
    this.cerrarFormularioEdicion();
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
    
    console.log('Eliminando colonia:', this.coloniaAEliminar);
    
    this.http.post(`${environment.apiBaseUrl}/Colonias/Eliminar/${this.coloniaAEliminar.colo_Id}`, {}, {
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
            console.log('Municipio eliminado exitosamente');
            this.mensajeExito = `Municipio "${this.coloniaAEliminar!.colo_Descripcion}" eliminado exitosamente`;
            this.mostrarAlertaExito = true;
            
            // Ocultar la alerta después de 3 segundos
            setTimeout(() => {
              this.mostrarAlertaExito = false;
              this.mensajeExito = '';
            }, 3000);
            

            this.cargardatos();
            this.cancelarEliminar();
          } else if (response.data.code_Status === -1) {
            //result: está siendo utilizado
            console.log('Colonia está siendo utilizado');
            this.mostrarAlertaError = true;
            this.mensajeError = response.data.message_Status || 'No se puede eliminar: la colonia está siendo utilizado.';
            
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
            this.mensajeError = response.data.message_Status || 'Error al eliminar la colonia.';
            
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
          this.mensajeError = response.message || 'Error inesperado al eliminar la colonia.';
          
          setTimeout(() => {
            this.mostrarAlertaError = false;
            this.mensajeError = '';
          }, 5000);
          
          // Cerrar el modal de confirmación
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

}
