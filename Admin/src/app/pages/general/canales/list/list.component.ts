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
import { Canal } from 'src/app/Modelos/general/Canal.model';

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
    public table: ReactiveTableService<Canal>,
    private http: HttpClient
  ) {
    this.cargarDatos();
  }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'General' },
      { label: 'Canales', active: true }
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
  CanalEditando: Canal | null = null;
  CanalDetalle: Canal | null = null;

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
    this.showCreateForm = true;
    this.showEditForm = false;
    this.showDetailsForm = false;
    this.activeActionRow = null;
  }

  editar(canal: Canal): void {
    this.CanalEditando = { ...canal };
    this.showEditForm = true;
    this.showCreateForm = false;
    this.showDetailsForm = false;
    this.activeActionRow = null;
  }

  detalles(canal: Canal): void {
    this.CanalDetalle = { ...canal };
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
    this.CanalEditando = null;
  }

  cerrarFormularioDetalles(): void {
    this.showDetailsForm = false;
    this.CanalDetalle = null;
  }

  guardarCanal(canal: Canal): void {
    this.cargarDatos();
    this.cerrarFormulario();
  }

  actualizarCanal(canal: Canal): void {
    this.cargarDatos();
    this.cerrarFormularioEdicion();
  }

  confirmarEliminar(canal: Canal): void {
    this.CanalAEliminar = canal;
    this.mostrarConfirmacionEliminar = true;
    this.activeActionRow = null;
  }

  cancelarEliminar(): void {
    this.mostrarConfirmacionEliminar = false;
    this.CanalAEliminar = null;
  }

  eliminar(): void {
    // Aquí va la lógica de eliminación real
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
  CanalAEliminar: Canal | null = null;

  // =============================
  //  Carga inicial
  // =============================
  private cargarDatos(): void {
    this.http.get<any[]>(
      `${environment.apiBaseUrl}/Canal/Listar`,
      {
        headers: { 'x-api-key': environment.apiKey }
      }

    ).subscribe(data => {
      // Mapeo si es necesario, dependiendo de cómo venga la respuesta
      this.table.setData(data);
    });
  }
}