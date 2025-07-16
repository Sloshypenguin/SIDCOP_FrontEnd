import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class SslBypassInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Clonar la solicitud para agregar headers personalizados
    const modifiedRequest = request.clone({
      // No modificamos la solicitud, solo la pasamos a través del interceptor
      // Este interceptor es solo un punto de enganche para depuración
    });

    console.log('Enviando solicitud HTTP a:', request.url);
    console.log('Método:', request.method);
    console.log('Headers:', request.headers);
    console.log('Body:', request.body);

    return next.handle(modifiedRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error en la solicitud HTTP:', error);
        
        if (error.status === 0) {
          console.error('Error de conexión. Posibles causas:');
          console.error('- El servidor no está en ejecución');
          console.error('- Hay un problema con el certificado SSL');
          console.error('- El puerto es incorrecto');
          console.error('- Hay un problema de CORS');
          
          if (request.url.includes('https://localhost')) {
            console.warn('Estás usando HTTPS con localhost. Asegúrate de que:');
            console.warn('1. Has aceptado el certificado SSL autofirmado en el navegador');
            console.warn('2. El backend está configurado para usar HTTPS');
            console.warn('3. El puerto es correcto');
          }
        }
        
        return throwError(() => error);
      })
    );
  }
}
