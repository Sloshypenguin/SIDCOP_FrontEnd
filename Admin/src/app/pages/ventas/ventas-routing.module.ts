import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'impuestos',
    loadChildren: () =>
      import('./impuestos/impuestos.module').then(m => m.ImpuestosModule)
  },
  {
    path: 'configuracion-factura',
    loadChildren: () =>
      import('./configuracionFactura/configuracionFactura.module').then(m => m.ConfiguracionFacturaModule)
  },
   {
    path: 'CAIs',
    loadChildren: () =>
      import('./CAIs/CAIs.module').then(m => m.CAIsModule)
  },
  {
    path: 'Vendedores',
    loadChildren: () =>
      import('./vendedor/vendedor.module').then(m => m.VendedoresModule)
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VentasRoutingModule {}
