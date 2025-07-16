import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Canal } from 'src/app/Modelos/general/Canal.Model';
import { environment } from 'src/environments/environment';
import { CreateComponent } from '../create/create.component';
import { EditComponent } from '../edit/edit.component';
import { DetailsComponent } from '../details/details.component';

@Component({
  selector: 'app-list-canales',
  standalone: true,
  imports: [CommonModule, FormsModule, CreateComponent, EditComponent, DetailsComponent],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  canales: Canal[] = [];
  canalEditando: Canal | null = null;
  canalDetalle: Canal | null = null;

  showCreateForm = false;
  showEditForm = false;
  showDetailsForm = false;

  mostrarAlertaExito = false;
  mensajeExito = '';
  mostrarAlertaError = false;
  mensajeError = '';
  mostrarAlertaWarning = false;
  mensajeWarning = '';

  ngOnInit(): void {
    this.cargarCanales();
  }

  constructor(private http: HttpClient) {}

  cargarCanales(): void {
    this.http.get<Canal[]>(`${environment.apiBaseUrl}/Canal/Listar`, {
      headers: { 'x-api-key': environment.apiKey }
    }).subscribe({
      next: data => this.canales = data,
      error: () => {
        this.mostrarAlertaError = true;
        this.mensajeError = 'Error al cargar canales';
      }
    });
  }

  crear(): void {
    this.showCreateForm = true;
    this.showEditForm = false;
    this.showDetailsForm = false;
  }

  editar(canal: Canal): void {
    this.canalEditando = { ...canal };
    this.showEditForm = true;
    this.showCreateForm = false;
    this.showDetailsForm = false;
  }

  detalles(canal: Canal): void {
    this.canalDetalle = { ...canal };
    this.showDetailsForm = true;
    this.showCreateForm = false;
    this.showEditForm = false;
  }

  cerrarFormulario(): void {
    this.showCreateForm = false;
    this.cargarCanales();
  }

  cerrarFormularioEdicion(): void {
    this.showEditForm = false;
    this.canalEditando = null;
    this.cargarCanales();
  }

  cerrarFormularioDetalles(): void {
    this.showDetailsForm = false;
    this.canalDetalle = null;
  }

  guardarCanal(canal: Canal): void {
    this.mostrarAlertaExito = true;
    this.mensajeExito = 'Canal guardado exitosamente';
    this.cargarCanales();
    this.cerrarFormulario();
    setTimeout(() => this.mostrarAlertaExito = false, 3000);
  }

  actualizarCanal(canal: Canal): void {
    this.mostrarAlertaExito = true;
    this.mensajeExito = 'Canal actualizado exitosamente';
    this.cargarCanales();
    this.cerrarFormularioEdicion();
    setTimeout(() => this.mostrarAlertaExito = false, 3000);
  }

  cerrarAlerta(): void {
    this.mostrarAlertaExito = false;
    this.mensajeExito = '';
    this.mostrarAlertaError = false;
    this.mensajeError = '';
    this.mostrarAlertaWarning = false;
    this.mensajeWarning = '';
  }
}