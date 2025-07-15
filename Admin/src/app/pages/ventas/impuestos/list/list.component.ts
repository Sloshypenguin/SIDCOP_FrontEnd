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
import { Impuestos } from 'src/app/Modelos/ventas/Impuestos.Model';
import { CreateComponent } from '../create/create.component';
//import { EditComponent } from '../edit/edit.component';
//import { DetailsComponent } from '../details/details.component';

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
    //CreateComponent,
  //  EditComponent,
   // DetailsComponent
  ],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  breadCrumbItems!: Array<{}>;

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Ventas' },
      { label: 'Impuestos', active: true }
    ];
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

  editar(impuesto: Impuestos): void {
    this.impuestoEditando = { ...impuesto };
    this.showEditForm = true;
    this.showCreateForm = false;
    this.showDetailsForm = false;
    this.activeActionRow = null;
  }

  detalles(impuesto: Impuestos): void {
    this.impuestoDetalle = { ...impuesto };
    this.showDetailsForm = true;
    this.showCreateForm = false;
    this.showEditForm = false;
    this.activeActionRow = null;
  }

  confirmarEliminar(impuesto: Impuestos): void {
    this.impuestoAEliminar = impuesto;
    this.mostrarConfirmacionEliminar = true;
    this.activeActionRow = null;
  }

  cancelarEliminar(): void {
    this.mostrarConfirmacionEliminar = false;
    this.impuestoAEliminar = null;
  }

  eliminar(): void {
    if (!this.impuestoAEliminar) return;

    this.http.post(`${environment.apiBaseUrl}/Impuestos/Eliminar/${this.impuestoAEliminar.impu_Id}`, {}, {
      headers: {
        'X-Api-Key': environment.apiKey,
        'accept': '*/*'
      }
    }).subscribe({
      next: (response: any) => {
        if (response.success && response.data) {
          const status = response.data.code_Status;
          const message = response.data.message_Status || '';
          if (status === 1) {
            this.mensajeExito = `Impuesto "${this.impuestoAEliminar!.impu_Descripcion}" eliminado exitosamente`;
            this.mostrarAlertaExito = true;
            setTimeout(() => this.cerrarAlerta(), 3000);
            this.cargardatos();
            this.cancelarEliminar();
          } else if (status === -1) {
            this.mensajeError = message || 'No se puede eliminar: el impuesto está siendo utilizado.';
            this.mostrarAlertaError = true;
            setTimeout(() => this.cerrarAlerta(), 5000);
            this.cancelarEliminar();
          } else {
            this.mensajeError = message || 'Error al eliminar el impuesto.';
            this.mostrarAlertaError = true;
            setTimeout(() => this.cerrarAlerta(), 5000);
            this.cancelarEliminar();
          }
        } else {
          this.mensajeError = response.message || 'Error inesperado al eliminar el impuesto.';
          this.mostrarAlertaError = true;
          setTimeout(() => this.cerrarAlerta(), 5000);
          this.cancelarEliminar();
        }
      }
    });
  }

  guardarImpuesto(impuesto: Impuestos): void {
    console.log('Impuesto guardado exitosamente desde create component:', impuesto);
    this.cargardatos();
    this.cerrarFormulario();
  }

  actualizarImpuesto(impuesto: Impuestos): void {
    console.log('Impuesto actualizado exitosamente desde edit component:', impuesto);
    this.cargardatos();
    this.cerrarFormularioEdicion();
  }

  cerrarFormulario(): void {
    this.showCreateForm = false;
  }

  cerrarFormularioEdicion(): void {
    this.showEditForm = false;
    this.impuestoEditando = null;
  }

  cerrarFormularioDetalles(): void {
    this.showDetailsForm = false;
    this.impuestoDetalle = null;
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

  private cargardatos(): void {
    this.http.get<Impuestos[]>(`${environment.apiBaseUrl}/Impuestos/Listar`, {
      headers: { 'x-api-key': environment.apiKey }
    }).subscribe(data => {
      this.table.setData(data);
    });
  }

  constructor(
    public table: ReactiveTableService<Impuestos>,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.cargardatos();
  }

  activeActionRow: number | null = null;
  showEdit = true;
  showDetails = true;
  showDelete = true;
  showCreateForm = false;
  showEditForm = false;
  showDetailsForm = false;

  impuestoEditando: Impuestos | null = null;
  impuestoDetalle: Impuestos | null = null;
  impuestoAEliminar: Impuestos | null = null;

  mostrarAlertaExito = false;
  mensajeExito = '';
  mostrarAlertaError = false;
  mensajeError = '';
  mostrarAlertaWarning = false;
  mensajeWarning = '';

  mostrarConfirmacionEliminar = false;
}
