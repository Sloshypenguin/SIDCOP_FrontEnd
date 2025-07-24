import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Pedido } from 'src/app/Modelos/ventas/Pedido.Model';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
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

   cargarClientes() {
      this.http.get<any>(`${environment.apiBaseUrl}/Cliente/Listar`, {
        headers: { 'x-api-key': environment.apiKey }
      }).subscribe((data) => this.Clientes = data);
    };

  cargarDirecciones(clienteId: number) {
    this.http.get<any>(`${environment.apiBaseUrl}/DireccionCliente/ListarPorCliente/${clienteId}`, {
       headers: { 'x-api-key': environment.apiKey }
      }).subscribe((data) => this.Clientes = data);
      };


    

  constructor(private http: HttpClient) {
    this.cargarClientes();

  }

  pedido: Pedido = {
   pedi_Id: 0,
    diCl_Id: 0,
    vend_Id: 0,
    pedi_FechaPedido: new Date(),
    pedi_FechaEntrega: new Date(),
    clie_Codigo: '',
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
    this.mostrarErrores = false;
    this.mostrarAlertaExito = false;
    this.mensajeExito = '';
    this.mostrarAlertaError = false;
    this.mensajeError = '';
    this.mostrarAlertaWarning = false;
    this.mensajeWarning = '';
    this.pedido = {
      pedi_Id: 0,
      diCl_Id: 0,
      vend_Id: 0,
      pedi_FechaPedido: new Date(),
      pedi_FechaEntrega: new Date(),
      clie_Codigo: '',
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
    
    if (this.pedido.clie_NombreNegocio.trim() && this.pedido.clie_NombreNegocio.trim()) {
      // Limpiar alertas previas
      this.mostrarAlertaWarning = false;
      this.mostrarAlertaError = false;
       
      const pedidoGuardar = {
      //Datos a Guardar
      };

      console.log('Guardando puntoE:', pedidoGuardar);
      
      this.http.post<any>(`${environment.apiBaseUrl}/Pedido/Insertar`, pedidoGuardar, {
        headers: { 
          'X-Api-Key': environment.apiKey,
          'Content-Type': 'application/json',
          'accept': '*/*'
        }
      }).subscribe({
        next: (response) => {
          console.log('PE guardado exitosamente:', response);
          this.mensajeExito = `Punto de emision "${this.pedido.clie_NombreNegocio}" guardado exitosamente`;
          this.mostrarAlertaExito = true;
          this.mostrarErrores = false;
          
          // Ocultar la alerta después de 3 segundos
          setTimeout(() => {
            this.mostrarAlertaExito = false;
            this.onSave.emit(this.pedido);
            this.cancelar();
          }, 3000);
        },
        error: (error) => {
          console.log('Entro esto', pedidoGuardar)
         // console.log('Error al guardar punto de emision:', error);
          console.error('Error al guardar punto de emision:', error);
          this.mostrarAlertaError = true;
          this.mensajeError = 'Error al punto de emision. Por favor, intente nuevamente.';
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
