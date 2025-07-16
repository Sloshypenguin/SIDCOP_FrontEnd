import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Colonias } from 'src/app/Modelos/general/Colonias.Model';
import { Municipio } from 'src/app/Modelos/general/Municipios.Model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {
  @Output() onSave = new EventEmitter<Colonias>();
  @Output() onCancel = new EventEmitter<void>();

  nuevaColonia: Colonias = new Colonias();
  municipios: Municipio[] = [];
  cargando = false;
  mostrarAlerta = false;
  mensajeAlerta = '';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.cargarMunicipios();
  }

  cargarMunicipios(): void {
    this.cargando = true;
    this.http.get<Municipio[]>(`${environment.apiBaseUrl}/Municipios/Listar`, {
      headers: { 'X-Api-Key': environment.apiKey }
    }).subscribe(
      data => {
        this.municipios = data;
        this.cargando = false;
      },
      error => {
        console.error('Error al cargar municipios', error);
        this.cargando = false;
        this.mostrarAlerta = true;
        this.mensajeAlerta = 'Error al cargar la lista de municipios.';
      }
    );
  }

  guardar(): void {
    if (!this.nuevaColonia.colo_Descripcion || !this.nuevaColonia.muni_Codigo) {
      this.mostrarAlerta = true;
      this.mensajeAlerta = 'Por favor, complete todos los campos requeridos.';
      return;
    }
    this.onSave.emit(this.nuevaColonia);
  }

  cancelar(): void {
    this.onCancel.emit();
  }

  cerrarAlerta(): void {
    this.mostrarAlerta = false;
  }
}
