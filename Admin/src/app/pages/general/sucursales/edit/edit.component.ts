import { Component, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Sucursales } from 'src/app/Modelos/general/Sucursales.Model';
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
  aplicarMascaraTelefono(valor: string): string {
    valor = valor.replace(/[^\d]/g, '').slice(0, 8);
    let resultado = '';
    for (let i = 0; i < valor.length; i += 4) {
      if (resultado) resultado += '-';
      resultado += valor.substring(i, i + 4);
    }
    return resultado;
  }

  onTelefonoInput(event: Event, campo: 'sucu_Telefono1' | 'sucu_Telefono2') {
    const input = event.target as HTMLInputElement;
    if (input && input.value !== undefined) {
      this.sucursal[campo] = this.aplicarMascaraTelefono(input.value);
    }
  }
  // Overlay de carga animado
  mostrarOverlayCarga = false;
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

  departamentos: any[] = [];
  departamentoSeleccionado: string = '';
  municipiosAll: any[] = [];
  municipios: any[] = [];
  municipioSeleccionado: string = '';
  coloniasAll: any[] = [];
  colonias: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['sucursalData'] && changes['sucursalData'].currentValue) {
      this.sucursal = { ...changes['sucursalData'].currentValue };
      this.sucursalOriginal = this.sucursal.sucu_Descripcion || '';
      this.mostrarErrores = false;
      this.cerrarAlerta();

      // Cargar departamentos
      this.http.get<any[]>(`${environment.apiBaseUrl}/Departamentos/Listar`, {
        headers: { 'x-api-key': environment.apiKey }
      }).subscribe(data => {
        this.departamentos = data;

        // Si ya hay una colonia seleccionada, buscar el municipio y departamento correspondiente
        this.http.get<any[]>(`${environment.apiBaseUrl}/Colonia/Listar`, {
          headers: { 'x-api-key': environment.apiKey }
        }).subscribe(coloniasData => {
          this.coloniasAll = coloniasData;
          const coloniaActual = this.coloniasAll.find(c => c.colo_Id === this.sucursal.colo_Id);
          this.municipioSeleccionado = coloniaActual ? coloniaActual.muni_Codigo : '';
          // Buscar el municipio para obtener el departamento
          this.http.get<any[]>(`${environment.apiBaseUrl}/Municipios/Listar`, {
            headers: { 'x-api-key': environment.apiKey }
          }).subscribe(munisData => {
            this.municipiosAll = munisData;
            const municipioActual = this.municipiosAll.find(m => m.muni_Codigo === this.municipioSeleccionado);
            this.departamentoSeleccionado = municipioActual ? municipioActual.depa_Codigo : '';
            this.onDepartamentoChange();
            this.onMunicipioChange();
          });
        });
      });
    }
  }

  onDepartamentoChange(): void {
    if (this.departamentoSeleccionado) {
      this.municipios = this.municipiosAll.filter(
        m => m.depa_Codigo === this.departamentoSeleccionado
      );
      // Si el municipio actual no pertenece al departamento seleccionado, limpiar selección
      if (!this.municipios.some(m => m.muni_Codigo === this.municipioSeleccionado)) {
        this.municipioSeleccionado = '';
        this.colonias = [];
        this.sucursal.colo_Id = 0;
      }
    } else {
      this.municipios = [];
      this.municipioSeleccionado = '';
      this.colonias = [];
      this.sucursal.colo_Id = 0;
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
      const hayCambios =
        this.sucursal.sucu_Descripcion.trim() !== this.sucursalData?.sucu_Descripcion?.trim() ||
        this.sucursal.colo_Id !== this.sucursalData?.colo_Id ||
        this.sucursal.sucu_DireccionExacta.trim() !== this.sucursalData?.sucu_DireccionExacta?.trim() ||
        this.sucursal.sucu_Telefono1.trim() !== this.sucursalData?.sucu_Telefono1?.trim() ||
        this.sucursal.sucu_Telefono2?.trim() !== this.sucursalData?.sucu_Telefono2?.trim() ||
        this.sucursal.sucu_Correo.trim() !== this.sucursalData?.sucu_Correo?.trim();

      if (hayCambios) {
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
        usua_Modificacion: getUserId(),
        sucu_FechaModificacion: new Date().toISOString()
      };

      this.mostrarOverlayCarga = true;
      this.http.put<any>(`${environment.apiBaseUrl}/Sucursales/Actualizar`, sucursalActualizar, {
        headers: {
          'X-Api-Key': environment.apiKey,
          'Content-Type': 'application/json',
          'accept': '*/*'
        }
      }).subscribe({
        next: (response) => {
          this.mostrarOverlayCarga = false;
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
          this.mostrarOverlayCarga = false;
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