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
  selector: 'app-create',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, BreadcrumbsComponent],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent implements OnInit, OnDestroy {
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
      { label: 'Nueva Cuenta', active: true }
    ];
    
    const routeSub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.cuentaId = +params['id'];
        this.cargarDatosCuenta(this.cuentaId);
      } else {
        this.router.navigate(['/pages/ventas/cuentasporcobrar/list']);
      }
    });
    
    this.subscripciones.push(routeSub);
  }

  cargarDatosCuenta(id: number): void {
    this.cargando = true;
    this.mostrarAlertaError = false;

    const detalleSub = this.cuentasPorCobrarService.obtenerCuentaPorCobrarPorId(id).subscribe({
      next: (respuesta) => {
        if (respuesta.success && respuesta.data) {
          this.cuentaPorCobrar = respuesta.data;
          this.pagoForm.patchValue({
            cpCo_Id: this.cuentaPorCobrar.cpCo_Id
          });
        } else {
          this.mostrarAlertaError = true;
          this.mensajeError = 'No se pudo cargar la información de la cuenta por cobrar.';
        }
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar datos de la cuenta por cobrar:', error);
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

    const saldoPendiente = this.cuentaPorCobrar.cpCo_Saldo || 0;
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
            this.router.navigate(['/pages/ventas/cuentasporcobrar/details', this.cuentaId]);
          }, 2000);
        } else {
          this.mostrarAlertaError = true;
          this.mensajeError = respuesta.message || 'Error al registrar el pago.';
        }
        this.enviando = false;
      },
      error: (error) => {
        console.error('Error al registrar pago:', error);
        this.mostrarAlertaError = true;
        this.mensajeError = 'Error al registrar el pago. Por favor intente nuevamente.';
        this.enviando = false;
      }
    });
    
    this.subscripciones.push(submitSub);
  }

  cancelar(): void {
    this.router.navigate(['/pages/ventas/cuentasporcobrar/list']);
  }

  ngOnDestroy(): void {
    // Desuscribirse para evitar memory leaks
    this.subscripciones.forEach(sub => sub.unsubscribe());
  }

  cerrarAlertaError(): void {
    this.mostrarAlertaError = false;
    this.mensajeError = '';
  }

  cerrarAlertaExito(): void {
    this.mostrarAlertaExito = false;
    this.mensajeExito = '';
  }

  formatearMoneda(valor: number | undefined): string {
    if (valor === undefined) return 'L 0.00';
    return valor.toLocaleString('es-HN', {
      style: 'currency',
      currency: 'HNL',
      minimumFractionDigits: 2
    });
  }

  esCampoInvalido(campo: string): boolean {
    const control = this.pagoForm.get(campo);
    return control !== null && control.invalid && (control.dirty || control.touched);
  }

  obtenerMensajeError(campo: string): string {
    const control = this.pagoForm.get(campo);
    
    if (!control) return '';
    
    if (control.hasError('required')) {
      return 'Este campo es requerido.';
    }
    
    if (control.hasError('min')) {
      return 'El valor debe ser mayor que 0.';
    }
    
    if (control.hasError('maxlength')) {
      return 'El texto excede el límite permitido.';
    }
    
    return 'Campo inválido.';
  }
}
