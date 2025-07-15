import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BreadcrumbsComponent } from 'src/app/shared/breadcrumbs/breadcrumbs.component';
import { ReactiveTableService } from 'src/app/shared/reactive-table.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { TableModule } from 'src/app/pages/table/table.module';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { Modelo } from 'src/app/Modelos/general/Modelo.Model';

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
    public table: ReactiveTableService<Modelo>,
    private http: HttpClient
  ) {
    this.cargarDatos();
  }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'General' },
      { label: 'Modelos', active: true }
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
  modeloEditando: Modelo | null = null;
  modeloDetalle: Modelo | null = null;

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
    console.log('Crear modelo');
    this.showCreateForm = true;
    this.showEditForm = false;
    this.showDetailsForm = false;
    this.activeActionRow = null;
  }

  editar(modelo: Modelo): void {
    console.log('Editar modelo:', modelo);
    this.modeloEditando = { ...modelo };
    this.showEditForm = true;
    this.showCreateForm = false;
    this.showDetailsForm = false;
    this.activeActionRow = null;
  }

  detalles(modelo: Modelo): void {
    console.log('Detalles del modelo:', modelo);
    this.modeloDetalle = { ...modelo };
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
    this.modeloEditando = null;
  }

  cerrarFormularioDetalles(): void {
    this.showDetailsForm = false;
    this.modeloDetalle = null;
  }

  guardarModelo(modelo: Modelo): void {
    console.log('Modelo guardado:', modelo);
    this.cargarDatos();
    this.cerrarFormulario();
  }

  actualizarModelo(modelo: Modelo): void {
    console.log('Modelo actualizado:', modelo);
    this.cargarDatos();
    this.cerrarFormularioEdicion();
  }

  confirmarEliminar(modelo: Modelo): void {
    console.log('Confirmar eliminación de modelo:', modelo);
    this.modeloAEliminar = modelo;
    this.mostrarConfirmacionEliminar = true;
    this.activeActionRow = null;
  }

  cancelarEliminar(): void {
    this.mostrarConfirmacionEliminar = false;
    this.modeloAEliminar = null;
  }

  eliminar(): void {
    console.log('Eliminar modelo:', this.modeloAEliminar);
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
  modeloAEliminar: Modelo | null = null;

  // =============================
  //  Carga inicial
  // =============================
  private cargarDatos(): void {
    this.http.get<Modelo[]>(`${environment.apiBaseUrl}/Modelo/Listar`, {
      headers: { 'x-api-key': environment.apiKey }
    }).subscribe(data => {
      console.log('Modelos recibidos:', data);
      this.table.setData(data);
    });
  }
}
