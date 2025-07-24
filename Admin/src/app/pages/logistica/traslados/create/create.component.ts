import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Traslado } from 'src/app/Modelos/logistica/TrasladoModel';
import { TrasladoDetalle } from 'src/app/Modelos/logistica/TrasladoDetalleModel';
import { environment } from 'src/environments/environment';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent implements OnInit {
  @Output() onCancel = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<Traslado>();
  
  mostrarErrores = false;
  mostrarAlertaExito = false;
  mensajeExito = '';
  mostrarAlertaError = false;
  mensajeError = '';
  mostrarAlertaWarning = false;
  mensajeWarning = '';
  fechaActual = '';

  traslado: Traslado = new Traslado();
  origenes: any[] = [];
  destinos: any[] = [];
  productos: any[] = [];

  constructor(private http: HttpClient) {
    this.inicializarFechaActual();
    this.cargarDatosIniciales();
  }

  ngOnInit(): void {
    this.listarProductos();
  }

  private inicializarFechaActual(): void {
    const hoy = new Date();
    this.fechaActual = hoy.toISOString().split('T')[0];
    this.traslado.tras_Fecha = hoy;
  }

  private cargarDatosIniciales(): void {
    forkJoin({
      origenes: this.http.get<any>(`${environment.apiBaseUrl}/Sucursales/Listar`, {
        headers: { 'x-api-key': environment.apiKey }
      }),
      destinos: this.http.get<any>(`${environment.apiBaseUrl}/Bodega/Listar`, {
        headers: { 'x-api-key': environment.apiKey }
      })
    }).subscribe({
      next: (data) => {
        this.origenes = data.origenes;
        this.destinos = data.destinos;
      },
      error: () => this.mostrarError('Error al cargar datos iniciales')
    });
  }

  listarProductos(): void {
    this.http.get<any>(`${environment.apiBaseUrl}/Productos/Listar`, {
      headers: { 'x-api-key': environment.apiKey }
    }).subscribe({
      next: (data) => {
        this.productos = data.map((producto: any) => ({
          ...producto,
          cantidad: 0,
          observaciones: ''
        }));
      },
      error: () => this.mostrarError('Error al cargar productos')
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
      .filter(producto => producto.cantidad > 0)
      .map(producto => ({
        prod_Id: producto.prod_Id,
        prod_Descripcion: producto.prod_Descripcion,
        cantidad: producto.cantidad,
        observaciones: producto.observaciones
      }));
  }

  private resetearProductos(): void {
    this.productos.forEach(producto => {
      producto.cantidad = 0;
      producto.observaciones = '';
    });
  }

  cancelar(): void {
    this.limpiarAlertas();
    this.traslado = new Traslado();
    this.resetearProductos();
    this.inicializarFechaActual();
    this.onCancel.emit();
  }

  private limpiarAlertas(): void {
    this.mostrarErrores = false;
    this.mostrarAlertaExito = false;
    this.mensajeExito = '';
    this.mostrarAlertaError = false;
    this.mensajeError = '';
    this.mostrarAlertaWarning = false;
    this.mensajeWarning = '';
  }

  cerrarAlerta(): void {
    this.limpiarAlertas();
  }

  guardar(): void {
    this.mostrarErrores = true;
    const productosSeleccionados = this.obtenerProductosSeleccionados();
    
    if (!this.validarFormulario(productosSeleccionados)) return;
    
    this.limpiarAlertas();
    const trasladoData = this.prepararDatosTraslado();
    
    this.http.post<any>(`${environment.apiBaseUrl}/Traslado/Insertar`, trasladoData, {
      headers: this.obtenerHeaders()
    }).subscribe({
      next: (response) => {
        const trasladoId = this.extraerIdTraslado(response);
        if (trasladoId > 0) {
          this.guardarDetallesTraslado(trasladoId, productosSeleccionados);
        } else {
          console.error('❌ Estructura de respuesta:', JSON.stringify(response, null, 2));
          this.mostrarError('No se pudo obtener el ID del traslado creado');
        }
      },
      error: () => this.mostrarError('Error al guardar el encabezado del traslado')
    });
  }

  private validarFormulario(productosSeleccionados: any[]): boolean {
    const errores = [];
    
    if (!this.traslado.tras_Origen || this.traslado.tras_Origen == 0) errores.push('Origen');
    if (!this.traslado.tras_Destino || this.traslado.tras_Destino == 0) errores.push('Destino');
    if (!this.traslado.tras_Fecha) errores.push('Fecha');
    if (productosSeleccionados.length === 0) errores.push('Al menos un producto');
    
    if (errores.length > 0) {
      this.mostrarWarning(`Complete los campos: ${errores.join(', ')}`);
      return false;
    }
    return true;
  }

  private prepararDatosTraslado(): any {
    const origen = this.origenes.find(o => o.sucu_Id == this.traslado.tras_Origen);
    const destino = this.destinos.find(d => d.bode_Id == this.traslado.tras_Destino);
    
    return {
      tras_Id: 0,
      tras_Origen: Number(this.traslado.tras_Origen),
      origen: origen?.sucu_Descripcion || '',
      tras_Destino: Number(this.traslado.tras_Destino),
      destino: destino?.bode_Descripcion || '',
      tras_Fecha: new Date(this.traslado.tras_Fecha).toISOString(),
      tras_Observaciones: this.traslado.tras_Observaciones || '',
      usua_Creacion: environment.usua_Id,
      tras_FechaCreacion: new Date().toISOString(),
      usua_Modificacion: 0,
      tras_FechaModificacion: new Date().toISOString(),
      tras_Estado: true
    };
  }

  private extraerIdTraslado(response: any): number {
    console.log('=== ANALIZANDO RESPUESTA ===');
    console.log('Respuesta:', JSON.stringify(response, null, 2));
    
    // Array de posibles ubicaciones del ID
    const posiblesIds = [
      response?.tras_Id,
      response?.id,
      response?.data?.tras_Id,
      response?.data,
      typeof response === 'number' ? response : null
    ];
    
    // Buscar el primer ID válido
    for (const id of posiblesIds) {
      if (id && Number(id) > 0) {
        console.log('✅ ID encontrado:', id);
        return Number(id);
      }
    }
    
    // Búsqueda genérica por propiedades que contengan "id"
    if (response && typeof response === 'object') {
      for (const [key, value] of Object.entries(response)) {
        if (key.toLowerCase().includes('id') && typeof value === 'number' && value > 0) {
          console.log(`✅ ID encontrado en ${key}:`, value);
          return value;
        }
      }
    }
    
    console.log('❌ No se encontró ID válido');
    return 0;
  }

  private guardarDetallesTraslado(trasladoId: number, productosSeleccionados: any[]): void {
    let operacionesCompletadas = 0;
    let erroresEnDetalles = 0;
    const totalOperaciones = productosSeleccionados.length;

    console.log(`Guardando ${totalOperaciones} detalles para traslado ID: ${trasladoId}`);

    productosSeleccionados.forEach((producto, index) => {
      const detalleTraslado = {
        trDe_Id: 0,
        tras_Id: Number(trasladoId),
        prod_Id: Number(producto.prod_Id),
        trDe_Cantidad: Number(producto.cantidad),
        trDe_Observaciones: producto.observaciones || '',
        usua_Creacion: Number(environment.usua_Id),
        trDe_FechaCreacion: new Date().toISOString(),
        usua_Modificacion: 0,
        trDe_FechaModificacion: new Date().toISOString()
      };

      this.http.post<any>(`${environment.apiBaseUrl}/Traslado/InsertarDetalle`, detalleTraslado, {
        headers: this.obtenerHeaders()
      }).subscribe({
        next: (response) => {
          console.log(`✅ Detalle ${index + 1} guardado:`, response);
          operacionesCompletadas++;
          this.verificarCompletitud(operacionesCompletadas, erroresEnDetalles, totalOperaciones);
        },
        error: (error) => {
          console.error(`❌ Error detalle ${index + 1}:`, error);
          erroresEnDetalles++;
          operacionesCompletadas++;
          this.verificarCompletitud(operacionesCompletadas, erroresEnDetalles, totalOperaciones);
        }
      });
    });
  }

  private verificarCompletitud(completadas: number, errores: number, total: number): void {
    if (completadas === total) {
      if (errores === 0) {
        this.mostrarExito(`Traslado guardado exitosamente con ${total} producto(s)`);
        setTimeout(() => {
          this.onSave.emit(this.traslado);
          this.cancelar();
        }, 3000);
      } else {
        this.mostrarWarning(`Traslado guardado, pero ${errores} de ${total} productos fallaron`);
      }
    }
  }

  private obtenerHeaders(): any {
    return { 
      'X-Api-Key': environment.apiKey,
      'Content-Type': 'application/json',
      'accept': '*/*'
    };
  }

  private mostrarExito(mensaje: string): void {
    this.mensajeExito = mensaje;
    this.mostrarAlertaExito = true;
    this.mostrarErrores = false;
  }

  private mostrarError(mensaje: string): void {
    this.mensajeError = mensaje;
    this.mostrarAlertaError = true;
    setTimeout(() => this.limpiarAlertas(), 5000);
  }

  private mostrarWarning(mensaje: string): void {
    this.mensajeWarning = mensaje;
    this.mostrarAlertaWarning = true;
    setTimeout(() => this.limpiarAlertas(), 4000);
  }
}