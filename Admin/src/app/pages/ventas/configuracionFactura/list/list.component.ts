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
import { ConfiguracionFactura } from 'src/app/Modelos/ventas/ConfiguracionFactura.Model';
import { CreateComponent } from '../create/create.component';
import { EditConfigFacturaComponent } from '../edit/edit.component';
import { DetailsComponent } from '../details/details.component';
import { FloatingMenuService } from 'src/app/shared/floating-menu.service';
 import { trigger,  state,  style,  transition,  animate} from '@angular/animations';
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
  breadCrumbItems!: Array<{}>;
   // Acciones disponibles para el usuario en esta pantalla
  accionesDisponibles: string[] = [];
  mostrarConfirmacionEliminar = false;
  configuracionAEliminar: ConfiguracionFactura | null = null;
  tieneRegistros: boolean = false;
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

  editar(ConfiguracioFactura: ConfiguracionFactura): void {
    this.ConfiguracioFacturaEditando = { ...ConfiguracioFactura };
    this.showEditForm = true;
    this.showCreateForm = false;
    this.showDetailsForm = false;
    this.activeActionRow = null;
  }

  detalles(ConfiguracioFactura: ConfiguracionFactura): void {
    this.ConfiguracioFacturaDetalle = { ...ConfiguracioFactura };
    this.showDetailsForm = true;
    this.showCreateForm = false;
    this.showEditForm = false;
    this.activeActionRow = null;
  }

  confirmarEliminar(Configuracion: ConfiguracionFactura): void {
    console.log('Solicitando confirmación para eliminar:', Configuracion);
    this.configuracionAEliminar = Configuracion;
    this.mostrarConfirmacionEliminar = true;
    this.activeActionRow = null; // Cerrar menú de acciones
  }

  

  cancelarEliminar(): void {
    this.mostrarConfirmacionEliminar = false;
    this.ConfiguracioFacturaAEliminar = null;
  }

eliminar(): void {
  if (!this.configuracionAEliminar) return;

  console.log('Eliminando configuración:', this.configuracionAEliminar);

this.http.post(`${environment.apiBaseUrl}/ConfiguracionFactura/Eliminar?id=${this.configuracionAEliminar.coFa_Id}`, 
  { }, 
  {
    headers: {
      'Content-Type': 'application/json',
      'X-Api-Key': environment.apiKey,
      'accept': '*/*'
    }
   }).subscribe({
      next: (response: any) => {
        setTimeout(() => {
          this.mostrarOverlayCarga = false;
          console.log('Respuesta del servidor:', response);
          const resultado = response.data;

          if (resultado.code_Status === 1) {
            // Éxito: eliminado correctamente
            console.log('Configuración eliminada exitosamente');
            this.mensajeExito = `Configuración "${this.configuracionAEliminar!.coFa_NombreEmpresa}" eliminada exitosamente`;
            this.mostrarAlertaExito = true;

            setTimeout(() => {
            
              this.mostrarAlertaExito = false;
              this.mensajeExito = '';
            }, 3000);

            this.cargardatos(true);
            this.cancelarEliminar();
          } else if (resultado.code_Status === -1) {
            // Está siendo utilizada
            console.log('La configuración de factura está siendo utilizada');
            this.mostrarAlertaError = true;
            this.mensajeError = resultado.message_Status || 'No se puede eliminar: la configuración de factura está siendo utilizada.';

            setTimeout(() => {
              this.mostrarAlertaError = false;
              this.mensajeError = '';
            }, 5000);

            this.cancelarEliminar();
          } else if (resultado.code_Status === 0) {
            // Error general
            console.log('Error general al eliminar');
            this.mostrarAlertaError = true;
            this.mensajeError = resultado.message_Status || 'Error al eliminar la configuración de factura.';

            setTimeout(() => {
              this.mostrarAlertaError = false;
              this.mensajeError = '';
            }, 5000);

            this.cancelarEliminar();
          } else {
            // Código de estado inesperado
            console.log('Código de estado inesperado:', resultado.code_Status);
            this.mostrarAlertaError = true;
            this.mensajeError = 'Código de estado inesperado en la respuesta del servidor.';

            setTimeout(() => {
              this.mostrarAlertaError = false;
              this.mensajeError = '';
            }, 5000);

            this.cancelarEliminar();
          }
        }, 500);
      },
     
    error: (error) => {
      console.error('Error al eliminar:', error);
      this.mostrarAlertaError = true;
      this.mensajeError = 'Ocurrió un error al intentar eliminar la configuración de factura.';

      setTimeout(() => {
        this.mostrarAlertaError = false;
        this.mensajeError = '';
      }, 5000);

      this.cancelarEliminar();
    }
  });
}


  onImgError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = 'assets/images/users/32/user-dummy-img.jpg';
  }
  guardarConfiguracioFactura(ConfiguracioFactura: ConfiguracionFactura): void {
    console.log('ConfiguracioFactura guardado exitosamente desde create component:', ConfiguracioFactura);
    this.cargardatos(false);
    this.cerrarFormulario();
  }

  actualizarConfiguracioFactura(ConfiguracioFactura: ConfiguracionFactura): void {
    console.log('ConfiguracioFactura actualizado exitosamente desde edit component:', ConfiguracioFactura);
    this.cargardatos(false);
    this.cerrarFormularioEdicion();
  }

  cerrarFormulario(): void {
     
    this.showCreateForm = false;
  }

  cerrarFormularioEdicion(): void {

    this.showEditForm = false;
    this.ConfiguracioFacturaEditando = null;
  }

  cerrarFormularioDetalles(): void {
    this.showDetailsForm = false;
    this.ConfiguracioFacturaDetalle = null;
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

/*
private cargardatos(state: boolean): void {
  this.mostrarOverlayCarga = state;

  this.http.get<ConfiguracionFactura[]>(`${environment.apiBaseUrl}/ConfiguracionFactura/Listar`, {
    headers: { 'x-api-key': environment.apiKey }
  }).subscribe({
    next: (data) => {
      const tienePermisoListar = this.accionPermitida('listar');
      const userId = getUserId();

      const datosFiltrados = tienePermisoListar
        ? data
        : data.filter(r => r.usua_Creacion?.toString() === userId.toString());

      this.table.setData(datosFiltrados);
    },
    error: (error) => {
      console.error('Error al cargar los datos:', error);
      this.mostrarOverlayCarga = false;
      this.mostrarAlertaError = true;
      this.mensajeError = 'Error al cargar los datos. Por favor, inténtelo de nuevo más tarde.';
      this.table.setData([]);
    },
    complete: () => {
      setTimeout(() => {
        this.mostrarOverlayCarga = false;
      }, 500);
    }
  });
 }

*/


private cargardatos(state: boolean): void {
  this.mostrarOverlayCarga = state;

  this.http.get<ConfiguracionFactura[]>(`${environment.apiBaseUrl}/ConfiguracionFactura/Listar`, {
    headers: { 'x-api-key': environment.apiKey }
  }).subscribe({
    next: (data) => {
      const tienePermisoListar = this.accionPermitida('listar');
      const userId = getUserId();

      const datosFiltrados = tienePermisoListar
        ? data
        : data.filter(r => r.usua_Creacion?.toString() === userId.toString());

      this.table.setData(datosFiltrados);
     
      this.tieneRegistros = datosFiltrados.length > 0;
    },
    error: (error) => {
      console.error('Error al cargar los datos:', error);
      this.mostrarOverlayCarga = false;
      this.mostrarAlertaError = true;
      this.mensajeError = 'Error al cargar los datos. Por favor, inténtelo de nuevo más tarde.';
      this.table.setData([]);
      this.tieneRegistros = false; 
    },
    complete: () => {
      setTimeout(() => {
        this.mostrarOverlayCarga = false;
      }, 500);
    }
  });
}
  constructor(
    public table: ReactiveTableService<ConfiguracionFactura>,
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
  showCreateForm = false;
  showEditForm = false;
  showDetailsForm = false;

  ConfiguracioFacturaEditando: ConfiguracionFactura | null = null;
  ConfiguracioFacturaDetalle: ConfiguracionFactura | null = null;
  ConfiguracioFacturaAEliminar: ConfiguracionFactura | null = null;

  mostrarAlertaExito = false;
  mensajeExito = '';
  mostrarAlertaError = false;
  mensajeError = '';
  mostrarAlertaWarning = false;
  mensajeWarning = '';

  mostrarOverlayCarga = false;

  // Método para cargar las acciones disponibles del usuario
  private cargarAccionesUsuario(): void {
    // Obtener permisosJson del localStorage
    const permisosRaw = localStorage.getItem('permisosJson');
    console.log('Valor bruto en localStorage (permisosJson):', permisosRaw);
    let accionesArray: string[] = [];
    if (permisosRaw) {
      try {
        const permisos = JSON.parse(permisosRaw);
        // Buscar el módulo (
        let modulo = null;
        if (Array.isArray(permisos)) {
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
