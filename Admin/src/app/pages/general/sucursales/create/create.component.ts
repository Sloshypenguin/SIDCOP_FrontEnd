import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Sucursales } from 'src/app/Modelos/general/Sucursales.Model';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent implements OnInit {
  @Output() onCancel = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<Sucursales>();

  mostrarErrores = false;
  mostrarAlertaExito = false;
  mensajeExito = '';
  mostrarAlertaError = false;
  mensajeError = '';
  mostrarAlertaWarning = false;
  mensajeWarning = '';

  municipios: any[] = [];
  colonias: any[] = [];
  municipioSeleccionado: string = '';

  sucursal: Sucursales = {
    sucu_Id: 0,
    sucu_Descripcion: '',
    colo_Id: 0,
    sucu_DireccionExacta: '',
    sucu_Telefono1: '',
    sucu_Telefono2: '',
    sucu_Correo: '',
    usua_Creacion: environment.usua_Id,
    sucu_FechaCreacion: new Date(),
    sucu_Estado: true
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Cargar municipios al iniciar
    this.http.get<any[]>(`${environment.apiBaseUrl}/Municipios/Listar`, {
      headers: { 'x-api-key': environment.apiKey }
    }).subscribe(data => {
      this.municipios = data;
    });
  }


onMunicipioChange(): void {
  if (this.municipioSeleccionado) {
    this.http.get<any[]>(`${environment.apiBaseUrl}/Colonia/Listar?muni_Codigo=${this.municipioSeleccionado}`, {
      headers: { 'x-api-key': environment.apiKey }
    }).subscribe(data => {
      this.colonias = data;
      this.sucursal.colo_Id = 0; 
    });
  } else {
    this.colonias = [];
    this.sucursal.colo_Id = 0;
  }
}

// ...existing code...

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
      usua_Creacion: environment.usua_Id,
      sucu_FechaCreacion: new Date(),
      sucu_Estado: true
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
        usua_Creacion: environment.usua_Id,
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
          this.mensajeExito = `Sucursal "${this.sucursal.sucu_Descripcion}" guardada exitosamente`;
          this.mostrarAlertaExito = true;
          this.mostrarErrores = false;

          setTimeout(() => {
            this.mostrarAlertaExito = false;
            this.onSave.emit(this.sucursal);
            this.cancelar();
          }, 3000);
        },
        error: (error) => {
          this.mostrarAlertaError = true;
          this.mensajeError = 'Error al guardar la sucursal. Por favor, intente nuevamente.';
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