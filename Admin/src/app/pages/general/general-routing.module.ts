import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'estadosciviles',
    loadChildren: () =>
      import('./estadosciviles/estadosciviles.module').then(m => m.EstadosCivilesModule)
  },
    {
    path: 'departamentos',
    loadChildren: () =>
      import('./departamentos/departamentos.module').then(m => m.DepartamentosModule)
  },
    {
    path: 'municipios',
    loadChildren: () =>
      import('./municipios/municipios.module').then(m => m.MunicipiosModule)
  },
    {
    path: 'colonias',
    loadChildren: () =>
      import('./colonias/colonias.module').then(m => m.ColoniasModule)
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
