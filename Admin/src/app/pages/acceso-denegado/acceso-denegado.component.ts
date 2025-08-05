import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-acceso-denegado',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="auth-page-wrapper py-2 position-relative d-flex align-items-center justify-content-center">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-6">
            <div class="card mb-0 border-0 shadow-none mb-0">
              <div class="card-body p-3 text-center">
                <div class="error-img text-center px-3 mb-3">
                  <img src="assets/images/auth/noaccess.png" class="img-fluid" alt="Acceso Denegado" />
                </div>
                <h2 class="text-danger mb-3">Acceso Denegado</h2>
                <h4 class="fs-xl mb-3">No tiene permisos para acceder a esta página</h4>
                <p class="text-muted mb-4">Verifique sus credenciales o contacte al administrador del sistema para solicitar acceso.</p>
                <div class="mt-4">
                  <a routerLink="/" class="btn btn-primary">
                    <span class="btn-text">Volver al inicio</span>
                    <span class="btn-icon"><i class="ri-home-line"></i></span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `
})
export class AccesoDenegadoComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}

  volver(): void {
    window.history.back();
  }

  irAlInicio(): void {
    this.router.navigate(['/']);
  }
}
