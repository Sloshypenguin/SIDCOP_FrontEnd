

import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { BreadcrumbsComponent } from 'src/app/shared/breadcrumbs/breadcrumbs.component';
import { ReactiveTableService } from 'src/app/shared/reactive-table.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { TableModule } from 'src/app/pages/table/table.module';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { Categoria } from 'src/app/Modelos/inventario/CategoriaModel';
// import { CreateComponent } from '../create/create.component';
// import { EditComponent } from '../edit/edit.component';
// import { DetailsComponent } from '../details/details.component';

import { ReactiveFormsModule } from '@angular/forms';
import { map, startWith } from 'rxjs';

import { NgSelectModule } from '@ng-select/ng-select';

import { CollapseModule } from 'ngx-bootstrap/collapse';
import { AccordionModule } from 'ngx-bootstrap/accordion';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [CommonModule,
      FormsModule,
      RouterModule,
      BreadcrumbsComponent,
      TableModule,
      PaginationModule,
      ReactiveFormsModule,
      NgSelectModule,
      CollapseModule,
      AccordionModule
      
    ],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent {

  autoControl = new FormControl();

  productosLista: any[] = [];
  clientesLista: any[] = [];
  canalesLista: any[] = [];
  isCollapsed = false;

  productoSeleccionado:  any;

  canalCollapseStates: boolean[] = [];

  
  
    estadoCivilOriginal = '';
    mostrarErrores = false;
    mostrarAlertaExito = false;
    mensajeExito = '';
    mostrarAlertaError = false;
    mensajeError = '';
    mostrarAlertaWarning = false;
    mensajeWarning = '';
    mostrarConfirmacionEditar = false;

    breadCrumbItems!: Array<{}>;


  @Input() categoriaData: Categoria | null = null;
    @Output() onCancel = new EventEmitter<void>();
    @Output() onSave = new EventEmitter<Categoria>();
  
   categoria: Categoria = {
        
        cate_Id: 0,
        cate_Descripcion: '',
        usua_Creacion: 0,
        usua_Modificacion: 0,
        cate_FechaCreacion: new Date(),
        cate_FechaModificacion: new Date(),
        cate_Estado: false,
        code_Status: 0,
        message_Status: '',
        usuarioCreacion: '',
        usuarioModificacion: ''
  
    };
  
    cargarProductos(): void {
    this.http.get<any>(`${environment.apiBaseUrl}/Productos/Listar`, {
      headers: { 'x-api-key': environment.apiKey }
    }).subscribe({
      next: (data) => {
        this.productosLista = data;
        console.log('Productos cargados:', data);
        
      },
      
      error: (error) => console.error('Error cargando productos:', error)
    });
    
  }

  cargarClientes(): void {
    this.http.get<any>(`${environment.apiBaseUrl}/Cliente/Listar`, {
      headers: { 'x-api-key': environment.apiKey }
    }).subscribe({
      next: (data) => {
        // this.clientesLista = data;
        console.log('clientes cargados:', data);
        
        this.clientesLista = data.map((cliente: any) => ({
          ...cliente,
          checked: false
        }));
      },
      
      error: (error) => console.error('Error cargando clientes:', error)
    });
    
  }

  cargarCanales(): void {
    this.http.get<any>(`${environment.apiBaseUrl}/Canal/Listar`, {
      headers: { 'x-api-key': environment.apiKey }
    }).subscribe({
      next: (data) => {
        // this.canalesLista = data;


        this.canalesLista = data.map((canal: any) => ({
        ...canal,
        checked: false,
        indeterminate: false
        // children: (this.clientesLista || []).map((child: any) => ({
        //   ...child,
        //   checked: false
        // }))
      }));

      // Initialize collapse states
      this.canalCollapseStates = this.canalesLista.map(() => false);

        console.log('Canales listados:', data);
        
      },
      
      error: (error) => console.error('Error cargando canales:', error)
    });
    
  }

  getClientesPorCanal(canalId: number) {
  return this.clientesLista.filter(c => c.cana_Id === canalId);
}

  toggleParentCheckbox(canal: any, event: any) {
  const checked = event.target.checked;
  canal.checked = checked;
  canal.indeterminate = false;
  
  // Update all clients that belong to this canal
  const clientesDelCanal = this.getClientesPorCanal(canal.cana_Id);
  clientesDelCanal.forEach((cliente: any) => cliente.checked = checked);
}

  onChildCheckboxChange(canal: any) {
  const clientesDelCanal = this.getClientesPorCanal(canal.cana_Id);
  const allChecked = clientesDelCanal.every((cliente: any) => cliente.checked);
  const noneChecked = clientesDelCanal.every((cliente: any) => !cliente.checked);
  canal.checked = allChecked;
  canal.indeterminate = !allChecked && !noneChecked;
}

  isIndeterminate(canal: any): boolean {
  const clientesDelCanal = this.getClientesPorCanal(canal.cana_Id);
  const checkedCount = clientesDelCanal.filter((cliente: any) => cliente.checked).length;
  return checkedCount > 0 && checkedCount < clientesDelCanal.length;
}
  
    constructor(private http: HttpClient) {

      this.breadCrumbItems = [
      { label: 'Ventas' },
      { label: 'Listas de Precios', active: true }

    ];

    this.cargarClientes();

    this.cargarProductos();
    this.cargarCanales();
    

    }

    displayFn(option: any): string {
      return option && option.prod_Descripcion ? option.prod_Descripcion : '';
    }

    onOptionSelected(event: any) {
      this.productoSeleccionado = event.option.value;
    }
  
    ngOnChanges(changes: SimpleChanges): void {
      if (changes['categoriaData'] && changes['categoriaData'].currentValue) {
        this.categoria = { ...changes['categoriaData'].currentValue };
        this.estadoCivilOriginal = this.categoria.cate_Descripcion || '';
        this.mostrarErrores = false;
        this.cerrarAlerta();
      }
    }
  
    cancelar(): void {
      this.cerrarAlerta();
      this.onCancel.emit();
    }
  
    cerrarAlerta(): void {
      this.mostrarAlertaExito = false;
      this.mensajeExito = '';
      this.mostrarAlertaError = false;
      this.mensajeError = '';
      this.mostrarAlertaWarning = false;
      this.mensajeWarning = '';
    }
  
    validarEdicion(): void {
      this.mostrarErrores = true;
  
      if (this.categoria.cate_Descripcion.trim()) {
        if (this.categoria.cate_Descripcion.trim() !== this.estadoCivilOriginal) {
          this.mostrarConfirmacionEditar = true;
        } else {
          this.mostrarAlertaWarning = true;
          this.mensajeWarning = 'No se han detectado cambios.';
          setTimeout(() => this.cerrarAlerta(), 4000);
        }
      } else {
        this.mostrarAlertaWarning = true;
        this.mensajeWarning = 'Por favor complete todos los campos requeridos antes de guardar.';
        setTimeout(() => this.cerrarAlerta(), 4000);
      }
    }
  
    cancelarEdicion(): void {
      this.mostrarConfirmacionEditar = false;
    }
  
    confirmarEdicion(): void {
      this.mostrarConfirmacionEditar = false;
      this.guardar();
    }
  
    private guardar(): void {
      this.mostrarErrores = true;
  
      if (this.categoria.cate_Descripcion.trim()) {
        const estadoCivilActualizar = {
          cate_Id: this.categoria.cate_Id,
          cate_Descripcion: this.categoria.cate_Descripcion.trim(),
          usua_Creacion: this.categoria.usua_Creacion,
          cate_FechaCreacion: this.categoria.cate_FechaCreacion,
          usua_Modificacion: environment.usua_Id,
                  
          cate_FechaModificacion: new Date().toISOString(),
          usuarioCreacion: '',
          usuarioModificacion: ''
        };
  
        this.http.put<any>(`${environment.apiBaseUrl}/Categorias/Actualizar`, estadoCivilActualizar, {
          headers: {
            'X-Api-Key': environment.apiKey,
            'Content-Type': 'application/json',
            'accept': '*/*'
          }
        }).subscribe({
          next: (response) => {
            this.mensajeExito = `Categoria "${this.categoria.cate_Descripcion}" actualizado exitosamente`;
            this.mostrarAlertaExito = true;
            this.mostrarErrores = false;
  
            setTimeout(() => {
              this.mostrarAlertaExito = false;
              this.onSave.emit(this.categoria);
              this.cancelar();
            }, 3000);
          },
          error: (error) => {
            console.error('Error al actualizar estado civil:', error);
            this.mostrarAlertaError = true;
            this.mensajeError = 'Error al actualizar el estado civil. Por favor, intente nuevamente.';
            setTimeout(() => this.cerrarAlerta(), 5000);
          }
        });
      } else {
        this.mostrarAlertaWarning = true;
        this.mensajeWarning = 'Por favor complete todos los campos requeridos antes de guardar.';
        setTimeout(() => this.cerrarAlerta(), 4000);
      }
    }

}
