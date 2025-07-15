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
import { CAIs } from 'src/app/Modelos/ventas/CAIs.Model';

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
    public table: ReactiveTableService<CAIs>,
    private http: HttpClient
  ) {
    this.cargarDatos();
  }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'General' },
      { label: 'CAIs', active: true }
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
  caiEditando: CAIs | null = null;
  caiDetalle: CAIs | null = null;

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
    console.log('Crear CAI');
    this.showCreateForm = true;
    this.showEditForm = false;
    this.showDetailsForm = false;
    this.activeActionRow = null;
  }

  editar(cai: CAIs): void {
    console.log('Editar CAI:', cai);
    this.caiEditando = { ...cai };
    this.showEditForm = true;
    this.showCreateForm = false;
    this.showDetailsForm = false;
    this.activeActionRow = null;
  }

  detalles(cai: CAIs): void {
    console.log('Detalles del CAI:', cai);
    this.caiDetalle = { ...cai };
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
    this.caiEditando = null;
  }

  cerrarFormularioDetalles(): void {
    this.showDetailsForm = false;
    this.caiDetalle = null;
  }

  guardarModelo(cai: CAIs): void {
    console.log('CAI guardado:', cai);
    this.cargarDatos();
    this.cerrarFormulario();
  }

  actualizarModelo(cai: CAIs): void {
    console.log('CAI actualizado:', cai);
    this.cargarDatos();
    this.cerrarFormularioEdicion();
  }

  confirmarEliminar(cai: CAIs): void {
    console.log('Confirmar eliminación de CAI:', cai);
    this.caiAEliminar = cai;
    this.mostrarConfirmacionEliminar = true;
    this.activeActionRow = null;
  }

  cancelarEliminar(): void {
    this.mostrarConfirmacionEliminar = false;
    this.caiAEliminar = null;
  }

  eliminar(): void {
    console.log('Eliminar CAI:', this.caiAEliminar);
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
  caiAEliminar: CAIs | null = null;

  // =============================
  //  Carga inicial
  // =============================
  private cargarDatos(): void {
    this.http.get<CAIs[]>(`${environment.apiBaseUrl}/CAIs/Listar`, {
      headers: { 'x-api-key': environment.apiKey }
    }).subscribe(data => {
      console.log('CAIs recibidos:', data);
      this.table.setData(data);
    });
  }
}
