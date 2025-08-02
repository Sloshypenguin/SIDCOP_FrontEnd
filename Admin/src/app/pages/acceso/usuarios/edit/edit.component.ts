import { Component, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Usuario } from 'src/app/Modelos/acceso/usuarios.Model';
import { environment } from 'src/environments/environment.prod';
import { getUserId } from 'src/app/core/utils/user-utils';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class EditComponent implements OnChanges{
  @Input() usuarioData: Usuario | null = null;
  @Output() onCancel = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<Usuario>();

  mostrarErrores = false;
  mostrarAlertaExito = false;
  mensajeExito = '';
  mostrarAlertaError = false;
  mensajeError = '';
  mostrarAlertaWarning = false;
  mensajeWarning = '';
  mostrarConfirmacionEditar = false;

  roles: any[] = [];
  empleados: any[] = [];
  vendedores: any[] = [];

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

  usuarioOriginal: any = {};

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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['usuarioData'] && changes['usuarioData'].currentValue) {
      this.usuario = { ...changes['usuarioData'].currentValue };
      this.usuarioOriginal = { ...this.usuarioOriginal };
      this.mostrarErrores = false;
      this.cerrarAlerta();
      this.cargarRoles();
      this.cargarVendedores();
      this.cargarEmpleados();
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

  cancelarEdicion(): void {
    this.mostrarConfirmacionEditar = false;
  }

  confirmarEdicion(): void {
    this.mostrarConfirmacionEditar = false;
    this.guardar();
  }

  onAdminToggle(): void {
    if (this.usuario.usua_EsAdmin) {
      this.usuario.role_Id = 1;
      this.usuario.usua_IdPersona = 0;
    }
  }

  cambiosDetectados: any = {};

  hayDiferencias(): boolean {
    const a = this.usuario;
    const b = this.usuarioOriginal;

    if(a.usua_Usuario !== b.usua_Usuario){
      this.cambiosDetectados.nombreUsuario = {
        anterior: b.usua_Usuario,
        nuevo: a.usua_Usuario,
        label: 'Usuarios'
      }
    }

    if(a.role_Id !== b.role_Id){
      const rolAnterior = this.roles.find(c => c.role_Id === b.role_Id);
      const rolNueva = this.roles.find(c => c.role_Id === a.role_Id);

      this.cambiosDetectados.role = {
        anterior: rolAnterior ? `${rolAnterior.role_Descripcion}` : 'No seleccionado',
        nuevo: rolNueva ? `${rolNueva.role_Descripcion}` : 'No seleccionado',
        label: 'Rol'
      }
    }

    if(a.usua_IdPersona !== b.usua_IdPersona){
      const empleadoAnterior = this.empleados.find(c => c.empleado_Id === b.usua_IdPersona);
      const empleadoNuevo = this.empleados.find(c => c.empleado_Id === a.usua_IdPersona);

      this.cambiosDetectados.empleado = {
        anterior: empleadoAnterior ? `${empleadoAnterior.nombreCompleto}` : 'No seleccionado',
        nuevo: empleadoNuevo ? `${empleadoNuevo.nombreCompleto}` : 'No seleccionado',
        label: 'Empleado'
      }
    }

    return Object.keys(this.cambiosDetectados).length > 0;
  }

  guardar(): void {
    this.mostrarErrores = true;
    if (this.usuario.usua_Usuario.trim() && this.usuario.role_Id && this.usuario.usua_IdPersona) 
    {
      this.mostrarAlertaWarning = false;
      this.mostrarAlertaError = false;

      const usuarioGuardar = {
        secuencia: 0,
        usua_Id: this.usuario.usua_Id,
        usua_Usuario: this.usuario.usua_Usuario.trim(),
        usua_Clave: '',
        role_Id: this.usuario.role_Id,
        usua_IdPersona: this.usuario.usua_IdPersona,
        usua_EsVendedor: this.usuario.usua_EsVendedor,
        usua_EsAdmin: this.usuario.usua_EsAdmin,
        usua_Imagen: this.usuario.usua_Imagen,
        usua_Creacion: getUserId(),
        usua_FechaCreacion: new Date().toISOString(),
        usua_Modificacion: getUserId(),
        usua_FechaModificacion: new Date().toISOString(),
        usua_Estado: true,
        permisosJson:"",
        role_Descripcion: '',
        nombreCompleto: '',
        code_Status: 0,
        message_Status: '',
      };
      this.http.put<any>(`${environment.apiBaseUrl}/Usuarios/Actualizar`, usuarioGuardar,{
        headers:{
          'X-Api-Key': environment.apiKey,
          'Content-Type': 'application/json',
          'accept': '*/*'
        }
      }).subscribe({
        next: (response) =>{
          if (response.data.code_Status === 1) {
            this.mostrarErrores = false;
            this.onSave.emit(this.usuario);
            this.cancelar();
          } else {
            this.mostrarAlertaError = true;
            this.mensajeError = 'Error al actualizar el usuario, ' + response.data.message_Status;
            this.mostrarAlertaExito = false;
            setTimeout(() => {
              this.mostrarAlertaError = false;
              this.mensajeError = '';
            }, 5000);
          }
        },
        error: (error) => {
          console.error('Error al actualizar usuario:', error);
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

  onImagenSeleccionada(event: any) {
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
        this.usuario.usua_Imagen = data.secure_url;
      })
      .catch(error => {
        console.error('Error al subir la imagen a Cloudinary:', error);
      });
    }
  }

  onImgError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = 'assets/images/users/32/user-dummy-img.jpg';
  }
}
