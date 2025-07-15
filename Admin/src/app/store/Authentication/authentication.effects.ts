import { Injectable, Inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap, catchError, exhaustMap, tap } from 'rxjs/operators';
import { from, of } from 'rxjs';
import { AuthenticationService } from '../../core/services/auth.service';
import { login, loginSuccess, loginFailure, logout, logoutSuccess, Register } from './authentication.actions';
import { Router } from '@angular/router';
import { User } from './auth.models';

@Injectable()
export class AuthenticationEffects {

  Register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(Register),
      exhaustMap(({ email, first_name, password }) =>
        this.AuthenticationService.register(email, first_name, password).pipe(
          map((user) => {
            this.router.navigate(['/auth/login']);
            return loginSuccess({ user });
          }),
          catchError((error) => of(loginFailure({ error })))
        )
      )
    )
  );

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(login),
      exhaustMap(({ email, password }) =>
        this.AuthenticationService.login(email, password).pipe(
          map((response) => {
            // Si el código de estado es 1 (éxito), crear un objeto User para el store
            if (response.code_Status === 1) {
              // Recuperar los datos del usuario del localStorage que ya fueron guardados por el servicio
              const userData = JSON.parse(localStorage.getItem('currentUser') || '{}');
              
              // Crear un objeto User compatible con el modelo esperado
              const user: User = {
                id: userData.usua_Id,
                username: userData.usua_Usuario,
                firstName: userData.usua_Nombres,
                lastName: userData.usua_Apellidos,
                email: userData.usua_Email,
                token: localStorage.getItem('token') || ''
              };
              
              // No es necesario navegar aquí ya que lo hacemos en el componente login
              return loginSuccess({ user });
            } else {
              // Si hay un error, lanzar un error para que sea capturado por el catchError
              throw new Error(response.message_Status || 'Error de autenticación');
            }
          }),
          catchError((error) => {
            const errorMsg = error.message || 'Error desconocido';
            return of(loginFailure({ error: errorMsg }));
          })
        )
      )
    )
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(logout),
      tap(() => {
        // Perform any necessary cleanup or side effects before logging out
      }),
      exhaustMap(() => of(logoutSuccess()))
    )
  );

  constructor(
    @Inject(Actions) private actions$: Actions,
    private AuthenticationService: AuthenticationService,
    private router: Router) { }

}