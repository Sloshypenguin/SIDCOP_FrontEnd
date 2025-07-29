import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  
  {
    path: 'categorias',
    loadChildren: () =>
      import('./categorias/categorias.module').then(m => m.CategoriasModule)
  },
  {
    path: 'subcategorias',
    loadChildren: () =>
      import('./subcategorias/subcategorias.module').then(m => m.SubcategoriasModule)
  },
  {
    path: 'productos',
    loadChildren: () =>
      import('./productos/productos.module').then(m => m.ProductosModule)
  },
  {
    path: 'descuentos',
    loadChildren: () =>
      import('./descuentos/descuento.module').then(m => m.DescuentosModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GeneralRoutingModule {}
