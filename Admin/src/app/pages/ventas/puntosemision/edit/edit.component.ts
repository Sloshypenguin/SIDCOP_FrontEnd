import {
  Component,
  Output,
  EventEmitter,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { PuntoEmision } from 'src/app/Modelos/ventas/PuntoEmision.Model';
import { environment } from 'src/environments/environment.prod';
import { getUserId } from 'src/app/core/utils/user-utils';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, NgSelectModule],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss',
})
export class EditComponent implements OnChanges {
  @Input() PEData: PuntoEmision | null = null;
  @Output() onCancel = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<PuntoEmision>();

  puntoEmision: PuntoEmision = {
    puEm_Id: 0,
    puEm_Codigo: '',
    puEm_Descripcion: '',
    usua_Creacion: 0,
    usua_Modificacion: 0,
    sucu_Id: 0,
    sucu_Descripcion: '',
    puEm_FechaCreacion: new Date(),
    puEm_FechaModificacion: new Date(),
    code_Status: 0,
    message_Status: '',
    usuarioCreacion: '',
    usuarioModificacion: '',
    secuencia: 0,
    estado: '',
  };

  PEOriginal = '';
  mostrarErrores = false;
  mostrarAlertaExito = false;
  mensajeExito = '';
  mostrarAlertaError = false;
  mensajeError = '';
  mostrarAlertaWarning = false;
  mensajeWarning = '';
  mostrarConfirmacionEditar = false;
  ordenarPorMunicipioYDepartamento(sucursales: any[]): any[] {
    return sucursales.sort((a, b) => {
      if (a.depa_Descripcion < b.depa_Descripcion) return -1;
      if (a.depa_Descripcion > b.depa_Descripcion) return 1;
      if (a.muni_Descripcion < b.muni_Descripcion) return -1;
      if (a.muni_Descripcion > b.muni_Descripcion) return 1;
      return 0;
    });
  }

  searchSucursal = (term: string, item: any) => {
    term = term.toLowerCase();
    return (
      item.sucu_Descripcion?.toLowerCase().includes(term) ||
      item.muni_Descripcion?.toLowerCase().includes(term) ||
      item.depa_Descripcion?.toLowerCase().includes(term)
    );
  };

  Sucursales: any[] = [];

  cargarSucursales() {
    this.http
      .get<any>(`${environment.apiBaseUrl}/Sucursales/Listar`, {
        headers: { 'x-api-key': environment.apiKey },
      })
      .subscribe(
        (data) =>
          (this.Sucursales = this.ordenarPorMunicipioYDepartamento(data))
      );
  }

  constructor(private http: HttpClient) {
    this.cargarSucursales();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['PEData'] && changes['PEData'].currentValue) {
      this.puntoEmision = { ...changes['PEData'].currentValue };
      this.PEOriginal = this.puntoEmision.puEm_Descripcion || '';
      this.mostrarErrores = false;
      this.cerrarAlerta();
    }
  }

  cancelar(): void {
    this.cerrarAlerta();
    this.onCancel.emit();
  }

  cerrarAlerta(): void {
    this.mostrarAlertaExito = false;
    this.mensajeExito = '';
    this.mostrarAlertaError = false;
    this.mensajeError = '';
    this.mostrarAlertaWarning = false;
    this.mensajeWarning = '';
  }

  validarEdicion(): void {
    this.mostrarErrores = true;

    if (
      !this.puntoEmision.puEm_Codigo.trim() ||
      !this.puntoEmision.puEm_Descripcion.trim() ||
      !this.puntoEmision.sucu_Id
    ) {
      this.mostrarAlertaWarning = true;
      this.mensajeWarning =
        'Por favor complete todos los campos requeridos antes de guardar.';
      setTimeout(() => this.cerrarAlerta(), 4000);
      return;
    }

    const cambios =
      this.puntoEmision.puEm_Codigo.trim() !==
        (this.PEData?.puEm_Codigo?.trim() ?? '') ||
      this.puntoEmision.puEm_Descripcion.trim() !==
        (this.PEData?.puEm_Descripcion?.trim() ?? '') ||
      this.puntoEmision.sucu_Id !== (this.PEData?.sucu_Id ?? 0);

    if (cambios) {
      this.mostrarConfirmacionEditar = true;
    } else {
      this.mostrarAlertaWarning = true;
      this.mensajeWarning = 'No se han detectado cambios.';
      setTimeout(() => this.cerrarAlerta(), 4000);
    }
  }

  cancelarEdicion(): void {
    this.mostrarConfirmacionEditar = false;
  }

  confirmarEdicion(): void {
    this.mostrarConfirmacionEditar = false;
    this.guardar();
  }

  private guardar(): void {
    this.mostrarErrores = true;

    if (this.puntoEmision.puEm_Descripcion.trim()) {
      const PEActualizar = {
        puEm_Id: this.puntoEmision.puEm_Id,
        puEm_Codigo: this.puntoEmision.puEm_Codigo.trim(),
        puEm_Descripcion: this.puntoEmision.puEm_Descripcion.trim(),
        usua_Creacion: this.puntoEmision.usua_Creacion,
        puEm_FechaCreacion: this.puntoEmision.puEm_FechaCreacion,
        usua_Modificacion: getUserId(),
        sucu_Id: this.puntoEmision.sucu_Id,
        sucu_Descripcion: '',
        puEm_FechaModificacion: new Date().toISOString(),
        usuarioCreacion: '',
        usuarioModificacion: '',
        estado: '',
        secuencia: 0,
      };

      this.http
        .put<any>(
          `${environment.apiBaseUrl}/PuntoEmision/Actualizar`,
          PEActualizar,
          {
            headers: {
              'X-Api-Key': environment.apiKey,
              'Content-Type': 'application/json',
              accept: '*/*',
            },
          }
        )
        .subscribe({
          next: (response) => {
            // this.mensajeExito = `Punto de Emision "${this.puntoEmision.puEm_Descripcion}" actualizado exitosamente`;
            this.mostrarErrores = false;
            this.onSave.emit(this.puntoEmision);
            this.cancelar();
          },
          error: (error) => {
            this.mostrarAlertaError = true;
            this.mensajeError = 'Error al guardar el punto de emision';
            this.mostrarAlertaExito = false;
            setTimeout(() => {
              this.mostrarAlertaError = false;
              this.mensajeError = '';
            }, 5000);
          },
        });
    } else {
      this.mostrarAlertaWarning = true;
      this.mensajeWarning =
        'Por favor complete todos los campos requeridos antes de guardar.';
      setTimeout(() => this.cerrarAlerta(), 4000);
    }
  }
}
