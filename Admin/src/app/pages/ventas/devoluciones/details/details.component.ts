import { Component, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Devoluciones } from 'src/app/Modelos/ventas/Devoluciones.Model';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent implements OnChanges {
  @Input() DevolucionesData: Devoluciones | null = null;
  @Output() onClose = new EventEmitter<void>();

  devolucionesDetalle: Devoluciones | null = null;
  cargando = false;
  mostrarAlertaError = false;
  mensajeError = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['DevolucionesData'] && changes['DevolucionesData'].currentValue) {
      this.cargarDetallesSimulado(changes['DevolucionesData'].currentValue);
    }
  }

  cargarDetallesSimulado(data: Devoluciones): void {
    this.cargando = true;
    this.mostrarAlertaError = false;
    setTimeout(() => {
      try {
        this.devolucionesDetalle = { ...data };
        this.cargando = false;
      } catch (error) {
        this.mostrarAlertaError = true;
        this.mensajeError = 'Error al cargar los detalles del proveedor.';
        this.cargando = false;
      }
    }, 500);
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
