import { Component, Output, EventEmitter, ViewChild, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Cliente } from 'src/app/Modelos/general/Cliente.Model';
import { environment } from 'src/environments/environment.prod';
import { ChangeDetectorRef } from '@angular/core';

import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { MapaSelectorComponent } from '../mapa-selector/mapa-selector.component';
import { Aval } from 'src/app/Modelos/general/Aval.Model';

import { NgModule } from '@angular/core';
import { DireccionPorCliente } from 'src/app/Modelos/general/DireccionPorCliente.Model';
import { getUserId } from 'src/app/core/utils/user-utils';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, NgxMaskDirective, MapaSelectorComponent],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss',
  providers: [provideNgxMask()]
})
export class EditComponent implements OnChanges {
  @Input() clienteData: Cliente | null = null;
  @Output() onCancel = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<Cliente>();
  @ViewChild('tabsScroll', { static: false }) tabsScroll!: ElementRef<HTMLDivElement>;
  @ViewChild(MapaSelectorComponent)
  mapaSelectorComponent!: MapaSelectorComponent;
  entrando = true;
  activeTab = 1;

  mostrarErrores = false;
  mostrarAlertaExito = false;
  mensajeExito = '';
  mostrarAlertaError = false;
  mensajeError = '';
  mostrarAlertaWarning = false;
  mensajeWarning = '';
  mostrarMapa = false;

  //Arreglos de las listas
  nacionalidades: any[] = [];
  paises: any[] = [];
  tiposDeVivienda: any[] = [];
  estadosCiviles: any[] = [];
  canales: any[] = [];
  rutas: any[] = [];
  parentescos: any[] = [];
  TodasColonias: any[] = [];
  TodasColoniasAval: any[] = [];

  //Variables para el mapa
  latitudSeleccionada: number | null = null;
  longitudSeleccionada: number | null = null;

  //Estados de carga
  cargando = false;
  cargandoColonias = false;
  cargandoAval = false;
  cargandoColoniasAval = false;

  //Info del cliente
  idDelCliente: number = 0;
  clienteOriginal: Cliente | null = null;

  // Arrays para controlar que direcciones y avales son nuevos vs existentes
  direccionesOriginales: DireccionPorCliente[] = [];
  avalesOriginales: Aval[] = [];
  direccionesEliminadas: number[] = [];
  avalesEliminados: number[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['clienteData']?.currentValue) {
      this.cliente = { ...changes['clienteData'].currentValue };
      this.clienteOriginal = { ...changes['clienteData'].currentValue };
      this.idDelCliente = this.cliente.clie_Id;


      // *** CONVIERTE LA FECHA SI VIENE COMO STRING ***
      if (this.cliente.clie_FechaNacimiento) {
        this.cliente.clie_FechaNacimiento = new Date(this.cliente.clie_FechaNacimiento);
      } else {
        this.cliente.clie_FechaNacimiento = null;
      }

      this.cargarDireccionesExistentes();
      this.cargarAvalesExistentes();
    }
  }

  esCorreoValido(correo: string): boolean {
    if (!correo) return true;
    // Solo acepta lo que está dentro del parentesis
    return /^[\w\.-]+@(gmail|hotmail|outlook)\.com$/.test(correo.trim());
  }

  actualizarFechaNacimiento(event: any) {
    const valor = event.target.value;
    this.cliente.clie_FechaNacimiento = valor ? new Date(valor) : null;
  }

  //Declarado para validar la direccion
  validarDireccion: boolean = false;
  //Validacion para que no se desplace con el tab de arriba
  scrollToAval(index: number) {
    const container = this.tabsScroll?.nativeElement;
    if (!container) return;

    const avalElements = container.querySelectorAll('.aval-tab');

    if (avalElements[index]) {
      const target = avalElements[index] as HTMLElement;
      const offsetLeft = target.offsetLeft;
      const containerWidth = container.clientWidth;

      container.scrollTo({
        left: offsetLeft - containerWidth / 4,
        behavior: 'smooth'
      });
    }
  }

  tabDeArriba(no: number) {
    if (no === this.activeTab) return;

    if (this.activeTab > no) {
      this.activeTab -= 1;
      return
    }

    if (this.activeTab < no) {
      no = this.activeTab;
    }

    if (no === 1) {
      this.mostrarErrores = true;
      if (
        this.cliente.clie_Codigo.trim() &&
        this.cliente.clie_Nacionalidad.trim() &&
        this.cliente.clie_RTN.trim() &&
        this.cliente.clie_Nombres.trim() &&
        this.cliente.clie_Apellidos.trim() &&
        this.cliente.esCv_Id &&
        this.cliente.clie_FechaNacimiento &&
        this.cliente.tiVi_Id &&
        this.cliente.clie_Telefono.trim()
      ) {
        this.mostrarErrores = false;
        this.activeTab = 2;
      } else {
        this.mostrarAlertaWarning = true;
        this.mensajeWarning = 'Por favor, complete todos los campos obligatorios de los Datos Personales.';
        setTimeout(() => {
          this.mostrarAlertaWarning = false;
          this.mensajeWarning = '';
        }, 3000);
      }
      return;
    }

    if (no === 2) {
      this.mostrarErrores = true;
      if (
        this.cliente.clie_NombreNegocio.trim() &&
        this.cliente.clie_ImagenDelNegocio.trim() &&
        this.cliente.ruta_Id &&
        this.cliente.cana_Id &&
        this.direccionesPorCliente.length > 0
      ) {
        this.mostrarErrores = false;
        this.activeTab = 3;
      } else {
        this.validarDireccion = true;
        this.mostrarAlertaWarning = true;
        this.mensajeWarning = 'Por favor, complete todos los campos obligatorios del negocio.';
        setTimeout(() => {
          this.mostrarAlertaWarning = false;
          this.mensajeWarning = '';
        }, 3000);
      }
      return;
    }

    if (no === 3) {
      this.mostrarErrores = true;
      if (
        (!this.cliente.clie_LimiteCredito && !this.cliente.clie_DiasCredito) ||
        (this.cliente.clie_LimiteCredito && this.cliente.clie_DiasCredito)
      ) {
        this.mostrarErrores = false;
        this.activeTab = 4;
      } else {
        this.mostrarAlertaWarning = true;
        this.mensajeWarning = 'Complete correctamente los datos de crédito.';
        setTimeout(() => {
          this.mostrarAlertaWarning = false;
          this.mensajeWarning = '';
        }, 3000);
      }
      return;
    }

    if (no === 4) {
      this.mostrarErrores = true;
      if (this.tieneDatosCredito()) {
        if (this.avales.length > 0 && this.avales.every(aval => this.esAvalValido(aval))) {
          this.mostrarErrores = false;
          this.activeTab = 5;
        } else {
          this.mostrarAlertaWarning = true;
          this.mensajeWarning = 'Por favor complete correctamente todos los registros de Aval.';
          setTimeout(() => {
            this.mostrarAlertaWarning = false;
            this.mensajeWarning = '';
          }, 3000);
        }
      } else {
        this.mostrarErrores = false;
        this.activeTab = 5;
      }
      return;
    }
  }

  //Es una funcion creada para el if 4 que es de corroborar
  //que haya un credito para que el aval sea obligatorio
  tieneDatosCredito(): boolean {
    return (
      !!this.cliente.clie_LimiteCredito &&
      !!this.cliente.clie_DiasCredito
    );
  }

  //Verifica si el aval es valido- Si nungo campo este vacio
  esAvalValido(aval: Aval): boolean {
    let fechaValida = false;
    if (aval.aval_FechaNacimiento) {
      const fecha = typeof aval.aval_FechaNacimiento === 'string'
        ? new Date(aval.aval_FechaNacimiento)
        : aval.aval_FechaNacimiento;
      fechaValida = fecha instanceof Date && !isNaN(fecha.getTime());
    }

    return (
      typeof aval.aval_DNI === 'string' && aval.aval_DNI.trim().length > 0 &&
      !isNaN(Number(aval.pare_Id)) && Number(aval.pare_Id) > 0 &&
      typeof aval.aval_Nombres === 'string' && aval.aval_Nombres.trim().length > 0 &&
      typeof aval.aval_Apellidos === 'string' && aval.aval_Apellidos.trim().length > 0 &&
      !isNaN(Number(aval.esCv_Id)) && Number(aval.esCv_Id) > 0 &&
      typeof aval.aval_Telefono === 'string' && aval.aval_Telefono.trim().length > 0 &&
      !isNaN(Number(aval.tiVi_Id)) && Number(aval.tiVi_Id) > 0 &&
      !isNaN(Number(aval.colo_Id)) && Number(aval.colo_Id) > 0 &&
      typeof aval.aval_DireccionExacta === 'string' && aval.aval_DireccionExacta.trim().length > 0 &&
      fechaValida
    );
  }

  get avalesValidos(): boolean {
    return this.avales.length > 0 && this.avales.every(aval => this.esAvalValido(aval));
  }

  //Parametros para evaluar antes de pasar al siguiente tabulador
  tabuladores(no: number) {
    if (no == 1) {
      this.mostrarErrores = true
      if (this.cliente.clie_Codigo.trim() && this.cliente.clie_Nacionalidad.trim() &&
        this.cliente.clie_RTN.trim() && this.cliente.clie_Nombres.trim() &&
        this.cliente.clie_Apellidos.trim() && this.cliente.esCv_Id &&
        this.cliente.clie_FechaNacimiento && this.cliente.tiVi_Id &&
        this.cliente.clie_Telefono.trim()) {
        this.mostrarErrores = false;
        this.activeTab = 2;
      }
      else {
        this.mostrarAlertaWarning = true;
        this.mensajeWarning = 'Por favor, complete todos los campos obligatorios.';
        setTimeout(() => {
          this.mostrarAlertaWarning = false;
          this.mensajeWarning = '';
        }, 3000);
      }
    }

    if (no == 2) {
      this.mostrarErrores = true;
      if (
        this.cliente.clie_NombreNegocio.trim() &&
        this.cliente.clie_ImagenDelNegocio.trim() &&
        this.cliente.ruta_Id &&
        this.cliente.cana_Id &&
        this.direccionesPorCliente.length > 0
      ) {
        this.mostrarErrores = false;
        this.activeTab = 3;
      } else {
        this.validarDireccion = this.direccionesPorCliente.length === 0;
        this.mostrarAlertaWarning = true;
        this.mensajeWarning = 'Por favor, complete todos los campos obligatorios del negocio.';
        setTimeout(() => {
          this.mostrarAlertaWarning = false;
          this.mensajeWarning = '';
        }, 3000);
      }
    }

    if (no == 3) {
      if (this.cliente.clie_LimiteCredito && this.cliente.clie_DiasCredito) {
        this.mostrarErrores = false;
        this.activeTab = 4;
      }
      if (!this.cliente.clie_LimiteCredito && !this.cliente.clie_DiasCredito) {
        this.mostrarErrores = false;
        this.activeTab = 4;
      }
      else {
        if (this.cliente.clie_LimiteCredito) {
          if (this.cliente.clie_DiasCredito) {
            this.mostrarErrores = false;
            this.activeTab = 4;
          } else {
            this.mostrarAlertaWarning = true;
            this.mensajeWarning = 'Los Dias del Credito son obligatorios si asigno un crédito.';
            setTimeout(() => {
              this.mostrarAlertaWarning = false;
              this.mensajeWarning = '';
            }, 3000);
          }
        }
        if (this.cliente.clie_DiasCredito) {
          if (this.cliente.clie_LimiteCredito) {
            this.mostrarErrores = false;
            this.activeTab = 4;
          } else {
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

    if (no == 4) {
      this.mostrarErrores = true;
      if (this.tieneDatosCredito()) {
        if (this.avales.length > 0 && this.avales.every(aval => this.esAvalValido(aval))) {
          this.mostrarErrores = false;
          this.activeTab = 5;
        } else {
          this.mostrarErrores = true;
          this.mostrarAlertaWarning = true;
          this.mensajeWarning = 'Por favor complete correctamente todos los registros de Aval.';
          setTimeout(() => {
            this.mostrarAlertaWarning = false;
            this.mensajeWarning = '';
          }, 3000);
        }
      }
      else {
        this.mostrarErrores = false;
        this.activeTab = 5;
      }
    }

    if (no == 5) {
      this.mostrarErrores = false;
    }
  }

  trackByIndex(index: number) { return index; }

  onCoordenadasSeleccionadas(coords: { lat: number, lng: number }) {
    this.direccionPorCliente.diCl_Latitud = coords.lat;
    this.direccionPorCliente.diCl_Longitud = coords.lng;
    this.cdr.detectChanges();
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
    this.direccionPorCliente = {
      diCl_Id: 0,
      clie_Id: 0,
      colo_Id: 0,
      diCl_DireccionExacta: '',
      diCl_Observaciones: '',
      diCl_Latitud: 0,
      diCl_Longitud: 0,
      muni_Descripcion: '',
      depa_Descripcion: '',
      usua_Creacion: 0,
      diCl_FechaCreacion: new Date(),
      usua_Modificacion: 0,
      diCl_FechaModificacion: new Date()
    }
  }

  constructor(private http: HttpClient, private router: Router, private cdr: ChangeDetectorRef) {
    this.cargarPaises();
    this.cargarTiposDeVivienda();
    this.cargarEstadosCiviles();
    this.cargarCanales();
    this.cargarRutas();
    this.cargarParentescos();
    this.cargarColoniasCliente();
    this.cargarColoniasAval();
  }

  //Metodos para cargar los datos de la listas
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

  cargarColoniasCliente() {
    this.http.get<any[]>(`${environment.apiBaseUrl}/Colonia/ListarMunicipiosyDepartamentos`, {
      headers: { 'x-api-key': environment.apiKey }
    }).subscribe(data => this.TodasColonias = data);
  }

  cargarColoniasAval() {
    this.http.get<any[]>(`${environment.apiBaseUrl}/Colonia/ListarMunicipiosyDepartamentos`, {
      headers: { 'x-api-key': environment.apiKey }
    }).subscribe(data => this.TodasColoniasAval = data);
  }

  // Métodos para cargar datos existentes
  cargarDireccionesExistentes() {
    if (!this.idDelCliente) return;

    this.http.get<any[]>(`${environment.apiBaseUrl}/DireccionesPorCliente/Listar`, {
      headers: { 'x-api-key': environment.apiKey }
    }).subscribe({
      next: (data) => {
        this.direccionesPorCliente = data.filter(d => d.clie_Id === this.idDelCliente);
        this.direccionesOriginales = [...this.direccionesPorCliente];
        this.validarDireccion = this.direccionesPorCliente.length === 0;
      },
      error: (error) => {
        console.error('Error cargando direcciones:', error);
      }
    });
  }

  cargarAvalesExistentes() {
    if (!this.idDelCliente) return;

    this.http.get<any[]>(`${environment.apiBaseUrl}/Aval/Listar`, {
      headers: { 'x-api-key': environment.apiKey }
    }).subscribe({
      next: (data) => {
        this.avales = data
          .filter(a => a.clie_Id === this.idDelCliente)
          .map(a => ({
            ...a,
            aval_FechaNacimiento: a.aval_FechaNacimiento
              ? this.formatearFechaInput(a.aval_FechaNacimiento)
              : null
          }));
        this.avalesOriginales = [...this.avales];

        if (this.avales.length === 0) {
          this.avales = [this.nuevoAval()];
        }
      },
      error: (error) => {
        console.error('Error cargando avales:', error);
      }
    });
  }
  
  formatearFechaInput(fecha: string | Date): string {
    const d = new Date(fecha);
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${d.getFullYear()}-${month}-${day}`;
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
    muni_Descripcion: '',
    depa_Descripcion: '',
    usua_Creacion: 0,
    diCl_FechaCreacion: new Date(),
    usua_Modificacion: 0,
    diCl_FechaModificacion: new Date(),
  };
  direccionEditandoIndex: number | null = null;

  avales: Aval[] = [];
  avalActivoIndex: number = 0;

  nuevoAval(): Aval {
    return {
      aval_Id: 0,
      clie_Id: this.idDelCliente,
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
      pare_Descripcion: '',
      esCv_Descripcion: '',
      tiVi_Descripcion: '',
      muni_Descripcion: '',
      depa_Descripcion: '',
      usua_Creacion: getUserId(),
      usuarioCreacion: '',
      aval_FechaCreacion: new Date(),
      usua_Modificacion: 0,
      usuarioModificacion: '',
      aval_FechaModificacion: new Date()
    };
  };

  cancelar(): void {
    this.mostrarErrores = false;
    this.mostrarAlertaExito = false;
    this.mensajeExito = '';
    this.mostrarAlertaError = false;
    this.mensajeError = '';
    this.mostrarAlertaWarning = false;
    this.mensajeWarning = '';
    this.activeTab = 1;
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

      const clienteActualizar = {
        clie_Id: this.cliente.clie_Id,
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
        clie_FechaNacimiento: this.cliente.clie_FechaNacimiento,
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
        clie_Saldo: this.cliente.clie_Saldo,
        clie_Vencido: this.cliente.clie_Vencido,
        clie_Observaciones: this.cliente.clie_Observaciones.trim(),
        clie_ObservacionRetiro: this.cliente.clie_ObservacionRetiro.trim(),
        clie_Confirmacion: this.cliente.clie_Confirmacion,
        clie_Estado: this.cliente.clie_Estado,
        usua_Creacion: this.cliente.usua_Creacion,
        usua_Modificacion: environment.usua_Id,
        secuencia: this.cliente.secuencia,
        clie_FechaCreacion: this.cliente.clie_FechaCreacion,
        clie_FechaModificacion: new Date(),
        code_Status: 0,
        message_Status: '',
        usuaC_Nombre: this.cliente.usuaC_Nombre,
        usuaM_Nombre: this.cliente.usuaM_Nombre
      }

      this.http.put<any>(`${environment.apiBaseUrl}/Cliente/Actualizar`, clienteActualizar, {
        headers: {
          'X-Api-Key': environment.apiKey,
          'Content-Type': 'application/json',
          'accept': '*/*'
        }
      }).subscribe({
        next: (response) => {
          if (response.data?.code_Status === -1) {
            this.mostrarAlertaError = true;
            this.mensajeError = response.data.message_Status;
            this.activeTab = 1;
            setTimeout(() => {
              this.mostrarAlertaError = false;
              this.mensajeError = '';
            }, 3000);
            return;
          }

          // Actualizar direcciones y avales
          this.actualizarDireccionesYAvales();

          this.mostrarAlertaExito = true;
          this.mensajeExito = 'Cliente actualizado correctamente';
          setTimeout(() => {
            this.onSave.emit(this.cliente);
            this.cancelar();
          }, 2000);
        },
        error: (error) => {
          this.mostrarAlertaError = true;
          this.mensajeError = 'Error al actualizar el Cliente. Por favor, intente nuevamente.';
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

  actualizarDireccionesYAvales(): void {
    this.procesarDirecciones();
    this.procesarAvales();
  }

  procesarDirecciones(): void {
    this.direccionesEliminadas.forEach(direccionId => {
      this.eliminarDireccionServidor(direccionId);
    });

    this.direccionesPorCliente.forEach(direccion => {
      if (direccion.diCl_Id === 0) {
        this.insertarDireccion(direccion);
      } else {
        this.actualizarDireccion(direccion);
      }
    });
  }

  procesarAvales(): void {
    this.avalesEliminados.forEach(avalId => {
      this.eliminarAvalServidor(avalId);
    });

    if (this.tieneDatosCredito()) {
      this.avales.forEach(aval => {
        if (aval.aval_Id === 0) {
          this.insertarAval(aval);
        } else {
          this.actualizarAval(aval);
        }
      });
    }
  }

  insertarDireccion(direccion: DireccionPorCliente): void {
    const direccionInsertar = {
      ...direccion,
      clie_Id: this.idDelCliente,
      usua_Creacion: environment.usua_Id,
      diCl_FechaCreacion: new Date(),
      usua_Modificacion: environment.usua_Id,
      diCl_FechaModificacion: new Date()
    };

    this.http.post<any>(`${environment.apiBaseUrl}/DireccionesPorCliente/Insertar`, direccionInsertar, {
      headers: {
        'X-Api-Key': environment.apiKey,
        'Content-Type': 'application/json',
        'accept': '*/*'
      }
    }).subscribe({
      next: (response) => {
        console.log('Dirección insertada correctamente:', response);
      },
      error: (error) => {
        console.error('Error al insertar dirección:', error);
      }
    });
  }

  actualizarDireccion(direccion: DireccionPorCliente): void {
    const direccionActualizar = {
      ...direccion,
      usua_Modificacion: environment.usua_Id,
      diCl_FechaModificacion: new Date()
    };

    this.http.put<any>(`${environment.apiBaseUrl}/DireccionesPorCliente/Actualizar`, direccionActualizar, {
      headers: {
        'X-Api-Key': environment.apiKey,
        'Content-Type': 'application/json',
        'accept': '*/*'
      }
    }).subscribe({
      next: (response) => {
        console.log('Dirección actualizada correctamente:', response);
      },
      error: (error) => {
        console.error('Error al actualizar dirección:', error);
      }
    });
  }

  eliminarDireccionServidor(direccionId: number): void {
    this.http.post(`${environment.apiBaseUrl}/DireccionesPorCliente/Eliminar/${direccionId}`, {}, {
      headers: {
        'X-Api-Key': environment.apiKey,
        'Content-Type': 'application/json',
        'accept': '*/*'
      }
    }).subscribe({
      next: (response) => {
        console.log('Dirección eliminada correctamente:', response);
      },
      error: (error) => {
        console.error('Error al eliminar dirección:', error);
      }
    });
  }

  insertarAval(aval: Aval): void {
    const avalInsertar = {
      ...aval,
      clie_Id: this.idDelCliente,
      usua_Creacion: environment.usua_Id,
      aval_FechaCreacion: new Date(),
      usua_Modificacion: environment.usua_Id,
      aval_FechaModificacion: new Date()
    };

    this.http.post<any>(`${environment.apiBaseUrl}/Aval/Insertar`, avalInsertar, {
      headers: {
        'X-Api-Key': environment.apiKey,
        'Content-Type': 'application/json',
        'accept': '*/*'
      }
    }).subscribe({
      next: (response) => {
        console.log('Aval insertado correctamente:', response);
      },
      error: (error) => {
        console.error('Error al insertar aval:', error);
      }
    });
  }

  actualizarAval(aval: Aval): void {
    const avalActualizar = {
      ...aval,
      usua_Modificacion: environment.usua_Id,
      aval_FechaModificacion: new Date()
    };

    this.http.put<any>(`${environment.apiBaseUrl}/Aval/Actualizar`, avalActualizar, {
      headers: {
        'X-Api-Key': environment.apiKey,
        'Content-Type': 'application/json',
        'accept': '*/*'
      }
    }).subscribe({
      next: (response) => {
        console.log('Aval actualizado correctamente:', response);
      },
      error: (error) => {
        console.error('Error al actualizar aval:', error);
      }
    });
  }

  eliminarAvalServidor(avalId: number): void {
    this.http.put(`${environment.apiBaseUrl}/Aval/Eliminar/${avalId}`, {}, {
      headers: {
        'X-Api-Key': environment.apiKey,
        'Content-Type': 'application/json',
        'accept': '*/*'
      }
    }).subscribe({
      next: (response) => {
        console.log('Aval eliminado correctamente:', response);
      },
      error: (error) => {
        console.error('Error al eliminar aval:', error);
      }
    });
  }

  agregarDireccion() {
    this.mostrarErrores = true;
    if (!this.direccionPorCliente.diCl_Longitud && !this.direccionPorCliente.diCl_Latitud) {
      this.mostrarErrores = true;
      this.mostrarAlertaWarning = true;
      this.mensajeWarning = 'Por favor, seleccione una ubicación en el mapa.';
      setTimeout(() => {
        this.mostrarAlertaWarning = false;
        this.mensajeWarning = '';
      }, 3000);
      return;
    }

    if (this.direccionPorCliente.diCl_DireccionExacta.trim() && this.direccionPorCliente.colo_Id && this.direccionPorCliente.diCl_Observaciones) {
      this.mostrarErrores = false;
      const colonia = this.TodasColonias.find(c => c.colo_Id == this.direccionPorCliente.colo_Id);
      this.direccionPorCliente.muni_Descripcion = colonia ? colonia.colo_Descripcion : '';
      this.direccionPorCliente.muni_Descripcion += ' ';
      this.direccionPorCliente.muni_Descripcion += colonia ? colonia.muni_Descripcion : '';
      this.direccionPorCliente.muni_Descripcion += ' ';
      this.direccionPorCliente.muni_Descripcion += colonia ? colonia.depa_Descripcion : '';

      if (this.direccionEditandoIndex !== null) {
        this.direccionesPorCliente[this.direccionEditandoIndex] = { ...this.direccionPorCliente };
        this.direccionEditandoIndex = null;
      } else {
        this.direccionesPorCliente.push({ ...this.direccionPorCliente });
      }
      this.limpiarDireccionModal();
      this.cerrarMapa();
      this.validarDireccion = false;
    }
    else {
      this.mostrarErrores = true;
      this.mostrarAlertaWarning = true;
      this.mensajeWarning = 'Por favor, complete todos los campos obligatorios de la dirección.';
      setTimeout(() => {
        this.mostrarAlertaWarning = false;
        this.mensajeWarning = '';
      }, 3000);
      return;
    }
  }

  editarDireccion(index: number) {
    this.direccionEditandoIndex = index;
    this.direccionPorCliente = { ...this.direccionesPorCliente[index] };
    this.mostrarMapa = true;
    setTimeout(() => {
      this.mapaSelectorComponent?.inicializarMapa();
    }, 300);
  }

  eliminarDireccion(index: number) {
    const direccion = this.direccionesPorCliente[index];

    if (direccion.diCl_Id > 0) {
      this.direccionesEliminadas.push(direccion.diCl_Id);
    }

    this.direccionesPorCliente.splice(index, 1);
    this.validarDireccion = this.direccionesPorCliente.length === 0;
  }

  limpiarDireccionModal() {
    this.direccionPorCliente = {
      diCl_Id: 0,
      clie_Id: this.idDelCliente,
      colo_Id: 0,
      diCl_DireccionExacta: '',
      diCl_Observaciones: '',
      diCl_Latitud: 0,
      diCl_Longitud: 0,
      muni_Descripcion: '',
      depa_Descripcion: '',
      usua_Creacion: 0,
      diCl_FechaCreacion: new Date(),
      usua_Modificacion: 0,
      diCl_FechaModificacion: new Date(),
    };
  }

  agregarAval() {
    this.avales.push(this.nuevoAval());
    this.avalActivoIndex = this.avales.length - 1;
    this.scrollToAval(this.avalActivoIndex);
  }

  eliminarAval(index: number) {
    const aval = this.avales[index];

    if (aval.aval_Id > 0) {
      this.avalesEliminados.push(aval.aval_Id);
    }

    this.avales.splice(index, 1);

    if (this.avalActivoIndex >= this.avales.length) {
      this.avalActivoIndex = this.avales.length - 1;
    }

    if (this.avales.length === 0 && this.tieneDatosCredito()) {
      this.avales.push(this.nuevoAval());
      this.avalActivoIndex = 0;
    }
  }

  seleccionarAval(index: number) {
    this.avalActivoIndex = index;
  }

  cambiarAval(direccion: number) {
    const nuevoIndex = this.avalActivoIndex + direccion;

    if (nuevoIndex >= 0 && nuevoIndex < this.avales.length) {
      this.avalActivoIndex = nuevoIndex;
      this.scrollToAval(nuevoIndex);
    }
  }
}