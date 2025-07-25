import { Component, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { NgSelectModule } from '@ng-select/ng-select';
import { Descuento } from 'src/app/Modelos/inventario/DescuentoModel';
import { DescuentoDetalle } from 'src/app/Modelos/inventario/DescuentoDetalleModel';
import { DescuentoPorCliente } from 'src/app/Modelos/inventario/DescuentoPorClienteModel';
import { DescuentoPorEscala } from 'src/app/Modelos/inventario/DescuentoPorEscalaModel';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { NgStepperModule } from 'angular-ng-stepper';
import { ViewChild } from '@angular/core';
import { CdkStepper } from '@angular/cdk/stepper';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule,  NgxMaskDirective, NgSelectModule, CdkStepperModule, NgStepperModule],
   providers: [provideNgxMask()],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class EditComponent implements OnChanges {
  @Input()descuentoData: Descuento | null = null;
  @Output() onCancel = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<Descuento>();
seccionVisible: string | null = null;
  filtro: string = '';
  seleccionados: number[] = [];
  clientesAgrupados: { canal: string, clientes: any[] }[] = [];
clientesSeleccionados: number[] = [];
descuentosExistentes: any[] = [];
 @ViewChild('cdkStepper') cdkStepper!: CdkStepper;

    tabActiva: string = 'productos';
change(event: any) {
  }

get itemsDisponibles(): any[] {
  switch (this.seccionVisible) {
    case 'productos': return this.productos;
    case 'categorias': return this.categorias;
    case 'subcategorias': return this.subcategorias;
    case 'marcas': return this.marcas;
    default: return [];
  }
}

getId(item: any): number {
  if (this.seccionVisible === 'productos') return item.prod_Id;
  if (this.seccionVisible === 'categorias') return item.cate_Id;
  if (this.seccionVisible === 'subcategorias') return item.subc_Id;
  if (this.seccionVisible === 'marcas') return item.marc_Id;
  return 0;
}

getNombre(item: any): string {
  if (this.seccionVisible === 'productos') return item.prod_DescripcionCorta;
  if (this.seccionVisible === 'categorias') return item.cate_Descripcion;
  if (this.seccionVisible === 'subcategorias') return item.subc_Descripcion;
  if (this.seccionVisible === 'marcas') return item.marc_Descripcion;
  return '';
}

mostrarSeccion(seccion: string) {
  this.seccionVisible = seccion;
  this.filtro = '';
  this.seleccionados = []; // Limpiar al cambiar sección
  this.descuentoDetalle.idReferencias = []; // También limpiar la propiedad relacionada
  this.tabActiva = seccion;

  switch (seccion) {
    case 'productos':
      this.descuento.desc_Aplicar = 'P';
      break;
    case 'categorias':
      this.descuento.desc_Aplicar = 'C';
      break;
    case 'subcategorias':
      this.descuento.desc_Aplicar = 'S';
      break;
    case 'marcas':
      this.descuento.desc_Aplicar = 'M';
      break;
  }
}

getItemsFiltrados() {
  return this.itemsDisponibles.filter(item =>
    this.getNombre(item).toLowerCase().includes(this.filtro.toLowerCase())
  );
}

alternarSeleccion(id: number) {
  const index = this.seleccionados.indexOf(id);
  if (index > -1) {
    this.seleccionados.splice(index, 1);
  } else {
    this.seleccionados.push(id);
  }
  this.descuentoDetalle.idReferencias = [...this.seleccionados]; // actualizar modelo
}

todosSeleccionados(): boolean {
  const items = this.getItemsFiltrados();
  return items.length > 0 && items.every(item => this.seleccionados.includes(this.getId(item)));
}

seleccionarTodos(event: any) {
  const items = this.getItemsFiltrados();
  if (event.target.checked) {
    this.seleccionados = items.map(item => this.getId(item));
  } else {
    this.seleccionados = [];
  }
  this.descuentoDetalle.idReferencias = [...this.seleccionados];
}



  constructor(private http: HttpClient) {
    this.listarcategorias();
    this.listarmarcass();
    this.listarPorductos();
    this.listarSubcategorias();
    this.listarClientes();
    this.listarDescuentos();
    
  }



  descuento: Descuento = {
    desc_Id:  0,
  desc_Descripcion:  '',
  desc_Tipo: false, 
  desc_Aplicar:  '',
  desc_FechaInicio:  new Date(),
  desc_FechaFin: new Date(),
  desc_Observaciones:  '',
  usua_Creacion:  0,
  desc_FechaCreacion:  new Date(),
  usua_Modificacion: 0,
  desc_FechaModificacion: new Date(),
  desc_Estado: false,
  usuarioCreacion:  '',
  usuarioModificacion: '',
  code_Status:  0,
  message_Status:'',
  clientes: '',
  referencias: '',
  escalas: '',
  }

  descuentoDetalle: DescuentoDetalle = {
    desc_Id:  0,
  desD_Id:  0,
  desD_IdReferencia: 0, 
  idReferencias: [],
  usua_Creacion:  0,
  desD_FechaCreacion:  new Date(),
  usua_Modificacion: 0,
  desD_FechaModificacion: new Date(),
  desD_Estado: false,
  usuarioCreacion:  '',
  usuarioModificacion: '',
  code_Status:  0,
  message_Status:''
  }

  descuentoPorCliente: DescuentoPorCliente = {
    desc_Id:  0,
  deCl_Id:  0,
  clie_Id: 0, 
  idClientes: [],
  usua_Creacion:  0,
  deEs_FechaCreacion:  new Date(),
  usua_Modificacion: 0,
  deEs_FechaModificacion: new Date(),
  deCl_Estado: false,
  usuarioCreacion:  '',
  usuarioModificacion: '',
  code_Status:  0,
  message_Status:''
  }

  descuentoPorEscala: DescuentoPorEscala = {
    desc_Id:  0,
  deEs_Id:  0,
  deEs_InicioEscala: 0, 
  deEs_FinEscala: 0, 
  deEs_Valor: 0, 
  escalas_JSON: '',
  escalas: [],
  usua_Creacion:  0,
  deEs_FechaCreacion:  new Date(),
  usua_Modificacion: 0,
  deEs_FechaModificacion: new Date(),
  deEs_Estado: false,
  usuarioCreacion:  '',
  usuarioModificacion: '',
  code_Status:  0,
  message_Status:''
  }

    categorias: any[] = [];
    marcas: any[] = [];
    productos: any[] = [];
    subcategorias: any[] = [];
    clientes: any[] = [];


    

 listarcategorias(): void {
    this.http.get<any>(`${environment.apiBaseUrl}/Categorias/Listar`, {
        headers: { 'x-api-key': environment.apiKey }
      }).subscribe((data) => this.categorias = data);
    };

  listarmarcass(): void {
    this.http.get<any>(`${environment.apiBaseUrl}/Marcas/Listar`, {
        headers: { 'x-api-key': environment.apiKey }
      }).subscribe((data) => this.marcas = data);
    };

  listarPorductos(): void {
    this.http.get<any>(`${environment.apiBaseUrl}/Productos/Listar`, {
        headers: { 'x-api-key': environment.apiKey }
      }).subscribe((data) => this.productos = data);
    };



  listarSubcategorias(): void {
    this.http.get<any>(`${environment.apiBaseUrl}/Subcategoria/Listar`, {
        headers: { 'x-api-key': environment.apiKey }
      }).subscribe((data) => this.subcategorias = data);
    };

   listarClientes(): void {
    this.http.get<any>(`${environment.apiBaseUrl}/Cliente/Listar`, {
        headers: { 'x-api-key': environment.apiKey }
      }).subscribe((data) => {
    const agrupados: { [canal: string]: any[] } = {};

    for (const cliente of data) {
      const canal = cliente.cana_Descripcion || 'Sin canal';
      if (!agrupados[canal]) {
        agrupados[canal] = [];
      }
      agrupados[canal].push(cliente);
    }

    this.clientesAgrupados = Object.keys(agrupados).map(canal => ({
      canal,
      filtro: '', // Se agrega filtro para el buscador individual
      clientes: agrupados[canal]
    }));
  });
}

listarDescuentos(): void {
    this.http.get<any[]>(`${environment.apiBaseUrl}/Descuentos/Listar`, {
    headers: {
      'X-Api-Key': environment.apiKey
    }
  }).subscribe(res => {
    this.descuentosExistentes = res;
  });
    };

escalas: {
  deEs_InicioEscala: number;
  deEs_FinEscala: number;
  deEs_Valor: number;
}[] = [
  {
    deEs_InicioEscala: 0,
    deEs_FinEscala: 0,
    deEs_Valor: 0
  }
];

agregarEscala() {
  this.escalas.push({
    deEs_InicioEscala: 0,
    deEs_FinEscala: 0,
    deEs_Valor: 0
  });
}

eliminarEscala(index: number) {
  this.escalas.splice(index, 1);
}

getClientesFiltrados(grupo: any): any[] {
  if (!grupo.filtro) return grupo.clientes;
  return grupo.clientes.filter((c: any) =>
    (c.clie_NombreComercial || c.clie_NombreCompleto || '')
      .toLowerCase()
      .includes(grupo.filtro.toLowerCase())
  );
}

alternarCliente(clienteId: number, checked: boolean): void {
 if (checked) {
    const conflicto = this.hayConflicto(clienteId);
    
    if (conflicto) {
      this.mostrarPopup("El cliente ya tiene un descuento vigente en alguno de los ítems seleccionados.");
      // Para forzar refresco del checkbox, ejecuta fuera del flujo actual:
      setTimeout(() => {
        this.clientesSeleccionados = this.clientesSeleccionados.filter(id => id !== clienteId);
      }, 0);
      return;
    }

    this.clientesSeleccionados.push(clienteId);
  } else {
    this.clientesSeleccionados = this.clientesSeleccionados.filter(id => id !== clienteId);
  }
}

onClickCheckbox(event: MouseEvent, clienteId: number) {
  const input = event.target as HTMLInputElement;
  const isChecked = input.checked;

  if (isChecked) {
    const conflicto = this.hayConflicto(clienteId);

    if (conflicto) {
      this.mostrarPopup("El cliente ya tiene un descuento vigente en alguno de los ítems seleccionados.");

      // Aquí revertimos el cambio visual con setTimeout
      setTimeout(() => {
        input.checked = false;  // Desmarca el checkbox
      }, 0);

      // También no agregamos al array
      return;
    }

    this.clientesSeleccionados.push(clienteId);
  } else {
    // Si estaba desmarcando, solo actualizar modelo
    this.clientesSeleccionados = this.clientesSeleccionados.filter(id => id !== clienteId);
  }
}


hayConflicto(clienteId: number): boolean {
  const hoy = new Date();
   let referenciasSeleccionadas: number[] = [];

  // Asignamos según el tipo de descuento
   switch (this.descuento.desc_Aplicar) {
    case 'P': // Productos
    case 'C': // Categorías
    case 'M': // Marcas
    case 'S': // Subcategorías
      referenciasSeleccionadas = this.seleccionados;
      break;
    default:
      return false;
  }

  // Filtrar descuentos del mismo tipo (P, C, M o S)
  const descuentosMismoTipo = this.descuentosExistentes.filter(
    d => d.desc_Aplicar === this.descuento.desc_Aplicar
  );

  // Verificar conflicto
  return descuentosMismoTipo.some(descuento => {
    const clientes: { id: number }[] = JSON.parse(descuento.clientes || '[]');
    const referencias: { id: number }[] = JSON.parse(descuento.referencias || '[]');

    const clienteIncluido = clientes.some(c => c.id === clienteId);
    const fechaInicio = new Date(descuento.desc_FechaInicio);
    const fechaFin = new Date(descuento.desc_FechaFin);
    const descuentoVigente = hoy >= fechaInicio && hoy <= fechaFin;

    if (!clienteIncluido || !descuentoVigente) return false;

    // Verificar si hay alguna referencia en común
    return referencias.some(ref => referenciasSeleccionadas.includes(ref.id));
  });
}

mostrarPopup(mensaje: string): void {
  this.mostrarAlertaWarning = true;
          this.mensajeWarning = mensaje || 'cliente utilizado en otro descuento';
          
          setTimeout(() => {
            this.mostrarAlertaWarning = false;
            this.mensajeWarning = '';
          }, 5000);
}

// Verificar si todos los clientes de un canal están seleccionados
estanTodosSeleccionados(grupo: any): boolean {
  return grupo.clientes.every((c: { clie_Id: number; }) => this.clientesSeleccionados.includes(c.clie_Id));
}

// Seleccionar/deseleccionar todos los clientes de un canal
seleccionarTodosClientes(grupo: any, seleccionar: boolean): void {
  grupo.clientes.forEach((cliente: { clie_Id: number; }) => {
    this.alternarCliente(cliente.clie_Id, seleccionar);
  });
}

get fechaInicioFormato(): string {
  return new Date(this.descuento.desc_FechaInicio).toISOString().split('T')[0];
}

set fechaInicioFormato(value: string) {
  this.descuento.desc_FechaInicio = new Date(value);
}

get fechaFinFormato(): string {
  return new Date(this.descuento.desc_FechaFin).toISOString().split('T')[0];
}

set fechaFinFormato(value: string) {
  this.descuento.desc_FechaFin = new Date(value);
}




tieneAyudante: boolean = false;
  


  descuentoOriginal = '';
  mostrarErrores = false;
  mostrarAlertaExito = false;
  mensajeExito = '';
  mostrarAlertaError = false;
  mensajeError = '';
  mostrarAlertaWarning = false;
  mensajeWarning = '';
  mostrarConfirmacionEditar = false;







 

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['descuentoData'] && changes['descuentoData'].currentValue) {
      this.descuento = { ...changes['descuentoData'].currentValue };
      const clientesLista = JSON.parse(this.descuento.clientes ?? '[]');
      const referenciasLista = JSON.parse(this.descuento.referencias ?? '[]');
      const escalasLista = JSON.parse(this.descuento.escalas ?? '[]');

      // Si solo necesitas los IDs
      const clientesIds = clientesLista.map((c: any) => c.id);
      const referenciasIds = referenciasLista.map((r: any) => r.id);
      this.escalas = escalasLista;
      this.clientesSeleccionados = clientesIds;
      this.seleccionados = referenciasIds;


      switch (this.descuento.desc_Aplicar) {
        case 'P':
          this.seccionVisible = 'productos';
          break;
        case 'C':
          this.seccionVisible = 'categorias';
          break;
        case 'S':
          this.seccionVisible = 'subcategorias';
          break;
        case 'M':
          this.seccionVisible = 'marcas';
          break;
      }
      this.descuento.desc_FechaInicio = new Date(this.descuento.desc_FechaInicio);
      this.descuento.desc_FechaFin = new Date(this.descuento.desc_FechaFin);
      this.descuentoOriginal = this.descuento.desc_Descripcion || '';
      this.mostrarErrores = false;
      this.cerrarAlerta();
  
    

    }
  }



  cancelar(): void {
    this.cerrarAlerta();
    this.mostrarErrores = false;
    this.mostrarAlertaExito = false;
    this.mensajeExito = '';
    this.mostrarAlertaError = false;
    this.mensajeError = '';
    this.mostrarAlertaWarning = false;
    this.mensajeWarning = '';
    this.descuento = {
       desc_Id:  0,
  desc_Descripcion:  '',
  desc_Tipo: false, 
  desc_Aplicar:  '',
  desc_FechaInicio:  new Date(),
  desc_FechaFin: new Date(),
  desc_Observaciones:  '',
  usua_Creacion:  0,
  desc_FechaCreacion:  new Date(),
  usua_Modificacion: 0,
  desc_FechaModificacion: new Date(),
  desc_Estado: false,
  usuarioCreacion:  '',
  usuarioModificacion: '',
  code_Status:  0,
  message_Status:''

    };
    this.seleccionados = [];
    this.clientesSeleccionados = [];
    this.escalas = [];
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
    !this.descuento.desc_Descripcion.trim() ||
    !this.descuento.desc_Aplicar.trim() ||
    !this.descuento.desc_FechaInicio ||
    !this.descuento.desc_FechaFin 
  ) {
    this.mostrarAlertaWarning = true;
    this.mensajeWarning = 'Por favor complete todos los campos requeridos antes de guardar.';
    setTimeout(() => this.cerrarAlerta(), 4000);
    return;
  }
  // Detectar cambios en los campos principales
  const cambios =
    this.descuento.desc_Descripcion.trim() !== (this.descuentoData?.desc_Descripcion?.trim() ?? '') ||
  this.descuento.desc_Tipo !== (this.descuentoData?.desc_Tipo) ||
  this.descuento.desc_Aplicar.trim() !== (this.descuentoData?.desc_Aplicar?.trim() ?? '') ||
  this.descuento.desc_FechaInicio !== (this.descuentoData?.desc_FechaInicio) ||
  this.descuento.desc_FechaFin !== (this.descuentoData?.desc_FechaFin) ||
  this.descuento.desc_Observaciones.trim() !== (this.descuentoData?.desc_Observaciones?.trim() ?? '') 

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

  public guardar(): void {
    this.mostrarErrores = true;

   if (this.descuento.desc_Aplicar.trim()) {
  const descuentoActualizar: any = {
    desc_Id: this.descuento.desc_Id,
    desc_Descripcion: this.descuento.desc_Descripcion.trim(),
    desc_Tipo: String(this.descuento.desc_Tipo) === 'true',
    desc_Aplicar: this.descuento.desc_Aplicar,
    desc_FechaInicio: new Date(this.descuento.desc_FechaInicio),
    desc_FechaFin: new Date(this.descuento.desc_FechaFin),
    desc_Observaciones: this.descuento.desc_Observaciones.trim(),
    usua_Creacion: this.descuento.usua_Creacion,
    desc_FechaCreacion: new Date(this.descuento.desc_FechaCreacion),
    usua_Modificacion: environment.usua_Id,
    desc_FechaModificacion: new Date(),
    desc_Estado: false,
    idClientes: this.clientesSeleccionados,
    idReferencias: this.seleccionados,
    escalas: '',
    clientes: '',
    referencias: '',
    escalas_Json: this.escalas

  };

  console.log('datos enviados', descuentoActualizar);


      this.http.put<any>(`${environment.apiBaseUrl}/Descuentos/Actualizar`, descuentoActualizar, {
        headers: {
          'X-Api-Key': environment.apiKey,
          'Content-Type': 'application/json',
          'accept': '*/*'
        }
      }).subscribe({
        next: (response) => {
          this.mensajeExito = `El Descuento "${this.descuento.desc_Aplicar}" actualizado exitosamente`;
          this.mostrarAlertaExito = true;
          this.mostrarErrores = false;

          setTimeout(() => {
            this.mostrarAlertaExito = false;
            this.onSave.emit(this.descuento);
            this.cancelar();
          }, 3000);
        },
        error: (error) => {
          console.error('Error al actualizar la Descuento:', error);
          this.mostrarAlertaError = true;
          this.mensajeError = 'Error al actualizar la Descuento. Por favor, intente nuevamente.';
          setTimeout(() => this.cerrarAlerta(), 5000);
        }
      });
    } else {
      this.mostrarAlertaWarning = true;
      this.mensajeWarning = 'Por favor complete todos los campos requeridos antes de guardar.';
      setTimeout(() => this.cerrarAlerta(), 4000);
    }
  }

  validarPasoActual(): boolean {
  switch (this.cdkStepper.selectedIndex) {
    case 0: // Información general
      return this.validarPasoInformacionGeneral();
    case 1: // Aplica para
      return this.seleccionados.length > 0;
    case 2: // Clientes
      return this.clientesSeleccionados.length > 0;
    case 3: // Escalas
      return this.validarEscalas();
    default:
      return false;
  }
}

validarPasoInformacionGeneral(): boolean {
  const d = this.descuento;

  return !!d.desc_Descripcion?.trim() &&
         d.desc_Tipo !== null &&
         !!d.desc_FechaInicio &&
         !!d.desc_FechaFin;
}

validarEscalas(): boolean {
  return this.escalas.every(e =>
    e.deEs_InicioEscala != null &&
    e.deEs_FinEscala != null &&
    e.deEs_Valor != null
  );
}

irAlSiguientePaso() {
  this.mostrarErrores = true;

  if (this.validarPasoActual()) {
    this.mostrarErrores = false;
    this.cdkStepper.next();
  } else {
    // Podrías mostrar una alerta o dejar que los mensajes de error visibles lo indiquen
  }
}

}
