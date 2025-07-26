import { Component, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { PuntoEmision } from 'src/app/Modelos/ventas/PuntoEmision.Model';
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
  @Input() PEData: PuntoEmision | null = null;
  @Output() onCancel = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<PuntoEmision>();

  puntoEmision: PuntoEmision = {
    puEm_Id: 0,
    puEm_Codigo: '',
    puEm_Descripcion: '',
    usua_Creacion: 0,
    usua_Modificacion: 0,
    sucu_Id: 0,
   
    puEm_FechaCreacion: new Date(),
    puEm_FechaModificacion: new Date(),
    code_Status: 0,
    message_Status: '',
    usuarioCreacion: '',
    usuarioModificacion: '',
    secuencia: 0,
    estado: '',
  };


  PEOriginal = '';
  mostrarErrores = false;
  mostrarAlertaExito = false;
  mensajeExito = '';
  mostrarAlertaError = false;
  mensajeError = '';
  mostrarAlertaWarning = false;
  mensajeWarning = '';
  mostrarConfirmacionEditar = false;
  Sucursales: any[] = [];

   cargarSucursales() {
      this.http.get<any>('https://localhost:7071/Sucursales/Listar', {
        headers: { 'x-api-key': environment.apiKey }
      }).subscribe((data) => this.Sucursales = data);
    };

  constructor(private http: HttpClient) {
    this.cargarSucursales();

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['PEData'] && changes['PEData'].currentValue) {
      this.puntoEmision = { ...changes['PEData'].currentValue };
      this.PEOriginal = this.puntoEmision.puEm_Descripcion || '';
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

    if (this.puntoEmision.puEm_Descripcion.trim()) {
      if (this.puntoEmision.puEm_Descripcion.trim() !== this.PEOriginal) {
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

    if (this.puntoEmision.puEm_Descripcion.trim()) {
      const PEActualizar = {
        puEm_Id: this.puntoEmision.puEm_Id,
        puEm_Codigo: this.puntoEmision.puEm_Codigo.trim(),
        puEm_Descripcion: this.puntoEmision.puEm_Descripcion.trim(),
        usua_Creacion: this.puntoEmision.usua_Creacion,
        puEm_FechaCreacion: this.puntoEmision.puEm_FechaCreacion,
        usua_Modificacion: getUserId(),
        sucu_Id: this.puntoEmision.sucu_Id,
        puEm_FechaModificacion: new Date().toISOString(),
        usuarioCreacion: '',
        usuarioModificacion: '',
        estado: '',
        secuencia: 0,
      };

      this.http.put<any>(`${environment.apiBaseUrl}/PuntoEmision/Actualizar`, PEActualizar, {
        headers: {
          'X-Api-Key': environment.apiKey,
          'Content-Type': 'application/json',
          'accept': '*/*'
        }
      }).subscribe({
        next: (response) => {
          this.mensajeExito = `Punto de Emision "${this.puntoEmision.puEm_Descripcion}" actualizado exitosamente`;
          this.mostrarAlertaExito = true;
          this.mostrarErrores = false;

          setTimeout(() => {
            this.mostrarAlertaExito = false;
            this.onSave.emit(this.puntoEmision);
            this.cancelar();
          }, 3000);
        },
        error: (error) => {
          console.error('Error al actualizar Punto de Emision:', error);
          this.mostrarAlertaError = true;
          this.mensajeError = 'Error al actualizar el Punto de Emision. Por favor, intente nuevamente.';
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
