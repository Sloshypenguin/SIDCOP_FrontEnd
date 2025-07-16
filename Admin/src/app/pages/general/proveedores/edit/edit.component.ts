import { Component, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Proveedor } from 'src/app/Modelos/general/Proveedor.Model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class EditComponent implements OnChanges {
  @Input() proveedorData: Proveedor | null = null;
  @Output() onCancel = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<Proveedor>();

  proveedor: Proveedor = new Proveedor();

  mostrarErrores = false;
  mostrarAlertaExito = false;
  mensajeExito = '';
  mostrarAlertaError = false;
  mensajeError = '';
  mostrarAlertaWarning = false;
  mensajeWarning = '';

  Colonia: any[] = []; // Lista de colonias, se puede llenar con un servicio si es necesario

  constructor(private http: HttpClient) {this.cargarColonia();}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['proveedorData'] && changes['proveedorData'].currentValue) {
      this.proveedor = { ...changes['proveedorData'].currentValue };
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

   cargarColonia() {
      this.http.get<any>('https://localhost:7071/Colonia/Listar', {
        headers: { 'x-api-key': environment.apiKey }
      }).subscribe((data) => this.Colonia = data);
    };

  guardar(): void {
    this.mostrarErrores = true;
    if (this.proveedor.prov_NombreEmpresa.trim()) {
      const proveedorActualizar = {
        ...this.proveedor,
        usua_Modificacion: environment.usua_Id,
        prov_FechaModificacion: new Date().toISOString()
      };
      this.http.put<any>(`${environment.apiBaseUrl}/Proveedor/Actualizar`, proveedorActualizar, {
        headers: {
          'X-Api-Key': environment.apiKey,
          'Content-Type': 'application/json',
          'accept': '*/*'
        }
      }).subscribe({
        next: (response) => {
          this.mensajeExito = `Proveedor "${this.proveedor.prov_NombreEmpresa}" actualizado exitosamente`;
          this.mostrarAlertaExito = true;
          this.mostrarErrores = false;
          setTimeout(() => {
            this.mostrarAlertaExito = false;
            this.onSave.emit(this.proveedor);
            this.cancelar();
          }, 3000);
        },
        error: (error) => {
          this.mostrarAlertaError = true;
          this.mensajeError = 'Error al actualizar el proveedor. Por favor, intente nuevamente.';
          setTimeout(() => this.cerrarAlerta(), 5000);
        }
      });
    } else {
      this.mostrarAlertaWarning = true;
      this.mensajeWarning = 'Por favor complete todos los campos requeridos antes de guardar.';
      setTimeout(() => this.cerrarAlerta(), 4000);
    }
  }
}
