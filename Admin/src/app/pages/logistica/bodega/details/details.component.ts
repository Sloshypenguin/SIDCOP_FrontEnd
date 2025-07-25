import { Component, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Bodega } from 'src/app/Modelos/logistica/Bodega.Model';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent implements OnChanges {
  @Input() bodegaData: Bodega | null = null;
  @Output() onClose = new EventEmitter<void>();

  bodegaDetalle: Bodega | null = null;
  cargando = false;

  mostrarAlertaError = false;
  mensajeError = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['bodegaData'] && changes['bodegaData'].currentValue) {
      this.cargarDetallesSimulado(changes['bodegaData'].currentValue);
    }
  }

  // Simulación de carga
  cargarDetallesSimulado(data: Bodega): void {
    this.cargando = true;
    this.mostrarAlertaError = false;

    setTimeout(() => {
      try {
        this.bodegaDetalle = { ...data };
        this.cargando = false;
      } catch (error) {
        console.error('Error al cargar detalles del estado civil:', error);
        this.mostrarAlertaError = true;
        this.mensajeError = 'Error al cargar los detalles de la bodega.';
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
