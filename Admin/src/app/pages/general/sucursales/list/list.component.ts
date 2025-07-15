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
import { Sucursales } from 'src/app/Modelos/general/Sucursales.Model';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    BreadcrumbsComponent,
    TableModule,
    PaginationModule
  ],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  breadCrumbItems!: Array<{}>;

  constructor(
    public table: ReactiveTableService<Sucursales>,
    private http: HttpClient
  ) {
    this.cargarDatos();
  }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'General' },
      { label: 'Sucursales', active: true }
    ];
  }

  // =============================
  //  Controles de visibilidad
  // =============================
  showCreateForm = false;
  showEditForm = false;
  showDetailsForm = false;

  // =============================
  //  Control de acciones visibles
  // =============================
  showEdit = true;
  showDelete = true;
  showDetails = true;

  // =============================
  //  Datos de edición y detalle
  // =============================
  SucursalesEditando: Sucursales | null = null;
  SucursalesDetalle: Sucursales | null = null;

  // =============================
  //  Row activo para menú
  // =============================
  activeActionRow: number | null = null;

  onActionMenuClick(rowIndex: number) {
    this.activeActionRow = this.activeActionRow === rowIndex ? null : rowIndex;
  }

  // =============================
  //  Funciones requeridas por el HTML
  // =============================

  crear(): void {
    console.log('Crear Sucursales');
    this.showCreateForm = true;
    this.showEditForm = false;
    this.showDetailsForm = false;
    this.activeActionRow = null;
  }

  editar(Sucursales: Sucursales): void {
    console.log('Editar Sucursales:', Sucursales);
    this.SucursalesEditando = { ...Sucursales };
    this.showEditForm = true;
    this.showCreateForm = false;
    this.showDetailsForm = false;
    this.activeActionRow = null;
  }

  detalles(Sucursales: Sucursales): void {
    console.log('Detalles del Sucursales:', Sucursales);
    this.SucursalesDetalle = { ...Sucursales };
    this.showDetailsForm = true;
    this.showCreateForm = false;
    this.showEditForm = false;
    this.activeActionRow = null;
  }

  cerrarFormulario(): void {
    this.showCreateForm = false;
  }

  cerrarFormularioEdicion(): void {
    this.showEditForm = false;
    this.SucursalesEditando = null;
  }

  cerrarFormularioDetalles(): void {
    this.showDetailsForm = false;
    this.SucursalesDetalle = null;
  }

  guardarSucursales(Sucursales: Sucursales): void {
    console.log('Sucursales guardado:', Sucursales);
    this.cargarDatos();
    this.cerrarFormulario();
  }

  actualizarSucursales(Sucursales: Sucursales): void {
    console.log('Sucursales actualizado:', Sucursales);
    this.cargarDatos();
    this.cerrarFormularioEdicion();
  }

  confirmarEliminar(Sucursales: Sucursales): void {
    console.log('Confirmar eliminación de Sucursales:', Sucursales);
    this.SucursalesAEliminar = Sucursales;
    this.mostrarConfirmacionEliminar = true;
    this.activeActionRow = null;
  }

  cancelarEliminar(): void {
    this.mostrarConfirmacionEliminar = false;
    this.SucursalesAEliminar = null;
  }

  eliminar(): void {
    console.log('Eliminar Sucursales:', this.SucursalesAEliminar);
    // A futuro: lógica de eliminación
    this.cancelarEliminar();
  }

  cerrarAlerta(): void {
    this.mostrarAlertaExito = false;
    this.mensajeExito = '';
    this.mostrarAlertaError = false;
    this.mensajeError = '';
    this.mostrarAlertaWarning = false;
    this.mensajeWarning = '';
  }

  // =============================
  //  Alertas y confirmación
  // =============================
  mostrarAlertaExito = false;
  mensajeExito = '';
  mostrarAlertaError = false;
  mensajeError = '';
  mostrarAlertaWarning = false;
  mensajeWarning = '';

  mostrarConfirmacionEliminar = false;
  SucursalesAEliminar: Sucursales | null = null;

  // =============================
  //  Carga inicial
  // =============================
private cargarDatos(): void {
  this.http.get<any[]>(
    `${environment.apiBaseUrl}/Sucursales/Listar`,
    {
      headers: { 'x-api-key': environment.apiKey }
    }
  ).subscribe(data => {
    console.log('Sucursaless recibidos:', data);
    this.table.setData(data);
  });
}
}