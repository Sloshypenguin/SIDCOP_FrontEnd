import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Proveedor } from 'src/app/Modelos/general/Proveedor.Model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent {
  @Output() onCancel = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<Proveedor>();

  proveedor: Proveedor = new Proveedor();
  Colonia:any[] = []; 
  mostrarErrores = false;
  mostrarAlertaExito = false;
  mensajeExito = '';
  mostrarAlertaError = false;
  mensajeError = '';
  mostrarAlertaWarning = false;
  mensajeWarning = '';

  constructor(private http: HttpClient) {this.cargarColonia();}
  

  cancelar(): void {
    this.mostrarErrores = false;
    this.mostrarAlertaExito = false;
    this.mensajeExito = '';
    this.mostrarAlertaError = false;
    this.mensajeError = '';
    this.mostrarAlertaWarning = false;
    this.mensajeWarning = '';
    this.proveedor = new Proveedor();
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
    if (this.proveedor.prov_NombreEmpresa.trim() && this.proveedor.prov_Codigo.trim() &&
        this.proveedor.prov_NombreContacto.trim() && this.proveedor.prov_Telefono.trim() &&
        this.proveedor.colo_Id > 0 && this.proveedor.prov_DireccionExacta.trim() &&
        this.proveedor.prov_Correo.trim() && this.proveedor.prov_Observaciones.trim()) {
      this.mostrarAlertaWarning = false;
      this.mostrarAlertaError = false;
      const proveedorGuardar = {
        ...this.proveedor,
        usua_Creacion: environment.usua_Id,
        prov_FechaCreacion: new Date().toISOString(),
        usua_Modificacion: 0,
        prov_FechaModificacion: new Date().toISOString(),
        usuarioCreacion: "",
        usuarioModificacion: ""
      };
      this.http.post<any>(`${environment.apiBaseUrl}/Proveedor/Insertar`, proveedorGuardar, {
        headers: { 
          'X-Api-Key': environment.apiKey,
          'Content-Type': 'application/json',
          'accept': '*/*'
        }
      }).subscribe({
        next: (response) => {
          this.mensajeExito = `Proveedor "${this.proveedor.prov_NombreEmpresa}" guardado exitosamente`;
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
          this.mensajeError = 'Error al guardar el proveedor. Por favor, intente nuevamente.';
          setTimeout(() => {
            this.mostrarAlertaError = false;
            this.mensajeError = '';
          }, 5000);
        }
      });
    } else {
      this.mostrarAlertaWarning = true;
      this.mensajeWarning = 'Por favor complete todos los campos requeridos antes de guardar.';
      this.mostrarAlertaError = false;
      this.mostrarAlertaExito = false;
      setTimeout(() => {
        this.mostrarAlertaWarning = false;
        this.mensajeWarning = '';
      }, 4000);
    }
  }
}
