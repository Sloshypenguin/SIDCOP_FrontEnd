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
import { Canal } from 'src/app/Modelos/general/Canal.Model';
import { CreateComponent } from '../create/create.component';
import { EditComponent } from '../edit/edit.component';
import { DetailsComponent } from '../details/details.component';

@Component({
  selector: 'app-list-canales',
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
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  breadCrumbItems!: Array<{}>;

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'General' },
      { label: 'Canales', active: true }
    ];
    this.cargardatos();
  }

  // Dropdown acciones
  activeActionRow: number | null = null;
  onActionMenuClick(rowIndex: number) {
    this.activeActionRow = this.activeActionRow === rowIndex ? null : rowIndex;
  }

  // Form controls
  showCreateForm = false;
  showEditForm = false;
  showDetailsForm = false;
  canalEditando: Canal | null = null;
  canalDetalle: Canal | null = null;

  // Alertas
  mostrarAlertaExito = false;
  mensajeExito = '';
  mostrarAlertaError = false;
  mensajeError = '';
  mostrarAlertaWarning = false;
  mensajeWarning = '';

  // Confirmación eliminar
  mostrarConfirmacionEliminar = false;
  canalAEliminar: Canal | null = null;

  constructor(
    public table: ReactiveTableService<Canal>,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  crear(): void {
    this.showCreateForm = !this.showCreateForm;
    this.showEditForm = false;
    this.showDetailsForm = false;
    this.activeActionRow = null;
  }

  editar(canal: Canal): void {
    this.canalEditando = { ...canal };
    this.showEditForm = true;
    this.showCreateForm = false;
    this.showDetailsForm = false;
    this.activeActionRow = null;
  }

  detalles(canal: Canal): void {
    this.canalDetalle = { ...canal };
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
    this.canalEditando = null;
  }

  cerrarFormularioDetalles(): void {
    this.showDetailsForm = false;
    this.canalDetalle = null;
  }

  guardarCanal(canal: Canal): void {
    this.cargardatos();
    this.cerrarFormulario();
    this.mostrarAlertaExito = true;
    this.mensajeExito = 'Canal guardado exitosamente';
    setTimeout(() => this.mostrarAlertaExito = false, 3000);
  }

  actualizarCanal(canal: Canal): void {
    this.cargardatos();
    this.cerrarFormularioEdicion();
    this.mostrarAlertaExito = true;
    this.mensajeExito = 'Canal actualizado exitosamente';
    setTimeout(() => this.mostrarAlertaExito = false, 3000);
  }

  confirmarEliminar(canal: Canal): void {
    this.canalAEliminar = canal;
    this.mostrarConfirmacionEliminar = true;
    this.activeActionRow = null;
  }

  cancelarEliminar(): void {
    this.mostrarConfirmacionEliminar = false;
    this.canalAEliminar = null;
  }

  eliminar(): void {
    if (!this.canalAEliminar) return;
    this.http.post(`${environment.apiBaseUrl}/Canal/Eliminar/${this.canalAEliminar.cana_Id}`, {}, {
      headers: {
        'X-Api-Key': environment.apiKey,
        'accept': '*/*'
      }
    }).subscribe({
      next: (response: any) => {
        if (response.success && response.data) {
          if (response.data.code_Status === 1) {
            this.mensajeExito = `Canal "${this.canalAEliminar!.cana_Descripcion}" eliminado exitosamente`;
            this.mostrarAlertaExito = true;
            setTimeout(() => {
              this.mostrarAlertaExito = false;
              this.mensajeExito = '';
            }, 3000);
            this.cargardatos();
            this.cancelarEliminar();
          } else if (response.data.code_Status === -1) {
            this.mostrarAlertaError = true;
            this.mensajeError = response.data.message_Status || 'No se puede eliminar: el canal está siendo utilizado.';
            setTimeout(() => {
              this.mostrarAlertaError = false;
              this.mensajeError = '';
            }, 5000);
            this.cancelarEliminar();
          } else if (response.data.code_Status === 0) {
            this.mostrarAlertaError = true;
            this.mensajeError = response.data.message_Status || 'Error al eliminar el canal.';
            setTimeout(() => {
              this.mostrarAlertaError = false;
              this.mensajeError = '';
            }, 5000);
            this.cancelarEliminar();
          }
        } else {
          this.mostrarAlertaError = true;
          this.mensajeError = response.message || 'Error inesperado al eliminar el canal.';
          setTimeout(() => {
            this.mostrarAlertaError = false;
            this.mensajeError = '';
          }, 5000);
          this.cancelarEliminar();
        }
      }
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

  private cargardatos(): void {
    this.http.get<Canal[]>(`${environment.apiBaseUrl}/Canal/Listar`, {
      headers: { 'x-api-key': environment.apiKey }
    }).subscribe(data => {
      this.table.setData(data);
    });
  }
}

