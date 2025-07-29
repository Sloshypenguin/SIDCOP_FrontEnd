import {
  Component,
  Output,
  EventEmitter,
  Input,
  OnChanges,
  SimpleChanges,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Pedido } from 'src/app/Modelos/ventas/Pedido.Model';
import { environment } from 'src/environments/environment.prod';
import { getUserId } from 'src/app/core/utils/user-utils';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss',
})
export class EditComponent implements OnInit, OnChanges {
  @Input() PedidoData: Pedido | null = null;
  @Output() onCancel = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<Pedido>();

  //Clientes: any[] = [];
  //Direccines: any[] = [];
  productos: any[] = [];

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
      .filter((p) => p.cantidad > 0)
      .map((p) => ({
        prod_Id: p.prod_Id,
        peDe_Cantidad: p.cantidad,
        peDe_ProdPrecio: p.precio || 0,
      }));
  }

  listarProductosDesdePedido(): void {
    this.http
      .get<any>(`${environment.apiBaseUrl}/Productos/Listar`, {
        headers: { 'x-api-key': environment.apiKey },
      })
      .subscribe({
        next: (data) => {
          this.productos = data.map((producto: any) => {
            // Buscar el detalle del pedido que corresponde a este producto
            const detalle = this.pedidoEditada.detalles.find(
              (d: any) => d.prod_Id === producto.prod_Id
            );

            return {
              ...producto,
              cantidad: detalle ? detalle.peDe_Cantidad : 0,
              precio: detalle
                ? detalle.peDe_ProdPrecio
                : producto.prod_PrecioUnitario || 0,
            };
          });
          this.filtrarProductos();
        },
        error: (err) => {
          console.error('Error al cargar productos:', err);
          this.mostrarAlertaError = true;
          this.mensajeError = 'Error al cargar productos.';
        },
      });
  }

  pedidoEditada: Pedido = {
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

  PEOriginal = '';
  mostrarErrores = false;
  mostrarAlertaExito = false;
  mensajeExito = '';
  mostrarAlertaError = false;
  mensajeError = '';
  mostrarAlertaWarning = false;
  mensajeWarning = '';
  mostrarConfirmacionEditar = false;

  Math = Math; // para usar Math en la plantilla
  productosFiltrados: any[] = []; // resultado después del filtro
  productosPaginados: any[] = []; // productos que se muestran en la página actual
  paginaActual: number = 1;
  productosPorPagina: number = 6;

  TodasDirecciones: any;
  Clientes: any;
  Direcciones: any[] = [];

  selectedCliente: number = 0;
  selectedDireccion: number = 0;

  listarProductos(): void {
    this.http
      .get<any>(`${environment.apiBaseUrl}/Productos/Listar`, {
        headers: { 'x-api-key': environment.apiKey },
      })
      .subscribe({
        next: (data) => {
          this.productos = data.map((producto: any) => ({
            ...producto,
            cantidad: 0,
            precio: producto.prod_PrecioUnitario || 0,
          }));
          this.filtrarProductos(); // aplicar filtro inicial
        },
        error: () => {
          this.mostrarAlertaError = true;
          this.mensajeError = 'Error al cargar productos.';
        },
      });
  }

  searchQuery: string = ''; // Variable para almacenar la búsqueda

  // Filtrar productos según el nombre
  filtrarProductos(): void {
    const query = this.searchQuery.trim().toLowerCase();
    if (query === '') {
      this.productosFiltrados = [...this.productos];
    } else {
      this.productosFiltrados = this.productos.filter((producto) =>
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
    const totalPaginas = Math.ceil(
      this.productosFiltrados.length / this.productosPorPagina
    );
    const nuevaPagina = this.paginaActual + delta;
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
      this.paginaActual = nuevaPagina;
      this.actualizarProductosPaginados();
    }
  }

  constructor(private http: HttpClient) {}

  formatearFecha(fecha: Date | string): string {
    const d = new Date(fecha);
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const dia = String(d.getDate()).padStart(2, '0');
    const anio = d.getFullYear();
    return `${anio}-${mes}-${dia}`; // formato 'yyyy-MM-dd'
  }

  get fechaInicioFormato(): string {
    return new Date(this.pedidoEditada.pedi_FechaEntrega)
      .toISOString()
      .split('T')[0];
  }

  set fechaInicioFormato(value: string) {
    this.pedidoEditada.pedi_FechaEntrega = new Date(value);
  }

  ngOnInit(): void {
    this.cargarListados();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['PedidoData'] && changes['PedidoData'].currentValue) {
      this.pedidoEditada = { ...changes['PedidoData'].currentValue };
      this.PEOriginal = this.pedidoEditada.clie_NombreNegocio || '';
      this.mostrarErrores = false;

      this.pedidoEditada.pedi_FechaPedido = new Date(
        this.formatearFecha(this.pedidoEditada.pedi_FechaPedido)
      );
      this.pedidoEditada.pedi_FechaEntrega = new Date(
        this.formatearFecha(this.pedidoEditada.pedi_FechaEntrega)
      );

      try {
        this.pedidoEditada.detalles = JSON.parse(
          this.pedidoEditada.detallesJson || '[]'
        );
      } catch (e) {
        console.error('Error al parsear detallesJson:', e);
        this.pedidoEditada.detalles = [];
      }

      // Cargar productos con cantidades desde los detalles
      this.listarProductosDesdePedido();
      this.cargarListados();
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
    const productosSeleccionados = this.obtenerProductosSeleccionados();

    if (
      this.pedidoEditada.diCl_Id &&
      this.pedidoEditada.pedi_FechaEntrega &&
      productosSeleccionados.length > 0
    ) {
      // Si hay cambios, mostrar confirmación
      this.mostrarConfirmacionEditar = true;
    } else {
      this.mostrarAlertaWarning = true;
      if (!this.pedidoEditada.diCl_Id) {
        this.mensajeWarning = 'Por favor seleccione una dirección de entrega.';
      } else if (!this.pedidoEditada.pedi_FechaEntrega) {
        this.mensajeWarning = 'Por favor seleccione una fecha de entrega.';
      } else if (productosSeleccionados.length === 0) {
        this.mensajeWarning = 'Por favor seleccione al menos un producto.';
      } else {
        this.mensajeWarning =
          'Por favor complete todos los campos requeridos antes de guardar.';
      }
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
    const productosSeleccionados = this.obtenerProductosSeleccionados();

    if (
      this.pedidoEditada.diCl_Id &&
      this.pedidoEditada.pedi_FechaEntrega &&
      productosSeleccionados.length > 0
    ) {
      // Buscar la dirección seleccionada para obtener información del cliente
      const direccionSeleccionada = this.TodasDirecciones.find(
        (dir: any) => dir.diCl_Id === this.pedidoEditada.diCl_Id
      );

      const pedidoActualizar = {
        pedi_Id: this.pedidoEditada.pedi_Id,
        diCl_Id: this.pedidoEditada.diCl_Id,
        vend_Id: getUserId(), // Usuario actual como vendedor
        pedi_FechaPedido: this.pedidoEditada.pedi_FechaPedido.toISOString(),
        pedi_FechaEntrega: this.pedidoEditada.pedi_FechaEntrega.toISOString(),
        detalles: productosSeleccionados,
        usua_Modificacion: getUserId(),
        pedi_FechaModificacion: new Date().toISOString(),
        pedi_Estado: true,
      };

      this.http
        .put<any>(
          `${environment.apiBaseUrl}/Pedido/Actualizar`,
          pedidoActualizar,
          {
            headers: {
              'X-Api-Key': environment.apiKey,
              'Content-Type': 'application/json',
              accept: '*/*',
            },
          }
        )
        .subscribe({
          next: (response) => {
            this.mostrarErrores = false;
            this.onSave.emit(this.pedidoEditada);
            this.cancelar();
          },
          error: (error) => {
            console.error('Error al actualizar Pedido:', error);
            this.mostrarAlertaError = true;
            this.mensajeError =
              'Error al actualizar el Pedido. Por favor, intente nuevamente.';
            setTimeout(() => this.cerrarAlerta(), 5000);
          },
        });
    } else {
      this.mostrarAlertaWarning = true;
      if (!this.pedidoEditada.diCl_Id) {
        this.mensajeWarning = 'Por favor seleccione una dirección de entrega.';
      } else if (!this.pedidoEditada.pedi_FechaEntrega) {
        this.mensajeWarning = 'Por favor seleccione una fecha de entrega.';
      } else if (productosSeleccionados.length === 0) {
        this.mensajeWarning = 'Por favor seleccione al menos un producto.';
      } else {
        this.mensajeWarning =
          'Por favor complete todos los campos requeridos antes de guardar.';
      }
      setTimeout(() => this.cerrarAlerta(), 4000);
    }
  }

  cargarListados(): void {
    // Cargar lista de clientes
    this.http
      .get<any>(`${environment.apiBaseUrl}/Cliente/Listar`, {
        headers: { 'x-api-key': environment.apiKey },
      })
      .subscribe({
        next: (clientes) => {
          this.Clientes = clientes;
          console.log('Clientes cargados:', this.Clientes.length);

          // Cargar lista de direcciones
          this.http
            .get<any>(
              `${environment.apiBaseUrl}/DireccionesPorCliente/Listar`,
              {
                headers: { 'x-api-key': environment.apiKey },
              }
            )
            .subscribe({
              next: (direcciones) => {
                console.log('Direcciones cargadas:', direcciones.length);
                this.TodasDirecciones = direcciones;
                this.configurarUbicacionInicial();
              },
              error: (error) => {
                console.error('Error al cargar direcciones:', error);
                this.mostrarAlertaError = true;
                this.mensajeError =
                  'Error al cargar las direcciones de clientes.';
                setTimeout(() => this.cerrarAlerta(), 5000);
              },
            });
        },
        error: (error) => {
          console.error('Error al cargar clientes:', error);
          this.mostrarAlertaError = true;
          this.mensajeError = 'Error al cargar la lista de clientes.';
          setTimeout(() => this.cerrarAlerta(), 5000);
        },
      });
  }

  configurarUbicacionInicial(): void {
    // Buscar la dirección correspondiente al pedido que estamos editando
    const direccion = this.TodasDirecciones.find(
      (dir: any) => dir.diCl_Id === this.pedidoEditada.diCl_Id
    );

    if (direccion) {
      // Si encontramos la dirección, seleccionamos su cliente correspondiente
      this.selectedCliente = direccion.clie_Id;

      // Filtramos las direcciones para mostrar solo las del cliente seleccionado
      this.Direcciones = this.TodasDirecciones.filter(
        (dir: any) => dir.clie_Id === this.selectedCliente
      );

      console.log(
        'Ubicación inicial configurada - Cliente ID:',
        this.selectedCliente,
        'Dirección ID:',
        this.pedidoEditada.diCl_Id,
        'Direcciones disponibles:',
        this.Direcciones.length
      );
    } else {
      // Si no hay dirección seleccionada, inicializamos con valores vacíos
      this.selectedCliente = 0;
      this.Direcciones = [];
      console.log(
        'No se encontró la dirección con ID:',
        this.pedidoEditada.diCl_Id
      );
    }
  }

  cargarMunicipios(codigoDepa: number): void {
    // Filtrar las direcciones por el cliente seleccionado
    this.Direcciones = this.TodasDirecciones.filter(
      (dir: any) => dir.clie_Id === codigoDepa
    );

    // Resetear la dirección seleccionada
    this.pedidoEditada.diCl_Id = 0;
    this.selectedDireccion = 0;

    console.log(
      'Direcciones filtradas para cliente ID',
      codigoDepa,
      ':',
      this.Direcciones
    );
  }
}
