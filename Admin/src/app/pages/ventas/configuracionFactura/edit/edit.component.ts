import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { getUserId } from 'src/app/core/utils/user-utils';

@Component({
  selector: 'app-edit-config-factura',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
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
  Departamentos: any[] = [];
  Municipios: any[] = [];
  Colonias: any[] = [];
  TodosMunicipios: any[] = [];
  TodosColonias: any[] = [];

  selectedDepa = '';
  selectedMuni = '';
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
      this.cargarCatalogos();
    }
  }

  cargarCatalogos(): void {
    this.http.get<any>(`${environment.apiBaseUrl}/Departamentos/Listar`, {
      headers: { 'x-api-key': environment.apiKey }
    }).subscribe({
      next: (departamentos) => {
        this.Departamentos = departamentos;

        this.http.get<any>(`${environment.apiBaseUrl}/Municipios/Listar`, {
          headers: { 'x-api-key': environment.apiKey }
        }).subscribe({
          next: (municipios) => {
            this.TodosMunicipios = municipios;

            this.http.get<any>(`${environment.apiBaseUrl}/Colonia/Listar`, {
              headers: { 'x-api-key': environment.apiKey }
            }).subscribe({
              next: (colonias) => {
                this.TodosColonias = colonias;
                this.configurarUbicacionInicial();
              }
            });
          }
        });
      }
    });
  }

  configurarUbicacionInicial(): void {
    const colonia = this.TodosColonias.find(c => c.colo_Id === this.configFactura.colo_Id);
    if (colonia) {
      const municipio = this.TodosMunicipios.find(m => m.muni_Codigo === colonia.muni_Codigo);
      if (municipio) {
        this.selectedDepa = municipio.depa_Codigo;
        this.selectedMuni = municipio.muni_Codigo;
        this.Municipios = this.TodosMunicipios.filter(m => m.depa_Codigo === this.selectedDepa);
        this.Colonias = this.TodosColonias.filter(c => c.muni_Codigo === this.selectedMuni);
      }
    }
  }

  cargarMunicipios(depaCodigo: string): void {
    this.selectedDepa = depaCodigo;
    this.selectedMuni = '';
    this.configFactura.colo_Id = 0;
    this.Municipios = this.TodosMunicipios.filter(m => m.depa_Codigo === depaCodigo);
    this.Colonias = [];
  }

  cargarColonias(muniCodigo: string): void {
    this.selectedMuni = muniCodigo;
    this.configFactura.colo_Id = 0;
    this.Colonias = this.TodosColonias.filter(c => c.muni_Codigo === muniCodigo);
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
      .then(response => response.json() )
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

  validarCampos(): boolean {
    return !!(
      this.configFactura.coFa_NombreEmpresa?.trim() &&
      this.configFactura.coFa_DireccionEmpresa?.trim() &&
      this.configFactura.coFa_RTN?.trim() &&
      this.configFactura.coFa_Correo?.trim() &&
      this.configFactura.coFa_Telefono1?.trim() &&
      this.selectedDepa &&
      this.selectedMuni &&
      this.configFactura.colo_Id &&
      (this.configFactura.coFa_Logo || this.logoSeleccionado)
    );
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
