import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { User } from '../../store/Authentication/auth.models';
import { getFirebaseBackend } from 'src/app/authUtils';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { GlobalComponent } from '../../global-component';

// Action
import {
  login,
  loginSuccess,
  loginFailure,
  logout,
  logoutSuccess,
  RegisterSuccess,
} from '../../store/Authentication/authentication.actions';

// Firebase
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';

const AUTH_API = GlobalComponent.AUTH_API;

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  user!: User;
  currentUserValue: any;

  private currentUserSubject: BehaviorSubject<User>;

  constructor(
    private http: HttpClient,
    private store: Store,
    private afAuth: AngularFireAuth
  ) {
    this.currentUserSubject = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem('currentUser')!)
    );
  }

  // Sign in with Google provider
  signInWithGoogle(): Promise<User> {
    const provider = new firebase.auth.GoogleAuthProvider();
    return this.signInWithPopup(provider);
  }

  // Sign in with Facebook provider
  signInWithFacebook(): Promise<User> {
    const provider = new firebase.auth.FacebookAuthProvider();
    return this.signInWithPopup(provider);
  }

  // Sign in with a popup for the specified provider
  private async signInWithPopup(
    provider: firebase.auth.AuthProvider
  ): Promise<User> {
    try {
      const result = await this.afAuth.signInWithPopup(provider);
      const user = result.user;
      return {
        //     uid: user.uid,
        //     displayName: user.displayName,
        //     email: user.email,
        //     // Add other user properties as needed
      };
    } catch (error) {
      throw new Error('Failed to sign in with the specified provider.');
    }
  }

  // Sign out the current user
  signOut(): Promise<void> {
    return this.afAuth.signOut();
  }

  register(email: string, first_name: string, password: string) {
    return this.http
      .post(
        AUTH_API + 'signup',
        {
          email,
          first_name,
          password,
        },
        httpOptions
      )
      .pipe(
        map((response: any) => {
          const user = response;
          this.store.dispatch(RegisterSuccess({ user }));
          return user;
        }),
        catchError((error: any) => {
          const errorMessage = 'Login failed'; // Customize the error message as needed
          this.store.dispatch(loginFailure({ error: errorMessage }));
          return throwError(errorMessage);
        })
      );
  }

  login(email: string, password: string) {
    this.store.dispatch(login({ email, password }));

    // Crear el objeto de datos para la solicitud
    const loginData = {
      usua_Usuario: email,
      usua_Clave: password,
    };

    // Usar el mismo patrón que en Estados Civiles
    const apiUrl = `${environment.apiBaseUrl}/Usuarios/IniciarSesion`;

    // Realizar la solicitud HTTP con los headers adecuados
    return this.http
      .post(apiUrl, loginData, {
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': environment.apiKey,
          accept: '*/*',
        },
      })
      .pipe(
        map((response: any) => {
          // Guardar el código de estado y mensaje para devolverlos al componente
          const responseStatus = {
            code_Status: response.code_Status,
            message_Status: response.message_Status
          };
          
          // Si el código de estado es 1 (éxito) y hay datos, procesar la información del usuario
          if (response.code_Status === 1 && response.data) {
            const userData = response.data;

            // Guardar información del usuario en localStorage
            localStorage.setItem('currentUser', JSON.stringify(userData));

            // Guardar el token si existe en la respuesta, o usar un dummy token
            if (userData.token) {
              localStorage.setItem('token', userData.token);
            } else {
              localStorage.setItem('token', 'dummy-token');
            }

            // Guardar ID del usuario
            if (userData.usua_Id) {
              localStorage.setItem('usuarioId', userData.usua_Id.toString());
            }

            // Guardar nombre de usuario
            if (userData.usua_Usuario) {
              localStorage.setItem('usuarioNombre', userData.usua_Usuario);
            }

            // Guardar permisos JSON
            if (userData.permisosJson) {
              localStorage.setItem('permisosJson', userData.permisosJson);
            }

            // Guardar cualquier otro dato relevante que venga en la respuesta
            if (userData.usua_Email) {
              localStorage.setItem('usuarioEmail', userData.usua_Email);
            }

            if (userData.usua_Nombres) {
              localStorage.setItem('usuarioNombres', userData.usua_Nombres);
            }

            if (userData.usua_Apellidos) {
              localStorage.setItem('usuarioApellidos', userData.usua_Apellidos);
            }

            if (userData.usua_Rol) {
              localStorage.setItem('usuarioRol', userData.usua_Rol);
            }

            // Actualizar el subject del usuario actual
            this.currentUserSubject.next(userData);

            // Dispatch success action
            this.store.dispatch(loginSuccess({ user: userData }));
          } else if (response.code_Status === -1 || response.code_Status === 0) {
            // Si el código es -1 (usuario inexistente/inactivo) o 0 (error), no guardar datos
            // pero devolver el código y mensaje para mostrar la alerta adecuada
            console.warn('Error de inicio de sesión:', responseStatus.message_Status);
          }
          
          // Devolver el objeto con el código y mensaje de estado para que el componente
          // pueda mostrar la alerta correspondiente
          return responseStatus;
        }),
        catchError((error: any) => {
          let errorMessage = 'Error al iniciar sesión';

          if (error.status === 0) {
            errorMessage =
              'No se pudo conectar al servidor. Verifique que el backend esté en ejecución en el puerto correcto.';
          } else if (error.status === 401) {
            errorMessage =
              'Credenciales incorrectas. Verifique su usuario y contraseña.';
          } else if (error.error && error.error.message) {
            errorMessage = error.error.message;
          } else if (error.message) {
            errorMessage = error.message;
          }

          this.store.dispatch(loginFailure({ error: errorMessage }));
          return throwError(() => new Error(errorMessage));
        })
      );
  }

  logout(): Observable<void> {
    this.store.dispatch(logout());
    // Perform any additional logout logic, e.g., calling an API to invalidate the token

    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.currentUserSubject.next(null!);
    this.store.dispatch(logoutSuccess());

    // Return an Observable<void> indicating the successful logout
    return of(undefined).pipe(
      tap(() => {
        // Perform any additional logic after the logout is successful
      })
    );
  }

  resetPassword(email: string) {
    return this.http.post(AUTH_API + 'reset-password', { email }, httpOptions);
  }

  /**
   * Returns the current user
   */
  public currentUser(): any {
    return getFirebaseBackend()!.getAuthenticatedUser();
  }
}
