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
  {
    path: 'impuestos',
    loadChildren: () =>
      import('./impuestos/impuestos.module').then(m => m.ImpuestosModule)
  },
  

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GeneralRoutingModule {}
