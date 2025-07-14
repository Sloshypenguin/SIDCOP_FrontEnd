import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'estadosciviles',
    loadChildren: () =>
      import('./estadosciviles/estadosciviles.module').then(m => m.EstadosCivilesModule)
  },
  {
    path: 'marcas',
    loadChildren: () =>
      import('./Marcas/marcas.module').then(m => m.Marcasmodule)
  },
  {
    path: 'marcasvehiculos',
    loadChildren: () =>
      import('./MarcasVehiculos/marcasvehiculos.module').then(m => m.MarcasVehiculosmodule)
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
