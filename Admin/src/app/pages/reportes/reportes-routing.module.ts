import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermisoGuard } from '../../core/guards/permiso.guard';

const routes: Routes = [
  {
    path: 'reporteproductos',
    loadChildren: () =>
      import('../reportes/reporteProductos/reporteProductos.module').then(m => m.ReporteProductosModule),
    canActivate: [PermisoGuard],
    data: { pantallaId: 61 } // ID 61: Reporte Productos
  }
  //  ,{
  //   path: 'traslados',
  //   loadChildren: () =>
  //     import('./traslados/traslado.module').then(m => m.TrasladoModule)
  // },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportesRoutingModule {}
