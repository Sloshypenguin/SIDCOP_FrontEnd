import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { getUserId } from 'src/app/core/utils/user-utils';
import { CAIs } from 'src/app/Modelos/ventas/CAIs.Model';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent {
  @Output() onCancel = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<CAIs>();

  mostrarErrores = false;
  mostrarAlertaExito = false;
  mensajeExito = '';
  mostrarAlertaError = false;
  mensajeError = '';
  mostrarAlertaWarning = false;
  mensajeWarning = '';

  constructor(private http: HttpClient) {}

  cai: CAIs = {
    nCai_Id: 0,
    nCai_Codigo: '',
    nCai_Descripcion: '',
    usua_Creacion: getUserId(),
    nCai_FechaCreacion: new Date(),
    usuarioCreacion: '',
    usuarioModificacion: '',
    code_Status: 0,
    message_Status: ''
  };

  cancelar(): void {
    this.mostrarErrores = false;
    this.cai = {
      nCai_Id: 0,
      nCai_Codigo: '',
      nCai_Descripcion: '',
      usua_Creacion: getUserId(),
      nCai_FechaCreacion: new Date(),
      usuarioCreacion: '',
      usuarioModificacion: '',
      code_Status: 0,
      message_Status: ''
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

    if (this.cai.nCai_Codigo.trim() && this.cai.nCai_Descripcion.trim()) {
      const caiGuardar = {
        nCai_Codigo: this.cai.nCai_Codigo.trim(),
        nCai_Descripcion: this.cai.nCai_Descripcion.trim(),
        usua_Creacion: getUserId(),
        nCai_FechaCreacion: new Date().toISOString()
      };

      this.http.post<any>(`${environment.apiBaseUrl}/CaiS/Crear`, caiGuardar, {
        headers: {
          'X-Api-Key': environment.apiKey,
          'Content-Type': 'application/json',
          'accept': '*/*'
        }
      }).subscribe({
        next: (response) => {
          if (response.success && response.data?.code_Status === 1) {
            this.mensajeExito = `CAI "${this.cai.nCai_Codigo}" creado exitosamente`;
            this.mostrarAlertaExito = true;
            this.mostrarErrores = false;

            setTimeout(() => {
              this.mostrarAlertaExito = false;
              this.onSave.emit(this.cai);
              this.cancelar();
            }, 3000);
          } else {
            this.mostrarAlertaError = true;
            this.mensajeError = response.data?.message_Status || 'Error al guardar el CAI.';
          }
        },
        error: (error) => {
          console.error('Error al guardar el CAI:', error);
          this.mostrarAlertaError = true;
          this.mensajeError = 'Error al guardar el CAI. Por favor, intente nuevamente.';

          setTimeout(() => {
            this.mostrarAlertaError = false;
            this.mensajeError = '';
          }, 5000);
        }
      });
    } else {
      this.mostrarAlertaWarning = true;
      this.mensajeWarning = 'Por favor complete todos los campos requeridos antes de guardar.';

      setTimeout(() => {
        this.mostrarAlertaWarning = false;
        this.mensajeWarning = '';
      }, 4000);
    }
  }
}
