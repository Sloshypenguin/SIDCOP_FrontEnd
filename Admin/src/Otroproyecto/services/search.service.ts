import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Respuesta } from '../models/respuesta.model';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private apiUrl = 'https://localhost:7211';

  constructor(private http: HttpClient) { }

  searchClientes(searchTerm: string): Observable<Respuesta<any[]>> {
    // Solo enviar el parámetro Clie_Nombre como solicitó el usuario
    return this.http.post<Respuesta<any[]>>(`${this.apiUrl}/Clientes/Detalle`, { 
      Clie_Nombre: searchTerm
    }).pipe(
      map(response => {
        if (response && response.data) {
          // Formatear los resultados para mostrar en el dropdown
          response.data = response.data.map(cliente => ({
            ...cliente,
            // Añadir una propiedad displayText para mostrar en el dropdown
            displayText: `${cliente.clie_Nombre} ${cliente.clie_Apellido} (${cliente.clie_DNI})`
          }));
        }
        return response;
      })
    );
  }

  searchEmpleados(searchTerm: string): Observable<Respuesta<any[]>> {
    // Solo enviar el parámetro Empl_Nombre como solicitó el usuario
    return this.http.post<Respuesta<any[]>>(`${this.apiUrl}/Empleados/Detalle`, { 
      Empl_Nombre: searchTerm
    }).pipe(
      map(response => {
        if (response && response.data) {
          // Formatear los resultados para mostrar en el dropdown
          response.data = response.data.map(empleado => ({
            ...empleado,
            // Añadir una propiedad displayText para mostrar en el dropdown
            displayText: `${empleado.empl_Nombres} ${empleado.empl_Apellidos} (${empleado.empl_DNI})`
          }));
        }
        return response;
      })
    );
  }
}
