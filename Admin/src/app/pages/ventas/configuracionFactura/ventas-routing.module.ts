import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'impuestos',
    loadChildren: () =>
      import('../impuestos/impuestos.module').then(m => m.ImpuestosModule)
  },
  {
    path: 'configuracion-factura',
    loadChildren: () =>
      import('./configuracionFactura.module').then(m => m.ConfiguracionFacturaModule)
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VentasRoutingModule {}
