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
import { Traslado } from 'src/app/Modelos/logistica/TrasladoModel';
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

  // METODO PARA VALIDAR SI UNA ACCIÓN ESTÁ PERMITIDA
  accionPermitida(accion: string): boolean {
    return this.accionesDisponibles.some(a => a.trim().toLowerCase() === accion.trim().toLowerCase());
  }

  ngOnInit(): void {
    /**
     * BreadCrumb
     */
    this.breadCrumbItems = [
      { label: 'Logística' },
      { label: 'Traslados', active: true }
    ];

    // OBTENER ACCIONES DISPONIBLES DEL USUARIO
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

  editar(traslado: Traslado): void {
    console.log('Abriendo formulario de edición para:', traslado);
    console.log('Datos específicos:', {
      id: traslado.tras_Id,
      origen: traslado.origen,
      destino: traslado.destino,
      fecha: traslado.tras_Fecha,
      observaciones: traslado.tras_Observaciones,
      completo: traslado
    });
    this.trasladoEditando = { ...traslado }; // Hacer copia profunda
    this.showEditForm = true;
    this.showCreateForm = false; // Cerrar create si está abierto
    this.showDetailsForm = false; // Cerrar details si está abierto
    this.activeActionRow = null; // Cerrar menú de acciones
  }

  detalles(traslado: Traslado): void {
    console.log('Abriendo detalles para:', traslado);
    this.trasladoDetalle = { ...traslado }; // Hacer copia profunda
    this.showDetailsForm = true;
    this.showCreateForm = false; // Cerrar create si está abierto
    this.showEditForm = false; // Cerrar edit si está abierto
    this.activeActionRow = null; // Cerrar menú de acciones
  }
  
  constructor(public table: ReactiveTableService<Traslado>, 
    private http: HttpClient, 
    private router: Router, 
    private route: ActivatedRoute,
    public floatingMenuService: FloatingMenuService
  ) {
    this.cargardatos(true);
  }   

  activeActionRow: number | null = null;
  showEdit = true;
  showDetails = true;
  showDelete = true;
  showCreateForm = false; // Control del collapse
  showEditForm = false; // Control del collapse de edición
  showDetailsForm = false; // Control del collapse de detalles
  trasladoEditando: Traslado | null = null;
  trasladoDetalle: Traslado | null = null;
  
  // Propiedades para overlay de carga
  mostrarOverlayCarga = false;
  
  // Propiedades para alertas
  mostrarAlertaExito = false;
  mensajeExito = '';
  mostrarAlertaError = false;
  mensajeError = '';
  mostrarAlertaWarning = false;
  mensajeWarning = '';
  
  // Propiedades para confirmación de eliminación
  mostrarConfirmacionEliminar = false;
  trasladoAEliminar: Traslado | null = null;

  cerrarFormulario(): void {
    this.showCreateForm = false;
  }

  cerrarFormularioEdicion(): void {
    this.showEditForm = false;
    this.trasladoEditando = null;
  }

  cerrarFormularioDetalles(): void {
    this.showDetailsForm = false;
    this.trasladoDetalle = null;
  }

  guardarTraslado(traslado: Traslado): void {
    this.mostrarOverlayCarga = true;
    setTimeout(() => {
      console.log('Traslado guardado exitosamente desde create component:', traslado);
      this.cargardatos(false);
      this.showCreateForm = false;
      this.mensajeExito = `Traslado guardado exitosamente`;
      this.mostrarAlertaExito = true;
      setTimeout(() => {
        this.mostrarAlertaExito = false;
        this.mensajeExito = '';
      }, 3000);
    }, 1000);
  }

  actualizarTraslado(traslado: Traslado): void {
    this.mostrarOverlayCarga = true;
    setTimeout(() => {
      console.log('Traslado actualizado exitosamente desde edit component:', traslado);
      this.cargardatos(false);
      this.showEditForm = false;
      this.mensajeExito = `Traslado actualizado exitosamente`;
      this.mostrarAlertaExito = true;
      setTimeout(() => {
        this.mostrarAlertaExito = false;
        this.mensajeExito = '';
      }, 3000);
    }, 1000);
  }

  confirmarEliminar(traslado: Traslado): void {
    console.log('Solicitando confirmación para eliminar:', traslado);
    this.trasladoAEliminar = traslado;
    this.mostrarConfirmacionEliminar = true;
    this.activeActionRow = null; // Cerrar menú de acciones
  }

  cancelarEliminar(): void {
    this.mostrarConfirmacionEliminar = false;
    this.trasladoAEliminar = null;
  }

  eliminar(): void {
    if (!this.trasladoAEliminar) return;
    
    // Prevenir múltiples clicks - deshabilitar el botón
    if (this.mostrarOverlayCarga) return;
    
    console.log('Eliminando traslado:', this.trasladoAEliminar);
    this.mostrarOverlayCarga = true;
    
    // Cerrar el modal inmediatamente para evitar doble click
    const trasladoTemp = { ...this.trasladoAEliminar };
    this.mostrarConfirmacionEliminar = false;
    
    this.http.post(`${environment.apiBaseUrl}/Traslado/Eliminar/${trasladoTemp.tras_Id}`, {}, {
      headers: { 
        'X-Api-Key': environment.apiKey,
        'accept': '*/*'
      }
    }).subscribe({
      next: (response: any) => {
        setTimeout(() => {
          this.mostrarOverlayCarga = false;
          console.log('Respuesta del servidor:', response);
          
          // Limpiar variables
          this.trasladoAEliminar = null;
          
          // Verificar el código de estado en la respuesta
          if (response.success && response.data) {
            if (response.data.code_Status === 1) {
              // Éxito: eliminado correctamente
              console.log('Traslado eliminado exitosamente');
              this.mensajeExito = `Traslado del "${trasladoTemp.origen}" al "${trasladoTemp.destino}" eliminado exitosamente`;
              this.mostrarAlertaExito = true;
              
              // Ocultar la alerta después de 3 segundos
              setTimeout(() => {
                this.mostrarAlertaExito = false;
                this.mensajeExito = '';
              }, 3000);
              
              this.cargardatos(false);
            } else if (response.data.code_Status === -1) {
              //result: está siendo utilizado
              console.log('El traslado está siendo utilizado');
              this.mostrarAlertaError = true;
              this.mensajeError = response.data.message_Status || 'No se puede eliminar: el traslado está siendo utilizado.';
              
              setTimeout(() => {
                this.mostrarAlertaError = false;
                this.mensajeError = '';
              }, 5000);
            } else if (response.data.code_Status === 0) {
              // Error general
              console.log('Error general al eliminar');
              this.mostrarAlertaError = true;
              this.mensajeError = response.data.message_Status || 'Error al eliminar el traslado.';
              
              setTimeout(() => {
                this.mostrarAlertaError = false;
                this.mensajeError = '';
              }, 5000);
            }
          } else {
            // Respuesta inesperada
            console.log('Respuesta inesperada del servidor');
            this.mostrarAlertaError = true;
            this.mensajeError = response.message || 'Error inesperado al eliminar el traslado.';
            
            setTimeout(() => {
              this.mostrarAlertaError = false;
              this.mensajeError = '';
            }, 5000);
          }
        }, 1000);
      },
      error: (error) => {
        setTimeout(() => {
          this.mostrarOverlayCarga = false;
          this.trasladoAEliminar = null;
          console.error('Error en la petición:', error);
          this.mostrarAlertaError = true;
          this.mensajeError = 'Error de conexión al eliminar el traslado.';
          
          setTimeout(() => {
            this.mostrarAlertaError = false;
            this.mensajeError = '';
          }, 5000);
        }, 1000);
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

  // AQUI EMPIEZA LO BUENO PARA LAS ACCIONES
  private cargarAccionesUsuario(): void {
    // OBTENEMOS PERMISOSJSON DEL LOCALSTORAGE
    const permisosRaw = localStorage.getItem('permisosJson');
    console.log('Valor bruto en localStorage (permisosJson):', permisosRaw);
    let accionesArray: string[] = [];
    if (permisosRaw) {
      try {
        const permisos = JSON.parse(permisosRaw);
        // BUSCAMOS EL MÓDULO DE TRASLADOS
        let modulo = null;
        if (Array.isArray(permisos)) {
          // BUSCAMOS EL MÓDULO DE TRASLADOS POR ID (cambiar ID según corresponda)
          modulo = permisos.find((m: any) => m.Pant_Id === 15); // Ajustar ID según el módulo de traslados
        } else if (typeof permisos === 'object' && permisos !== null) {
          // ESTO ES PARA CUANDO LOS PERMISOS ESTÁN EN UN OBJETO CON CLAVES
          modulo = permisos['Traslados'] || permisos['traslados'] || null;
        }
        if (modulo && modulo.Acciones && Array.isArray(modulo.Acciones)) {
          // AQUI SACAMOS SOLO EL NOMBRE DE LA ACCIÓN
          accionesArray = modulo.Acciones.map((a: any) => a.Accion).filter((a: any) => typeof a === 'string');
          console.log('Acciones del módulo:', accionesArray);
        }
      } catch (e) {
        console.error('Error al parsear permisosJson:', e);
      }
    } 
    // AQUI FILTRAMOS Y NORMALIZAMOS LAS ACCIONES
    this.accionesDisponibles = accionesArray.filter(a => typeof a === 'string' && a.length > 0).map(a => a.trim().toLowerCase());
    console.log('Acciones finales:', this.accionesDisponibles);
  }

  // Declaramos un estado en el cargarDatos, esto para hacer el overlay
  // segun dicha funcion de recargar, ya que si vienes de hacer una accion
  // es innecesario mostrar el overlay de carga
  private cargardatos(state: boolean): void {
    this.mostrarOverlayCarga = state;
    this.http.get<Traslado[]>(`${environment.apiBaseUrl}/Traslado/Listar`, {
      headers: { 'x-api-key': environment.apiKey }
    }).subscribe(data => {
      setTimeout(() => {
        this.mostrarOverlayCarga = false;
        console.log('Datos recargados:', data);
        this.table.setData(data);
      }, 500);
    });
  }
}