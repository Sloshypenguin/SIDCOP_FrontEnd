import { Component, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Ruta } from 'src/app/Modelos/logistica/Rutas.Model';
import { environment } from 'src/environments/environment.prod';
import { getUserId } from 'src/app/core/utils/user-utils';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class EditComponent implements OnChanges {
  @Input() rutaData: Ruta | null = null;
  @Output() onCancel = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<Ruta>();
  @Output() onOverlayChange = new EventEmitter<boolean>();

 ruta: Ruta = {
    ruta_Id: 0,
    ruta_Codigo: '',
    ruta_Descripcion: '',
    ruta_Observaciones: '',
    usua_Creacion: 0,
    usua_Modificacion: 0,
    secuencia: 0,
    ruta_FechaCreacion: new Date(),
    ruta_FechaModificacion: new Date(),
    code_Status: 0,
    message_Status: '',
    usuarioCreacion: '',
    usuarioModificacion: ''
  };

  rutaOriginal = '';
  mostrarErrores = false;
  mostrarAlertaExito = false;
  mensajeExito = '';
  mostrarAlertaError = false;
  mensajeError = '';
  mostrarAlertaWarning = false;
  mensajeWarning = '';
  mostrarConfirmacionEditar = false;

  constructor(private http: HttpClient) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['rutaData'] && changes['rutaData'].currentValue) {
      this.ruta = { ...changes['rutaData'].currentValue };
      this.rutaOriginal = this.ruta.ruta_Descripcion || '';
      this.rutaOriginal = this.ruta.ruta_Codigo || '';
      this.rutaOriginal = this.ruta.ruta_Observaciones || '';
      this.mostrarErrores = false;
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

    if (this.ruta.ruta_Codigo.trim() && this.ruta.ruta_Descripcion.trim() && this.ruta.ruta_Observaciones.trim()) {
      if (this.ruta.ruta_Descripcion.trim() !== this.rutaOriginal  || this.ruta.ruta_Codigo.trim() !== this.rutaOriginal || this.ruta.ruta_Observaciones.trim() !== this.rutaOriginal) {
        this.mostrarConfirmacionEditar = true;
      } else {
        this.mostrarAlertaWarning = true;
        this.mensajeWarning = 'No se han detectado cambios.';
        setTimeout(() => this.cerrarAlerta(), 4000);
      }
    } else {
      this.mostrarAlertaWarning = true;
      this.mensajeWarning = 'Por favor complete todos los campos requeridos antes de guardar.';
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
    this.onOverlayChange.emit(true);

    if (this.ruta.ruta_Codigo.trim() && this.ruta.ruta_Descripcion.trim() && this.ruta.ruta_Observaciones.trim()) {
      const rutaActualizar = {
        ruta_Id: this.ruta.ruta_Id,
        ruta_Codigo: this.ruta.ruta_Codigo.trim(),
        ruta_Descripcion: this.ruta.ruta_Descripcion.trim(),
        ruta_Observaciones: this.ruta.ruta_Observaciones.trim(),
        usua_Creacion: this.ruta.usua_Creacion,
        ruta_FechaCreacion: this.ruta.ruta_FechaCreacion,
        usua_Modificacion: getUserId(),
        numero: this.ruta.secuencia || '',
        ruta_FechaModificacion: new Date().toISOString(),
        usuarioCreacion: '',
        usuarioModificacion: ''
      };

      this.http.put<any>(`${environment.apiBaseUrl}/Rutas/Modificar`, rutaActualizar, {
        headers: {
          'X-Api-Key': environment.apiKey,
          'Content-Type': 'application/json',
          'accept': '*/*'
        }
      }).subscribe({
        next: (response) => {
          this.mostrarErrores = false;
          setTimeout(() => {
            this.onOverlayChange.emit(false);
            this.mensajeExito = `Ruta "${this.ruta.ruta_Descripcion}" actualizada exitosamente`;  
            this.mostrarAlertaExito = true;
            setTimeout(() => {
              this.mostrarAlertaExito = false;
              setTimeout(() => {
                this.onSave.emit(this.ruta);
                this.cancelar();
              }, 100);
            }, 2000);
          }, 300);
        },
        error: (error) => {
          setTimeout(() => {
            this.onOverlayChange.emit(false);
            console.error('Error al actualizar ruta:', error);
            this.mostrarAlertaError = true;
            this.mensajeError = 'Error al actualizar la ruta. Por favor, intente nuevamente.';
            setTimeout(() => this.cerrarAlerta(), 5000);
          }, 1000);
        }
      });
    } else {
      this.onOverlayChange.emit(false);
      this.mostrarAlertaWarning = true;
      this.mensajeWarning = 'Por favor complete todos los campos requeridos antes de guardar.';
      setTimeout(() => this.cerrarAlerta(), 4000);
    }
  }
}
