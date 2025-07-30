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
import { CreateComponent } from '../create/create.component';
import { EditComponent } from '../edit/edit.component';
import { DetailsComponent } from '../details/details.component';
import { Departamento } from 'src/app/Modelos/general/Departamentos.Model';
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
  styleUrl: './list.component.scss',
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
  // Acciones disponibles para el usuario en esta pantalla
  accionesDisponibles: string[] = [];
  mostrarOverlayCarga= false;

  constructor(public table: ReactiveTableService<Departamento>, 
    private http: HttpClient, 
    private router: Router, 
    private route: ActivatedRoute,
    public floatingMenuService: FloatingMenuService
  ) {
    this.cargardatos(true);
  }
  
  // Método para verificar si una acción está permitida
  accionPermitida(accion: string): boolean {
    // Convertir a minúsculas para hacer la comparación insensible a mayúsculas
    const accionBuscada = accion.toLowerCase();
    // Mapear nombres de acciones si es necesario
    const accionesMapeadas: {[key: string]: string} = {
      'detalles': 'detalle',  // Mapear 'detalles' a 'detalle' si es necesario
      'nuevo': 'crear'       // Mapear 'nuevo' a 'crear' para el botón de nuevo
    };
    
    const accionReal = accionesMapeadas[accionBuscada] || accionBuscada;
    
    return this.accionesDisponibles.some(a => a === accionReal);
  }

  

  // Método para cargar las acciones disponibles del usuario
  cargarAccionesUsuario() {
    let accionesArray: string[] = [];
    let modulo: any = null;
    // Buscar permisos en localStorage - NOTA: La clave correcta es 'permisosJson'
    const permisosJson = localStorage.getItem('permisosJson');
    console.log('permisosJson del localStorage:', permisosJson);
    
    if (permisosJson) {
      try {
        const permisos = JSON.parse(permisosJson);
        console.log('permisos parseados:', permisos);
        
        if (Array.isArray(permisos)) {
          console.log('Buscando módulo con Pant_Id: 12');
          modulo = permisos.find((m: any) => {
            console.log('Revisando módulo:', m);
            return m.Pant_Id === 12;  // ID para Departamentos
          });
          console.log('Módulo encontrado (array):', modulo);
        } else if (typeof permisos === 'object' && permisos !== null) {
          // Si es objeto, buscar por clave
          console.log('Buscando módulo por clave');
          modulo = permisos['Departamentos'] || permisos['departamentos'] || null;
          console.log('Módulo encontrado (objeto):', modulo);
        }
        
        if (modulo) {
          console.log('Acciones en el módulo:', modulo.Acciones);
          if (modulo.Acciones && Array.isArray(modulo.Acciones)) {
            // Extraer solo el nombre de la acción y convertirlo a minúsculas
            accionesArray = modulo.Acciones
              .map((a: any) => {
                const accion = a.Accion || a.accion || a;
                console.log('Acción encontrada:', accion);
                return typeof accion === 'string' ? accion.trim().toLowerCase() : '';
              })
              .filter((a: string) => a.length > 0);
          }
        } else {
          console.log('No se encontró el módulo de Departamentos');
        }
      } catch (e) {
        console.error('Error al parsear permisosJson:', e);
      }
    } else {
      console.log('No se encontró el item permisosJson en localStorage');
    }
    
    this.accionesDisponibles = accionesArray;
    console.log('Acciones finales disponibles:', this.accionesDisponibles);
  }

  activeActionRow: number | null = null;
  showEdit = true;
  showDetails = true;
  showDelete = true;
  showCreateForm = false; // Control del collapse
  showEditForm = false; // Control del collapse de edición
  showDetailsForm = false; // Control del collapse de detalles
  departamentoEditando: Departamento | null = null;
  departamentoDetalle: Departamento | null = null;

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

  editar(departamento: Departamento): void {
    console.log('Abriendo formulario de edición para:', departamento);
    console.log('Datos específicos:', {
      codigo: departamento.depa_Codigo,
      descripcion: departamento.depa_Descripcion,
      completo: departamento
    });
    this.departamentoEditando = { ...departamento }; // Hacer copia profunda
    this.showEditForm = true;
    this.showCreateForm = false; // Cerrar create si está abierto
    this.showDetailsForm = false; // Cerrar details si está abierto
    this.activeActionRow = null; // Cerrar menú de acciones
  }

   detalles(departamento: Departamento): void {
    console.log('Abriendo detalles para:', departamento);
    this.departamentoDetalle = { ...departamento }; // Hacer copia profunda
    this.showDetailsForm = true;
    this.showCreateForm = false; // Cerrar create si está abierto
    this.showEditForm = false; // Cerrar edit si está abierto
    this.activeActionRow = null; // Cerrar menú de acciones
  }

  // Propiedades para alertas
  mostrarAlertaExito = false;
  mensajeExito = '';
  mostrarAlertaError = false;
  mensajeError = '';
  mostrarAlertaWarning = false;
  mensajeWarning = '';
  
  // Propiedades para confirmación de eliminación
  mostrarConfirmacionEliminar = false;
  departamentoAEliminar: Departamento | null = null;

  private cargardatos(state: boolean): void {
    this.mostrarOverlayCarga = state;
    this.http.get<Departamento[]>(`${environment.apiBaseUrl}/Departamentos/Listar`, {
      headers: { 'x-api-key': environment.apiKey }
    }).subscribe(data => {
      this.mostrarOverlayCarga = false;
      const tienePermisoListar = this.accionPermitida('listar');
        const userId = getUserId();

        const datosFiltrados = tienePermisoListar
          ? data
          : data.filter(r => r.usua_Creacion?.toString() === userId.toString());

        this.table.setData(datosFiltrados);
    });
  }

  ngOnInit(): void {
    // BreadCrumb (si aplica)
    // this.breadCrumbItems = [
    //   { label: 'General' },
    //   { label: 'Departamentos', active: true }
    // ];
    this.cargarAccionesUsuario();
    console.log('Acciones disponibles:', this.accionesDisponibles);
  }


  onActionMenuClick(rowIndex: number) {
    this.activeActionRow = this.activeActionRow === rowIndex ? null : rowIndex;
  }

  cerrarFormulario(): void {
    this.showCreateForm = false;
  }

  cerrarFormularioEdicion(): void {
    this.showEditForm = false;
    this.departamentoEditando = null;
  }

  cerrarFormularioDetalles(): void {
    this.showDetailsForm = false;
    this.departamentoDetalle = null;
  }

  guardarDepartamento(departamento: Departamento): void {
    console.log('Departamento guardado exitosamente desde create component:', departamento);
    this.mostrarOverlayCarga = true;
    setTimeout(()=> {
      this.cargardatos(false);
      this.showCreateForm = false;
      this.mensajeExito = `Bodega guardada exitosamente`;
      this.mostrarAlertaExito = true;
      setTimeout(() => {
        this.mostrarAlertaExito = false;
        this.mensajeExito = '';
      }, 3000);
    }, 1000);
  }

  actualizarDepartamento(departamento: Departamento): void {
    console.log('Departamento actualizado exitosamente desde edit component:', departamento);
    this.mostrarOverlayCarga = true;
    setTimeout(()=> {
      this.cargardatos(false);
      this.showEditForm = false;
      this.mensajeExito = `Departamento actualizado exitosamente`;
      this.mostrarAlertaExito = true;
      setTimeout(() => {
        this.mostrarAlertaExito = false;
        this.mensajeExito = '';
      }, 3000);
    }, 1000);
  }

  confirmarEliminar(departamento: Departamento): void {
    console.log('Solicitando confirmación para eliminar:', departamento);
    this.departamentoAEliminar = departamento;
    this.mostrarConfirmacionEliminar = true;
    this.activeActionRow = null; // Cerrar menú de acciones
  }

  cancelarEliminar(): void {
    this.mostrarConfirmacionEliminar = false;
    this.departamentoAEliminar = null;
  }

  eliminar(): void {
    if (!this.departamentoAEliminar) return;
    
    console.log('Eliminando departamento:', this.departamentoAEliminar);
    this.mostrarOverlayCarga = true;
    
    this.http.post(`${environment.apiBaseUrl}/Departamentos/Eliminar/${this.departamentoAEliminar.depa_Codigo}`, {}, {
      headers: { 
        'X-Api-Key': environment.apiKey,
        'accept': '*/*'
      }
    }).subscribe({
      next: (response: any) => {
        setTimeout(() => {
          this.cargardatos(false);
          console.log('Respuesta del servidor:', response);
          
          // Verificar el código de estado en la respuesta
          if (response.success && response.data) {
            if (response.data.code_Status === 1) {
              // Éxito: eliminado correctamente
              console.log('Departamento eliminado exitosamente');
              this.mensajeExito = `Departamento "${this.departamentoAEliminar!.depa_Descripcion}" eliminado exitosamente`;
              this.mostrarAlertaExito = true;

              // Ocultar la alerta después de 3 segundos
              setTimeout(() => {
                this.mostrarAlertaExito = false;
                this.mensajeExito = '';
              }, 3000);

              this.cargardatos(false);
              this.cancelarEliminar();
            } else if (response.data.code_Status === -1) {
              //result: está siendo utilizado
              console.log('El departamento está siendo utilizado');
              this.mostrarAlertaError = true;
              this.mensajeError = response.data.message_Status || 'No se puede eliminar: el departamento está siendo utilizado.';

              setTimeout(() => {
                this.mostrarAlertaError = false;
                this.mensajeError = '';
              }, 5000);

              // Cerrar el modal de confirmación
              this.cancelarEliminar();
            } else if (response.data.code_Status === 0) 
            {
              // Error general
              console.log('Error general al eliminar');
              this.mostrarAlertaError = true;
              this.mensajeError = response.data.message_Status || 'Error al eliminar el departamento.';

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
            this.mensajeError = response.message || 'Error inesperado al eliminar el departamento.';

            setTimeout(() => {
              this.mostrarAlertaError = false;
              this.mensajeError = '';
            }, 5000);

            // Cerrar el modal de confirmación
            this.cancelarEliminar();
          }
        }, 1000);
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
