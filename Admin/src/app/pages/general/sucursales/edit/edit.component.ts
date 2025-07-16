import { Component, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Sucursales } from 'src/app/Modelos/general/Sucursales.Model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class EditComponent implements OnChanges {
  @Input() sucursalData: Sucursales | null = null;
  @Output() onCancel = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<Sucursales>();

  sucursal: Sucursales = {
    sucu_Id: 0,
    sucu_Descripcion: '',
    colo_Id: 0,
    sucu_DireccionExacta: '',
    sucu_Telefono1: '',
    sucu_Telefono2: '',
    sucu_Correo: '',
    usua_Creacion: 0,
    sucu_FechaCreacion: new Date(),
    sucu_Estado: true
  };

  sucursalOriginal = '';
  mostrarErrores = false;
  mostrarAlertaExito = false;
  mensajeExito = '';
  mostrarAlertaError = false;
  mensajeError = '';
  mostrarAlertaWarning = false;
  mensajeWarning = '';
  mostrarConfirmacionEditar = false;

  municipios: any[] = [];
  coloniasAll: any[] = [];
  colonias: any[] = [];
  municipioSeleccionado: string = '';

  constructor(private http: HttpClient) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['sucursalData'] && changes['sucursalData'].currentValue) {
      this.sucursal = { ...changes['sucursalData'].currentValue };
      this.sucursalOriginal = this.sucursal.sucu_Descripcion || '';
      this.mostrarErrores = false;
      this.cerrarAlerta();

      // Cargar municipios y colonias
      this.http.get<any[]>(`${environment.apiBaseUrl}/Municipios/Listar`, {
        headers: { 'x-api-key': environment.apiKey }
      }).subscribe(data => {
        this.municipios = data;
      });

      this.http.get<any[]>(`${environment.apiBaseUrl}/Colonia/Listar`, {
        headers: { 'x-api-key': environment.apiKey }
      }).subscribe(data => {
        this.coloniasAll = data;
        // Seleccionar municipio y filtrar colonias
        const coloniaActual = this.coloniasAll.find(c => c.colo_Id === this.sucursal.colo_Id);
        this.municipioSeleccionado = coloniaActual ? coloniaActual.muni_Codigo : '';
        this.onMunicipioChange();
      });
    }
  }

  onMunicipioChange(): void {
    if (this.municipioSeleccionado) {
      this.colonias = this.coloniasAll.filter(
        c => c.muni_Codigo === this.municipioSeleccionado
      );
      // Si la colonia actual no pertenece al municipio seleccionado, limpiar selección
      if (!this.colonias.some(c => c.colo_Id === this.sucursal.colo_Id)) {
        this.sucursal.colo_Id = 0;
      }
    } else {
      this.colonias = [];
      this.sucursal.colo_Id = 0;
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

    if (
      this.sucursal.sucu_Descripcion.trim() &&
      this.sucursal.colo_Id &&
      this.sucursal.sucu_DireccionExacta.trim() &&
      this.sucursal.sucu_Telefono1.trim() &&
      this.sucursal.sucu_Correo.trim()
    ) {
      if (this.sucursal.sucu_Descripcion.trim() !== this.sucursalOriginal) {
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

    if (
      this.sucursal.sucu_Descripcion.trim() &&
      this.sucursal.colo_Id &&
      this.sucursal.sucu_DireccionExacta.trim() &&
      this.sucursal.sucu_Telefono1.trim() &&
      this.sucursal.sucu_Correo.trim()
    ) {
      const sucursalActualizar = {
        ...this.sucursal,
        usua_Modificacion: environment.usua_Id,
        sucu_FechaModificacion: new Date().toISOString()
      };

      this.http.put<any>(`${environment.apiBaseUrl}/Sucursales/Actualizar`, sucursalActualizar, {
        headers: {
          'X-Api-Key': environment.apiKey,
          'Content-Type': 'application/json',
          'accept': '*/*'
        }
      }).subscribe({
        next: (response) => {
          if (response?.data?.code_Status === 1) {
            this.mensajeExito = response.data.message_Status || `Sucursal "${this.sucursal.sucu_Descripcion}" actualizada exitosamente`;
            this.mostrarAlertaExito = true;
            this.mostrarErrores = false;

            setTimeout(() => {
              this.mostrarAlertaExito = false;
              this.onSave.emit(this.sucursal);
              this.cancelar();
            }, 3000);
          } else {
            this.mostrarAlertaError = true;
            this.mensajeError = response?.data?.message_Status || 'No se pudo actualizar la sucursal.';
            this.mostrarAlertaExito = false;

            setTimeout(() => {
              this.mostrarAlertaError = false;
              this.mensajeError = '';
            }, 5000);
          }
        },
        error: (error) => {
          this.mostrarAlertaError = true;
          this.mensajeError = error?.error?.data?.message_Status || 'Error al actualizar la sucursal. Por favor, intente nuevamente.';
          this.mostrarAlertaExito = false;
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