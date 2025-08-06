import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Pedido } from 'src/app/Modelos/ventas/Pedido.Model';

import { environment } from 'src/environments/environment.prod';
import { getUserId } from 'src/app/core/utils/user-utils';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, NgSelectModule],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent {
  @Output() onCancel = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<Pedido>();
  
  mostrarErrores = false;
  mostrarAlertaExito = false;
  mensajeExito = '';
  mostrarAlertaError = false;
  mensajeError = '';
  mostrarAlertaWarning = false;
  mensajeWarning = '';

  Clientes: any[] = [];
  Direccines: any[] = [];
  productos: any[] = [];
  Math = Math; // para usar Math en la plantilla

  // ========== PROPIEDADES PARA BÚSQUEDA Y PAGINACIÓN MEJORADAS ==========
  busquedaProducto = '';
  productosFiltrados: any[] = [];
  paginaActual = 1;
  productosPorPagina = 8;

  listarProductos(): void {
    this.http.get<any>(`${environment.apiBaseUrl}/Productos/Listar`, {
      headers: { 'x-api-key': environment.apiKey }
    }).subscribe({
      next: (data) => {
        this.productos = data.map((producto: any) => ({
          ...producto,
          cantidad: 0,
          precio: producto.prod_PrecioUnitario || 0
        }));
        this.aplicarFiltros(); // Usar el nuevo método de filtrado
      },
      error: () => {
        this.mostrarAlertaError = true;
        this.mensajeError = 'Error al cargar productos.';
      }
    });
  }

  // ========== MÉTODOS PARA BÚSQUEDA Y PAGINACIÓN MEJORADOS ==========

  buscarProductos(): void {
    this.paginaActual = 1;
    this.aplicarFiltros();
  }

  limpiarBusqueda(): void {
    this.busquedaProducto = '';
    this.paginaActual = 1;
    this.aplicarFiltros();
  }

  private aplicarFiltros(): void {
    if (!this.busquedaProducto.trim()) {
      this.productosFiltrados = [...this.productos];
    } else {
      const termino = this.busquedaProducto.toLowerCase().trim();
      this.productosFiltrados = this.productos.filter(producto =>
        producto.prod_Descripcion.toLowerCase().includes(termino)
      );
    }
  }

  getProductosFiltrados(): any[] {
    return this.productosFiltrados;
  }

  getProductosPaginados(): any[] {
    const inicio = (this.paginaActual - 1) * this.productosPorPagina;
    const fin = inicio + this.productosPorPagina;
    return this.productosFiltrados.slice(inicio, fin);
  }

  getTotalPaginas(): number {
    return Math.ceil(this.productosFiltrados.length / this.productosPorPagina);
  }

  cambiarPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.getTotalPaginas()) {
      this.paginaActual = pagina;
    }
  }

  getPaginasVisibles(): number[] {
    const totalPaginas = this.getTotalPaginas();
    const paginaActual = this.paginaActual;
    const paginas: number[] = [];

    if (totalPaginas <= 5) {
      for (let i = 1; i <= totalPaginas; i++) {
        paginas.push(i);
      }
    } else {
      if (paginaActual <= 3) {
        for (let i = 1; i <= 5; i++) {
          paginas.push(i);
        }
      } else if (paginaActual >= totalPaginas - 2) {
        for (let i = totalPaginas - 4; i <= totalPaginas; i++) {
          paginas.push(i);
        }
      } else {
        for (let i = paginaActual - 2; i <= paginaActual + 2; i++) {
          paginas.push(i);
        }
      }
    }

    return paginas;
  }

  getInicioRegistro(): number {
    return (this.paginaActual - 1) * this.productosPorPagina + 1;
  }

  getFinRegistro(): number {
    const fin = this.paginaActual * this.productosPorPagina;
    return Math.min(fin, this.productosFiltrados.length);
  }

  // Método para obtener el índice real del producto en el array principal
  getProductoIndex(prodId: number): number {
    return this.productos.findIndex(p => p.prod_Id === prodId);
  }

  // ========== MÉTODOS DE CANTIDAD MEJORADOS ==========

  aumentarCantidad(prodId: number): void {
    const index = this.getProductoIndex(prodId);
    if (index >= 0 && index < this.productos.length) {
      this.productos[index].cantidad = (this.productos[index].cantidad || 0) + 1;
    }
  }

  disminuirCantidad(prodId: number): void {
    const index = this.getProductoIndex(prodId);
    if (index >= 0 && index < this.productos.length && this.productos[index].cantidad > 0) {
      this.productos[index].cantidad--;
    }
  }

  validarCantidad(prodId: number): void {
    const index = this.getProductoIndex(prodId);
    if (index >= 0 && index < this.productos.length) {
      const cantidad = this.productos[index].cantidad || 0;
      this.productos[index].cantidad = Math.max(0, Math.min(999, cantidad));
    }
  }

  // Método para obtener la cantidad de un producto específico
  getCantidadProducto(prodId: number): number {
    const producto = this.productos.find(p => p.prod_Id === prodId);
    return producto ? (producto.cantidad || 0) : 0;
  }

  obtenerProductosSeleccionados(): any[] {
    return this.productos
      .filter(p => p.cantidad > 0)
      .map(p => ({
        prod_Id: p.prod_Id,
        peDe_Cantidad: p.cantidad,
        peDe_ProdPrecio: p.precio || 0
      }));
  }

  // ========== MÉTODOS DE CLIENTES (SIN CAMBIOS) ==========

  searchCliente = (term: string, item: any) => {
    term = term.toLowerCase();
    return (
      item.clie_Codigo?.toLowerCase().includes(term) ||
      item.clie_Nombres?.toLowerCase().includes(term) ||
      item.clie_Apellidos?.toLowerCase().includes(term) ||
      item.clie_NombreNegocio?.toLowerCase().includes(term)
    );
  };

  cargarClientes() {
    this.http.get<any>(`${environment.apiBaseUrl}/Cliente/Listar`, {
      headers: { 'x-api-key': environment.apiKey }
    }).subscribe({
      next: (data) => {
        this.Clientes = data;
        console.log('Clientes cargados:', this.Clientes);
      },
      error: (error) => {
        console.error('Error al cargar clientes:', error);
        this.mostrarAlertaError = true;
        this.mensajeError = 'Error al cargar clientes. Por favor, intente nuevamente.';
      }
    });
  };

  cargarDirecciones(clienteId: number) {
    this.http.get<any>(`${environment.apiBaseUrl}/DireccionesPorCliente/Buscar/${clienteId}`, {
      headers: { 'x-api-key': environment.apiKey }
    }).subscribe((data) => this.Direccines = data);
  }

  onClienteSeleccionado(clienteId: number) {
    this.cargarDirecciones(clienteId);
    this.pedido.diCl_Id = 0; // Reiniciar dirección seleccionada
  }

  constructor(private http: HttpClient) {
    this.cargarClientes();
    this.listarProductos();
  }

  // Agregar al componente TypeScript
trackByProducto(index: number, producto: any): number {
  return producto.prod_Id;
}

  pedido: Pedido = {
    pedi_Id: 0,
    diCl_Id: 0,
    vend_Id: 0,
    pedi_FechaPedido: new Date(),
    pedi_FechaEntrega: new Date(),
    clie_Codigo: '',
    clie_Id: 0,
    clie_NombreNegocio: '',
    clie_Nombres: '',
    clie_Apellidos: '',
    colo_Descripcion: '',
    muni_Descripcion: '',
    depa_Descripcion: '',
    diCl_DireccionExacta: '',
    vend_Nombres: '',
    vend_Apellidos: '',
    prod_Codigo: '',
    prod_Descripcion: '',
    peDe_ProdPrecio: 0,
    peDe_Cantidad: 0,
    detalles: [],
    detallesJson: '',
    usua_Creacion: 0,
    usua_Modificacion: 0,
    pedi_FechaCreacion: new Date(),
    pedi_FechaModificacion: new Date(),
    code_Status: 0,
    message_Status: '',
    usuarioCreacion: '',
    usuarioModificacion: '',
    secuencia: 0,
    pedi_Estado: false,
  };

    getTotalProductosSeleccionados(): number {
    return this.productos
      .filter(producto => producto.cantidad > 0)
      .reduce((total, producto) => total + producto.cantidad, 0);
  }
  
  cancelar(): void {
    this.busquedaProducto = '';
    this.paginaActual = 1;
    this.aplicarFiltros();
    this.mostrarErrores = false;
    this.mostrarAlertaExito = false;
    this.mensajeExito = '';
    this.mostrarAlertaError = false;
    this.mensajeError = '';
    this.mostrarAlertaWarning = false;
    this.mensajeWarning = '';
    this.productos.forEach(p => { 
      p.cantidad = 0; 
      p.prod_PrecioUnitario = 0; 
    });
    this.pedido = {
      pedi_Id: 0,
      diCl_Id: 0,
      vend_Id: 0,
      pedi_FechaPedido: new Date(),
      pedi_FechaEntrega: new Date(),
      clie_Codigo: '',
      clie_Id: 0,
      clie_NombreNegocio: '',
      clie_Nombres: '',
      clie_Apellidos: '',
      colo_Descripcion: '',
      muni_Descripcion: '',
      depa_Descripcion: '',
      diCl_DireccionExacta: '',
      vend_Nombres: '',
      vend_Apellidos: '',
      prod_Codigo: '',
      prod_Descripcion: '',
      peDe_ProdPrecio: 0,
      peDe_Cantidad: 0,
      detalles: [],
      detallesJson: '',
      usua_Creacion: 0,
      usua_Modificacion: 0,
      pedi_FechaCreacion: new Date(),
      pedi_FechaModificacion: new Date(),
      code_Status: 0,
      message_Status: '',
      usuarioCreacion: '',
      usuarioModificacion: '',
      secuencia: 0,
      pedi_Estado: false,
    };
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

  guardar(): void {
    this.mostrarErrores = true;
    const productosSeleccionados = this.obtenerProductosSeleccionados();

    if (!this.pedido.diCl_Id || !this.pedido.pedi_FechaEntrega || productosSeleccionados.length === 0) {
      this.mostrarAlertaWarning = true;
      this.mensajeWarning = 'Por favor complete todos los campos requeridos y seleccione al menos un producto.';
      return;
    }
    
    if (this.pedido.diCl_Id && this.pedido.pedi_FechaEntrega) {
      // Limpiar alertas previas
      this.mostrarAlertaWarning = false;
      this.mostrarAlertaError = false;
       
      const pedidoGuardar = {
        pedi_Id: 0,
        diCl_Id: this.pedido.diCl_Id,
        vend_Id: getUserId(), // Asumiendo que el usuario actual es el vendedor
        pedi_FechaPedido: new Date().toISOString(),
        pedi_FechaEntrega: this.pedido.pedi_FechaEntrega,
        clie_Codigo: '',
        clie_Id: 0,
        clie_NombreNegocio: '',
        clie_Nombres: '',
        clie_Apellidos: '',
        colo_Descripcion: '',
        muni_Descripcion: '',
        depa_Descripcion: '',
        diCl_DireccionExacta: '',
        vend_Nombres: '',
        vend_Apellidos: '',
        detalles: productosSeleccionados,
        usua_Creacion: getUserId(),
        pedi_FechaCreacion: new Date().toISOString(),
        usua_Modificacion: null,
        pedi_FechaModificacion: null,
        pedi_Estado: true,
        secuencia: 0
      };

      console.log('Guardando pedido:', pedidoGuardar);
      
      this.http.post<any>(`${environment.apiBaseUrl}/Pedido/Insertar`, pedidoGuardar, {
        headers: { 
          'X-Api-Key': environment.apiKey,
          'Content-Type': 'application/json',
          'accept': '*/*'
        }
      }).subscribe({
        next: (response) => {
          this.mostrarErrores = false;
          this.onSave.emit(this.pedido);
          this.cancelar();
        },
        error: (error) => {
          console.log('Entro esto', this.pedido);
          console.error('Error al guardar punto de emision:', error);
          this.mostrarAlertaError = true;
          this.mensajeError = 'Error al guardar el pedido. Por favor, intente nuevamente.';
          this.mostrarAlertaExito = false;

          // Ocultar la alerta de error después de 5 segundos
          setTimeout(() => {
            this.mostrarAlertaError = false;
            this.mensajeError = '';
          }, 5000);
        }
      });
    } else {
      // Mostrar alerta de warning para campos vacíos
      this.mostrarAlertaWarning = true;
      this.mensajeWarning = 'Por favor complete todos los campos requeridos antes de guardar.';
      this.mostrarAlertaError = false;
      this.mostrarAlertaExito = false;
      
      // Ocultar la alerta de warning después de 4 segundos
      setTimeout(() => {
        this.mostrarAlertaWarning = false;
        this.mensajeWarning = '';
      }, 4000);
    }
  }
}