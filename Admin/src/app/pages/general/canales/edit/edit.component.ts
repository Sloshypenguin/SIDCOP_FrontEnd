import { Component, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Canales } from 'src/app/Modelos/general/Canales.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})

export class EditComponent implements OnChanges {
  @Input() canalesData: Canales | null = null;
  @Output() onCancel = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<Canales>();

 canales: Canales = {
     cana_Id : 0,
    cana_Descripcion :  '',
    cana_Observaciones : '',
    usua_Creacion : 0,
    cana_FechaCreacion : new Date(),
    usua_Modificacion : 0,
    cana_FechaModificacion : new Date(),
    cana_Estado : true,
    usuaC_Nombre:  0,
    usuaM_Nombre:  0,
    code_Status: 0,
    message_Status: ''
  };

  canalesOriginal = '';
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
    if (changes['canalesData'] && changes['canalesData'].currentValue) {
      this.canales = { ...changes['canalesData'].currentValue };
      this.canalesOriginal = this.canales.cana_Descripcion || '';
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

    if (this.canales.cana_Descripcion.trim()) {
      if (this.canales.cana_Descripcion.trim() !== this.canalesOriginal) {
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

    if (this.canales.cana_Descripcion.trim()) {
      const canalesActualizar = {
        cana_id: this.canales.cana_Id,
        cana_Descripcion: this.canales.cana_Descripcion.trim(),
        usua_Creacion: this.canales.usua_Creacion,
        cana_FechaCreacion: this.canales.cana_FechaCreacion,
        usua_Modificacion: environment.usua_Id,
        // numero: this.cargo..secuencia || '',
        cana_FechaModificacion: new Date().toISOString(),
        cana_Estado: '',
        // usuarioModificacion: ''
      };

      this.http.put<any>(`${environment.apiBaseUrl}/Canal/Actualizar`, canalesActualizar, {
        headers: {
          'X-Api-Key': environment.apiKey,
          'Content-Type': 'application/json',
          'accept': '*/*'
        }
      }).subscribe({
        next: (response) => {
          this.mensajeExito = `Canal "${this.canales.cana_Descripcion}" actualizado exitosamente`;
          this.mostrarAlertaExito = true;
          this.mostrarErrores = false;

          setTimeout(() => {
            this.mostrarAlertaExito = false;
            this.onSave.emit(this.canales);
            this.cancelar();
          }, 3000);
        },
        error: (error) => {
          console.error('Error al actualizar el canal:', error);
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
