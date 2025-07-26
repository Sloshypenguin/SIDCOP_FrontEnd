import { Component, Input, Output, EventEmitter } from '@angular/core';
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
  @Input() coordenadasIniciales: { lat: number, lng: number } | null = null;
  @Output() coordenadasSeleccionadas = new EventEmitter<{ lat: number, lng: number }>();

  private map: L.Map | undefined;
  private marker: L.Marker | undefined;
  private mapaInicializado = false;

  inicializarMapa() {
    if (this.mapaInicializado) return;

    const coords = this.coordenadasIniciales ?? { lat: 15.4894, lng: -88.0260 };

    this.map = L.map('mapa').setView([coords.lat, coords.lng], 7);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; SIDCOP'
    }).addTo(this.map);

    if (this.coordenadasIniciales) {
      this.marker = L.marker([coords.lat, coords.lng]).addTo(this.map);
    }

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
    setTimeout(() => {
      this.map!.invalidateSize();
    }, 100);

    this.mapaInicializado = true;
  }
}
