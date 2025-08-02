/// <reference types="@types/google.maps" />
import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  AfterViewInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from 'src/environments/environment';

interface PuntoVista {
  lat: number;
  lng: number;
  nombre?: string;
}

declare const google: any;

@Component({
  standalone: true,
  selector: 'app-mapa-selector',
  imports: [CommonModule],
  templateUrl: './mapa-selector.component.html',
  styleUrl: './mapa-selector.component.scss',
})
export class MapaSelectorComponent implements AfterViewInit {
  @Input() coordenadasIniciales: { lat: number, lng: number } | null = null;
  @Input() puntosVista: PuntoVista[] = [];
  @Output() coordenadasSeleccionadas = new EventEmitter<{ lat: number, lng: number }>();

  @ViewChild('mapaContainer', { static: true }) mapaContainer!: ElementRef;

  private map!: google.maps.Map;
  private marker: google.maps.Marker | null = null;
  private mapaInicializado = false;

  ngAfterViewInit() {
    this.cargarGoogleMapsScript().then(() => this.inicializarMapa());
  }

  private cargarGoogleMapsScript(): Promise<void> {
    return new Promise((resolve) => {
      if (window.google && window.google.maps) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      console.log('Usando API Key de Google Maps:', environment.googleMapsApiKey);
      script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsApiKey}`;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      document.body.appendChild(script);
    });
  }

  inicializarMapa() {
    if (this.mapaInicializado || !this.mapaContainer) return;

    const coords = this.coordenadasIniciales ?? { lat: 15.4894, lng: -88.0260 };

    this.map = new google.maps.Map(this.mapaContainer.nativeElement, {
      center: coords,
      zoom: 7,
      mapTypeId: 'roadmap',
      fullscreenControl: false,
    });

    const iconUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png';

    if (this.puntosVista.length > 0) {
      this.puntosVista.forEach(punto => {
        const marcador = new google.maps.Marker({
          position: { lat: punto.lat, lng: punto.lng },
          map: this.map,
          icon: iconUrl,
          title: punto.nombre || ''
        });

        if (punto.nombre) {
          const infoWindow = new google.maps.InfoWindow({ content: punto.nombre });
          marcador.addListener('click', () => infoWindow.open(this.map, marcador));
        }
      });
    } else {
      if (this.coordenadasIniciales) {
        this.marker = new google.maps.Marker({
          position: coords,
          map: this.map,
          icon: iconUrl,
        });
      }

      this.map.addListener('click', (e: google.maps.MapMouseEvent) => {
        if (!e.latLng) return;
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();

        if (this.marker) {
          this.marker.setPosition(e.latLng);
        } else {
          this.marker = new google.maps.Marker({
            position: e.latLng,
            map: this.map,
            icon: iconUrl,
          });
        }

        this.coordenadasSeleccionadas.emit({ lat, lng });
      });
    }

    // SIDCOP logo
    const logoDiv = document.createElement('div');
    logoDiv.innerHTML = `
      <img src="https://res.cloudinary.com/dbt7mxrwk/image/upload/v1753586701/iod3sxxvwyr1sgsyjql6.png"
           alt="SIDCOP Logo"
           style="width: 60px; height: auto; position: relative; top: 20px; right: 12px" />
    `;
    this.map.controls[google.maps.ControlPosition.TOP_RIGHT].push(logoDiv);

    this.mapaInicializado = true;
  }
}
