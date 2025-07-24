import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Producto } from 'src/app/Modelos/inventario/Producto.Model';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent {
  @Output() onCancel = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<any>();

  mostrarOverlayCarga = false;
  mostrarErrores = false;
  mostrarAlertaExito = false;
  mensajeExito = '';
  mostrarAlertaError = false;
  mensajeError = '';
  mostrarAlertaWarning = false;
  mensajeWarning = '';

  subcategorias: any[] = [];
  marcas: any[] = [];
  proveedores: any[] = [];
  impuestos: any[] = [];

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
    prod_PromODesc: 0,
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
    secuencia: 0,
    code_Status: 0,
    message_Status: '',
  };

  constructor(private http: HttpClient) {
    this.cargarMarcas();
    this.cargarProveedores();
    this.cargarImpuestos();
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

  cancelar(): void {
    this.mostrarErrores = false;
    this.mostrarAlertaExito = false;
    this.mensajeExito = '';
    this.mostrarAlertaError = false;
    this.mensajeError = '';
    this.mostrarAlertaWarning = false;
    this.mensajeWarning = '';
    this.producto = {
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
      prod_PromODesc: 0,
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
      secuencia: 0,
      code_Status: 0,
      message_Status: '',
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
    if (this.producto.prod_Codigo.trim() && this.producto.prod_Descripcion.trim() && this.producto.prod_DescripcionCorta.trim() && this.producto.marc_Id && this.producto.prov_Id && this.producto.subc_Id
      && this.producto.prod_PrecioUnitario.toFixed(2) && this.producto.prod_CostoTotal.toFixed(2) && this.producto.prod_PagaImpuesto.trim())
    {
      this.mostrarAlertaWarning = false;
      this.mostrarAlertaError = false;
      const productoGuardar = {
        prod_Id: 0,
        prod_Codigo: this.producto.prod_Codigo.trim(),
        prod_CodigoBarra: this.producto.prod_CodigoBarra,
        prod_Descripcion: this.producto.prod_Descripcion.trim(),
        prod_DescripcionCorta: this.producto.prod_DescripcionCorta.trim(),
        prod_imagen: this.producto.prod_Imagen,
        subc_Id: this.producto.subc_Id,
        marc_Id: this.producto.marc_Id,
        prov_Id: this.producto.prov_Id,
        impu_Id: this.producto.impu_Id,
        prod_PrecioUnitario: this.producto.prod_PrecioUnitario,
        prod_CostoTotal: this.producto.prod_CostoTotal,
        prod_PagaImpuesto: this.producto.prod_PagaImpuesto,
        prod_PromODesc: this.producto.prod_PromODesc,
        prod_EsPromo: this.producto.prod_EsPromo,
        prod_Estado: true,
        usua_Creacion: environment.usua_Id,
        prod_FechaCreacion: new Date().toISOString(),
        secuencia: 0,
      };
      this.http.post<any>(`${environment.apiBaseUrl}/Producto/Guardar`, productoGuardar, {
        headers: { 'x-api-key': environment.apiKey }
      }).subscribe(
        response => {
          this.mostrarAlertaExito = true;
          this.mensajeExito = 'Producto guardado exitosamente.';
          this.onSave.emit(response);
          this.cancelar();
        },
        error => {
          console.error('Error al guardar el producto:', error);
          this.mostrarAlertaError = true;
          this.mensajeError = 'Error al guardar el producto. Intente nuevamente.';
        }
      );
    }
  }
}