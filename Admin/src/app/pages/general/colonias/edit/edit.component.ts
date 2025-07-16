import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Colonias } from 'src/app/Modelos/general/Colonias.Model';
import { Municipio } from 'src/app/Modelos/general/Municipios.Model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit, OnChanges {
  @Input() coloniaData: Colonias | null = null;
  @Output() onSave = new EventEmitter<Colonias>();
  @Output() onCancel = new EventEmitter<void>();

  coloniaEditada: Colonias = new Colonias();
  municipios: Municipio[] = [];
  cargando = false;
  mostrarAlerta = false;
  mensajeAlerta = '';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.cargarMunicipios();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['coloniaData'] && this.coloniaData) {
      this.coloniaEditada = { ...this.coloniaData };
    }
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
    if (!this.coloniaEditada.colo_Descripcion || !this.coloniaEditada.muni_Codigo) {
      this.mostrarAlerta = true;
      this.mensajeAlerta = 'Por favor, complete todos los campos requeridos.';
      return;
    }
    this.onSave.emit(this.coloniaEditada);
  }

  cancelar(): void {
    this.onCancel.emit();
  }

  cerrarAlerta(): void {
    this.mostrarAlerta = false;
  }
}
