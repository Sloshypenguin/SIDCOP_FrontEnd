import { Component, AfterViewInit, Output, EventEmitter } from '@angular/core';
import * as L from 'leaflet';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-mapa-selector',
  imports: [CommonModule],
  templateUrl: './mapa-selector.component.html',
  styleUrl: './mapa-selector.component.scss',
})
export class MapaSelectorComponent {
  private map: L.Map | undefined;
  private marker: L.Marker | undefined;

  @Output() coordenadasSeleccionadas = new EventEmitter<{ lat: number, lng: number }>();

  private mapaInicializado = false;
  inicializarMapa() {
    if (this.mapaInicializado) return;

    this.map = L.map('mapa').setView([14.6349, -90.5069], 6);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;

      if (this.marker) {
        this.marker.setLatLng(e.latlng);
      } else {
        this.marker = L.marker(e.latlng).addTo(this.map!);
      }

      this.coordenadasSeleccionadas.emit({ lat, lng });
    });

    this.mapaInicializado = true;

    setTimeout(() => {
      this.map!.invalidateSize();
    }, 100);
  }
}