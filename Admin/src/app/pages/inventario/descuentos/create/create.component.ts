import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Vendedor } from 'src/app/Modelos/venta/Vendedor.Model';
import { Descuento } from 'src/app/Modelos/inventario/DescuentoModel';
import { DescuentoDetalle } from 'src/app/Modelos/inventario/DescuentoDetalleModel';
import { DescuentoPorCliente } from 'src/app/Modelos/inventario/DescuentoPorClienteModel';
import { DescuentoPorEscala } from 'src/app/Modelos/inventario/DescuentoPorEscalaModel';
import { environment } from 'src/environments/environment';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { NgSelectModule } from '@ng-select/ng-select';



@Component({
  selector: 'app-create',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule,  NgxMaskDirective, NgSelectModule],
   providers: [provideNgxMask()],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent  {
  @Output() onCancel = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<Descuento>();
  
  mostrarErrores = false;
  mostrarAlertaExito = false;
  mensajeExito = '';
  mostrarAlertaError = false;
  mensajeError = '';
  mostrarAlertaWarning = false;
  mensajeWarning = '';
  seccionVisible: string | null = null;
  filtro: string = '';
  seleccionados: number[] = [];
  clientesAgrupados: { canal: string, clientes: any[] }[] = [];
clientesSeleccionados: number[] = [];

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
  message_Status:''
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

alternarCliente(clie_Id: number, seleccionado: boolean): void {
  if (seleccionado) {
    if (!this.clientesSeleccionados.includes(clie_Id)) {
      this.clientesSeleccionados.push(clie_Id);
    }
  } else {
    this.clientesSeleccionados = this.clientesSeleccionados.filter(id => id !== clie_Id);
  }
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




tieneAyudante: boolean = false;
  

  cancelar(): void {
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

  guardar(): void {
  this.mostrarErrores = true;

  if (
    this.descuento.desc_Descripcion.trim() &&
     this.descuento.desc_Aplicar.trim() &&
    this.descuento.desc_FechaInicio && this.descuento.desc_FechaFin 
  ) {
    this.mostrarAlertaWarning = false;
    this.mostrarAlertaError = false;

    // Construir el objeto para guardar
    const DescuentoGuardar: any = {
      desc_Id:  0,
      desc_Descripcion:  this.descuento.desc_Descripcion,
      desc_Tipo: this.descuento.desc_Tipo, 
      desc_Aplicar: this.descuento.desc_Aplicar,
      desc_FechaInicio:  new Date(this.descuento.desc_FechaInicio) ,
      desc_FechaFin: new Date(this.descuento.desc_FechaFin),
      desc_Observaciones:  '',
      usua_Creacion:  environment.usua_Id,
      desc_FechaCreacion:  new Date(),
      usua_Modificacion: 0,
      desc_FechaModificacion: new Date(),
      desc_Estado: false,
      usuarioCreacion:  '',
      usuarioModificacion: '',

    };

    // Solo agregar vend_Ayudante si tieneAyudante es true
    if (this.descuento.desc_Observaciones) {
      DescuentoGuardar.desc_Observaciones = this.descuento.desc_Observaciones;
    }

    console.log('Guardando Vendedor:', DescuentoGuardar);

    this.http.post<any>(`${environment.apiBaseUrl}/Descuentos/Insertar`, DescuentoGuardar, {
      headers: {
        'X-Api-Key': environment.apiKey,
        'Content-Type': 'application/json',
        'accept': '*/*'
      }
    }).subscribe({
      next: (response) => {
        console.log('Vendedor guardado exitosamente:', response);
        if(response?.data?.code_Status <= 0)
        {
          this.mostrarAlertaError = true;
          this.mensajeError = 'Error al guardar el Descuento. Por favor, intente nuevamente.';
          this.mostrarAlertaExito = false;

          setTimeout(() => {
            this.mostrarAlertaError = false;
            this.mensajeError = '';
          }, 5000);
          
        }

          this.descuentoDetalle.desc_Id = response.data.code_Status;
          this.descuentoPorCliente.desc_Id = response.data.code_Status;
          this.descuentoPorEscala.desc_Id = response.data.code_Status;

          const DescuentoDetalleGuardar: any = {
          desc_Id:  this.descuentoDetalle.desc_Id,
          idReferencias:  this.descuentoDetalle.idReferencias,
          usua_Creacion:  environment.usua_Id,
          desD_FechaCreacion:  new Date(),
          desD_Id:  0,
          desD_IdReferencia: 0,
          usua_Modificacion: 0,
          desD_FechaModificacion: new Date(),
          desD_Estado: false,
          usuarioCreacion:  '',
          usuarioModificacion: '',
          };

          const DescuentoPorClienteGuardar: any = {
          desc_Id:  this.descuentoPorCliente.desc_Id,
          idClientes:  this.clientesSeleccionados,
          usua_Creacion:  environment.usua_Id,
          deEs_FechaCreacion:  new Date(),
          deCl_Id:  0,
          clie_Id: 0, 
          usua_Modificacion: 0,
          deEs_FechaModificacion: new Date(),
          deCl_Estado: false,
          usuarioCreacion:  '',
          usuarioModificacion: '',
          };

          const DescuentoPorEscalaGuardar: any = {
          desc_Id:  this.descuentoPorEscala.desc_Id,
          escalas:  this.escalas,
          usua_Creacion:  environment.usua_Id,
          deEs_FechaCreacion:  new Date(),
          deEs_Id:  0,
          deEs_InicioEscala: 0, 
          deEs_FinEscala: 0, 
          deEs_Valor: 0, 
          escalas_JSON: '',
          usua_Modificacion: 0,
          deEs_FechaModificacion: new Date(),
          deEs_Estado: false,
          usuarioCreacion:  '',
          usuarioModificacion: '',
          };

          this.http.post<any>(`${environment.apiBaseUrl}/Descuentos/InsertarDetalle`, DescuentoDetalleGuardar, {
            headers: {
              'X-Api-Key': environment.apiKey,
              'Content-Type': 'application/json',
              'accept': '*/*'
            }
            }).subscribe({
                next: (response) => {
              if(response?.data?.code_Status <= 0)
              {
                this.mostrarAlertaError = true;
                this.mensajeError = 'Error al guardar el Descuento. Por favor, intente nuevamente.';
                this.mostrarAlertaExito = false;

                setTimeout(() => {
                  this.mostrarAlertaError = false;
                  this.mensajeError = '';
                }, 5000);
                
              }
              this.http.post<any>(`${environment.apiBaseUrl}/Descuentos/InsertarDetalleCliente`, DescuentoPorClienteGuardar, {
                  headers: {
                    'X-Api-Key': environment.apiKey,
                    'Content-Type': 'application/json',
                    'accept': '*/*'
                  }
                }).subscribe({
                    next: (response) => {
                  if(response?.data?.code_Status <= 0)
                  {
                    this.mostrarAlertaError = true;
                    this.mensajeError = 'Error al guardar el Descuento. Por favor, intente nuevamente.';
                    this.mostrarAlertaExito = false;

                    setTimeout(() => {
                      this.mostrarAlertaError = false;
                      this.mensajeError = '';
                    }, 5000);
                    
                  }
                  this.http.post<any>(`${environment.apiBaseUrl}/Descuentos/InsertarDetalleEscala`, DescuentoPorEscalaGuardar, {
                    headers: {
                      'X-Api-Key': environment.apiKey,
                      'Content-Type': 'application/json',
                      'accept': '*/*'
                    }
                  }).subscribe({
                      next: (response) => {
                    if(response?.data?.code_Status <= 0)
                    {
                      this.mostrarAlertaError = true;
                      this.mensajeError = 'Error al guardar el Descuento. Por favor, intente nuevamente.';
                      this.mostrarAlertaExito = false;

                      setTimeout(() => {
                        this.mostrarAlertaError = false;
                        this.mensajeError = '';
                      }, 5000);
                      
                    }
                  


                    }},

                  )
                


                  }},

              )
            


              }},
            )

            
        
      },
      error: (error) => {
        console.error('Error al guardar Vendedor:', error);
        this.mostrarAlertaError = true;
        this.mensajeError = 'Error al guardar el Vendedor. Por favor, intente nuevamente.';
        this.mostrarAlertaExito = false;

        setTimeout(() => {
          this.mostrarAlertaError = false;
          this.mensajeError = '';
        }, 5000);
      }
    });
  } else {
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
