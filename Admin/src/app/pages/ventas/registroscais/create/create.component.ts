import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RegistroCAI } from 'src/app/Modelos/ventas/RegistroCAI.Model';
import { environment } from 'src/environments/environment.prod';
import { getUserId } from 'src/app/core/utils/user-utils';
//import { co } from '@fullcalendar/core/internal-common';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent {
  @Output() onCancel = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<RegistroCAI>();
  
  mostrarErrores = false;
  mostrarAlertaExito = false;
  mensajeExito = '';
  mostrarAlertaError = false;
  mensajeError = '';
  mostrarAlertaWarning = false;
  mensajeWarning = '';

  CAI: any[] = []; 
  PE: any[] = [];
  Sucursales: any[] = []; // Lista de sucursales, se puede llenar con un servicio si es necesario
  cargarCAI() {
      this.http.get<any>(`${environment.apiBaseUrl}/CaiS/Listar`, {
        headers: { 'x-api-key': environment.apiKey }
      }).subscribe((data) => this.CAI = data);
    };

     cargarPE() {
      this.http.get<any>(`${environment.apiBaseUrl}/PuntoEmision/Listar`, {
        headers: { 'x-api-key': environment.apiKey }
      }).subscribe((data) => this.PE = data);
    };


     cargarSucursales() {
      this.http.get<any>(`${environment.apiBaseUrl}/Sucursales/Listar`, {
        headers: { 'x-api-key': environment.apiKey }
      }).subscribe((data) => this.Sucursales = data);
    };

  constructor(private http: HttpClient) {

        this.cargarCAI();
    this.cargarSucursales();
    this.cargarPE();
  }
  registroCai: RegistroCAI = {
    regC_Id: 0,
    regC_Descripcion: '',
    sucu_Id: 0,
    sucu_Descripcion: '',
    puEm_Id: 0,
    puEm_Codigo: '',
    puEm_Descripcion: '',
    nCai_Id: 0,
    nCai_Codigo: '',
    nCai_Descripcion: '',
    regC_RangoInicial: '',
    regC_RangoFinal: '',
    regC_FechaInicialEmision: new Date(),
    regC_FechaFinalEmision: new Date(),

      regC_Estado: true,
    usua_Creacion: 0,
    usua_Modificacion: 0,
   estado: "",
    regC_FechaCreacion: new Date(),
    regC_FechaModificacion: new Date(),
    code_Status: 0,
    message_Status: '',
    usuarioCreacion: '',
    usuarioModificacion: ''
  };

  cancelar(): void {
    this.mostrarErrores = false;
    this.mostrarAlertaExito = false;
    this.mensajeExito = '';
    this.mostrarAlertaError = false;
    this.mensajeError = '';
    this.mostrarAlertaWarning = false;
    this.mensajeWarning = '';
    this.registroCai = {
    regC_Id: 0,
    regC_Descripcion: '',
    sucu_Id: 0,
    sucu_Descripcion: '',
    puEm_Id: 0,
    puEm_Codigo: '',
    puEm_Descripcion: '',
    nCai_Id: 0,
    nCai_Codigo: '',
    nCai_Descripcion: '',
    regC_RangoInicial: '',
    regC_RangoFinal: '',
    regC_FechaInicialEmision: new Date(),
    regC_FechaFinalEmision: new Date(),

    usua_Creacion: 0,
    usua_Modificacion: 0,
    regC_Estado: true,
   
    regC_FechaCreacion: new Date(),
    regC_FechaModificacion: new Date(),
    code_Status: 0,
    message_Status: '',
    usuarioCreacion: '',
    usuarioModificacion: ''
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
    
    if (this.registroCai.regC_Descripcion.trim()) {
      // Limpiar alertas previas
      this.mostrarAlertaWarning = false;
      this.mostrarAlertaError = false;
       
      const registroscaisGuardar = {
        regC_Id: 0,
        regC_Descripcion: this.registroCai.regC_Descripcion.trim(),
        sucu_Id: this.registroCai.sucu_Id,
        sucu_Descripcion: "",
        puEm_Id: this.registroCai.puEm_Id,
       // puEm_Codigo: this.registroCai.puEm_Codigo.trim(),
        puEm_Descripcion: "",
        nCai_Id: this.registroCai.nCai_Id,
        //nCai_Codigo: this.registroCai.nCai_Codigo.trim(),
        nCai_Descripcion: "",

        regC_RangoInicial: this.registroCai.regC_RangoInicial.trim(),
        regC_RangoFinal: this.registroCai.regC_RangoFinal.trim(),
        regC_FechaInicialEmision: this.registroCai.regC_FechaInicialEmision,
        regC_FechaFinalEmision: this.registroCai.regC_FechaFinalEmision,
secuencia: 0,
        estado: "",
        code_Status: 0,
        message_Status: '',
        regC_Estado: false,
        usua_Creacion: getUserId(),// varibale global, obtiene el valor del environment, esto por mientras
        regC_FechaCreacion: new Date().toISOString(),
        usua_Modificacion: 0,
        numero: "", 
        regC_FechaModificacion: new Date().toISOString(),
        usuarioCreacion: "", 
        usuarioModificacion: "" 
      };

      console.log('Guardando registro:', registroscaisGuardar);
      
      this.http.post<any>(`${environment.apiBaseUrl}/RegistrosCaiS/Crear`, registroscaisGuardar, {
        headers: { 
          'X-Api-Key': environment.apiKey,
          'Content-Type': 'application/json',
          'accept': '*/*'
        }
      }).subscribe({
        next: (response) => {
          console.log('PE guardado exitosamente:', response);
          this.mensajeExito = `Registro CAI "${this.registroCai.puEm_Descripcion}" guardado exitosamente`;
          this.mostrarAlertaExito = true;
          this.mostrarErrores = false;
          
          // Ocultar la alerta después de 3 segundos
          setTimeout(() => {
            this.mostrarAlertaExito = false;
            this.onSave.emit(this.registroCai);
            this.cancelar();
          }, 3000);
        },
        error: (error) => {
          console.error('Error al guardar Registro CAI:', error);
          this.mostrarAlertaError = true;
          this.mensajeError = 'Error al ingresar Registro CAI. Por favor, intente nuevamente.';
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
}
