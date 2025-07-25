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

import { ReactiveFormsModule } from '@angular/forms';
import { map, startWith } from 'rxjs';

import { NgSelectModule } from '@ng-select/ng-select';

import { CollapseModule } from 'ngx-bootstrap/collapse';
import { AccordionModule } from 'ngx-bootstrap/accordion';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [
    CommonModule,
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

  productosLista: any[] = [];
  clientesLista: any[] = [];
  canalesLista: any[] = [];
  listasAgrupadas: any[] = [];

  isCollapsedMap: { [key: number]: boolean } = {};
  canalCollapseStates: boolean[] = [];

  productoSeleccionado: any;

  breadCrumbItems!: Array<{}>;

  // Your existing Categoria-related code here (unchanged)...
  // ...

  constructor(private http: HttpClient) {
    this.breadCrumbItems = [
      { label: 'Ventas' },
      { label: 'Listas de Precios', active: true }
    ];

    this.cargarClientes();
    this.cargarProductos();
    this.cargarCanales();
  }

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
        this.canalesLista = data.map((canal: any) => ({
          ...canal,
          checked: false
        }));
        this.canalCollapseStates = this.canalesLista.map(() => false);
      },
      error: (error) => console.error('Error cargando canales:', error)
    });
  }

  cargarListasPrecios(): void {
    if (!this.productoSeleccionado) {
      this.listasAgrupadas = [];
      return;
    }

    this.http.get<any>(`${environment.apiBaseUrl}/PreciosPorProducto/ListarPorProducto?id=${this.productoSeleccionado.prod_Id}`, {
      headers: { 'x-api-key': environment.apiKey }
    }).subscribe({
      next: (data) => {
        const agrupadas = this.agruparListas(data);
        this.listasAgrupadas = agrupadas.map((grupo: any) => {
          const clientesChecked = grupo.items.map((item: any) => item.clie_Id);
          return {
            listaId: grupo.listaId,
            prod_Id: grupo.items[0].prod_Id,
            prod_Descripcion: grupo.items[0].nombreProducto || '',
            precioContado: grupo.items[0].preP_PrecioContado,
            precioCredito: grupo.items[0].preP_PrecioCredito,
            inicioEscala: grupo.items[0].preP_InicioEscala,
            finEscala: grupo.items[0].preP_FinEscala,
            clientesChecked,
            isCollapsed: false
          };
        });
      },
      error: (error) => console.error('Error cargando listas de precios:', error)
    });
  }

  agruparListas(data: any[]): any[] {
    const agrupadas: { [key: number]: any[] } = {};
    data.forEach((item) => {
      const key = item.preP_ListaPrecios;
      if (!agrupadas[key]) agrupadas[key] = [];
      agrupadas[key].push(item);
    });

    return Object.entries(agrupadas).map(([listaId, items]) => ({
      listaId: parseInt(listaId),
      items
    }));
  }

  getClientesPorCanal(canalId: number) {
    return this.clientesLista.filter(c => c.cana_Id === canalId);
  }

  isClienteChecked(lista: any, clienteId: number): boolean {
    return lista.clientesChecked.includes(clienteId);
  }

  isCanalFullyChecked(lista: any, canal: any): boolean {
  const clientes = this.getClientesPorCanal(canal.cana_Id);
  return clientes.length > 0 && clientes.every(c => this.isClienteChecked(lista, c.clie_Id));
}

  toggleParentCheckbox(lista: any, canal: any, event: any) {
    const checked = event.target.checked;
    const clientes = this.getClientesPorCanal(canal.cana_Id);
    clientes.forEach((c) => {
      if (this.isClienteChecked(lista, c.clie_Id)) return;
      if (checked) lista.clientesChecked.push(c.clie_Id);
      else lista.clientesChecked = lista.clientesChecked.filter((id: any) => id !== c.clie_Id);
    });
  }

  onChildCheckboxChange(lista: any, canal: any) {
    // Optional: implement indeterminate logic if needed
  }

  isIndeterminate(lista: any, canal: any): boolean {
    const clientes = this.getClientesPorCanal(canal.cana_Id);
    const checkedCount = clientes.filter(c => this.isClienteChecked(lista, c.clie_Id)).length;
    return checkedCount > 0 && checkedCount < clientes.length;
  }

  toggleCollapse(lista: any) {
    lista.isCollapsed = !lista.isCollapsed;
  }

  // *** New method triggered by product selection change ***
  onProductoChange(event: any) {
    // this.productoSeleccionado = prodId;
    this.cargarListasPrecios();
  }

}
