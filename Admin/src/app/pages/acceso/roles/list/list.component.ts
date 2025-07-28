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
import { Rol } from 'src/app/Modelos/acceso/roles.Model';
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
import { set } from 'lodash';

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
      { label: 'Acceso' },
      { label: 'Roles', active: true }
    ];

    // OBTENER ACCIONES DISPONIBLES DEL USUARIO
    this.cargarAccionesUsuario();
    // console.log('Acciones disponibles:', this.accionesDisponibles);
  }

  crear(): void {
    console.log('Toggleando formulario de creación...');
    this.showCreateForm = !this.showCreateForm;
    this.showEditForm = false;
    this.showDetailsForm = false;
    this.activeActionRow = null;
  }

  editar(rol: Rol): void {
    console.log('Datos específicos:', {
      id: rol.role_Id,
      descripcion: rol.role_Descripcion,
      completo: rol
    });
    this.rolEditando = { ...rol }; 
    this.showEditForm = true;
    this.showCreateForm = false; 
    this.showDetailsForm = false;
    this.activeActionRow = null; 
  }

  detalles(rol: Rol): void {
    this.rolDetalle = { ...rol };
    this.showDetailsForm = true;
    this.showCreateForm = false; 
    this.showEditForm = false; 
    this.activeActionRow = null;
  }
   constructor(public table: ReactiveTableService<Rol>, 
    private http: HttpClient, 
    private router: Router, 
    private route: ActivatedRoute,
    public floatingMenuService: FloatingMenuService
  )
    {
    this.cargardatos(true);
    this.cargarPantallas();
  }   

  activeActionRow: number | null = null;
  showEdit = true;
  showDetails = true;
  showDelete = true;
  showCreateForm = false; 
  showEditForm = false; 
  showDetailsForm = false;
  rolEditando: Rol | null = null;
  rolDetalle: Rol | null = null;
  
  mostrarAlertaExito = false;
  mostrarOverlayCarga = false;
  mensajeExito = '';
  mostrarAlertaError = false;
  mensajeError = '';
  mostrarAlertaWarning = false;
  mensajeWarning = '';
  
  mostrarConfirmacionEliminar = false;
  rolAEliminar: Rol | null = null;

  cerrarFormulario(): void {
    this.showCreateForm = false;
  }

  cerrarFormularioEdicion(): void {
    this.showEditForm = false;
    this.rolEditando = null;
  }

  cerrarFormularioDetalles(): void {
    this.showDetailsForm = false;
    this.rolDetalle = null;
  }

  guardarRol(rol: Rol): void {
    this.mostrarOverlayCarga = true;
    setTimeout(()=> {
      this.cargardatos(false);
      this.showCreateForm = false;
      this.mensajeExito = `Rol guardado exitosamente`;
      this.mostrarAlertaExito = true;
      setTimeout(() => {
        this.mostrarAlertaExito = false;
        this.mensajeExito = '';
      }, 3000);
    }, 1000);
  }

  actualizarRol(rol: Rol): void {
    this.mostrarOverlayCarga = true;
    setTimeout(() => {
      this.cargardatos(false);
      this.showEditForm = false;
      this.mensajeExito = `Rol actualizado exitosamente`;
      this.mostrarAlertaExito = true;
      setTimeout(() => {
        this.mostrarAlertaExito = false;
        this.mensajeExito = '';
      }, 3000);
    }, 1000);
  }

  confirmarEliminar(rol: Rol): void {
    this.rolAEliminar = rol;
    this.mostrarConfirmacionEliminar = true;
    this.activeActionRow = null; 
  }

  cancelarEliminar(): void {
    this.mostrarConfirmacionEliminar = false;
    this.rolAEliminar = null;
  }

  eliminar(): void {
    if (!this.rolAEliminar) return;
        
    this.mostrarOverlayCarga = true;
    this.http.post(`${environment.apiBaseUrl}/Roles/Eliminar/${this.rolAEliminar.role_Id}`, {}, {
      headers: { 
        'X-Api-Key': environment.apiKey,
        'accept': '*/*'
      }
    }).subscribe({
      next: (response: any) => {
        setTimeout(() => {
          this.mostrarOverlayCarga = false;
          console.log('Respuesta del servidor:', response);
        
          if (response.success && response.data) {
            if (response.data.code_Status === 1) {
              // Éxito: eliminado correctamente
              this.mensajeExito = `Rol "${this.rolAEliminar!.role_Descripcion}" eliminado exitosamente`;
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
              console.log('Rol está siendo utilizado');
              this.mostrarAlertaError = true;
              this.mensajeError = response.data.message_Status || 'No se puede eliminar: el rol está siendo utilizado.';
              
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
              this.mensajeError = response.data.message_Status || 'Error al eliminar el rol.';
              
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
            this.mensajeError = response.message || 'Error inesperado al eliminar el rol.';
            
            setTimeout(() => {
              this.mostrarAlertaError = false;
              this.mensajeError = '';
            }, 5000);
            
            // Cerrar el modal de confirmación
            this.cancelarEliminar();
          }
        })
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

  // AQUI EMPIEZA LO BUENO PARA LAS ACCIONES
  private cargarAccionesUsuario(): void {
    // OBTENEMOS PERMISOSJSON DEL LOCALSTORAGE
    const permisosRaw = localStorage.getItem('permisosJson');
    let accionesArray: string[] = [];
    if (permisosRaw) {
      try {
        const permisos = JSON.parse(permisosRaw);
        // BUSCAMOS EL MÓDULO DE ESTADOS CIVILES
        let modulo = null;
        if (Array.isArray(permisos)) {
          // BUSCAMOS EL MÓDULO DE ESTADOS CIVILES POR ID
          modulo = permisos.find((m: any) => m.Pant_Id === 6);
        } else if (typeof permisos === 'object' && permisos !== null) {
          // ESTO ES PARA CUANDO LOS PERMISOS ESTÁN EN UN OBJETO CON CLAVES
          modulo = permisos['Roles'] || permisos['roles'] || null;
        }
        if (modulo && modulo.Acciones && Array.isArray(modulo.Acciones)) {
          // AQUI SACAMOS SOLO EL NOMBRE DE LA ACCIÓN
          accionesArray = modulo.Acciones.map((a: any) => a.Accion).filter((a: any) => typeof a === 'string');
          // console.log('Acciones del módulo:', accionesArray);
        }
      } catch (e) {
        console.error('Error al parsear permisosJson:', e);
      }
    } 
    // AQUI FILTRAMOS Y NORMALIZAMOS LAS ACCIONES
    this.accionesDisponibles = accionesArray.filter(a => typeof a === 'string' && a.length > 0).map(a => a.trim().toLowerCase());
    // console.log('Acciones finales:', this.accionesDisponibles);
  }

  private cargardatos(state: boolean): void {
    this.mostrarOverlayCarga = state;
    this.http.get<Rol[]>(`${environment.apiBaseUrl}/Roles/Listar`, {
      headers: { 'x-api-key': environment.apiKey }
    }).subscribe(data => {
      setTimeout(() => {
        this.mostrarOverlayCarga = false;
         const tienePermisoListar = this.accionPermitida('listar');
        const userId = getUserId();

        const datosFiltrados = tienePermisoListar
          ? data
          : data.filter(r => r.usua_Creacion?.toString() === userId.toString());

        this.table.setData(datosFiltrados);
        this.table.setData(data);
      },500);
    });
  }

  private cargarPantallas(): void {
    this.http.get(`${environment.apiBaseUrl}/Roles/ListarPantallas`, {
      headers: { 'x-api-key': environment.apiKey },
      responseType: 'text' // <-- Recibe como texto
    }).subscribe({
      next: raw => {
        try {
          // Intenta arreglar el JSON agregando corchetes si es necesario
          let data = raw.trim();
          if (!data.startsWith('[')) {
            data = `[${data}]`;
          }
          const parsed = JSON.parse(data);
          // console.log('Pantallas cargadas:', parsed);
          // Aquí podrías hacer algo con los datos de las pantallas si es necesario
        } catch (e) {
          console.error('No se pudo parsear la respuesta de pantallas:', e, raw);
        }
      },
      error: err => {
        console.error('Error al cargar pantallas:', err);
      }
    });
  }
}

