import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'bodegas',
    loadChildren: () =>
      import('./bodega/bodega.module').then(m => m.BodegaModule)
  },
   {
    path: 'traslados',
    loadChildren: () =>
      import('./traslados/traslado.module').then(m => m.TrasladoModule)
  },
  {
    path: 'recargas',
    loadChildren: () =>
      import('./recargas/recarga.module').then(m => m.RecargaModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LogisticaRoutingModule {}
