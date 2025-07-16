import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./iniciarsesion.component').then(m => m.IniciarsesionComponent),
    data: {
      title: 'Iniciar Sesión'
    }
  }
];
