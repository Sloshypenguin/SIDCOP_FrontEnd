import { Component, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Bodega } from 'src/app/Modelos/logistica/Bodega.Model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class EditComponent implements OnChanges {
  @Input() bodegaData: Bodega | null = null;
  @Output() onCancel = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<Bodega>();

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

  bodegaOriginal = '';
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
    if (changes['bodegaData'] && changes['bodegaData'].currentValue) {
      this.bodega = { ...changes['bodegaData'].currentValue };
      this.bodegaOriginal = this.bodega.bode_Descripcion || '';
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

    if (this.bodega.bode_Descripcion.trim()) {
      if (this.bodega.bode_Descripcion.trim() !== this.bodegaOriginal) {
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

    if (this.bodega.bode_Descripcion.trim()) {
      const bodegaActualizar = {
        esCv_Id: this.bodega.bode_Id,
        bode_Descripcion: this.bodega.bode_Descripcion.trim(),
        usua_Creacion: this.bodega.usua_Creacion,
        esCv_FechaCreacion: this.bodega.bode_FechaCreacion,
        usua_Modificacion: environment.usua_Id,
        numero: this.bodega.secuencia || '',
        esCv_FechaModificacion: new Date().toISOString(),
        usuarioCreacion: '',
        usuarioModificacion: ''
      };

      this.http.put<any>(`${environment.apiBaseUrl}/EstadosCiviles/Actualizar`, bodegaActualizar, {
        headers: {
          'X-Api-Key': environment.apiKey,
          'Content-Type': 'application/json',
          'accept': '*/*'
        }
      }).subscribe({
        next: (response) => {
          this.mensajeExito = `Estado civil "${this.bodega.bode_Descripcion}" actualizado exitosamente`;
          this.mostrarAlertaExito = true;
          this.mostrarErrores = false;

          setTimeout(() => {
            this.mostrarAlertaExito = false;
            this.onSave.emit(this.bodega);
            this.cancelar();
          }, 3000);
        },
        error: (error) => {
          console.error('Error al actualizar estado civil:', error);
          this.mostrarAlertaError = true;
          this.mensajeError = 'Error al actualizar el estado civil. Por favor, intente nuevamente.';
          setTimeout(() => this.cerrarAlerta(), 5000);
        }
      });
    } else {
      this.mostrarAlertaWarning = true;
      this.mensajeWarning = 'Por favor complete todos los campos requeridos antes de guardar.';
      setTimeout(() => this.cerrarAlerta(), 4000);
    }
  }
}
