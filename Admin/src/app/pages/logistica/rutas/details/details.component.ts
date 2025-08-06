import { Component, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ruta } from 'src/app/Modelos/logistica/Rutas.Model';
import { MapaSelectorComponent } from '../mapa-selector/mapa-selector.component';
import { environment } from 'src/environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Cliente } from 'src/app/Modelos/general/Cliente.Model';
import { DireccionPorCliente } from 'src/app/Modelos/general/DireccionPorCliente.Model';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [
    CommonModule,
    MapaSelectorComponent
  ],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent implements OnChanges {
  @Input() rutaData: Ruta | null = null;
  @Output() onClose = new EventEmitter<void>();

  rutaDetalle: Ruta | null = null;
  cargando = false;
  mostrarAlertaError = false;
  mensajeError = '';

  puntosVista: { lat: number; lng: number; nombre?: string }[] = [];

  cliente: Cliente[] = [];
  clientesFiltrados: Cliente[] = [];
  direcciones: DireccionPorCliente[] = [];

  constructor(private http: HttpClient) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['rutaData'] && changes['rutaData'].currentValue) {
      this.cargarDetallesSimulado(changes['rutaData'].currentValue);
    }
  }

  cargarDetallesSimulado(data: Ruta): void {
    this.cargando = true;
    this.mostrarAlertaError = false;

    setTimeout(() => {
      try {
        this.rutaDetalle = { ...data };
        this.cargando = false;

        // CARGAR CLIENTES CUANDO SE CARGA LA RUTA
        this.cargarClientes();
      } catch (error) {
        console.error('Error al cargar detalles de la ruta:', error);
        this.mostrarAlertaError = true;
        this.mensajeError = 'Error al cargar los detalles de la ruta.';
        this.cargando = false;
      }
    }, 500);
  }

  cargarClientes(): void {
    this.http.get<Cliente[]>(`${environment.apiBaseUrl}/Cliente/Listar/`, {
      headers: { 'x-api-key': environment.apiKey }
    }).subscribe(data => {
      this.cliente = data;

      const rutaIdActual = this.rutaDetalle?.ruta_Id;

      if (rutaIdActual !== undefined) {
        this.clientesFiltrados = this.cliente.filter(c => c.ruta_Id === rutaIdActual);
        console.log('Clientes con ruta_Id =', rutaIdActual, this.clientesFiltrados);

        // PARA CADA CLIENTE FILTRADO, CARGAMOS LAS DIRECCIONES Y OBTENEMOS LATITUD/LONGITUD
        this.clientesFiltrados.forEach(cliente => {
          this.cargarDirecciones(cliente);
        });
      } else {
        console.warn('No hay rutaDetalle.id para filtrar clientes.');
      }
    }, error => {
      console.error('Error al cargar clientes:', error);
    });
  }

  cargarDirecciones(cliente: Cliente): void {
    this.http.get<DireccionPorCliente[]>(`${environment.apiBaseUrl}/DireccionesPorCliente/Buscar/${cliente.clie_Id}`, {
      headers: { 'x-api-key': environment.apiKey }
    }).subscribe(data => {
      this.direcciones = data || [];
      this.puntosVista = this.direcciones.map(d => ({
        lat: d.diCl_Latitud,
        lng: d.diCl_Longitud,
        nombre: d.diCl_Observaciones
      }));
    }, error => {
      console.error('Error al cargar direcciones de cliente:', error);
    });
  }

  cerrar(): void {
    this.onClose.emit();
    this.puntosVista = [];
  }

  cerrarAlerta(): void {
    this.mostrarAlertaError = false;
    this.mensajeError = '';
  }

  formatearFecha(fecha: string | Date | null): string {
    if (!fecha) return 'N/A';
    const dateObj = typeof fecha === 'string' ? new Date(fecha) : fecha;
    if (isNaN(dateObj.getTime())) return 'N/A';
    return dateObj.toLocaleString('es-HN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
