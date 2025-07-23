import { Component, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Rol } from 'src/app/Modelos/acceso/roles.Model';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from 'src/environments/environment';

interface Permiso {
  perm_Id: number;
  acPa_Id: number;
  role_Id: number;
  role_Descripcion: string;
  pant_Id: number;
  pant_Descripcion: string;
  acci_Id: number;
  acci_Descripcion: string;
  usua_Creacion: number;
  perm_FechaCreacion: string;
  usua_Modificacion: number;
  perm_FechaModificacion: string;
}

interface PantallaPermisos {
  descripcion: string;
  acciones: string[];
}

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent implements OnChanges {
  @Input() rolData: Rol | null = null;
  @Output() onClose = new EventEmitter<void>();

  rolDetalle: Rol | null = null;
  cargando = false;

  mostrarAlertaError = false;
  mensajeError = '';

  permisosPorPantalla: Map<number, PantallaPermisos> = new Map();
  permitsExpanded = false;

  constructor(private http: HttpClient) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['rolData'] && changes['rolData'].currentValue) {
      this.cargarDetalles(changes['rolData'].currentValue);
    }
  }

  cargarDetalles(data: Rol): void {

    this.cargando = true;
    this.mostrarAlertaError = false;

    this.rolDetalle = { ...data };

    const permisoRequest = {
      perm_Id: 0,
      acPa_Id: 0,
      role_Id: this.rolDetalle.role_Id,
      role_Descripcion: '',
      pant_Id: 0,
      pant_Descripcion: '',
      acci_Id: 0,
      acci_Descripcion: '',
      usua_Creacion: environment.usua_Id,
      perm_FechaCreacion: new Date().toISOString(),
      usua_Modificacion: environment.usua_Id,
      perm_FechaModificacion: new Date().toISOString()
    };

    this.http.post<Permiso[]>(`${environment.apiBaseUrl}/Buscar`, permisoRequest, {
      headers: { 'x-api-key': environment.apiKey }
    }).subscribe({
      next: (permisos) => {
        console.log('Permisos cargados:', permisos);
        this.organizarPermisosPorPantalla(permisos);
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar permisos:', error);
        this.mostrarAlertaError = true;
        this.mensajeError = 'Error al cargar los permisos del rol.';
        this.cargando = false;
      }
    });
  }

  organizarPermisosPorPantalla(permisos: Permiso[]): void {
    const mapa = new Map<number, PantallaPermisos>();

    permisos.forEach(p => {
      if (!p.pant_Id || !p.pant_Descripcion || !p.acci_Descripcion) {
        return;
      }
      if (!mapa.has(p.pant_Id)) {
        mapa.set(p.pant_Id, {
          descripcion: p.pant_Descripcion,
          acciones: [p.acci_Descripcion]
        });
      } else {
        const pantalla = mapa.get(p.pant_Id)!;
        if (!pantalla.acciones.includes(p.acci_Descripcion)) {
          pantalla.acciones.push(p.acci_Descripcion);
        }
      }
    });

    this.permisosPorPantalla = new Map([...mapa.entries()].sort((a, b) => a[0] - b[0]));
    console.log('Permisos organizados por pantalla:', this.permisosPorPantalla);
  }

  toggleExpand(): void {
    this.permitsExpanded = !this.permitsExpanded;
  }

  tienePermisos(): boolean {
    return this.permisosPorPantalla && this.permisosPorPantalla.size > 0;
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

  cerrar(): void {
    this.onClose.emit();
  }

  cerrarAlerta(): void {
    this.mostrarAlertaError = false;
    this.mensajeError = '';
  }
}