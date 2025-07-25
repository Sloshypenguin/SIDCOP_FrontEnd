import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { BreadcrumbsComponent } from 'src/app/shared/breadcrumbs/breadcrumbs.component';
import { ReactiveTableService } from 'src/app/shared/reactive-table.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { getUserId } from 'src/app/core/utils/user-utils';
import { TableModule } from 'src/app/pages/table/table.module';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { Usuario } from 'src/app/Modelos/acceso/usuarios.Model';
import { CreateComponent as CreateUsuarioComponent } from '../create/create.component';
import { EditComponent as EditUsuarioComponent} from '../edit/edit.component';
import { DetailsComponent } from '../details/details.component';
import { set } from 'lodash';
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
    CreateUsuarioComponent,
    EditUsuarioComponent,
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
export class ListComponent {
  breadCrumbItems!: Array<{}>;
  accionesDisponibles: string [] = [];

  busqueda: string = '';
  usuariosFiltrados: any[] = [];

  confirmaciondePassword: string = '';
  usuario: Usuario = {
    secuencia: 0,
    usua_Id: 0,
    usua_Usuario: '',
    usua_Clave: '',
    role_Id: 0,
    usua_IdPersona: 0,
    usua_EsVendedor: false,
    usua_EsAdmin: false,
    usua_Imagen: 'assets/images/users/32/user-dummy-img.jpg',
    usua_Creacion: 0,
    usua_FechaCreacion: new Date(),
    usua_Modificacion: 0,
    usua_FechaModificacion: new Date(),
    usua_Estado: true,
    permisosJson: '',
    role_Descripcion: '',
    nombreCompleto: '',
    code_Status: 0,
    message_Status: '',
  };

  accionPermitida(accion: string): boolean {
    return this.accionesDisponibles.some(a => a.trim().toLowerCase() === accion.trim().toLowerCase());
  }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Acceso' },
      { label: 'Usuarios', active: true }
    ];

    this.cargarAccionesUsuario();
    this.cargarDatos(true);
  }

  onDocumentClick(event: MouseEvent, rowIndex: number) {
    const target = event.target as HTMLElement;
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

  crear(): void {
    this.showCreateForm = !this.showCreateForm;
    this.showEditForm = false;
    this.showDetailsForm = false;
    this.activeActionRow = null;
  }

  editar(usuario: Usuario): void {
    this.usuarioEditando = { ...usuario };
    this.showEditForm = true;
    this.showCreateForm = false;
    this.showDetailsForm = false;
    this.activeActionRow = null;
  }

  detalles(usuario: Usuario): void {
    this.usuarioDetalles = { ...usuario };
    this.showDetailsForm = true;
    this.showCreateForm = false;
    this.showEditForm = false;
    this.activeActionRow = null;
  }

  activeActionRow: number | null = null;
  showCreateForm = false;
  showEditForm = false;
  showDetailsForm = false;
  usuarioEditando: Usuario | null = null;
  usuarioDetalles: Usuario | null = null;

  //Propiedades para las alertas
  mostrarErrores = false;
  mostrarOverlayCarga = false;
  mostrarAlertaExito = false;
  mensajeExito = '';
  mostrarAlertaError = false;
  mensajeError = '';
  mostrarAlertaWarning = false;
  mensajeWarning = '';

  mostrarConfirmacionEliminar = false;
  usuarioEliminar: Usuario | null = null;

  mostrarConfirmacionRestablecer = false;
  usuarioRestablecer: Usuario | null = null;


  constructor(public table: ReactiveTableService<Usuario>, private http: HttpClient, private router: Router, private route: ActivatedRoute){
    this.cargarDatos(true);
  }

  onActionMenuClick(rowIndex: number) {
    this.activeActionRow = this.activeActionRow === rowIndex ? null : rowIndex;
  }

  cerrarFormulario(): void {
    this.showCreateForm = false;
  }

  cerrarFormularioEdicion(): void {
    this.showEditForm = false;
    this.usuarioEditando = null;
  }

  cerrarFormularioDetalles(): void {
    this.showDetailsForm = false;
    this.usuarioDetalles = null;
  }

  guardarUsuario(usuario: Usuario): void {
    this.mostrarOverlayCarga = true;
    setTimeout(() => {
      this.cargarDatos(false);
      this.showCreateForm = false;
      this.mensajeExito = `Usuario guardado exitosamente`;
      this.mostrarAlertaExito = true;
      setTimeout(() => {
        this.mostrarAlertaExito = false;
        this.mensajeExito = '';
      }, 3000);
    },1000);
  }

  actualizarUsuario(usuario: Usuario): void {
    this.mostrarOverlayCarga = true;
    setTimeout(() => {
      this.cargarDatos(false);
      this.showEditForm = false;
      this.mensajeExito = `Usuario actualizado exitosamente`;
      this.mostrarAlertaExito = true;
      setTimeout(() => {
        this.mostrarAlertaExito = false;
        this.mensajeExito = '';
      }, 3000);
    },1000);
  }

  restablecer(usuario: Usuario): void{
    this.usuarioRestablecer = usuario;
    this.mostrarConfirmacionRestablecer = true;
    this.activeActionRow = null;
  }
  
  cancelarRestablecer(): void {
    this.mostrarConfirmacionRestablecer = false;
    this.usuarioRestablecer = null;
    this.confirmaciondePassword = '';
    this.usuario.usua_Clave = '';
    this.mostrarErrores = false;
  }

  confirmarEliminar(usuario: Usuario): void {
    this.usuarioEliminar = usuario;
    this.mostrarConfirmacionEliminar = true;
    this.activeActionRow = null;
  }

  cancelarEliminar(): void {
    this.mostrarConfirmacionEliminar = false;
    this.usuarioEliminar = null;
  }

  restablecerClave(): void {
    if(!this.usuarioRestablecer) return
    this.mostrarErrores = true;
    if (!this.usuario.usua_Clave.trim() || !this.confirmaciondePassword.trim()) {
      this.mostrarAlertaError = true;
      this.mensajeError = 'Debe ingresar y confirmar la nueva contraseña.';
      setTimeout(() => this.cerrarAlerta(), 4000);
      return;
    }
    if (this.usuario.usua_Clave !== this.confirmaciondePassword) {
      this.mostrarAlertaError = true;
      this.mensajeError = 'Las contraseñas no coinciden.';
      setTimeout(() => this.cerrarAlerta(), 4000);
      return;
    }
    const usuarioRestablecer: Usuario = {
      secuencia: 0,
      usua_Id: this.usuarioRestablecer.usua_Id,
      usua_Usuario: '',
      usua_Clave: this.confirmaciondePassword.trim(),
      role_Id: 0,
      usua_IdPersona: 0,
      usua_EsVendedor: false,
      usua_EsAdmin: false,
      usua_Imagen: '',
      usua_Creacion: getUserId(),
      usua_FechaCreacion: new Date(),
      usua_Modificacion: getUserId(),
      usua_FechaModificacion: new Date(),
      usua_Estado: true,
      permisosJson:"",
      role_Descripcion: '',
      nombreCompleto: '',
      code_Status: 0,
      message_Status: '',
    };
    this.mostrarOverlayCarga = true;
    this.http.post(`${environment.apiBaseUrl}/Usuarios/RestablecerClave`, usuarioRestablecer, {
      headers: {
        'X-Api-Key': environment.apiKey,
        'accept': '*/*'
      }
    }).subscribe({
      next: (response: any) => {
        setTimeout(() => {
          this.mostrarOverlayCarga = false;
          if (response.success && response.data) {
            if (response.data.code_Status === 1) {
              this.mensajeExito = `Clave del usuario restablecida exitosamente`;
              this.mostrarAlertaExito = true;
              setTimeout(() => {
                this.mostrarAlertaExito = false;
                this.mensajeExito = '';
              }, 3000);
              this.cargarDatos(false);
            } else if (response.data.code_Status === -1) {
              this.mostrarAlertaError = true;
              this.mensajeError = response.data.message_Status;
              setTimeout(() => {
                this.mostrarAlertaError = false;
                this.mensajeError = '';
              }, 5000);
            }
          } else {
            this.mostrarAlertaError = true;
            this.mensajeError = response.message || 'Error inesperado al restablecer la clave del usuario.';
            setTimeout(() => {
              this.mostrarAlertaError = false;
              this.mensajeError = '';
            }, 5000);
          }
          this.cancelarRestablecer();
        }, 1000);
      }
    });
  }

  eliminar(): void {
    if(!this.usuarioEliminar) return;
    const usuarioEliminar: Usuario = {
      secuencia: 0,
      usua_Id: this.usuarioEliminar.usua_Id,
      usua_Usuario: '',
      usua_Clave: '',
      role_Id: 0,
      usua_IdPersona: 0,
      usua_EsVendedor: false,
      usua_EsAdmin: false,
      usua_Imagen: '',
      usua_Creacion: getUserId(),
      usua_FechaCreacion: new Date(),
      usua_Modificacion: getUserId(),
      usua_FechaModificacion: new Date(),
      usua_Estado: true,
      permisosJson:"",
      role_Descripcion: '',
      nombreCompleto: '',
      code_Status: 0,
      message_Status: '',
    }
    this.mostrarOverlayCarga = true;
    this.http.post(`${environment.apiBaseUrl}/Usuarios/CambiarEstado`, usuarioEliminar,{
      headers:{
        'X-Api-Key': environment.apiKey,
        'accept': '*/*'
      }
    }).subscribe({
      next: (response: any) =>{
        setTimeout(() =>{
          this.mostrarOverlayCarga = false;
          if(response.success && response.data){
            if(response.data.code_Status === 1){
              if(this.usuarioEliminar!.usua_Estado) {
                this.mensajeExito = `Usuario "${this.usuarioEliminar!.usua_Usuario}" desactivado exitosamente`;
                this.mostrarAlertaExito = true;
              }
              if(!this.usuarioEliminar!.usua_Estado) {
                this.mensajeExito = `Usuario "${this.usuarioEliminar!.usua_Usuario}" activado exitosamente`;
                this.mostrarAlertaExito = true;
              }

              setTimeout(() => {
                this.mostrarAlertaExito = false;
                this.mensajeExito = '';
              }, 3000);

              this.cargarDatos(false);
              this.cancelarEliminar();
            }else if (response.data.code_Status === -1){
              this.mostrarAlertaError = true;
              this.mensajeError = response.data.message_Status;

              setTimeout(() => {
                this.mostrarAlertaError = false;
                this.mensajeError = '';
              }, 5000);

              this.cancelarEliminar();
            }
          } else {
            this.mostrarAlertaError = true;
            this.mensajeError = response.message || 'Error inesperado al cambiar el estado al usuario.';

            setTimeout(() => {
              this.mostrarAlertaError = false;
              this.mensajeError = '';
            }, 5000);

            this.cancelarEliminar();
          }
        },1000)
      }
    })
  }

  cerrarAlerta(): void{
    this.mostrarAlertaExito = false;
    this.mensajeExito = '';
    this.mostrarAlertaError = false;
    this.mensajeError = '';
    this.mostrarAlertaWarning = false;
    this.mensajeWarning = '';
  }

  private cargarAccionesUsuario(): void{
    const permisosRaw = localStorage.getItem('permisosJson');
    let accionesArray: string[] = [];
    if (permisosRaw) {
      try{
        const permisos = JSON.parse(permisosRaw);
        let modulo = null;
        if(Array.isArray(permisos)){
          modulo = permisos.find((m: any) => m.Pant_Id === 7);
        } else if (typeof permisos === 'object' && permisos !== null) {
          modulo = permisos['Usuarios'] || permisos['usuarios'] || null;
        }
        if (modulo && modulo.Acciones && Array.isArray(modulo.Acciones)) {
          accionesArray = modulo.Acciones.map((a: any) => a.Accion).filter((a:any) => typeof a === 'string');
        }
      } catch (e) {
        console.error('Error al parsear permisosJson:', e);
      }
    }
    this.accionesDisponibles = accionesArray.filter(a => typeof a === 'string' && a.length > 0).map(a => a.trim().toLocaleLowerCase());
  }

  usuarioGrid: any = [];
  usuarios: any = [];

  filtradorUsuarios(): void {
    const termino = this.busqueda.trim().toLowerCase();
    if (!termino) {
      this.usuariosFiltrados = this.usuarios;
    } else {
      this.usuariosFiltrados = this.usuarios.filter((usuario: any) =>
        (usuario.nombreCompleto || '').toLowerCase().includes(termino) ||
        (usuario.usua_Usuario || '').toLowerCase().includes(termino) ||
        (usuario.role_Descripcion || '').toLowerCase().includes(termino)
      );
    }
  }

  private cargarDatos(state: boolean): void {
    this.mostrarOverlayCarga = state;
    this.http.get<Usuario[]>(`${environment.apiBaseUrl}/Usuarios/Listar`, {
      headers: { 'x-api-key': environment.apiKey }
    }).subscribe(data => {
      setTimeout(() => {
        this.mostrarOverlayCarga = false;
        this.usuarioGrid = data || [];
        this.usuarios = this.usuarioGrid.slice(0, 12);
        this.filtradorUsuarios();
      },500);
    });
  }

  currentPage: number = 1;
  itemsPerPage: number = 12;

  get startIndex(): number {
    return this.usuarioGrid?.length ? ((this.currentPage - 1) * this.itemsPerPage) + 1 : 0;
  }

  get endIndex(): number {
    if (!this.usuarioGrid?.length) return 0;
    const end = this.currentPage * this.itemsPerPage;
    return end > this.usuarioGrid.length ? this.usuarioGrid.length : end;
  }

  pageChanged(event: any): void {
    this.currentPage = event.page;
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.usuarios = this.usuarioGrid.slice(startItem, endItem);
    this.filtradorUsuarios();
  }

  trackByUsuarioId(index: number, item: any): any {
    return item.usua_Id;
  }

  onImgError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = 'assets/images/users/32/user-dummy-img.jpg';
  }
}
