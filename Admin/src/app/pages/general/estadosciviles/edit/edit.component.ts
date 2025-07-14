import { Component, Output, EventEmitter, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { EstadoCivil } from 'src/app/Modelos/general/EstadoCivil.Model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class EditComponent implements OnInit, OnChanges {
  @Input() estadoCivilId: number = 0;
  @Input() estadoCivilData: EstadoCivil | null = null;
  @Output() onCancel = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<EstadoCivil>();
  
  mostrarErrores = false;
  mostrarAlertaExito = false;
  mensajeExito = '';  
  mostrarAlertaError = false;
  mensajeError = '';
  mostrarAlertaWarning = false;
  mensajeWarning = '';
  mostrarConfirmacionEditar = false;
  estadoCivilOriginal = '';

  constructor(private http: HttpClient) {}

  estadoCivil: EstadoCivil = {
    esCv_Id: 0,
    esCv_Descripcion: '',
    usua_Creacion: 0,
    usua_Modificacion: 0,
    secuencia: 0,
    esCv_FechaCreacion: new Date(),
    esCv_FechaModificacion: new Date(),
    code_Status: 0,
    message_Status: '',
    usuarioCreacion: '',
    usuarioModificacion: ''
  };


  ngOnInit(): void {
    console.log('Edit component initialized with data:', this.estadoCivilData);
    if (this.estadoCivilData) {
      // Asegurar que copiamos correctamente el objeto
      this.estadoCivil = { 
        ...this.estadoCivilData,
        esCv_Id: this.estadoCivilData.esCv_Id, // Asegurar que el ID se copie
        esCv_Descripcion: this.estadoCivilData.esCv_Descripcion || '',
        usua_Creacion: this.estadoCivilData.usua_Creacion || 0,
        usua_Modificacion: this.estadoCivilData.usua_Modificacion || 0,
        secuencia: this.estadoCivilData.secuencia || 0,
        esCv_FechaCreacion: this.estadoCivilData.esCv_FechaCreacion || new Date(),
        esCv_FechaModificacion: this.estadoCivilData.esCv_FechaModificacion || new Date(),
        code_Status: this.estadoCivilData.code_Status || 0,
        message_Status: this.estadoCivilData.message_Status || ''
      };
      // Guardar el valor original para mostrarlo en la confirmación
      this.estadoCivilOriginal = this.estadoCivilData.esCv_Descripcion || '';
    } else if (this.estadoCivilId > 0) {
      this.cargarEstadoCivil();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['estadoCivilData'] && changes['estadoCivilData'].currentValue) {
      this.estadoCivil = { ...changes['estadoCivilData'].currentValue };
      this.estadoCivilOriginal = changes['estadoCivilData'].currentValue.esCv_Descripcion || '';
      this.mostrarErrores = false;
      this.cerrarAlerta();
    }
  }

  cargarEstadoCivil(): void {
    this.http.get<EstadoCivil>(`${environment.apiBaseUrl}/EstadosCiviles/${this.estadoCivilId}`, {
      headers: { 
        'X-Api-Key': environment.apiKey,
        'accept': '*/*'
      }
    }).subscribe({
      next: (response) => {
        this.estadoCivil = response;
      },
      error: (error) => {
        console.error('Error al cargar estado civil:', error);
        this.mostrarAlertaError = true;
        this.mensajeError = 'Error al cargar los datos del estado civil.';
        
        setTimeout(() => {
          this.mostrarAlertaError = false;
          this.mensajeError = '';
        }, 5000);
      }
    });
  }

  cancelar(): void {
    this.mostrarErrores = false;
    this.mostrarAlertaExito = false;
    this.mensajeExito = '';
    this.mostrarAlertaError = false;
    this.mensajeError = '';
    this.mostrarAlertaWarning = false;
    this.mensajeWarning = '';
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

  mostrarConfirmacion(): void {
    this.mostrarErrores = true;
    
    if (this.estadoCivil.esCv_Descripcion.trim()) {
      this.mostrarConfirmacionEditar = true;
    } else {
      // Mostrar alerta de warning para campos vacíos
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

  cancelarEdicion(): void {
    this.mostrarConfirmacionEditar = false;
  }
  validarEdicion(): void {
    this.mostrarErrores = true;
    
    if (this.estadoCivil.esCv_Descripcion.trim()) {
      // Si el campo ha cambiado, mostrar confirmación
      if (this.estadoCivil.esCv_Descripcion.trim() !== this.estadoCivilOriginal) {
        this.mostrarConfirmacionEditar = true;
      } else {
        //si no hay cambios, mostrar alerta de warning para indicar que no se han detectado cambios
        this.mostrarAlertaWarning = true;
        this.mensajeWarning = 'no se han detectado cambios';
         setTimeout(() => {
        this.mostrarAlertaWarning = false;
        this.mensajeWarning = '';
      }, 4000);
      }
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

  confirmarEdicion(): void {
    this.mostrarConfirmacionEditar = false;
    this.guardar();
  }



  private guardar(): void {
    this.mostrarErrores = true;
    
    if (this.estadoCivil.esCv_Descripcion.trim()) {
      this.mostrarAlertaWarning = false;
      this.mostrarAlertaError = false;
      
      const estadoCivilActualizar = {
        esCv_Id: this.estadoCivil.esCv_Id,
        esCv_Descripcion: this.estadoCivil.esCv_Descripcion.trim(),
        usua_Creacion: this.estadoCivil.usua_Creacion,
        esCv_FechaCreacion: this.estadoCivil.esCv_FechaCreacion,
        usua_Modificacion: environment.usua_Id,
        secuencia: this.estadoCivil.secuencia || 0,
        esCv_FechaModificacion: new Date().toISOString(),
        usuarioCreacion: "", 
        usuarioModificacion: ""
      };

      console.log('Actualizando estado civil:', estadoCivilActualizar);
      console.log('ID del estado civil:', this.estadoCivil.esCv_Id);
      
      this.http.put<any>(`${environment.apiBaseUrl}/EstadosCiviles/Actualizar`, estadoCivilActualizar, {
        headers: { 
          'X-Api-Key': environment.apiKey,
          'Content-Type': 'application/json',
          'accept': '*/*'
        }
      }).subscribe({
        next: (response) => {
          console.log('Estado civil actualizado exitosamente:', response);
          this.mensajeExito = `Estado civil "${this.estadoCivil.esCv_Descripcion}" actualizado exitosamente`;
          this.mostrarAlertaExito = true;
          this.mostrarErrores = false;
          
          setTimeout(() => {
            this.mostrarAlertaExito = false;
            this.onSave.emit(this.estadoCivil);
            this.cancelar();
          }, 3000);
        },
        error: (error) => {
          console.error('Error al actualizar estado civil:', error);
          this.mostrarAlertaError = true;
          this.mensajeError = 'Error al actualizar el estado civil. Por favor, intente nuevamente.';
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
