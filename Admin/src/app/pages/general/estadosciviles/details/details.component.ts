import { Component, Output, EventEmitter, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { EstadoCivil } from 'src/app/Modelos/general/EstadoCivil.Model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent implements OnInit, OnChanges {
  @Input() estadoCivilId: number = 0;
  @Input() estadoCivilData: EstadoCivil | null = null;
  @Output() onClose = new EventEmitter<void>();
  
  mostrarAlertaError = false;
  mensajeError = '';
  cargando = false;

  constructor(private http: HttpClient) {}

  estadoCivilDetalle: any = null;

  ngOnInit(): void {
    if (this.estadoCivilData) {
      this.cargarDetalles();
    } else if (this.estadoCivilId > 0) {
      this.cargarDetalles();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['estadoCivilData'] && changes['estadoCivilData'].currentValue) {
      this.cargarDetalles();
    }
  }

  cargarDetalles(): void {
    const id = this.estadoCivilData?.esCv_Id || this.estadoCivilId;
    if (!id) return;

    this.cargando = true;
    this.mostrarAlertaError = false;
    
    this.http.get<any>(`${environment.apiBaseUrl}/EstadosCiviles/Buscar/${id}`, {
      headers: { 
        'X-Api-Key': environment.apiKey,
        'accept': '*/*'
      }
    }).subscribe({
      next: (response) => {
        console.log('Detalles del estado civil:', response);
        this.estadoCivilDetalle = response;
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar detalles del estado civil:', error);
        this.mostrarAlertaError = true;
        this.mensajeError = 'Error al cargar los detalles del estado civil.';
        this.cargando = false;
      }
    });
  }

  cerrar(): void {
    this.onClose.emit();
  }

  cerrarAlerta(): void {
    this.mostrarAlertaError = false;
    this.mensajeError = '';
  }

  formatearFecha(fecha: string | null): string {
    if (!fecha) return 'N/A';
    try {
      const date = new Date(fecha);
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return fecha;
    }
  }
}
