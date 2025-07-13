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
    numero: '',
    esCv_FechaCreacion: new Date(),
    esCv_FechaModificacion: new Date(),
    code_Status: 0,
    message_Status: ''
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
        numero: this.estadoCivilData.numero || '',
        esCv_FechaCreacion: this.estadoCivilData.esCv_FechaCreacion || new Date(),
        esCv_FechaModificacion: this.estadoCivilData.esCv_FechaModificacion || new Date(),
        code_Status: this.estadoCivilData.code_Status || 0,
        message_Status: this.estadoCivilData.message_Status || ''
      };
      // Guardar el valor original para mostrarlo en la confirmación
      this.estadoCivilOriginal = this.estadoCivilData.esCv_Descripcion || '';
      console.log('Estado civil loaded:', this.estadoCivil);
      console.log('ID específico después de carga:', this.estadoCivil.esCv_Id);
    } else if (this.estadoCivilId > 0) {
      this.cargarEstadoCivil();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['estadoCivilData'] && changes['estadoCivilData'].currentValue) {
      console.log('Estado civil data changed:', changes['estadoCivilData'].currentValue);
      this.estadoCivil = { ...changes['estadoCivilData'].currentValue };
      // Guardar el valor original para mostrarlo en la confirmación
      this.estadoCivilOriginal = changes['estadoCivilData'].currentValue.esCv_Descripcion || '';
      console.log('Estado civil después de asignación:', this.estadoCivil);
      console.log('ID asignado:', this.estadoCivil.esCv_Id);
      // Limpiar errores y alertas cuando se cambie el estado civil
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
      
      // Ocultar la alerta de warning después de 4 segundos
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

  confirmarEdicion(): void {
    this.mostrarConfirmacionEditar = false;
    this.guardar();
  }



  private guardar(): void {
    this.mostrarErrores = true;
    
    if (this.estadoCivil.esCv_Descripcion.trim()) {
      // Limpiar alertas previas
      this.mostrarAlertaWarning = false;
      this.mostrarAlertaError = false;
      
      // Preparar objeto para enviar al API
      const estadoCivilActualizar = {
        esCv_Id: this.estadoCivil.esCv_Id, // Asegurar que use el ID correcto
        esCv_Descripcion: this.estadoCivil.esCv_Descripcion.trim(),
        usua_Creacion: this.estadoCivil.usua_Creacion,
        esCv_FechaCreacion: this.estadoCivil.esCv_FechaCreacion,
        usua_Modificacion: environment.usua_Id,
        numero: this.estadoCivil.numero || "",
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
          
          // Ocultar la alerta después de 3 segundos
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
