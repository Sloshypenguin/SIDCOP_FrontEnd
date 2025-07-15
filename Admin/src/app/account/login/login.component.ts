import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { AuthfakeauthenticationService } from 'src/app/core/services/authfake.service';
import { login } from 'src/app/store/Authentication/authentication.actions';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

// Login Component
export class LoginComponent {

  // Login Form
  loginForm!: UntypedFormGroup;
  submitted = false;
  fieldTextType!: boolean;
  error = '';
  returnUrl!: string;
  
  // Propiedades para alertas
  showAlert = false;
  alertType = '';
  alertMessage = '';
  
  a: any = 10;
  b: any = 20;
  toast!: false;

  // set the current year
  year: number = new Date().getFullYear();

  // tslint:disable-next-line: max-line-length
  constructor(private formBuilder: UntypedFormBuilder,
    private router: Router,
    private store: Store,
    private authService: AuthenticationService
) { }

  ngOnInit(): void {
    if (localStorage.getItem('currentUser')) {
      this.router.navigate(['/']);
    }
    /**
     * Form Validatyion
     */
    this.loginForm = this.formBuilder.group({
      email: ['admin', [Validators.required]], // Cambiado a nombre de usuario
      password: ['123', [Validators.required]],
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  /**
   * Form submit
   */
  onSubmit() {
    this.submitted = true;
    
    // Ocultar alertas previas
    this.showAlert = false;

    // Verificar si el formulario es válido
    if (this.loginForm.invalid) {
      return;
    }

    const email = this.f['email'].value; // Get the username from the form
    const password = this.f['password'].value; // Get the password from the form

    // Llamar directamente al servicio de autenticación
    this.authService.login(email, password).subscribe({
      next: (response: any) => {
        // Verificar el código de estado de la respuesta
        if (response && response.code_Status !== undefined) {
          this.showAlert = true;
          
          switch (response.code_Status) {
            case 1: // Éxito
              this.alertType = 'success';
              this.alertMessage = response.message_Status || 'Sesión iniciada correctamente.';
              // Redirigir al usuario a la página principal después de un breve retraso
              setTimeout(() => {
                this.router.navigate(['/']);
              }, 1000);
              break;
              
            case 0: // Error general
              this.alertType = 'warning';
              this.alertMessage = response.message_Status || 'Error al iniciar sesión.';
              break;
              
            case -1: // Usuario inexistente o inactivo
              this.alertType = 'danger';
              this.alertMessage = response.message_Status || 'Usuario inexistente o inactivo.';
              break;
              
            default:
              // Si hay un código de estado no reconocido, redirigir de todos modos
              this.router.navigate(['/']);
              break;
          }
        } else {
          // Si no hay código de estado, asumir éxito y redirigir
          this.router.navigate(['/']);
        }
      },
      error: (error) => {
        this.showAlert = true;
        this.alertType = 'danger';
        this.alertMessage = error.message || 'Error al conectar con el servidor.';
        this.error = error.message || 'Error al iniciar sesión';
        console.error('Error de inicio de sesión:', error);
      }
    });
  }

  /**
   * Password Hide/Show
   */
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
}
