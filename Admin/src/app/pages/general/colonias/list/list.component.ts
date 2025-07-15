import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { BreadcrumbsComponent } from 'src/app/shared/breadcrumbs/breadcrumbs.component';
import { ReactiveTableService } from 'src/app/shared/reactive-table.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { TableModule } from 'src/app/pages/table/table.module';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { CreateComponent } from '../create/create.component';
import { EditComponent } from '../edit/edit.component';
import { DetailsComponent } from '../details/details.component';
import { Colonias } from 'src/app/Modelos/general/Colonias.Model';

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

  activeActionRow: number | null = null;
  showEdit = true;
  showDetails = true;
  showDelete = true;
  showCreateForm = false; // Control del collapse
  showEditForm = false; // Control del collapse de edición
  showDetailsForm = false; // Control del collapse de detalles
  coloniaEditando: Colonias | null = null;
  coloniaDetalle: Colonias | null = null;

  // Cierra el dropdown si se hace click fuera
  onDocumentClick(event: MouseEvent, rowIndex: number) {
    const target = event.target as HTMLElement;
    // Busca el dropdown abierto
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

  // Métodos para los botones de acción principales (crear, editar, detalles)
  crear(): void {
    console.log('Toggleando formulario de creación...');
    this.showCreateForm = !this.showCreateForm;
    this.showEditForm = false; // Cerrar edit si está abierto
    this.showDetailsForm = false; // Cerrar details si está abierto
    this.activeActionRow = null; // Cerrar menú de acciones
  }

  editar(colonia: Colonias): void {
    console.log('Abriendo formulario de edición para:', colonia);
    console.log('Datos específicos:', {
      codigo: colonia.colo_id,
      descripcion: colonia.colo_Descripcion,
      completo: colonia
    });
    this.coloniaEditando = { ...colonia }; // Hacer copia profunda
    this.showEditForm = true;
    this.showCreateForm = false; // Cerrar create si está abierto
    this.showDetailsForm = false; // Cerrar details si está abierto
    this.activeActionRow = null; // Cerrar menú de acciones
  }

   detalles(  colonia: Colonias): void {
    console.log('Abriendo detalles para:', colonia);
    this.coloniaDetalle = { ...colonia }; // Hacer copia profunda
    this.showDetailsForm = true;
    this.showCreateForm = false; // Cerrar create si está abierto
    this.showEditForm = false; // Cerrar edit si está abierto
    this.activeActionRow = null; // Cerrar menú de acciones
  }

  // Propiedades para alertas
  mostrarAlertaExito = false;
  mensajeExito = '';
  mostrarAlertaError = false;
  mensajeError = '';
  mostrarAlertaWarning = false;
  mensajeWarning = '';
  
  // Propiedades para confirmación de eliminación
  mostrarConfirmacionEliminar = false;
  coloniaAEliminar: Colonias | null = null;

  private cargardatos(): void {
    this.http.get<Colonias[]>(`${environment.apiBaseUrl}/Colonia/Listar`, {
      headers: { 'x-api-key': environment.apiKey }
    }).subscribe(data => {
      console.log('Datos recargados:', data);
      this.table.setData(data);
    });
  }

  constructor(public table: ReactiveTableService< Colonias>, private http: HttpClient, private router: Router, private route: ActivatedRoute) {
    this.cargardatos();
  }

   onActionMenuClick(rowIndex: number) {
    this.activeActionRow = this.activeActionRow === rowIndex ? null : rowIndex;
  }

  // (navigateToCreate eliminado, lógica movida a crear)

  // (navigateToEdit y navigateToDetails eliminados, lógica movida a editar y detalles)

  cerrarFormulario(): void {
    this.showCreateForm = false;
  }

  cerrarFormularioEdicion(): void {
    this.showEditForm = false;
    this.coloniaEditando = null;
  }

  cerrarFormularioDetalles(): void {
    this.showDetailsForm = false;
    this.coloniaDetalle = null;
  }

  guardarColonias(colonia: Colonias): void {
    console.log('colonia guardado exitosamente desde create component:', colonia);
    // Recargar los datos de la tabla
    this.cargardatos();
    this.cerrarFormulario();
  }

  actualizarColonias(colonia: Colonias): void {
    console.log('colonia actualizado exitosamente desde edit component:', colonia);
    // Recargar los datos de la tabla
    this.cargardatos();
    this.cerrarFormularioEdicion();
  }

  confirmarEliminar(  colonia: Colonias): void {
    console.log('Solicitando confirmación para eliminar:', colonia);
    this.coloniaAEliminar = colonia;
    this.mostrarConfirmacionEliminar = true;
    this.activeActionRow = null; // Cerrar menú de acciones
  }

  cancelarEliminar(): void {
    this.mostrarConfirmacionEliminar = false;
    this.coloniaAEliminar = null;
  }

  eliminar(): void {
    if (!this.coloniaAEliminar) return;
    
    console.log('Eliminando colonia:', this.coloniaAEliminar);
    
    this.http.post(`${environment.apiBaseUrl}/Colonias/Eliminar/${this.coloniaAEliminar.colo_id}`, {}, {
      headers: { 
        'X-Api-Key': environment.apiKey,
        'accept': '*/*'
      }
    }).subscribe({
      next: (response: any) => {
        console.log('Respuesta del servidor:', response);
        
        // Verificar el código de estado en la respuesta
        if (response.success && response.data) {
          if (response.data.code_Status === 1) {
            // Éxito: eliminado correctamente
            console.log('Municipio eliminado exitosamente');
            this.mensajeExito = `Municipio "${this.coloniaAEliminar!.colo_Descripcion}" eliminado exitosamente`;
            this.mostrarAlertaExito = true;
            
            // Ocultar la alerta después de 3 segundos
            setTimeout(() => {
              this.mostrarAlertaExito = false;
              this.mensajeExito = '';
            }, 3000);
            

            this.cargardatos();
            this.cancelarEliminar();
          } else if (response.data.code_Status === -1) {
            //result: está siendo utilizado
            console.log('Colonia está siendo utilizado');
            this.mostrarAlertaError = true;
            this.mensajeError = response.data.message_Status || 'No se puede eliminar: la colonia está siendo utilizado.';
            
            setTimeout(() => {
              this.mostrarAlertaError = false;
              this.mensajeError = '';
            }, 5000);
            
            // Cerrar el modal de confirmación
            this.cancelarEliminar();
          } else if (response.data.code_Status === 0) {
            // Error general
            console.log('Error general al eliminar');
            this.mostrarAlertaError = true;
            this.mensajeError = response.data.message_Status || 'Error al eliminar la colonia.';
            
            setTimeout(() => {
              this.mostrarAlertaError = false;
              this.mensajeError = '';
            }, 5000);
            
            // Cerrar el modal de confirmación
            this.cancelarEliminar();
          }
        } else {
          // Respuesta inesperada
          console.log('Respuesta inesperada del servidor');
          this.mostrarAlertaError = true;
          this.mensajeError = response.message || 'Error inesperado al eliminar la colonia.';
          
          setTimeout(() => {
            this.mostrarAlertaError = false;
            this.mensajeError = '';
          }, 5000);
          
          // Cerrar el modal de confirmación
          this.cancelarEliminar();
        }
      },
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

}
