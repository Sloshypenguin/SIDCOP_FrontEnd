import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Traslado } from 'src/app/Modelos/logistica/TrasladoModel';
import { environment } from 'src/environments/environment';

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

  constructor(private http: HttpClient) {
    this.inicializarFechaActual();
    this.listarOrigenes();
    this.listarDestinos();
  }

  ngOnInit(): void {
    this.listarProductos(); // Cargar productos al inicializar el componente
  }

  traslado: Traslado = {
    tras_Id: 0,
    tras_Origen: 0,
    origen: '',
    tras_Destino: 0,
    destino: '',
    tras_Fecha: new Date(),
    tras_Observaciones: '',
    usua_Creacion: 0,
    tras_FechaCreacion: new Date(),
    usua_Modificacion: 0,
    tras_FechaModificacion: new Date(),
    tras_Estado: true,
    code_Status: 0,
    message_Status: ''
  };

  origenes: any[] = [];
  destinos: any[] = [];
  productos: any[] = [];

  inicializarFechaActual(): void {
    const hoy = new Date();
    this.fechaActual = hoy.toISOString().split('T')[0];
    this.traslado.tras_Fecha = hoy;
  }

  listarOrigenes(): void {
    this.http.get<any>(`${environment.apiBaseUrl}/Sucursales/Listar`, {
        headers: { 'x-api-key': environment.apiKey }
      }).subscribe((data) => this.origenes = data);
  }

  listarDestinos(): void {
    this.http.get<any>(`${environment.apiBaseUrl}/Bodega/Listar`, {
        headers: { 'x-api-key': environment.apiKey }
      }).subscribe((data) => this.destinos = data);
  }

  listarProductos(): void {
    this.http.get<any>(`${environment.apiBaseUrl}/Productos/Listar`, {
        headers: { 'x-api-key': environment.apiKey }
      }).subscribe((data) => {
        // Inicializar cada producto con cantidad 0 y observaciones vacías
        this.productos = data.map((producto: any) => ({
          ...producto,
          cantidad: 0,
          observaciones: ''
        }));
      });
  }

  aumentarCantidad(index: number): void {
    if (!this.productos[index].cantidad) {
      this.productos[index].cantidad = 0;
    }
    this.productos[index].cantidad++;
  }
  
  // Método para disminuir la cantidad
  disminuirCantidad(index: number): void {
    if (this.productos[index].cantidad > 0) {
      this.productos[index].cantidad--;
    }
  }
  
  // Método para validar la cantidad ingresada manualmente
  validarCantidad(index: number): void {
    if (this.productos[index].cantidad < 0) {
      this.productos[index].cantidad = 0;
    }
    if (this.productos[index].cantidad > 999) {
      this.productos[index].cantidad = 999;
    }
  }

  // Método para obtener productos seleccionados (con cantidad > 0)
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

  // Método para resetear productos (útil al cancelar)
  resetearProductos(): void {
    this.productos.forEach(producto => {
      producto.cantidad = 0;
      producto.observaciones = '';
    });
  }

  cancelar(): void {
    this.mostrarErrores = false;
    this.mostrarAlertaExito = false;
    this.mensajeExito = '';
    this.mostrarAlertaError = false;
    this.mensajeError = '';
    this.mostrarAlertaWarning = false;
    this.mensajeWarning = '';
    
    this.traslado = {
      tras_Id: 0,
      tras_Origen: 0,
      origen: '',
      tras_Destino: 0,
      destino: '',
      tras_Fecha: new Date(),
      tras_Observaciones: '',
      usua_Creacion: 0,
      tras_FechaCreacion: new Date(),
      usua_Modificacion: 0,
      tras_FechaModificacion: new Date(),
      tras_Estado: true,
      code_Status: 0,
      message_Status: ''
    };
    
    this.resetearProductos(); // Resetear productos al cancelar
    this.inicializarFechaActual();
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
    
    // Obtener productos seleccionados
    const productosSeleccionados = this.obtenerProductosSeleccionados();
    
    if (this.traslado.tras_Origen > 0 &&
        this.traslado.tras_Destino > 0 &&
        this.traslado.tras_Fecha &&
        productosSeleccionados.length > 0 // Validar que haya al menos un producto seleccionado
      ) {
      // Limpiar alertas previas
      this.mostrarAlertaWarning = false;
      this.mostrarAlertaError = false;
      
      // Buscar las descripciones basándose en los IDs seleccionados
      const origenSeleccionado = this.origenes.find(o => o.sucu_Id == this.traslado.tras_Origen);
      const destinoSeleccionado = this.destinos.find(d => d.bode_Id == this.traslado.tras_Destino);
      
      // Datos del encabezado (sin productos)
      const trasladoEncabezado = {
        tras_Id: 0,
        tras_Origen: Number(this.traslado.tras_Origen),
        origen: origenSeleccionado ? origenSeleccionado.sucu_Descripcion : '',
        tras_Destino: Number(this.traslado.tras_Destino),
        destino: destinoSeleccionado ? destinoSeleccionado.bode_Descripcion : '',
        tras_Fecha: this.traslado.tras_Fecha.toISOString ? this.traslado.tras_Fecha.toISOString() : new Date(this.traslado.tras_Fecha).toISOString(),
        tras_Observaciones: this.traslado.tras_Observaciones || '',
        usua_Creacion: environment.usua_Id,
        tras_FechaCreacion: new Date().toISOString(),
        usua_Modificacion: 0,
        tras_FechaModificacion: new Date().toISOString(),
        tras_Estado: true
      };

      console.log('Guardando encabezado del traslado:', trasladoEncabezado);
      
      // Paso 1: Guardar el encabezado del traslado
      this.http.post<any>(`${environment.apiBaseUrl}/Traslado/Insertar`, trasladoEncabezado, {
        headers: { 
          'X-Api-Key': environment.apiKey,
          'Content-Type': 'application/json',
          'accept': '*/*'
        }
      }).subscribe({
        next: (responseEncabezado) => {
          console.log('=== RESPUESTA DEL ENCABEZADO ===');
          console.log('Tipo de respuesta:', typeof responseEncabezado);
          console.log('Respuesta completa:', responseEncabezado);
          console.log('Respuesta como JSON:', JSON.stringify(responseEncabezado, null, 2));
          console.log('Propiedades de la respuesta:', Object.keys(responseEncabezado || {}));
          
          // Si la respuesta es un objeto, mostrar todas sus propiedades
          if (responseEncabezado && typeof responseEncabezado === 'object') {
            for (let key in responseEncabezado) {
              console.log(`Propiedad "${key}":`, responseEncabezado[key], `(tipo: ${typeof responseEncabezado[key]})`);
            }
          }
          
          // Obtener el ID del traslado recién creado - vamos a probar diferentes formas
          let trasladoId = null;
          
          // Opción 1: responseEncabezado.tras_Id
          if (responseEncabezado && responseEncabezado.tras_Id) {
            trasladoId = responseEncabezado.tras_Id;
            console.log('✅ ID encontrado en responseEncabezado.tras_Id:', trasladoId);
          }
          // Opción 2: responseEncabezado.id
          else if (responseEncabezado && responseEncabezado.id) {
            trasladoId = responseEncabezado.id;
            console.log('✅ ID encontrado en responseEncabezado.id:', trasladoId);
          }
          // Opción 3: responseEncabezado directamente es el ID
          else if (typeof responseEncabezado === 'number') {
            trasladoId = responseEncabezado;
            console.log('✅ ID encontrado directamente en responseEncabezado:', trasladoId);
          }
          // Opción 4: Buscar en data
          else if (responseEncabezado && responseEncabezado.data) {
            if (responseEncabezado.data.tras_Id) {
              trasladoId = responseEncabezado.data.tras_Id;
              console.log('✅ ID encontrado en responseEncabezado.data.tras_Id:', trasladoId);
            } else if (typeof responseEncabezado.data === 'number') {
              trasladoId = responseEncabezado.data;
              console.log('✅ ID encontrado en responseEncabezado.data:', trasladoId);
            }
          }
          // Opción 5: Buscar propiedades que contengan "id" (case insensitive)
          else if (responseEncabezado && typeof responseEncabezado === 'object') {
            const keys = Object.keys(responseEncabezado);
            for (let key of keys) {
              if (key.toLowerCase().includes('id') && typeof responseEncabezado[key] === 'number') {
                trasladoId = responseEncabezado[key];
                console.log(`✅ ID encontrado en responseEncabezado.${key}:`, trasladoId);
                break;
              }
            }
          }
          
          console.log('🎯 ID final del traslado que se usará:', trasladoId);
          console.log('================================');
          
          if (trasladoId && trasladoId > 0) {
            // Paso 2: Guardar los detalles (productos)
            this.guardarDetallesTraslado(trasladoId, productosSeleccionados);
          } else {
            console.error('❌ No se pudo obtener el ID del traslado creado');
            console.error('Estructura de respuesta completa:', JSON.stringify(responseEncabezado, null, 2));
            this.mostrarAlertaError = true;
            this.mensajeError = 'Error: No se pudo obtener el ID del traslado creado. Revisa la consola para más detalles.';
          }
        },
        error: (error) => {
          console.error('Error al guardar encabezado del traslado:', error);
          this.mostrarAlertaError = true;
          this.mensajeError = 'Error al guardar el encabezado del traslado. Por favor, intente nuevamente.';
          this.mostrarAlertaExito = false;
          
          setTimeout(() => {
            this.mostrarAlertaError = false;
            this.mensajeError = '';
          }, 5000);
        }
      });
    } else {
      let mensajeError = 'Por favor complete todos los campos requeridos: ';
      const errores = [];
      
      if (!this.traslado.tras_Origen || this.traslado.tras_Origen == 0) errores.push('Origen');
      if (!this.traslado.tras_Destino || this.traslado.tras_Destino == 0) errores.push('Destino');
      if (!this.traslado.tras_Fecha) errores.push('Fecha');
      if (productosSeleccionados.length === 0) errores.push('Al menos un producto');
      
      mensajeError += errores.join(', ');
      
      this.mostrarAlertaWarning = true;
      this.mensajeWarning = mensajeError;
      this.mostrarAlertaError = false;
      this.mostrarAlertaExito = false;
      
      setTimeout(() => {
        this.mostrarAlertaWarning = false;
        this.mensajeWarning = '';
      }, 4000);
    }
  }

  // Método para guardar los detalles del traslado
  guardarDetallesTraslado(trasladoId: number, productosSeleccionados: any[]): void {
    // Contador para llevar el control de las operaciones completadas
    let operacionesCompletadas = 0;
    let erroresEnDetalles = 0;
    const totalOperaciones = productosSeleccionados.length;

    console.log(`Guardando ${totalOperaciones} detalles para el traslado ID: ${trasladoId}`);

    // Iterar sobre cada producto seleccionado y guardarlo como detalle
    productosSeleccionados.forEach((producto, index) => {
      // Formato exacto como el curl que me mostraste
      const detalleTraslado = {
        trDe_Id: 0,
        tras_Id: Number(trasladoId), // Asegurar que sea número
        prod_Id: Number(producto.prod_Id), // Asegurar que sea número
        trDe_Cantidad: Number(producto.cantidad), // Asegurar que sea número
        trDe_Observaciones: producto.observaciones || '',
        usua_Creacion: Number(environment.usua_Id), // Asegurar que sea número
        trDe_FechaCreacion: new Date().toISOString(),
        usua_Modificacion: 0,
        trDe_FechaModificacion: new Date().toISOString()
      };

      console.log(`Guardando detalle ${index + 1}:`, detalleTraslado);
      console.log(`Detalle ${index + 1} en formato JSON:`, JSON.stringify(detalleTraslado, null, 2));

      // Llamada para guardar cada detalle
      this.http.post<any>(`${environment.apiBaseUrl}/Traslado/InsertarDetalle`, detalleTraslado, {
        headers: { 
          'X-Api-Key': environment.apiKey,
          'Content-Type': 'application/json',
          'accept': '*/*'
        }
      }).subscribe({
        next: (responseDetalle) => {
          console.log(`Detalle ${index + 1} guardado exitosamente:`, responseDetalle);
          console.log(`Respuesta detalle ${index + 1}:`, JSON.stringify(responseDetalle, null, 2));
          operacionesCompletadas++;
          
          // Verificar si todas las operaciones han terminado
          this.verificarCompletitudOperaciones(operacionesCompletadas, erroresEnDetalles, totalOperaciones);
        },
        error: (error) => {
          console.error(`Error al guardar detalle ${index + 1}:`, error);
          console.error(`Detalles del error ${index + 1}:`, JSON.stringify(error, null, 2));
          console.error(`Error status: ${error.status}`);
          console.error(`Error message: ${error.message}`);
          if (error.error) {
            console.error(`Error body:`, error.error);
          }
          erroresEnDetalles++;
          operacionesCompletadas++;
          
          // Verificar si todas las operaciones han terminado
          this.verificarCompletitudOperaciones(operacionesCompletadas, erroresEnDetalles, totalOperaciones);
        }
      });
    });
  }

  // Método para verificar si todas las operaciones de detalle han terminado
  verificarCompletitudOperaciones(completadas: number, errores: number, total: number): void {
    if (completadas === total) {
      // Todas las operaciones han terminado
      if (errores === 0) {
        // Todo se guardó correctamente
        console.log('Traslado y todos los detalles guardados exitosamente');
        this.mensajeExito = `Traslado guardado exitosamente con ${total} producto(s)`;
        this.mostrarAlertaExito = true;
        this.mostrarErrores = false;
        
        setTimeout(() => {
          this.mostrarAlertaExito = false;
          this.onSave.emit(this.traslado);
          this.cancelar();
        }, 3000);
      } else {
        // Hubo algunos errores en los detalles
        console.log(`Traslado guardado pero con ${errores} errores en los detalles`);
        this.mostrarAlertaWarning = true;
        this.mensajeWarning = `Traslado guardado, pero ${errores} de ${total} productos no se pudieron guardar.`;
        
        setTimeout(() => {
          this.mostrarAlertaWarning = false;
          this.mensajeWarning = '';
        }, 5000);
      }
    }
  }
}