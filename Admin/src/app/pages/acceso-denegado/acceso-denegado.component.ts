import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-acceso-denegado',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container">
      <div class="row justify-content-center align-items-center" style="height: 80vh;">
        <div class="col-md-8">
          <div class="card">
            <div class="card-body text-center">
              <div class="mb-4">
                <i class="bx bx-block text-danger" style="font-size: 5rem;"></i>
              </div>
              <h3 class="card-title">Acceso Denegado</h3>
              <p class="card-text">
                No tienes permiso para acceder a esta página. Si crees que esto es un error, 
                contacta al administrador del sistema.
              </p>
              <div class="mt-4">
                <button class="btn btn-primary me-2" (click)="volver()">
                  <i class="bx bx-arrow-back me-1"></i> Volver
                </button>
                <button class="btn btn-secondary" (click)="irAlInicio()">
                  <i class="bx bx-home me-1"></i> Ir al Inicio
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
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
