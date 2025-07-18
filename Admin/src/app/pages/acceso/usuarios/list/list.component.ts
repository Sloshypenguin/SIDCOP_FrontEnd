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
import { Usuario } from 'src/app/Modelos/acceso/usuarios.Model';
import { CreateComponent as CreateUsuarioComponent } from '../create/create.component';
import { EditComponent } from '../edit/edit.component';
import { DetailsComponent } from '../details/details.component';
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
    CreateUsuarioComponent,
    EditComponent,
    DetailsComponent
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {
  breadCrumbItems!: Array<{}>;
  accionesDisponibles: string [] = [];

  busqueda: string = '';
  usuariosFiltrados: any[] = [];

  accionPermitida(accion: string): boolean {
    return this.accionesDisponibles.some(a => a.trim().toLowerCase() === accion.trim().toLowerCase());
  }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Acceso' },
      { label: 'Usuarios', active: true }
    ];

    this.cargarAccionesUsuario();
    this.cargarDatos();
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
  mostrarOverlayCarga = false;
  mostrarAlertaExito = false;
  mensajeExito = '';
  mostrarAlertaError = false;
  mensajeError = '';
  mostrarAlertaWarning = false;
  mensajeWarning = '';

  mostrarConfirmacionEliminar = false;
  usuarioEliminar: Usuario | null = null;


  constructor(public table: ReactiveTableService<Usuario>, private http: HttpClient, private router: Router, private route: ActivatedRoute){
    this.cargarDatos();
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
    this.cargarDatos();
    this.cerrarFormulario();
  }

  actualizarUsuario(usuario: Usuario): void {
    this.cargarDatos();
    this.cerrarFormularioEdicion();
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
      usua_Creacion: environment.usua_Id,
      usua_FechaCreacion: new Date(),
      usua_Modificacion: environment.usua_Id,
      usua_FechaModificacion: new Date(),
      usua_Estado: true,
      permisosJson:"",
      role_Descripcion: '',
      nombreCompleto: '',
      code_Status: 0,
      message_Status: '',
    }
    this.http.post(`${environment.apiBaseUrl}/Usuarios/CambiarEstado`, usuarioEliminar,{
      headers:{
        'X-Api-Key': environment.apiKey,
        'accept': '*/*'
      }
    }).subscribe({
      next: (response: any) =>{
        console.log('Respuesta del servidor:', response);
        if(response.success && response.data){
          if(response.data.code_Status === 1){
            if (this.usuarioEliminar!.usua_Estado) {
              this.mostrarOverlayCarga = true;
              setTimeout(() => {
                this.mostrarOverlayCarga = false;
                this.mensajeExito = `Usuario "${this.usuarioEliminar!.usua_Usuario}" desactivado exitosamente`;
                this.mostrarAlertaExito = true;
                setTimeout(() => {
                  this.mensajeExito = '';
                  this.mostrarAlertaExito = false;
                  this.cancelarEliminar();
                  this.cargarDatos();
                }, 2000);
              }, 3000);
            }
            if(!this.usuarioEliminar!.usua_Estado) {
              this.mensajeExito = `Usuario "${this.usuarioEliminar!.usua_Usuario}" activado exitosamente`;
              this.mostrarAlertaExito = true;
            }
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

  private cargarDatos(): void {
    this.http.get<Usuario[]>(`${environment.apiBaseUrl}/Usuarios/Listar`, {
      headers: { 'x-api-key': environment.apiKey }
    }).subscribe(data => {
      this.usuarioGrid = data || [];
      this.usuarios = this.usuarioGrid.slice(0, 10);
      this.filtradorUsuarios();
    });
  }

  currentPage: number = 1;
  itemsPerPage: number = 10;

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
