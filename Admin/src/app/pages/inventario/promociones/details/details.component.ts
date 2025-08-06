import { Component, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Producto } from 'src/app/Modelos/inventario/Producto.Model';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent implements OnChanges{
  @Input() productoData: Producto | null = null;
  @Output() onClose = new EventEmitter<void>();

  productoDetalle: Producto | null = null;
  cargando = false;

  mostrarAlertaError = false;
  mensajeError = '';

  productosPromocion: any[] = [];

  clientesPromocion: any[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['productoData'] && changes['productoData'].currentValue) {
      this.cargarDetallesSimulado(changes['productoData'].currentValue);

      // Parsear productos de la promoción si existen
      const productosRaw = changes['productoData'].currentValue.productos ?? '[]';
      try {
        let productosJson = productosRaw;
        if (typeof productosJson === 'string') {
          productosJson = productosJson.trim();
          if (productosJson.startsWith('"') && productosJson.endsWith('"')) {
            productosJson = productosJson.slice(1, -1);
          }
          productosJson = productosJson.replace(/\\"/g, '"');
        }
        this.productosPromocion = JSON.parse(productosJson);
      } catch {
        this.productosPromocion = [];
      }

      // Parsear clientes de la promoción si existen
      const clientesRaw = changes['productoData'].currentValue.clientes ?? '[]';
      try {
        let clientesJson = clientesRaw;
        if (typeof clientesJson === 'string') {
          clientesJson = clientesJson.trim();
          if (clientesJson.startsWith('"') && clientesJson.endsWith('"')) {
            clientesJson = clientesJson.slice(1, -1);
          }
          clientesJson = clientesJson.replace(/\\"/g, '"');
        }
        this.clientesPromocion = JSON.parse(clientesJson);
      } catch {
        this.clientesPromocion = [];
      }
    }
  }

  // Simulación de carga
  cargarDetallesSimulado(data: Producto): void {
    this.cargando = true;
    this.mostrarAlertaError = false;

    setTimeout(() => {
      try {
        this.productoDetalle = { ...data };
        this.cargando = false;
      } catch (error) {
        console.error('Error al cargar detalles del producto:', error);
        this.mostrarAlertaError = true;
        this.mensajeError = 'Error al cargar los detalles del producto.';
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
