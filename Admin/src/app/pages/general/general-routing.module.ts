import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'estadosciviles',
    loadChildren: () =>
      import('./estadosciviles/estadosciviles.module').then(m => m.EstadosCivilesModule)
  },
  {
    path: 'empleados',
    loadChildren: () =>
      import('./empleados/empleados.module').then(m => m.EmpleadosModule)
  },
    {
    path: 'sucursales',
    loadChildren: () =>
      import('./sucursales/sucursales.module').then(m => m.SucursalesModule)
  },
    {
    path: 'modelos',
    loadChildren: () =>
      import('./modelos/modelos.module').then(m => m.ModelosModule)
  },
  {
    path: 'canales',
    loadChildren: () =>
      import('./canales/canales.module').then(m => m.CanalesModule)
  },
  

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GeneralRoutingModule {}
