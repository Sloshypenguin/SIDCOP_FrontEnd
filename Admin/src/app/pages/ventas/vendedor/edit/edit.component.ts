import { Component, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Vendedor } from 'src/app/Modelos/ventas/Vendedor.Model';
import { environment } from 'src/environments/environment.prod';
import { getUserId } from 'src/app/core/utils/user-utils';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule,  NgxMaskDirective, NgSelectModule],
   providers: [provideNgxMask()],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class EditComponent implements OnChanges {
  @Input() vendedorData: Vendedor | null = null;
  @Output() onCancel = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<Vendedor>();

 vendedor: Vendedor = {
    vend_Id: 0,
    vend_Nombres: '',
    vend_Apellidos: '',
    vend_Codigo: '',
    vend_Telefono: '',
    vend_Correo: '',
    vend_DNI: '',
    vend_Sexo: '',
    vend_Tipo: '',
    vend_DireccionExacta: '',
    vend_Supervisor: 0,
    vend_Ayudante: 0,
    vend_EsExterno: false,
    colo_Id: 0,
    sucu_Id: 0,
    vend_Estado:'',
    vend_FechaCreacion: new Date(),
    vend_FechaModificacion: new Date(),
    usua_Creacion: 0,
    usua_Modificacion: 0,
    code_Status: 0,
    message_Status: '',
    usuarioCreacion: '',
    usuarioModificacion: ''
    
  };

    sucursales: any[] = [];
    colonia: any[] = [];
    supervisores: any[] = [];
    ayudantes: any[] = [];
    modelos: any[] = [];


    searchSucursal = (term: string, item: any) => {
  term = term.toLowerCase();
  return (
    item.sucu_Descripcion?.toLowerCase().includes(term) ||
    item.muni_Descripcion?.toLowerCase().includes(term) ||
    item.depa_Descripcion?.toLowerCase().includes(term)
  );
};

 searchColonias = (term: string, item: any) => {
  term = term.toLowerCase();
  return (
    item.colo_Descripcion?.toLowerCase().includes(term) ||
    item.muni_Descripcion?.toLowerCase().includes(term) ||
    item.depa_Descripcion?.toLowerCase().includes(term)
  );
};

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

 listarSucursales(): void {
    this.http.get<any>(`${environment.apiBaseUrl}/Sucursales/Listar`, {
        headers: { 'x-api-key': environment.apiKey }
      }).subscribe((data) => this.sucursales = this.ordenarPorMunicipioYDepartamento(data));
    };

  listarColonias(): void {
    this.http.get<any>(`${environment.apiBaseUrl}/Colonia/Listar`, {
        headers: { 'x-api-key': environment.apiKey }
      }).subscribe((data) => this.colonia = this.ordenarPorMunicipioYDepartamento(data));
    };

  listarEmpleados(): void {
    this.http.get<any>(`${environment.apiBaseUrl}/Empleado/Listar`, {
        headers: { 'x-api-key': environment.apiKey }
      }).subscribe((data) => {
    if (Array.isArray(data)) {
          this.supervisores = data
        .filter((empleado: any) => empleado.carg_Id === 1)
        .map((empleado: any) => ({
          ...empleado,
          nombreCompleto: `${empleado.empl_Nombres} ${empleado.empl_Apellidos}`
        }));
      this.ayudantes = data
        .filter((empleado: any) => empleado.carg_Id !== 1)
        .map((empleado: any) => ({
          ...empleado,
          nombreCompleto: `${empleado.empl_Nombres} ${empleado.empl_Apellidos}`
        }));
    } else {
      this.supervisores = [];
      this.ayudantes = [];
    }
  });
    };



  



    direccionExactaInicial: string = '';

onColoniaSeleccionada(colo_Id: number) {
  const coloniaSeleccionada = this.colonia.find((c: any) => c.colo_Id === colo_Id);
  if (coloniaSeleccionada) {
    this.direccionExactaInicial = coloniaSeleccionada.colo_Descripcion;
    this.vendedor.vend_DireccionExacta = coloniaSeleccionada.colo_Descripcion;
  } else {
    this.direccionExactaInicial = '';
    this.vendedor.vend_DireccionExacta = '';
  }
}

sexos: any[] = [
  { label: 'Masculino', value: 'M', icon: 'fa-solid fa-person' },
  { label: 'Femenino', value: 'F', icon: 'fa-solid fa-person-dress' }
];

tieneAyudante: boolean = false;

  vendedorOriginal = '';
  mostrarErrores = false;
  mostrarAlertaExito = false;
  mensajeExito = '';
  mostrarAlertaError = false;
  mensajeError = '';
  mostrarAlertaWarning = false;
  mensajeWarning = '';
  mostrarConfirmacionEditar = false;

  constructor(private http: HttpClient) {
    this.listarSucursales();
    this.listarEmpleados();
    this.listarColonias();
  }





 

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['vendedorData'] && changes['vendedorData'].currentValue) {
      this.vendedor = { ...changes['vendedorData'].currentValue };
      this.vendedorOriginal = this.vendedor.vend_Codigo || '';
      this.mostrarErrores = false;
      this.cerrarAlerta();
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

    if (
    !this.vendedor.vend_Codigo.trim() ||
    !this.vendedor.vend_DNI.trim() ||
    !this.vendedor.vend_Nombres.trim() ||
    !this.vendedor.vend_Apellidos.trim() ||
    !this.vendedor.vend_Telefono.trim() ||
    !this.vendedor.vend_Correo.trim() ||
    !this.vendedor.vend_Sexo ||
    !this.vendedor.vend_DireccionExacta.trim() ||
    !this.vendedor.sucu_Id ||
    !this.vendedor.colo_Id ||
    !this.vendedor.vend_Tipo.trim() ||
    !this.vendedor.vend_Supervisor ||
    (this.tieneAyudante && !this.vendedor.vend_Ayudante) 
  ) {
    this.mostrarAlertaWarning = true;
    this.mensajeWarning = 'Por favor complete todos los campos requeridos antes de guardar.';
    setTimeout(() => this.cerrarAlerta(), 4000);
    return;
  }

  // Detectar cambios en los campos principales
  const cambios =
    this.vendedor.vend_Codigo.trim() !== (this.vendedorData?.vend_Codigo?.trim() ?? '') ||
  this.vendedor.vend_DNI.trim() !== (this.vendedorData?.vend_DNI?.trim() ?? '') ||
  this.vendedor.vend_Nombres.trim() !== (this.vendedorData?.vend_Nombres?.trim() ?? '') ||
  this.vendedor.vend_Apellidos.trim() !== (this.vendedorData?.vend_Apellidos?.trim() ?? '') ||
  this.vendedor.vend_Telefono.trim() !== (this.vendedorData?.vend_Telefono?.trim() ?? '') ||
  this.vendedor.vend_Correo.trim() !== (this.vendedorData?.vend_Correo?.trim() ?? '') ||
  this.vendedor.vend_Sexo !== (this.vendedorData?.vend_Sexo ?? '') ||
  this.vendedor.vend_DireccionExacta.trim() !== (this.vendedorData?.vend_DireccionExacta?.trim() ?? '') ||
  this.vendedor.sucu_Id !== (this.vendedorData?.sucu_Id ?? 0) ||
  this.vendedor.colo_Id !== (this.vendedorData?.colo_Id ?? 0) ||
  this.vendedor.vend_Tipo.trim() !== (this.vendedorData?.vend_Tipo?.trim() ?? '') ||
  this.vendedor.vend_Supervisor !== (this.vendedorData?.vend_Supervisor ?? 0) ||
  (this.tieneAyudante && this.vendedor.vend_Ayudante !== (this.vendedorData?.vend_Ayudante ?? 0)) ||
  this.vendedor.vend_EsExterno !== (this.vendedorData?.vend_EsExterno ?? false);

  if (cambios) {
    this.mostrarConfirmacionEditar = true;
  } else {
    this.mostrarAlertaWarning = true;
    this.mensajeWarning = 'No se han detectado cambios.';
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

   if (this.vendedor.vend_Nombres.trim()) {
  const VendedorActualizar: any = {
    vend_Id: this.vendedor.vend_Id,
    vend_Codigo: this.vendedor.vend_Codigo.trim(),
    vend_DNI: this.vendedor.vend_DNI.trim(),
    vend_Nombres: this.vendedor.vend_Nombres.trim(),
    vend_Apellidos: this.vendedor.vend_Apellidos.trim(),
    vend_Telefono: this.vendedor.vend_Telefono.trim(),
    vend_Correo: this.vendedor.vend_Correo.trim(),
    vend_Sexo: this.vendedor.vend_Sexo,
    vend_Tipo: this.vendedor.vend_Tipo.trim(),
    vend_DireccionExacta: this.vendedor.vend_DireccionExacta.trim(),
    sucu_Id: this.vendedor.sucu_Id,
    colo_Id: this.vendedor.colo_Id,
    vend_Supervisor: this.vendedor.vend_Supervisor || 0,
    vend_EsExterno: this.vendedor.vend_EsExterno || false,
    usua_Creacion: this.vendedor.usua_Creacion,
    vend_FechaCreacion: this.vendedor.vend_FechaCreacion,
    usua_Modificacion: getUserId(),
    vend_FechaModificacion: new Date().toISOString(),
    usuarioCreacion: '',
    usuarioModificacion: ''
  };

  // Solo agregar vend_Ayudante si tieneAyudante es true
  if (this.tieneAyudante && this.vendedor.vend_Ayudante) {
    VendedorActualizar.vend_Ayudante = this.vendedor.vend_Ayudante;
  }

      this.http.put<any>(`${environment.apiBaseUrl}/Vendedores/Actualizar`, VendedorActualizar, {
        headers: {
          'X-Api-Key': environment.apiKey,
          'Content-Type': 'application/json',
          'accept': '*/*'
        }
      }).subscribe({
        next: (response) => {
          this.mensajeExito = `El Vendedor "${this.vendedor.vend_Nombres}" actualizado exitosamente`;
          this.mostrarAlertaExito = true;
          this.mostrarErrores = false;

          setTimeout(() => {
            this.mostrarAlertaExito = false;
            this.onSave.emit(this.vendedor);
            this.cancelar();
          }, 3000);
        },
        error: (error) => {
          console.error('Error al actualizar la Vendedor:', error);
          this.mostrarAlertaError = true;
          this.mensajeError = 'Error al actualizar la Vendedor. Por favor, intente nuevamente.';
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
