import { Component, Output, EventEmitter, Input, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Modelo } from 'src/app/Modelos/general/Modelo.Model';
import { environment } from 'src/environments/environment';

interface Marca {
  maVe_Id: number;
  maVe_Marca: string;
}

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class EditComponent implements OnInit, OnChanges {
  @Input() modeloData: Modelo | null = null;
  @Output() onCancel = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<Modelo>();

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

  modeloOriginal = '';
  marcaOriginal = 0;
  mostrarErrores = false;
  mostrarAlertaExito = false;
  mensajeExito = '';
  mostrarAlertaError = false;
  mensajeError = '';
  mostrarAlertaWarning = false;
  mensajeWarning = '';
  mostrarConfirmacionEditar = false;
  
  // Cambiamos el nombre para que coincida con el HTML
  marcasVehiculo: Marca[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarMarcas();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['modeloData'] && changes['modeloData'].currentValue) {
      this.modelo = { ...changes['modeloData'].currentValue };
      this.modeloOriginal = this.modelo.mode_Descripcion || '';
      this.marcaOriginal = this.modelo.maVe_Id || 0;
      this.mostrarErrores = false;
      this.cerrarAlerta();
      
      // Asegurarnos de que las marcas estén cargadas antes de establecer el valor
      if (this.marcasVehiculo.length === 0) {
        this.cargarMarcas();
      }
    }
  }

  private cargarMarcas(): void {
    this.http.get<Marca[]>(`${environment.apiBaseUrl}/MarcasVehiculos/Listar`, {
      headers: { 'x-api-key': environment.apiKey }
    }).subscribe({
      next: (data) => {
        this.marcasVehiculo = data;
        console.log('Marcas cargadas:', this.marcasVehiculo);
        console.log('Marca actual del modelo:', this.modelo.maVe_Id);
        
        // Verificar si la marca actual existe en la lista
        const marcaExiste = this.marcasVehiculo.find(marca => marca.maVe_Id === this.modelo.maVe_Id);
        if (!marcaExiste && this.modelo.maVe_Id > 0) {
          console.warn('La marca del modelo no existe en la lista de marcas disponibles');
        }
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

    if (this.modelo.mode_Descripcion.trim() && this.modelo.maVe_Id) {
      // Verificar si hay cambios
      const hayDescripcionCambiada = this.modelo.mode_Descripcion.trim() !== this.modeloOriginal;
      const hayMarcaCambiada = this.modelo.maVe_Id !== this.marcaOriginal;

      if (hayDescripcionCambiada || hayMarcaCambiada) {
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

    if (this.modelo.mode_Descripcion.trim() && this.modelo.maVe_Id) {
      const modeloActualizar = {
        mode_Id: this.modelo.mode_Id,
        maVe_Id: this.modelo.maVe_Id,
        mode_Descripcion: this.modelo.mode_Descripcion.trim(),
        usua_Creacion: this.modelo.usua_Creacion,
        mode_FechaCreacion: this.modelo.mode_FechaCreacion,
        usua_Modificacion: environment.usua_Id,
        mode_FechaModificacion: new Date().toISOString(),
        usuarioCreacion: '',
        usuarioModificacion: ''
      };

      this.http.put<any>(`${environment.apiBaseUrl}/Modelo/Actualizar`, modeloActualizar, {
        headers: {
          'X-Api-Key': environment.apiKey,
          'Content-Type': 'application/json',
          'accept': '*/*'
        }
      }).subscribe({
        next: (response) => {
          this.mensajeExito = `Modelo "${this.modelo.mode_Descripcion}" actualizado exitosamente`;
          this.mostrarAlertaExito = true;
          this.mostrarErrores = false;

          setTimeout(() => {
            this.mostrarAlertaExito = false;
            this.onSave.emit(this.modelo);
            this.cancelar();
          }, 3000);
        },
        error: (error) => {
          console.error('Error al actualizar modelo:', error);
          this.mostrarAlertaError = true;
          this.mensajeError = 'Error al actualizar el modelo. Por favor, intente nuevamente.';
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