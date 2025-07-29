import { Component, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Producto } from 'src/app/Modelos/inventario/Producto.Model';
import { Categoria } from 'src/app/Modelos/inventario/CategoriaModel';
import { environment } from 'src/environments/environment.prod';
import { getUserId } from 'src/app/core/utils/user-utils';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class EditComponent implements OnChanges {
  @Input() productoData: Producto | null = null;
  @Output() onCancel = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<Producto>();

  subcategorias: Categoria[] = [];
    categorias: any[] = [];
    subcategoriasFiltradas: Categoria[] = [];
    categoriaseleccionada: any[] = [];
    marcas: any[] = [];
    proveedores: any[] = [];
    impuestos: any[] = [];
  
    categoria: Categoria = {
      cate_Id: 0,
      cate_Descripcion: '',
      cate_Estado: true,
      cate_FechaCreacion: new Date(),
      cate_FechaModificacion: new Date(),
      usua_Creacion: 0, 
      usua_Modificacion: 0,
      code_Status: 0,
      subc_Id: 0,
      subC_Descripcion: '',
      usuarioCreacion: '',
      usuarioModificacion: '',
      message_Status: ''
    }

  producto: Producto = {
    prod_Id: 0,
    prod_Codigo: '',
    prod_CodigoBarra: '',
    prod_Descripcion: '',
    prod_DescripcionCorta: '',
    prod_Imagen: 'assets/images/users/32/agotado.png',
    cate_Id: 0,
    cate_Descripcion: '',
    subc_Id: 0,
    marc_Id: 0,
    prov_Id: 0,
    impu_Id: 0,
    prod_PrecioUnitario: 0,
    prod_CostoTotal: 0,
    prod_PagaImpuesto: "",
    prod_EsPromo: "",
    prod_Estado: true,
    usua_Creacion: 0,
    prod_FechaCreacion: new Date(),
    usua_Modificacion: 0,
    prod_FechaModificacion: new Date(),
    marc_Descripcion: '',
    prov_NombreEmpresa: '',
    subc_Descripcion: '',
    impu_Descripcion: '',
    promDesc: '',
    secuencia: 0,
    code_Status: 0,
    message_Status: '',
  };

  productoOriginal = '';
  mostrarErrores = false;
  mostrarAlertaExito = false;
  mensajeExito = '';
  mostrarAlertaError = false;
  mensajeError = '';
  mostrarAlertaWarning = false;
  mensajeWarning = '';
  mostrarConfirmacionEditar = false;

  constructor(private http: HttpClient) {
    this.cargarMarcas();
    this.cargarProveedores();
    this.cargarImpuestos();
  }

  precioFormatoValido: boolean = true;
  precioValido: boolean = true;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['productoData'] && changes['productoData'].currentValue) {
      this.producto = { ...changes['productoData'].currentValue };
      this.productoOriginal = this.producto.prod_Descripcion || '';
      this.mostrarErrores = false;
      this.cerrarAlerta();
      this.producto.prod_EsPromo = this.producto.prod_EsPromo || 'N';
      this.producto.prod_PagaImpuesto = this.producto.prod_PagaImpuesto || 'N';
      this.producto.impu_Id = this.producto.impu_Id || 0;
      this.cargarCategorias();
      this.cargarSubcategorias(); // si usas todo el listado para algo
      if (this.categoria.cate_Id) {
        this.filtrarSubcategoriasPorCategoria(this.categoria.cate_Id);
      }
    }
  }
  validarPrecioUnitario() {
    const valor = this.producto.prod_PrecioUnitario;
    // Convertir a string para validar con regex
    const valorStr = valor?.toString() || "";
    // Validar si el valor cumple el formato 10 enteros + 2 decimales
    const regex = /^\d{1,10}(\.\d{1,2})?$/;

    this.precioFormatoValido = regex.test(valorStr);
    this.precioValido = !valor && this.precioFormatoValido && Number(valor) > 8.20;
  }

  onPagaImpuestoChange() {
    if (!this.producto.prod_PagaImpuesto) {
      this.producto.impu_Id = 0;
    }
  }

  onCategoriaChange(event: any) {
    const categoriaId = this.producto.cate_Id;
    if (categoriaId === undefined || categoriaId === 0) {
      this.subcategoriasFiltradas = [];
      this.producto.subc_Id = 0;
      return;
    }
    console.log('Filtrando subcategorías para categoría:', categoriaId);
    this.filtrarSubcategoriasPorCategoria(categoriaId);
  }

  cargarMarcas() {
    this.http.get<any[]>(`${environment.apiBaseUrl}/Marcas/Listar`, {
      headers: { 'x-api-key': environment.apiKey }
    }).subscribe(data => {this.marcas = data;},
      error => {
        console.error('Error al cargar las marcas:', error);
      }
    );
  }

  cargarProveedores() {
    this.http.get<any[]>(`${environment.apiBaseUrl}/Proveedor/Listar`, {
      headers: { 'x-api-key': environment.apiKey }
    }).subscribe(data => {this.proveedores = data;},
      error => {
        console.error('Error al cargar los proveedores:', error);
      }
    );
  }

  cargarImpuestos() {
    this.http.get<any[]>(`${environment.apiBaseUrl}/Impuestos/Listar`, {
      headers: { 'x-api-key': environment.apiKey }
    }).subscribe(data => {this.impuestos = data;},
      error => {
        console.error('Error al cargar los impuestos:', error);
      }
    );
  }

  cargarCategorias() {
    this.http.get<any[]>(`${environment.apiBaseUrl}/Categorias/Listar`, {
      headers: { 'x-api-key': environment.apiKey }
    }).subscribe(data => {this.categorias = data;}, 
      error => {
        console.error('Error al cargar las categorías:', error);
      }
    );
  }

  cargarSubcategorias() {
    this.http.get<Categoria[]>(`${environment.apiBaseUrl}/Subcategoria/Listar`, {
      headers: { 'x-api-key': environment.apiKey }
    }).subscribe(data => {this.subcategorias = data;}, 
      error => {
        console.error('Error al cargar las subcategorías:', error);
      }
    ); 
  }

  isCargandoSubcategorias: boolean = false;

  filtrarSubcategoriasPorCategoria(categoriaId: number) {
    console.log('Filtrando subcategorías para categoría:', categoriaId);
    if (!categoriaId) {
      this.subcategoriasFiltradas = [];
      this.producto.subc_Id = 0;
      this.isCargandoSubcategorias = false;
      return;
    }
    this.isCargandoSubcategorias = true; // comienza carga  
    const categoriaBuscar: Categoria = {
      cate_Id: categoriaId,
      cate_Descripcion: '',
      cate_Estado: true,
      cate_FechaCreacion: new Date(),
      cate_FechaModificacion: new Date(),
      usua_Creacion: 0, 
      usua_Modificacion: 0,
      code_Status: 0,
      subc_Id: 0,
      subC_Descripcion: '',
      usuarioCreacion: '',
      usuarioModificacion: '',
      message_Status: ''
    }
    this.http.post<{data: Categoria[]}>(`${environment.apiBaseUrl}/Categorias/FiltrarSubcategorias`, categoriaBuscar, {
      headers: { 
          'X-Api-Key': environment.apiKey,
          'Content-Type': 'application/json',
          'accept': '*/*'
        }
    }).subscribe(response  => {
      console.log('Subcategorías recibidas:', response);
      this.subcategoriasFiltradas = response.data;
      console.log('Subcategorías filtradas:', this.subcategoriasFiltradas);
      this.producto.subc_Id = 0; // Reset subcategory selection
      this.isCargandoSubcategorias = false; // terminó carga
    }, error => {
      console.error('Error al filtrar subcategorías por categoría:', error);
      this.subcategoriasFiltradas = [];
      this.isCargandoSubcategorias = false; // error, pero terminó carga
    });
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

    const camposRequeridos = [
      this.producto.prod_Codigo.trim(),
      this.producto.prod_Descripcion.trim(),
      this.producto.prod_DescripcionCorta.trim(),
      this.producto.prod_CostoTotal > 0,
    ];

    if (camposRequeridos.every(Boolean)) {
      if (this.producto.prod_Descripcion.trim() !== this.productoOriginal) {
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

  guardar(): void {
    this.mostrarErrores = true;

    const camposRequeridos = [
      this.producto.prod_Codigo.trim(),
      this.producto.prod_Descripcion.trim(),
      this.producto.prod_DescripcionCorta.trim(),
      this.producto.prod_CostoTotal > 0,
      this.producto.prod_PrecioUnitario >= 0,
      this.producto.prod_PrecioUnitario >= this.producto.prod_CostoTotal,
      this.producto.prod_Estado,
      this.producto.subc_Id > 0,
      this.producto.marc_Id > 0,
      this.producto.prov_Id > 0
    ];

    if (camposRequeridos.every(Boolean)) {
      this.producto.usua_Modificacion = getUserId();
      this.producto.prod_FechaModificacion = new Date();
      
      // Validar impuesto solo si paga impuesto
      if (this.producto.prod_PagaImpuesto === 'S' && !this.producto.impu_Id) {
        this.mostrarAlertaWarning = true;
        this.mensajeWarning = 'Debe seleccionar un impuesto si el producto paga impuesto.';
        setTimeout(() => this.cerrarAlerta(), 4000);
        return;
      }

      this.http.put(`${environment.apiBaseUrl}/Productos/Actualizar`, this.producto)
        .subscribe({
          next: (response) => {
            this.mostrarAlertaExito = true;
            this.mensajeExito = 'Producto actualizado exitosamente';
            setTimeout(() => {
              this.onSave.emit(this.producto);
              this.cerrarAlerta();
            }, 2000);
          },
          error: (error) => {
            this.mostrarAlertaError = true;
            this.mensajeError = error.error?.message || 'Error al actualizar el producto';
            setTimeout(() => this.cerrarAlerta(), 4000);
          }
        });
    }
  }

  onImagenSeleccionada(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      
      reader.onload = (e) => {
        this.producto.prod_Imagen = e.target?.result as string;
      };
      
      reader.readAsDataURL(file);
    }
  }
} 