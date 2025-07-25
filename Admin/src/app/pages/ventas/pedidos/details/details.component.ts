import { Component, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Pedido } from 'src/app/Modelos/ventas/Pedido.Model';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent implements OnChanges {
  @Input() PedidoData: Pedido | null = null;
  @Output() onClose = new EventEmitter<void>();

  PEDetalle: Pedido | null = null;
  cargando = false;

  mostrarAlertaError = false;
  mensajeError = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['PedidoData'] && changes['PedidoData'].currentValue) {
      this.cargarDetallesSimulado(changes['PedidoData'].currentValue);
    }
  }

  // Simulación de carga
  cargarDetallesSimulado(data: Pedido): void {
    this.cargando = true;
    this.mostrarAlertaError = false;

    setTimeout(() => {
      try {
        this.PEDetalle = { ...data };
        this.cargando = false;
      } catch (error) {
        console.error('Error al cargar detalles del estado civil:', error);
        this.mostrarAlertaError = true;
        this.mensajeError = 'Error al cargar los detalles del estado civil.';
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
