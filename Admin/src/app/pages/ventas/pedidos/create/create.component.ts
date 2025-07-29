import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Pedido } from 'src/app/Modelos/ventas/Pedido.Model';

import { environment } from 'src/environments/environment.prod';
import { getUserId } from 'src/app/core/utils/user-utils';
import { NgSelectModule } from '@ng-select/ng-select';
import { getDate } from 'ngx-bootstrap/chronos/utils/date-getters';

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
  productosFiltrados: any[] = []; // resultado después del filtro
  productosPaginados: any[] = []; // productos que se muestran en la página actual
  paginaActual: number = 1;
  productosPorPagina: number = 6;



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
      this.filtrarProductos(); // aplicar filtro inicial
    },
    error: () => {
      this.mostrarAlertaError = true;
      this.mensajeError = 'Error al cargar productos.';
    }
  });
}



searchQuery: string = ''; // Variable para almacenar la búsqueda

  // Filtrar productos según el nombre
filtrarProductos(): void {
  const query = this.searchQuery.trim().toLowerCase();
  if (query === '') {
    this.productosFiltrados = [...this.productos];
  } else {
    this.productosFiltrados = this.productos.filter(producto =>
      producto.prod_Descripcion.toLowerCase().includes(query)
    );
  }
  this.paginaActual = 1; // reset a la página 1 tras filtrar
  this.actualizarProductosPaginados();
}


actualizarProductosPaginados(): void {
  const inicio = (this.paginaActual - 1) * this.productosPorPagina;
  const fin = inicio + this.productosPorPagina;
  this.productosPaginados = this.productosFiltrados.slice(inicio, fin);
}


cambiarPagina(delta: number): void {
  const totalPaginas = Math.ceil(this.productosFiltrados.length / this.productosPorPagina);
  const nuevaPagina = this.paginaActual + delta;
  if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
    this.paginaActual = nuevaPagina;
    this.actualizarProductosPaginados();
  }
}





aumentarCantidad(index: number): void {
  this.productos[index].cantidad = (this.productos[index].cantidad || 0) + 1;
}

disminuirCantidad(index: number): void {
  if (this.productos[index].cantidad > 0) {
    this.productos[index].cantidad--;
  }
}

validarCantidad(index: number): void {
  const cantidad = this.productos[index].cantidad;
  this.productos[index].cantidad = Math.max(0, Math.min(999, cantidad || 0));
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
      }
      )
    };

 cargarDirecciones(clienteId: number) {
  this.http.get<any>(`${environment.apiBaseUrl}/DireccionesPorCliente/Buscar/${clienteId}`, {
    headers: { 'x-api-key': environment.apiKey }
  }).subscribe((data) => this.Direccines = data,

  
  
); 
}

onClienteSeleccionado(clienteId: number) {
  this.cargarDirecciones(clienteId);
  this.pedido.diCl_Id = 0; // Reiniciar dirección seleccionada
}


    

  constructor(private http: HttpClient) {
    this.cargarClientes();
    this.listarProductos();
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

  cancelar(): void {
    this.searchQuery = '';
    this.filtrarProductos();
    this.mostrarErrores = false;
    this.mostrarAlertaExito = false;
    this.mensajeExito = '';
    this.mostrarAlertaError = false;
    this.mensajeError = '';
    this.mostrarAlertaWarning = false;
    this.mensajeWarning = '';
    this.productos.forEach(p => { p.cantidad = 0; p.prod_PrecioUnitario = 0; });
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
    
    if (this.pedido.diCl_Id && this.pedido.pedi_FechaEntrega ) {
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
            // console.log('Error al guardar punto de emision:', error);
            console.error('Error al guardar punto de emision:', error);
            this.mostrarAlertaError = true;
            this.mensajeError =
              'Error al guardar el pedido. Por favor, intente nuevamente.';
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
