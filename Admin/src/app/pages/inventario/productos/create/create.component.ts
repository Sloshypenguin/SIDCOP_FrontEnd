import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Usuario } from 'src/app/Modelos/acceso/usuarios.Model';

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

  usuario: Usuario = {
    secuencia: 0,
    usua_Id: 0,
    usua_Usuario: '',
    usua_Clave: '',
    role_Id: 0,
    usua_IdPersona: 0,
    usua_EsVendedor: false,
    usua_EsAdmin: false,
    usua_Imagen: 'assets/images/users/32/user-dummy-img.jpg',
    usua_Creacion: 0,
    usua_FechaCreacion: new Date(),
    usua_Modificacion: 0,
    usua_FechaModificacion: new Date(),
    usua_Estado: true,
    permisosJson: '',
    role_Descripcion: '',
    nombreCompleto: '',
    code_Status: 0,
    message_Status: '',
  };

  constructor(private http: HttpClient) {
    this.cargarMarcas();
    // this.cargarProveedores();
    // this.cargarImpuestos();
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
}