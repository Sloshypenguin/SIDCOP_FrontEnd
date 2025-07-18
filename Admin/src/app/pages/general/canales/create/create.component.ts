import { Component, Output, EventEmitter } from '@angular/core';
import { Canal } from 'src/app/Modelos/general/Canal.Model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create',
  standalone: true,
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
  imports: [CommonModule, FormsModule]
})
export class CreateComponent {
  @Output() onCancel = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<Canal>();

  canal: Canal = new Canal();

  mostrarErrores = false;
  mostrarAlertaExito = false;
  mensajeExito = '';
  mostrarAlertaError = false;
  mensajeError = '';
  mostrarAlertaWarning = false;
  mensajeWarning = '';

  constructor(private http: HttpClient) {}

  cancelar(): void {
    this.mostrarErrores = false;
    this.mostrarAlertaExito = false;
    this.mensajeExito = '';
    this.mostrarAlertaError = false;
    this.mensajeError = '';
    this.mostrarAlertaWarning = false;
    this.mensajeWarning = '';
    this.canal = new Canal();
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

    if (
      this.canal.cana_Descripcion &&
      this.canal.cana_Descripcion.trim() &&
      this.canal.cana_Observaciones &&
      this.canal.cana_Observaciones.trim()
    ) {
      // Limpiar alertas previas
      this.mostrarAlertaWarning = false;
      this.mostrarAlertaError = false;

      const canalGuardar = {
        ...this.canal,
        cana_Id: 0,
        cana_Descripcion: this.canal.cana_Descripcion.trim(),
        cana_Observaciones: this.canal.cana_Observaciones.trim(),
        usua_Creacion: environment.usua_Id,
        cana_FechaCreacion: new Date().toISOString(),
        usua_Modificacion: 0,
        cana_FechaModificacion: new Date().toISOString(),
        cana_Estado: true,
        UsuarioCreacion: '',
        UsuarioModificacion: ''
      };

      this.http.post<any>(`${environment.apiBaseUrl}/Canal/Insertar`, canalGuardar, {
        headers: {
          'X-Api-Key': environment.apiKey,
          'Content-Type': 'application/json',
          'accept': '*/*'
        }
      }).subscribe({
        next: (response) => {
          this.mensajeExito = `Canal "${this.canal.cana_Descripcion}" guardado exitosamente`;
          this.mostrarAlertaExito = true;
          this.mostrarErrores = false;
          setTimeout(() => {
            this.mostrarAlertaExito = false;
            this.onSave.emit(this.canal);
            this.cancelar();
          }, 3000);
        },
        error: () => {
          this.mostrarAlertaError = true;
          this.mensajeError = 'Error al guardar el canal. Por favor, intente nuevamente.';
          this.mostrarAlertaExito = false;
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
      setTimeout(() => {
        this.mostrarAlertaWarning = false;
        this.mensajeWarning = '';
      }, 4000);
    }
  }
}