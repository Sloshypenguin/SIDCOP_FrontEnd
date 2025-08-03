import { Component, Output, EventEmitter, ViewChild, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core'; //***
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
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, NgxMaskDirective, MapaSelectorComponent],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss',
  providers: [provideNgxMask()]
})
export class EditComponent implements OnChanges { //***

  @Input() clienteData: Cliente | null = null; //***
  @Output() onCancel = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<Cliente>();
  @ViewChild('tabsScroll', { static: false }) tabsScroll!: ElementRef<HTMLDivElement>;
  @ViewChild(MapaSelectorComponent)
  mapaSelectorComponent!: MapaSelectorComponent;
  entrando = true;
  tabActual = 1;

  //*** Copia original para comparar cambios
  clienteOriginal: Cliente | null = null; //***
  mostrarConfirmacionEditar = false; //***
  mensajeConfirmacionEditar = ''; //***

get fechaNacimientoFormato(): string {
  return this.cliente.clie_FechaNacimiento
    ? new Date(this.cliente.clie_FechaNacimiento).toISOString().split('T')[0]
    : '';
}
set fechaNacimientoFormato(value: string) {
  this.cliente.clie_FechaNacimiento = value ? new Date(value) : null;
}

  ngOnChanges(changes: SimpleChanges): void { //***
    if (changes['clienteData']?.currentValue) {
      this.cliente = { ...changes['clienteData'].currentValue };
      this.clienteOriginal = { ...changes['clienteData'].currentValue };
      
        // Cargar las direcciones del cliente
    if (this.cliente.clie_Id) {
      this.cargarDireccionesDelCliente(this.cliente.clie_Id);
    }

    // Formatear fecha si es necesario
    if (this.cliente.clie_FechaNacimiento) {
      // Tu lógica existente para formatear la fecha
    }
      this.mostrarErrores = false;
      this.cerrarAlerta();
      // Asegura que la fecha de nacimiento esté en formato dd-yyyy-MM para el input type=date
// if (this.cliente.clie_FechaNacimiento) {
//   let fecha = this.cliente.clie_FechaNacimiento;
//   if (typeof fecha === 'string') {
//     // Admite dd-mm-yyyy o dd/mm/yyyy
//     const fechaStr: string = fecha as string;
//     let partes = fechaStr.includes('-') ? fechaStr.split('-') : fechaStr.split('/');
//     if (partes.length === 3) {
//       // partes[0]=día, partes[1]=mes, partes[2]=año
//       const dateObj = new Date(
//         Number(partes[2]),
//         Number(partes[1]) - 1,
//         Number(partes[0])
//       );
//       // Si la fecha es inválida, asigna null
//       this.cliente.clie_FechaNacimiento = isNaN(dateObj.getTime()) ? null : dateObj;
//     } else {
//       // Si el string no es válido, intenta parsear con Date
//       const dateObj = new Date(fechaStr);
//       this.cliente.clie_FechaNacimiento = isNaN(dateObj.getTime()) ? null : dateObj;
//     }
//   }
//   // Si ya es Date, no hace nada
// }
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

  validarDireccion: boolean = false;

  scrollToAval(index: number) {
    const container = this.tabsScroll.nativeElement;
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
        this.cliente.cana_Id 
        // this.validarDireccion
      ) {
        this.mostrarErrores = false;
        this.activeTab = 3;
      } else {
        // this.validarDireccion = true;
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
      // this.mostrarErrores = true;
      // if (
      //   (!this.cliente.clie_LimiteCredito && !this.cliente.clie_DiasCredito) ||
      //   (this.cliente.clie_LimiteCredito && this.cliente.clie_DiasCredito)
      // ) {
        this.mostrarErrores = false;
        this.activeTab = 5;
      // } else {
      //   this.mostrarAlertaWarning = true;
      //   this.mensajeWarning = 'Complete correctamente los datos de crédito.';
      //   setTimeout(() => {
      //     this.mostrarAlertaWarning = false;
      //     this.mensajeWarning = '';
      //   }, 3000);
      // }
      return;
    }

    // if (no === 4) {
    //   this.mostrarErrores = true;
    //   if (this.tieneDatosCredito()) {
    //     if (this.avales.length > 0 && this.avales.every(aval => this.esAvalValido(aval))) {
    //       this.mostrarErrores = false;
    //       this.activeTab = 5;
    //     } else {
    //       this.mostrarAlertaWarning = true;
    //       this.mensajeWarning = 'Por favor complete correctamente todos los registros de Aval.';
    //       setTimeout(() => {
    //         this.mostrarAlertaWarning = false;
    //         this.mensajeWarning = '';
    //       }, 3000);
    //     }
    //   } else {
    //     this.mostrarErrores = false;
    //     this.activeTab = 5;
    //   }
    //   return;
    // }
  }

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
        this.tabActual = 2;
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
      this.mostrarErrores = true
      if (this.cliente.clie_NombreNegocio.trim() && this.cliente.clie_ImagenDelNegocio.trim() &&
        this.cliente.ruta_Id && this.cliente.cana_Id && this.validarDireccion) {
        this.mostrarErrores = false;
        this.activeTab = 3;
      }
      else {
        this.validarDireccion = true;
        this.mostrarAlertaWarning = true;
        this.mensajeWarning = 'Por favor, complete todos los campos obligatorios.';
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

    // if (no == 4) {
    //   this.mostrarErrores = true;
    //   if (this.tieneDatosCredito()) {
    //     if (this.avales.length > 0 && this.avales.every(aval => this.esAvalValido(aval))) {
    //       this.mostrarErrores = false;
    //       this.activeTab = 5;
    //     } else {
    //       this.mostrarErrores = true;
    //       this.mostrarAlertaWarning = true;
    //       this.mensajeWarning = 'Por favor complete correctamente todos los registros de Aval.';
    //       setTimeout(() => {
    //         this.mostrarAlertaWarning = false;
    //         this.mensajeWarning = '';
    //       }, 3000);
    //     }
    //   }
    //   else {
    //     this.mostrarErrores = false;
    //     this.activeTab = 5;
    //   }
    // }

    if (no == 5) {
      this.mostrarErrores = false;
    }
  }

  tieneDatosCredito(): boolean {
    return (
      !!this.cliente.clie_LimiteCredito &&
      !!this.cliente.clie_DiasCredito
    );
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

  // Agrega esto en tu componente
cargarDireccionesDelCliente(clie_Id: number): void {
  this.http.get<DireccionPorCliente[]>(
    `${environment.apiBaseUrl}/DireccionesPorCliente/Buscar/${clie_Id}`,
    { headers: { 'X-Api-Key': environment.apiKey } }
  ).subscribe({
    next: (direcciones) => {
      this.direccionesPorCliente = direcciones;
      // Si no hay direcciones, inicializa con una vacía
      this.direccionesPorCliente = [{
        diCl_Id: 0, // Esto está bien para nueva dirección
        clie_Id: clie_Id, // Aquí sí usa el ID del cliente
        colo_Id: Number(this.selectedColonia) || 0, // Usa el seleccionado si existe
        diCl_DireccionExacta: '',
        diCl_Observaciones: '',
        diCl_Latitud: this.latitudSeleccionada || 0, // Usa coordenadas si existen
        diCl_Longitud: this.longitudSeleccionada || 0,
        muni_Descripcion: this.selectedMuni || '',
        depa_Descripcion: this.selectedDepa || '',
        usua_Creacion: getUserId(), // Mejor usar el ID real
        diCl_FechaCreacion: new Date(),
        usua_Modificacion: getUserId(),
        diCl_FechaModificacion: new Date()
      }];
    },
    error: (err) => {
      console.error('Error al cargar direcciones:', err);
      this.mostrarAlertaError = true;
      this.mensajeError = 'Error al cargar las direcciones del cliente';
      setTimeout(() => this.cerrarAlerta(), 3000);
    }
  });
}
  
    constructor(public http: HttpClient, private router: Router) {
    this.cargarPaises();
    this.cargarTiposDeVivienda();
    this.cargarEstadosCiviles();
    this.cargarCanales();
    this.cargarRutas();

    this.router.navigate(['/general/clientes/list']);
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

  cargarColoniasCliente() {
    this.http.get<any[]>(`${environment.apiBaseUrl}/Colonia/ListarMunicipiosyDepartamentos`, {
      headers: { 'x-api-key': environment.apiKey }
    }).subscribe(data => this.TodasColonias = data);
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

  //*** Compara cliente vs clienteOriginal y muestra confirmación
  validarEdicion(): void { //***
    this.mostrarErrores = true;
    if (this.hayDiferencias()) {
      this.mostrarConfirmacionEditar = true;
      this.mensajeConfirmacionEditar = '¿Desea guardar los cambios realizados?';
    } else {
      this.mostrarAlertaWarning = true;
      this.mensajeWarning = 'No se han detectado cambios.';
      setTimeout(() => this.cerrarAlerta(), 4000);
    }
  }

  hayDiferencias(): boolean { //***
    if (!this.clienteOriginal) return false;
    const a = this.cliente;
    const b = this.clienteOriginal;
    return (Object.keys(a) as (keyof Cliente)[]).some(key => a[key] !== b[key]);
  }

  cancelarEdicion(): void { //***
    this.mostrarConfirmacionEditar = false;
  }

  confirmarEdicion(): void { //***
    this.mostrarConfirmacionEditar = false;
    this.guardarCliente();
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
      usuaM_Nombre: '',
    };
    // this.direccionesPorCliente = [];
    // this.avales = [];
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
    try{
        this.mostrarErrores = true;
      if (this.entrando) {
        this.mostrarAlertaWarning = false;
        this.mostrarAlertaError = false;
        const clienteGuardar = {
          clie_Id: this.cliente.clie_Id,
          clie_Codigo: this.cliente.clie_Codigo.trim(),
          clie_Nacionalidad: this.cliente.clie_Nacionalidad,
          pais_Descripcion: this.cliente.pais_Descripcion,
          clie_DNI: this.cliente.clie_DNI.trim(),
          clie_RTN: this.cliente.clie_RTN.trim(),
          clie_Nombres: this.cliente.clie_Nombres.trim(),
          clie_Apellidos: this.cliente.clie_Apellidos.trim(),
          clie_NombreNegocio: this.cliente.clie_NombreNegocio.trim(),
          clie_ImagenDelNegocio: this.cliente.clie_ImagenDelNegocio.trim(),
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
          clie_Saldo: 0,
          clie_Vencido: false,
          clie_Observaciones: this.cliente.clie_Observaciones?.trim() || '',
          clie_ObservacionRetiro: this.cliente.clie_ObservacionRetiro?.trim() || '',
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
        this.http.put<any>(
          `${environment.apiBaseUrl}/Cliente/Actualizar`,
          clienteGuardar,
          {
            headers: {
              'X-Api-Key': environment.apiKey,
              'Content-Type': 'application/json',
              'accept': '*/*'
            }
          }
        ).subscribe({
          next: (response) => {
            if (response.data.code_Status === -1) {
              this.mostrarAlertaError = true;
              this.mensajeError = response.data.message_Status;
              this.activeTab = 1;
              this.cliente.clie_Codigo = '';
              setTimeout(() => {
                this.mostrarAlertaError = false;
                this.mensajeError = '';
              }, 3000);
              return;
            }
            if (response.data.data) {
              this.idDelCliente = response.data.data;
              this.actualizarDirecciones(this.idDelCliente);
              // this.guardarAvales(this.idDelCliente);

              // Prueba
              this.onSave.emit(this.cliente);
              this.cancelar();
            }
          },
          error: (error) => {
            console.error('Error al guardar el cliente:', error);
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
    catch (error) {
      console.error('Error al guardar el cliente:', error);
      this.mostrarAlertaError = true;
      this.mensajeError = 'Ocurrió un error al guardar el cliente. Por favor, inténtelo de nuevo más tarde.';
      setTimeout(() => this.cerrarAlerta(), 4000);
      return;
    }
  }

  agregarDireccion() {
    this.mostrarErrores = true;
    if(!this.direccionPorCliente.diCl_Longitud && !this.direccionPorCliente.diCl_Latitud){
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
    }
    else{
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
      this.mapaSelectorComponent.inicializarMapa();
    }, 300);
  }

  eliminarDireccion(index: number) {
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
      muni_Descripcion: '',
      depa_Descripcion: '',
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
      this.http.put<any>(`${environment.apiBaseUrl}/DireccionesPorCliente/Actualizar`, direccionPorClienteGuardar, {
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

  async actualizarDirecciones(clie_Id: number): Promise<void> {
  try {
    // Preparar todas las actualizaciones
    const actualizaciones = this.direccionesPorCliente.map(direccion => {
      const payload = {
        ...direccion,
        clie_Id: clie_Id,
        usua_Modificacion: environment.usua_Id,
        diCl_FechaModificacion: new Date()
      };

      return this.http.put<any>(
        `${environment.apiBaseUrl}/DireccionesPorCliente/Actualizar`,
        payload,
        {
          headers: {
            'X-Api-Key': environment.apiKey,
            'Content-Type': 'application/json'
          }
        }
      ).toPromise();
    });

    // Esperar a que todas se completen
    await Promise.all(actualizaciones);
    
    this.mostrarAlertaExito = true;
    this.mensajeExito = 'Cliente y direcciones actualizados correctamente';
    this.onSave.emit(this.cliente);
    setTimeout(() => this.cancelar(), 2000);
    
  } catch (error) {
    console.error('Error al actualizar direcciones:', error);
    this.mostrarAlertaError = true;
    this.mensajeError = 'El cliente se guardó pero hubo un error con las direcciones';
    setTimeout(() => {
      this.onSave.emit(this.cliente);
      this.cancelar();
    }, 3000);
  } finally {
    this.cargando = false;
  }
}
}
