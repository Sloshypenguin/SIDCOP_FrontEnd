import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BreadcrumbsComponent } from 'src/app/shared/breadcrumbs/breadcrumbs.component';
import { TableModule } from 'src/app/pages/table/table.module';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { getUserId } from 'src/app/core/utils/user-utils';

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
  nocreando : boolean = true;

  productoSeleccionado: any;
  breadCrumbItems!: Array<{}>;

  isCreatingNewLista = false;
  newLista = {
    precioContado: null,
    precioCredito: null,
    inicioEscala: null,
    finEscala: null,
    canalesOpen: {} as { [key: number]: boolean },
    clientesChecked: [] as number[]
  };

  createError = '';
  inputErrors = {
    precioContado: '',
    precioCredito: '',
    inicioEscala: '',
    finEscala: '',
    clientesChecked: ''
  };

  noListasMsg = '';

  mostrarAlertaExito = false;
  mensajeExito = '';
  mostrarAlertaError = false;
  mensajeError = '';
  mostrarAlertaWarning = false;
  mensajeWarning = '';

  mostrarConfirmacionGuardar = false;
listaAGuardar: any = null;

abrirModalGuardarCambios(lista: any) {
  this.listaAGuardar = lista;
  this.mostrarConfirmacionGuardar = true;
}

cancelarGuardarCambios() {
  this.mostrarConfirmacionGuardar = false;
  this.listaAGuardar = null;
}

confirmarGuardarCambios() {
  this.mostrarConfirmacionGuardar = false;
  if (this.listaAGuardar) {
    this.guardarCambios(this.listaAGuardar);
    this.listaAGuardar = null;
  }
}

  cerrarAlerta(): void {
    this.mostrarAlertaExito = false;
    this.mensajeExito = '';
    this.mostrarAlertaError = false;
    this.mensajeError = '';
    this.mostrarAlertaWarning = false;
    this.mensajeWarning = '';
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

  cargarProductos(): void {
    this.http.get<any>(`${environment.apiBaseUrl}/Productos/Listar`, {
      headers: { 'x-api-key': environment.apiKey }
    }).subscribe({
      next: (data) => { this.productosLista = data; },
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
      },
      error: (error) => console.error('Error cargando canales:', error)
    });
  }

  cargarListasPrecios(): void {
    if (!this.productoSeleccionado) {
      this.listasAgrupadas = [];
      this.noListasMsg = '';
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
        this.noListasMsg = this.listasAgrupadas.length === 0 ? 'Este producto no tiene ninguna lista todavía.' : '';
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
      if (checked && !this.isClienteChecked(lista, c.clie_Id)) {
        lista.clientesChecked.push(c.clie_Id);
      } else if (!checked && this.isClienteChecked(lista, c.clie_Id)) {
        lista.clientesChecked = lista.clientesChecked.filter((id: any) => id !== c.clie_Id);
      }
    });
  }

  onChildCheckboxChange(lista: any, canal: any, clienteId: number, event: any) {
    if (event.target.checked) {
      if (!lista.clientesChecked.includes(clienteId)) {
        lista.clientesChecked.push(clienteId);
      }
    } else {
      lista.clientesChecked = lista.clientesChecked.filter((id: any) => id !== clienteId);
    }
  }

  isIndeterminate(lista: any, canal: any): boolean {
    const clientes = this.getClientesPorCanal(canal.cana_Id);
    const checkedCount = clientes.filter(c => this.isClienteChecked(lista, c.clie_Id)).length;
    return checkedCount > 0 && checkedCount < clientes.length;
  }

  toggleCollapse(lista: any) {
    lista.isCollapsed = !lista.isCollapsed;
  }

  onProductoChange(event: any) {
    this.cargarListasPrecios();
    this.isCreatingNewLista = false;
    this.createError = '';
    this.noListasMsg = '';
  }

  // --- NUEVA LISTA LOGIC ---
  startCreateNewLista() {
    if (!this.productoSeleccionado) {
      this.createError = 'Debes seleccionar un producto antes de crear una lista.';
      return;
    }
    this.nocreando = false;
    this.isCreatingNewLista = true;
    this.createError = '';
    this.inputErrors = {
      precioContado: '',
      precioCredito: '',
      inicioEscala: '',
      finEscala: '',
      clientesChecked: ''
    };
    this.newLista = {
      precioContado: null,
      precioCredito: null,
      inicioEscala: null,
      finEscala: null,
      canalesOpen: {},
      clientesChecked: []
    };
  }

  toggleNewCanalCollapse(canalId: number) {
    this.newLista.canalesOpen[canalId] = !this.newLista.canalesOpen[canalId];
  }

  toggleNewParentCheckbox(canal: any, event: any) {
    const checked = event.target.checked;
    const clientes = this.getClientesPorCanal(canal.cana_Id);
    clientes.forEach((c) => {
      if (checked && !this.newLista.clientesChecked.includes(c.clie_Id)) {
        this.newLista.clientesChecked.push(c.clie_Id);
      } else if (!checked && this.newLista.clientesChecked.includes(c.clie_Id)) {
        this.newLista.clientesChecked = this.newLista.clientesChecked.filter((id: any) => id !== c.clie_Id);
      }
    });
  }

  toggleNewChildCheckbox(clienteId: number, event: any) {
    if (event.target.checked) {
      if (!this.newLista.clientesChecked.includes(clienteId)) {
        this.newLista.clientesChecked.push(clienteId);
      }
    } else {
      this.newLista.clientesChecked = this.newLista.clientesChecked.filter((id: any) => id !== clienteId);
    }
  }

  isNewCanalFullyChecked(canal: any): boolean {
    const clientes = this.getClientesPorCanal(canal.cana_Id);
    return clientes.length > 0 && clientes.every(c => this.newLista.clientesChecked.includes(c.clie_Id));
  }

  isNewIndeterminate(canal: any): boolean {
    const clientes = this.getClientesPorCanal(canal.cana_Id);
    const checkedCount = clientes.filter(c => this.newLista.clientesChecked.includes(c.clie_Id)).length;
    return checkedCount > 0 && checkedCount < clientes.length;
  }

  // --- XML GENERATION ---
  generateClientesXml(clienteIds: number[]): string {
    if (!clienteIds.length) return '';
    let xml = '<root>';
    clienteIds.forEach(id => {
      xml += `<item><clie_id>${id}</clie_id></item>`;
    });
    xml += '</root>';
    return xml;
  }

  // --- VALIDATION ---
  validateNewLista(): boolean {
  let valid = true;
  this.inputErrors = {
    precioContado: '',
    precioCredito: '',
    inicioEscala: '',
    finEscala: '',
    clientesChecked: ''
  };

  if ((this.newLista.precioContado ?? null) === null || this.newLista.precioContado! <= 0) {
    this.inputErrors.precioContado = 'Precio contado es requerido y debe ser mayor a 0.';
    valid = false;
  }
  if ((this.newLista.precioCredito ?? null) === null || this.newLista.precioCredito! <= 0) {
    this.inputErrors.precioCredito = 'Precio crédito es requerido y debe ser mayor a 0.';
    valid = false;
  }
  if ((this.newLista.inicioEscala ?? null) === null || this.newLista.inicioEscala! < 0) {
    this.inputErrors.inicioEscala = 'Inicio escala es requerido.';
    valid = false;
  }
  if ((this.newLista.finEscala ?? null) === null || this.newLista.finEscala! < (this.newLista.inicioEscala ?? 0)) {
    this.inputErrors.finEscala = 'Fin escala debe ser mayor o igual a inicio escala.';
    valid = false;
  }
  if (!this.newLista.clientesChecked.length) {
    this.inputErrors.clientesChecked = 'Selecciona al menos un cliente.';
    valid = false;
  }
  return valid;
}

  // --- CREATE API CALL ---
  crearNuevaLista() {
    this.createError = '';
    if (!this.validateNewLista()) {
      this.createError = 'Por favor llena los campos necesarios.';
      return;
    }
    const payload = {
      prod_Id: this.productoSeleccionado.prod_Id,
      clientesXml: this.generateClientesXml(this.newLista.clientesChecked),
      preP_PrecioContado: this.newLista.precioContado,
      preP_PrecioCredito: this.newLista.precioCredito,
      preP_InicioEscala: this.newLista.inicioEscala,
      preP_FinEscala: this.newLista.finEscala,
      usua_Creacion: 1, // Replace with actual user ID
      preP_FechaCreacion: new Date().toISOString()
    };
    this.http.post<any>(`${environment.apiBaseUrl}/PreciosPorProducto/Insertar`, payload, {
      headers: { 'x-api-key': environment.apiKey }
    }).subscribe({
      next: (data) => {
        this.isCreatingNewLista = false;
        this.cargarListasPrecios();
        this.nocreando = true;
      },
      error: (error) => {
        this.createError = 'Error al crear la lista. Intenta de nuevo.';
        console.error(error);
      }
    });
  }

  validateListaEdicion(lista: any): boolean {
    let valid = true;
    lista.inputErrors = {
      precioContado: '',
      precioCredito: '',
      inicioEscala: '',
      finEscala: '',
      clientesChecked: ''
    };

    if ((lista.precioContado ?? null) === null || lista.precioContado <= 0) {
      lista.inputErrors.precioContado = 'Precio contado es requerido y debe ser mayor a 0.';
      valid = false;
    }
    if ((lista.precioCredito ?? null) === null || lista.precioCredito <= 0) {
      lista.inputErrors.precioCredito = 'Precio crédito es requerido y debe ser mayor a 0.';
      valid = false;
    }
    if ((lista.inicioEscala ?? null) === null || lista.inicioEscala < 0) {
      lista.inputErrors.inicioEscala = 'Inicio escala es requerido.';
      valid = false;
    }
    if ((lista.finEscala ?? null) === null || lista.finEscala < lista.inicioEscala) {
      lista.inputErrors.finEscala = 'Fin escala debe ser mayor o igual a inicio escala.';
      valid = false;
    }
    if (!lista.clientesChecked || !lista.clientesChecked.length) {
      lista.inputErrors.clientesChecked = 'Selecciona al menos un cliente.';
      valid = false;
    }
    return valid;
  }


  guardarCambios(lista: any) {
    if (!confirm(`¿Seguro que deseas guardar cambios en lista #${lista.listaId}?`)) {
      return;
    }

    if (!this.validateListaEdicion(lista)) {
      this.mostrarAlertaWarning = true;
      this.mensajeWarning = 'Por favor corrige los errores antes de guardar cambios.';
      setTimeout(() => this.cerrarAlerta(), 4000);
      return;
    }

    const payload = {
      prod_Id: lista.prod_Id,
      clientesXml: this.generateClientesXml(lista.clientesChecked),
      preP_PrecioContado: lista.precioContado,
      preP_PrecioCredito: lista.precioCredito,
      preP_InicioEscala: lista.inicioEscala,
      preP_FinEscala: lista.finEscala,
      usua_Modificacion: getUserId(),
      preP_FechaModificacion: new Date().toISOString(),
      preP_ListaPrecios: lista.listaId
    };

    this.http.post<any>(`${environment.apiBaseUrl}/PreciosPorProducto/Editar`, payload, {
      headers: { 'x-api-key': environment.apiKey }
    }).subscribe({
      next: (response) => {
        this.mostrarAlertaExito = true;
        this.mensajeExito = `Lista #${lista.listaId} actualizada exitosamente.`;
        setTimeout(() => this.cerrarAlerta(), 3000);
        this.cargarListasPrecios();
      },
      error: (error) => {
        this.mostrarAlertaError = true;
        this.mensajeError = 'Error al guardar cambios en la lista. Por favor, intente nuevamente.';
        setTimeout(() => this.cerrarAlerta(), 5000);
      }
    });
  }
}