import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { getUserId } from 'src/app/core/utils/user-utils';
import { Sucursales } from 'src/app/Modelos/general/Sucursales.Model';
import { Municipio } from 'src/app/Modelos/general/Municipios.Model';
import { Departamento } from 'src/app/Modelos/general/Departamentos.Model';
import { Colonias } from 'src/app/Modelos/general/Colonias.Model';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent implements OnInit {
  onTelefonoInput(event: Event, campo: 'sucu_Telefono1' | 'sucu_Telefono2') {
    const input = event.target as HTMLInputElement;
    if (input && input.value !== undefined) {
      this.sucursal[campo] = this.aplicarMascaraTelefono(input.value);
    }
  }
  aplicarMascaraTelefono(valor: string): string {
    valor = valor.replace(/[^\d]/g, '').slice(0, 8);
    let resultado = '';
    for (let i = 0; i < valor.length; i += 4) {
      if (resultado) resultado += '-';
      resultado += valor.substring(i, i + 4);
    }
    return resultado;
  }
  @Output() onCancel = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<Sucursales>();

  mostrarErrores = false;
  mostrarAlertaExito = false;
  mensajeExito = '';
  mostrarAlertaError = false;
  mensajeError = '';
  mostrarAlertaWarning = false;
  mensajeWarning = '';

departamentos: Departamento[] = [];
departamentoSeleccionado: string = '';
municipiosAll: Municipio[] = [];
municipios: Municipio[] = [];    
municipioSeleccionado: string = '';
coloniasfiltro: Colonias[] = [];
colonias: Colonias[] = [];

  sucursal: Sucursales = {
    sucu_Id: 0,
    sucu_Descripcion: '',
    colo_Id: 0,
    sucu_DireccionExacta: '',
    sucu_Telefono1: '',
    sucu_Telefono2: '',
    sucu_Correo: '',
    usua_Creacion: getUserId(),
    sucu_FechaCreacion: new Date(),
    sucu_Estado: true
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Obtener departamentos
    this.http.get<Departamento[]>(`${environment.apiBaseUrl}/Departamentos/Listar`, {
    headers: { 'x-api-key': environment.apiKey }
  }).subscribe(data => {
    
    this.departamentos = data;
  }, error => {
    console.error('Error al cargar los departamentos', error);
  });

    // Obtener municipios (todos)
    this.http.get<Municipio[]>(`${environment.apiBaseUrl}/Municipios/Listar`, {
      headers: { 'x-api-key': environment.apiKey }
    }).subscribe(data => {
      this.municipiosAll = data;
    });

    // Obtener colonias
    this.http.get<any[]>(`${environment.apiBaseUrl}/Colonia/Listar`, {
      headers: { 'x-api-key': environment.apiKey }
    }).subscribe(data => {
      this.coloniasfiltro = data;
    });
  }

  onDepartamentoChange(): void {
    if (this.departamentoSeleccionado) {
      this.municipios = this.municipiosAll.filter(
        m => m.depa_Codigo === this.departamentoSeleccionado
      );
      this.municipioSeleccionado = '';
      this.colonias = [];
      this.sucursal.colo_Id = 0;
    } else {
      this.municipios = [];
      this.municipioSeleccionado = '';
      this.colonias = [];
      this.sucursal.colo_Id = 0;
    }
  }

  onMunicipioChange(): void {
    if (this.municipioSeleccionado) {
      this.colonias = this.coloniasfiltro.filter(
        c => c.muni_Codigo === this.municipioSeleccionado
      );
      this.sucursal.colo_Id = 0; 
    } else {
      this.colonias = [];
      this.sucursal.colo_Id = 0;
    }
  }

  cancelar(): void {
    this.mostrarErrores = false;
    this.mostrarAlertaExito = false;
    this.mensajeExito = '';
    this.mostrarAlertaError = false;
    this.mensajeError = '';
    this.mostrarAlertaWarning = false;
    this.mensajeWarning = '';
    this.sucursal = {
      sucu_Id: 0,
      sucu_Descripcion: '',
      colo_Id: 0,
      sucu_DireccionExacta: '',
      sucu_Telefono1: '',
      sucu_Telefono2: '',
      sucu_Correo: '',
      usua_Creacion: getUserId(),
      sucu_FechaCreacion: new Date(),
      sucu_Estado: true
    };
    this.onCancel.emit();
    this.departamentoSeleccionado = '';
    this.municipioSeleccionado = '';
    this.municipios = [];
    this.colonias = [];
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
      this.sucursal.sucu_Descripcion.trim() &&
      this.sucursal.colo_Id &&
      this.sucursal.sucu_DireccionExacta.trim() &&
      this.sucursal.sucu_Telefono1.trim() &&
      this.sucursal.sucu_Correo.trim()
    ) {
      this.mostrarAlertaWarning = false;
      this.mostrarAlertaError = false;

      const sucursalGuardar = {
        ...this.sucursal,
        usua_Creacion: getUserId(),
        sucu_FechaCreacion: new Date().toISOString()
      };

      this.http.post<any>(`${environment.apiBaseUrl}/Sucursales/Insertar`, sucursalGuardar, {
        headers: {
          'X-Api-Key': environment.apiKey,
          'Content-Type': 'application/json',
          'accept': '*/*'
        }
      }).subscribe({
        next: (response) => {
          if (response?.data?.code_Status === 1) {
            this.mensajeExito = response.data.message_Status || `Sucursal "${this.sucursal.sucu_Descripcion}" guardada exitosamente`;
            this.mostrarAlertaExito = true;
            this.mostrarErrores = false;

            setTimeout(() => {
              this.mostrarAlertaExito = false;
              this.onSave.emit(this.sucursal);
              this.cancelar();
            }, 3000);
          }
          if(response?.data?.code_Status === -1) {
            this.mostrarAlertaError = true;
            this.mensajeError = response?.data?.message_Status || 'ya existe una sucursal con estos datos.';
            console.error('Error al guardar la sucursal:', this.mensajeError);
            this.mostrarAlertaExito = false;

            setTimeout(() => {
              this.mostrarAlertaError = false;
              this.mensajeError = '';
            }, 5000);
          }
        },
        error: (error) => {
          console.error('Error al guardar sucursal:', error);
          const codeStatus = error?.error?.data?.code_Status;
          const messageStatus = error?.error?.data?.message_Status;
          this.mostrarAlertaError = true;
          if (codeStatus === 0) {
            this.mensajeError = messageStatus || 'Error al guardar la sucursal. Por favor, intente nuevamente.';
          } else if (codeStatus === -1) {
            this.mensajeError = messageStatus || 'Ya existe una sucursal con estos datos.';
          } else {
            this.mensajeError = error?.error?.message || 'Error inesperado al guardar la sucursal.';
          }
          this.mostrarAlertaExito = false;
          setTimeout(() => {
            this.mostrarAlertaError = false;
            this.mensajeError = '';
          }, 5000);
        }
      });
    } else {
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