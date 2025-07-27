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
import { Vendedor } from 'src/app/Modelos/ventas/Vendedor.Model';
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
  //Animaciones para collapse
})
export class ListComponent implements OnInit {
  breadCrumbItems!: Array<{}>;
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

   ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Ventas' },
      { label: 'Vendedores', active: true }
    ];

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

  editar(vendedor: Vendedor): void {
    console.log('Abriendo formulario de edición para:', vendedor);
    console.log('Datos específicos:', {
      id: vendedor.vend_Id,
      completo: vendedor
    });
    this.vendedorEditando = { ...vendedor }; // Hacer copia profunda
    this.showEditForm = true;
    this.showCreateForm = false; // Cerrar create si está abierto
    this.showDetailsForm = false; // Cerrar details si está abierto
    this.activeActionRow = null; // Cerrar menú de acciones
  }

  detalles(vendedor: Vendedor): void {
    console.log('Abriendo detalles para:', vendedor);
    this.vendedorDetalle = { ...vendedor }; // Hacer copia profunda
    this.showDetailsForm = true;
    this.showCreateForm = false; // Cerrar create si está abierto
    this.showEditForm = false; // Cerrar edit si está abierto
    this.activeActionRow = null; // Cerrar menú de acciones
  }
  activeActionRow: number | null = null;
  showEdit = true;
  showDetails = true;
  showDelete = true;
  showCreateForm = false; // Control del collapse
  showEditForm = false; // Control del collapse de edición
  showDetailsForm = false; // Control del collapse de detalles
  vendedorEditando: Vendedor | null = null;
  vendedorDetalle: Vendedor | null = null;
  
  // Propiedades para alertas
    mostrarOverlayCarga = false;
  mostrarAlertaExito = false;
  mensajeExito = '';
  mostrarAlertaError = false;
  mensajeError = '';
  mostrarAlertaWarning = false;
  mensajeWarning = '';
  
  // Propiedades para confirmación de eliminación
  mostrarConfirmacionEliminar = false;
  vendedorEliminar: Vendedor | null = null;

  constructor(public table: ReactiveTableService<Vendedor>, private http: HttpClient, private router: Router, private route: ActivatedRoute, public floatingMenuService: FloatingMenuService) {
    this.cargardatos(true);

  }

   accionesDisponibles: string[] = [];

  // Método robusto para validar si una acción está permitida
  accionPermitida(accion: string): boolean {
    return this.accionesDisponibles.some(a => a.trim().toLowerCase() === accion.trim().toLowerCase());
  }

  onActionMenuClick(rowIndex: number) {
    this.activeActionRow = this.activeActionRow === rowIndex ? null : rowIndex;
  }

  // (navigateToCreate eliminado, lógica movida a crear)

  // (navigateToEdit y navigateToDetails eliminados, lógica movida a editar y detalles)

  cerrarFormulario(): void {
    this.showCreateForm = false;
  }

  cerrarFormularioEdicion(): void {
    this.showEditForm = false;
    this.vendedorEditando = null;
  }

  cerrarFormularioDetalles(): void {
    this.showDetailsForm = false;
    this.vendedorDetalle = null;
  }

  guardarVendedor(vendedor: Vendedor): void {
    console.log('Vendedor guardado exitosamente desde create component:', vendedor);
   this.mostrarOverlayCarga = true;
    setTimeout(()=> {
      this.cargardatos(false);
      this.showCreateForm = false;
      this.mensajeExito = `Vendedor guardado exitosamente`;
      this.mostrarAlertaExito = true;
      setTimeout(() => {
        this.mostrarAlertaExito = false;
        this.mensajeExito = '';
      }, 3000);
    }, 1000);
  }

  actualizarVendedor(vendedor: Vendedor): void {
    console.log('Vendedor actualizado exitosamente desde edit component:', vendedor);
    this.mostrarOverlayCarga = true;
    setTimeout(() => {
      this.cargardatos(false);
      this.showEditForm = false;
      this.mensajeExito = `Vendedor actualizado exitosamente`;
      this.mostrarAlertaExito = true;
      setTimeout(() => {
        this.mostrarAlertaExito = false;
        this.mensajeExito = '';
      }, 3000);
    }, 1000);
  }

  confirmarEliminar(vendedor: Vendedor): void {
    console.log('Solicitando confirmación para eliminar:', vendedor);
    this.vendedorEliminar = vendedor;
    this.mostrarConfirmacionEliminar = true;
    this.activeActionRow = null; // Cerrar menú de acciones
  }

  cancelarEliminar(): void {
    this.mostrarConfirmacionEliminar = false;
    this.vendedorEliminar = null;
  }

  eliminar(): void {
    if (!this.vendedorEliminar) return;
    
    console.log('Eliminando Vendedor:', this.vendedorEliminar);
       this.mostrarOverlayCarga = true;
    this.http.post(`${environment.apiBaseUrl}/Vendedores/Eliminar/${this.vendedorEliminar.vend_Id}`, {}, {
      headers: { 
        'X-Api-Key': environment.apiKey,
        'accept': '*/*'
      }
    }).subscribe({
      next: (response: any) => {
        setTimeout(() => {
        console.log('Respuesta del servidor:', response);
        
        // Verificar el código de estado en la respuesta
        if (response.success && response.data) {
          if (response.data.code_Status === 1) {
            // Éxito: eliminado correctamente
            console.log('Vendedor eliminada exitosamente');
            this.mensajeExito = `Vendedor "${this.vendedorEliminar!.vend_Nombres}" eliminada exitosamente`;
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
            console.log('el Vendedor está siendo utilizada');
            this.mostrarAlertaError = true;
            this.mensajeError = response.data.message_Status || 'No se puede eliminar: la Vendedor está siendo utilizada.';
            
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
            this.mensajeError = response.data.message_Status || 'Error al eliminar el Vendedor.';
            
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
          this.mensajeError = response.message || 'Error inesperado al eliminar la Vendedor.';
          
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
          modulo = permisos.find((m: any) => m.Pant_Id === 28);
        } else if (typeof permisos === 'object' && permisos !== null) {
          // Si es objeto, buscar por clave
          modulo = permisos['Vendedors'] || permisos['Vendedors'] || null;
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

  private cargardatos(state: boolean): void {
    this.mostrarOverlayCarga = state;
    this.http.get<Vendedor[]>(`${environment.apiBaseUrl}/Vendedores/Listar`, {
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
}