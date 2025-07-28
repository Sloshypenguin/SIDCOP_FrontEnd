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
import { DireccionPorCliente } from 'src/app/Modelos/general/DireccionPorCliente.Model';
import { getUserId } from 'src/app/core/utils/user-utils';


@Component({
  selector: 'app-create',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, NgxMaskDirective, MapaSelectorComponent],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss',
  providers: [provideNgxMask()]
})
export class CreateComponent {
  @Output() onCancel = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<Cliente>();
  @ViewChild(MapaSelectorComponent)
  mapaSelectorComponent!: MapaSelectorComponent;
  entrando = true;

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
  direccionAval = { colo_Id: '' };
  activeTab = 1;

  nacionalidades: any[] = [];
  paises: any[] = [];
  tiposDeVivienda: any[] = [];
  estadosCiviles: any[] = [];
  canales: any[] = [];
  rutas: any[] = [];
  parentescos: any[] = [];

  latitudSeleccionada: number | null = null;
  longitudSeleccionada: number | null = null;

  cargando = false;
  cargandoColonias = false;
  Departamentos: any[] = [];

  TodosMunicipios: any[] = [];
  Municipios: any[] = [];

  TodasColonias: any[] = [];
  Colonias: any[] = [];

  selectedDepa: string = '';
  selectedMuni: string = '';
  selectedColonia: string = '';

  idDelCliente: number = 0;
  idDeLaDireccionDelCliente: number = 0;

  nuevaColoniaAval: { muni_Codigo: string } = { muni_Codigo: '' };
  cargandoAval = false;
  cargandoColoniasAval = false;

  DepartamentosAval: any[] = [];
  TodosMunicipiosAval: any[] = [];
  MunicipiosAval: any[] = [];
  TodasColoniasAval: any[] = [];
  ColoniasAval: any[] = [];
  selectedDepaAval: string = '';
  selectedMuniAval: string = '';
  selectedColoniaAval: string = '';

  tieneDatosCredito(): boolean {
  return (
    !!this.cliente.clie_LimiteCredito &&
    !!this.cliente.clie_DiasCredito
  );
}

  tabuladores(no:number){
    if(no == 1){
      this.mostrarErrores=true
      if(this.cliente.clie_Codigo.trim() && this.cliente.clie_Nacionalidad.trim() &&
        this.cliente.clie_RTN.trim() && this.cliente.clie_Nombres.trim() &&
        this.cliente.clie_Apellidos.trim() && this.cliente.esCv_Id &&
        this.cliente.clie_FechaNacimiento && this.cliente.tiVi_Id &&
        this.cliente.clie_Telefono.trim())
      {
        this.mostrarErrores=false;
        this.activeTab=2;
      }
      else{
        this.mostrarAlertaWarning = true;
        this.mensajeWarning = 'Por favor, complete todos los campos obligatorios.';
        setTimeout(() => {
          this.mostrarAlertaWarning = false;
          this.mensajeWarning = '';
        }, 3000);
      }
    }

    if(no == 2){
      this.mostrarErrores=true
      if(this.cliente.clie_NombreNegocio.trim() && this.cliente.clie_ImagenDelNegocio.trim() &&
        this.cliente.ruta_Id && this.cliente.cana_Id && this.validarDireccion>=1)
      {
        this.mostrarErrores=false;
        this.activeTab=3;
      }
      else{
        this.mostrarAlertaWarning = true;
        this.mensajeWarning = 'Por favor, complete todos los campos obligatorios.';
        setTimeout(() => {
          this.mostrarAlertaWarning = false;
          this.mensajeWarning = '';
        }, 3000);
      }
    }

    if(no == 3){
      if(this.cliente.clie_LimiteCredito && this.cliente.clie_DiasCredito){
        this.mostrarErrores=false;
        this.activeTab=4;
      }
      if(!this.cliente.clie_LimiteCredito && !this.cliente.clie_DiasCredito){
        this.mostrarErrores=false;
        this.activeTab=4;
      }
      else{
        if(this.cliente.clie_LimiteCredito){
          if(this.cliente.clie_DiasCredito){
            this.mostrarErrores=false;
            this.activeTab=4;
          }else{
            this.mostrarAlertaWarning = true;
            this.mensajeWarning = 'Los Dias del Credito son obligatorios si asigno un crédito.';
            setTimeout(() => {
              this.mostrarAlertaWarning = false;
              this.mensajeWarning = '';
            }, 3000);
          }
        }
        if(this.cliente.clie_DiasCredito){
          if(this.cliente.clie_LimiteCredito){
            this.mostrarErrores=false;
            this.activeTab=4;
          }else{
            this.mostrarAlertaWarning = true;
            this.mensajeWarning = 'Se asigno Dias de Credito, pero no un crédito.';
            setTimeout(() => {
              this.mostrarAlertaWarning = false;
              this.mensajeWarning = '';
            }, 3000);
          }
        }
      }
    }

    if(no == 4){
      this.mostrarErrores=true;
      if (this.tieneDatosCredito()) {
        if(this.aval.aval_DNI.trim() && this.aval.pare_Id &&
          this.aval.aval_Nombres.trim() && this.aval.aval_Apellidos.trim() &&
          this.aval.esCv_Id && this.aval.aval_Telefono.trim() && this.aval.tiVi_Id &&
          this.selectedDepa.trim() && this.nuevaColonia.muni_Codigo.trim() && this.aval.colo_Id &&
          this.aval.aval_DireccionExacta && this.aval.aval_FechaNacimiento)
        {
          this.mostrarErrores=false;
          this.activeTab=5;
        }
        else{
          this.mostrarAlertaWarning = true;
          this.mensajeWarning = 'Por favor, complete todos los campos obligatorios.';
          setTimeout(() => {
            this.mostrarAlertaWarning = false;
            this.mensajeWarning = '';
          }, 3000);
        }
      }
      else{
        this.mostrarErrores=false;
        this.activeTab=5;
      }
    }

    if(no == 5){
      this.mostrarErrores=false;
    }
  }

  

  trackByIndex(index: number) { return index; }

  onCoordenadasSeleccionadas(coords: { lat: number, lng: number }) {
    this.direccionPorCliente.diCl_Latitud = coords.lat;
    this.direccionPorCliente.diCl_Longitud = coords.lng;
  }

  coordenadaPrevia: { lat: number, lng: number } | null = null;
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
    this.cargarParentescos();
    this.cargarListados();
    this.cargarListadosAval();
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

  cargarParentescos() {
    this.http.get<any[]>(`${environment.apiBaseUrl}/Parentesco/Listar`, {
      headers: { 'x-api-key': environment.apiKey }
    }).subscribe(data => this.parentescos = data);
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

  cargarListadosAval(): void {
    this.http.get<any>(`${environment.apiBaseUrl}/Departamentos/Listar`, {
      headers: { 'x-api-key': environment.apiKey }
    }).subscribe({
      next: (data) => this.DepartamentosAval = data,
      error: (error) => console.error('Error cargando departamentos:', error)
    });

    this.http.get<any>(`${environment.apiBaseUrl}/Municipios/Listar`, {
      headers: { 'x-api-key': environment.apiKey }
    }).subscribe({
      next: (data) => this.TodosMunicipiosAval = data,
      error: (error) => console.error('Error cargando municipios:', error)
    });

    this.http.get<any>(`${environment.apiBaseUrl}/Colonia/Listar`, {
      headers: { 'x-api-key': environment.apiKey }
    }).subscribe({
      next: (data) => this.TodasColoniasAval = data,
      error: (error) => console.error('Error cargando colonias:', error)
    });
  }

  onDepartamentoChange(): void {
    this.cargarMunicipios(this.selectedDepa);
    this.nuevaColonia.muni_Codigo = '';
    this.direccion.colo_Id = '';
    this.Colonias = [];
    this.selectedMuni = '';
    this.selectedColonia = '';
  }

  onDepartamentoAvalChange(): void {
    this.cargarMunicipiosAval(this.selectedDepaAval);
    this.nuevaColoniaAval.muni_Codigo = '';
    this.direccionAval.colo_Id = '';
    this.ColoniasAval = [];
    this.selectedMuniAval = '';
    this.selectedColoniaAval = '';
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
    clie_FechaNacimiento: null,
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

  direccionesPorCliente: DireccionPorCliente[] = [];
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
  direccionEditandoIndex: number | null = null;

  aval: Aval = {
    aval_Id: 0,
    clie_Id: 0,
    aval_Nombres: '',
    aval_Apellidos: '',
    pare_Id: 0,
    aval_DNI: '',
    aval_Telefono: '',
    tiVi_Id: 0,
    aval_Observaciones: '',
    aval_DireccionExacta: '',
    colo_Id: 0,
    aval_FechaNacimiento: null,
    esCv_Id: 0,
    aval_Sexo: 'M',
    usua_Creacion: getUserId(),
    usuarioCreacion: '',
    aval_FechaCreacion: new Date(),
    usua_Modificacion: 0,
    usuarioModificacion: '',
    aval_FechaModificacion: new Date()
  };

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
    this.direccionesPorCliente = [];
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

  onImagenSeleccionada(event: any) {
    const file = event.target.files[0];

    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'subidas_usuarios');      
      const url = 'https://api.cloudinary.com/v1_1/dbt7mxrwk/upload';

      
      fetch(url, {
        method: 'POST',
        body: formData
      })
      .then(response => response.json())
      .then(data => {
        this.cliente.clie_ImagenDelNegocio = data.secure_url;
        console.log(this.cliente.clie_ImagenDelNegocio)
      })
      .catch(error => {
        console.error('Error al subir la imagen a Cloudinary:', error);
      });
    }
  }

  guardarCliente(): void {
    this.mostrarErrores = true;
    if (this.entrando) {
      this.mostrarAlertaWarning = false;
      this.mostrarAlertaError = false;
      const clienteGuardar = {
        clie_Id: 0,
        clie_Codigo: this.cliente.clie_Codigo.trim(),
        clie_Nacionalidad: this.cliente.clie_Nacionalidad,
        pais_Descripcion: this.cliente.pais_Descripcion,
        clie_DNI: this.cliente.clie_DNI.trim(),
        clie_RTN: this.cliente.clie_RTN.trim(),
        clie_Nombres: this.cliente.clie_Nombres.trim(),
        clie_Apellidos: this.cliente.clie_Apellidos.trim(),
        clie_NombreNegocio: this.cliente.clie_NombreNegocio.trim(),
        clie_ImagenDelNegocio: this.cliente.clie_ImagenDelNegocio,
        clie_Telefono: this.cliente.clie_Telefono.trim(),
        clie_Correo: this.cliente.clie_Correo.trim(),
        clie_Sexo: this.cliente.clie_Sexo,
        clie_FechaNacimiento: new Date(),
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
        usua_Creacion: environment.usua_Id,
        usua_Modificacion: environment.usua_Id,
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
          if (response.data.data) {
            this.idDelCliente = response.data.data;
            this.guardarDireccionesPorCliente(this.idDelCliente);
            this.guardarAval(this.idDelCliente);
          }
        },
        error: (error) => {
          this.mostrarAlertaError = true;
          this.mensajeError = 'Error al guardar el Cliente. Por favor, intente nuevamente.';
          setTimeout(() => {
            this.mostrarAlertaError = false;
            this.mensajeError = '';
          }, 3000);
        }
      });
    } else {
      this.mostrarAlertaWarning = true;
      this.mensajeWarning = 'Por favor, complete todos los campos obligatorios.';
      setTimeout(() => {
        this.mostrarAlertaWarning = false;
        this.mensajeWarning = '';
      }, 3000);
    }
  }

  validarDireccion: number = 0;
  agregarDireccion() {
    this.validarDireccion+=1;
    if (this.direccionEditandoIndex !== null) {
      this.direccionesPorCliente[this.direccionEditandoIndex] = { ...this.direccionPorCliente };
      this.direccionEditandoIndex = null;
    } else {
      this.direccionesPorCliente.push({ ...this.direccionPorCliente });
    }
    this.limpiarDireccionModal();
    this.cerrarMapa();
  }

  editarDireccion(index: number) {
    this.direccionEditandoIndex = index;
    this.direccionPorCliente = { ...this.direccionesPorCliente[index] };
    this.mostrarMapa = true;
    setTimeout(() => {
      this.mapaSelectorComponent.inicializarMapa();
    }, 300);
  }

  eliminarDireccion(index: number) {
    this.validarDireccion-=1;
    this.direccionesPorCliente.splice(index, 1);
  }

  limpiarDireccionModal() {
    this.direccionPorCliente = {
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
  }

  guardarDireccionesPorCliente(clie_Id: number): void {
    for (const direccion of this.direccionesPorCliente) {
      const direccionPorClienteGuardar = {
        ...direccion,
        clie_Id: clie_Id,
        usua_Creacion: environment.usua_Id,
        diCl_FechaCreacion: new Date(),
        usua_Modificacion: environment.usua_Id,
        diCl_FechaModificacion: new Date()
      };
      this.http.post<any>(`${environment.apiBaseUrl}/DireccionesPorCliente/Insertar`, direccionPorClienteGuardar, {
        headers: {
          'X-Api-Key': environment.apiKey,
          'Content-Type': 'application/json',
          'accept': '*/*'
        }
      }).subscribe({
        next: (response) => {
          console.log(response);
        },
        error: (error) => {
          this.mostrarAlertaError = true;
          this.mensajeError = 'Error al guardar la dirección del Cliente. Por favor, intente nuevamente.';
          setTimeout(() => {
            this.mostrarAlertaError = false;
            this.mensajeError = '';
          }, 3000);
        }
      });
    }
  }


  guardarAval(clie_Id: number): void {
    this.mostrarErrores = true;
    if (this.entrando) {
      this.mostrarAlertaWarning = false;
      this.mostrarAlertaError = false;
      const avalGuardar = {
        aval_Id: 0,
        clie_Id: clie_Id,
        aval_Nombres: this.aval.aval_Nombres.trim(),
        aval_Apellidos: this.aval.aval_Apellidos.trim(),
        pare_Id: this.aval.pare_Id,
        aval_DNI: this.aval.aval_DNI.trim(),
        aval_Telefono: this.aval.aval_Telefono.trim(),
        tiVi_Id: this.aval.tiVi_Id,
        tiVi_Descripcion: '',
        aval_Observaciones: this.aval.aval_Observaciones.trim(),
        aval_DireccionExacta: this.aval.aval_DireccionExacta.trim(),
        colo_Id: this.aval.colo_Id,
        aval_FechaNacimiento: new Date(),
        esCv_Id: this.aval.esCv_Id,
        aval_Sexo: this.aval.aval_Sexo,
        usua_Creacion: environment.usua_Id,
        usuarioCreacion: this.aval.usuarioCreacion.trim(),
        aval_FechaCreacion: new Date(),
        usua_Modificacion: environment.usua_Id,
        usuarioModificacion: this.aval.usuarioModificacion.trim(),
        aval_FechaModificacion: new Date()
      } 
      this.http.post<any>(`${environment.apiBaseUrl}/Aval/Insertar`, avalGuardar, {
        headers: {
          'X-Api-Key': environment.apiKey,
          'Content-Type': 'application/json',
          'accept': '*/*'
        }
      }).subscribe({
        next: (response) => {
          console.log(response);
        },
        error: (error) => {
          this.mostrarAlertaError = true;
          this.mensajeError = 'Error al guardar el aval. Por favor, intente nuevamente.';
          setTimeout(() => {
            this.mostrarAlertaError = false;
            this.mensajeError = '';
          }, 3000);
        }
      });
    } 
    else {
      this.mostrarAlertaWarning = true;
      this.mensajeWarning = '3Por favor, complete todos los campos obligatorios.';
      setTimeout(() => {
        this.mostrarAlertaWarning = false;
        this.mensajeWarning = '';
      }, 3000);
    }
  }

  avalTieneDatos(): boolean {
    return (
      !!this.aval.aval_Nombres &&
      !!this.aval.aval_Apellidos &&
      !!this.aval.aval_Sexo &&
      !!this.aval.pare_Id &&
      !!this.aval.aval_DNI &&
      !!this.aval.aval_Telefono &&
      !!this.aval.tiVi_Id &&
      !!this.aval.aval_Observaciones &&
      !!this.aval.aval_DireccionExacta
    );  
  }

}
  