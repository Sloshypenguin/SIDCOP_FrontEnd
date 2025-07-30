import { Component, Input, Output, EventEmitter } from '@angular/core';
import * as L from 'leaflet';
import { CommonModule } from '@angular/common';

interface PuntoVista {
  lat: number;
  lng: number;
  nombre?: string;
}

@Component({
  standalone: true,
  selector: 'app-mapa-selector',
  imports: [CommonModule],
  templateUrl: './mapa-selector.component.html',
  styleUrl: './mapa-selector.component.scss',
})
export class MapaSelectorComponent {
  @Input() coordenadasIniciales: { lat: number, lng: number } | null = null;
  @Input() puntosVista: PuntoVista[] = [];//listas para mandar varios puntos de vista, format { lat: number, lng: number, nombre?: string }

  @Output() coordenadasSeleccionadas = new EventEmitter<{ lat: number, lng: number }>();

  private map: L.Map | undefined;
  private marker: L.Marker | undefined;
  private mapaInicializado = false;

  inicializarMapa() {
    if (this.mapaInicializado) return;
    const redIcon = new L.Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    const coords = this.coordenadasIniciales ?? { lat: 15.4894, lng: -88.0260 };

    this.map = L.map('mapa').setView([coords.lat, coords.lng], 7);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'SIDCOP'
    }).addTo(this.map);

    if (this.puntosVista.length > 0) {
      this.puntosVista.forEach(punto => {
        const marcador = L.marker([punto.lat, punto.lng], { icon: redIcon }).addTo(this.map!);
        if (punto.nombre) {
          marcador.bindPopup(punto.nombre);
        }
      });
    } else {
      if (this.coordenadasIniciales) {
        this.marker = L.marker([coords.lat, coords.lng], { icon: redIcon }).addTo(this.map);
      }

      this.map.on('click', (e: L.LeafletMouseEvent) => {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;

        if (this.marker) {
          this.marker.setLatLng(e.latlng);
        } else {
          this.marker = L.marker(e.latlng, { icon: redIcon }).addTo(this.map!);
        }

        this.coordenadasSeleccionadas.emit({ lat, lng });
      });
    }

    const logoControl = L.Control.extend({
      options: { position: 'topright' },
      onAdd: function () {
        const container = L.DomUtil.create('div', 'leaflet-control-logo');
        container.innerHTML = `
          <img src="https://res.cloudinary.com/dbt7mxrwk/image/upload/v1753586701/iod3sxxvwyr1sgsyjql6.png"
               alt="SIDCOP Logo"
               style="width: 50px; height: auto; opacity: 0.9; border-radius: 8px;" />
        `;
        return container;
      }
    });

    this.map.addControl(new logoControl());

    setTimeout(() => {
      this.map!.invalidateSize();
    }, 100);

    this.mapaInicializado = true;
  }
}