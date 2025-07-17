import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-create-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent {
  @Output() onCancel = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<any>();

  mostrarErrores = false;
  mostrarAlertaExito = false;
  mensajeExito = '';
  mostrarAlertaError = false;
  mensajeError = '';
  mostrarAlertaWarning = false;
  mensajeWarning = '';

  roles: any[] = [];
  empleados: any[] = [];
  vendedores: any[] = [];

  usuario: any = {
    usua_Usuario: '',
    usua_Clave: '',
    role_Id: '',
    usua_IdPersona: '',
    usua_EsVendedor: 0,
    usua_EsAdmin: false,
    usua_Imagen: 'https://res.cloudinary.com/dwiprwtmo/image/upload/v1746503950/wzivrxowirdm6eg5hfbo.jpg',
    usua_Creacion: environment.usua_Id,
    usua_FechaCreacion: new Date().toISOString()
  };

  constructor(private http: HttpClient) {
    this.cargarRoles();
    this.cargarEmpleados();
    this.cargarVendedores();
  }

  cargarRoles() {
    this.http.get<any[]>(`${environment.apiBaseUrl}/Roles/Listar`, {
      headers: { 'x-api-key': environment.apiKey }
    }).subscribe(data => this.roles = data);
  }

  cargarEmpleados() {
    this.http.get<any[]>(`${environment.apiBaseUrl}/Empleado/Listar`, {
      headers: { 'x-api-key': environment.apiKey }
    }).subscribe(data => this.empleados = data);
  }

  cargarVendedores() {
    this.http.get<any[]>(`${environment.apiBaseUrl}/Vendedores/Listar`, {
      headers: { 'x-api-key': environment.apiKey }
    }).subscribe(data => this.vendedores = data);
  }

  cancelar(): void {
    this.mostrarErrores = false;
    this.mostrarAlertaExito = false;
    this.mensajeExito = '';
    this.mostrarAlertaError = false;
    this.mensajeError = '';
    this.mostrarAlertaWarning = false;
    this.mensajeWarning = '';
    this.usuario = {
      usua_Usuario: '',
      usua_Clave: '',
      role_Id: '',
      usua_IdPersona: '',
      usua_EsVendedor: 0,
      usua_EsAdmin: false,
      usua_Imagen: 'https://res.cloudinary.com/dwiprwtmo/image/upload/v1746503950/wzivrxowirdm6eg5hfbo.jpg',
      usua_Creacion: environment.usua_Id,
      usua_FechaCreacion: new Date().toISOString()
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
      this.usuario.usua_Usuario.trim() &&
      this.usuario.usua_Clave.trim() &&
      this.usuario.role_Id &&
      this.usuario.usua_IdPersona
    ) {
      // Limpiar alertas previas
      this.mostrarAlertaWarning = false;
      this.mostrarAlertaError = false;

      // Por ahora, la imagen es la default o la que el usuario seleccione (ver método abajo)
      const usuarioGuardar = {
        ...this.usuario,
        usua_EsAdmin: this.usuario.usua_EsAdmin ? 1 : 0,
        usua_EsVendedor: 0, // Siempre 0 por ahora
        usua_Creacion: environment.usua_Id,
        usua_FechaCreacion: new Date().toISOString()
      };

      this.http.post<any>(`${environment.apiBaseUrl}/Usuarios/Insertar`, usuarioGuardar, {
        headers: {
          'X-Api-Key': environment.apiKey,
          'Content-Type': 'application/json',
          'accept': '*/*'
        }
      }).subscribe({
        next: (response) => {
          if (response.data.code_Status === 1) {
            this.mensajeExito = `Usuario "${this.usuario.usua_Usuario}" guardado exitosamente`;
            this.mostrarAlertaExito = true;
            this.mostrarErrores = false;
            setTimeout(() => {
              this.mostrarAlertaExito = false;
              this.onSave.emit(this.usuario);
              this.cancelar();
            }, 3000);
          } else {
            this.mostrarAlertaError = true;
            this.mensajeError = 'Error al guardar el usuario, ' + response.data.message_Status;
            this.mostrarAlertaExito = false;
            setTimeout(() => {
              this.mostrarAlertaError = false;
              this.mensajeError = '';
            }, 5000);
          }
        },
        error: (error) => {
          this.mostrarAlertaError = true;
          this.mensajeError = 'Error al guardar el usuario. Por favor, intente nuevamente.';
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

  // Previsualización de imagen (por ahora solo local, luego aquí se subirá a Cloudinary)
  onImagenSeleccionada(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Aquí luego se subirá a Cloudinary y se actualizará el campo usua_Imagen con la URL devuelta
      // Por ahora solo previsualizamos localmente
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.usuario.usua_Imagen = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
}