import { Component, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RegistroCAI } from 'src/app/Modelos/ventas/RegistroCAI.Model';
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
  @Input() RegistroCaiData: RegistroCAI | null = null;
  @Output() onCancel = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<RegistroCAI>();

  registroCai: RegistroCAI = {
    regC_Id: 0,
    regC_Descripcion: '',
    sucu_Id: 0,
    puEm_Id: 0,
    nCai_Id: 0,
    regC_RangoInicial: '',
    regC_RangoFinal: '',
    regC_FechaInicialEmision: new Date(),
    regC_FechaFinalEmision: new Date(),

    usua_Creacion: 0,
    usua_Modificacion: 0,
   
    regC_FechaCreacion: new Date(),
    regC_FechaModificacion: new Date(),
    code_Status: 0,
    message_Status: '',
    usuarioCreacion: '',
    usuarioModificacion: '',
    regC_Estado: true,

    sucu_Descripcion: '',
    puEm_Codigo: '',
    nCai_Codigo: '',
    nCai_Descripcion: '',
    puEm_Descripcion: '',
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

 CAI: any[] = []; 
  PE: any[] = [];
  Sucursales: any[] = []; // Lista de sucursales, se puede llenar con un servicio si es necesario
  cargarCAI() {
      this.http.get<any>('https://localhost:7071/CaiS/Listar', {
        headers: { 'x-api-key': environment.apiKey }
      }).subscribe((data) => this.CAI = data);
    };

     cargarPE() {
      this.http.get<any>('https://localhost:7071/PuntoEmision/Listar', {
        headers: { 'x-api-key': environment.apiKey }
      }).subscribe((data) => this.PE = data);
    };


     cargarSucursales() {
      this.http.get<any>('https://localhost:7071/Sucursales/Listar', {
        headers: { 'x-api-key': environment.apiKey }
      }).subscribe((data) => this.Sucursales = data);
    };

  constructor(private http: HttpClient) {

        this.cargarCAI();
    this.cargarSucursales();
    this.cargarPE();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['RegistroCaiData'] && changes['RegistroCaiData'].currentValue) {
      this.registroCai = { ...changes['RegistroCaiData'].currentValue };
      this.PEOriginal = this.registroCai.regC_Descripcion || '';
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

    if (this.registroCai.regC_Descripcion.trim()) {
      if (this.registroCai.regC_Descripcion.trim() !== this.PEOriginal) {
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

    if (this.registroCai.regC_Descripcion.trim()) {
      const RegistroCAIActualizar = {
        regC_Id: this.registroCai.regC_Id,
        regC_Descripcion: this.registroCai.regC_Descripcion.trim(),
        sucu_Id: this.registroCai.sucu_Id,
         sucu_Descripcion: "",
        puEm_Id: this.registroCai.puEm_Id,
          puEm_Descripcion: "",
        nCai_Id: this.registroCai.nCai_Id,
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
        usua_Modificacion: getUserId(),
        regC_FechaModificacion: new Date().toISOString(),
          usuarioCreacion: "", 
        usuarioModificacion: "" 
       
      };

      this.http.put<any>(`${environment.apiBaseUrl}/RegistrosCaiS/Modificar`, RegistroCAIActualizar, {
        headers: {
          'X-Api-Key': environment.apiKey,
          'Content-Type': 'application/json',
          'accept': '*/*'
        }
      }).subscribe({
        next: (response) => {
          this.mensajeExito = `Registro CAI "${this.registroCai.regC_Descripcion}" actualizado exitosamente`;
          this.mostrarAlertaExito = true;
          this.mostrarErrores = false;

          setTimeout(() => {
            this.mostrarAlertaExito = false;
            this.onSave.emit(this.registroCai);
            this.cancelar();
          }, 3000);
        },
        error: (error) => {
          console.error('Error al actualizar el Registro CAI:', error);
          this.mostrarAlertaError = true;
          this.mensajeError = 'Por favor, intente nuevamente.';
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
