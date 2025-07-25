import { Component, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Descuento } from 'src/app/Modelos/inventario/DescuentoModel';


@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent implements OnChanges {
  @Input() descuentoData: Descuento | null = null;
  @Output() onClose = new EventEmitter<void>();

  descuentoDetalle: Descuento | null = null;
  cargando = false;

  mostrarAlertaError = false;
  mensajeError = '';
  referenciasLista = [];
  clientesLista = [];
  referenciasNombre : any[] = [];
  ClientesNombre : any[] = [];
escalasParsed: any[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['descuentoData'] && changes['descuentoData'].currentValue) {
      this.cargarDetallesSimulado(changes['descuentoData'].currentValue);
    }
    
     

  }

  // Simulación de carga
  cargarDetallesSimulado(data: Descuento): void {
    this.cargando = true;
    this.mostrarAlertaError = false;

    setTimeout(() => {
      try {
        this.descuentoDetalle = { ...data };
        this.cargando = false;
         this.referenciasLista = JSON.parse(this.descuentoDetalle.referencias ?? '[]');
       this.clientesLista = JSON.parse(this.descuentoDetalle.clientes ?? '[]');
        this.referenciasNombre = this.referenciasLista.map((r: any) => r.nombre);
        this.ClientesNombre = this.clientesLista.map((r: any) => r.nombre);
        if (typeof this.descuentoDetalle.escalas === 'string') {
          this.escalasParsed = JSON.parse(this.descuentoDetalle.escalas);
        }
      } catch (error) {
        console.error('Error al cargar detalles del descuento:', error);
        this.mostrarAlertaError = true;
        this.mensajeError = 'Error al cargar los detalles del vendedor.';
        this.cargando = false;
      }
    }, 500); // Simula tiempo de carga
  }

  cerrar(): void {
    this.onClose.emit();
  }

  cerrarAlerta(): void {
    this.mostrarAlertaError = false;
    this.mensajeError = '';
  }

  formatearFecha(fecha: string | Date | null): string {
    if (!fecha) return 'N/A';
    try {
      const date = new Date(fecha);
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return String(fecha);
    }
  }
}
