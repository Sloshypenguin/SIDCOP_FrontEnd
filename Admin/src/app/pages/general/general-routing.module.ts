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
   {
    path: 'proveedores',
    loadChildren: () =>
      import('./proveedores/proveedores.module').then(m => m.ProveedoresModule)
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
  {
    path: 'cargos',
    loadChildren: () =>
      import('./cargos/cargos.module').then(m => m.CargosModule)
  },  

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GeneralRoutingModule {}
