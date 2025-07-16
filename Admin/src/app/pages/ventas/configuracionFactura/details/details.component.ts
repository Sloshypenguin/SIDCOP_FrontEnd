import { Component, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfiguracionFactura } from 'src/app/Modelos/ventas/ConfiguracionFactura.Model';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent implements OnChanges {
  @Input() configuracionFacturaData: ConfiguracionFactura | null = null;
  @Output() onClose = new EventEmitter<void>();

  configuracionFacturaDetalle: ConfiguracionFactura | null = null;
  cargando = false;

  mostrarAlertaError = false;
  mensajeError = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['configuracionFacturaData'] && changes['configuracionFacturaData'].currentValue) {
      this.cargarDetallesSimulado(changes['configuracionFacturaData'].currentValue);
    }
  }

  // Simulación de carga
  cargarDetallesSimulado(data: ConfiguracionFactura): void {
    this.cargando = true;
    this.mostrarAlertaError = false;

    setTimeout(() => {
      try {
        this.configuracionFacturaDetalle = { ...data };
        this.cargando = false;
      } catch (error) {
        console.error('Error al cargar detalles de la configuracion de factura:', error);
        this.mostrarAlertaError = true;
        this.mensajeError = 'Error al cargar los detalles de la configuracion de factura.';
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
