import { Component, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ruta } from 'src/app/Modelos/logistica/Rutas.Model'; 
// import { GoogleMapsModule } from '@angular/google-maps';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, 
    // GoogleMapsModule
  ],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent implements OnChanges {
  @Input() rutaData: Ruta | null = null;
  @Output() onClose = new EventEmitter<void>();

  // zoom = 12;
  // center: google.maps.LatLngLiteral = { lat: 15.50417, lng: -88.0555 };

  rutaDetalle: Ruta | null = null;
  cargando = false;

  mostrarAlertaError = false;
  mensajeError = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['rutaData'] && changes['rutaData'].currentValue) {
      this.cargarDetallesSimulado(changes['rutaData'].currentValue);
    }
  }

  // Simulación de carga
  cargarDetallesSimulado(data: Ruta): void {
    this.cargando = true;
    this.mostrarAlertaError = false;

    setTimeout(() => {
      try {
        this.rutaDetalle = { ...data };
        this.cargando = false;
      } catch (error) {
        console.error('Error al cargar detalles de la ruta:', error);
        this.mostrarAlertaError = true;
        this.mensajeError = 'Error al cargar los detalles de la ruta.';
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
