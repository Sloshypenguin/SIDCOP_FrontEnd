import { Component, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Cargos } from 'src/app/Modelos/general/Cargos.Model';
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
  @Input() cargoData: Cargos | null = null;
  @Output() onCancel = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<Cargos>();

 cargo: Cargos = {
    carg_Id: 0,
    carg_Descripcion: '',
    usua_Creacion: 0,
    carg_FechaCreacion: new Date(),
    usua_Modificacion: 0,
    carg_FechaModificacion: new Date(),
    usuarioModificacion : '',
    usuarioCreacion : '', 
    carg_Estado: true,
    code_Status: 0,
    message_Status: '',
    secuencia : 0
  };

  cargoOriginal = '';
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
    if (changes['cargoData'] && changes['cargoData'].currentValue) {
      this.cargo = { ...changes['cargoData'].currentValue };
      this.cargoOriginal = this.cargo.carg_Descripcion || '';
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

    if (this.cargo.carg_Descripcion.trim()) {
      if (this.cargo.carg_Descripcion.trim() !== this.cargoOriginal) {
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

    if (this.cargo.carg_Descripcion.trim()) {
      const cargoActualizar = {
        carg_Id: this.cargo.carg_Id,
        carg_Descripcion: this.cargo.carg_Descripcion.trim(),
        usua_Creacion: this.cargo.usua_Creacion,
        carg_FechaCreacion: this.cargo.carg_FechaCreacion,
        usua_Modificacion: getUserId(),
        // numero: this.cargo..secuencia || '',
        carg_FechaModificacion: new Date().toISOString(),
        carg_Estado: true,
        usuarioCreacion : '',
        usuarioModificacion : ''
        // usuarioModificacion: ''
      };

      this.http.put<any>(`${environment.apiBaseUrl}/Cargo/Actualizar`, cargoActualizar, {
        headers: {
          'X-Api-Key': environment.apiKey,
          'Content-Type': 'application/json',
          'accept': '*/*'
        }
      }).subscribe({
        next: (response) => {
          this.mensajeExito = `Cargo "${this.cargo.carg_Descripcion}" actualizado exitosamente`;
          this.mostrarAlertaExito = true;
          this.mostrarErrores = false;

          setTimeout(() => {
            this.mostrarAlertaExito = false;
            this.onSave.emit(this.cargo);
            this.cancelar();
          }, 3000);
        },
        error: (error) => {
          // console.error('Error al actualizar cargo:', error);
          this.mostrarAlertaError = true;
          this.mensajeError = 'Error al actualizar el cargo. Por favor, intente nuevamente.';
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
