import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { PuntoEmision } from 'src/app/Modelos/ventas/PuntoEmision.Model';
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
  @Output() onSave = new EventEmitter<PuntoEmision>();
  
  mostrarErrores = false;
  mostrarAlertaExito = false;
  mensajeExito = '';
  mostrarAlertaError = false;
  mensajeError = '';
  mostrarAlertaWarning = false;
  mensajeWarning = '';

  ordenarPorMunicipioYDepartamento(sucursales: any[]): any[] {
  return sucursales.sort((a, b) => {
    if (a.depa_Descripcion < b.depa_Descripcion) return -1;
    if (a.depa_Descripcion > b.depa_Descripcion) return 1;
    if (a.muni_Descripcion < b.muni_Descripcion) return -1;
    if (a.muni_Descripcion > b.muni_Descripcion) return 1;
    return 0;
  });
}

searchSucursal = (term: string, item: any) => {
  term = term.toLowerCase();
  return (
    item.sucu_Descripcion?.toLowerCase().includes(term) ||
    item.muni_Descripcion?.toLowerCase().includes(term) ||
    item.depa_Descripcion?.toLowerCase().includes(term)
  );
};



  Sucursales: any[] = [];

  cargarSucursales() {
  this.http.get<any>(`${environment.apiBaseUrl}/Sucursales/Listar`, {
    headers: { 'x-api-key': environment.apiKey }
  }).subscribe((data) => this.Sucursales = this.ordenarPorMunicipioYDepartamento(data));
}


  constructor(private http: HttpClient) {
    this.cargarSucursales();

  }

  puntoEmision: PuntoEmision = {
    puEm_Id: 0,
    puEm_Codigo: '',
    puEm_Descripcion: '',
    usua_Creacion: 0,
    usua_Modificacion: 0,
    sucu_Id: 0,
    sucu_Descripcion:  '',
    puEm_FechaCreacion: new Date(),
    puEm_FechaModificacion: new Date(),
    code_Status: 0,
    message_Status: '',
    usuarioCreacion: '',
    usuarioModificacion: '',
    secuencia: 0,
    estado: '',
  };

  cancelar(): void {
    this.mostrarErrores = false;
    this.mostrarAlertaExito = false;
    this.mensajeExito = '';
    this.mostrarAlertaError = false;
    this.mensajeError = '';
    this.mostrarAlertaWarning = false;
    this.mensajeWarning = '';
    this.puntoEmision = {
    puEm_Id: 0,
    puEm_Codigo: '',
    puEm_Descripcion: '',
    usua_Creacion: 0,
    usua_Modificacion: 0,
    sucu_Id: 0,
    sucu_Descripcion:  '',
    puEm_FechaCreacion: new Date(),
    puEm_FechaModificacion: new Date(),
    code_Status: 0,
    message_Status: '',
    usuarioCreacion: '',
    usuarioModificacion: '',
    secuencia: 0,
    estado: '',

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
    
    if (this.puntoEmision.puEm_Codigo.trim() && this.puntoEmision.puEm_Descripcion.trim()) {
      // Limpiar alertas previas
      this.mostrarAlertaWarning = false;
      this.mostrarAlertaError = false;
       
      const puntoemisionGuardar = {
        puEm_Id: 0,
        puEm_Codigo: this.puntoEmision.puEm_Codigo.trim(),
        puEm_Descripcion: this.puntoEmision.puEm_Descripcion.trim(),
        usua_Creacion: getUserId(),// varibale global, obtiene el valor del environment, esto por mientras
        puEm_FechaCreacion: new Date().toISOString(),
        usua_Modificacion: 0,
        sucu_Id: this.puntoEmision.sucu_Id,
        sucu_Descripcion:  "", 
        puEm_FechaModificacion: new Date().toISOString(),
        usuarioCreacion: "", 
        usuarioModificacion: "",
        estado: '',
        secuencia: 0,
      };

      console.log('Guardando puntoE:', puntoemisionGuardar);
      
      this.http.post<any>(`${environment.apiBaseUrl}/PuntoEmision/Insertar`, puntoemisionGuardar, {
        headers: { 
          'X-Api-Key': environment.apiKey,
          'Content-Type': 'application/json',
          'accept': '*/*'
        }
      }).subscribe({
        next: (response) => {
          console.log('PE guardado exitosamente:', response);
          this.mensajeExito = `Punto de emision "${this.puntoEmision.puEm_Descripcion}" guardado exitosamente`;
          this.mostrarAlertaExito = true;
          this.mostrarErrores = false;
          
          // Ocultar la alerta después de 3 segundos
          setTimeout(() => {
            this.mostrarAlertaExito = false;
            this.onSave.emit(this.puntoEmision);
            this.cancelar();
          }, 3000);
        },
        error: (error) => {
          console.log('Entro esto', puntoemisionGuardar)
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
