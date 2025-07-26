import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Cargos } from 'src/app/Modelos/general/Cargos.Model';
import { environment } from 'src/environments/environment.prod';
import { getUserId } from 'src/app/core/utils/user-utils';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent {
  @Output() onCancel = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<Cargos>();
  isFocused = false;
  
  mostrarErrores = false;
  mostrarAlertaExito = false;
  mensajeExito = '';
  mostrarAlertaError = false;
  mensajeError = '';
  mostrarAlertaWarning = false;
  mensajeWarning = '';

  constructor(private http: HttpClient) {}

  cargo: Cargos = {
    carg_Id: 0,
    carg_Descripcion: '',
    usua_Creacion: 0,
    carg_FechaCreacion: new Date(),
    usua_Modificacion: 0,
    carg_FechaModificacion: new Date(),
    carg_Estado: true,
    usuarioCreacion : '',
    usuarioModificacion : '',
    code_Status: 0,
    message_Status: ''
  };

  cancelar(): void {
    this.mostrarErrores = false;
    this.mostrarAlertaExito = false;
    this.mensajeExito = '';
    this.mostrarAlertaError = false;
    this.mensajeError = '';
    this.mostrarAlertaWarning = false;
    this.mensajeWarning = '';
    this.cargo = {
      carg_Id: 0,
      carg_Descripcion: '',
      usua_Creacion: 0,
      usua_Modificacion: 0,
      carg_FechaCreacion: new Date(),
      carg_FechaModificacion: new Date(),
      carg_Estado : true,
      code_Status: 0,
      message_Status: '',
      usuarioCreacion: '',
      usuarioModificacion: '',
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
    // console.log('Intentando guardar cargo con datos:', this.cargo);
    this.mostrarErrores = true;
    
    if (this.cargo.carg_Descripcion.trim()) {
      // Limpiar alertas previas
      this.mostrarAlertaWarning = false;
      this.mostrarAlertaError = false;
      
      const cargoGuardar = {
        carg_Id: 0,
        carg_Descripcion: this.cargo.carg_Descripcion,
        usua_Creacion: getUserId(),// varibale global, obtiene el valor del environment, esto por mientras
        carg_FechaCreacion: new Date().toISOString(),
        usua_Modificacion: 0,
        carg_FechaModificacion : new Date().toISOString(),
        carg_Estado: true,
        usuarioCreacion : '',
        usuarioModificacion : ''
      };

      // console.log('Guardando cargo:', cargoGuardar);
      
      this.http.post<any>(`${environment.apiBaseUrl}/Cargo/Insertar`, cargoGuardar, {
        headers: { 
          'X-Api-Key': environment.apiKey,
          'Content-Type': 'application/json',
          'accept': '*/*'
        }
      }).subscribe({
        next: (response) => {
          // console.log('Cargo guardado exitosamente:', response);
          this.mensajeExito = `Cargo "${this.cargo.carg_Descripcion}" guardado exitosamente`;
          this.mostrarAlertaExito = true;
          this.mostrarErrores = false;
          
          // Ocultar la alerta después de 3 segundos
          setTimeout(() => {
            this.mostrarAlertaExito = false;
            this.onSave.emit(this.cargo);
            this.cancelar();
          }, 3000);
        },
        error: (error) => {
          // console.error('Error al guardar cargo:', error);
          this.mostrarAlertaError = true;
          this.mensajeError = 'Error al guardar el cargo. Por favor, intente nuevamente.';
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
