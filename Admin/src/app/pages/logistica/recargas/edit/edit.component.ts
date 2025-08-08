import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { getUserId } from 'src/app/core/utils/user-utils';

@Component({
  selector: 'app-edit-recarga',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditRecargaComponent implements OnChanges {
  @Input() recargaData: any | null = null;
  @Output() onCancel = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<any>();

  recarga: any = {
    reca_Id: 0,
    reca_Confirmacion: '',
    reca_Observaciones: '',
    Usua_Modificacion: 0,
    reca_FechaModificacion: new Date(),
    // Campos de solo lectura
    reca_Monto: 0,
    reca_Cliente: '',
    reca_Telefono: '',
    reca_Estado: '',
    reca_FechaCreacion: null
  };

  recargaOriginal: any = {};
  cambiosDetectados: any = {};

  mostrarErrores = false;
  mostrarAlertaExito = false;
  mostrarAlertaError = false;
  mostrarAlertaWarning = false;
  mostrarConfirmacionEditar = false;

  mensajeExito = '';
  mensajeError = '';
  mensajeWarning = '';

  constructor(private http: HttpClient) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['recargaData']?.currentValue) {
      this.recarga = { ...this.recargaData };
      this.recargaOriginal = { ...this.recargaData };
      this.mostrarErrores = false;
      this.cerrarAlerta();
      
      // Limpiar campos editables si vienen con datos previos
      this.recarga.reca_Confirmacion = this.recarga.reca_Confirmacion || '';
      this.recarga.reca_Observaciones = this.recarga.reca_Observaciones || '';
    }
  }

  validarConfirmacion(): void {
    this.mostrarErrores = true;

    if (this.validarCampos()) {
      if (this.hayDiferencias()) {
        this.mostrarConfirmacionEditar = true;
      } else {
        this.mostrarAlertaWarning = true;
        this.mensajeWarning = 'No se han detectado cambios.';
        setTimeout(() => this.cerrarAlerta(), 4000);
      }
    } else {
      setTimeout(() => this.cerrarAlerta(), 4000);
    }
  }

  private validarCampos(): boolean {
    const errores: string[] = [];

    if (!this.recarga.reca_Confirmacion || this.recarga.reca_Confirmacion.trim() === '') {
      errores.push('Estado de confirmación');
    }

    if (this.recarga.reca_Confirmacion === 'Rechazada') {
      if (!this.recarga.reca_Observaciones || this.recarga.reca_Observaciones.trim() === '') {
        errores.push('Observaciones (requeridas para rechazo)');
      }
    }

    if (this.recarga.reca_Observaciones && this.recarga.reca_Observaciones.length > 500) {
      errores.push('Las observaciones no pueden exceder 500 caracteres');
    }

    if (errores.length > 0) {
      this.mensajeWarning = `Por favor corrija los siguientes campos: ${errores.join(', ')}`;
      this.mostrarAlertaWarning = true;
      this.mostrarAlertaError = false;
      this.mostrarAlertaExito = false;
      return false;
    }

    return true;
  }

  private hayDiferencias(): boolean {
    const a = this.recarga;
    const b = this.recargaOriginal;
    this.cambiosDetectados = {};

    if (a.reca_Confirmacion !== (b.reca_Confirmacion || '')) {
      this.cambiosDetectados.confirmacion = {
        anterior: b.reca_Confirmacion || 'No definido',
        nuevo: a.reca_Confirmacion,
        label: 'Estado de Confirmación'
      };
    }

    if (a.reca_Observaciones !== (b.reca_Observaciones || '')) {
      this.cambiosDetectados.observaciones = {
        anterior: b.reca_Observaciones || 'Sin observaciones',
        nuevo: a.reca_Observaciones || 'Sin observaciones',
        label: 'Observaciones'
      };
    }

    return Object.keys(this.cambiosDetectados).length > 0;
  }

  obtenerListaCambios(): any[] {
    return Object.values(this.cambiosDetectados);
  }

  cancelarConfirmacion(): void {
    this.mostrarConfirmacionEditar = false;
  }

  confirmarAccion(): void {
    this.mostrarConfirmacionEditar = false;
    this.guardar();
  }

  private guardar(): void {
    if (!this.validarCampos()) {
      return;
    }

    const body = {
      reca_Id: this.recarga.reca_Id,
      reca_Confirmacion: this.recarga.reca_Confirmacion,
      reca_Observaciones: this.recarga.reca_Observaciones || '',
      Usua_Modificacion: getUserId(),
      reca_FechaModificacion: new Date().toISOString()
    };

    this.http.put<any>(`${environment.apiBaseUrl}/Recargas/Confirmar`, body, {
      headers: {
        'X-Api-Key': environment.apiKey,
        'Content-Type': 'application/json',
        'accept': '*/*'
      }
    }).subscribe({
      cosole.log()
      next: (response) => {
        if (response && response.code_Status === 1) {
          this.mostrarAlertaExito = true;
          this.mensajeExito = response.message_Status || 'Recarga procesada exitosamente.';
          this.mostrarErrores = false;
          
          this.recarga.reca_Estado = this.recarga.reca_Confirmacion;
          
          setTimeout(() => {
            this.onSave.emit(this.recarga);
            this.cancelar();
          }, 3000);
        } else {
          this.mostrarAlertaError = true;
          this.mensajeError = response?.message_Status || 'Error al procesar la recarga.';
          setTimeout(() => this.cerrarAlerta(), 5000);
        }
      },
      error: (error) => {
        console.error('Error al confirmar recarga:', error);
        this.mostrarAlertaError = true;
        
        if (error.status === 400 && error.error?.message_Status) {
          this.mensajeError = error.error.message_Status;
        } else if (error.status === 500) {
          this.mensajeError = 'Error interno del servidor. Contacte al administrador.';
        } else if (error.status === 0) {
          this.mensajeError = 'No se pudo conectar con el servidor. Verifique su conexión.';
        } else {
          this.mensajeError = 'Error inesperado. Intente de nuevo.';
        }
        
        setTimeout(() => this.cerrarAlerta(), 5000);
      }
    });
  }

  getEstadoBadgeClass(estado: string): string {
    switch (estado?.toLowerCase()) {
      case 'pendiente': return 'bg-warning text-dark';
      case 'confirmada': return 'bg-success';
      case 'rechazada': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }

  onObservacionesChange(): void {
    if (this.recarga.reca_Observaciones && this.recarga.reca_Observaciones.length > 500) {
      this.recarga.reca_Observaciones = this.recarga.reca_Observaciones.substring(0, 500);
    }
  }

  onEstadoConfirmacionChange(): void {
    if (this.recarga.reca_Confirmacion === 'Rechazada') {
      setTimeout(() => {
        const textarea = document.querySelector('textarea[ng-reflect-model]') as HTMLTextAreaElement;
        if (textarea) textarea.focus();
      }, 100);
    }
  }

  cancelar(): void {
    this.cerrarAlerta();
    this.onCancel.emit();
  }

  cerrarAlerta(): void {
    this.mostrarAlertaExito = false;
    this.mostrarAlertaError = false;
    this.mostrarAlertaWarning = false;
    this.mensajeExito = '';
    this.mensajeError = '';
    this.mensajeWarning = '';
  }
}