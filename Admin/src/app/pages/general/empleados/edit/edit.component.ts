import { Component, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { EstadoCivil } from 'src/app/Modelos/general/EstadoCivil.Model';
import { environment } from 'src/environments/environment';
import { Empleado } from 'src/app/Modelos/general/Empleado.Model';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, NgSelectModule],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class EditComponent implements OnChanges {
  @Input() empleadoData: Empleado | null = null;
  @Output() onCancel = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<Empleado>();

  sucursales: any[] = [];
  estadosCiviles: any[] = [];
  cargos: any[] = [];
  colonias: any[] = [];

  ngOnInit(): void {
    if (this.empleadoData) {
      this.empleado = { ...this.empleadoData };
      this.empleadoOriginal = this.empleado.empl_Apellidos || '';
    }

      this.obtenerSucursales();
      this.obtenerEstadosCiviles();
      this.obtenerCargos();
      this.obtenerColonias();
    }

 empleado: Empleado = {
      empl_Id: 0,
      empl_DNI: '',
      empl_Codigo: '',
      empl_Nombres: '',
      empl_Apellidos: '',
      empl_Sexo: '',
      empl_FechaNacimiento: new Date(),
      empl_Correo: '',
      empl_Telefono: '',
      sucu_Id: 0,
      esCv_Id: 0,
      carg_Id: 0,
      colo_Id: 0,
      empl_DireccionExacta: '',
      usua_Creacion: 0,
      empl_FechaCreacion: new Date(),
      usua_Modificacion: 0,
      empl_FechaModificacion: new Date(),
      empl_Estado: true
    };

  empleadoOriginal = '';
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
    if (changes['empleadoData'] && changes['empleadoData'].currentValue) {
      this.empleado = { ...changes['empleadoData'].currentValue };
      this.empleadoOriginal = this.empleado.empl_Apellidos || '';
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

  if (this.empleado.empl_Apellidos.trim()) {
    const haCambiado = this.empleado.empl_Apellidos.trim() !== (this.empleadoData?.empl_Apellidos?.trim() || '');

    if (haCambiado) {
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

    if (this.empleado.empl_Nombres.trim()) {
      const empleadoActualizar = {
        empl_Id: 0,
          empl_DNI: this.empleado.empl_DNI,
          empl_Codigo: this.empleado.empl_Codigo,
          empl_Nombres: this.empleado.empl_Nombres,
          empl_Apellidos: this.empleado.empl_Apellidos,
          empl_Sexo: this.empleado.empl_Sexo,
          empl_FechaNacimiento: new Date(this.empleado.empl_FechaNacimiento).toISOString(),
          empl_Correo: this.empleado.empl_Correo,
          empl_Telefono: this.empleado.empl_Telefono,
          sucu_Id: this.empleado.sucu_Id,
          esCv_Id: this.empleado.esCv_Id,
          carg_Id: this.empleado.carg_Id,
          colo_Id: this.empleado.colo_Id,
          empl_DireccionExacta: this.empleado.empl_DireccionExacta,
          empl_Estado: true,
          usua_Creacion: environment.usua_Id,// varibale global, obtiene el valor del environment, esto por mientras
          empl_FechaCreacion: new Date().toISOString(),
          usua_Modificacion: 0,
          empl_FechaModificacion: new Date().toISOString(),
      };

      this.http.put<any>(`${environment.apiBaseUrl}/Empleado/Actualizar`, empleadoActualizar, {
        headers: {
          'X-Api-Key': environment.apiKey,
          'Content-Type': 'application/json',
          'accept': '*/*'
        }
      }).subscribe({
        next: (response) => {
          this.mensajeExito = `Empleado "${this.empleado.empl_Nombres}" actualizado exitosamente`;
          this.mostrarAlertaExito = true;
          this.mostrarErrores = false;

          setTimeout(() => {
            this.mostrarAlertaExito = false;
            this.onSave.emit(this.empleado);
            this.cancelar();
          }, 3000);
        },
        error: (error) => {
          console.error('Error al actualizar empleado:', error);
          this.mostrarAlertaError = true;
          this.mensajeError = 'Error al actualizar el empleado. Por favor, intente nuevamente.';
          setTimeout(() => this.cerrarAlerta(), 5000);
        }
      });
    } else {
      this.mostrarAlertaWarning = true;
      this.mensajeWarning = 'Por favor complete todos los campos requeridos antes de guardar.';
      setTimeout(() => this.cerrarAlerta(), 4000);
    }
  }


  //Selects
    obtenerSucursales() {
      const headers = {
        'X-Api-Key': environment.apiKey,
        'Content-Type': 'application/json',
        'accept': '*/*'
      };

      this.http.get<any[]>(`${environment.apiBaseUrl}/Sucursales/Listar`, { headers }).subscribe({
        next: (data) => {
          this.sucursales = data;
        },
        error: (error) => {
          console.error('Error al obtener sucursales:', error);
        }
      });
    }


    obtenerEstadosCiviles() {
      const headers = {
        'X-Api-Key': environment.apiKey,
        'Content-Type': 'application/json',
        'accept': '*/*'
      };

      this.http.get<any[]>(`${environment.apiBaseUrl}/EstadosCiviles/Listar`, { headers }).subscribe({
        next: (data) => {
          this.estadosCiviles = data;
        },
        error: (error) => {
          console.error('Error al obtener los estados civiles:', error);
        }
      });
    }


    obtenerCargos() {
      const headers = {
        'X-Api-Key': environment.apiKey,
        'Content-Type': 'application/json',
        'accept': '*/*'
      };

      this.http.get<any[]>(`${environment.apiBaseUrl}/Cargo/Listar`, { headers }).subscribe({
        next: (data) => {
          this.cargos = data;
        },
        error: (error) => {
          console.error('Error al obtener cargos:', error);
        }
      });
    }

    obtenerColonias() {
      const headers = {
        'X-Api-Key': environment.apiKey,
        'Content-Type': 'application/json',
        'accept': '*/*'
      };

      this.http.get<any[]>(`${environment.apiBaseUrl}/Colonia/Listar`, { headers }).subscribe({
        next: (data) => {
          this.colonias = data;
        },
        error: (error) => {
          console.error('Error al obtener colonias:', error);
        }
      });
    }
}
