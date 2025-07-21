import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Usuario } from 'src/app/Modelos/acceso/usuarios.Model';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-recuperarcontrasenia',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './recuperarcontrasenia.component.html',
  styleUrl: './recuperarcontrasenia.component.scss'
})
export class RecuperarcontraseniaComponent {
  // --- Confirmar contraseña screen logic ---
  mostrarPantallaConfirmar = false;
  nuevaContrasena: string = '';
  confirmarContrasena: string = '';
  mostrarPassword1: boolean = false;
  mostrarPassword2: boolean = false;

  onInputKeyUp(event: Event, idx: number): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;
    // Only allow single alphanumeric character
    if (!/^([a-zA-Z0-9]?)$/.test(value)) {
      input.value = '';
      this.codigoIngresado[idx] = '';
      return;
    }
    // Store character or clear
    this.codigoIngresado[idx] = value;
    // Auto-advance if character entered and not last input
    if (value.length === 1 && idx < 5) {
      setTimeout(() => {
        const nextInput = document.querySelector<HTMLInputElement>(`input[name='codigo${idx+1}']`);
        if (nextInput) {
          nextInput.focus();
          nextInput.select();
        }
      }, 0);
    }
    // Go back if deleted and not first input
    if (!value && idx > 0) {
      setTimeout(() => {
        const prevInput = document.querySelector<HTMLInputElement>(`input[name='codigo${idx-1}']`);
        if (prevInput) {
          prevInput.focus();
          prevInput.select();
        }
      }, 0);
    }
  }
    @Output() onCancel = new EventEmitter<void>();
  fieldTextType!: boolean;
  mostrarAlertaExito = false;
  mensajeExito = '';
  mostrarAlertaError = false;
  mensajeError = '';
  mostrarAlertaWarning = false;
  mensajeWarning = '';
  mostrarErrores = false;
  correo = '';

  // --- Code entry screen logic ---
  mostrarPantallaCodigo = false;
  codigoIngresado: string[] = ['', '', '', '', '', ''];
  codigoGenerado: string = '';

  constructor(private http: HttpClient) {}
  cerrarAlerta(): void {
    this.mostrarAlertaExito = false;
    this.mensajeExito = '';
    this.mostrarAlertaError = false;
    this.mensajeError = '';
    this.mostrarAlertaWarning = false;
    this.mensajeWarning = '';
  }
  cancelar(): void {
    this.onCancel.emit();
  }
  usuario: Usuario = {
    secuencia: 0,
    usua_Id: 0,
    usua_Usuario: '',
    usua_Clave: '',
    role_Id: 0,
    usua_IdPersona: 0,
    usua_EsVendedor: false,
    usua_EsAdmin: false,
    usua_Imagen: '',
    usua_Creacion: 0,
    usua_FechaCreacion: new Date(),
    usua_Modificacion: 0,
    usua_FechaModificacion: new Date(),
    usua_Estado: false,

    permisosJson: '',
    role_Descripcion: '',
    nombreCompleto: '',

    code_Status: 0,
    message_Status:""
  }
    verificarusuario(): void {
        this.mostrarErrores = true;
        if (this.usuario.usua_Usuario.trim()) {
            this.http.post<any>(`${environment.apiBaseUrl}/Usuarios/VerificarUsuario`, this.usuario, {
                headers: { 
                    'X-Api-Key': environment.apiKey,
                    'Content-Type': 'application/json',
                    'accept': '*/*'
                }
            }).subscribe({
                next: (response) => {
                    console.log('Respuesta del servidor:', response);
                    if (response.data && response.data[0] && response.data[0].correo !== null) {   
                        this.correo = response.data[0].correo;
                        this.usuario.usua_Id = response.data[0].usua_Id;
                        this.enviarcorreo();
                        console.log('Correo enviado a:', this.correo);
                    } else {
                        this.mostrarAlertaWarning = true;
                        this.mensajeWarning = 'No se encontró el usuario ingresado.';
                        setTimeout(() => {
                            this.mostrarAlertaWarning = false;
                            this.mensajeWarning = '';
                        }, 4000);
                    }
                },
                error: (err) => {
                    this.mostrarAlertaError = true;
                    this.mensajeError = 'Ocurrió un error al verificar el usuario.';
                    console.error(err);
                    setTimeout(() => {
                        this.mostrarAlertaError = false;
                        this.mensajeError = '';
                    }, 4000);
                }
            });
        } else {
            console.log('El campo de usuario está vacío:', this.usuario.usua_Usuario);
            this.mostrarAlertaWarning = true;
            this.mensajeWarning = 'El campo Usuario es requerido.';
            setTimeout(() => {
                this.mostrarAlertaWarning = false;
                this.mensajeWarning = '';
            }, 4000);
        }
    }
      generarCodigo(): string {
       return Math.floor(100000 + Math.random() * 900000).toString();
      }
    enviarcorreo(): void {
      this.codigoGenerado = this.generarCodigo();
      console.log('Código generado:', this.codigoGenerado);
      const payload = {
        to_email: this.correo,
        codigo: this.codigoGenerado
      };
      this.http.post<any>(`${environment.apiBaseUrl}/Usuarios/EnviarCorreo`, payload, {
        headers: {
          'X-Api-Key': environment.apiKey,
          'Content-Type': 'application/json',
          'accept': '*/*'
        }
      }).subscribe({
        next: (response) => {
          console.log('Respuesta de envío de correo:', response);
          if (response.mensaje && response.mensaje === 'Correo enviado exitosamente') {
            this.mostrarAlertaExito = true;
            this.mensajeExito = '¡Correo enviado exitosamente!';
            this.mostrarPantallaCodigo = true;
            setTimeout(() => {
              this.mostrarAlertaExito = false;
              this.mensajeExito = '';
            }, 4000);
          } else {
            this.mostrarAlertaError = true;
            this.mensajeError = 'No se pudo enviar el correo.';
            setTimeout(() => {
              this.mostrarAlertaError = false;
              this.mensajeError = '';
            }, 4000);
          }
        },
        error: (err) => {
          this.mostrarAlertaError = true;
          this.mensajeError = 'Error al enviar el correo.';
          console.error('Error al enviar el correo:', err);
          setTimeout(() => {
            this.mostrarAlertaError = false;
            this.mensajeError = '';
          }, 4000);
        }
      });
    }

  cancelarPantallaCodigo(): void {
    this.mostrarPantallaCodigo = false;
    this.codigoIngresado = ['', '', '', '', '', ''];
  }

  confirmarCodigo(): void {
    const codigoFinal = this.codigoIngresado.join('');
    if (codigoFinal === this.codigoGenerado) {
      this.mostrarAlertaExito = true;
      this.mensajeExito = '¡Código correcto! Ahora puedes cambiar tu contraseña.';
      this.mostrarPantallaCodigo = false;
      this.mostrarPantallaConfirmar = true;
      setTimeout(() => {
        this.mostrarAlertaExito = false;
        this.mensajeExito = '';
      }, 4000);
    } else {
      this.mostrarAlertaError = true;
      this.mensajeError = 'El código ingresado es incorrecto.';
      setTimeout(() => {
        this.mostrarAlertaError = false;
        this.mensajeError = '';
      }, 4000);
    }

  }

  regresarConfirmar(): void {
    this.mostrarPantallaConfirmar = false;
    this.mostrarPantallaCodigo = true;
    this.nuevaContrasena = '';
    this.confirmarContrasena = '';
  }

  confirmarNuevaContrasena(): void {
    if (!this.nuevaContrasena || !this.confirmarContrasena) {
      this.mostrarAlertaError = true;
      this.mensajeError = 'Debes ingresar y confirmar la nueva contraseña.';
      setTimeout(() => {
        this.mostrarAlertaError = false;
        this.mensajeError = '';
      }, 4000);
      return;
    }
    if (this.nuevaContrasena !== this.confirmarContrasena) {
      this.mostrarAlertaError = true;
      this.mensajeError = 'Las contraseñas no coinciden.';
      setTimeout(() => {
        this.mostrarAlertaError = false;
        this.mensajeError = '';
      }, 4000);
      return;
    }
    // Lógica para guardar la nueva contraseña en el backend
    const usuarioActualizado = {
      ...this.usuario,
      usua_Clave: this.nuevaContrasena,
      correo: this.correo
    };
    this.http.post<any>(`${environment.apiBaseUrl}/Usuarios/RestablecerClave`, usuarioActualizado, {
      headers: {
        'X-Api-Key': environment.apiKey,
        'Content-Type': 'application/json',
        'accept': '*/*'
      }
    }).subscribe({
      next: (response) => {
        if (response.mensaje && response.mensaje.includes('exitosamente')) {
          this.mostrarAlertaExito = true;
          this.mensajeExito = '¡Contraseña actualizada exitosamente!';
          this.mostrarPantallaConfirmar = false;
        } else {
          this.mostrarAlertaError = true;
          this.mensajeError = response.mensaje || 'No se pudo actualizar la contraseña.';
        }
        setTimeout(() => {
          this.mostrarAlertaExito = false;
          this.mensajeExito = '';
          this.mostrarAlertaError = false;
          this.mensajeError = '';
        }, 4000);
      },
      error: (err) => {
        this.mostrarAlertaError = true;
        this.mensajeError = 'Error al actualizar la contraseña.';
        setTimeout(() => {
          this.mostrarAlertaError = false;
          this.mensajeError = '';
        }, 4000);
      }
    });
  }
}
