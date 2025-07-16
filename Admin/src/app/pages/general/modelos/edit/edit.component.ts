import { Component, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Modelo } from 'src/app/Modelos/general/Modelo.Model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class EditComponent implements OnChanges {
  @Input() modeloData: Modelo | null = null;
  @Input() marcasVehiculo: any[] = []; // Array de marcas de vehículo
  @Output() onCancel = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<Modelo>();

  modelo: Modelo = {
    mode_Id: 0,
    maVe_Id: 0,
    maVe_Marca: '',
    mode_Descripcion: '',
    usua_Creacion: 0,
    mode_FechaCreacion: new Date(),
    usua_Modificacion: 0,
    mode_FechaModificacion: new Date(),
    usuarioCreacion: '',
    usuarioModificacion: '',
    code_Status: 0,
    message_Status: ''
  };

  modeloOriginal = '';
  marcaOriginal = 0;
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
    if (changes['modeloData'] && changes['modeloData'].currentValue) {
      this.modelo = { ...changes['modeloData'].currentValue };
      this.modeloOriginal = this.modelo.mode_Descripcion || '';
      this.marcaOriginal = this.modelo.maVe_Id || 0;
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

    if (this.modelo.mode_Descripcion.trim() && this.modelo.maVe_Id) {
      // Verificar si hay cambios
      const hayDescripcionCambiada = this.modelo.mode_Descripcion.trim() !== this.modeloOriginal;
      const hayMarcaCambiada = this.modelo.maVe_Id !== this.marcaOriginal;

      if (hayDescripcionCambiada || hayMarcaCambiada) {
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

    if (this.modelo.mode_Descripcion.trim() && this.modelo.maVe_Id) {
      const modeloActualizar = {
        mode_Id: this.modelo.mode_Id,
        maVe_Id: this.modelo.maVe_Id,
        mode_Descripcion: this.modelo.mode_Descripcion.trim(),
        usua_Creacion: this.modelo.usua_Creacion,
        mode_FechaCreacion: this.modelo.mode_FechaCreacion,
        usua_Modificacion: environment.usua_Id,
        mode_FechaModificacion: new Date().toISOString(),
        usuarioCreacion: '',
        usuarioModificacion: ''
      };

      this.http.put<any>(`${environment.apiBaseUrl}/Modelo/Actualizar`, modeloActualizar, {
        headers: {
          'X-Api-Key': environment.apiKey,
          'Content-Type': 'application/json',
          'accept': '*/*'
        }
      }).subscribe({
        next: (response) => {
          this.mensajeExito = `Modelo "${this.modelo.mode_Descripcion}" actualizado exitosamente`;
          this.mostrarAlertaExito = true;
          this.mostrarErrores = false;

          setTimeout(() => {
            this.mostrarAlertaExito = false;
            this.onSave.emit(this.modelo);
            this.cancelar();
          }, 3000);
        },
        error: (error) => {
          console.error('Error al actualizar modelo:', error);
          this.mostrarAlertaError = true;
          this.mensajeError = 'Error al actualizar el modelo. Por favor, intente nuevamente.';
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