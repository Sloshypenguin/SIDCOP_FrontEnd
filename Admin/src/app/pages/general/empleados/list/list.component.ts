  
import { Component, ViewChild } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule, UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ModalModule, ModalDirective } from 'ngx-bootstrap/modal';
import { BreadcrumbsComponent } from 'src/app/shared/breadcrumbs/breadcrumbs.component';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { RatingModule } from 'ngx-bootstrap/rating';
import { NgSelectModule } from '@ng-select/ng-select';
import { FlatpickrModule } from 'angularx-flatpickr';
import { SimplebarAngularModule } from 'simplebar-angular';
import { DropzoneModule, DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { HttpClient } from '@angular/common/http';
import { cloneDeep } from 'lodash';
import { environment } from 'src/environments/environment';
import { isTrustedHtml } from 'ngx-editor/lib/trustedTypesUtil';
import { Empleado } from 'src/app/Modelos/general/Empleado.Model';

import { CreateComponent } from '../create/create.component';
import { DetailsComponent } from '../details/details.component';

@Component({
  standalone: true,
  selector: 'app-grid',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  providers: [DecimalPipe],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule,
    PaginationModule,
    BsDropdownModule,
    TabsModule,
    RatingModule,
    NgSelectModule,
    FlatpickrModule,
    SimplebarAngularModule,
    DropzoneModule,
    BreadcrumbsComponent,

    CreateComponent,
    DetailsComponent

  ]
})

// Grid Component

export class ListComponent {
  activeActionRow: number | null = null;
  showEdit = true;
  showDetails = true;
  showDelete = true;
  showCreateForm = false; // Control del collapse
  showEditForm = false; // Control del collapse de edición
  showDetailsForm = false; // Control del collapse de detalles
  isLoading = true;

  // Propiedades para alertas
  mostrarAlertaExito = false;
  mensajeExito = '';
  mostrarAlertaError = false;
  mensajeError = '';
  mostrarAlertaWarning = false;
  mensajeWarning = '';
  


  empleadoDetalle: Empleado | null = null;

  // Propiedades para confirmación de eliminación
    mostrarConfirmacionEliminar = false;
    empleadoAEliminar: Empleado | null = null;

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


  term: any;
  // bread crumb items
  breadCrumbItems!: Array<{}>;
  instuctoractivity: any;
  files: File[] = [];
  deleteID: any;

  GridForm!: UntypedFormGroup;
  submitted = false;
  masterSelected: boolean = false;
  instructorGrid: any = [];
  instructors: any = [];
  @ViewChild('addInstructor', { static: false }) addInstructor?: ModalDirective;
  @ViewChild('deleteRecordModal', { static: false }) deleteRecordModal?: ModalDirective;
  editData: any = null;

  constructor(private formBuilder: UntypedFormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    /**
     * BreadCrumb
     */
    this.breadCrumbItems = [
      { label: 'Instructors', active: true },
      { label: 'Grid View', active: true }
    ];

    /**
     * Form Validation
     */
    this.GridForm = this.formBuilder.group({
      id: [''],
      name: ['', [Validators.required]],
      email: ['', [Validators.required]],
      total_course: ['', [Validators.required]],
      experience: ['', [Validators.required]],
      students: ['', [Validators.required]],
      contact: ['', [Validators.required]],
      status: ['', [Validators.required]],
      img: ['']
    });
    this.cargardatos();
    document.getElementById('elmLoader')?.classList.add('d-none');
  }

  private cargardatos(): void {
    this.http.get<any[]>(`${environment.apiBaseUrl}/Empleado/Listar`, {
      headers: { 'x-api-key': environment.apiKey }
    }).subscribe(data => {
      this.instructorGrid = data || [];
      this.instructors = cloneDeep(this.instructorGrid.slice(0, 10));
      this.isLoading = false;
    });
  }

  // File Upload
  public dropzoneConfig: DropzoneConfigInterface = {
    clickable: true,
    addRemoveLinks: true,
    previewsContainer: false,
  };

  uploadedFiles: any[] = [];

  // File Upload
  imageURL: any;
  onUploadSuccess(event: any) {
    setTimeout(() => {
      this.uploadedFiles.push(event[0]);
      this.GridForm.controls['img'].setValue(event[0].dataURL);
    }, 0);
  }

  // File Remove
  removeFile(event: any) {
    this.uploadedFiles.splice(this.uploadedFiles.indexOf(event), 1);
  }

  // Edit Data
  editList(id: any) {
    this.uploadedFiles = [];
    this.addInstructor?.show();
    const modaltitle = document.querySelector('.modal-title') as HTMLAreaElement;
    if (modaltitle) modaltitle.innerHTML = 'Edit Product';
    const modalbtn = document.getElementById('add-btn') as HTMLAreaElement;
    if (modalbtn) modalbtn.innerHTML = 'Update';
    // Si id es índice
    this.editData = this.instructors[id];
    if (this.editData) {
      this.uploadedFiles.push({ 'dataURL': this.editData.img, 'name': this.editData.img_alt, 'size': 1024 });
      this.GridForm.patchValue(this.instructors[id]);
    }
  }

  

  // Delete Product
  removeItem(id: any) {
    this.deleteID = id;
    this.deleteRecordModal?.show();
  }

  confirmDelete() {
    this.deleteRecordModal?.hide();
  }

  // filterdata
  filterdata() {
    if (this.term) {
      this.instructors = this.instructorGrid.filter((el: any) => el.name?.toLowerCase().includes(this.term.toLowerCase()));
    } else {
      this.instructors = this.instructorGrid.slice(0, 10);
    }
    // noResultElement
    this.updateNoResultDisplay();
  }

  // no result 
  updateNoResultDisplay() {
    const noResultElement = document.querySelector('.noresult') as HTMLElement;
    const paginationElement = document.getElementById('pagination-element') as HTMLElement;
    if (noResultElement && paginationElement) {
      if (this.term && this.instructors.length === 0) {
        noResultElement.style.display = 'block';
        paginationElement.classList.add('d-none');
      } else {
        noResultElement.style.display = 'none';
        paginationElement.classList.remove('d-none');
      }
    }
  }

  // Page Changed
  pageChanged(event: any): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.instructors = this.instructorGrid.slice(startItem, endItem);
  }

  // Abre/cierra el menú de acciones para la fila seleccionada
  onActionMenuClick(rowIndex: number) {
    this.activeActionRow = this.activeActionRow === rowIndex ? null : rowIndex;
  }




  // Métodos para los botones de acción principales (crear, editar, detalles)
  crear(): void {
    console.log('Toggleando formulario de creación...');
    this.showCreateForm = !this.showCreateForm;
    this.showEditForm = false; // Cerrar edit si está abierto
    this.showDetailsForm = false; // Cerrar details si está abierto
    this.activeActionRow = null; // Cerrar menú de acciones
  }

  cerrarFormulario(): void {
    this.showCreateForm = false;
  }

  cerrarFormularioDetalles(): void {
    this.showDetailsForm = false;
    this.empleadoDetalle = null;
  }




  guardarEmpleado(empleado: Empleado): void {
    console.log('Estado civil guardado exitosamente desde create component:', empleado);
    // Recargar los datos de la tabla
    this.cargardatos();
    this.cerrarFormulario();
  }

  confirmarEliminar(empleado: Empleado): void {
    console.log('Solicitando confirmación para eliminar:', empleado);
    this.empleadoAEliminar = empleado;
    this.mostrarConfirmacionEliminar = true;
    this.activeActionRow = null; // Cerrar menú de acciones
  }

  cancelarEliminar(): void {
    this.mostrarConfirmacionEliminar = false;
    this.empleadoAEliminar = null;
  }

  eliminar(): void {
    if (!this.empleadoAEliminar) return;
    
    console.log('Eliminando estado civil:', this.empleadoAEliminar);
    
    this.http.post(`${environment.apiBaseUrl}/Empleado/Eliminar/${this.empleadoAEliminar.empl_Id}`, {}, {
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
            console.log('Empleado eliminado exitosamente');
            this.mensajeExito = `Empleado "${this.empleadoAEliminar!.empl_Nombres}" eliminado exitosamente`;
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
            console.log('El empleado está siendo utilizado');
            this.mostrarAlertaError = true;
            this.mensajeError = response.data.message_Status || 'No se puede eliminar: el empleado está siendo utilizado.';
            
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
            this.mensajeError = response.data.message_Status || 'Error al eliminar el empleado.';
            
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
          this.mensajeError = response.message || 'Error inesperado al eliminar el empleado.';
          
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



  //Detailss
  detalles(empleado: Empleado): void {
      console.log('Abriendo detalles para:', empleado);
      this.empleadoDetalle = { ...empleado }; // Hacer copia profunda
      this.showDetailsForm = true;
      this.showCreateForm = false; // Cerrar create si está abierto
      this.showEditForm = false; // Cerrar edit si está abierto
      this.activeActionRow = null; // Cerrar menú de acciones
    }
}
