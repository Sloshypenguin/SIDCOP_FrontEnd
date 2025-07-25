import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { CuentaPorCobrar } from 'src/app/Modelos/ventas/CuentasPorCobrar.Model';
import { PagoCuentaPorCobrar } from 'src/app/Modelos/ventas/PagoCuentaPorCobrar.Model';

@Injectable({
  providedIn: 'root'
})
export class CuentasPorCobrarService {

  private apiUrl = environment.apiBaseUrl;
  private headers = { 'x-api-key': environment.apiKey };

  constructor(private http: HttpClient) { }

  /**
   * Obtiene todas las cuentas por cobrar
   * @param soloActivas Si es true, solo devuelve cuentas activas
   * @param soloVencidas Si es true, solo devuelve cuentas vencidas
   * @returns Lista de cuentas por cobrar
   */
  obtenerCuentasPorCobrar(soloActivas: boolean = true, soloVencidas: boolean = false): Observable<any> {
    let params = new HttpParams()
      .set('soloActivas', soloActivas.toString())
      .set('soloVencidas', soloVencidas.toString());
    
    return this.http.get(`${this.apiUrl}/CuentasPorCobrar/Listar`, {
      headers: this.headers,
      params: params
    });
  }

  /**
   * Obtiene una cuenta por cobrar por su ID
   * @param id ID de la cuenta por cobrar
   * @returns Detalles de la cuenta por cobrar
   */
  obtenerCuentaPorCobrarPorId(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/CuentasPorCobrar/ObtenerPorId/${id}`, {
      headers: this.headers
    });
  }

  /**
   * Obtiene todos los pagos de una cuenta por cobrar
   * @param cuentaId ID de la cuenta por cobrar
   * @returns Lista de pagos de la cuenta
   */
  obtenerPagosPorCuenta(cuentaId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/PagosCuentasPorCobrar/ListarPorCuentaPorCobrar/${cuentaId}`, {
      headers: this.headers
    });
  }

  /**
   * Registra un nuevo pago para una cuenta por cobrar
   * @param pago Datos del pago a registrar
   * @returns Resultado de la operación
   */
  registrarPago(pago: PagoCuentaPorCobrar): Observable<any> {
    return this.http.post(`${this.apiUrl}/PagosCuentasPorCobrar/Insertar`, pago, {
      headers: this.headers
    });
  }

  /**
   * Anula un pago existente
   * @param pagoId ID del pago a anular
   * @param motivo Motivo de la anulación
   * @returns Resultado de la operación
   */
  anularPago(pagoId: number, motivo: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/PagosCuentasPorCobrar/Anular/${pagoId}`, { motivo }, {
      headers: this.headers
    });
  }

  /**
   * Elimina una cuenta por cobrar
   * @param id ID de la cuenta por cobrar a eliminar
   * @returns Resultado de la operación
   */
  eliminarCuentaPorCobrar(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/CuentasPorCobrar/Eliminar/${id}`, {}, {
      headers: this.headers
    });
  }
}
