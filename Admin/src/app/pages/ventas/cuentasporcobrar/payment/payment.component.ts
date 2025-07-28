import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CuentaPorCobrar } from 'src/app/Modelos/ventas/CuentasPorCobrar.Model';
import { PagoCuentaPorCobrar, FormaPago } from 'src/app/Modelos/ventas/PagoCuentaPorCobrar.Model';
import { CuentasPorCobrarService } from 'src/app/servicios/ventas/cuentas-por-cobrar.service';
import { BreadcrumbsComponent } from 'src/app/shared/breadcrumbs/breadcrumbs.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, BreadcrumbsComponent],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss'
})
export class PaymentComponent implements OnInit, OnDestroy {
  // Breadcrumbs
  breadCrumbItems: Array<{}> = [];

  cuentaId: number = 0;
  cuentaPorCobrar: CuentaPorCobrar | null = null;
  pagoForm: FormGroup;
  formasPago = Object.values(FormaPago);
  
  cargando: boolean = false;
  enviando: boolean = false;
  mostrarAlertaError: boolean = false;
  mostrarAlertaExito: boolean = false;
  mensajeError: string = '';
  mensajeExito: string = '';
  
  // Subscripciones
  private subscripciones: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private cuentasPorCobrarService: CuentasPorCobrarService
  ) {
    this.pagoForm = this.fb.group({
      cpCo_Id: [0, Validators.required],
      pago_Monto: [0, [Validators.required, Validators.min(0.01)]],
      pago_FormaPago: ['EFECTIVO', Validators.required],
      pago_NumeroReferencia: [''],
      pago_Observaciones: ['Pago parcial de factura', Validators.maxLength(500)],
    });
  }

  ngOnInit(): void {
    // Configurar breadcrumbs
    this.breadCrumbItems = [
      { label: 'Ventas' },
      { label: 'Cuentas por Cobrar', active: false },
      { label: 'Registrar Pago', active: true }
    ];
    
    const routeSub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.cuentaId = +params['id'];
        this.cargarDatosCuenta(this.cuentaId);
      } else {
        this.router.navigate(['/ventas/cuentasporcobrar/list']);
      }
    });
    
    this.subscripciones.push(routeSub);
  }

  ngOnDestroy(): void {
    // Desuscribirse para evitar memory leaks
    this.subscripciones.forEach(sub => sub.unsubscribe());
  }

  private cargarDatosCuenta(id: number): void {
    this.cargando = true;
    this.mostrarAlertaError = false;
    
    const detalleSub = this.cuentasPorCobrarService.obtenerCuentaPorCobrarPorId(id).subscribe({
      next: (respuesta: any) => {
        if (respuesta.success && respuesta.data) {
          // Mapear los campos del API a nuestro modelo
          this.cuentaPorCobrar = new CuentaPorCobrar({
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
            cpCo_Estado: true,
            clie_Nombres: respuesta.data.clie_Nombres || '',
            clie_NombreNegocio: respuesta.data.clie_NombreNegocio || ''
          });
          
          this.pagoForm.patchValue({
            cpCo_Id: this.cuentaPorCobrar.cpCo_Id || 0
          });
        } else {
          this.mostrarAlertaError = true;
          this.mensajeError = 'No se encontró la cuenta por cobrar especificada.';
        }
        this.cargando = false;
      },
      error: (error) => {
        this.mostrarAlertaError = true;
        this.mensajeError = 'Error al cargar los datos de la cuenta por cobrar.';
        this.cargando = false;
      }
    });
    
    this.subscripciones.push(detalleSub);
  }

  onSubmit(): void {
    if (this.pagoForm.invalid) {
      this.pagoForm.markAllAsTouched();
      return;
    }

    // Validar que el monto no exceda el saldo pendiente
    if (!this.cuentaPorCobrar) {
      this.mostrarAlertaError = true;
      this.mensajeError = 'Error: No se ha cargado correctamente la información de la cuenta.';
      return;
    }

    const saldoPendiente = this.cuentaPorCobrar?.cpCo_Saldo || 0;
    if (this.pagoForm.value.pago_Monto > saldoPendiente) {
      this.mostrarAlertaError = true;
      this.mensajeError = 'El monto del pago no puede exceder el saldo pendiente.';
      return;
    }

    this.enviando = true;
    this.mostrarAlertaError = false;
    this.mostrarAlertaExito = false;

    // Crear el objeto de pago
    const nuevoPago: PagoCuentaPorCobrar = new PagoCuentaPorCobrar({
      ...this.pagoForm.value,
      pago_Fecha: new Date(),
      usua_Creacion: 1, // Esto vendría del servicio de autenticación
    });

    const submitSub = this.cuentasPorCobrarService.registrarPago(nuevoPago).subscribe({
      next: (respuesta) => {
        if (respuesta.success) {
          this.mostrarAlertaExito = true;
          this.mensajeExito = 'Pago registrado correctamente.';
          
          // Redireccionar después de un tiempo
          setTimeout(() => {
            this.router.navigate(['/ventas/cuentasporcobrar/details', this.cuentaId]);
          }, 2000);
        } else {
          this.mostrarAlertaError = true;
          this.mensajeError = respuesta.message || 'Error al registrar el pago.';
        }
        this.enviando = false;
      },
      error: (error) => {
        this.mostrarAlertaError = true;
        this.mensajeError = 'Error al registrar el pago. Por favor intente nuevamente.';
        this.enviando = false;
      }
    });
    
    this.subscripciones.push(submitSub);
  }

  cancelar(): void {
    this.router.navigate(['/ventas/cuentasporcobrar/details', this.cuentaId]);
  }

  cerrarAlertaError(): void {
    this.mostrarAlertaError = false;
    this.mensajeError = '';
  }

  cerrarAlertaExito(): void {
    this.mostrarAlertaExito = false;
    this.mensajeExito = '';
  }

  formatearFecha(fecha: Date | string | null): string {
    if (!fecha) return 'N/A';
    return new Date(fecha).toLocaleDateString('es-HN');
  }

  formatearMoneda(valor: number | null): string {
    if (valor === null || valor === undefined) return 'L 0.00';
    return new Intl.NumberFormat('es-HN', { style: 'currency', currency: 'HNL' }).format(valor);
  }
}
