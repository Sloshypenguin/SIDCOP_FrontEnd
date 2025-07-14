import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'estadosciviles',
    loadChildren: () =>
      import('./estadosciviles/estadosciviles.module').then(m => m.EstadosCivilesModule)
  },
    {
    path: 'sucursales',
    loadChildren: () =>
      import('./sucursales/sucursales.module').then(m => m.SucursalesModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GeneralRoutingModule {}
