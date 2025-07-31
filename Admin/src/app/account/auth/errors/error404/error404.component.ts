import { Component } from '@angular/core';

@Component({
  selector: 'app-error404',
  templateUrl: './error404.component.html',
  styleUrls: ['./error404.component.scss']
})
  
// Componente de error de acceso denegado
export class Error404Component {
  // Año actual para el pie de página si es necesario
  year: number = new Date().getFullYear();
}
