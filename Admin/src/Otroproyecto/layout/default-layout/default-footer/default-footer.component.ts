import { Component } from '@angular/core';
import { FooterComponent } from '@coreui/angular';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'app-default-footer',
    templateUrl: './default-footer.component.html',
    styleUrls: ['./default-footer.component.scss']
})
export class DefaultFooterComponent extends FooterComponent {
  constructor() {
    super();
    this.cargarNombreUsuario();
  }

  cargarNombreUsuario() {
    this.nombreUsuario = localStorage.getItem('usuarioNombre') || 'Usuario';
  }

  nombreUsuario: string = '';
}
