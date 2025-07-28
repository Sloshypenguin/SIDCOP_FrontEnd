import { Component, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Cliente } from 'src/app/Modelos/general/Cliente.Model';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent implements OnChanges {
  @Input() clienteData: Cliente | null = null;
  @Output() onClose = new EventEmitter<void>();

  clienteDetalle: Cliente | null = null;
  cargando = false;

  mostrarAlertaError = false;
  mensajeError = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['clienteData'] && changes['clienteData'].currentValue) {
      this.cargarDetallesSimulado(changes['clienteData'].currentValue);
    }
  }

  // Simulación de carga
  cargarDetallesSimulado(data: Cliente): void {
    this.cargando = true;
    this.mostrarAlertaError = false;

    setTimeout(() => {
      try {
        this.clienteDetalle = { ...data };
        this.cargando = false;
      } catch (error) {
        console.error('Error al cargar detalles del cliente:', error);
        this.mostrarAlertaError = true;
        this.mensajeError = 'Error al cargar los detalles del cliente.';
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
