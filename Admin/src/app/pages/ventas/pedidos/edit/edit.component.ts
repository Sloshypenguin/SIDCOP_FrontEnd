import { Component, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Pedido } from 'src/app/Modelos/ventas/Pedido.Model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class EditComponent implements OnChanges {
  @Input() PedidoData: Pedido | null = null;
  @Output() onCancel = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<Pedido>();

  pedido: Pedido = {
    pedi_Id: 0,
    diCl_Id: 0,
    vend_Id: 0,
    pedi_FechaPedido: new Date(),
    pedi_FechaEntrega: new Date(),
    clie_Codigo: '',
    clie_NombreNegocio: '',
    clie_Nombres: '',
    clie_Apellidos: '',
    colo_Descripcion: '',
    muni_Descripcion: '',
    depa_Descripcion: '',
    diCl_DireccionExacta: '',
    vend_Nombres: '',
    vend_Apellidos: '',
    prod_Codigo: '',
    prod_Descripcion: '',
    peDe_ProdPrecio: 0,
    peDe_Cantidad: 0,
    detalles: [],

    usua_Creacion: 0,
    usua_Modificacion: 0,
  
    pedi_FechaCreacion: new Date(),
    pedi_FechaModificacion: new Date(),
    code_Status: 0,
    message_Status: '',
    usuarioCreacion: '',
    usuarioModificacion: '',
    secuencia: 0,
    pedi_Estado: false,
  };


  PEOriginal = '';
  mostrarErrores = false;
  mostrarAlertaExito = false;
  mensajeExito = '';
  mostrarAlertaError = false;
  mensajeError = '';
  mostrarAlertaWarning = false;
  mensajeWarning = '';
  mostrarConfirmacionEditar = false;
  Sucursales: any[] = [];

   cargarSucursales() {
      this.http.get<any>('https://localhost:7071/Sucursales/Listar', {
        headers: { 'x-api-key': environment.apiKey }
      }).subscribe((data) => this.Sucursales = data);
    };

  constructor(private http: HttpClient) {
    this.cargarSucursales();

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['PedidoData'] && changes['PedidoData'].currentValue) {
      this.pedido = { ...changes['PedidoData'].currentValue };
      this.PEOriginal = this.pedido.muni_Descripcion || '';
      this.mostrarErrores = false;
      this.cerrarAlerta();
    }
  }

  cancelar(): void {
    this.cerrarAlerta();
    this.onCancel.emit();
  }

  cerrarAlerta(): void {
    this.mostrarAlertaExito = false;
    this.mensajeExito = '';
    this.mostrarAlertaError = false;
    this.mensajeError = '';
    this.mostrarAlertaWarning = false;
    this.mensajeWarning = '';
  }

  validarEdicion(): void {
    this.mostrarErrores = true;

    if (this.pedido.muni_Descripcion.trim()) {
      if (this.pedido.depa_Descripcion.trim() !== this.PEOriginal) {
        this.mostrarConfirmacionEditar = true;
      } else {
        this.mostrarAlertaWarning = true;
        this.mensajeWarning = 'No se han detectado cambios.';
        setTimeout(() => this.cerrarAlerta(), 4000);
      }
    } else {
      this.mostrarAlertaWarning = true;
      this.mensajeWarning = 'Por favor complete todos los campos requeridos antes de guardar.';
      setTimeout(() => this.cerrarAlerta(), 4000);
    }
  }

  cancelarEdicion(): void {
    this.mostrarConfirmacionEditar = false;
  }

  confirmarEdicion(): void {
    this.mostrarConfirmacionEditar = false;
    this.guardar();
  }

  private guardar(): void {
    this.mostrarErrores = true;

    if (this.pedido.muni_Descripcion.trim()) {
      const PEActualizar = {
        //Meter JSON
      };

      this.http.put<any>(`${environment.apiBaseUrl}/Pedido/Actualizar`, PEActualizar, {
        headers: {
          'X-Api-Key': environment.apiKey,
          'Content-Type': 'application/json',
          'accept': '*/*'
        }
      }).subscribe({
        next: (response) => {
          this.mensajeExito = `Punto de Emision "${this.pedido.muni_Descripcion}" actualizado exitosamente`;
          this.mostrarAlertaExito = true;
          this.mostrarErrores = false;

          setTimeout(() => {
            this.mostrarAlertaExito = false;
            this.onSave.emit(this.pedido);
            this.cancelar();
          }, 3000);
        },
        error: (error) => {
          console.error('Error al actualizar Punto de Emision:', error);
          this.mostrarAlertaError = true;
          this.mensajeError = 'Error al actualizar el Punto de Emision. Por favor, intente nuevamente.';
          setTimeout(() => this.cerrarAlerta(), 5000);
        }
      });
    } else {
      this.mostrarAlertaWarning = true;
      this.mensajeWarning = 'Por favor complete todos los campos requeridos antes de guardar.';
      setTimeout(() => this.cerrarAlerta(), 4000);
    }
  }
}
