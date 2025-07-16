import { Component, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Impuestos } from 'src/app/Modelos/ventas/Impuestos.Model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})



export class EditComponent implements OnChanges {
@Input() impuestoData: Impuestos | null = null;
  @Output() onCancel = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<Impuestos>();

  impuestos: Impuestos = {
    impu_Id: 0,
    impu_Descripcion: '',
    impu_Valor: 0,
    usua_Creacion: 0,
    usua_Modificacion: 0,
    impu_FechaCreacion: new Date(),
    impu_FechaModificacion: new Date(),
    code_Status: 0,
    message_Status: '',
    impu_Estado: true

  };

  ImpuestoOriginal = '';
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
    if (changes['ImpuestosData'] && changes['ImpuestosData'].currentValue) {
      this.impuestos = { ...changes['ImpuestosData'].currentValue };
      this.ImpuestoOriginal = this.impuestos.impu_Descripcion || '';
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

    if (this.impuestos.impu_Descripcion.trim()) {
      if (this.impuestos.impu_Descripcion.trim() !== this.ImpuestoOriginal) {
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

    if (this.impuestos.impu_Descripcion.trim()) {
      const ImpuestosActualizar = {
        impu_Id: this.impuestos.impu_Id,
        impu_Descripcion: this.impuestos.impu_Descripcion.trim(),
        usua_Creacion: this.impuestos.usua_Creacion,
        impu_FechaCreacion: this.impuestos.impu_FechaCreacion,
        usua_Modificacion: environment.usua_Id,
        impu_FechaModificacion: new Date().toISOString(),
        usuarioCreacion: '',
        usuarioModificacion: ''
      };

      this.http.put<any>(`${environment.apiBaseUrl}/Impuestos/Actualizar`, ImpuestosActualizar, {
        headers: {
          'X-Api-Key': environment.apiKey,
          'Content-Type': 'application/json',
          'accept': '*/*'
        }
      }).subscribe({
        next: (response) => {
          this.mensajeExito = `Impuesto "${this.impuestos.impu_Descripcion}" actualizado exitosamente`;
          this.mostrarAlertaExito = true;
          this.mostrarErrores = false;

          setTimeout(() => {
            this.mostrarAlertaExito = false;
            this.onSave.emit(this.impuestos);
            this.cancelar();
          }, 3000);
        },
        error: (error) => {
          console.error('Error al actualizar impuesto:', error);
          this.mostrarAlertaError = true;
          this.mensajeError = 'Error al actualizar el impuesto. Por favor, intente nuevamente.';
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
