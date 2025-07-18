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

    return next.handle(modifiedRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        
        if (error.status === 0) {

          
          if (request.url.includes('https://localhost')) {

          }
        }
        
        return throwError(() => error);
      })
    );
  }
}
