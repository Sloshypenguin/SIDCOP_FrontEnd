import { Component, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { EstadoCivil } from 'src/app/Modelos/general/EstadoCivil.Model';
import { environment } from 'src/environments/environment';
import { Empleado } from 'src/app/Modelos/general/Empleado.Model';
import { NgSelectModule } from '@ng-select/ng-select';
import { DropzoneModule, DropzoneConfigInterface } from 'ngx-dropzone-wrapper';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, NgSelectModule, DropzoneModule],
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
      // Recargar imagen si existe
      if (this.empleado.empl_Imagen) {
        this.uploadedFiles = [{
          dataURL: this.empleado.empl_Imagen,
          name: 'Imagen actual',
          size: null
        }];
      } else {
        this.uploadedFiles = [];
      }
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
      // Recargar imagen si existe
      if (this.empleado.empl_Imagen) {
        this.uploadedFiles = [{
          dataURL: this.empleado.empl_Imagen,
          name: 'Imagen actual',
          size: null
        }];
      } else {
        this.uploadedFiles = [];
      }
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

    // Compara todos los campos relevantes
    const original = this.empleadoData;
    const actual = this.empleado;
    const haCambiado =
      (original?.empl_DNI?.trim() || '') !== (actual.empl_DNI?.trim() || '') ||
      (original?.empl_Codigo?.trim() || '') !== (actual.empl_Codigo?.trim() || '') ||
      (original?.empl_Nombres?.trim() || '') !== (actual.empl_Nombres?.trim() || '') ||
      (original?.empl_Apellidos?.trim() || '') !== (actual.empl_Apellidos?.trim() || '') ||
      (original?.empl_Sexo?.trim() || '') !== (actual.empl_Sexo?.trim() || '') ||
      (original?.empl_FechaNacimiento || '') !== (actual.empl_FechaNacimiento || '') ||
      (original?.empl_Correo?.trim() || '') !== (actual.empl_Correo?.trim() || '') ||
      (original?.empl_Telefono?.trim() || '') !== (actual.empl_Telefono?.trim() || '') ||
      (original?.sucu_Id || 0) !== (actual.sucu_Id || 0) ||
      (original?.esCv_Id || 0) !== (actual.esCv_Id || 0) ||
      (original?.carg_Id || 0) !== (actual.carg_Id || 0) ||
      (original?.colo_Id || 0) !== (actual.colo_Id || 0) ||
      (original?.empl_DireccionExacta?.trim() || '') !== (actual.empl_DireccionExacta?.trim() || '');

    // Valida campos requeridos
    const camposRequeridos = [
      actual.empl_DNI,
      actual.empl_Codigo,
      actual.empl_Nombres,
      actual.empl_Apellidos,
      actual.empl_Sexo,
      actual.empl_FechaNacimiento,
      actual.empl_Correo,
      actual.empl_Telefono,
      actual.sucu_Id,
      actual.esCv_Id,
      actual.carg_Id,
      actual.colo_Id,
      actual.empl_DireccionExacta
    ];
    const todosLlenos = camposRequeridos.every(c => c && c.toString().trim() !== '');

    if (todosLlenos) {
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

  async guardar(): Promise<void> {
    this.mostrarErrores = true;
    const fechaInicial = new Date(this.empleado.empl_FechaNacimiento).toISOString().split('T')[0];

    // Si hay un archivo local seleccionado en uploadedFiles, subirlo a Cloudinary
    if (this.uploadedFiles.length > 0 && this.uploadedFiles[0].file) {
      try {
        const imageUrl = await this.uploadImageToCloudinary(this.uploadedFiles[0].file);
        this.empleado.empl_Imagen = imageUrl;
      } catch (error) {
        this.mostrarAlertaError = true;
        this.mensajeError = 'Error al subir la imagen a Cloudinary.';
        return; // No continuar si la imagen no se pudo subir
      }
    }

    if (this.empleado.empl_Nombres.trim()) {
      const empleadoActualizar = {
        empl_Id: this.empleado.empl_Id,
        empl_DNI: this.empleado.empl_DNI,
        empl_Codigo: this.empleado.empl_Codigo,
        empl_Nombres: this.empleado.empl_Nombres,
        empl_Apellidos: this.empleado.empl_Apellidos,
        empl_Sexo: this.empleado.empl_Sexo,
        empl_FechaNacimiento: fechaInicial,
        empl_Correo: this.empleado.empl_Correo,
        empl_Telefono: this.empleado.empl_Telefono,
        sucu_Id: this.empleado.sucu_Id,
        esCv_Id: this.empleado.esCv_Id,
        carg_Id: this.empleado.carg_Id,
        colo_Id: this.empleado.colo_Id,
        empl_DireccionExacta: this.empleado.empl_DireccionExacta,
        empl_Imagen: this.empleado.empl_Imagen,
        empl_Estado: true,
        usua_Creacion: environment.usua_Id, // variable global
        empl_FechaCreacion: new Date().toISOString(),
        usua_Modificacion: 1,
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


    //Imagenes

     //Crear imagenes

     public dropzoneConfig: DropzoneConfigInterface = {
      url: 'https://httpbin.org/post', // No subir a ningún endpoint automáticamente
      clickable: true,
      addRemoveLinks: true,
      previewsContainer: false,
      paramName: 'file',
      maxFilesize: 50,
      acceptedFiles: 'image/*',
    };
    
    uploadedFiles: any[] = [];
    
    // File Upload
    imageURL: any;

    onFileSelected(event: any) {
      const file = Array.isArray(event) ? event[0] : event;
      if (!file) return;

      // Previsualización local inmediata
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.uploadedFiles = [{ ...file, dataURL: e.target.result, name: file.name, file: file }];
      };
      reader.readAsDataURL(file);
    }

    

      // Subida directa a Cloudinary
      async uploadImageToCloudinary(file: File): Promise<string> {
        const url = 'https://api.cloudinary.com/v1_1/dbt7mxrwk/upload'; // demo es el valor de prueba
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'empleados'); // preset_prueba es el valor de prueba
        
        const response = await fetch(url, {
          method: 'POST',
          body: formData
        });
        console.log(response);
        const data = await response.json();
        if (!data.secure_url) throw new Error('No se pudo obtener la URL de la imagen');
        return data.secure_url;
      }
    
      // File Remove
      removeFile(event: any) {
        this.uploadedFiles.splice(this.uploadedFiles.indexOf(event), 1);
      }
}
