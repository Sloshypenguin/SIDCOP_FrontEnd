import { Component, inject } from '@angular/core';
import { NgStyle, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { IconDirective } from '@coreui/icons-angular';
import { ContainerComponent, RowComponent, ColComponent, CardGroupComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, FormControlDirective, ButtonDirective, AlertComponent } from '@coreui/angular';
import { Usuario } from '../../models/usuario.model';
import { Respuesta, DataResponse } from '../../models/respuesta.model';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-iniciarsesion',
  standalone: true,
  imports: [CommonModule, ContainerComponent, RouterModule, RowComponent, ColComponent, CardGroupComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, IconDirective, FormControlDirective, ButtonDirective, NgStyle, FormsModule, AlertComponent],
  templateUrl: './iniciarsesion.component.html',
  styleUrl: './iniciarsesion.component.scss'
})
export class IniciarsesionComponent {
  http = inject(HttpClient);
  // router = inject(Router);
  toastService = inject(ToastService);
  
  usuario: Usuario = new Usuario();
  cargando: boolean = false;
  mostrarError: boolean = false;
  mensajeError: string = '';
  mostrarErrorCredenciales: boolean = false;
  
  constructor(private router: Router) { }

  irAotraPagina() {
    this.router.navigate(['/registrarse']).then(
      () => console.log('Navegación exitosa a la página de registro'),
      err => console.error('Error en la navegación:', err)
      );
  }

  iniciarSesion() {
    // Resetear mensajes de error
    this.mostrarError = false;
    this.mostrarErrorCredenciales = false;
    
    // Validar que los campos no estén vacíos
    if (!this.usuario.usua_Nombre || !this.usuario.usua_Clave) {
      this.mostrarError = true;
      this.mensajeError = 'Por favor, complete todos los campos.';
      return;
    }
    
    this.cargando = true;
    
    console.log('Enviando solicitud de inicio de sesión...');
    console.log('Datos enviados:', {
      usua_Nombre: this.usuario.usua_Nombre,
      usua_Clave: '******' // No mostrar la contraseña real en logs
    });
    
    // Enviar solicitud de inicio de sesión
    this.http.post<Respuesta<Usuario[]>>('https://localhost:7211/Usuarios/Login', {
      usua_Nombre: this.usuario.usua_Nombre,
      usua_Clave: this.usuario.usua_Clave
    }).subscribe({
      next: (response) => {
        console.log('Respuesta recibida:', response);
        this.cargando = false;
        
        if (response && response.success) {
          // Verificar si hay datos en el array
          if (response.data && response.data.length > 0) {
            const resultado = response.data[0]; // Acceder al primer elemento de la respuesta
            console.log('Datos de usuario recibidos:', resultado);
            
            if (resultado.code_Status === 1) {
              console.log('Login exitoso, guardando información del usuario...');
              // Guardar información del usuario en localStorage
              if (resultado.usua_Id !== undefined) localStorage.setItem('usuarioId', resultado.usua_Id.toString());
              if (resultado.usua_Nombre !== undefined) localStorage.setItem('usuarioNombre', resultado.usua_Nombre);
              if (resultado.usua_Apellido !== undefined) localStorage.setItem('usuarioApellido', resultado.usua_Apellido);
              if (resultado.usua_Correo !== undefined) localStorage.setItem('usuarioCorreo', resultado.usua_Correo);
              if (resultado.role_Id !== undefined) {
                localStorage.setItem('roleId', resultado.role_Id.toString());
                localStorage.setItem('usuarioRol', resultado.role_Id.toString()); // Agregar esta línea para compatibilidad
              }
              if (resultado.role_Descripcion !== undefined) localStorage.setItem('roleDescripcion', resultado.role_Descripcion);
              if (resultado.usua_EsAdmin !== undefined) localStorage.setItem('usuarioEsAdmin', resultado.usua_EsAdmin.toString());
              if (resultado.usua_EsEmpleado !== undefined) localStorage.setItem('usuarioEsEmpleado', resultado.usua_EsEmpleado.toString());
              if (resultado.usua_Persona !== undefined) localStorage.setItem('usuarioPersona', resultado.usua_Persona.toString());
              
              // Determinar a qué ruta redirigir según el tipo de usuario
              if (resultado.usua_EsEmpleado) {
                console.log('Usuario es empleado, redirigiendo al dashboard');
                this.router.navigate(['/dashboard']);
              } else {
                console.log('Usuario es cliente, redirigiendo a Mi Casillero');
                this.router.navigate(['/dashboard-cliente']);
              }
            } else {
              console.error('Error de credenciales:', resultado);
              this.mostrarErrorCredenciales = true;
            // Mostrar mensaje de error según el código de estado
            console.log('Error de autenticación:', resultado);
            this.mostrarErrorCredenciales = true;
            this.mensajeError = resultado.message_Status || 'Credenciales inválidas. Por favor, intente nuevamente.';
            }
          } else {
            // Si data es un array vacío, significa credenciales incorrectas
            console.log('Credenciales incorrectas - Array vacío en la respuesta');
            this.mostrarErrorCredenciales = true;
            this.mensajeError = 'Usuario y/o contraseña incorrectos. Por favor, intente nuevamente.';
          }
        } else {
          console.log('Respuesta inválida de la API:', response);
          // Mostrar error de credenciales inválidas
          this.mostrarErrorCredenciales = true;
          this.mensajeError = 'Error en la respuesta del servidor. Por favor, intente nuevamente.';
        }
      },
      error: (error) => {
        console.error('Error en la solicitud:', error);
        this.cargando = false;
        this.mostrarErrorCredenciales = true;
        this.mensajeError = 'Error de conexión. Por favor, intente nuevamente más tarde.';
      },
      complete: () => {
        console.log('Solicitud de inicio de sesión completada');
      }
    });
  }
}
