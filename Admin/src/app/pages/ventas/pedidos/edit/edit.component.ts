import {
  Component,
  Output,
  EventEmitter,
  Input,
  OnChanges,
  SimpleChanges,
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
export class EditComponent implements OnChanges {
  @Input() PedidoData: Pedido | null = null;
  @Output() onCancel = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<Pedido>();

  Clientes: any[] = [];
  Direccines: any[] = [];
  productos: any[] = [];

  cargarClientes() {
    this.http
      .get<any>(`${environment.apiBaseUrl}/Cliente/Listar`, {
        headers: { 'x-api-key': environment.apiKey },
      })
      .subscribe({
        next: (data) => (this.Clientes = data),
        error: () => {
          this.mostrarAlertaError = true;
          this.mensajeError = 'Error al cargar clientes.';
        },
      });
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

listarProductosDesdePedido(): void {
  this.http.get<any>(`${environment.apiBaseUrl}/Productos/Listar`, {
    headers: { 'x-api-key': environment.apiKey }
  }).subscribe({
    next: (data) => {
      this.productos = data.map((producto: any) => {
        const detalle = this.pedido.detalles.find((d: any) => d.id == producto.prod_Id);
        return {
          ...producto,
          cantidad: detalle?.cantidad || 0,
          precio: detalle?.precio || producto.prod_PrecioUnitario || 0
        };
      });
    },
    error: () => {
      this.mostrarAlertaError = true;
      this.mensajeError = 'Error al cargar productos.';
    }
  });
}




  cargarDirecciones(clienteId: number) {
    this.http
      .get<any>(
        `${environment.apiBaseUrl}/DireccionesPorCliente/Buscar/${clienteId}`,
        {
          headers: { 'x-api-key': environment.apiKey },
        }
      )
      .subscribe((data) => (this.Direccines = data));
  }

  onClienteSeleccionado(clienteId: number) {
    this.cargarDirecciones(clienteId);
    this.pedido.diCl_Id = 0;
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

  PEOriginal = '';
  mostrarErrores = false;
  mostrarAlertaExito = false;
  mensajeExito = '';
  mostrarAlertaError = false;
  mensajeError = '';
  mostrarAlertaWarning = false;
  mensajeWarning = '';
  mostrarConfirmacionEditar = false;
  Sucursales: any[] = [];

  cargarSucursales() {
    this.http
      .get<any>('https://localhost:7071/Sucursales/Listar', {
        headers: { 'x-api-key': environment.apiKey },
      })
      .subscribe((data) => (this.Sucursales = data));
  }

  constructor(private http: HttpClient) {
    this.cargarSucursales();
  }

  formatearFecha(fecha: Date | string): string {
  const d = new Date(fecha);
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const dia = String(d.getDate()).padStart(2, '0');
  const anio = d.getFullYear();
  return `${anio}-${mes}-${dia}`; // formato 'yyyy-MM-dd'
}

get fechaInicioFormato(): string {
  return new Date(this.pedido.pedi_FechaEntrega).toISOString().split('T')[0];
}

set fechaInicioFormato(value: string) {
  this.pedido.pedi_FechaEntrega = new Date(value);
}






 ngOnChanges(changes: SimpleChanges): void {
  if (changes['PedidoData'] && changes['PedidoData'].currentValue) {
    this.pedido = { ...changes['PedidoData'].currentValue };
    this.PEOriginal = this.pedido.muni_Descripcion || '';
    this.mostrarErrores = false;
    this.cerrarAlerta();

  this.pedido.pedi_FechaPedido = new Date(this.formatearFecha(this.pedido.pedi_FechaPedido));
  this.pedido.pedi_FechaEntrega = new Date(this.formatearFecha(this.pedido.pedi_FechaEntrega));


    // Parsear detallesJson y asignar a this.pedido.detalles
    try {
      this.pedido.detalles = JSON.parse(this.pedido.detallesJson || '[]');
    } catch (e) {
      console.error('Error al parsear detallesJson:', e);
      this.pedido.detalles = [];
    }

    // Cargar productos con cantidades desde los detalles
    this.listarProductosDesdePedido();

    

    // ✅ NUEVO: Cargar clientes si no están cargados aún
    if (this.Clientes.length === 0) {
      this.cargarClientes();
    }

    // ✅ NUEVO: Cargar direcciones del cliente si existe
    if (this.pedido.clie_Id) {
      this.cargarDirecciones(this.pedido.clie_Id);
    }

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

    if (this.pedido.muni_Descripcion.trim()) {
      if (this.pedido.depa_Descripcion.trim() !== this.PEOriginal) {
        this.mostrarConfirmacionEditar = true;
      } else {
        this.mostrarAlertaWarning = true;
        this.mensajeWarning = 'No se han detectado cambios.';
        setTimeout(() => this.cerrarAlerta(), 4000);
      }
    } else {
      this.mostrarAlertaWarning = true;
      this.mensajeWarning =
        'Por favor complete todos los campos requeridos antes de guardar.';
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

    if (this.pedido.diCl_Id && this.pedido.pedi_FechaEntrega && productosSeleccionados.length > 0) {
      const PEActualizar = {
         
        pedi_Id: this.pedido.pedi_Id,
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
        usua_Creacion: 0,
        pedi_FechaCreacion: new Date().toISOString(),
        usua_Modificacion: getUserId(),
        pedi_FechaModificacion: new Date().toISOString(),
        pedi_Estado: true,
        secuencia: 0
      
      };

      this.http
        .put<any>(`${environment.apiBaseUrl}/Pedido/Actualizar`, PEActualizar, {
          headers: {
            'X-Api-Key': environment.apiKey,
            'Content-Type': 'application/json',
            accept: '*/*',
          },
        })
        .subscribe({
          next: (response) => {
            this.mensajeExito = `Punto de Emision "${this.pedido.clie_NombreNegocio}" actualizado exitosamente`;
            this.mostrarAlertaExito = true;
            this.mostrarErrores = false;

            setTimeout(() => {
              this.mostrarAlertaExito = false;
              this.onSave.emit(this.pedido);
              this.cancelar();
            }, 3000);
          },
          error: (error) => {
            console.error('Error al actualizar Punto de Emision:', error);
            this.mostrarAlertaError = true;
            this.mensajeError =
              'Error al actualizar el Punto de Emision. Por favor, intente nuevamente.';
            setTimeout(() => this.cerrarAlerta(), 5000);
          },
        });
    } else {
      this.mostrarAlertaWarning = true;
      this.mensajeWarning =
        'Por favor complete todos los campos requeridos antes de guardar.';
      setTimeout(() => this.cerrarAlerta(), 4000);
    }
  }
}
