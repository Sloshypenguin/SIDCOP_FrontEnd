import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { getUserId } from 'src/app/core/utils/user-utils';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-edit-config-factura',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, NgSelectModule],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class EditConfigFacturaComponent implements OnChanges {
  @Input() configFacturaData: any | null = null;
  @Output() onCancel = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<any>();

  configFactura: any = {
    coFa_Id: 0,
    coFa_NombreEmpresa: '',
    coFa_DireccionEmpresa: '',
    coFa_RTN: '',
    coFa_Correo: '',
    coFa_Telefono1: '',
    coFa_Telefono2: '',
    coFa_Logo: '',
    colo_Id: 0,
    usua_Creacion: 0,
    usua_Modificacion: 0,
    coFa_FechaCreacion: new Date(),
    coFa_FechaModificacion: new Date()
  };

  configFacturaOriginal: any = {};
  
  // Catálogos
  colonia: any[] = [];
  
  logoSeleccionado = false;

  mostrarErrores = false;
  mostrarAlertaExito = false;
  mostrarAlertaError = false;
  mostrarAlertaWarning = false;
  mostrarConfirmacionEditar = false;

  mensajeExito = '';
  mensajeError = '';
  mensajeWarning = '';

  constructor(private http: HttpClient) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['configFacturaData']?.currentValue) {
      this.configFactura = { ...this.configFacturaData };
      this.configFacturaOriginal = { ...this.configFacturaData };
      this.logoSeleccionado = !!this.configFactura.coFa_Logo;
      this.mostrarErrores = false;
      this.cerrarAlerta();
      this.listarColonias();
    }
  }

  // Función de búsqueda para colonias (igual que en crear)
  searchColonias = (term: string, item: any) => {
    term = term.toLowerCase();
    return (
      item.colo_Descripcion?.toLowerCase().includes(term) ||
      item.muni_Descripcion?.toLowerCase().includes(term) ||
      item.depa_Descripcion?.toLowerCase().includes(term)
    );
  };

  // Función para ordenar por municipio y departamento (igual que en crear)
  ordenarPorMunicipioYDepartamento(colonias: any[]): any[] {
    return colonias.sort((a, b) => {
      // Primero por departamento
      if (a.depa_Descripcion < b.depa_Descripcion) return -1;
      if (a.depa_Descripcion > b.depa_Descripcion) return 1;
      // Luego por municipio
      if (a.muni_Descripcion < b.muni_Descripcion) return -1;
      if (a.muni_Descripcion > b.muni_Descripcion) return 1;
      return 0;
    });
  }

  // Cargar colonias (igual que en crear)
  listarColonias(): void {
    this.http.get<any>(`${environment.apiBaseUrl}/Colonia/Listar`, {
      headers: { 'x-api-key': environment.apiKey }
    }).subscribe({
      next: (data) => this.colonia = this.ordenarPorMunicipioYDepartamento(data),
      error: (error) => console.error('Error cargando colonias:', error)
    });
  }

  // Variable para dirección inicial
  direccionExactaInicial: string = '';

  // Método cuando se selecciona una colonia (igual que en crear)
  onColoniaSeleccionada(colo_Id: number) {
    const coloniaSeleccionada = this.colonia.find((c: any) => c.colo_Id === colo_Id);

    if (coloniaSeleccionada) {
      this.direccionExactaInicial = coloniaSeleccionada.colo_Descripcion;
      this.configFactura.coFa_DireccionEmpresa = coloniaSeleccionada.colo_Descripcion;
    } else {
      this.direccionExactaInicial = '';
      this.configFactura.coFa_DireccionEmpresa = '';
    }
  }

  onImagenSeleccionada(event: any) {
    // Obtenemos el archivo seleccionado desde el input tipo file
    const file = event.target.files[0];

    if (file) {
      // para enviar la imagen a Cloudinary
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'configuracion_empresa');
      //Subidas usuarios Carpeta identificadora en Cloudinary
      //dbt7mxrwk es el nombre de la cuenta de Cloudinary
      const url = 'https://api.cloudinary.com/v1_1/dbt7mxrwk/upload';

      fetch(url, {
        method: 'POST',
        body: formData
      })
      .then(response => response.json())
      .then(data => {
        console.log('Imagen subida a Cloudinary:', data);
        this.configFactura.coFa_Logo = data.secure_url;
      })
      .catch(error => {
        console.error('Error al subir la imagen a Cloudinary:', error);
      });
    }
  }

  validarEdicion(): void {
    this.mostrarErrores = true;

    if (this.validarCampos()) {
      if (this.hayDiferencias()) {
        this.mostrarConfirmacionEditar = true;
      } else {
        this.mostrarAlertaWarning = true;
        this.mensajeWarning = 'No se han detectado cambios.';
        setTimeout(() => this.cerrarAlerta(), 4000);
      }
    } else {
      this.mostrarAlertaWarning = true;
      this.mensajeWarning = 'Por favor complete todos los campos requeridos.';
      setTimeout(() => this.cerrarAlerta(), 4000);
    }
  }

  // Método para validar todos los campos obligatorios (igual que en crear)
  private validarCampos(): boolean {
    const camposObligatorios = [
      { campo: this.configFactura.coFa_NombreEmpresa.trim(), nombre: 'Nombre de la empresa' },
      { campo: this.configFactura.coFa_DireccionEmpresa.trim(), nombre: 'Dirección de la empresa' },
      { campo: this.configFactura.coFa_RTN.trim(), nombre: 'RTN' },
      { campo: this.configFactura.coFa_Correo.trim(), nombre: 'Correo electrónico' },
      { campo: this.configFactura.coFa_Telefono1.trim(), nombre: 'Teléfono principal' },
      { campo: this.configFactura.coFa_Logo, nombre: 'Logo' },
      { campo: this.configFactura.colo_Id, nombre: 'Colonia' }
    ];

    const camposVacios = camposObligatorios.filter(item => {
      // Para colo_Id verificamos que sea mayor a 0
      if (item.nombre === 'Colonia') {
        return item.campo === 0;
      }
      // Para el resto verificamos que no esté vacío
      return !item.campo;
    });

    if (camposVacios.length > 0) {
      const nombresCampos = camposVacios.map(item => item.nombre).join(', ');
      this.mensajeWarning = `Por favor complete los siguientes campos obligatorios: ${nombresCampos}`;
      this.mostrarAlertaWarning = true;
      this.mostrarAlertaError = false;
      this.mostrarAlertaExito = false;
      
      // Ocultar la alerta de warning después de 5 segundos
      setTimeout(() => {
        this.mostrarAlertaWarning = false;
        this.mensajeWarning = '';
      }, 5000);
      
      return false;
    }

    return true;
  }

  hayDiferencias(): boolean {
    const a = this.configFactura;
    const b = this.configFacturaOriginal;
    return (
      a.coFa_NombreEmpresa !== b.coFa_NombreEmpresa ||
      a.coFa_DireccionEmpresa !== b.coFa_DireccionEmpresa ||
      a.coFa_RTN !== b.coFa_RTN ||
      a.coFa_Correo !== b.coFa_Correo ||
      a.coFa_Telefono1 !== b.coFa_Telefono1 ||
      a.coFa_Telefono2 !== b.coFa_Telefono2 ||
      a.colo_Id !== b.colo_Id ||
      a.coFa_Logo !== b.coFa_Logo
    );
  }

  cancelarEdicion(): void {
    this.mostrarConfirmacionEditar = false;
  }

  confirmarEdicion(): void {
    this.mostrarConfirmacionEditar = false;
    this.guardar();
  }

  private guardar(): void {
    const body = {
      ...this.configFactura,
      usua_Modificacion: getUserId(),
      coFa_FechaModificacion: new Date().toISOString()
    };

    this.http.put<any>(`${environment.apiBaseUrl}/ConfiguracionFactura/Actualizar`, body, {
      headers: {
        'X-Api-Key': environment.apiKey,
        'Content-Type': 'application/json',
        'accept': '*/*'
      }
    }).subscribe({
      next: () => {
        this.mostrarAlertaExito = true;
        this.mensajeExito = 'Configuración actualizada exitosamente.';
        this.mostrarErrores = false;
        setTimeout(() => {
          this.onSave.emit(this.configFactura);
          this.cancelar();
        }, 3000);
      },
      error: (error) => {
        console.error('Error al actualizar:', error);
        this.mostrarAlertaError = true;
        this.mensajeError = 'Error al actualizar. Intente de nuevo.';
        setTimeout(() => this.cerrarAlerta(), 5000);
      }
    });
  }

  cancelar(): void {
    this.cerrarAlerta();
    this.onCancel.emit();
  }

  cerrarAlerta(): void {
    this.mostrarAlertaExito = false;
    this.mostrarAlertaError = false;
    this.mostrarAlertaWarning = false;
    this.mensajeExito = '';
    this.mensajeError = '';
    this.mensajeWarning = '';
  }
}