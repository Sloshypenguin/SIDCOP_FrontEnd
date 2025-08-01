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
  mostrarOverlayCarga = false;
  @Input() productoData: Producto | null = null;
  @Output() onCancel = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<Producto>();

  subcategorias: Categoria[] = [];
  categorias: any[] = [];
  subcategoriasFiltradas: Categoria[] = [];
  categoriaSeleccionada: number = 0;
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

  productoOriginal: any = {};
  imagenSeleccionada = false;
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
      // Obtener descripción de marca a partir del id al cargar producto
      const marcaActual = this.marcas.find(m => m.marc_Id === this.producto.marc_Id);
      this.producto.marc_Descripcion = marcaActual ? marcaActual.marc_Descripcion : '';
      const proveedorActual = this.proveedores.find(p => p.prov_Id === this.producto.prov_Id);
      this.producto.prov_NombreEmpresa = proveedorActual ? proveedorActual.prov_NombreEmpresa : '';
      this.productoOriginal = { ...this.productoData };
      this.mostrarErrores = false;
      this.cerrarAlerta();
      this.producto.prod_EsPromo = this.producto.prod_EsPromo || 'N';
      this.producto.prod_PagaImpuesto = this.producto.prod_PagaImpuesto || 'N';
      this.producto.impu_Id = this.producto.impu_Id || 0;
      this.cargarCategorias();
    }
  }
  
  onMarcaChange(event: any) {
    const selectedId = +event.target.value;
    const marcaSeleccionada = this.marcas.find(m => m.marc_Id === selectedId);
    if (marcaSeleccionada) {
      this.producto.marc_Descripcion = marcaSeleccionada.marc_Descripcion;
    } else {
      this.producto.marc_Descripcion = '';
    }
  }

  onProveedorChange(event: any) {
    const selectedId = +event.target.value;
    const proveedorSeleccionado = this.proveedores.find(p => p.prov_Id === selectedId);
    if (proveedorSeleccionado) {
      this.producto.prov_NombreEmpresa = proveedorSeleccionado.prov_NombreEmpresa;
    } else {
      this.producto.prov_NombreEmpresa = '';
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
    }).subscribe(data => {
      this.categorias = data;
      this.cargarSubcategorias();
    }, error => {
        console.error('Error al cargar las categorías:', error);
      }
    );
  }

  cargarSubcategorias() {
    this.http.get<Categoria[]>(`${environment.apiBaseUrl}/Subcategoria/Listar`, {
      headers: { 'x-api-key': environment.apiKey }
    }).subscribe(data => {
      this.subcategorias = data;
      if (this.producto.subc_Id) {
        // Si existe subc_Id, asignamos la categoría relacionada a esa subcategoría
        const subcategoriaActual = this.subcategorias.find(s => s.subc_Id === this.producto.subc_Id);
        if (subcategoriaActual) {
          this.categoriaSeleccionada = subcategoriaActual.cate_Id;
        } else {
          this.categoriaSeleccionada = 0;
        }
        // Llamamos a filtrar subcategorías por categoría seleccionada
        this.filtrarSubcategoriasPorCategoria(this.categoriaSeleccionada);
      }
    }, error => {
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
      this.subcategoriasFiltradas = response.data;
      console.log('Subcategorías filtradas:', this.subcategoriasFiltradas);
      // this.producto.subc_Id = 0; // Reset subcategory selection
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

  obtenerListaCambios(): any[] {
    return Object.values(this.cambiosDetectados);
  }

  cambiosDetectados: any = {};

  hayDiferencias(): boolean {
    const a = this.producto;
    const b = this.productoOriginal;
    this.cambiosDetectados = {};

    // Verificar cada campo y almacenar los cambios
    if (a.prod_Codigo !== b.prod_Codigo) {
      this.cambiosDetectados.codigo = {
        anterior: b.prod_Codigo,
        nuevo: a.prod_Codigo,
        label: 'Código del Producto'
      };
    }

    if (a.prod_CodigoBarra !== b.prod_CodigoBarra) {
      this.cambiosDetectados.codigoBarra = {
        anterior: b.prod_CodigoBarra,
        nuevo: a.prod_CodigoBarra,
        label: 'Código de Barras'
      };
    }

    if (a.prod_Descripcion !== b.prod_Descripcion) {
      this.cambiosDetectados.descripcion = {
        anterior: b.prod_Descripcion,
        nuevo: a.prod_Descripcion,
        label: 'Descripción del Producto'
      };
    }

    if (a.prod_DescripcionCorta !== b.prod_DescripcionCorta) {
      this.cambiosDetectados.descripcionCorta = {
        anterior: b.prod_DescripcionCorta,
        nuevo: a.prod_DescripcionCorta,
        label: 'Descripción Corta del Producto'
      };
    }

    if (a.marc_Id !== b.marc_Id) {
      this.cambiosDetectados.marca = {
        anterior: b.marc_Descripcion,
        nuevo: a.marc_Descripcion,
        label: 'Marca'
      };
    }

    if (a.prov_Id !== b.prov_Id) {
      this.cambiosDetectados.proveedor = {
        anterior: b.prov_NombreEmpresa,
        nuevo: a.prov_NombreEmpresa,
        label: 'Proveedor'
      };
    }

    if (a.prod_PrecioUnitario !== b.prod_PrecioUnitario) {
      this.cambiosDetectados.precioUnitario = {
        anterior: b.prod_PrecioUnitario,
        nuevo: a.prod_PrecioUnitario,
        label: 'Precio Unitario'
      };
    }

    if (a.prod_CostoTotal !== b.prod_CostoTotal) {
      this.cambiosDetectados.costoTotal = {
        anterior: b.prod_CostoTotal,
        nuevo: a.prod_CostoTotal,
        label: 'Costo Total'
      };
    }

    if (a.subc_Id !== b.subc_Id) {
      const subcategoriaAnterior = this.subcategorias.find(c => c.subc_Id === b.subc_Id);
      const subcategoriaNueva = this.subcategorias.find(c => c.subc_Id === a.subc_Id);
      
      this.cambiosDetectados.subcategorias = {
        anterior: subcategoriaAnterior ? `${subcategoriaAnterior.subC_Descripcion}` : 'No seleccionada',
        nuevo: subcategoriaNueva ? `${subcategoriaNueva.subC_Descripcion}` : 'No seleccionada',
        label: 'Subcategoría'
      };
    }

    if (a.prod_Imagen !== b.prod_Imagen) {
      this.cambiosDetectados.imagen = {
        anterior: b.prod_Imagen ? 'Imagen actual' : 'Sin imagen',
        nuevo: a.prod_Imagen ? 'Nueva imagen' : 'Sin imagen',
        label: 'Imagen del Producto'
      };
    }

    return Object.keys(this.cambiosDetectados).length > 0;
  }

  validarEdicion(): void {
    this.mostrarErrores = true;

    if (
      this.producto.prod_Codigo.trim() &&
      this.producto.prod_Descripcion.trim() &&
      this.producto.prod_DescripcionCorta.trim() &&
      this.producto.subc_Id &&
      this.producto.marc_Id &&
      this.producto.prov_Id &&
      this.producto.prod_PrecioUnitario != null &&
      this.producto.prod_CostoTotal != null &&
      this.producto.prod_PrecioUnitario >= 0 &&
      this.producto.prod_CostoTotal >= 0 &&
      this.producto.prod_PrecioUnitario >= this.producto.prod_CostoTotal
    ) {
      // const hayCambios = 
      //   this.producto.prod_Imagen !== this.productoData?.prod_Imagen ||
      //   this.producto.prod_Codigo.trim() !== this.productoData?.prod_Codigo?.trim() ||
      //   this.producto.prod_Descripcion.trim() !== this.productoData?.prod_Descripcion?.trim() ||
      //   this.producto.prod_DescripcionCorta.trim() !== this.productoData?.prod_DescripcionCorta?.trim() ||
      //   this.producto.subc_Id !== this.productoData?.subc_Id ||
      //   this.producto.marc_Id !== this.productoData?.marc_Id ||
      //   this.producto.prov_Id !== this.productoData?.prov_Id ||
      //   this.producto.prod_PrecioUnitario !== this.productoData?.prod_PrecioUnitario ||
      //   this.producto.prod_CostoTotal !== this.productoData?.prod_CostoTotal
      if (this.hayDiferencias()) {
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

  private guardar(): void {
    this.mostrarErrores = true;

    if (
      this.producto.prod_Codigo.trim() &&
      this.producto.prod_Descripcion.trim() &&
      this.producto.prod_DescripcionCorta.trim() &&
      this.producto.subc_Id &&
      this.producto.marc_Id &&
      this.producto.prov_Id &&
      this.producto.prod_PrecioUnitario != null &&
      this.producto.prod_CostoTotal != null &&
      this.producto.prod_PrecioUnitario >= 0 &&
      this.producto.prod_CostoTotal >= 0 &&
      this.producto.prod_PrecioUnitario >= this.producto.prod_CostoTotal
    ) {
      const productoActualizar = {
        ...this.producto,
        usua_Modificacion: getUserId(),
        prod_FechaModificacion: new Date()
      }

      if (this.producto.prod_PagaImpuesto === 'S' && !this.producto.impu_Id) {
        this.mostrarAlertaWarning = true;
        this.mensajeWarning = 'Debe seleccionar un impuesto si el producto paga impuesto.';
        setTimeout(() => this.cerrarAlerta(), 4000);
        return;
      }

      this.mostrarOverlayCarga = true;
      this.http.put<any>(`${environment.apiBaseUrl}/Productos/Actualizar`, productoActualizar, {
        headers: {
          'X-Api-Key': environment.apiKey,
          'Content-Type': 'application/json',
          'accept': '*/*'
        }
      }).subscribe({
        next: (response) => {
          this.mostrarOverlayCarga = false;
          if (response?.data?.code_Status === 1) {
            this.mensajeExito = response.data.message_Status || `Producto "${this.producto.prod_DescripcionCorta}" actualizado exitosamente`;
            this.mostrarAlertaExito = true;
            this.mostrarErrores = false;

            setTimeout(() => {
              this.mostrarAlertaExito = false;
              this.onSave.emit(this.producto);
              this.cancelar();
            }, 3000);
          } else {
            this.mostrarAlertaError = true;
            this.mensajeError = response?.data?.message_Status || 'No se pudo actualizar el producto.';
            this.mostrarAlertaExito = false;

            setTimeout(() => {
              this.mostrarAlertaError = false;
              this.mensajeError = '';
            }, 5000);
          }
        },
        error: (error) => {
          this.mostrarOverlayCarga = false;
          this.mostrarAlertaError = true;
          this.mensajeError = error?.error?.data?.message_Status || 'Error al actualizar el producto. Por favor, intente nuevamente.';
          this.mostrarAlertaExito = false;
          setTimeout(() => this.cerrarAlerta(), 5000);
        }
      });
    } else {
      this.mostrarAlertaWarning = true;
      this.mensajeWarning = 'Por favor complete todos los campos requeridos antes de guardar.';
      setTimeout(() => this.cerrarAlerta(), 4000);
    }
  }

  onImagenSeleccionada1(event: any) {
    // Obtenemos el archivo seleccionado desde el input tipo file
    const file = event.target.files[0];

    if (file) {
      // para enviar la imagen a Cloudinary
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'subidas_usuarios');
      //Subidas usuarios Carpeta identificadora en Cloudinary
      //dwiprwtmo es el nombre de la cuenta de Cloudinary
      const url = 'https://api.cloudinary.com/v1_1/dbt7mxrwk/upload';

      
      fetch(url, {
        method: 'POST',
        body: formData
      })
      .then(response => response.json())
      .then(data => {
        this.producto.prod_Imagen = data.secure_url;
      })
      .catch(error => {
        console.error('Error al subir la imagen a Cloudinary:', error);
      });
    }
  }

  onImgError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = 'assets/images/users/32/agotado.png';
  }
} 