import { Component, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Cliente } from 'src/app/Modelos/general/Cliente.Model';
import { DireccionPorCliente } from 'src/app/Modelos/general/DireccionPorCliente.Model';
import { environment } from 'src/environments/environment.prod';
import { HttpClient } from '@angular/common/http';

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
  direccionesPorClienteDetalle: DireccionPorCliente | null = null;
  cargando = false;

  mostrarAlertaError = false;
  mensajeError = '';
  colonias: any[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['clienteData'] && changes['clienteData'].currentValue) {
      this.cargarDetallesSimulado(changes['clienteData'].currentValue);
    }

    this.cargarColonias();
  }

  // Simulación de carga
  cargarDetallesSimulado(data: Cliente): void {
    this.cargando = true;
    this.mostrarAlertaError = false;

    setTimeout(() => {
      try {
        this.clienteDetalle = { ...data };
        this.cargando = false;

        this.cargarDirecciones();
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

  constructor(private http: HttpClient){}
  direcciones: any = [];
  // cargarDirecciones(): void {
  //   this.http.get<DireccionPorCliente[]>(`${environment.apiBaseUrl}/DireccionesPorCliente/Listar`, {
  //     headers:{ 'x-api-key': environment.apiKey }
  //   }).subscribe(data=>{
  //     this.direcciones=data||[];
  //     if(this.direcciones){
  //       this.clienteDetalle?.clie_Id
  //     }
  //   })
  // }

  cargarDirecciones(): void {
  this.http.get<DireccionPorCliente[]>(`${environment.apiBaseUrl}/DireccionesPorCliente/Listar`, {
    headers: { 'x-api-key': environment.apiKey }
    }).subscribe(data => {
      const todasLasDirecciones = data || [];
      if (this.clienteDetalle?.clie_Id != null) {
        this.direcciones = todasLasDirecciones.filter(d =>
          d.clie_Id === this.clienteDetalle?.clie_Id
        );
      } else {
        this.direcciones = [];
      }
    });
  }

  cargarColonias(): void {
  this.http.get<any[]>(`${environment.apiBaseUrl}/Colonia/Listar`, {
    headers: { 'x-api-key': environment.apiKey }
    }).subscribe(data => {
      this.colonias = data || [];
    });
  }

  obtenerDescripcionColonia(colo_Id: number): string {
    const colonia = this.colonias.find(c => c.colo_Id === colo_Id);
    return colonia?.colo_Descripcion || 'Colonia no encontrada';
  }
}
