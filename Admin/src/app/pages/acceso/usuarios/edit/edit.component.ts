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
export class EditComponent implements OnChanges {
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
    usua_TienePermisos: false,
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
      this.usuarioOriginal = { ...changes['usuarioData'].currentValue };
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
      this.usuario.usua_EsVendedor = false;
    } else {
      this.usuario.role_Id = 0;
      this.usuario.usua_IdPersona = 0;
    }
  }

  onVendedorToggle(): void {
    if (!this.usuario.usua_EsVendedor) {
      this.usuario.usua_IdPersona = 0;
    }
  }

  cambiosDetectados: any = {};

  hayDiferencias(): boolean {
    const a = this.usuario;
    const b = this.usuarioOriginal;
    this.cambiosDetectados = {};

    if (a.usua_Usuario !== b.usua_Usuario) {
      this.cambiosDetectados.nombreUsuario = {
        anterior: b.usua_Usuario,
        nuevo: a.usua_Usuario,
        label: 'Usuario'
      };
    }

    if (a.role_Id !== b.role_Id) {
      const rolAnterior = this.roles.find(c => c.role_Id === b.role_Id);
      const rolNuevo = this.roles.find(c => c.role_Id === a.role_Id);
      this.cambiosDetectados.rol = {
        anterior: rolAnterior ? rolAnterior.role_Descripcion : 'No seleccionado',
        nuevo: rolNuevo ? rolNuevo.role_Descripcion : 'No seleccionado',
        label: 'Rol'
      };
    }

    if (a.usua_EsAdmin !== b.usua_EsAdmin) {
      this.cambiosDetectados.admin = {
        anterior: b.usua_EsAdmin ? 'Sí' : 'No',
        nuevo: a.usua_EsAdmin ? 'Sí' : 'No',
        label: '¿Es Administrador?'
      };
    }

    if (a.usua_EsVendedor !== b.usua_EsVendedor) {
      this.cambiosDetectados.vendedor = {
        anterior: b.usua_EsVendedor ? 'Sí' : 'No',
        nuevo: a.usua_EsVendedor ? 'Sí' : 'No',
        label: '¿Es Vendedor?'
      };
    }

    if (a.usua_IdPersona !== b.usua_IdPersona || a.usua_EsVendedor !== b.usua_EsVendedor) {
      let labelAnterior = b.usua_EsVendedor ? 'Vendedor' : 'Empleado';
      let anterior = 'No seleccionado';
      if (b.usua_IdPersona) {
        if (b.usua_EsVendedor) {
          const vendAnterior = this.vendedores.find(v => v.vend_Id === b.usua_IdPersona);
          anterior = vendAnterior ? vendAnterior.vend_Nombres : anterior;
        } else {
          const empAnterior = this.empleados.find(e => e.empl_Id === b.usua_IdPersona);
          anterior = empAnterior ? empAnterior.empl_Nombres : anterior;
        }
      }

      let labelNuevo = a.usua_EsVendedor ? 'Vendedor' : 'Empleado';
      let nuevo = 'No seleccionado';
      if (a.usua_IdPersona) {
        if (a.usua_EsVendedor) {
          const vendNuevo = this.vendedores.find(v => v.vend_Id === a.usua_IdPersona);
          nuevo = vendNuevo ? vendNuevo.vend_Nombres : nuevo;
        } else {
          const empNuevo = this.empleados.find(e => e.empl_Id === a.usua_IdPersona);
          nuevo = empNuevo ? empNuevo.empl_Nombres : nuevo;
        }
      }

      if (labelAnterior !== labelNuevo || anterior !== nuevo) {
        this.cambiosDetectados.persona = {
          anterior,
          nuevo,
          label: labelNuevo
        };
      }
    }

    if (a.usua_Imagen !== b.usua_Imagen) {
      this.cambiosDetectados.imagen = {
        anterior: b.usua_Imagen,
        nuevo: a.usua_Imagen,
        label: 'Imagen de Usuario'
      };
    }

    return Object.keys(this.cambiosDetectados).length > 0;
  }

  validarEdicion(): void {
    this.mostrarErrores = true;
    if (this.hayDiferencias()) {
      this.mostrarConfirmacionEditar = true;
    } else {
      this.mostrarAlertaWarning = true;
      this.mensajeWarning = 'No se han detectado cambios.';
      setTimeout(() => this.cerrarAlerta(), 4000);
    }
  }

  obtenerListaCambios(): any[] {
    return Object.values(this.cambiosDetectados);
  }

  guardar(): void {
    this.mostrarErrores = true;
    if (this.usuario.usua_Usuario.trim() && this.usuario.role_Id && this.usuario.usua_IdPersona) {
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
        usua_TienePermisos: this.usuario.usua_TienePermisos,
        usua_Creacion: getUserId(),
        usua_FechaCreacion: new Date().toISOString(),
        usua_Modificacion: getUserId(),
        usua_FechaModificacion: new Date().toISOString(),
        usua_Estado: true,
        permisosJson: "",
        role_Descripcion: '',
        nombreCompleto: '',
        code_Status: 0,
        message_Status: '',
      };
      this.http.put<any>(`${environment.apiBaseUrl}/Usuarios/Actualizar`, usuarioGuardar, {
        headers: {
          'X-Api-Key': environment.apiKey,
          'Content-Type': 'application/json',
          'accept': '*/*'
        }
      }).subscribe({
        next: (response) => {
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
    const file = event.target.files[0];

    if (file) {
      // para enviar la imagen a Cloudinary
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
