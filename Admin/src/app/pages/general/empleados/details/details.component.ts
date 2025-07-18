import { Component, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Empleado } from 'src/app/Modelos/general/Empleado.Model';
@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl:'./details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent implements OnChanges{
    @Input() empleadoData: Empleado | null = null;
    @Output() onClose = new EventEmitter<void>();
  
    empleadoDetalle: Empleado | null = null;
    cargando = false;
  
    mostrarAlertaError = false;
    mensajeError = '';
  
    ngOnChanges(changes: SimpleChanges): void {
      if (changes['empleadoData'] && changes['empleadoData'].currentValue) {
        this.cargarDetallesSimulado(changes['empleadoData'].currentValue);
      }
    }
  
    // Simulación de carga
    cargarDetallesSimulado(data: Empleado): void {
      this.cargando = true;
      this.mostrarAlertaError = false;
  
      setTimeout(() => {
        try {
          this.empleadoDetalle = { ...data };
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
