import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Empleado } from 'src/app/Modelos/general/Empleado.Model';
import { environment } from 'src/environments/environment';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';


@Component({
  selector: 'app-create',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, NgSelectModule, NgxMaskDirective, NgxMaskPipe],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss',
  providers: [provideNgxMask()]
})
export class CreateComponent {

  sucursales: any[] = [];
  estadosCiviles: any[] = [];
  cargos: any[] = [];
  colonias: any[] = [];

  @Output() onCancel = new EventEmitter<void>();
    @Output() onSave = new EventEmitter<Empleado>();
    
    mostrarErrores = false;
    mostrarAlertaExito = false;
    mensajeExito = '';
    mostrarAlertaError = false;
    mensajeError = '';
    mostrarAlertaWarning = false;
    mensajeWarning = '';
  
    constructor(private http: HttpClient) {}

    ngOnInit(): void {
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
  
    cancelar(): void {
      this.mostrarErrores = false;
      this.mostrarAlertaExito = false;
      this.mensajeExito = '';
      this.mostrarAlertaError = false;
      this.mensajeError = '';
      this.mostrarAlertaWarning = false;
      this.mensajeWarning = '';
      this.empleado = {
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
      
      if (this.empleado.empl_DNI.trim()) {
        // Limpiar alertas previas
        this.mostrarAlertaWarning = false;
        this.mostrarAlertaError = false;
        
        const estadoCivilGuardar = {
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
  
        console.log('Guardando estado civil:', estadoCivilGuardar);
        
        this.http.post<any>(`${environment.apiBaseUrl}/Empleado/Insertar`, estadoCivilGuardar, {
          headers: { 
            'X-Api-Key': environment.apiKey,
            'Content-Type': 'application/json',
            'accept': '*/*'
          }
        }).subscribe({
          next: (response) => {
            console.log('Estado civil guardado exitosamente:', response);
            this.mensajeExito = `Empleado "${this.empleado.empl_Nombres}" guardado exitosamente`;
            this.mostrarAlertaExito = true;
            this.mostrarErrores = false;
            
            // Ocultar la alerta después de 3 segundos
            setTimeout(() => {
              this.mostrarAlertaExito = false;
              this.onSave.emit(this.empleado);
              this.cancelar();
            }, 3000);
          },
          error: (error) => {
            console.error('Error al guardar estado civil:', error);
            this.mostrarAlertaError = true;
            this.mensajeError = 'Error al guardar el empleado. Por favor, intente nuevamente.';
            this.mostrarAlertaExito = false;
            
            // Ocultar la alerta de error después de 5 segundos
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
        
        // Ocultar la alerta de warning después de 4 segundos
        setTimeout(() => {
          this.mostrarAlertaWarning = false;
          this.mensajeWarning = '';
        }, 4000);
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
