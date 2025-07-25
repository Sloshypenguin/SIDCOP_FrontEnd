import { Component, Output, EventEmitter, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Cliente } from 'src/app/Modelos/general/Cliente.Model';
import { environment } from 'src/environments/environment.prod';

import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { MapaSelectorComponent } from '../mapa-selector/mapa-selector.component';
import { Aval } from 'src/app/Modelos/general/Aval.Model';

import { NgModule } from '@angular/core';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { DireccionPorCliente } from 'src/app/Modelos/general/DireccionPorCliente.Model';
import { getUserId } from 'src/app/core/utils/user-utils';


@Component({
  selector: 'app-create',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, NgxMaskDirective, MapaSelectorComponent, DropzoneModule],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss',
  providers: [provideNgxMask()]
})
export class CreateComponent {
  @Output() onCancel = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<Cliente>();
  @ViewChild(MapaSelectorComponent)
  mapaSelectorComponent!: MapaSelectorComponent;


  dropzoneConfig = {
    url: '/api/upload', // Replace with your actual upload endpoint
    maxFilesize: 5, // MB
    acceptedFiles: 'image/*',
    addRemoveLinks: true,
    dictDefaultMessage: 'Selecciona una imagen para subir.'
  };

  // Propiedad para almacenar archivos subidos
  uploadedFiles: any[] = [];

  // Método para manejar la selección de archivos
  onFileSelected(event: any): void {
    const files = event.target.files;
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.uploadedFiles.push({
            name: file.name,
            size: file.size,
            dataURL: e.target.result
          });
        };
        reader.readAsDataURL(file);
      }
    }
  }

  // Add this method to remove a file from the uploadedFiles array
  removeFile(file: any): void {
    if (this.uploadedFiles) {
      const index = this.uploadedFiles.indexOf(file);
      if (index > -1) {
        this.uploadedFiles.splice(index, 1);
      }
    }
  }
  mostrarErrores = false;
  mostrarAlertaExito = false;
  mensajeExito = '';
  mostrarAlertaError = false;
  mensajeError = '';
  mostrarAlertaWarning = false;
  mensajeWarning = '';
  mostrarMapa = false;

  nuevaColonia: { muni_Codigo: string } = { muni_Codigo: '' };
  direccion = { colo_Id: '' };
  activeTab = 1;

  nacionalidades: any[] = [];
  paises: any[] = [];
  tiposDeVivienda: any[] = [];
  estadosCiviles: any[] = [];
  canales: any[] = [];
  rutas: any[] = [];

  latitudSeleccionada: number | null = null;
  longitudSeleccionada: number | null = null;

  cargando = false;
  cargandoColonias = false;
  // Filtrado en DDLs
  Departamentos: any[] = [];

  TodosMunicipios: any[] = [];
  Municipios: any[] = [];

  TodasColonias: any[] = [];
  Colonias: any[] = [];


  selectedDepa: string = '';
  selectedMuni: string = '';
  selectedColonia: string = '';

  nuevaColoniaAval: { muni_Codigo: string } = { muni_Codigo: '' };
  cargandoAval = false;
  cargandoColoniasAval = false;
  TodosMunicipiosAval: any[] = [];
  MunicipiosAval: any[] = [];
  TodasColoniasAval: any[] = [];
  ColoniasAval: any[] = [];
  selectedDepaAval: string = '';
  selectedMuniAval: string = '';
  selectedColoniaAval: string = '';

  onCoordenadasSeleccionadas(coords: { lat: number, lng: number }) {
    this.latitudSeleccionada = coords.lat;
    this.longitudSeleccionada = coords.lng;
    this.mostrarMapa = false;
  }

  abrirMapa() {
    this.mostrarMapa = true;
    setTimeout(() => {
      this.mapaSelectorComponent.inicializarMapa();
    }, 300);
  }

  cerrarMapa() {
    this.mostrarMapa = false;
  }

  constructor(private http: HttpClient) {
    this.cargarPaises();
    this.cargarTiposDeVivienda();
    this.cargarEstadosCiviles();
    this.cargarCanales();
    this.cargarRutas();
    this.cargarListados();
  }

  cargarPaises() {
    this.http.get<any[]>(`${environment.apiBaseUrl}/Pais/Listar`, {
      headers: { 'x-api-key': environment.apiKey }
    }).subscribe(
      data => this.paises = data,
    );
  }

  cargarTiposDeVivienda() {
    this.http.get<any[]>(`${environment.apiBaseUrl}/TipoDeVivienda/Listar`, {
      headers: { 'x-api-key': environment.apiKey }
    }).subscribe(data => this.tiposDeVivienda = data);
  }

  cargarEstadosCiviles() {
    this.http.get<any[]>(`${environment.apiBaseUrl}/EstadosCiviles/Listar`, {
      headers: { 'x-api-key': environment.apiKey }
    }).subscribe(data => this.estadosCiviles = data);
  }

  cargarCanales() {
    this.http.get<any[]>(`${environment.apiBaseUrl}/Canal/Listar`, {
      headers: { 'x-api-key': environment.apiKey }
    }).subscribe(data => this.canales = data);
  }

  cargarRutas() {
    this.http.get<any[]>(`${environment.apiBaseUrl}/Rutas/Listar`, {
      headers: { 'x-api-key': environment.apiKey }
    }).subscribe(data => this.rutas = data);
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

    this.http.get<any>(`${environment.apiBaseUrl}/Colonia/Listar`, {
      headers: { 'x-api-key': environment.apiKey }
    }).subscribe({
      next: (data) => this.TodasColonias = data,
      error: (error) => console.error('Error cargando colonias:', error)
    });
  }

  cargarMunicipios(codigoDepa: string): void {
    this.Municipios = this.TodosMunicipios.filter(m => m.depa_Codigo === codigoDepa);
    this.selectedMuni = '';
  }

  cargarColonias(codigoMuni: string): void {
    console.log('Cargando colonias para municipio:', codigoMuni);
    console.log('TodasColonias:', this.TodasColonias);
    this.Colonias = this.TodasColonias.filter(c => c.muni_Codigo === codigoMuni);
    this.selectedColonia = '';
  }

  cargarMunicipiosAval(codigoDepaAval: string): void {
    this.MunicipiosAval = this.TodosMunicipiosAval.filter(m => m.depa_Codigo === codigoDepaAval);
    this.selectedMuniAval = '';
  }

  cargarColoniasAval(codigoMuniAval: string): void {
    console.log('Cargando colonias para municipio:', codigoMuniAval);
    console.log('TodasColonias:', this.TodasColonias);
    this.ColoniasAval = this.TodasColoniasAval.filter(c => c.muni_Codigo === codigoMuniAval);
    this.selectedColoniaAval = '';
  }

  cliente: Cliente = {
    clie_Id: 0,
    clie_Codigo: '',
    clie_Nacionalidad: '',
    pais_Descripcion: '',
    clie_DNI: '',
    clie_RTN: '',
    clie_Nombres: '',
    clie_Apellidos: '',
    clie_NombreNegocio: '',
    clie_ImagenDelNegocio: '',
    clie_Telefono: '',
    clie_Correo: '',
    clie_Sexo: 'M',
    clie_FechaNacimiento: new Date(),
    tiVi_Id: 0,
    tiVi_Descripcion: '',
    cana_Id: 0,
    cana_Descripcion: '',
    esCv_Id: 0,
    esCv_Descripcion: '',
    ruta_Id: 0,
    ruta_Descripcion: '',
    clie_LimiteCredito: 0,
    clie_DiasCredito: 0,
    clie_Saldo: 0,
    clie_Vencido: true,
    clie_Observaciones: '',
    clie_ObservacionRetiro: '',
    clie_Confirmacion: true,
    clie_Estado: true,
    usua_Creacion: 0,
    usua_Modificacion: 0,
    secuencia: 0,
    clie_FechaCreacion: new Date(),
    clie_FechaModificacion: new Date(),
    code_Status: 0,
    message_Status: '',
    usuaC_Nombre: '',
    usuaM_Nombre: ''
  };

  direccionPorCliente: DireccionPorCliente = {
    diCl_Id: 0,
    clie_Id: 0,
    colo_Id: 0,
    diCl_DireccionExacta: '',
    diCl_Observaciones: '',
    diCl_Latitud: 0,
    diCl_Longitud: 0,
    usua_Creacion: 0,
    diCl_FechaCreacion: new Date(),
    usua_Modificacion: 0,
    diCl_FechaModificacion: new Date(),
  };

  aval: Aval = {
    aval_Id: 0,
    clie_id: 0,
    aval_Nombres: '',
    aval_Apellidos: '',
    aval_ParentescoConCliente: '',
    aval_DNI: '',
    aval_Telefono: '',
    tiVi_Id: 0,
    aval_DireccionExacta: '',
    colo_Id: 0,
    aval_FechaNacimiento: new Date(),
    esCv_Id: 0,
    aval_Sexo: 'M',
    usua_Creacion: getUserId(),
    usuarioCreacion: '',
    aval_FechaCreacion: new Date(),
    usua_Modificacion: undefined,
    usuarioModificacion: undefined,
    aval_FechaModificacion: undefined
  };


  crear(): void {
    this.mostrarMapa = true;
  }

  cancelar(): void {
    this.mostrarErrores = false;
    this.mostrarAlertaExito = false;
    this.mensajeExito = '';
    this.mostrarAlertaError = false;
    this.mensajeError = '';
    this.mostrarAlertaWarning = false;
    this.mensajeWarning = '';
    this.cliente = {
      clie_Id: 0,
      clie_Codigo: '',
      clie_Nacionalidad: '',
      pais_Descripcion: '',
      clie_DNI: '',
      clie_RTN: '',
      clie_Nombres: '',
      clie_Apellidos: '',
      clie_NombreNegocio: '',
      clie_ImagenDelNegocio: '',
      clie_Telefono: '',
      clie_Correo: '',
      clie_Sexo: '',
      clie_FechaNacimiento: new Date(),
      tiVi_Id: 0,
      tiVi_Descripcion: '',
      cana_Id: 0,
      cana_Descripcion: '',
      esCv_Id: 0,
      esCv_Descripcion: '',
      ruta_Id: 0,
      ruta_Descripcion: '',
      clie_LimiteCredito: 0,
      clie_DiasCredito: 0,
      clie_Saldo: 0,
      clie_Vencido: true,
      clie_Observaciones: '',
      clie_ObservacionRetiro: '',
      clie_Confirmacion: true,
      clie_Estado: true,
      usua_Creacion: 0,
      usua_Modificacion: 0,
      secuencia: 0,
      clie_FechaCreacion: new Date(),
      clie_FechaModificacion: new Date(),
      code_Status: 0,
      message_Status: '',
      usuaC_Nombre: '',
      usuaM_Nombre: '',
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

  guardarCliente():void{
    const clienteGuardar={
      clie_Id: 0,
      clie_Codigo: this.cliente.clie_Codigo.trim(),
      clie_Nacionalidad: this.cliente.clie_Nacionalidad,
      pais_Descripcion: this.cliente.pais_Descripcion,
      clie_DNI: this.cliente.clie_DNI.trim(),
      clie_RTN: this.cliente.clie_RTN.trim(),
      clie_Nombres: this.cliente.clie_Nombres.trim(),
      clie_Apellidos: this.cliente.clie_Apellidos.trim(),
      clie_NombreNegocio: this.cliente.clie_NombreNegocio.trim(),
      clie_ImagenDelNegocio: 'Imagen por definir',
      clie_Telefono: this.cliente.clie_Telefono.trim(),
      clie_Correo: this.cliente.clie_Correo.trim(),
      clie_Sexo: this.cliente.clie_Sexo,
      clie_FechaNacimiento: this.cliente.clie_FechaNacimiento ? this.cliente.clie_FechaNacimiento.toISOString() : null,
      tiVi_Id: this.cliente.tiVi_Id,
      tiVi_Descripcion: this.cliente.tiVi_Descripcion,
      cana_Id: this.cliente.cana_Id,
      cana_Descripcion: this.cliente.cana_Descripcion,
      esCv_Id: this.cliente.esCv_Id,
      esCv_Descripcion: this.cliente.esCv_Descripcion,
      ruta_Id: this.cliente.ruta_Id,
      ruta_Descripcion: this.cliente.ruta_Descripcion,
      clie_LimiteCredito: this.cliente.clie_LimiteCredito,
      clie_DiasCredito: this.cliente.clie_DiasCredito,
      clie_Saldo: 110,
      clie_Vencido: false,
      clie_Observaciones: this.cliente.clie_Observaciones.trim(),
      clie_ObservacionRetiro: this.cliente.clie_ObservacionRetiro.trim(),
      clie_Confirmacion: this.cliente.clie_Confirmacion,
      clie_Estado: true,
      usua_Creacion: getUserId(),
      usua_Modificacion: getUserId(),
      secuencia: 0,
      clie_FechaCreacion: new Date(),
      clie_FechaModificacion: new Date(),
      code_Status: 0,
      message_Status: '',
      usuaC_Nombre: '',
      usuaM_Nombre: ''
    }
    this.http.post<any>(`${environment.apiBaseUrl}/Cliente/Insertar`, clienteGuardar, {
      headers: {
        'X-Api-Key': environment.apiKey,
        'Content-Type': 'application/json',
        'accept': '*/*'
      }
    }).subscribe({
      next: (response) => {
        this.cliente.clie_Id = response.clie_Id || response.id || response.data?.clie_Id;
        this.mensajeExito = `Cliente "${this.cliente.clie_Nombres}" guardado exitosamente`;
        this.mostrarAlertaExito = true;
        this.mostrarErrores = false;
        setTimeout(() => {
          this.mostrarAlertaExito = false;
          this.onSave.emit(this.cliente);
          this.cancelar();
        }, 3000);
      },
      error: (error) => {
        this.mostrarAlertaError = true;
        this.mensajeError = 'Error al guardar el Cliente. Por favor, intente nuevamente.';
        setTimeout(() => {
          this.mostrarAlertaError = false;
          this.mensajeError = '';
        }, 5000);
      }
    });
  }

  guardar(): void {
    this.mostrarErrores = true;

    // Validación de todos los campos requeridos
    const clienteValido =
      this.cliente.clie_Codigo.trim() &&
      this.cliente.clie_Nacionalidad &&
      this.cliente.clie_DNI.trim() &&
      this.cliente.clie_RTN.trim() &&
      this.cliente.clie_Nombres.trim() &&
      this.cliente.clie_Apellidos.trim() &&
      this.cliente.clie_NombreNegocio.trim() &&
      this.cliente.clie_Telefono.trim() &&
      this.cliente.clie_Sexo &&
      this.cliente.clie_FechaNacimiento &&
      this.cliente.tiVi_Id &&
      this.cliente.cana_Id &&
      this.cliente.esCv_Id &&
      this.cliente.ruta_Id;

    const direccionValida =
      this.direccionPorCliente.colo_Id &&
      this.direccionPorCliente.diCl_DireccionExacta.trim() &&
      this.direccionPorCliente.diCl_Latitud &&
      this.direccionPorCliente.diCl_Longitud;

    const avalAgregado =
      this.aval.aval_Nombres.trim() ||
      this.aval.aval_Apellidos.trim() ||
      this.aval.aval_DNI.trim();

    const avalValido = !avalAgregado || (
      this.aval.aval_Nombres.trim() &&
      this.aval.aval_Apellidos.trim() &&
      this.aval.aval_ParentescoConCliente.trim() &&
      this.aval.aval_DNI.trim() &&
      this.aval.aval_Telefono.trim() &&
      this.aval.tiVi_Id &&
      this.aval.aval_DireccionExacta.trim() &&
      this.aval.colo_Id &&
      this.aval.aval_FechaNacimiento &&
      this.aval.esCv_Id &&
      this.aval.aval_Sexo
    );

    if (clienteValido && direccionValida && avalValido) {
      // Limpiar alertas previas
      this.mostrarAlertaWarning = false;
      this.mostrarAlertaError = false;

      // Formateo de DNI y Teléfono
      const dni = this.cliente.clie_DNI.trim();
      const dniMask = dni.length === 15
        ? dni.slice(0, 4) + '-' + dni.slice(4, 8) + '-' + dni.slice(8, 13)
        : dni;

      const telefono = this.cliente.clie_Telefono.trim();
      const telefonoMask = telefono.length === 9
        ? telefono.slice(0, 4) + '-' + telefono.slice(4, 9)
        : telefono;

      // 1. Insertar Cliente
      const clienteGuardar = {
        ...this.cliente,
        clie_DNI: dniMask,
        clie_Telefono: telefonoMask,
        clie_FechaCreacion: new Date().toISOString(),
        clie_FechaModificacion: new Date().toISOString(),
        usua_Creacion: getUserId(),
        usua_Modificacion: 0
      };

      this.http.post<any>(`${environment.apiBaseUrl}/Clientes/Insertar`, clienteGuardar, {
        headers: {
          'X-Api-Key': environment.apiKey,
          'Content-Type': 'application/json',
          'accept': '*/*'
        }
      }).subscribe({
        next: (clienteResp) => {
          const clienteId = clienteResp.clie_Id || clienteResp.id || clienteResp.data?.clie_Id;
          // 2. Insertar Dirección por Cliente
          const direccionGuardar = {
            ...this.direccionPorCliente,
            clie_Id: clienteId,
            diCl_FechaCreacion: new Date().toISOString(),
            diCl_FechaModificacion: new Date().toISOString(),
            usua_Creacion: getUserId(),
            usua_Modificacion: 0
          };
          this.http.post<any>(`${environment.apiBaseUrl}/DireccionesPorCliente/Insertar`, direccionGuardar, {
            headers: {
              'X-Api-Key': environment.apiKey,
              'Content-Type': 'application/json',
              'accept': '*/*'
            }
          }).subscribe({
            next: (direccionResp) => {
              if (avalAgregado) {
                const avalGuardar = {
                  ...this.aval,
                  clie_id: clienteId,
                  aval_FechaCreacion: new Date().toISOString(),
                  aval_FechaModificacion: new Date().toISOString(),
                  usua_Creacion: getUserId(),
                  usua_Modificacion: 0
                };
                this.http.post<any>(`${environment.apiBaseUrl}/Aval/Insertar`, avalGuardar, {
                  headers: {
                    'X-Api-Key': environment.apiKey,
                    'Content-Type': 'application/json',
                    'accept': '*/*'
                  }
                }).subscribe({
                  next: (avalResp) => {
                    this.mensajeExito = `Cliente "${this.cliente.clie_Nombres}" guardado exitosamente`;
                    this.mostrarAlertaExito = true;
                    this.mostrarErrores = false;
                    setTimeout(() => {
                      this.mostrarAlertaExito = false;
                      this.onSave.emit(this.cliente);
                      this.cancelar();
                    }, 3000);
                  },
                  error: (error) => {
                    this.mostrarAlertaError = true;
                    this.mensajeError = 'Error al guardar el Aval. Por favor, intente nuevamente.';
                    setTimeout(() => {
                      this.mostrarAlertaError = false;
                      this.mensajeError = '';
                    }, 5000);
                  }
                });
              } else {
                // Si no hay aval, solo éxito
                this.mensajeExito = `Cliente "${this.cliente.clie_Nombres}" guardado exitosamente`;
                this.mostrarAlertaExito = true;
                this.mostrarErrores = false;
                setTimeout(() => {
                  this.mostrarAlertaExito = false;
                  this.onSave.emit(this.cliente);
                  this.cancelar();
                }, 3000);
              }
            },
            error: (error) => {
              this.mostrarAlertaError = true;
              this.mensajeError = 'Error al guardar la Dirección. Por favor, intente nuevamente.';
              setTimeout(() => {
                this.mostrarAlertaError = false;
                this.mensajeError = '';
              }, 5000);
            }
          });
        },
        error: (error) => {
          this.mostrarAlertaError = true;
          this.mensajeError = 'Error al guardar el Cliente. Por favor, intente nuevamente.';
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
      setTimeout(() => {
        this.mostrarAlertaWarning = false;
        this.mensajeWarning = '';
      }, 4000);
    }
  }
}