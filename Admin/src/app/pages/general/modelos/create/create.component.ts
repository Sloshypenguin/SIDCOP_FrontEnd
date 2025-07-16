import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Modelo } from 'src/app/Modelos/general/Modelo.Model';

// Interfaz para las marcas
interface Marca {
  maVe_Id: number;
  maVe_Marca: string;
}

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {
  
  // Eventos para comunicación con el componente padre
  @Output() onCancel = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<Modelo>();

  // Modelo para el formulario
  modelo: Modelo = {
    mode_Id: 0,
    maVe_Id: 0,
    maVe_Marca: '',
    mode_Descripcion: '',
    usua_Creacion: 0,
    mode_FechaCreacion: new Date(),
    usua_Modificacion: 0,
    mode_FechaModificacion: new Date(),
    usuarioCreacion: '',
    usuarioModificacion: '',
    code_Status: 0,
    message_Status: ''
  };

  // Lista de marcas para el select
  marcas: Marca[] = [];

  // Control de validaciones
  mostrarErrores = false;

  // Propiedades para alertas
  mostrarAlertaExito = false;
  mensajeExito = '';
  mostrarAlertaError = false;
  mensajeError = '';
  mostrarAlertaWarning = false;
  mensajeWarning = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarMarcas();
  }

  /**
   * Carga las marcas disponibles para el select
   */
  private cargarMarcas(): void {
    this.http.get<Marca[]>(`${environment.apiBaseUrl}/MarcaVehiculo/Listar`, {
      headers: { 'x-api-key': environment.apiKey }
    }).subscribe({
      next: (data) => {
        this.marcas = data;
        console.log('Marcas cargadas:', this.marcas);
      },
      error: (error) => {
        console.error('Error al cargar marcas:', error);
        this.mostrarAlertaError = true;
        this.mensajeError = 'Error al cargar las marcas disponibles';
        
        // Ocultar la alerta de error después de 5 segundos
        setTimeout(() => {
          this.mostrarAlertaError = false;
          this.mensajeError = '';
        }, 5000);
      }
    });
  }

  /**
   * Cancela la operación y resetea el formulario
   */
  cancelar(): void {
    this.mostrarErrores = false;
    this.mostrarAlertaExito = false;
    this.mensajeExito = '';
    this.mostrarAlertaError = false;
    this.mensajeError = '';
    this.mostrarAlertaWarning = false;
    this.mensajeWarning = '';
    
    // Resetear el modelo
    this.modelo = {
      mode_Id: 0,
      maVe_Id: 0,
      maVe_Marca: '',
      mode_Descripcion: '',
      usua_Creacion: 0,
      mode_FechaCreacion: new Date(),
      usua_Modificacion: 0,
      mode_FechaModificacion: new Date(),
      usuarioCreacion: '',
      usuarioModificacion: '',
      code_Status: 0,
      message_Status: ''
    };
    
    this.onCancel.emit();
  }

  /**
   * Cierra las alertas manualmente
   */
  cerrarAlerta(): void {
    this.mostrarAlertaExito = false;
    this.mensajeExito = '';
    this.mostrarAlertaError = false;
    this.mensajeError = '';
    this.mostrarAlertaWarning = false;
    this.mensajeWarning = '';
  }

  /**
   * Guarda el modelo
   */
  guardar(): void {
    this.mostrarErrores = true;
    
    if (this.modelo.maVe_Id && this.modelo.mode_Descripcion.trim()) {
      // Limpiar alertas previas
      this.mostrarAlertaWarning = false;
      this.mostrarAlertaError = false;
      
      const modeloAGuardar = {
        mode_Id: 0,
        maVe_Id: this.modelo.maVe_Id,
        mode_Descripcion: this.modelo.mode_Descripcion.trim(),
        usua_Creacion: environment.usua_Id, // variable global del environment
        mode_FechaCreacion: new Date().toISOString(),
        usua_Modificacion: 0,
        mode_FechaModificacion: new Date().toISOString(),
        usuarioCreacion: "",
        usuarioModificacion: ""
      };

      console.log('Guardando modelo:', modeloAGuardar);

      this.http.post<any>(`${environment.apiBaseUrl}/Modelo/Insertar`, modeloAGuardar, {
        headers: { 
          'X-Api-Key': environment.apiKey,
          'Content-Type': 'application/json',
          'accept': '*/*'
        }
      }).subscribe({
        next: (response) => {
          console.log('Modelo guardado exitosamente:', response);
          this.mensajeExito = `Modelo "${this.modelo.mode_Descripcion}" guardado exitosamente`;
          this.mostrarAlertaExito = true;
          this.mostrarErrores = false;
          
          // Ocultar la alerta después de 3 segundos
          setTimeout(() => {
            this.mostrarAlertaExito = false;
            this.onSave.emit(this.modelo);
            this.cancelar();
          }, 3000);
        },
        error: (error) => {
          console.error('Error al guardar modelo:', error);
          this.mostrarAlertaError = true;
          this.mensajeError = 'Error al guardar el modelo. Por favor, intente nuevamente.';
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