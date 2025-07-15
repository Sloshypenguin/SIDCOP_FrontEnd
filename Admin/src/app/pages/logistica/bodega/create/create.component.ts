import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Bodega } from 'src/app/Modelos/logistica/Bodega.Model';
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
  @Output() onSave = new EventEmitter<Bodega>();
  
  mostrarErrores = false;
  mostrarAlertaExito = false;
  mensajeExito = '';
  mostrarAlertaError = false;
  mensajeError = '';
  mostrarAlertaWarning = false;
  mensajeWarning = '';

  constructor(private http: HttpClient) {}

  bodega: Bodega = {
    bode_Id: 0,
    bode_Descripcion: '',
    bode_Capacidad: 0,
    bode_Placa: '',
    bode_TipoCamion: '',
    bode_VIN: '',
    mode_Id: 0,
    regC_Id: 0,
    sucu_Id: 0,
    vend_Id: 0,
    usua_Creacion: 0,
    usua_Modificacion: 0,
    secuencia: 0,
    bode_FechaCreacion: new Date(),
    bode_FechaModificacion: new Date(),
    code_Status: 0,
    message_Status: '',
    usuarioCreacion: '',
    usuarioModificacion: ''
  };

  cancelar(): void {
    this.mostrarErrores = false;
    this.mostrarAlertaExito = false;
    this.mensajeExito = '';
    this.mostrarAlertaError = false;
    this.mensajeError = '';
    this.mostrarAlertaWarning = false;
    this.mensajeWarning = '';
    this.bodega = {
      bode_Id: 0,
    bode_Descripcion: '',
    bode_Capacidad: 0,
    bode_Placa: '',
    bode_TipoCamion: '',
    bode_VIN: '',
    mode_Id: 0,
    regC_Id: 0,
    sucu_Id: 0,
    vend_Id: 0,
    usua_Creacion: 0,
    usua_Modificacion: 0,
    secuencia: 0,
    bode_FechaCreacion: new Date(),
    bode_FechaModificacion: new Date(),
    code_Status: 0,
    message_Status: '',
    usuarioCreacion: '',
    usuarioModificacion: ''
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
    
    if (this.bodega.bode_Descripcion.trim()) {
      // Limpiar alertas previas
      this.mostrarAlertaWarning = false;
      this.mostrarAlertaError = false;
      
      const bodegaGuardar = {
        bode_Id: 0,
        bode_Descripcion: this.bodega.bode_Descripcion.trim(),
        usua_Creacion: environment.usua_Id,// varibale global, obtiene el valor del environment, esto por mientras
        esCv_FechaCreacion: new Date().toISOString(),
        usua_Modificacion: 0,
        numero: "", 
        esCv_FechaModificacion: new Date().toISOString(),
        usuarioCreacion: "", 
        usuarioModificacion: "" 
      };

      console.log('Guardando estado civil:', bodegaGuardar);
      
      this.http.post<any>(`${environment.apiBaseUrl}/EstadosCiviles/Insertar`, bodegaGuardar, {
        headers: { 
          'X-Api-Key': environment.apiKey,
          'Content-Type': 'application/json',
          'accept': '*/*'
        }
      }).subscribe({
        next: (response) => {
          console.log('Estado civil guardado exitosamente:', response);
          this.mensajeExito = `Estado civil "${this.bodega.bode_Descripcion}" guardado exitosamente`;
          this.mostrarAlertaExito = true;
          this.mostrarErrores = false;
          
          // Ocultar la alerta después de 3 segundos
          setTimeout(() => {
            this.mostrarAlertaExito = false;
            this.onSave.emit(this.bodega);
            this.cancelar();
          }, 3000);
        },
        error: (error) => {
          console.error('Error al guardar estado civil:', error);
          this.mostrarAlertaError = true;
          this.mensajeError = 'Error al guardar el estado civil. Por favor, intente nuevamente.';
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
