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
import { CreateComponent } from '../create/create.component';
import { EditComponent } from '../edit/edit.component';
import { DetailsComponent } from '../details/details.component';

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
export class ListComponent {
  breadCrumbItems!: Array<{}>;
  accionesDisponibles: string [] = [];

  accionPermitida(accion: string): boolean {
    return this.accionesDisponibles.some(a => a.trim().toLowerCase() === accion.trim().toLowerCase());
  }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Acceso' },
      { label: 'Usuarios', active: true }
    ];

    this.cargarAccionesUsuario();
    console.log('Acciones disponibles:', this.accionesDisponibles);
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

    this.http.post(`${environment.apiBaseUrl}/Usuarios/Eliminar/${this.usuarioEliminar.usua_Id}`, {},{
      headers:{
        'X-Api-Key': environment.apiKey,
        'accept': '*/*'
      }
    }).subscribe({

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
    console.log('Valor bruto en localStorage (permisosJson):', permisosRaw);
    let accionesArray: string[] = [];
    if (permisosRaw) {
      try{
        const permisos = JSON.parse(permisosRaw);
        let modulo = null;
        if(Array.isArray(permisos)){
          modulo = permisos.find((m: any) => m.Pant_Id === 7);
          console.log('Modulo encontrado:', modulo);
        } else if (typeof permisos === 'object' && permisos !== null) {
          modulo = permisos['Usuarios'] || permisos['usuarios'] || null;
        }
        if (modulo && modulo.Acciones && Array.isArray(modulo.Acciones)) {
          accionesArray = modulo.Acciones.map((a: any) => a.accion).filter((a:any) => a && typeof a === 'string');
          console.log('Acciones encontradas:', accionesArray);
        }
      } catch (e) {
        console.error('Error al parsear permisosJson:', e);
      }
    }
    this.accionesDisponibles = accionesArray.filter(a => typeof a === 'string' && a.length > 0).map(a => a.trim().toLocaleLowerCase());
  }

  private cargarDatos(): void {
    this.http.get<Usuario[]>(`${environment.apiBaseUrl}/Usuarios/Listar`, {
      headers: { 'x-api-key': environment.apiKey }
    }).subscribe(data => {
      console.log('Datos recargados:', data);
      this.table.setData(data);
    });
  }
}
