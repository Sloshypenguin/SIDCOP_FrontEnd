import { Component, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Usuario } from 'src/app/Modelos/acceso/usuarios.Model';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent {
  @Input() usuarioData: Usuario | null = null;
  @Output() onClose = new EventEmitter<void>();

  usuarioDetalle: Usuario | null = null;
  cargando = false;

  mostrarAlertaError = false;
  mensajeError = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['usuarioData'] && changes['usuarioData'].currentValue) {
      this.cargarDetallesSimulado(changes['usuarioData'].currentValue);
    }
  }

  // Simulación de carga
  cargarDetallesSimulado(data: Usuario): void {
    this.cargando = true;
    this.mostrarAlertaError = false;

    setTimeout(() => {
      try {
        this.usuarioDetalle = { ...data };
        this.cargando = false;
      } catch (error) {
        console.error('Error al cargar detalles del usuario:', error);
        this.mostrarAlertaError = true;
        this.mensajeError = 'Error al cargar los detalles del usuario.';
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
    } catch (error) {
      console.error('Error al formatear la fecha:', error);
      return 'Fecha inválida';
    }
  }
}
