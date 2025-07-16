import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Colonias } from 'src/app/Modelos/general/Colonias.Model';
import { Municipio } from 'src/app/Modelos/general/Municipios.Model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {
  @Output() onSave = new EventEmitter<Colonias>();
  @Output() onCancel = new EventEmitter<void>();

  nuevaColonia: Colonias = {
    colo_Id: 0,
    colo_Descripcion: '',
    muni_Codigo: '',
    usua_Creacion: 0,
    usua_Modificacion: 0,
    secuencia: 0,
    colo_FechaCreacion: new Date(),
    colo_FechaModificacion: new Date(),
    code_Status: 0,
    message_Status: '',
    usuarioCreacion: '',
    usuarioModificacion: '',
    depa_Codigo: '',
    depa_Descripcion: '',
    muni_Descripcion: ''  
  };
  municipios: Municipio[] = [];
  cargando = false;
  mostrarAlerta = false;
  mensajeAlerta = '';

  Departamentos: any[] = [];
  TodosMunicipios: any[] = [];

  Municipios: any[] = [];

  selectedDepa: string = '';
  selectedMuni: string = '';
  mostrarErrores = false;
  mostrarAlertaExito = false;
  mensajeExito = '';
  mostrarAlertaError = false;
  mensajeError = '';
  mostrarAlertaWarning = false;
  mensajeWarning = '';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.cargarListados();
  }

  cargarListados(): void {
    this.http.get<any>(`${environment.apiBaseUrl}/Departamentos/Listar`, {
      headers: { 'x-api-key': environment.apiKey }
    }).subscribe({
      next: (data) => this.Departamentos = data,
      error: (error) => console.error('Error cargando departamentos:', error)
    });

    this.http.get<any>(`${environment.apiBaseUrl}/Municipios/Listar`, {
      headers: { 'x-api-key': environment.apiKey }
    }).subscribe({
      next: (data) => this.TodosMunicipios = data,
      error: (error) => console.error('Error cargando municipios:', error)
    });
  }

  cargarMunicipios(codigoDepa: string): void {
    this.Municipios = this.TodosMunicipios.filter(m => m.depa_Codigo === codigoDepa);
    this.selectedMuni = '';
  }

  guardar(): void {
    this.mostrarErrores = true;
    
    if ((this.nuevaColonia.colo_Descripcion ?? '').trim() && (this.nuevaColonia.muni_Codigo ?? '').trim()) {
      // Limpiar alertas previas
      this.mostrarAlertaWarning = false;
      this.mostrarAlertaError = false;
      
      const coloniaGuardar = {
        colo_Descripcion: (this.nuevaColonia.colo_Descripcion ?? '').trim(),
        muni_Codigo: (this.nuevaColonia.muni_Codigo ?? '').trim(),
        usua_Creacion: environment.usua_Id,// varibale global, obtiene el valor del environment, esto por mientras
        colo_FechaCreacion: new Date().toISOString(),
        usua_Modificacion: 0,
        numero: "", 
        colo_FechaModificacion: new Date().toISOString(),
        usuarioCreacion: "", 
        usuarioModificacion: "" 
      };

      console.log('Guardando colonia:', coloniaGuardar);
      
      this.http.post<any>(`${environment.apiBaseUrl}/Colonia/Insertar`, coloniaGuardar, {
        headers: { 
          'X-Api-Key': environment.apiKey,
          'Content-Type': 'application/json',
          'accept': '*/*'
        }
      }).subscribe({
        next: (response) => {
          if (response.data.code_Status === 1) 
          {
            console.log('Colonia guardada exitosamente:', response);
            this.mensajeExito = `Colonia "${this.nuevaColonia.colo_Descripcion}" guardada exitosamente`;
            this.mostrarAlertaExito = true;
            this.mostrarErrores = false;
            
            // Ocultar la alerta después de 3 segundos
            setTimeout(() => {
              this.mostrarAlertaExito = false;
              this.onSave.emit(this.nuevaColonia);
              this.cancelar();
            }, 3000);
          }
          else 
          {
            console.error('Error al guardar colonia:' + response.data.message_Status);
            this.mostrarAlertaError = true;
            this.mensajeError = 'Error al guardar la colonia, ' + response.data.message_Status;
            this.mostrarAlertaExito = false;
            
            // Ocultar la alerta de error después de 5 segundos
            setTimeout(() => {
              this.mostrarAlertaError = false;
              this.mensajeError = '';
            }, 5000);
          }
          
        },
        error: (error) => {
          console.error('Error al guardar colonia:', error);
          this.mostrarAlertaError = true;
          this.mensajeError = 'Error al guardar la colonia. Por favor, intente nuevamente.';
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

  cancelar(): void {
    this.mostrarErrores = false;
    this.mostrarAlertaExito = false;
    this.mensajeExito = '';
    this.mostrarAlertaError = false;
    this.mensajeError = '';
    this.mostrarAlertaWarning = false;
    this.mensajeWarning = '';
    this.nuevaColonia = {
      colo_Id: 0,
      colo_Descripcion: '',
      muni_Codigo: '',
      usua_Creacion: 0,
      usua_Modificacion: 0,
      secuencia: 0,
      colo_FechaCreacion: new Date(),
      colo_FechaModificacion: new Date(),
      code_Status: 0,
      message_Status: '',
      usuarioCreacion: '',
      usuarioModificacion: '',
      depa_Codigo: '',
      depa_Descripcion: '',
      muni_Descripcion: ''  
    };
    this.selectedDepa = '';
    this.selectedMuni = '';
    this.onCancel.emit();
  }

  cerrarAlerta(): void {
    this.mostrarAlerta = false;
  }
}
