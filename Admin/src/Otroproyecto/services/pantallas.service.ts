import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pantalla } from '../models/pantalla.model';
import { Respuesta } from '../models/respuesta.model';

@Injectable({
  providedIn: 'root'
})
export class PantallasService {
  private apiUrl = 'https://localhost:7211';
  
  constructor(private http: HttpClient) { }

  /**
   * Obtiene las pantallas asignadas a un rol específico
   * @param roleId ID del rol
   * @returns Observable con la respuesta que contiene las pantallas asignadas
   */
  obtenerPantallasAsignadas(roleId: number): Observable<Respuesta<Pantalla[]>> {
    return this.http.post<Respuesta<Pantalla[]>>(`${this.apiUrl}/Pantallas/ListarAsignadas`, {
      role_Id: roleId
    });
  }
  
  /**
   * Obtiene todas las pantallas del sistema
   * @returns Observable con la respuesta que contiene todas las pantallas
   */
  obtenerTodasLasPantallas(): Observable<Respuesta<Pantalla[]>> {
    return this.http.get<Respuesta<Pantalla[]>>(`${this.apiUrl}/Pantallas/Listar`);
  }
}
