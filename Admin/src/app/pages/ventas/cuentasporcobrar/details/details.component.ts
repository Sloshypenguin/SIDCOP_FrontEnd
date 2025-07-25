import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CuentaPorCobrar } from 'src/app/Modelos/ventas/CuentasPorCobrar.Model';
import { PagoCuentaPorCobrar } from 'src/app/Modelos/ventas/PagoCuentaPorCobrar.Model';
import { CuentasPorCobrarService } from 'src/app/servicios/ventas/cuentas-por-cobrar.service';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
  cuentaPorCobrarId: number = 0;
  cuentaPorCobrarDetalle: CuentaPorCobrar | null = null;
  pagos: PagoCuentaPorCobrar[] = [];
  totalPagado: number = 0;
  cargando: boolean = false;

  mostrarAlertaError: boolean = false;
  mensajeError: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private cuentasPorCobrarService: CuentasPorCobrarService
  ) { }

  ngOnInit(): void {
    // Obtener el ID de la cuenta por cobrar de los parámetros de la ruta
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.cuentaPorCobrarId = +params['id'];
        this.cargarDatos();
      } else {
        this.router.navigate(['/ventas/cuentasporcobrar/list']);
      }
    });
  }

  private cargarDatos(): void {
    this.cargando = true;
    this.mostrarAlertaError = false;
    
    // Cargar datos de la cuenta por cobrar
    this.cuentasPorCobrarService.obtenerCuentaPorCobrarPorId(this.cuentaPorCobrarId).subscribe({
      next: (respuesta) => {
        if (respuesta.success && respuesta.data) {
          // Mapear los datos de la API a nuestro modelo usando el constructor
          this.cuentaPorCobrarDetalle = new CuentaPorCobrar({
            cpCo_Id: respuesta.data.cpCo_Id,
            clie_Id: respuesta.data.clie_Id,
            fact_Id: respuesta.data.fact_Id,
            cpCo_FechaEmision: new Date(respuesta.data.cpCo_FechaEmision),
            cpCo_FechaVencimiento: new Date(respuesta.data.cpCo_FechaVencimiento),
            cpCo_Valor: respuesta.data.cpCo_Valor,
            cpCo_Saldo: respuesta.data.cpCo_Saldo,
            cpCo_Observaciones: respuesta.data.cpCo_Observaciones || '',
            cpCo_Anulado: respuesta.data.cpCo_Anulado,
            cpCo_Saldada: respuesta.data.cpCo_Saldada,
            cpCo_Estado: respuesta.data.cpCo_Estado,
            usua_Creacion: respuesta.data.usua_Creacion,
            cpCo_FechaCreacion: new Date(respuesta.data.cpCo_FechaCreacion),
            usua_Modificacion: respuesta.data.usua_Modificacion,
            cpCo_FechaModificacion: respuesta.data.cpCo_FechaModificacion ? new Date(respuesta.data.cpCo_FechaModificacion) : undefined,
            clie_Codigo: '',
            clie_Nombres: respuesta.data.clie_Nombres || '',
            clie_Apellidos: respuesta.data.clie_Apellidos || '',
            clie_NombreNegocio: respuesta.data.clie_NombreNegocio || '',
            clie_Telefono: respuesta.data.clie_Telefono || '',
            clie_LimiteCredito: 0,
            clie_Saldo: 0,
            usuarioCreacion: respuesta.data.usuarioCreacion || '',
            usuarioModificacion: respuesta.data.usuarioModificacion || ''
          });
          
          // Cargar pagos de esta cuenta
          this.cargarPagos();
        } else {
          this.mostrarAlertaError = true;
          this.mensajeError = 'No se pudo cargar la información de la cuenta por cobrar.';
          this.cargando = false;
        }
      },
      error: (error: any) => {
        this.mostrarAlertaError = true;
        this.mensajeError = 'Error al conectar con el servidor. Intente nuevamente más tarde.';
        this.cargando = false;
      }
    });
  }

  private cargarPagos(): void {
    this.cuentasPorCobrarService.obtenerPagosPorCuenta(this.cuentaPorCobrarId).subscribe({
      next: (respuesta) => {
        if (respuesta.success && respuesta.data) {
          this.pagos = respuesta.data;
          this.totalPagado = this.calcularTotalPagado();
        } else {
          this.pagos = [];
          this.totalPagado = 0;
        }
        this.cargando = false;
      },
      error: (error: any) => {
        this.pagos = [];
        this.totalPagado = 0;
        this.cargando = false;
      }
    });
  }

  cerrar(): void {
    this.router.navigate(['list'], { relativeTo: this.route.parent });
  }

  registrarPago(): void {
    if (this.cuentaPorCobrarId) {
      this.router.navigate(['../payment', this.cuentaPorCobrarId], { relativeTo: this.route.parent });
    }
  }

  cerrarAlerta(): void {
    this.mostrarAlertaError = false;
    this.mensajeError = '';
  }

  formatearFecha(fecha: Date | string | null): string {
    if (!fecha) return 'N/A';
    return new Date(fecha).toLocaleDateString('es-HN');
  }

  formatearMoneda(valor: number | null): string {
    if (valor === null || valor === undefined) return 'L 0.00';
    return new Intl.NumberFormat('es-HN', { style: 'currency', currency: 'HNL' }).format(valor);
  }

  calcularDiasVencimiento(): number {
    if (!this.cuentaPorCobrarDetalle || !this.cuentaPorCobrarDetalle.cpCo_FechaVencimiento) {
      return 0;
    }
    
    const fechaActual = new Date();
    const fechaVencimiento = new Date(this.cuentaPorCobrarDetalle.cpCo_FechaVencimiento);
    
    const diferencia = fechaVencimiento.getTime() - fechaActual.getTime();
    return Math.ceil(diferencia / (1000 * 3600 * 24));
  }

  estaVencida(): boolean {
    return this.calcularDiasVencimiento() < 0;
  }

  calcularTotalPagado(): number {
    return this.pagos
      .filter(pago => !pago.pago_Anulado)
      .reduce((total, pago) => total + (pago.pago_Monto || 0), 0);
  }
}
